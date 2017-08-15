import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditBillPage } from './edit-bill';

@NgModule({
  declarations: [
    EditBillPage,
  ],
  imports: [
    IonicPageModule.forChild(EditBillPage),
  ],
  exports: [
    EditBillPage
  ]
})
export class EditBillPageModule {}
