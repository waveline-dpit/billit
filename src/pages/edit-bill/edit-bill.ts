import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BillDatabase } from '../../providers/bill-database/bill-database';
import { AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NumberValidator } from '../../validators/number';
import { NotEmptyValidator } from '../../validators/notEmpty';
import { CategoriesService } from '../../providers/categories-service/categories-service'

@IonicPage()
@Component({
  selector: 'page-edit-bill',
  templateUrl: 'edit-bill.html',
})
export class EditBillPage {
  bill;
  products = [];
  deletedProducts = [];
  ISOdate;
  currentTime;
  fcbillid; fcstorename;
  fcprodname; fcprice; fcqty;
  productAlert;
  submitAttempt: boolean = false;
  billIdForm: FormGroup;
  productForm: FormGroup;
  receivedBill;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alerCtrl: AlertController,
    public formBuilder: FormBuilder,
    public billDatabase: BillDatabase,
  ) {
    this.receivedBill = navParams.get('billParam');
    console.log(this.receivedBill.$key, this.receivedBill);

    this.billIdForm = formBuilder.group({
      fcstorename: ['', Validators.compose([Validators.maxLength(20), Validators.required, NotEmptyValidator.isValid])],
      fcbillid: ['', Validators.compose([Validators.maxLength(14), Validators.required, NotEmptyValidator.isValid])],
    });
    this.productForm = formBuilder.group({
      productList: this.formBuilder.array([
        this.initProduct(),
      ])
    });
    this.getDateTime();

    this.bill = {
      date: this.receivedBill.dateISO,
      dateISO: this.receivedBill.dateISO,
      time: this.receivedBill.time,
      favourite: this.receivedBill.favourite,
      number: this.receivedBill.number,
      totalAmount: this.receivedBill.totalAmount,
      storeName: this.receivedBill.storeName
    }
    for (let prodID in this.receivedBill.products) {
      let product = this.receivedBill.products[prodID];
      console.log(product);
      if(product.categoryID)
      {
        let obj = {
          name: product.name,
          quantity: product.quantity,
          pricePerUnit: product.pricePerUnit,
          totalPrice: product.totalPrice,
          categoryID: product.categoryID,
          key: prodID
        }
        this.products.push(obj);
      }
      else
      {
        let obj = {
          name: product.name,
          quantity: product.quantity,
          pricePerUnit: product.pricePerUnit,
          totalPrice: product.totalPrice,
          key: prodID
        }
        this.products.push(obj);
      }
      const control = <FormArray>this.productForm.controls['productList'];
      control.push(this.initProduct());
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditBillPage');
  }


  initProduct() {
    return this.formBuilder.group({
      fcprodname: ['', Validators.compose([Validators.maxLength(20), Validators.required, NotEmptyValidator.isValid])],
      fcqty: ['', Validators.compose([NumberValidator.isValid, Validators.required, NotEmptyValidator.isValid])],
      fcprice: ['', Validators.compose([NumberValidator.isValid, Validators.required, NotEmptyValidator.isValid])],
    });
  }

  addProduct() {
    this.products.push({
      name: "",
      quantity: "",
      pricePerUnit: "",
      totalPrice: 0,
      key: "new"
    });
    const control = <FormArray>this.productForm.controls['productList'];
    control.push(this.initProduct());
  }
  deleteProduct(index) {
    (<FormArray>this.productForm.controls['productList']).removeAt(index);
    if(this.products[index].key != "new")
    {
      let productID = {
        productID: this.products[index].key
      };
      this.deletedProducts.push(productID);
    }
    this.bill.totalAmount -= this.products[index].totalPrice;
    this.bill.totalAmount = Math.round(parseFloat(this.bill.totalAmount) * 100) / 100;
    this.products.splice(index, 1);
  }

  closeSlideIfOpen(slidingItem) {
    setTimeout(() => { slidingItem.close() }, 2000);
  }

  isNumber(val) {
    if (val > -99999999999 && val < 99999999999)
      return true;
    return false;
  }

  addPrice(product) {
    this.bill.totalAmount = parseFloat(this.bill.totalAmount);
    this.bill.totalAmount = Math.round(parseFloat(this.bill.totalAmount) * 100) / 100;
    product.totalPrice = parseFloat(product.totalPrice);
    product.pricePerUnit = parseFloat(product.pricePerUnit);
    product.quantity = parseFloat(product.quantity);
    /*console.log(
      typeof this.bill.totalAmount ,
      typeof product.totalPrice,
      typeof product.pricePerUnit,
      typeof product.quantity
    );*/

    if (product.pricePerUnit && product.quantity) {
      this.bill.totalAmount -= product.totalPrice;
      product.totalPrice = product.pricePerUnit * product.quantity;
      product.totalPrice = Math.round(parseFloat(product.totalPrice) * 100) / 100;
      this.bill.totalAmount += product.totalPrice;
      this.bill.totalAmount = Math.round(parseFloat(this.bill.totalAmount) * 100) / 100;
    }
    else {
      this.bill.totalAmount -= parseFloat(product.totalPrice);
      this.bill.totalAmount = Math.round(parseFloat(this.bill.totalAmount) * 100) / 100;
      product.totalPrice = 0;
    }
  }

  formatDate(date) {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    var day = date.substring(8, 10);
    var monthIndex = Number(date.substring(5, 7));
    var year = date.substring(0, 4);

    return day + ' ' + monthNames[monthIndex - 1] + ' ' + year;
  }

  getDateTime() {
    this.ISOdate = new Date();
    this.ISOdate.setHours(this.ISOdate.getHours() + Math.abs(new Date().getTimezoneOffset()) / 60)
    this.ISOdate = this.ISOdate.toISOString();
    var hour = ((new Date()).getHours()).toString();
    var min = ((new Date()).getMinutes()).toString();
    if (parseInt(min) < (10)) {
      min = '0' + min;
    }
    if (parseInt(hour) < (10)) {
      hour = '0' + hour;
    }
    this.currentTime = hour + ":" + min;
  }

  save() {
    console.log(this.bill, this.products);
    this.bill.date = this.formatDate(this.bill.date);
    this.billDatabase.updateBill(this.bill, this.products, this.deletedProducts, this.receivedBill.$key);
    this.navCtrl.pop();
  }

  // =================================================== ALERTS ===================================================

  fieldsNotCompleted() {
    let alert = this.alerCtrl.create({
      title: 'Error',
      message: 'You must complete all the fields properly in order to submit',
      buttons: ['Ok']
    });
    alert.present()
  }

  showDeleteAlert(index) {
    if (this.products.length > 1) {
      let alert = this.alerCtrl.create({
        title: 'Warning',
        message: 'Are you sure you want to delete this product?',
        buttons: [
          {
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Yes',
            handler: () => {
              this.deleteProduct(index);
            }
          }
        ]
      });
      alert.present()
    }
  }

}
