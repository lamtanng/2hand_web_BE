export const deleteEmptyObjectFields = (obj: any) =>
  Object.keys(obj).forEach((key) => {
    return !obj[key] && delete obj[key];
  });

export const parseJson = (json: string) => {
  return JSON.parse((json || null) as string);
};

export function parseJsonObject<TObject>(jsonObject: TObject): Partial<TObject> {
  const newObj: Partial<TObject> = {};
  for (const key in jsonObject) {
    newObj[key] = parseJson(jsonObject[key] as string);
  }
  return newObj;
}
