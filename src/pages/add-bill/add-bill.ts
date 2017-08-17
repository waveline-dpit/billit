import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {BillDatabase} from '../../providers/bill-database/bill-database';
import { AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NumberValidator } from  '../../validators/number';

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
  fcbillid; fcstorename;
  fcprodname; fcprice; fcqty;
  submitAttempt: boolean = false;
  billIdForm: FormGroup;
  productForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alerCtrl: AlertController,
    public formBuilder: FormBuilder,
    public billDatabase: BillDatabase
  ) {

    this.billIdForm = formBuilder.group({
        fcstorename: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
        fcbillid: ['', Validators.compose([Validators.maxLength(14), Validators.required])],
    });
    this.productForm = formBuilder.group({
        productList: this.formBuilder.array([
          this.initProduct(),
        ])
    });

    this.getDateTime();
    console.log(this.currentDate);
    this.bill = {
      date: this.currentDate,
      time: this.currentTime,
      favourite: false,
      number: "",
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
    console.log(this.products);
  }


  initProduct(){
    return this.formBuilder.group({
      fcprodname: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      fcqty: ['', Validators.compose([NumberValidator.isValid, Validators.required])],
      fcprice: ['', Validators.compose([NumberValidator.isValid, Validators.required])],
    });
  }

  addProduct(){
    this.products.push({
        name: "",
        quantity: "",
        pricePerUnit: "",
        totalPrice: 0
    });
    console.log(this.products)
    const control = <FormArray>this.productForm.controls['productList'];
    control.push(this.initProduct());
  }

  deleteProduct(index){
    const control = <FormArray>this.productForm.controls['productList'];
    if(index > 0)
    {
      control.removeAt(index);
    }
  }

  fieldsNotCompleted() {
    let alert = this.alerCtrl.create({
      title: 'Error',
      message: 'You must complete all the fields properly in order to submit',
      buttons: ['Ok']
    });
    alert.present()
  }

  submit() {
    this.submitAttempt = true;
    var canSubmit = true;
    for (var key in this.bill) {
      if(this.bill[key] === null || this.bill[key] === ""){
        canSubmit = false;
        console.log("eh",key, this.bill[key])
      }
      //console.log(key,this.bill[key])
    }
    for (var idx in this.products) {
      //console.log(this.products[idx]);
      var product = this.products[idx];
      for(var key in product){
        if(product[key] === null || product[key] === ""){
          canSubmit = false;
          console.log(product[key])
        }
      }
    }
    //console.log(canSubmit, this.bill, this.products);
    let ok = (
      this.billIdForm.controls.fcstorename.valid &&
      this.billIdForm.controls.fcbillid.valid &&
      this.productForm.controls.productList.valid
    );
    //console.log(ok);
    if(canSubmit && ok)
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
    this.bill.totalAmount = parseInt(this.bill.totalAmount);
    product.totalPrice = parseInt(product.totalPrice);
    product.pricePerUnit = parseInt(product.pricePerUnit);
    product.quantity = parseInt(product.quantity);
    console.log(
      typeof this.bill.totalAmount ,
      typeof product.totalPrice,
      typeof product.pricePerUnit,
      typeof product.quantity
    );

    if(product.pricePerUnit && product.quantity)
    {
      this.bill.totalAmount -= product.totalPrice;
      product.totalPrice = product.pricePerUnit * product.quantity;
      product.totalPrice = Math.round(parseInt(product.totalPrice) * 1000) / 1000;
      console.log("bill",typeof product.totalPrice);
      this.bill.totalAmount += product.totalPrice;
      console.log(typeof this.bill.totalAmount)
    }
    else
    {
      this.bill.totalAmount -= parseInt(product.totalPrice);
      console.log("DDDDDD")
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
