export const deleteEmptyObjectFields = (obj: any) =>
  Object.keys(obj).forEach((key) => {
    return !obj[key] && delete obj[key];
  });

export const parseJson = (json: string) => {
  console.log(JSON.parse((json || null) as string));
  return JSON.parse((json || null) as string);
};

export function parseJsonObject<TObject>(jsonObject: TObject): Partial<TObject> {
  const newObj: Partial<TObject> = {};
  for (const key in jsonObject) {
    // console.log(key, parseJson('670cf6f99409a2763107c4e8'));
    newObj[key] = parseJson(jsonObject[key] as string);
  }
  return newObj;
}
