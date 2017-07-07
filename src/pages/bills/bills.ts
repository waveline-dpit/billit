import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { BillPage } from "../bill/bill";
import { LoginPage } from "../login/login";
import {AuthService} from '../../providers/auth-service/auth-service'

/**
 * Generated class for the BillsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-bills',
  templateUrl: 'bills.html',
})
export class BillsPage {
  logoutButton = {};
  constructor(
    public platform: Platform,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authService: AuthService
    ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad BillsPage');
  }

  goToBillPage()
  {
    this.navCtrl.push(BillPage);
  }

  goToLoginPage()
  {
    console.log(this.authService.logOut());
    this.navCtrl.push(LoginPage);
  }
}
