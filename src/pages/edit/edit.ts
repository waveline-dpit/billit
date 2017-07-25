import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { MyAccountPage } from "../my-account/my-account";
import { UserInfo} from "../../providers/user-info/user-info";

@IonicPage()
@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {
  public firstName;
  public lastName;
  public email;
  public oldFirstName;
  public oldLastName;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public userInfo: UserInfo
  )
  {
    userInfo.getUserInfo().subscribe((user)=>
  {
    this.oldFirstName = user.firstName;
    this.oldLastName = user.lastName;
    this.email = userInfo.getUserEmail();

  })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPage');
  }
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Change Password',
      inputs: [
        {
          name: 'old password',
          placeholder: 'Old Password',
        },
        {
          name: 'new password',
          placeholder: 'New Password',
        },
        {
          name: 'confirm password',
          placeholder: 'Confirm Password',
        }
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
  saveData() {
    if(this.firstName && this.lastName)
    {
      this.userInfo.changeUserData(this.firstName, this.lastName);
      this.navCtrl.push(MyAccountPage);
    }

  }
}
