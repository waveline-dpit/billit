import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { BillPage } from "../bill/bill";
import { LoginPage } from "../login/login";
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

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BillsPage');
  }
goToBillPage()
  {
  this.navCtrl.push(BillPage);
}
goToLoginPage()
  {
  this.navCtrl.push(LoginPage);
  }
}
