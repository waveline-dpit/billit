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
        <ion-label>
          <ion-icon style="margin-right:5px;"name="{{item.icon}}"></ion-icon>
          {{item.name}}
        </ion-label>
        <ion-radio [checked]="sortOpt == item.opt" (click)="setSortOption(item.opt)"></ion-radio>
      </ion-item>
    </ion-list>
  `
})
export class PopoverSortPage {

  sortOpt;
  items = [
   {  name: "Date (desc)", icon:"calendar", opt:"dateDesc"},
   {  name: "Date (asc)", icon:"calendar", opt:"dateAsc"},
   {  name: "Price (desc)", icon:"logo-usd", opt:"priceDesc"},
   {  name: "Price (desc)", icon:"logo-usd", opt:"priceAsc"},
   {  name: "Favourites", icon:"star-outline", opt:"favourites"}
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
