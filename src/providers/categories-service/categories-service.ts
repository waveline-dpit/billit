import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {AngularFireAuth} from 'angularfire2/auth';
import {UserInfo} from '../user-info/user-info';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
/*
  Generated class for the CategorisServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CategoriesService {
  public categories;
  constructor(
    public db: AngularFireDatabase,
    public userInfo: UserInfo
  )
  {
    let path = "/user/" + this.userInfo.getUserToken() + "/categories";
    db.list(path).subscribe((data) => {
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
}
