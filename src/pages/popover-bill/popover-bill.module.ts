import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverBillPage } from './popover-bill';

@NgModule({
  declarations: [
    PopoverBillPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverBillPage),
  ],
  exports: [
    PopoverBillPage
  ]
})
export class PopoverBillPageModule {}
