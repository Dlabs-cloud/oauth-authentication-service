import { Injectable } from '@nestjs/common';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

@Injectable()
export class PhoneNumberService {
  private _phoneNumberUtil: PhoneNumberUtil;

  constructor() {
    this._phoneNumberUtil = PhoneNumberUtil.getInstance();

  }

  formatPhoneNumber(phoneNumber: string): string {
    phoneNumber = PhoneNumberService.format(phoneNumber);
    if (!phoneNumber) {
      return null;
    }
    phoneNumber = phoneNumber.trim().replace(' +', '');
    try {
      let number = this._phoneNumberUtil.parse(phoneNumber);
      return this._phoneNumberUtil.format(number, PhoneNumberFormat.E164);
    } catch (e) {
      return null;
    }

  }

  isValid(phoneNumber: string): boolean {
    let number = PhoneNumberService.format(phoneNumber);
    if (!number) {
      return false;
    }

    try {
      this._phoneNumberUtil.parse(phoneNumber);
      return true;
    } catch (e) {
      return false;
    }
  }

  private static format(number) {
    if (!number) {
      return null;
    }
    if (number && !number.trim().length) {
      return null;
    }
  }

}