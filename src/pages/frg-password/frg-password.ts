import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { AlertController } from 'ionic-angular';


/**
 * Generated class for the FrgPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-frg-password',
  templateUrl: 'frg-password.html',
})
export class FrgPasswordPage {
  email;
  constructor(
    public navCtrl: NavController,
    public alerCtrl: AlertController,
    public navParams: NavParams
  ) { }

  goToLoginPage() {
    function validEmail(mail) {
      let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return mail.match(mailformat);
    }
    if(this.email == null || !validEmail(this.email)){
      this.invalidEmailAlert();
    }
    else{
      this.navCtrl.push(LoginPage);
    }
  }

  invalidEmailAlert() {
    let alert = this.alerCtrl.create({
      title: 'Error',
      message: 'You entered an invalid email address. Please enter a valid one.',
      buttons: ['Ok']
    });
    alert.present()
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FrgPasswordPage');
  }

}
