/**
 * @description - An utility type checking object that meets the code readability
 * requirements and provides an extensive use of type guards.
 * @example
 * ```typescript
 * const empty = !array.length; // Avoid using a lot of built in operators explicitly
 * const empty = is.falsy(array.length); // Much better
 *
 * if (!map.isPresent() && !fieldIsArrayOperator && !propertyPath.startsWith('$')) {
 *   // do something...
 * }
 *
 * const absent = is.falsy(map.isPresent());
 * const fieldIsNotArrayOperator = is.faly(fieldIsArrayOperator);
 * const noDollarAtTheBeginning = is.falsy(propertyPath.startsWith('$'));
 *
 * if (absent && fieldIsNotArrayOperator && noDollarAtTheBeginning) {
 *   // do something...
 * }
 * ```
 */
export const is = {
  function: (value: unknown): boolean => {
    if (is.nullOrUndefined(value)) {
      return false;
    }

    const res = ["Function", "AsyncFunction"].indexOf((value as Record<string, unknown>).constructor?.name ?? "") >= 0;
    return res;
  },
  null: (value: unknown): value is null => value === null,
  undefined: (value: unknown): value is undefined => typeof value === "undefined" || value === undefined,
  nullOrUndefined: (value: unknown): value is null | undefined => value == null,
  truthy: (value: unknown): value is true => !!value,
  falsy: (value: unknown): value is false => !value,
  string: (value: unknown): value is string => typeof value === "string",
  number: (value: unknown): value is number => typeof value === "number",
  boolean: (value: unknown): value is boolean => typeof value === "boolean",
  object: (value: unknown): value is Record<string, unknown> => typeof value === "object",
  array: <T>(value: unknown): value is T[] => Array.isArray(value),
  empty: (value: unknown): boolean => {
    if (is.nullOrUndefined(value)) {
      return true;
    }

    if (Array.isArray(value) || is.string(value)) {
      return value.length === 0;
    }

    return is.object(value) && Object.keys(value).length === 0;
  },
};
