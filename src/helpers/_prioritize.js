/**
 * Used as a comparison function with Array.prototype.sort. Items for which
 * `testFn(item)` is truthy are sorted first (i.e. are given priority); items
 * for which `testFn(item)` is falsy are sorted last.
 */
export default function prioritize(testFn) {
  return (a, b) => {
    if (testFn(a) && !testFn(b)) return -1;
    if (!testFn(a) && testFn(b)) return 1;
    return 0;
  }
}
