import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { RegisterPage } from "../register/register";
import { FrgPasswordPage } from "../frg-password/frg-password";
import { AuthService } from '../../providers/auth-service/auth-service';
import { TabsPage } from "../tabs/tabs";
import { AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
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
    public authService: AuthService,
  ){  }

  //this.authService.login(this.email, this.pass);
  goToHomePage(){
    if (this.email != null && this.pass != null) {
      let ok = true;
      //TODO:
      /*if(nu e buna parola sau something went wrong)
      {
        ok = false;
        this.invalidEmailPassAlert();
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
  invalidEmailPassAlert() {
    let alert = this.alerCtrl.create({
      title: 'Error',
      message: 'You entered an incorrect username or password. Try entering your information again.',
      buttons: ['Ok']
    });
    alert.present()
  }
}
