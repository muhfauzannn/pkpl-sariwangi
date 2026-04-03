import { db } from "@/db";
import { member } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the member to verify email matches
    const memberRecords = await db
      .select()
      .from(member)
      .where(eq(member.id, id))
      .limit(1);

    if (memberRecords.length === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const memberData = memberRecords[0];

    // Only allow user to edit their own biodata
    if (memberData.email !== session.user.email) {
      return NextResponse.json(
        { error: "Forbidden: You can only edit your own biodata" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { name, role, bio } = body;

    // Validate input
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required and must be a non-empty string" },
        { status: 400 },
      );
    }

    if (!role || typeof role !== "string" || role.trim() === "") {
      return NextResponse.json(
        { error: "Role is required and must be a non-empty string" },
        { status: 400 },
      );
    }

    if (bio && typeof bio !== "string") {
      return NextResponse.json(
        { error: "Bio must be a string" },
        { status: 400 },
      );
    }

    // Update member data (except image, which always comes from Google OAuth)
    const updated = await db
      .update(member)
      .set({
        name: name.trim(),
        role: role.trim(),
        bio: bio?.trim() || null,
        updatedAt: new Date(),
      })
      .where(eq(member.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 },
    );
  }
}
