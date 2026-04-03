"use client";

import { useActionState, useMemo, useState } from "react";
import { PaletteIcon, SaveIcon, TypeIcon } from "lucide-react";

import { updateThemeAction } from "@/app/editor/actions";
import { initialThemeActionState } from "@/components/editor/theme-action-state";
import {
  colorPresets,
  defaultSiteTheme,
  fontPresets,
  type ColorPresetId,
  type FontPresetId,
} from "@/lib/theme";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ThemeEditorProps = {
  initialColorPreset?: string | null;
  initialFontPreset?: string | null;
};

export function ThemeEditor({
  initialColorPreset,
  initialFontPreset,
}: ThemeEditorProps) {
  const [colorPreset, setColorPreset] = useState<ColorPresetId>(
    (initialColorPreset as ColorPresetId) ?? defaultSiteTheme.colorPreset,
  );
  const [fontPreset, setFontPreset] = useState<FontPresetId>(
    (initialFontPreset as FontPresetId) ?? defaultSiteTheme.fontPreset,
  );
  const [state, formAction, isPending] = useActionState(
    updateThemeAction,
    initialThemeActionState,
  );

  const currentColor = useMemo(
    () => colorPresets.find((preset) => preset.id === colorPreset),
    [colorPreset],
  );

  const currentFont = useMemo(
    () => fontPresets.find((preset) => preset.id === fontPreset),
    [fontPreset],
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input name="colorPreset" type="hidden" value={colorPreset} />
      <input name="fontPreset" type="hidden" value={fontPreset} />

      <Card className="rounded-[28px] border border-border bg-card">
        <CardHeader>
          <CardTitle>Style editor</CardTitle>
          <CardDescription>Atur warna dan font.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Tabs className="w-full" defaultValue="warna">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="warna">
                <PaletteIcon data-icon="inline-start" />
                Warna
              </TabsTrigger>
              <TabsTrigger value="font">
                <TypeIcon data-icon="inline-start" />
                Font
              </TabsTrigger>
            </TabsList>

            <TabsContent className="pt-4" value="warna">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="color-preset">Preset warna</FieldLabel>
                  <FieldContent>
                    <ToggleGroup
                      aria-label="Preset warna"
                      className="w-full flex flex-wrap gap-2"
                      orientation="horizontal"
                      value={[colorPreset]}
                      onValueChange={(values) => {
                        const nextValue = values[0] as
                          | ColorPresetId
                          | undefined;

                        if (nextValue) {
                          setColorPreset(nextValue);
                        }
                      }}
                    >
                      {colorPresets.map((preset) => (
                        <ToggleGroupItem
                          className="h-auto justify-start gap-4 text-left"
                          key={preset.id}
                          value={preset.id}
                        >
                          <div className="flex justify-center gap-3">
                            <div className="flex shrink-0 gap-2 rounded-lg border overflow-hidden">
                              <div
                                className="w-8 h-8"
                                style={{
                                  backgroundColor: preset.primary,
                                }}
                                title={preset.primary}
                              />
                              <div
                                className="w-8 h-8"
                                style={{
                                  backgroundColor: preset.secondary,
                                }}
                                title={preset.secondary}
                              />
                            </div>
                          </div>
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </TabsContent>

            <TabsContent className="pt-4" value="font">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="font-preset">Font utama</FieldLabel>
                  <FieldContent>
                    <Select
                      name="font-preset-preview"
                      value={fontPreset}
                      onValueChange={(value) =>
                        setFontPreset(
                          (value as FontPresetId | null) ?? fontPreset,
                        )
                      }
                    >
                      <SelectTrigger className="w-full" id="font-preset">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {fontPresets.map((preset) => (
                            <SelectItem key={preset.id} value={preset.id}>
                              <div className="flex flex-col">
                                <span>{preset.label}</span>
                                <span className="text-muted-foreground">
                                  {preset.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Button disabled={isPending} type="submit">
            <SaveIcon data-icon="inline-start" />
            {isPending ? "Menyimpan..." : "Simpan perubahan"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
