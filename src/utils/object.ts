export const deleteEmptyObjectFields = (obj: any) =>
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === null || obj[key] === '') delete obj[key];
  });

export const parseJson = (json: string) => {
  const jsonStr = json || null;
  if (!jsonStr) return jsonStr;
  return JSON.parse(jsonStr as string);
};

export function parseJsonObject<TObject>(jsonObject: TObject): Partial<TObject> {
  const newObj: Partial<TObject> = {};
  for (const key in jsonObject) {
    newObj[key] = parseJson(jsonObject[key] as string);
  }
  return newObj;
}
