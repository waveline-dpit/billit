import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AlertController, Platform } from 'ionic-angular';
/**
 * Generated class for the PopoverBillPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()

@Component({
  template: `
      <ion-list>
       <button ion-item><ion-icon style="margin-right:5px;" name="create"></ion-icon>Edit</button>
       <button ion-item><ion-icon style="margin-right:6px;" name="share"></ion-icon>Share</button>
       <button ion-item (click)="billCheckbox()"><ion-icon style="margin-right:9px;" name="attach"></ion-icon>Category</button>
      </ion-list>
  `
}) 
export class PopoverBillPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
     public alertCtrl: AlertController,
  ) {}

  close() {
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverBillPage');
  }
    showCheckbox() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select categories');


    alert.addInput({
      type: 'checkbox',
      label: 'Alderaan',
      value: 'value1',
      checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Bespin',
      value: 'value2'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Checkbox data:', data);

      }
    });
    alert.present();
  }
  billCheckbox() {
    let alert = this.alertCtrl.create();
   alert.setTitle('Select the bill category');
    alert.setMessage('This category will be set for all products on this bill');

    alert.addInput({
      type: 'radio',
      label: 'Blue',
      value: 'blue',

    });
    alert.addInput({
      type: 'radio',
      label: 'Blue',
      value: 'blue',

    });
      alert.addInput({
      type: 'radio',
      label: 'Blue',
      value: 'blue',

    });
      alert.addInput({
      type: 'radio',
      label: 'Blue',
      value: 'blue',

    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',

    });
    alert.present();
  }

}
