import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the StatsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {

  dummydate;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

    this.dummydate = (new Date()).toISOString();
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad StatsPage');
    console.log(this.dummydate);
  }

}
