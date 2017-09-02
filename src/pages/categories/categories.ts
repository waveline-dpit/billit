import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {BillDatabase} from "../../providers/bill-database/bill-database"
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {UserInfo} from '../../providers/user-info/user-info';
import {CategoriesService} from '../../providers/categories-service/categories-service';
import { BillPage } from '../bill/bill';


/**
 * Generated class for the CategoriesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {
  bills;
  productAlert;
  categoriesToShow = [];
  categories =[];
  categoriesDB = [];
  user;
  expanded = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public billDatabase: BillDatabase,
    public userInfo: UserInfo,
    public db: AngularFireDatabase,
    public categoriesService: CategoriesService,
  ) {
    this.db.object("/user/" + this.userInfo.getUserToken()).subscribe((data) =>{
      this.user = data;
      this.bills = this.user.bills;
      this.categoriesDB = this.user.categories;
      this.makeCategories();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');
  }
  makeCategories(){

    for(let i in this.categoriesDB){
      let category = this.categoriesDB[i];
      let obj = {
        name: category.name,
        products: []
      }
      this.categories[i] = obj;
      this.categories.length++;
    }
    let obj = {
      name: "No Category",
      products: []
    }
    this.categories["noCategory"] = obj;
    this.categories.length++;
    //console.log(this.categories)

    for(let i in this.bills){
      let bill = this.bills[i];
      //console.log(bill)
      for(let prodID in bill.products){
        //console.log(product)
        let product = bill.products[prodID];
        product.billID = i;
        if(bill.products[prodID].categoryID){
          for(let categoryID in bill.products[prodID].categoryID){
            this.categories[categoryID].products[prodID] = product;
            this.categories[categoryID].products.length++;
            //console.log(categoryID)
          }
        }
        else{
          this.categories["noCategory"].products[prodID] = product;
          this.categories["noCategory"].products.length++;
        }

      }
    }
    this.categoriesToShow = [];
    for(let i in this.categories){
      this.expanded[i] = false;
      let obj = {
        name: this.categories[i].name,
        products: [],
        categoryID: i
      }
      for(let productID in this.categories[i].products){
        let prodObj;
        prodObj =  this.categories[i].products[productID]
        prodObj.productID = productID;
        obj.products.push(prodObj);
      }
      this.categoriesToShow.push(obj);
    }
    console.log(this.categoriesToShow)
  }

  closeSlideIfOpen(slidingItem){
    setTimeout(() => {slidingItem.close()}, 2000);
  }
  closeSlideIfOpen2(slidingItem2){
    setTimeout(() => {slidingItem2.close()}, 2000);
  }
  addCategory() {
    let prompt = this.alertCtrl.create({
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
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
            this.categoriesService.addCategory(data.title);
          }
        }
      ]
    });
    prompt.present();
  }

  showCategories(product, id, billId) {
    console.log("prod", product)
    this.productAlert = this.alertCtrl.create({
      message: product.name
    });
    this.productAlert.setTitle('Select categories');
    console.log(this.categoriesDB);
    let categoriesArray = [];
    for(let i in this.categoriesDB){
      let obj = {
        name: this.categoriesDB[i].name,
        products: this.categoriesDB[i].products,
        key: i
      };
      categoriesArray.push(obj);
    }

    for(let category of categoriesArray)
    {
      let isChecked;
      console.log()
      if(product.categoryID != null)
      {
        if(product.categoryID[category.key]){
          isChecked = true;
        }
        else{
          isChecked = false;
        }
      }
      else
        isChecked = false;
       
      this.productAlert.addInput({
        type: 'checkbox',
        label: category.name,
        value: category.key,
        checked: isChecked
      });
    }
    this.productAlert.addButton('Cancel');
    this.productAlert.addButton({
      text: 'Okay',
      handler: data => {
        console.log(data);
        this.categoriesService.unCheckAllProdctFromCat(id, billId);
        let pathBill = "/user/" + this.userInfo.getUserToken() + "/bills/" + billId + "/products/" + id + "/categoryID";
        this.db.object(pathBill).remove().then(()=>
        {
          for(let cat of data)
          {
            this.categoriesService.addProductToCategory(product, cat, id, billId);
          }
        })
      }
    });
    this.productAlert.present();
  }

  showDeleteAlert(categoryID){
    let alert = this.alertCtrl.create({
      title: 'Warning',
      message: 'Are you sure you want to delete this category?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            /*delete category from database*/
            console.log(categoryID)
          }
        }]
    });
    alert.present()
  }
  goToBillPage(billID){
    this.navCtrl.push(BillPage, {'billID': billID, 'comingFromCategories': true});
  }
  expandCategory(i){
    this.expanded[i] = !this.expanded[i];
  }
}
