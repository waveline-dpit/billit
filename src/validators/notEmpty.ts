import { FormControl } from '@angular/forms';

export class NotEmptyValidator {

  static isValid(control: FormControl): any {

    function check(x) {

        if(control.value){
          return true;
        }
        else
        {
          return false;
        }

    }
    if (!check(control.value)) {
      return {
        "Invalid input": true
      };
    }
    return null;
  }

}
