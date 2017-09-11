import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus';

@Injectable()
export class AuthService {
  public state={};
  public isValid={};

  constructor(
    public afAuth: AngularFireAuth,
    public googlePlus: GooglePlus
  ) {
    this.isValid = 0;
  }

  login(email, pass)
  {
      return this.afAuth.auth.signInWithEmailAndPassword(email, pass);/*.then((response) =>{
        this.isValid = 1;
          }, (error)=>{
      this.isValid = 0;
    });*/
  }

  loginWithGoogle()
  {
    return this.googlePlus.login({
      'webClientId': '983236088103-si5u12j4eomqjgfccr712dcb3ocej32m.apps.googleusercontent.com',
      'offline': true});
  }

  signupUser(newEmail, newPass)
  {
    return this.afAuth.auth.createUserWithEmailAndPassword(newEmail, newPass);
  }

  isLogged()
  {
      this.afAuth.authState.subscribe(state =>{
      this.state = state;
      });
  }

  signInWithCredential(token)
  {
    return firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(token));
  }

  logOut()
  {
    this.googlePlus.logout().then(()=>
    {
      console.log(11);
      this.afAuth.auth.signOut();
    },
    ()=>
    {
      console.log(22);
      this.afAuth.auth.signOut();
    })
  }
}
