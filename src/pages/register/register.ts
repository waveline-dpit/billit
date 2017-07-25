import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { TabsPage } from "../tabs/tabs";
import {AuthService} from "../../providers/auth-service/auth-service"
import { AlertController } from 'ionic-angular';
import {UserRegister} from '../../providers/user-register/user-register'
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
  email;
  pass;
  pass2;

  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public alerCtrl: AlertController,
    public userRegister: UserRegister
  ) {}

  goToHomePage() {
    function validEmail(mail) {
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return mail.match(mailformat);
  }
  function verifyPass(password, password2) {
    let re = /^\w+$/;
    let msg = "Passwords must contain at least six characters, including uppercase, lowercase letters and numbers.";
      if (password == password2) {
        if (password.length < 6) {
          return msg;
        }
        re = /[0-9]/;
        if (!re.test(password)) {
          return msg;
        }
        re = /[a-z]/;
        if (!re.test(password)) {
          return msg;
        }
        re = /[A-Z]/;
        if (!re.test(password)) {
          return msg;
        }
      }
      else {
        return "Please check that you've entered and confirmed your password!";
      }
      return "secure";
    }

    if (this.regEmail != null && this.regPass != null && this.pass2 != null && this.fname != null && this.lname != null) {
      let ok = true;
      if (!validEmail(this.regEmail)) {
        ok = false;
        this.invalidEmailAlert();
      }
      let msg = verifyPass(this.regPass, this.pass2);
      if (msg != "secure" && ok) {
        ok = false;
        this.notSecurePass(msg);
      }
      if (ok) {
        this.authService.signupUser(this.regEmail, this.regPass).then(()=>
      {
        this.userRegister.addUserData(this.fname, this.lname);
        this.navCtrl.push(TabsPage);
      })

      }
    }
    else {
      this.notAllFieldsAlert();
    }
  }

  goToLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  notSecurePass(msg)
  {
    let alert = this.alerCtrl.create({
      title: 'Error',
      message: msg,
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
  notAllFieldsAlert() {
    let alert = this.alerCtrl.create({
      title: 'Register failed',
      message: 'You must complete all the fields in order to register.',
      buttons: ['Ok']
    });
    alert.present()
  }

}
