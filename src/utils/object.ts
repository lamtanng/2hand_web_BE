export const deleteEmptyObjectFields = (obj: any) =>
  Object.keys(obj).forEach((key) => !obj[key] && delete obj[key]);
