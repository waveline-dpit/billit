import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController, ViewController } from 'ionic-angular';

/**
 * Generated class for the ShareModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-share-modal',
  templateUrl: 'share-modal.html'

})
export class ShareModalPage {

  billToShare;
  createdCode;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public params: NavParams,
    public viewCtrl: ViewController,
    public platform: Platform,
  ) {
    this.billToShare = this.params.get('bill');
    //console.log(this.billToShare);
    this.createdCode = {
      b:{
        dt: this.billToShare.date,
        dISO: this.billToShare.dateISO,
        nr: this.billToShare.number,
        sN: this.billToShare.storeName,
        t: this.billToShare.time,
        tA: this.billToShare.totalAmount
      },
      pr: []
    }
    for(let i in this.billToShare.products){
      //console.log(this.billToShare.products[i])
      let product = {
        n: this.billToShare.products[i].name,
        U: this.billToShare.products[i].pricePerUnit,
        qty: this.billToShare.products[i].quantity,
        tp: this.billToShare.products[i].totalPrice
      }
      this.createdCode.pr.push(product);
    }
    console.log(this.createdCode);
    let copyy = this.createdCode;
    this.createdCode = JSON.stringify(copyy);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShareModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


}
