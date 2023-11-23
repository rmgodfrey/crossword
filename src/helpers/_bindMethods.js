// From a Stack Overflow answer by Scott Sauyet: https://stackoverflow.com/a/54449011

function allKeys(obj) {
  const res = new Set();
  let currObj = obj;
  do {
    Object.getOwnPropertyNames(currObj).forEach(name => res.add(name));
    Object.getOwnPropertySymbols(currObj).forEach(symbol => res.add(symbol));
  } while ((currObj = Object.getPrototypeOf(currObj)));
  return [...res];
}

export default function bindMethods(obj) {
  return allKeys(obj).reduce((acc, key) => ({...acc, [key]: (
    typeof obj[key] === 'function' ? obj[key].bind(obj) : obj[key]
  )}));
}
