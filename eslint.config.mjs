/**
 * ESLint configuration for the Intervia project
 * 
 * This configuration sets up linting rules for the project using the new flat config format.
 * It extends recommended configurations from Next.js with additional custom rules.
 */

// Import required modules for path resolution
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Get the current file and directory paths for proper resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize FlatCompat for backward compatibility with eslintrc style configs
const compat = new FlatCompat({
  baseDirectory: __dirname, // Base directory for resolving relative paths
});

// Define the ESLint configuration array
const eslintConfig = [
  // Extend Next.js recommended configurations:
  // - next/core-web-vitals: Recommended rules for Next.js projects
  // - next/typescript: TypeScript specific rules for Next.js
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
