import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class EncryptDecryptService {
  YEK_RCES = 'YourSecretKeyForMiBulevarEncryption&Decryption';

  encrypt(value: string): string {
    const encrypted = CryptoJS.AES.encrypt(value.toString(), this.YEK_RCES.trim());
    return encrypted.toString();
  }

  decrypt(textToDecrypt: string) {
    const decrypted = CryptoJS.AES.decrypt(textToDecrypt, this.YEK_RCES.trim());
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
