import { Component } from '@angular/core';
import { BillsPage } from "../bills/bills";
import { StatsPage } from "../stats/stats";
import { OffersPage } from "../offers/offers";
import { MorePage } from "../more/more";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = BillsPage;
  tab2Root = StatsPage;
  tab3Root = OffersPage;
  tab4Root = MorePage;

  constructor() {

  }
}
