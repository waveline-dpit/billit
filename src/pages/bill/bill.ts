import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController, Platform } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { PopoverBillPage } from "../popover-bill/popover-bill";
import { BillDatabase } from "../../providers/bill-database/bill-database"
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import { UserInfo} from '../../providers/user-info/user-info'
/**
 * Generated class for the BillPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-bill',
  templateUrl: 'bill.html',
})
export class BillPage {
  public bill;
  keys;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public billDatabase: BillDatabase,
    public popoverCtrl: PopoverController,
    public userInfo: UserInfo,
    public db: AngularFireDatabase
  )
  {
    this.bill = billDatabase.bill;
    this.keys = Object.keys(this.bill.products);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BillPage');
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
  addCategory() {
    let prompt = this.alertCtrl.create({
      title: 'New category',
      message: "Add a new category for your products",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
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
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverBillPage);
    popover.present({
      ev: myEvent
  });
  }
}
