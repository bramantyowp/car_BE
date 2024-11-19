import globals from "globals";
import pluginJs from "@eslint/js";
import ServerError from "./src/helpers/errors/server";
import NotFoundError from "./src/helpers/errors/notFound";
import ValidationError from "./src/helpers/errors/validation";


export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: { ...globals.node, ServerError, NotFoundError, ValidationError }}},
  pluginJs.configs.recommended,
];