import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddBillPage } from './add-bill';

@NgModule({
  declarations: [
    AddBillPage,
  ],
  imports: [
    IonicPageModule.forChild(AddBillPage),
  ],
  exports: [
    AddBillPage
  ]
})
export class AddBillPageModule {}
