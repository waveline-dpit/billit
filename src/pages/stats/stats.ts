import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { UserInfo} from '../../providers/user-info/user-info';
import { BillDatabase } from "../../providers/bill-database/bill-database";
import {CategoriesService} from '../../providers/categories-service/categories-service';


@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {
  bills;
  selectedDay;
  stats;
  storesArray;
  storesArrayEmpty: boolean;
  categories;

  constructor(
    public navCtrl: NavController,
    public billDatabase: BillDatabase,
    public navParams: NavParams,
    public categoriesService: CategoriesService
  ) {
    this.stats = 'days';
    this.storesArrayEmpty = true;
    this.selectedDay = (new Date()).toISOString();
    this.billDatabase.retreiveAllBills().subscribe((data) =>{
      this.bills = data;
      this.dateHasChanged();
    });
    categoriesService.getCategories().subscribe((data)=>
    {
      this.categories = data;
    });
    console.log(this.categories)

  }

  getStores(startDate, endDate){
    let storesObj: {[k: string]: any} = {};
    let storesArr= [];

    if(this.stats == "days"){
      for(let bill of this.bills)
      {
        let billDay = (new Date(bill.dateISO)).getDate();
        let billMonth = (new Date(bill.dateISO)).getMonth();
        let billYear = (new Date(bill.dateISO)).getFullYear();
        let month = (new Date(startDate)).getMonth();
        let year = (new Date(startDate)).getFullYear();
        let startDay = (new Date(startDate)).getDate();
        let endDay = (new Date(endDate)).getDate();
        //console.log(billDay, billMonth, billYear, startDay, endDay, month, year)
        if(startDay <= billDay && billDay <= endDay && billMonth == month && billYear == year){
          if(storesObj[bill.storeName]){
            storesObj[bill.storeName]  += bill.totalAmount;
          }
          else{
            storesObj[bill.storeName] = bill.totalAmount;
          }
        }
      }
    }

    if(this.stats == "month"){
      //
    }

    for(let key in storesObj)
    {
      storesArr.push({
        name: key,
        amount: storesObj[key]
      });
    }
    storesArr.sort(function(a, b){ return (b.amount - a.amount);});
    this.storesArray = storesArr;
    if(this.storesArray.length > 0){
      this.storesArrayEmpty = false;
    }
    else {
      this.storesArrayEmpty = true;
    }

    console.log("leng", this.storesArrayEmpty, this.storesArray)
    //console.log(this.bills, storesObj, storesArr);
  }

  dateHasChanged(){
    let startDate, endDate;
    if(this.stats == 'days')
    {
      startDate = endDate = this.selectedDay;
      console.log(new Date(this.selectedDay))
    }
    this.getStores(startDate, endDate);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatsPage');
  }
}
