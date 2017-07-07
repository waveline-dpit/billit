import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase/app'

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthService {
  public state={};
  public isValid={};

  constructor(public afAuth: AngularFireAuth) {
    this.isValid = 0;
    console.log('Hello AuthServiceProvider Provider');
  }

  login(email, pass)
  {
      this.afAuth.auth.signInWithEmailAndPassword(email, pass).then((response) =>{
        this.isValid = 1;
          }, (error)=>{
      console.log("no", error);
      this.isValid = 0;
    });
  }

  signupUser(newEmail, newPass)
  {
      this.afAuth.auth.createUserWithEmailAndPassword(newEmail, newPass);
  }

  isLogged()
  {
      this.afAuth.authState.subscribe(state =>{
      this.state = state;
      });
  }

  logOut(): firebase.Promise<any> {
    return this.afAuth.auth.signOut();
  }
}
