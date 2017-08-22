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
import { BarcodeScanner} from '@ionic-native/barcode-scanner'

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
  qrData;
  createdCode;
  scannedCode;

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
    billDatabase.retreiveAllBills().subscribe((data) =>{
      this.bills = data;
    });
    document.addEventListener("touchstart", () => {this.closeFabIfActive()});
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
  addBillFromScan(bill, products)
  {
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
