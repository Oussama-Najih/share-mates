import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable empty interface warnings
      "@typescript-eslint/no-empty-interface": "off",

      // Disable empty object type warnings (the one you're encountering)
      "@typescript-eslint/no-empty-object-type": "off",

      // Disable 'any' warnings
      "@typescript-eslint/no-explicit-any": "off",

      // Disable unused variables
      "@typescript-eslint/no-unused-vars": "off",

      // Disable unescaped entities in JSX
      "react/no-unescaped-entities": "off",

      // Disable deprecation warning for punycode (from Node.js)
      "node/no-deprecated-api": "off",

      // Optional: Disable exhaustively listing dependencies in useEffect
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;
