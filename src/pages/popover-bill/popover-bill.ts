import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AlertController, Platform } from 'ionic-angular';
import { EditBillPage } from "../edit-bill/edit-bill";
import { BillDatabase } from "../../providers/bill-database/bill-database"

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
       <button *ngIf="bill.favourite" ion-item (click)="removeFromFavourite(bill)"><ion-icon style="margin-right:5px;" name="star-outline"></ion-icon>Remove from favs</button>
       <button *ngIf="!bill.favourite" ion-item (click)="addToFavourite(bill)"><ion-icon style="margin-right:5px;" name="star-outline"></ion-icon>Add to favourites</button>
       <button ion-item (click)="goToEditBillPage();close()"><ion-icon style="margin-right:5px;" name="create"></ion-icon>Edit</button>
       <button ion-item  (click)="close()"><ion-icon style="margin-right:6px;" name="share"></ion-icon>Share</button>
       <button ion-item (click)="billCheckbox();close()"><ion-icon style="margin-right:9px;" name="attach"></ion-icon>Category</button>
       <button ion-item (click)="showAlert()"><ion-icon style="margin-right:9px;" name="trash"></ion-icon>Delete</button>
      </ion-list>
  `
})
export class PopoverBillPage {

  bill;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public billDatabase: BillDatabase
  ) {
    this.bill = this.navParams.get('billParam');
  }

  close() {
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverBillPage');
  }

  goToEditBillPage()
  {
    this.navCtrl.push(EditBillPage, { 'billParam': this.bill});
  }
  addToFavourite(bill){
    bill.favourite = true;
    this.billDatabase.addBillToFav(bill.$key);
  }
  removeFromFavourite(bill){
    bill.favourite = false;
    this.billDatabase.removeBillFromFav(bill.$key);
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

    this.close();
    alert.present();
  }
  showAlert(){
    let alert = this.alertCtrl.create({
      message: 'Are you sure you want to delete this bill?',
      buttons: ['No' , 'Yes']
    });
    alert.present()
  }

}
