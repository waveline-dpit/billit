import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController, Platform } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { PopoverBillPage } from "../popover-bill/popover-bill";
import { BillDatabase } from "../../providers/bill-database/bill-database"
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {UserInfo} from '../../providers/user-info/user-info';
import {CategoriesService} from '../../providers/categories-service/categories-service';
/**
 * Generated class for the BillPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-bill',
  templateUrl: 'bill.html',
})
export class BillPage {
  public bill;
  keys;
  billAlert;
  productAlert;
  categories;
  produsAlert;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public billDatabase: BillDatabase,
    public popoverCtrl: PopoverController,
    public userInfo: UserInfo,
    public db: AngularFireDatabase,
    public categoriesService: CategoriesService
  )
  {
    db.object("/user/" + this.userInfo.getUserToken() + "/bills/" + billDatabase.bill.$key).subscribe((data) =>
    {
      this.bill = data;
    });
    this.keys = Object.keys(this.bill.products);
    categoriesService.getCategories().subscribe((data)=>
    {
      this.categories = data;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BillPage');
    //console.log(this.bill);
  }

  showCategories(product, id, billId) {
    console.log("prod", product)
    this.productAlert = this.alertCtrl.create();
    this.productAlert.setTitle('Select categories');

    for(let category of this.categories)
    {
      let isChecked;
      if(product.categoryID != null)
      {
        if(product.categoryID[category.$key]){
          isChecked = true;
        }
        else{
          isChecked = false;
        }
      }
      else
        isChecked = false;
      this.productAlert.addInput({
        type: 'checkbox',
        label: category.name,
        value: category.$key,
        checked: isChecked
      });
    }
    this.productAlert.addButton('Cancel');
    this.productAlert.addButton({
      text: 'Okay',
      handler: data => {
        this.categoriesService.unCheckAllProdctFromCat(id, billId);
        let pathBill = "/user/" + this.userInfo.getUserToken() + "/bills/" + billId + "/products/" + id + "/categoryID";
        this.db.object(pathBill).remove().then(()=>
        {
          for(let cat of data)
          {
            this.categoriesService.addProductToCategory(product, cat, id, billId);
          }
        })
      }
    });
    this.productAlert.present();
  }

  addCategory() {
    let prompt = this.alertCtrl.create({
      title: 'New category',
      message: "Add a new category for your products",
      inputs: [
        {
          name: 'title',
          placeholder: 'ex: vegetables'
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
            this.categoriesService.addCategory(data.title);
          }
        }
      ]
    });
    prompt.present();
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverBillPage, { 'billParam': this.bill });
    popover.present({
      ev: myEvent
  });
  }
}
