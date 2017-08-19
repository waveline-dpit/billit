import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import firebase from 'firebase/app'
import { AngularFireAuth } from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';
import {UserInfo} from '../user-info/user-info'

@Injectable()
export class BillDatabase {
  public bill;
  constructor(
    public db: AngularFireDatabase,
    public userInfo: UserInfo
  ) {}

  addBill(bill, products)
  {
    let path = '/user/' + this.userInfo.getUserToken() + '/bills';
    let user : FirebaseListObservable <any>;
    user = this.db.list(path);
    user.push(bill).then((response) => {
      path = path + '/' + response.path.o[3] + '/products';
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


}
