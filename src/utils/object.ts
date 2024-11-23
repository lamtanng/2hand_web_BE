export const deleteEmptyObjectFields = (obj: any) =>
  Object.keys(obj).forEach((key) => {
    console.log(!obj[key], key);
    return !obj[key] && delete obj[key];
  });
export const parseJson = (json: string) => JSON.parse((json || null) as string);
