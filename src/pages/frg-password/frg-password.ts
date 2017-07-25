import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from  '../../validators/email';

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
  fcfrgpass;
  frgPassForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public navParams: NavParams
  ) {
    this.frgPassForm = formBuilder.group({
        fcfrgpass: ['', Validators.compose([EmailValidator.isValid, Validators.required])],

    });
  }

  goToLoginPage() {

    if(this.frgPassForm.controls.fcfrgpass.valid) {
      this.navCtrl.push(LoginPage);
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FrgPasswordPage');
  }

}
