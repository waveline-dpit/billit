import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { UserInfo} from '../../providers/user-info/user-info'

@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {
  bills: FirebaseListObservable <any[]>;
  billsSubject: Subject <any>;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public userInfo:UserInfo
  )
  {
    this.billsSubject = new Subject();
    let path = '/user/' + userInfo.getUserToken() + '/bills';
    this.bills = db.list(path,{
      query: {
        orderByChild: 'date',
        equalTo: this.billsSubject
      }
    });

    this.bills.subscribe(queriedItems => {
      console.log(queriedItems);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatsPage');
  }
  changeData()
  {
    this.billsSubject.next("11");
  }
}
