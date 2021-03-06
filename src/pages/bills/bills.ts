import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
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
import { Camera, CameraOptions } from '@ionic-native/camera';
import { extendMoment } from 'moment-range';
import { Http } from '@angular/http';
import { Base64 } from '@ionic-native/base64';
import Tesseract from 'tesseract.js';

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
  @ViewChild('searchBar') searchBar;
  savedBills;
  searchInput;
  searchPlaceholder;
  searchBarOpened = false;

  intervals = [];
  intervalToShow = [];
  loading;
  allowCamera;
  notice;
  isClassVisible = true;
  presentationBill = "noBill";

  constructor(
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public popoverCtrl: PopoverController,
    public billDatabase: BillDatabase,
    public userInfo: UserInfo,
    public db: AngularFireDatabase,
    public categoriesService: CategoriesService,
    public alerCtrl: AlertController,
    private barcodeScanner: BarcodeScanner,
    private camera: Camera,
    public http: Http,
    public base64:Base64
  )
  {
    this.buildIntervals();
    /*/allowCamera*/
    billDatabase.db.object("/allowCamera").subscribe((data)=>{
      this.allowCamera = data.$value;
      console.log("allow",this.allowCamera)
    });
    billDatabase.db.object("/notice").subscribe((data)=>{
      this.notice = data.$value;
    });
    billDatabase.db.object("/presentationBill").subscribe((data)=>{
      this.presentationBill = data;
    });
    billDatabase.retreiveAllBills().subscribe((data) =>{
      this.bills = data;
      if(this.searchBarOpened){
        this.startedSearch();
      }
      else{
        console.log(this.bills)
        this.billsToShow = data;
        this.sortBills();
      }
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
        let billdate = moment(auxDate.setHours(auxDate.getHours() - Math.abs((new Date(this.billsToShow[i].dateISO)).getTimezoneOffset()) / 60)).startOf('day');
        for(let intervalIndex in this.intervals){
          if(this.intervals[intervalIndex].range.contains(billdate)){
            if(usedInterval[intervalIndex] == null){
              this.intervalToShow[i] = this.intervals[intervalIndex].name;
              usedInterval[intervalIndex] = true;
            }
            break;
          }
        }
      }
      //console.log(this.intervalToShow);
    }
    if(this.sortOption == "dateAsc"){
      this.billsToShow = this.bills;
      this.billsToShow.sort(function(a, b){
        a = new Date(a.dateISO);
        b = new Date(b.dateISO);
        return (a - b);
      });
      this.intervalToShow = [];
      let copyIntervals = this.intervals;
      copyIntervals.reverse();
      console.log(copyIntervals, this.intervals);
      let usedInterval = [];
      for(let i in this.billsToShow){
        let auxDate = new Date(this.billsToShow[i].dateISO);
        let billdate = moment(auxDate.setHours(auxDate.getHours() - Math.abs((new Date(this.billsToShow[i].dateISO)).getTimezoneOffset()) / 60)).startOf('day');
        for(let intervalIndex in copyIntervals){
          if(copyIntervals[intervalIndex].range.contains(billdate)){
            if(usedInterval[intervalIndex] == null){
              this.intervalToShow[i] = this.intervals[intervalIndex].name;
              usedInterval[intervalIndex] = true;
            }
            break;
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
    if(this.sortOption == "trusted"){
      let trustedBills = [];
      for(let bill of this.bills){
        if(bill.QR != null){
          trustedBills.push(bill);
        }
      }
      this.billsToShow = trustedBills;
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

  /* ============================================= FAB AND SCAN ============================================= */

  closeFab(fab: FabContainer) {
    console.log("fab closed")
    fab.close();
    this.clicked_fab = false;
  }

  clickedFab(fab){
    console.log("fab clicked")
    this.clicked_fab = !this.clicked_fab;
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
          if(bill.b.QR != null){
            billInfo.QR = true;
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
      });
      setTimeout(()=>{this.closeFab(this.fabb);},500);
    }

  addBillFromScan(bill, products){
    let path = '/user/' + this.userInfo.getUserToken() + '/bills';
    let user : FirebaseListObservable <any>;
    user = this.db.list(path);
    user.push(bill).then((response) => {
      let billPath;
      if(response.path.o != null){
        billPath =  path + '/' + response.path.o[3];
        path = path + '/' + response.path.o[3] + '/products';
      }
      else{
        if(response.path.pieces_ != null){
          billPath =  path + '/' + response.path.pieces_[3];
          path = path + '/' + response.path.pieces_[3] + '/products';
        }
      }
      user = this.db.list(path);
      for (let eachProduct of products) {
        user.push(eachProduct);
      }
      this.db.object(billPath).first().subscribe(wholeBill =>{
          console.log(wholeBill)
          this.goToBillPage(wholeBill);
      })
    });
  }

  showAlertCamera(){
    let alert = this.alerCtrl.create({
      title: 'Notice',
      message: this.notice,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }]
    });
    alert.present()
  }

  openCamera()
  {
    if(this.allowCamera == false){
      this.showAlertCamera();
    }
    else{
      const options: CameraOptions = {
        quality: 60,
        destinationType:  this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true,
        allowEdit: true
        }
      console.log("opened camera")
      this.camera.getPicture(options).then((imageData) => {
        console.log("taken picture");
        /*
        ca sa mearga trebuie adaugat
        https://cdn.rawgit.com/waveline-dpit/billit/3e234118/src/assets/langs/
        in fata la oriunde scrie langPath din node_modules/tesseract.js
        */
        this.presentLoadingCustom();
        Tesseract.recognize(imageData, {lang: "billfont3"})
            .then((result) => {
              console.log(result.text);
              this.interpretText(result);
            });
      }, (err) => {
        console.log(err);
      });
    }
    this.closeFab(this.fabb);
  }

  interpretText(tesseractResult){
    let billInfo = {
      date: "",
      dateISO: "",
      time: "",
      favourite: false,
      number: Number((Math.floor((Math.random() * 10) + 1)).toString() + (Math.floor((Math.random() * 10) + 1)).toString() + (Math.floor((Math.random() * 10) + 1)).toString() + (Math.floor((Math.random() * 10) + 1)).toString()),
      totalAmount: 0,
      storeName: ""
    }
    console.log(tesseractResult);
    var _dateISO = this.setDate();
    var _Time = this.setTime();
    var _Date = this.formatDate((new Date()).toISOString());
    var text;
    let products = [];
    let recognizedText = tesseractResult.text;
    var result;
    var pretTotal = 0;

    var prod = /([a-zA-Z0-9]*,?\.?[a-zA-Z0-9]*) X ?([a-zA-Z0-9]*,?\.?[a-zA-Z0-9]*)\n*([a-zA-Z ',.-]*)/g;
    var numeMagazin = /(.+\bS\.R\.L|SRL|S\.C\.|S\.C\.S|SCS|S-C- |S-C \b.*)/g;
    var shopName = numeMagazin.exec(recognizedText);
    var shopName2;

    if(shopName != null){
      shopName2 = this.sanitizeName(shopName[1]);
    }
    console.log(recognizedText)
    while (result = prod.exec(recognizedText)) {
      console.log("intra in while")
      if(result != null){
        var product = this.sanitizeProduct(result[3]);
      }
      if(result != null){
        var price = this.sanitizePrice(result[2]);
        if(isNaN(price)){
          price = 0;
        }
      }
      if(result != null){
        var qtity = this.sanitizePrice(result[1]);
        if(isNaN(qtity)){
          qtity = 0;
        }
      }

      let productt = {
        name: "",
        quantity: 0,
        pricePerUnit: 0,
        totalPrice: 0
      }
      if(product != null) {productt.name = product;}
      if(price != null && !isNaN(price)) {productt.pricePerUnit =  Math.round(Number(price) * 100) / 100;}
      if(qtity != null && !isNaN(qtity)) {productt.quantity = Math.trunc(Number(qtity));}
      var pretProdus = Math.round(parseFloat(((Math.round(Number(price) * 100) / 100) * Math.trunc(Number(qtity))).toString()) * 100) / 100;
      console.log("produs: ", product, "pret: ", price, "cantitate: ", qtity);
      if(pretProdus != null && !isNaN(pretProdus)) {productt.totalPrice = pretProdus;}
      pretTotal = pretTotal + pretProdus;
      pretTotal = Math.round(parseFloat(pretTotal.toString()) * 100) / 100

      products.push(productt);
    }
    if(_Date != null) {billInfo.date = _Date;}
    if(_dateISO != null) {billInfo.dateISO =_dateISO;}
    if(_Time != null) {billInfo.time = _Time;}
    if(pretTotal != null && !isNaN(pretTotal)) {billInfo.totalAmount = pretTotal;}
    if(shopName2 != null) {billInfo.storeName = shopName2;}
    console.log("products", products)
    console.log("billInfo", billInfo);
    if(this.loading){
      this.loading.dismiss();
    }
    if(products.length > 0){
      this.addBillFromCamera(billInfo, products);
    }
    else{
      this.presentCouldNotAddFromCameraAlert();
    }
  }

  /******************************************************* Chira ********************************************************/

  presentCouldNotAddFromCameraAlert(){
    let alert = this.alerCtrl.create({
      title: 'Error',
      message: `Tesseract OCR couldn't read this bill. Please try again.`,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }]
    });
    alert.present()
  }
  sanitizeProduct(proDuct){
    return proDuct
            .replace(/[.,]/i, 'I')
            .replace(1, 'T')
            .replace(8, 'B')
            .replace(2, 'Z')
            .replace(5, 'S');
  }
  sanitizePrice(pRice)
  {
    return pRice
            .replace(',', '.')
            .replace('S', 5)
            .replace('Z', 2)
            .replace('E', 0)
            .replace('O', 0)
            .replace('B', 0)
            .replace('E', 0)
            .replace(/[TI]/i, 1);
  }
  sanitizeName(Name)
  {
    return Name
            .replace('-', '.')
            .replace("PROFL", "PROFI")
            .replace("PROFU", "PROFI")
            .replace("FOOO", "FOOD")
            .replace("PROF.", "PROFI")
            .replace("PROFO", "PROFI")
            .replace("PROH", "PROFI")
            .replace("PROFL", "PROFI")
            .replace("GARREFOUR", "CARREFOUR")
            .replace(8, 'B')
            .replace(5, 'S')
            .replace(2, 'Z')
            .replace(9, 'G');

  }
  setTime(){
    let hour = (new Date().getHours()).toString();
    let min = (new Date().getMinutes()).toString();
    if(Number(hour) < 10) { hour = "0" + hour;}
    if(Number(min) < 10) { min = "0" + min;}
    return hour + ":" + min;
  }
  setDate(){
    let date = new Date();
    date.setHours(date.getHours() + 3);
    let date2 = date.toISOString();
    return date2;
  }
  formatDate(date)
  {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    var day = date.substring(8, 10);
    var monthIndex = Number(date.substring(5, 7));
    var year = date.substring(0, 4);

    return  day + ' ' + monthNames[monthIndex - 1] + ' ' + year;
  }


    /*******************************************************end Chira ********************************************************/

  addBillFromCamera(bill, products){
    let path = '/user/' + this.userInfo.getUserToken() + '/bills';
    let user : FirebaseListObservable <any>;
    user = this.db.list(path);
    user.push(bill).then((response) => {
      let billPath;
      if(response.path.o != null){
        billPath =  path + '/' + response.path.o[3];
        path = path + '/' + response.path.o[3] + '/products';
      }
      else{
        if(response.path.pieces_[3] != null){
          billPath =  path + '/' + response.path.pieces_[3];
          path = path + '/' + response.path.pieces_[3] + '/products';
        }
      }
      user = this.db.list(path);
      for (let eachProduct of products) {
        user.push(eachProduct);
      }
      this.db.object(billPath).first().subscribe(wholeBill =>{
          console.log(wholeBill)
          this.goToBillPage(wholeBill);
      })
    });
  }

presentLoadingCustom() {
  this.loading = this.loadingCtrl.create({
    spinner: 'hide',
    content: `
    <div class="cssload-thecube">
      <div class="cssload-cube cssload-c1"></div>
      <div class="cssload-cube cssload-c2"></div>
      <div class="cssload-cube cssload-c4"></div>
      <div class="cssload-cube cssload-c3"></div>
    </div>
    <div class="loader-text">The image is being processed by Tesseract OCR</div>
    `,
  });

  this.loading.present();
}


  /* ============================================= SEARCH ============================================= */

  openSearchBar(){
    this.searchBarOpened = true;
    setTimeout(()=>{
      this.searchBar.setFocus();
      this.searchPlaceholder = "Search";
    },100);
    this.savedBills = this.billsToShow;
    this.billsToShow = [];
    console.log("opened search bar")
  }

  startedSearch(){
    let searchText;
    if(this.searchInput != null){
       searchText = this.searchInput.toLowerCase();
       this.billsToShow = [];
    }
    if(searchText != "" && searchText != null){
      for(let bill of this.bills){
        let billNumber = bill.number;
        if((typeof billNumber) == "number"){
          billNumber = billNumber.toString();
        }
        if(billNumber .search(new RegExp(searchText, "i")) == 0){
          this.billsToShow.push(bill);
        }
        else{
          if(bill.storeName.search(new RegExp(searchText, "i")) == 0){
            this.billsToShow.push(bill);
          }
          else{
            for(let i in bill.products){
              if(bill.products[i].name.search(new RegExp(searchText, "i")) == 0){
                this.billsToShow.push(bill);
              }
            }
          }
        }
      }
    }
  }

  clearedSearch(){
    if(this.searchBarOpened){
      this.billsToShow = [];
    }
    console.log("cleared search")
  }

  onBlurSearch(){
    setTimeout(()=>{
      if(this.searchBarOpened){
        this.searchBar.setFocus();
      }
    },1500);
  }

  canceledSearch(){
    let searchBar = document.getElementById("searchBarID");
    searchBar.classList.remove("appear-search");
    searchBar.classList.add("disappear-search");
    this.searchPlaceholder = "";
    setTimeout(()=>{
      searchBar.classList.remove("disappear-search");
      searchBar.classList.add("appear-search");
      this.searchBarOpened = false;
      console.log("canceled search")
      this.billsToShow = this.savedBills;
    },290);
  }

}
