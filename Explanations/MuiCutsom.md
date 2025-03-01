To customize the **outline color** and **text color** of the `TextField` component from MUI, you need to use the `sx` prop or the `InputProps` and `InputLabelProps` properties.

---

### **✅ Updated Code:**

```tsx
<TextField
  label="Full Name"
  variant="outlined"
  fullWidth
  {...register("fullName", { required: "Name is required" })}
  error={!!errors.fullName}
  helperText={errors.fullName?.message as string}
  sx={{
    "& label": { color: "blue" }, // Label text color
    "& label.Mui-focused": { color: "green" }, // Label color when focused
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "blue" }, // Default outline color
      "&:hover fieldset": { borderColor: "green" }, // Outline color on hover
      "&.Mui-focused fieldset": { borderColor: "red" }, // Outline color when focused
    },
    "& .MuiInputBase-input": { color: "purple" }, // Input text color
    "& .MuiFormHelperText-root": { color: "red" }, // Helper text color
  }}
/>
```

---

### **🎨 Explanation of Customizations:**

- **Label (`& label`)**: Default color is **blue**.
- **Focused Label (`& label.Mui-focused`)**: Changes to **green** when the input is focused.
- **Outline (`& .MuiOutlinedInput-root`)**:
  - Default: **Blue**
  - Hover: **Green**
  - Focused: **Red**
- **Text Color (`& .MuiInputBase-input`)**: **Purple**
- **Helper Text (`& .MuiFormHelperText-root`)**: **Red**

---

This will allow you to fully customize the appearance of the `TextField`. Let me know if you need more adjustments! 🚀🎨
