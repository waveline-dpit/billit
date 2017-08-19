import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {BillDatabase} from '../../providers/bill-database/bill-database';
import { AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NumberValidator } from  '../../validators/number';
import { NotEmptyValidator } from  '../../validators/notEmpty';
import {CategoriesService} from '../../providers/categories-service/categories-service';


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
  ISOdate;
  currentTime;
  fcbillid; fcstorename;
  fcprodname; fcprice; fcqty;
  productAlert;
  categories;
  submitAttempt: boolean = false;
  billIdForm: FormGroup;
  productForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alerCtrl: AlertController,
    public formBuilder: FormBuilder,
    public billDatabase: BillDatabase,
    public categoriesService: CategoriesService
  ) {

    this.billIdForm = formBuilder.group({
        fcstorename: ['', Validators.compose([Validators.maxLength(20), Validators.required, NotEmptyValidator.isValid])],
        fcbillid: ['', Validators.compose([Validators.maxLength(14), Validators.required, NotEmptyValidator.isValid])],
    });
    this.productForm = formBuilder.group({
        productList: this.formBuilder.array([
          this.initProduct(),
        ])
    });
    categoriesService.getCategories().subscribe((data)=>
    {
      this.categories = data;
    });

    this.getDateTime();

    this.bill = {
      date: this.ISOdate,
      dateISO: this.ISOdate,
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
  }


  initProduct(){
    return this.formBuilder.group({
      fcprodname: ['', Validators.compose([Validators.maxLength(20), Validators.required, NotEmptyValidator.isValid])],
      fcqty: ['', Validators.compose([NumberValidator.isValid, Validators.required, NotEmptyValidator.isValid])],
      fcprice: ['', Validators.compose([NumberValidator.isValid, Validators.required, NotEmptyValidator.isValid])],
    });
  }

  addProduct(){
    this.products.push({
        name: "",
        quantity: "",
        pricePerUnit: "",
        totalPrice: 0
    });
    const control = <FormArray>this.productForm.controls['productList'];
    control.push(this.initProduct());
  }
  deleteProduct(index){
      (<FormArray>this.productForm.controls['productList']).removeAt(index);
      this.bill.totalAmount -= this.products[index].totalPrice;
      this.products.splice(index,1);
    }

  isNumber(val)
  {
    if(val>-99999999999 && val<99999999999)
      return true;
    return false;
  }
  addPrice(product)
  {
    this.bill.totalAmount = parseFloat(this.bill.totalAmount);
    product.totalPrice = parseFloat(product.totalPrice);
    product.pricePerUnit = parseFloat(product.pricePerUnit);
    product.quantity = parseFloat(product.quantity);
    /*console.log(
      typeof this.bill.totalAmount ,
      typeof product.totalPrice,
      typeof product.pricePerUnit,
      typeof product.quantity
    );*/

    if(product.pricePerUnit && product.quantity)
    {
      this.bill.totalAmount -= product.totalPrice;
      product.totalPrice = product.pricePerUnit * product.quantity;
      product.totalPrice = Math.round(parseFloat(product.totalPrice) * 100) / 100;
      this.bill.totalAmount += product.totalPrice;
    }
    else
    {
      this.bill.totalAmount -= parseFloat(product.totalPrice);
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
    this.ISOdate = (new Date()).toISOString();
    var hour =  ((new Date()).getHours()).toString();
    var min =  ((new Date()).getMinutes()).toString();
    if(parseInt(min) < (10)){
      min = '0' + min;
    }
    if(parseInt(hour) < (10)){
      hour = '0' + hour;
    }
    this.currentTime = hour + ":" + min;
  }

  submit() {
    this.submitAttempt = true;
    var canSubmit = true;
    for (var key in this.bill) {
      if(this.bill[key] === null || this.bill[key] === ""){
        canSubmit = false;
      }
    }
    for (var idx in this.products) {
      var product = this.products[idx];
      for(var key in product){
        if(product[key] === null || product[key] === ""){
          canSubmit = false;
        }
      }
    }
    let ok = (
      this.billIdForm.controls.fcstorename.valid &&
      this.billIdForm.controls.fcbillid.valid &&
      this.productForm.controls.productList.valid
    );
    //console.log(ok);
    if(canSubmit && ok)
    {
      this.bill.date = this.formatDate(this.bill.date);
      this.billDatabase.addBill(this.bill, this.products);
      this.navCtrl.pop();
    }
    else
    {
      this.fieldsNotCompleted();
    }
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
  showDeleteAlert(index){
    if(this.products.length > 1){
      let alert = this.alerCtrl.create({
        title: 'Warning',
        message: 'Are you sure you want to delete this bill?',
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
  showCategories(product, id) {
    this.productAlert = this.alerCtrl.create();
    this.productAlert.setTitle('Select categories');

    for(let category of this.categories)
    {

      this.productAlert.addInput({
        type: 'checkbox',
        label: category.name,
        value: category.$key,
      });

    }
    this.productAlert.addButton('Cancel');
    this.productAlert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Checkbox data:', data);
        for(let cat of data)
        {
          this.categoriesService.addProductToCategory(product, cat, id);
        }
      }
    });
    this.productAlert.present();
  }

  addCategory() {
    let prompt = this.alerCtrl.create({
      title: 'New category',
      message: "Add a new category for your products",
      inputs: [
        {
          name: 'title',
          placeholder: 'ex: vegetables'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.categoriesService.addCategory(data.title);
          }
        }
      ]
    });
    prompt.present();
  }

}
