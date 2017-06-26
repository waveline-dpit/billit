import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from "../register/register";
import { FrgPasswordPage } from "../frg-password/frg-password";
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

  constructor(public navCtrl: NavController) {}

   goToHomePage()
  {
  this.navCtrl.push(HomePage);
  }
  goToRegisterPage()
  {
  this.navCtrl.push(RegisterPage);
}
 goToForgottenPasswordPage()
  {
  this.navCtrl.push(FrgPasswordPage);
  }

}