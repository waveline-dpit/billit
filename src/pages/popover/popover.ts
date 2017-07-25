import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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
       <button ion-item><ion-icon  name="cloud-download"></ion-icon> Recive</button>
       <button ion-item><ion-icon name="create" ></ion-icon> Write</button>
       <button ion-item><ion-icon  name="camera"></ion-icon> Scan</button>
      </ion-list>
  `
})
export class PopoverPage {
  constructor(public viewCtrl: ViewController) {}

  close() {
    this.viewCtrl.dismiss();
  }
}