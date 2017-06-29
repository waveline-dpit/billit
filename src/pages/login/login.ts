import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from "../register/register";
import { FrgPasswordPage } from "../frg-password/frg-password";
import {AuthService} from '../../providers/auth-service/auth-service';
import { TabsPage } from "../tabs/tabs";
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';

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
  data = {};
  constructor(
    public navCtrl: NavController,
    db: AngularFireDatabase,
    public authService: AuthService
  ) {
    db.object('/user').subscribe((data) =>{
      this.data = data;
    });
  }

  goToHomePage()
  {
    console.log(this.email, this.pass);
    this.authService.login(this.email, this.pass);
    //this.navCtrl.push(TabsPage);
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
