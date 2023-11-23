export default function CustomSet(...args) {
  const set = new Set(...args);
  set.filter = filter;
  return set;
}

function filter(callbackFn, thisArg) {
  const set = new CustomSet();
  for (const element of this) {
    if (callbackFn.call(thisArg, element, this)) {
      set.add(element);
    }
  }
  return set;
}
