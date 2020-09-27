/**
 * 删除对象中所有的空值
 * @param obj
 */
const omitEmpty = <T>(obj: T): T => {
  const newObj = {} as T;
  Object.keys(obj || {}).forEach((key) => {
    if (obj[key] !== undefined || obj[key] !== null) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

export default omitEmpty;
