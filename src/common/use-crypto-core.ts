import { useCallback } from "react";
import CryptoJS from "crypto-js";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import superjson from "superjson";

export type Key = string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjectForEncryption = Record<string, any>;
export type ObjectForDecryption = string;

interface ICryptoCore {
  encrypt: (object: ObjectForEncryption, key: Key) => ObjectForDecryption;
  decrypt: (object: ObjectForDecryption, key: Key) => ObjectForEncryption;
  generateKey: () => Key;
  generatePassword: (passwordLength: number) => string;
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

  const generatePassword = useCallback((passwordLength: number): string => {
    // Initialize an empty string for the password
    let password = "";
    // Loop until the password reaches the desired length
    while (password.length < passwordLength) {
      // Generate a random byte
      const randomByte = CryptoJS.lib.WordArray.random(1);
      // Convert the byte to a base64 string and remove any non-alphanumeric characters
      const base64String = randomByte
        .toString(CryptoJS.enc.Base64)
        .replaceAll(/[^\dA-Za-z]/g, "");
      // Append the cleaned string to the password, ensuring it doesn't exceed the desired length
      password += base64String.slice(0, passwordLength - password.length);
    }
    return password;
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

  return {
    encrypt,
    decrypt,
    generateKey,
    generatePassword,
    encryptKey,
    decryptKey,
  };
}
