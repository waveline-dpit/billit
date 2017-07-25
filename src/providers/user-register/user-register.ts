import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import firebase from 'firebase/app'
import { AngularFireAuth } from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';
import {UserInfo} from '../user-info/user-info'

@Injectable()
export class UserRegister {

  constructor(
    public db: AngularFireDatabase,
    public userInfo: UserInfo
  ) {}
  addUserData(firstName, lastName)
  {
    let user : FirebaseObjectObservable <any>;
    user = this.db.object('/user/' + this.userInfo.getUserToken() + '/info');
    user.set(
      {
        firstName : firstName,
        lastName : lastName
      });
  }
}
