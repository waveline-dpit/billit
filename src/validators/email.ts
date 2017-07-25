import { FormControl } from '@angular/forms';

export class EmailValidator {

  static isValid(control: FormControl): any {

    function validEmail(mail) {
      let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if(mail){
        return mail.match(mailformat);
      }
      else {
        return false;
      }
    }
    if (!validEmail(control.value)) {
      return {
        "Invalid emailll address": true
      };
    }
    return null;
  }

}
