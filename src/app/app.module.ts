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
    FrgPasswordPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
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
    FrgPasswordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
