import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';


import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RegisterPage } from "../pages/register/register";
import { FrgPasswordPage } from "../pages/frg-password/frg-password";
import { BillsPage } from "../pages/bills/bills";
import { OffersPage } from "../pages/offers/offers";
import { StatsPage } from "../pages/stats/stats";
import { MorePage } from "../pages/more/more";
import { BillPage } from "../pages/bill/bill";
import { MyAccountPage } from "../pages/my-account/my-account";
import { EditPage } from "../pages/edit/edit";
import { LidlPage } from "../pages/lidl/lidl";

import { AuthService } from '../providers/auth-service/auth-service';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AddBillPage } from "../pages/add-bill/add-bill";
import { PopoverPage } from "../pages/popover/popover";
import { AboutPage } from "../pages/about/about";

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyC0X6Ve3xgobJrXdyF43Zxs1G44-Slrl7Y",
  authDomain: "fir-login-e74e3.firebaseapp.com",
  databaseURL: "https://fir-login-e74e3.firebaseio.com",
  storageBucket: "fir-login-e74e3.appspot.com",
  messagingSenderId: "276005011940"
};

@NgModule({
  declarations: [
    MyApp,
    BillsPage,
    OffersPage,
    StatsPage,
    MorePage,
    TabsPage,
    LoginPage,
    RegisterPage,
    FrgPasswordPage,
    BillPage,
    MyAccountPage,
    EditPage, 
    AddBillPage,
    PopoverPage,
    LidlPage
    LidlPage, 
    AboutPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    BillsPage,
    OffersPage,
    StatsPage,
    MorePage,
    TabsPage,
    LoginPage,
    RegisterPage,
    FrgPasswordPage,
    BillPage,
    MyAccountPage,
    EditPage,
    AddBillPage,
    PopoverPage,
    LidlPage,
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService
  ]
})
export class AppModule {}
