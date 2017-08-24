import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the PopoverSortPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()

@Component({
  template: `
      <ion-list>
        <ion-item>
          Sort bills by:
        </ion-item>
        <button ion-item  (click)="setSortOption('dateDesc')">
          <ion-icon style="margin-right:5px;"name="calendar"></ion-icon>
          Date (desc)
        </button>
        <button ion-item  (click)="setSortOption('dateAsc')">
          <ion-icon style="margin-right:5px;"name="calendar"></ion-icon>
          Date (asc)
        </button>
        <button ion-item  (click)="setSortOption('priceDesc')">
          <ion-icon style="margin-right:5px;"ios="logo-usd" md="logo-usd"></ion-icon>
          Price (desc)
        </button>
        <button ion-item  (click)="setSortOption('priceAsc')">
          <ion-icon style="margin-right:5px;"ios="logo-usd" md="logo-usd"></ion-icon>
          Price (asc)
        </button>
        <button ion-item (click)="setSortOption('favourites')">
          <ion-icon style="margin-right:5px;" name="star-outline"></ion-icon>
          Favourites
        </button>
      </ion-list>
  `
})
export class PopoverSortPage {

  sortOpt;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    if (this.navParams.data){
      this.sortOpt = this.navParams.data.sortOption;
    }
  }
  close() {
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverSortPage');
  }
  setSortOption(selectedItem) {
    this.sortOpt = selectedItem;
    this.viewCtrl.dismiss(this.sortOpt);
  }
}
