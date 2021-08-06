export interface Encryption {


  encrypt(clearText: string, config?: any): Promise<string>

  decrypt(encryptedText: string, config?: any): Promise<string>


}

export const Encryption = Symbol('Encryption');
