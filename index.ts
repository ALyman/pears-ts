import * as parsers from "./parsers";

export import parsers = parsers;

export { IInput, createBufferInput, createArrayInput, createStringInput, createConcatInput, createNullInput } from "./inputs";
export { isSuccessful, isFailure } from "./parse-result";