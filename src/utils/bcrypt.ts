import bcrypt from 'bcrypt';

export const hashValue = async (value: string, saltRound?: number) =>
  await bcrypt.hash(value, saltRound || 10);

export const compareHash = async (value: string, hashValue: string) =>
  await bcrypt.compare(value, hashValue);

