import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { GooglePlus } from '@ionic-native/google-plus';

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
import { CategoriesPage } from '../pages/categories/categories';
import { ShareModalPage } from '../pages/share-modal/share-modal';
import { SlidesPage } from "../pages/slides/slides";
import { FaqPage } from "../pages/faq/faq";


import { AuthService } from '../providers/auth-service/auth-service';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AddBillPage } from "../pages/add-bill/add-bill";
import { PopoverPage } from "../pages/popover/popover";
import { PopoverBillPage } from "../pages/popover-bill/popover-bill";
import { PopoverSortPage } from "../pages/popover-sort/popover-sort";
import { PopoverCategoriesPage } from "../pages/popover-categories/popover-categories";
import { AboutPage } from "../pages/about/about";
import { UserInfo } from '../providers/user-info/user-info';
import { UserRegister } from '../providers/user-register/user-register';
import { BillDatabase } from '../providers/bill-database/bill-database';
import { CategoriesService} from '../providers/categories-service/categories-service';
import { HttpModule } from '@angular/http';
import { EditBillPage } from "../pages/edit-bill/edit-bill";
import { NgxQRCodeModule} from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import {Camera} from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';
import { NativeStorage } from '@ionic-native/native-storage';


// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyChS1MAx054ivrlEw-0xyqzfPZp09EUKtE",
  authDomain: "waveline-4de4d.firebaseapp.com",
  databaseURL: "https://waveline-4de4d.firebaseio.com",
  storageBucket: "waveline-4de4d.appspot.com",
  messagingSenderId: "983236088103"
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
    LidlPage,
    PopoverBillPage,
    PopoverSortPage,
    AboutPage,
    EditBillPage,
    CategoriesPage,
    ShareModalPage,
    PopoverCategoriesPage,
    SlidesPage,
    FaqPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpModule,
    NgxQRCodeModule
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
    PopoverBillPage,
    PopoverSortPage,
    AboutPage,
    EditBillPage,
    CategoriesPage,
    ShareModalPage,
    PopoverCategoriesPage,
    SlidesPage,
    FaqPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    UserInfo,
    UserRegister,
    BillDatabase,
    GooglePlus,
    CategoriesService,
    Camera,
    Base64,
    NativeStorage
  ]
})
export class AppModule {}
