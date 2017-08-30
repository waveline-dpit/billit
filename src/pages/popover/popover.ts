import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AddBillPage } from "../add-bill/add-bill";
/**
 * Generated class for the PopoverPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()

@Component({
  template: `
        <ion-list>
        <button ion-item  (click)="close()">
        <div class="rows">
          <ion-icon style="margin-right:5px;"name="qr-scanner"></ion-icon>
          Receive
        </div>
        </button>
        <button ion-item (click)="goToAddBillPage();close()">
          <ion-icon style="margin-right:5px;" name="create"></ion-icon>
          Write
        </button>
        <button ion-item (click)="close()">
          <ion-icon style="margin-right:5px;" name="camera"></ion-icon>
          Scan
        </button>
      </ion-list>
   `
})
export class PopoverPage {
  popover: any;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController
  ) {}

  close() {
    this.navCtrl.remove(this.viewCtrl.index);
  }
  goToAddBillPage()
  {
    this.navCtrl.push(AddBillPage);
  }
}
