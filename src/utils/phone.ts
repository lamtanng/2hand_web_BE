import { parsePhoneNumber } from 'libphonenumber-js';

export const formatPhoneNumber = (phoneNumber: string) => {
  const removedPrefix = parsePhoneNumber(phoneNumber, 'VI')?.formatNational();
  return removedPrefix.replace(/\s+/g, '');
};
