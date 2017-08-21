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

@IonicPage()
@Component({
  selector: 'page-bills',
  templateUrl: 'bills.html',
})
export class BillsPage {
  logoutButton = {};
  bills;
  cat;
  fabb: FabContainer;
  clicked_fab = false;

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
  )
  {
    billDatabase.retreiveAllBills().subscribe((data) =>{
      this.bills = data;
    });
    document.addEventListener("touchstart", () => {this.closeFabIfActive();});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BillsPage');
  }

  goToBillPage(bill)
  {
    this.billDatabase.bill = bill;
    this.navCtrl.push(BillPage);
  }

  goToLoginPage()
  {
    console.log(this.authService.logOut());
  }
  goToAddBillPage()
  {
    this.navCtrl.push(AddBillPage);

  }
  closeFab(fab: FabContainer) {
    setTimeout(() => {
      fab.close ();
      this.clicked_fab = false;
    }, 100);
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
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
  showAlert(){
    let alert = this.alerCtrl.create({
      title: 'Warning',
      message: 'Are you sure you want to delete this bill?',
      buttons: ['No' , 'Yes']
    });
    alert.present()
  }
  clickedFab(fab){
    setTimeout(() => {
      this.clicked_fab = true;
      this.fabb = fab;
    }, 300);
  }
  closeFabIfActive(){
    if(this.clicked_fab)
    {
      //console.log(this.fabb)
      if(this.fabb._listsActive)
      {
        this.closeFab(this.fabb);
      }
    }
  }
}
