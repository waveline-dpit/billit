import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {AngularFireAuth} from 'angularfire2/auth';
import {UserInfo} from '../user-info/user-info';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import 'rxjs/add/operator/first'
/*
  Generated class for the CategorisServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CategoriesService {
  public categories : FirebaseObjectObservable <any>;
  constructor(
    public db: AngularFireDatabase,
    public userInfo: UserInfo
  )
  {
    let path = "/user/" + this.userInfo.getUserToken() + "/categories";
    db.object(path).subscribe((data) => {
      this.categories = data;
    });
  }
  addCategory(name)
  {
    let path = "/user/" + this.userInfo.getUserToken() + "/categories";
    let categories = this.db.list(path);
    categories.push({name : name}).then((response) =>
    {
      console.log(response);
    });
  }
  getCategories()
  {
    let path = "/user/" + this.userInfo.getUserToken() + "/categories";
    return this.db.list(path);
  }
  addProductToCategory(product, categoryID, productID, billID)
  {
    this.db.object("/user/" + this.userInfo.getUserToken() + "/bills/" + billID).first().subscribe((data)=>
    {
      product["dateISO"] = data.dateISO;
      product["productID"] = productID;
      product["billID"] = billID;
      let path = "/user/" + this.userInfo.getUserToken() + "/categories/" + categoryID + "/products/" + productID;
      this.categories = this.db.object(path);
      this.categories.update(product);
      path = "/user/" + this.userInfo.getUserToken() + "/bills/" + billID + "/products/" + productID + "/categoryID";
      let prod: FirebaseObjectObservable <any>;
      let obj = {}, key = categoryID;
      obj[categoryID] = true;
      prod = this.db.object(path);
      prod.update(obj);
    });

  }
  unCheckAllProdctFromCat(productID, billID)
  {
    let pathBill = "/user/" + this.userInfo.getUserToken() + "/bills/" + billID + "/products/" + productID + "/categoryID";
    let pathCategory = "/user/" + this.userInfo.getUserToken() + "/categories";
    let bill;
    let authObserver = this.getSmth(pathBill).first().subscribe(billCat =>
    {
      bill = billCat;
      for(let cat of bill)
        this.db.object(pathCategory + "/" + cat.$key + "/products/" + productID).remove();
    });
  }

  uncheckOneProdFormCat()
  {

  }

  deleteCategory(category)
  {
    let path = "/user/" + this.userInfo.getUserToken() + "/bills/";
    for(let product of category.products)
    {
      this.db.object(path + product.billID + "/products/" + product.productID + "/categoryID/" + category.categoryID).remove();
    }
    this.db.object("/user/" + this.userInfo.getUserToken() + "/categories/" + category.categoryID).remove();
  }

  private getSmth(path)
  {
    return this.db.list(path);
  }
}
