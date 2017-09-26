import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import firebase from 'firebase/app'
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { UserInfo } from '../user-info/user-info';
import { CategoriesService } from '../categories-service/categories-service'

@Injectable()
export class BillDatabase {
  public bill;
  constructor(
    public db: AngularFireDatabase,
    public userInfo: UserInfo,
    public categoriesService: CategoriesService
  ) {}

  addBill(bill, products)
  {
    let path = '/user/' + this.userInfo.getUserToken() + '/bills';
    let user : FirebaseListObservable <any>;
    user = this.db.list(path);
    user.push(bill).then((response) => {
      if(response.path.o[3] != null){
        path = path + '/' + response.path.o[3] + '/products';
      }
      else{
        if(response.path.pieces_[3] != null){
          path = path + '/' + response.path.pieces_[3] + '/products';
        }
      }
      user = this.db.list(path);
      for (let eachProduct of products) {
        user.push(eachProduct);
      }
    });
  }


  addProducts(products)
  {
    let path = '/user/' + this.userInfo.getUserToken() + '/bills';
    let user : FirebaseListObservable <any>;
    user = this.db.list(path);
    user.push(products);
  }

  retreiveAllBills()
  {
    let path = '/user/' + this.userInfo.getUserToken() + '/bills';
    return this.db.list(path);
  }

  addBillToFav(pathBill){
      let path = '/user/' + this.userInfo.getUserToken() + '/bills' + '/' + pathBill;
      let bill: FirebaseObjectObservable <any>;
      bill = this.db.object(path);
      bill.update({favourite: true});
  }

  removeBillFromFav(pathBill){
      let path = '/user/' + this.userInfo.getUserToken() + '/bills' + '/' + pathBill;
      let bill: FirebaseObjectObservable <any>;
      bill = this.db.object(path);
      bill.update({favourite: false});
  }

  removeBill(billId)
  {
    let path = '/user/' + this.userInfo.getUserToken() + '/bills' + '/' + billId;
    let bill: FirebaseObjectObservable <any>;
    this.db.object(path).subscribe((data)=>{
      for(let productID in data.products)
      {
        let product = data.products[productID];
        if(product.categoryID)
          for(let categoryID in product.categoryID)
            this.db.object('/user/' + this.userInfo.getUserToken() + '/categories/' + categoryID + '/products/' + productID).remove();
      }
      this.db.object(path).remove();
    });
  }

  updateBill(billInfo, products, deletedProducts, billID)
  {
    for(let deletedProduct of deletedProducts)
    {
      this.categoriesService.unCheckAllProdctFromCat(deletedProduct.productID, billID)
    }
    let objProd = [];
    let newProds = []
    for(let product of products)
    {

      let key = product.key;
      delete product.key;
      if(key != "new")
      {
        if(product.categoryID)
        {
          for(let catID in product.categoryID)
          {
            this.categoriesService.addProductToCategory(product, catID, key, billID);
          }
        }
          objProd[key] = product;
      }
      else
      {
        newProds.push(product);
      }
    }
    let bill = billInfo;
    bill.products = objProd;
    let path = '/user/' + this.userInfo.getUserToken() + '/bills' + '/' + billID;
    this.db.object(path).set(bill)
    .then(
      () => {
        path = path + "/products";
        for(let newProd of newProds)
          this.db.list(path).push(newProd);
      }
    )

  }
}
