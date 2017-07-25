import { FormControl } from '@angular/forms';

export class EmailValidator {

  static isValid(control: FormControl): any {

    function validEmail(mail) {
      let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return mail.match(mailformat);
    }

    if (!validEmail(control.value)) {
      return {
        "Invalid email address": true
      };
    }

    return null;
  }

}
