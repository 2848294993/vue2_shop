function deepCopy(newObj, oldObj) {
  for (let index in oldObj) {
    let item = oldObj[index];
    if (item instanceof Array) {
      newObj[index] = [];
      deepCopy(newObj[index], item);
    }
    else if (item instanceof Object) {
      newObj[index] = {};
      deepCopy(newObj[index], item);
    }
    else {
      newObj[index] = item;
    }
  }
}

export default deepCopy;