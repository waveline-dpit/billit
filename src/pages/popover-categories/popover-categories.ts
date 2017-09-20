import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the PopoverCategoriesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-categories',
  template: `
    <ion-list radio-group>
      <ion-item class="sort-header">
        Sort products by:
      </ion-item>
      <ion-item  *ngFor="let item of items">
        <ion-label  class="popover-grid">

          <ion-grid>
            <ion-row>
              <ion-col col-2>
                <ion-icon name="{{item.icon}}"></ion-icon>
              </ion-col>
              <ion-col col-8>
                {{item.name}}
              </ion-col>
            </ion-row>
          </ion-grid>

        </ion-label>
        <ion-radio [checked]="sortOpt == item.opt" (click)="setSortOption(item.opt)"></ion-radio>
      </ion-item>
    </ion-list>
  `
})
export class PopoverCategoriesPage {

  sortOpt;
  items = [
    {  name: "Name", icon:"quote", opt:"name"},
    //{  name: "Date",  icon:"calendar", opt:"date"},
    {  name: "Price", icon:"logo-usd", opt:"price"},
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
    console.log('ionViewDidLoad PopoverCategoriesPage');
  }

  setSortOption(selectedItem) {
    this.sortOpt = selectedItem;
    this.viewCtrl.dismiss(this.sortOpt);
  }

}
