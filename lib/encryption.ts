import { AES, enc } from 'crypto-js';

export const encryptText = (text: string, key: string) => {
  return AES.encrypt(text, key).toString();
};

export const decryptText = (encryptedText: string, key: string) => {
  try {
    const bytes = AES.decrypt(encryptedText, key);
    return bytes.toString(enc.Utf8);
  } catch (error) {
    return '';
  }
};

export const generateDailyPassword = () => {
  const days = [
    'domingo',
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
  ];
  const date = new Date();
  const day = days[date.getUTCDay()]; // Usar UTC para el día de la semana
  const dayOfMonth = date.getUTCDate(); // Usar UTC para el día del mes
  const year = date.getUTCFullYear(); // Usar UTC para el año
  return `${day}${dayOfMonth}${year}`;
};
