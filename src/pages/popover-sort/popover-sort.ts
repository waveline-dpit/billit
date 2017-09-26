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
    <ion-list radio-group>
      <ion-item class="sort-header">
        Sort bills by:
      </ion-item>
      <ion-item  *ngFor="let item of items">
        <ion-label  class="popover-grid">

          <ion-grid>
            <ion-row>
              <ion-col col-2 [ngClass]="{'trusted': item.opt == 'trusted'}">
                <ion-icon name="{{item.icon}}"></ion-icon>
              </ion-col>
              <ion-col col-8>
                {{item.name}}
                <ion-icon style="margin-left:5px;"name="{{item.arrow}}"></ion-icon>
              </ion-col>
            </ion-row>
          </ion-grid>

        </ion-label>
        <ion-radio [checked]="sortOpt == item.opt" (click)="setSortOption(item.opt)"></ion-radio>
      </ion-item>
    </ion-list>
  `
})
export class PopoverSortPage {

  sortOpt;
  items = [
   {  name: "Date", arrow:"ios-arrow-round-down", icon:"calendar", opt:"dateDesc"},
   {  name: "Date", arrow:"ios-arrow-round-up", icon:"calendar", opt:"dateAsc"},
   {  name: "Price", arrow:"ios-arrow-round-down", icon:"logo-usd", opt:"priceDesc"},
   {  name: "Price", arrow:"ios-arrow-round-up", icon:"logo-usd", opt:"priceAsc"},
   {  name: "Favourites", icon:"star-outline", opt:"favourites"},
   {  name: "Trusted", icon:"checkmark-circle", opt:"trusted"}
  ]
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    if (this.navParams.data){
      this.sortOpt = this.navParams.data.sortOption;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverSortPage');
  }

  setSortOption(selectedItem) {
    this.sortOpt = selectedItem;
    this.viewCtrl.dismiss(this.sortOpt);
  }
}
