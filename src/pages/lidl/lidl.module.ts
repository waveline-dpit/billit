import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LidlPage } from './lidl';

@NgModule({
  declarations: [
    LidlPage,
  ],
  imports: [
    IonicPageModule.forChild(LidlPage),
  ],
  exports: [
    LidlPage
  ]
})
export class LidlPageModule {}
