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
      totalAmount: 0,
      storeName: ""
    }
    this.products = [
      {
        name: "",
        quantity: "",
        pricePerUnit: "",
        totalPrice: 0
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
    this.products.splice(1,1);
  }

  submit() {
    this.navCtrl.pop();
    this.billDatabase.addBill(this.bill, this.products);
  }
  isNumber(val)
  {
    if(val>-99999999999 && val<99999999999)
      return true;
    return false;
  }
  addPrice(product)
  {
    if(product.pricePerUnit && product.quantity )
    {
      if(this.isNumber(product.pricePerUnit), this.isNumber(product.quantity))
      {
        this.bill.totalAmount -= product.totalPrice;
        product.totalPrice = product.pricePerUnit * product.quantity;
        this.bill.totalAmount += product.totalPrice;
      }
    }
    else
    {
      this.bill.totalAmount -= product.totalPrice;
      product.totalPrice = 0;
    }
  }


}
