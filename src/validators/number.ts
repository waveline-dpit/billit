import { FormControl } from '@angular/forms';

export class NumberValidator {

  static isValid(control: FormControl): any {

    function validNumber(x) {
      if(x > 999999 || (x.toString().split('.')[1] || []).length > 2 || x < 0)
      {
        return false;
      }
      else
      {
        return true;
      }
    }
    if (!validNumber(control.value)) {
      return {
        "Invalid number": true
      };
    }
    return null;
  }

}
