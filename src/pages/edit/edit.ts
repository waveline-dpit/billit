import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { MyAccountPage } from "../my-account/my-account";
import { UserInfo} from "../../providers/user-info/user-info";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';

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
    public userInfo: UserInfo,
    public afAuth: AngularFireAuth
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
  changePassAlert() {
    let isValid = false;
    let prompt = this.alertCtrl.create({
      title: 'Change Password',
      //message: "Enter your email to receive instructions",
      message: "You will receive an email with instructions on changing your password.",
      /*inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        }
      ],*/
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Okay',
          handler: data => {
            /*if(isValid){
              this.afAuth.auth.sendPasswordResetEmail(data.email);
              return true;
            }
            else{
              return false;
            }*/
            this.afAuth.auth.sendPasswordResetEmail(this.email);
          }
        }
      ]
    });
    prompt.present();

    /*setTimeout(()=>{
      let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      let htmlCollection = document.getElementsByClassName("alert-wrapper");
      let alert = htmlCollection[0];
      let para = document.createElement("p");
      let node = document.createTextNode("Please enter a valid email.");
      para.appendChild(node);
      let input = alert.children[2].children[0].children[0].children[0]; console.log(input, input.children[1], prompt)
      input.addEventListener("keyup",() => {
        let inputValue = prompt.data.inputs[0].value;
        if(inputValue.match(mailformat)){
          isValid = true;
          input.classList.remove("invalid");
          input.classList.add("valid");
          if(alert.children[2].children.length == 2){
            alert.children[2].removeChild(alert.children[2].children[1]);
          }
        }
        else{
          isValid = false;
          input.classList.remove("valid");
          input.classList.add("invalid");
          if(alert.children[2].children.length == 1){
            alert.children[2].appendChild(para);
          }
        }
      });
    },500)*/
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
