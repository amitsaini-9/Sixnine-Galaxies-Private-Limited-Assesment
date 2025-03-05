import crypto from 'crypto-js';

export const generateServerSeed = () => {
  return crypto.lib.WordArray.random(32).toString();
};

export const generateRoll = (serverSeed: string, clientSeed: string, nonce: number): number => {
  const combinedSeed = `${serverSeed}:${clientSeed}:${nonce}`;
  const hash = crypto.HmacSHA256(combinedSeed, serverSeed).toString();

  // Use first 4 bytes of hash to generate number between 0-100
  const roll = parseInt(hash.slice(0, 8), 16) % 10000 / 100;
  return roll;
};