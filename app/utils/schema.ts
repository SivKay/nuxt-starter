import * as z from "zod";

export function requiredString(requiredMessage: string) {
  return z.string({ error: requiredMessage }).trim().min(1, requiredMessage);
}

export function emailString(requiredMessage: string, invalidMessage: string) {
  return requiredString(requiredMessage).refine(
    (value) => value.length === 0 || z.email().safeParse(value).success,
    invalidMessage,
  );
}
