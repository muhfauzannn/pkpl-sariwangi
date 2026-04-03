export type ThemeActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialThemeActionState: ThemeActionState = {
  status: "idle",
  message: "",
};
