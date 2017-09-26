import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { BillsPage } from '../pages/bills/bills';
import { SlidesPage } from '../pages/slides/slides';
import {AuthService} from '../providers/auth-service/auth-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { TabsPage } from '../pages/tabs/tabs';
import { Http } from '@angular/http';
import { Keyboard } from '@ionic-native/keyboard';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  templateUrl: 'app.html',
  providers: [Keyboard]
})
export class MyApp {
  public rootPage:any;
  enteredTutorial = null;
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public authService : AuthService,
    public afAuth: AngularFireAuth,
    public http : Http,
    private nativeStorage: NativeStorage
   )
   {
    platform.ready().then(() => {
      this.nativeStorage.getItem('myitem')
      .then(
        data => {console.log(data); this.enteredTutorial = data;},
        error => console.error(error)
      );
      const authObserver = this.afAuth.authState.subscribe(user => {
        if(user)
        {
          if(this.enteredTutorial == null){
            this.rootPage = SlidesPage;
            splashScreen.hide();
          }
          else{
            this.rootPage= TabsPage;
            splashScreen.hide();
          }
        }
        else{
          this.rootPage = LoginPage;
          splashScreen.hide();
        }

      });
      statusBar.styleDefault();

      if (platform.is('ios')) {
        console.log('ios');
      } else console.log('not ios');
    });
  }
}
