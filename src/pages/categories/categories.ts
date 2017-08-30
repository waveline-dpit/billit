import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';
import {UserInfo} from '../../providers/user-info/user-info';


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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams ,
    public alerCtrl: AlertController,
    public db: AngularFireDatabase,
    public userInfo: UserInfo
  )
  {
    /*const queryObservable = db.list("/user/" + this.userInfo.getUserToken() + '/bills', {
      query: {
        orderByChild: 'dateISO',
        startAt: "2010-08-19T09:04:19.026Z",
        endAt: "2017-08-19T23:04:19.026Z"
      }
    });
    queryObservable.subscribe(queriedItems => {
      console.log(queriedItems);
    });*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');
  }

  addNewCategory() {
    let prompt = this.alerCtrl.create({
      title: 'New category',
      message: "Add a new category for your products",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
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
          }
        }
      ]
    });
    prompt.present();
  }
}
