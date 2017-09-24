import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { BillsPage } from '../pages/bills/bills';
import {AuthService} from '../providers/auth-service/auth-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { TabsPage } from '../pages/tabs/tabs';
import { Http } from '@angular/http';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  templateUrl: 'app.html',
  providers: [Keyboard]
})
export class MyApp {
  rootPage:any;
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public authService : AuthService,
    public afAuth: AngularFireAuth,
    public http : Http
   )
   {
    platform.ready().then(() => {
      const authObserver = this.afAuth.authState.subscribe(user => {
        if(user){
          this.rootPage= TabsPage;
        }
        else{
          this.rootPage = LoginPage;
        }

      });
      statusBar.styleDefault();
      splashScreen.hide();

      if (platform.is('ios')) {
        console.log('ios');
      } else console.log('not ios');
    });
  }
}
