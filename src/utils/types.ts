/**
 * @description - An utility function that returns value with the overloaded type.
 * This function is very convenient when you're working with some external library, that
 * unfortunately doesn't have some correct typings.
 * @example
 * ```typescript
 * interface Foo {
 *   bar: string;
 * }
 *
 * const object: Foo = {}; // this will throw
 * const object = getAs<Foo>({}); // this won't
 * ```
 */
export function getAs<T>(value: unknown): T {
  return value as T;
}
