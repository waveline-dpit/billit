import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EditPage } from "../edit/edit";
import { LoginPage } from "../login/login";
import {AuthService} from '../../providers/auth-service/auth-service'
import {UserInfo} from '../../providers/user-info/user-info'
import {AngularFireAuth} from 'angularfire2/auth'

/**
 * Generated class for the MyAccountPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
})
export class MyAccountPage {
  logoutButton = {};
  public firstName : string;
  public lastName : string;
  public accEmail : string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public userInfo: UserInfo,
    public afAuth: AngularFireAuth
   )
   {
     userInfo.getUserInfo().subscribe((user) =>{
       this.firstName = user.firstName;
       this.lastName = user.lastName;
       this.accEmail = this.afAuth.auth.currentUser.email;
   });
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyAccountPage');
  }

 goToEditPage() {
    this.navCtrl.push(EditPage);
  }
  goToLoginPage()
  {
    this.authService.logOut();
  }
}
