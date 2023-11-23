import Set from './_CustomSet';

export default function createInstances(klass, rawObjects, thisArg) {
  const instances = new Set();
  for (const rawObject of rawObjects) {
    instances.add(new klass(rawObject, thisArg));
  }
  return instances;
}
