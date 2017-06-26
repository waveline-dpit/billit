import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from "../home/home";
import { LoginPage } from "../login/login";

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  constructor(public navCtrl: NavController) {}

   goToHomePage()
  {
  this.navCtrl.push(HomePage);
}
 goToLoginPage()
  {
  this.navCtrl.push(LoginPage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

}
