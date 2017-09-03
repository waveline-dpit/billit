import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AlertController, Platform } from 'ionic-angular';
import { EditBillPage } from "../edit-bill/edit-bill";
import { BillDatabase } from "../../providers/bill-database/bill-database"
import { TabsPage} from "../tabs/tabs"
import {CategoriesService} from '../../providers/categories-service/categories-service';

@IonicPage()

@Component({
  template: `
      <ion-list>
       <button *ngIf="bill.favourite" ion-item (click)="removeFromFavourite(bill)"><ion-icon style="margin-right:5px;" name="star-outline"></ion-icon>Remove from favs</button>
       <button *ngIf="!bill.favourite" ion-item (click)="addToFavourite(bill)"><ion-icon style="margin-right:5px;" name="star-outline"></ion-icon>Add to favourites</button>
       <button ion-item (click)="goToEditBillPage();close()"><ion-icon style="margin-right:5px;" name="create"></ion-icon>Edit</button>
       <button ion-item  (click)="openShareModal()"><ion-icon style="margin-right:6px;" name="share"></ion-icon>Share</button>
       <button ion-item (click)="billCheckbox();close()"><ion-icon style="margin-right:11px;" name="attach"></ion-icon>Category</button>
       <button ion-item (click)="showAlert()"><ion-icon style="margin-right:9px;" name="trash"></ion-icon>Delete</button>
      </ion-list>
  `
})
export class PopoverBillPage {
  bill;
  categories;
  billAlert = this.alertCtrl.create();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public billDatabase: BillDatabase,
    public categoriesService: CategoriesService
  ) {
    this.bill = this.navParams.get('billParam');
    categoriesService.getCategories().subscribe((data)=>
    {
      this.categories = data;
    });
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
    this.billAlert = this.alertCtrl.create();
    this.billAlert.setTitle('Select the bill category');
    this.billAlert.setMessage('This category will be set for all products on this bill');

    for(let category of this.categories)
    {

      this.billAlert.addInput({
        type: 'radio',
        label: category.name,
        value: category.$key,
      });
    }
    this.billAlert.addButton('Cancel');
    this.billAlert.addButton({
      text: 'OK',
      handler: data =>
      {
        for(let productID in this.bill.products)
        {
          this.categoriesService.addProductToCategory(this.bill.products[productID], data, productID, this.bill.$key);
        }
      }
    });
    this.billAlert.present();
  }
  showAlert(){
    let alert = this.alertCtrl.create({
      message: 'Are you sure you want to delete this bill?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'

        },
        {
          text: 'Yes',
          handler: () => {
            setTimeout(()=>{
              this.billDatabase.removeBill(this.bill.$key);
            }, 300);
          }
        }]
    });
    alert.present()
  }
  openShareModal(){
    this.viewCtrl.dismiss("share");
  }

}
