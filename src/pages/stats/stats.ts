import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {BillDatabase} from "../../providers/bill-database/bill-database"


/**
 * Generated class for the StatsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {
  bills;
  dummydate;
  storesObj: {[k: string]: any} = {};
  storesArr= [];

  constructor(
    public navCtrl: NavController,
    public billDatabase: BillDatabase,
    public navParams: NavParams
  ) {

    this.dummydate = (new Date()).toISOString();

    billDatabase.retreiveAllBills().subscribe((data) =>{
      this.bills = data;
    });

    this.getStores();
  }

  getStores(){
    for(let bill of this.bills)
    {
      if(this.storesObj[bill.storeName]){
        this.storesObj[bill.storeName]  += bill.totalAmount;
      }
      else{
        this.storesObj[bill.storeName] = bill.totalAmount;
      }
    }
    for(let key in this.storesObj)
    {
      this.storesArr.push({
        name: key,
        amount: this.storesObj[key]
      });
    }
    console.log(this.bills, this.storesObj, this.storesArr);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad StatsPage');
  }

}
