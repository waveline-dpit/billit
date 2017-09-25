import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyAccountPage } from "../my-account/my-account";
import { StatsPage } from "../stats/stats";
import { AboutPage } from "../about/about";
import { CategoriesPage } from "../categories/categories";
import { SlidesPage } from "../slides/slides";

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad MorePage');
  }

  goToMyAccount() {
    this.navCtrl.push(MyAccountPage);
  }
  goToCategories() {
    this.navCtrl.push(CategoriesPage);
  }
  goToAbout() {
    this.navCtrl.push(AboutPage);
  }
  goToSlides() {
    this.navCtrl.push(SlidesPage);
  }

}
