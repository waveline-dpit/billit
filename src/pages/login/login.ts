import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { RegisterPage } from "../register/register";
import { FrgPasswordPage } from "../frg-password/frg-password";
import { AuthService } from '../../providers/auth-service/auth-service';
import { TabsPage } from "../tabs/tabs";
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  email;
  pass;
  timer;
  data = {};

  constructor(
    public navCtrl: NavController,
    db: AngularFireDatabase,
    public alerCtrl: AlertController,
    public authService: AuthService
  )  { }

    //this.authService.login(this.email, this.pass);
    goToHomePage(){
    function validEmail(mail) {
      let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return mail.match(mailformat);
    }

    if (this.email != null && this.pass != null) {
      let ok = true;
      if (!validEmail(this.email)) {
        ok = false;
        this.invalidEmailAlert();
      }
      /*if(nu e buna parola)
      {
        ok = false;
        this.invalidPassAlert();
      }*/
      if (ok) {
        this.authService.login(this.email, this.pass);
        this.navCtrl.push(TabsPage);
      }
    }
    else {
      this.noEmailNoPassAlert();
    }
  }

  goToRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }

  goToForgottenPasswordPage() {
    this.navCtrl.push(FrgPasswordPage);
  }

  noEmailNoPassAlert() {
    let alert = this.alerCtrl.create({
      title: 'Login failed',
      message: 'You must specify an email and a password in order to log in.',
      buttons: ['Ok']
    });
    alert.present()
  }
  invalidEmailAlert() {
    let alert = this.alerCtrl.create({
      title: 'Error',
      message: 'You entered an invalid email adress. Please enter a valid address.',
      buttons: ['Ok']
    });
    alert.present()
  }
  invalidPassAlert() {
    let alert = this.alerCtrl.create({
      title: 'Wrong Password',
      message: 'You entered an incorrect password. Try entering your information again.',
      buttons: ['Ok']
    });
    alert.present()
  }
}
