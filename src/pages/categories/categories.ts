import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {BillDatabase} from "../../providers/bill-database/bill-database"
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {UserInfo} from '../../providers/user-info/user-info';
import {CategoriesService} from '../../providers/categories-service/categories-service'


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
  categoriesToShow = [];
  categories =[];
  categoriesDB = [];
  user;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alerCtrl: AlertController,
    public billDatabase: BillDatabase,
    public userInfo: UserInfo,
    public db: AngularFireDatabase,
    public categoriesService: CategoriesService,
  ) {
    this.categoriesToShow.push()
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

    for(let i in this.categories){
      let obj = {
        name: this.categories[i].name,
        products: [],
        categoryID: i,
        clicked: false
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

  expandCategory(i){
    this.categoriesToShow[i].clicked = !this.categoriesToShow[i].clicked;
  }
}
