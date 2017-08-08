import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { MyAccountPage } from "../my-account/my-account";
import { UserInfo} from "../../providers/user-info/user-info";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  fcfname; fclname;
  editAccForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public userInfo: UserInfo
  )
  {
    userInfo.getUserInfo().subscribe((user)=>
    {
      this.oldFirstName = user.firstName;
      this.oldLastName = user.lastName;
      this.email = userInfo.getUserEmail();
      this.firstName = user.firstName;
      this.lastName = user.lastName;
    });
    this.editAccForm = formBuilder.group({
      fcfname:['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      fclname: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    });
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
    }
    else if(this.firstName)
    {
      this.userInfo.changeUserData(this.firstName, this.oldLastName);
    }
    else if(this.lastName)
    {
      this.userInfo.changeUserData(this.oldFirstName, this.lastName);
    }
    this.navCtrl.pop();
  }
}
