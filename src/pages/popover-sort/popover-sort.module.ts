import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverSortPage } from './popover-sort';

@NgModule({
  declarations: [
    PopoverSortPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverSortPage),
  ],
  exports: [
    PopoverSortPage
  ]
})
export class PopoverSortPageModule {}
