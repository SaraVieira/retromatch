import { customAlphabet } from "nanoid";
import { alphanumeric } from "nanoid-dictionary";

export * from "./create-window";

export const createID = () => {
  const lowercaseRandomString = customAlphabet(alphanumeric, 10);

  return `a${lowercaseRandomString()}`;
};
