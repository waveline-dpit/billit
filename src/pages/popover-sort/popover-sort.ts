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
      <ion-list radio-group ngModel=[(sortGroup)]>
        <ion-item>
          Sort bills by:
        </ion-item>

        <ion-item>
          <ion-label>
            <ion-icon style="margin-right:5px;"name="calendar"></ion-icon>
            Date (desc)
          </ion-label>
          <ion-radio value="dateDesc" checked="true" (click)="setSortOption('dateDesc')" ></ion-radio>
        </ion-item>
        
        <ion-item >
          <ion-label>
            <ion-icon style="margin-right:5px;"name="calendar"></ion-icon>
            Date (asc)
          </ion-label>
          <ion-radio value="dateAsc" (click)="setSortOption('dateAsc')"></ion-radio>
        </ion-item>
        </ion-list>
        <!--
         <button ion-item (click)="setSortOption('dateDesc')" >
          <ion-icon style="margin-right:5px;"name="calendar"></ion-icon>
          Date (desc)
          <ion-radio  value="go"></ion-radio>
          </button>
        
        <ion-item (click)="setSortOption('dateAsc')">
          <ion-icon style="margin-right:5px;"name="calendar"></ion-icon>
          Date (asc)
          <ion-radio></ion-radio>
        </ion-item>
        <ion-item (click)="setSortOption('priceDesc')">
          <ion-icon style="margin-right:5px;"ios="logo-usd" md="logo-usd"></ion-icon>
          Price (desc)
          <ion-radio></ion-radio>
        </ion-item>
        <ion-item (click)="setSortOption('priceAsc')">
          <ion-icon style="margin-right:5px;"ios="logo-usd" md="logo-usd"></ion-icon>
          Price (asc)
          <ion-radio></ion-radio>
        </ion-item>
        <ion-item (click)="setSortOption('favourites')">
          <ion-icon style="margin-right:5px;" name="star-outline"></ion-icon>
          Favourites
          <ion-radio></ion-radio>
        </ion-item>
      -->
  `
})
export class PopoverSortPage {

  sortOpt;
  sortGroup;
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
    console.log(this.sortGroup)
  }
  setSortOption(selectedItem) {
    this.sortOpt = selectedItem;
    this.viewCtrl.dismiss(this.sortOpt);
  }
}
