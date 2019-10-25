import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private iterationCount = 1000;
  private keySize = (128/32);

  constructor() { }

  generateKey(salt, passPhrase) {
    var key = CryptoJS.PBKDF2(
      passPhrase,
      CryptoJS.enc.Hex.parse(salt),
      { keySize: this.keySize, iterations: this.iterationCount });
    return key;
  }

  encrypt(salt, iv, passPhrase, plainText) {
    var key = this.generateKey(salt, passPhrase);
    var encrypted = CryptoJS.AES.encrypt(
      plainText,
      key,
      { iv: CryptoJS.enc.Hex.parse(iv) });
    return this.encodeBase64(CryptoJS.enc.Base64.stringify(encrypted.ciphertext));
  }

  // Encode String to Base64
encodeBase64(value) {
  return CryptoJS.enc.Base64.parse(value.toString());
}

// Decode String from Base64 Enconding
decodeBase64(encodedValue) {
  return CryptoJS.enc.Base64.stringify(encodedValue);
}
}
