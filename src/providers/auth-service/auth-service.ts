import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthService {

  constructor(public afAuth: AngularFireAuth) {
    console.log('Hello AuthServiceProvider Provider');
  }

  login(email, pass)
  {
      this.afAuth.auth.signInWithEmailAndPassword(email, pass).then((response)=>{
      console.log("Yes", response);
    }, (error)=>{
      console.log("no", error);
    });
  }
}
