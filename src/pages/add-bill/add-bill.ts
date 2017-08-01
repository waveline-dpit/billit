import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.bill = {
      date: "",
      time: "",
      total: "",
      storeName: "",
      products: [
        {
          name: "",
          quantity: "",
          price: "",
          total: ""
        }
      ]
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddBillPage');
  }

  addProduct() {
    this.bill.products.push({
        name: "",
        quantity: "",
        price: "",
        total: ""
    });
  }
  deleteProduct() {
  this.bill.products.splice(1,1);
  }

  submit() {
    console.log(this.bill);
  }

}
