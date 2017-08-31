import { Component } from '@angular/core';
import { BillsPage } from "../bills/bills";
import { StatsPage } from "../stats/stats";
import { OffersPage } from "../offers/offers";
import { MorePage } from "../more/more";
import  {Keyboard} from '@ionic-native/keyboard';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = BillsPage;
  tab2Root = StatsPage;
  tab3Root = OffersPage;
  tab4Root = MorePage;
  valueforngif=true;
  VV = [{name:"333333"}];


  constructor(public keyboard: Keyboard) {
    let arr =document.getElementsByClassName("tabbar"   );
    console.log(arr.length, arr, arr[0])
    for (var i = 0; i < arr.length; i++) {
          console.log(arr[i]  ); //second console output
      }
    //setTimeout(()=>{this.valueforngif=false;},2000);
    keyboard.onKeyboardShow().subscribe(()=>{
      console.log("keyboard openedd")
        //document.getElementsByClassName("tabbar").item(0).style.display = "none";
    })
    keyboard.onKeyboardHide().subscribe(()=>{console.log("keyboard closed", window.screen.height )})
  }

}
