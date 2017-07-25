import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LidlPage } from '../lidl/lidl';
import { LoginPage } from "../login/login";
import {AuthService} from '../../providers/auth-service/auth-service'

/**
 * Generated class for the OffersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-offers',
  templateUrl: 'offers.html',
})
export class OffersPage {
  
  logoutButton = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad OffersPage');
  }

 goToLidlPage() {
    this.navCtrl.push(LidlPage);
  }
  goToLoginPage()
  {
    console.log(this.authService.logOut());
    this.navCtrl.push(LoginPage);
  }
}
