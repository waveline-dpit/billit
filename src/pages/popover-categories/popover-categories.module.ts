import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverCategoriesPage } from './popover-categories';

@NgModule({
  declarations: [
    PopoverCategoriesPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverCategoriesPage),
  ],
  exports: [
    PopoverCategoriesPage
  ]
})
export class PopoverCategoriesPageModule {}
