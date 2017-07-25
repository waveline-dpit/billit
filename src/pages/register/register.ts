import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { TabsPage } from "../tabs/tabs";
import { AuthService } from "../../providers/auth-service/auth-service"
import { AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from  '../../validators/email';
import { PasswordValidator } from  '../../validators/password';

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

  regEmail;
  regPass;
  fname;
  lname;
  pass2;

  fcfname; fclname; fcemail; fcpass; fcpass2;
  registerForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public alerCtrl: AlertController,
    public formBuilder: FormBuilder
  ) {
    this.registerForm = formBuilder.group({
        fcfname:['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        fclname: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        fcemail: ['', Validators.compose([EmailValidator.isValid, Validators.required])],
        fcpass: ['', Validators.compose([PasswordValidator.isValid, Validators.required])],
        fcpass2: ['', Validators.compose([PasswordValidator.confirmPass, Validators.required])]

    });
  }

  goToHomePage() {
      this.submitAttempt = true;
      let ok = (
        this.registerForm.controls.fcfname.valid &&
        this.registerForm.controls.fclname.valid &&
        this.registerForm.controls.fcemail.valid &&
        this.registerForm.controls.fcpass.valid &&
        this.registerForm.controls.fcpass2.valid
      );
      if (ok) {
        this.authService.signupUser(this.regEmail, this.regPass);
        this.navCtrl.push(TabsPage);
      }
      else{
        this.notAllFieldsAlert();
      }
  }

  goToLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  notAllFieldsAlert() {
    let alert = this.alerCtrl.create({
      title: 'Register failed',
      message: 'You must complete all the fields properly in order to register.',
      buttons: ['Ok']
    });
    alert.present()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }
}
