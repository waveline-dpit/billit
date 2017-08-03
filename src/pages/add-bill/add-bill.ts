import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {BillDatabase} from '../../providers/bill-database/bill-database'

/**
 * Generated class for the AddBillPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-bill',
  templateUrl: 'add-bill.html',
})
export class AddBillPage {
  bill;
  products;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public billDatabase: BillDatabase
  ) {
    this.bill = {
      date: "",
      time: "",
      totalAmmount: "",
      storeName: ""
    }
    this.products = [
      {
        name: "",
        quantity: "",
        pricePerUnit: "",
        totalPrice: ""
      }
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddBillPage');
  }

  addProduct() {
    this.products.push({
        name: "",
        quantity: "",
        pricePerUnit: "",
        totalPrice: ""
    });
  }
  deleteProduct() {
  this.bill.products.splice(1,1);
  }

  submit() {
    this.billDatabase.addBill(this.bill, this.products);
  }

}
