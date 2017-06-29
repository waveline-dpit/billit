import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillPage } from './bill';

@NgModule({
  declarations: [
    BillPage,
  ],
  imports: [
    IonicPageModule.forChild(BillPage),
  ],
  exports: [
    BillPage
  ]
})
export class BillPageModule {}
