import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { BillPage } from "../bill/bill";
import { LoginPage } from "../login/login";
import {AuthService} from '../../providers/auth-service/auth-service'
import { AddBillPage } from "../add-bill/add-bill";
import { PopoverController } from 'ionic-angular';
import { PopoverPage } from "../popover/popover";
import {BillDatabase} from "../../providers/bill-database/bill-database"
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {UserInfo} from '../../providers/user-info/user-info';
import {CategoriesService} from '../../providers/categories-service/categories-service'
import {  FabContainer } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { BarcodeScanner} from '@ionic-native/barcode-scanner';
import { PopoverSortPage } from "../popover-sort/popover-sort";
import * as moment from 'moment';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

@IonicPage()
@Component({
  selector: 'page-bills',
  templateUrl: 'bills.html',
})
export class BillsPage {
  logoutButton = {};
  bills;
  billsToShow;
  cat;
  fabb: FabContainer;
  clicked_fab = false;
  qrData;
  createdCode;
  scannedCode;
  sortOption = "dateDesc";
  lastSortOption = this.sortOption;

  intervals = [];
  intervalToShow = [];

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public popoverCtrl: PopoverController,
    public billDatabase: BillDatabase,
    public userInfo: UserInfo,
    public db: AngularFireDatabase,
    public categoriesService: CategoriesService,
    public alerCtrl: AlertController,
    private barcodeScanner: BarcodeScanner
  )
  {
    this.buildIntervals();
    billDatabase.retreiveAllBills().subscribe((data) =>{
      this.bills = data;
      this.billsToShow = data;
      this.sortBills();
      //console.log(this.billsToShow);
    });
    document.addEventListener("touchstart", () => {this.closeFabIfActive()});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BillsPage');
  }

  goToBillPage(bill)
  {
    this.billDatabase.bill = bill;
    console.log(bill);
    this.navCtrl.push(BillPage);
  }

  goToLoginPage()
  {
    console.log(this.authService.logOut());
  }
  goToAddBillPage()
  {
    console.log("addbill")
    this.navCtrl.push(AddBillPage);
    this.closeFab(this.fabb);
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }
  presentPopoverSort(myEvent) {
    let popover = this.popoverCtrl.create(PopoverSortPage, { sortOption: this.sortOption});
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss((popoverData) => {
      this.sortOption = popoverData;
      console.log("didDismiss", this.sortOption, this.lastSortOption)
      if(this.sortOption != null){
        this.lastSortOption = this.sortOption;
      }
      else{
        this.sortOption = this.lastSortOption;
      }
      this.sortBills();
    })
  }

  buildIntervals(){
    const moment = extendMoment(Moment);
    moment.locale('en-AU');
    let today = moment().startOf('day');
    let firstDayOfWeek = moment().startOf('week')
    /*if(firstDayOfWeek.day() == 0){
      firstDayOfWeek = moment().startOf('week').subtract(6, 'days').startOf('day');
    }
    else{
      firstDayOfWeek = moment().startOf('week').add(1, 'days').startOf('day');
    }*/
    let month = firstDayOfWeek.clone().subtract(15, 'days').startOf('day').toDate().getMonth();
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let firstDayOfLastMonth = moment(firstDayOfWeek.clone().subtract(15, 'days').startOf('day').toDate()).startOf('month');

    this.intervals.push({
      name:"Today",
      range: moment.range(today.toDate(), today.toDate())
    });
    this.intervals.push({
      name:"Yesterday",
      range: moment.range(today.clone().subtract(1, 'days').startOf('day').toDate(),  today.clone().subtract(1, 'days').startOf('day'))
    });
    this.intervals.push({
      name:"Earlier this week",
      range: moment.range(firstDayOfWeek.clone().toDate(), today.clone().subtract(2, 'days').startOf('day').toDate())
    });
    this.intervals.push({
      name:"Last week",
      range: moment.range(firstDayOfWeek.clone().subtract(7, 'days').startOf('day').toDate(), firstDayOfWeek.clone().subtract(1, 'days').startOf('day').toDate())
    });
    this.intervals.push({
      name:"Two weeks ago",
      range: moment.range(firstDayOfWeek.clone().subtract(14, 'days').startOf('day').toDate(), firstDayOfWeek.clone().subtract(8, 'days').startOf('day').toDate())
    });
    this.intervals.push({
      name:"Earlier in " + months[month + 12],
      range: moment.range(firstDayOfLastMonth.toDate(), firstDayOfWeek.clone().subtract(15, 'days').startOf('day').toDate())
    });
    let firstDayOfLastUsedMonth = firstDayOfLastMonth.clone().subtract(1, 'days').startOf('month');
    if(month + 12 - 1 >= 0){
      this.intervals.push({
        name: months[month + 12 - 1],
        range: moment.range(firstDayOfLastUsedMonth.toDate(), firstDayOfLastMonth.clone().subtract(1, 'days').startOf('day').toDate())
      });
    }
    for(let i = 2; i <= 5 && month + 12 - i >= 0; i++){
      this.intervals.push({
        name: months[month + 12 - i],
        range: moment.range(firstDayOfLastUsedMonth.clone().subtract(1, 'days').startOf('month').toDate(), firstDayOfLastUsedMonth.clone().subtract(1, 'days').startOf('day').toDate())
      });
      firstDayOfLastUsedMonth = firstDayOfLastUsedMonth.clone().subtract(1, 'days').startOf('month');
    }
    let year = firstDayOfLastUsedMonth.clone().subtract(1, 'days').startOf('day').toDate().getFullYear();
    this.intervals.push({
      name: "Earlier in " + year.toString(),
      range: moment.range(firstDayOfLastUsedMonth.clone().subtract(1, 'days').startOf('year').toDate(), firstDayOfLastUsedMonth.clone().subtract(1, 'days').startOf('day').toDate())
    });
    let firstDayOfLastYear = firstDayOfLastUsedMonth.clone().subtract(1, 'days').startOf('year').subtract(1, 'days');
    for(let i = 1; i <= 10; i++){
      this.intervals.push({
        name: (year - i).toString(),
        range: moment.range(firstDayOfLastYear.clone().startOf('year').toDate(), firstDayOfLastYear.clone().toDate())
      });
      firstDayOfLastYear = firstDayOfLastYear.clone().startOf('year').subtract(1, 'days');
    }
    this.intervals.push({
      name: "A long time ago...",
      range: moment.range(moment(new Date('1970-01-01')), firstDayOfLastYear.toDate())
    });

    console.log(this.intervals, firstDayOfLastUsedMonth.toDate())
  }

  sortBills(){
    this.intervalToShow = [];

    if(this.sortOption == "dateDesc"){
      this.billsToShow = this.bills;
      this.billsToShow.sort(function(a, b){
        a = new Date(a.dateISO);
        b = new Date(b.dateISO);
        return (b - a);
      });
      this.intervalToShow = [];
      let usedInterval = [];
      for(let i in this.billsToShow){
        let auxDate = new Date(this.billsToShow[i].dateISO);
        let billdate = moment(auxDate.setHours(auxDate.getHours() - Math.abs((new Date(this.billsToShow[i].dateISO)).getTimezoneOffset()))).startOf('day');
        for(let intervalIndex in this.intervals){
          if(this.intervals[intervalIndex].range.contains(billdate) && usedInterval[intervalIndex] == null){
            this.intervalToShow[i] = this.intervals[intervalIndex].name;
            usedInterval[intervalIndex] = true;
          }
        }
      }
      //console.log(this.intervalToShow);
    }
    if(this.sortOption == "dateAsc"){
      this.billsToShow = this.bills;
      this.billsToShow.x(function(a, b){
        a = new Date(a.dateISO);
        b = new Date(b.dateISO);
        return (a - b);
      });
      this.intervalToShow = [];
      let copyIntervals = this.intervals;
      copyIntervals.reverse();
      let usedInterval = [];
      for(let i in this.billsToShow){
        let billdate = moment(new Date(this.billsToShow[i].dateISO)).startOf('day');
        for(let intervalIndex in copyIntervals){
          if(copyIntervals[intervalIndex].range.contains(billdate) && usedInterval[intervalIndex] == null){
            this.intervalToShow[i] = copyIntervals[intervalIndex].name;
            usedInterval[intervalIndex] = true;
          }
        }
      }
    }
    if(this.sortOption == "priceDesc"){
      this.billsToShow = this.bills;
      this.billsToShow.sort(function(a, b){ return (b.totalAmount - a.totalAmount);});
    }
    if(this.sortOption == "priceAsc"){
      this.billsToShow = this.bills;
      this.billsToShow.sort(function(a, b){ return (a.totalAmount - b.totalAmount);});
    }
    if(this.sortOption == "favourites"){
      let favBills = [];
      for(let bill of this.bills){
        if(bill.favourite){
          favBills.push(bill);
        }
      }
      this.billsToShow = favBills;
    }
  }

  addToFavourite(bill, slidingItem){
    bill.favourite = true;
    setTimeout(() => {slidingItem.close()}, 300);
    setTimeout(() => {this.billDatabase.addBillToFav(bill.$key);}, 1000);
  }
  removeFromFavourite(bill, slidingItem){
    bill.favourite = false;
    setTimeout(() => {slidingItem.close()}, 300);
    setTimeout(() => {this.billDatabase.removeBillFromFav(bill.$key);}, 1000);
  }
  closeSlideIfOpen(slidingItem){
    setTimeout(() => {slidingItem.close()}, 2000);
  }
  showAlert(billId){
    let alert = this.alerCtrl.create({
      title: 'Warning',
      message: 'Are you sure you want to delete this bill?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'

        },
        {
          text: 'Yes',
          handler: () => {
            setTimeout(()=>{
              this.billDatabase.removeBill(billId);
            }, 300);
          }
        }]
    });
    alert.present()
  }
  closeFab(fab: FabContainer) {
      console.log("fab closed")
      fab.close();
      this.clicked_fab = false;
  }
  clickedFab(fab){
    console.log("fab opened")
    this.clicked_fab = true;
    this.fabb = fab;
  }
  closeFabIfActive(){
    if(this.clicked_fab)
    {
      setTimeout(()=>{
        if(this.fabb._listsActive){
          console.log("closed from here");
          this.closeFab(this.fabb);
        }
      },300);
    }
  }
  createCode(){
    this.createdCode = this.qrData;
  }
  scanCode(){
    this.barcodeScanner.scan().then(barcodeData =>{
      this.scannedCode = barcodeData.text;
      let billInfo, products, bill;
      bill = JSON.parse(this.scannedCode);
      if(bill.b != null && bill.pr.length > 0){
        billInfo = {
          date: bill.b.dt,
          dateISO: bill.b.dISO,
          time: bill.b.t,
          favourite: false,
          number: bill.b.nr,
          totalAmount: bill.b.tA,
          storeName: bill.b.sN
        }
        products = [];
        for(let i in bill.pr){
          let product = {
            name: bill.pr[i].n,
            quantity: bill.pr[i].qty,
            pricePerUnit: bill.pr[i].U,
            totalPrice: bill.pr[i].tp
          }
          products.push(product);
        }
        this.addBillFromScan(billInfo, products);
      }
      else{

      }
    });
    setTimeout(()=>{this.closeFab(this.fabb);},500);
  }
  addBillFromScan(bill, products){
    let path = '/user/' + this.userInfo.getUserToken() + '/bills';
    let user : FirebaseListObservable <any>;
    user = this.db.list(path);
    user.push(bill).then((response) => {
      let billPath =  path + '/' + response.path.o[3] ;
      path = path + '/' + response.path.o[3] + '/products';
      user = this.db.list(path);
      for (let eachProduct of products) {
        user.push(eachProduct);
      }
      this.db.object(billPath).subscribe(wholeBill =>{
          console.log(wholeBill)
          this.goToBillPage(wholeBill);
      })
    });
  }
}
