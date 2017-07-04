import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { MyAccountPage } from "../my-account/my-account";
import { StatsPage } from "../stats/stats";

/**
 * Generated class for the MorePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-more',
  templateUrl: 'more.html'
})
export class MorePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }


  goToMyAccount() {
    this.navCtrl.push(MyAccountPage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad MorePage');
  }

}
