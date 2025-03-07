export const sx = {
  "& label": { color: "oklch(var(--label-color))" },
  "& label.Mui-focused": {
    color: "oklch(var(--label-focus-color))",
  },
  "& .MuiInputBase-input": {
    color: "oklch(var(--input-text-color))",
  }, // Input text color
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "oklch(var(--border-default))" }, // Default outline color
    "&:hover fieldset": {
      borderColor: "oklch(var(--hover-field))",
    }, // Hover border color
    "&.Mui-focused fieldset": {
      borderColor: "oklch(var(--border-focus))",
    }, // Focused border color
  },
};

export const sx2 = (mode: string) => ({
  "& .MuiInputBase-input": {
    color: `${mode === "dark" ? "white" : "black"}`,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "lightblue" }, // Default outline color
    "&:hover fieldset": {
      borderColor: "rgb(15, 211, 252)",
    }, // Hover border color
    "&.Mui-focused fieldset": {
      borderColor: "rgb(14, 165, 233)",
    }, // Focused border color
  },
});
