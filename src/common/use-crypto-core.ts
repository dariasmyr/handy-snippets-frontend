import { useCallback } from "react";
import CryptoJS from "crypto-js";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import superjson from "superjson";

export type Key = string;
export type ObjectForEncryption = Record<string, unknown>;
export type ObjectForDecryption = string;

interface ICryptoCore {
  encrypt: (object: ObjectForEncryption, key: Key) => ObjectForDecryption;
  decrypt: (object: ObjectForDecryption, key: Key) => ObjectForEncryption;
  generateKey: () => Key;
  encryptKey: (key: Key, password: string) => string;
  decryptKey: (key: string, password: string) => Key;
}

export function useCryptoCore(): ICryptoCore {
  const encrypt = useCallback(
    (object: ObjectForEncryption, key: Key): ObjectForDecryption => {
      const stringifiedObject = superjson.stringify(object);
      return AES.encrypt(stringifiedObject, key).toString();
    },
    [],
  );

  const decrypt = useCallback(
    (encryptedData: ObjectForDecryption, key: Key): ObjectForEncryption => {
      const bytes = AES.decrypt(encryptedData, key);
      const decryptedData = bytes.toString(Utf8);
      return superjson.parse(decryptedData);
    },
    [],
  );

  const generateKey = useCallback((): Key => {
    // Generate a 256-bit (32 bytes) random key
    const randomKey = CryptoJS.lib.WordArray.random(32);
    return randomKey.toString(); // Convert the WordArray to a hex string
  }, []);

  const encryptKey = useCallback((key: Key, password: string): string => {
    return AES.encrypt(key, password).toString();
  }, []);

  const decryptKey = useCallback(
    (encryptedKey: string, password: string): Key => {
      const bytes = AES.decrypt(encryptedKey, password);
      return bytes.toString(Utf8);
    },
    [],
  );

  return { encrypt, decrypt, generateKey, encryptKey, decryptKey };
}
