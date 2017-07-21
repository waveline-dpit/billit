import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EditPage } from "../edit/edit";
import { LoginPage } from "../login/login";
import {AuthService} from '../../providers/auth-service/auth-service'

/**
 * Generated class for the MyAccountPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
})
export class MyAccountPage {
  logoutButton = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyAccountPage');
  }

 goToEditPage() {
    this.navCtrl.push(EditPage);
  }
  goToLoginPage()
  {
    console.log(this.authService.logOut());
    this.navCtrl.push(LoginPage);
  }
}
