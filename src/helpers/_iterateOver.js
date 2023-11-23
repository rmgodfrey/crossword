export default function iterateOver(iterable) {
  return function* () {
    for (const element of iterable) yield element;
  }
}
