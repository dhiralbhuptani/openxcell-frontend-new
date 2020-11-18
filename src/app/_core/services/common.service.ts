import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  validateRequiredMessage(message: string) {
    return message + ' is required.';
  }

}
