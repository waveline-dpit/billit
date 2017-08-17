import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {BillDatabase} from '../../providers/bill-database/bill-database'
import { AlertController } from 'ionic-angular';

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
  currentDate;
  currentTime;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alerCtrl: AlertController,
    public billDatabase: BillDatabase
  ) {
    this.getDateTime();
    console.log(this.currentDate);
    this.bill = {
      date: this.currentDate,
      time: this.currentTime,
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
    //this.currentDate = new Date();
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
  deleteProduct(index) {
    console.log(index);
    this.products.splice(index,1);
  }

  fieldsNotCompleted() {
    let alert = this.alerCtrl.create({
      title: 'Error',
      message: 'You must complete all the fields in order to submit',
      buttons: ['Ok']
    });
    alert.present()
  }

  submit() {
    var canSubmit = true;
    for (var key in this.bill) {
      if(this.bill[key] == ""){
        canSubmit = false;
      }
      //console.log(key,this.bill[key])
    }
    for (var idx in this.products) {
      //console.log(this.products[idx]);
      var product = this.products[idx];
      for(var key in product){
        if(product[key] == ""){
          canSubmit = false;
        }
      }
    }
    console.log(canSubmit);
    if(canSubmit)
    {
      this.bill.date = this.formatDate(this.bill.date);
      this.navCtrl.pop();
      this.billDatabase.addBill(this.bill, this.products);
    }
    else
    {
      this.fieldsNotCompleted();
    }
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

  formatDate(date)
  {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    var day = date.substring(8, 10);
    var monthIndex = Number(date.substring(5, 7));
    var year = date.substring(0, 4);

    return  day + ' ' + monthNames[monthIndex - 1] + ' ' + year;
  }
  getDateTime()
  {
    this.currentDate = (new Date()).toISOString();
    var hour =  ((new Date()).getHours()).toString();
    var min =  ((new Date()).getMinutes()).toString();
    if(parseInt(min) < (10)){
      min = '0' + min;
    }
    if(parseInt(hour) < (10)){
      hour = '0' + hour;
    }
    this.currentTime = hour + ":" + min;
    console.log(this.currentTime);
  }
}
