import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import reactHooksAddons from "eslint-plugin-react-hooks-addons";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...fixupConfigRules(compat.extends(
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:prettier/recommended",
    "prettier",
)), {
    plugins: {
        react: fixupPluginRules(react),
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        prettier: fixupPluginRules(prettier),
        "react-hooks-addons": fixupPluginRules(reactHooksAddons),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: 2023,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
            project: "./tsconfig.json",
        },
    },

    rules: {
        "require-jsdoc": "off",
        "max-len": ["error", { "code": 120, "ignoreUrls": true, "ignoreComments": true }],
        "no-invalid-this": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "react/display-name": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react-hooks-addons/no-unused-deps": "warn",
        "react-hooks-addons/no-unnecessary-deps": "warn"
    },

    files: ["**/*.tsx", "**/*.jsx"],
    rules: {
        "max-len": ["error", { "code": 140, "ignoreUrls": true, "ignoreComments": true }],
    },
}];