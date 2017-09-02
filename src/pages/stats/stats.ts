import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { UserInfo} from '../../providers/user-info/user-info';
import { BillDatabase } from "../../providers/bill-database/bill-database";
import {CategoriesService} from '../../providers/categories-service/categories-service';
import { Chart } from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {
  bills;
  selectedDay;
  stats;
  storesArray;
  categories;
  chartData;
  chartLabels;
  viewInit = false;
  expanded = false;
  colors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    '#ccc'
  ];
  @ViewChild('doughnutCanvas') doughnutCanvas;
  doughnutChart: any;

  constructor(
    public navCtrl: NavController,
    public billDatabase: BillDatabase,
    public navParams: NavParams,
    public categoriesService: CategoriesService,
    private rd: Renderer2
  ) {
    this.stats = 'days';

    this.selectedDay = new Date();
    this.selectedDay.setHours(this.selectedDay.getHours() + 3);
    this.selectedDay = this.selectedDay.toISOString();

    this.billDatabase.retreiveAllBills().subscribe((data) =>{
      this.bills = data;
      this.dateHasChanged("stores");
    });
    categoriesService.getCategories().subscribe((data)=>
    {
      this.categories = data;
      this.dateHasChanged("categories");
    });
    console.log(this.categories);
  }

  ngAfterViewInit() {
    //console.log("donu",this.doughnutCanvas)
    this.viewInit = true;
    this.createChart(this.chartLabels, this.chartData);
  }


  dateHasChanged(Case){
    let startDate, endDate;
    if(this.stats == 'days'){
      startDate = endDate = this.selectedDay;
      startDate = new Date(startDate); startDate.setHours(startDate.getHours() - 3);
      endDate = new Date(endDate); endDate.setHours(endDate.getHours() - 3);
    }
    if(Case == "stores"){
      this.getStores(startDate, endDate);
    }
    if(Case == "categories"){
      this.getCategories(startDate, endDate);
    }
  }


  getStores(startDate, endDate){
    let storesObj: {[k: string]: any} = {};
    let storesArr= [];

    /* ================== CASES  ================== */

    if(this.stats == "days"){
      for(let bill of this.bills){
        let billDate = new Date(bill.dateISO);
        billDate.setHours(billDate.getHours() - 3);

        if(startDate.getDate() <= billDate.getDate() && billDate.getDate() <= endDate.getDate()
        && billDate.getMonth() == startDate.getMonth()
        && billDate.getFullYear() == startDate.getFullYear()){
          if(storesObj[bill.storeName]){
            storesObj[bill.storeName]  += bill.totalAmount;
          }
          else{
            storesObj[bill.storeName] = bill.totalAmount;
          }
        }
      }
    }

    if(this.stats == "month"){
      //
    }

    /* ================== SORTING  ================== */

    for(let key in storesObj){
      storesArr.push({
        name: key,
        amount: Math.round(storesObj[key] * 100) / 100,
        color: ""
      });
    }
    storesArr.sort(function(a, b){ return (b.amount - a.amount);});
    this.storesArray = storesArr;
    for(let i = 0; i < this.storesArray.length; i++){
      if(i <= 6){
        this.storesArray[i].color = this.colors[i];
      }
      else{
        this.storesArray[i].color = this.colors[6];
      }
    }


    if(this.storesArray.length > 0){
      /* ================== CREATING CHART DATA AND LABELS  ================== */

      this.chartLabels = [];
      this.chartData = [];
      for(let store of this.storesArray){
        if(this.chartLabels.length > 6){
          this.chartLabels[this.chartLabels.length - 1] = "Others";
          this.chartData[this.chartData.length - 1] += store.amount;
        }
        else{
          this.chartLabels.push(store.name);
          this.chartData.push(store.amount);
        }
      }
      console.log("chartData", this.chartLabels, this.chartData);
      if(this.viewInit){
        //nu e bun this.createChart(this.chartLabels, this.chartData)
        this.removeData(this.doughnutChart);
        let auxArr = [];
        auxArr.push(this.chartData);
        console.log(this.doughnutChart, this.chartLabels, this.chartData)
        this.addData(this.doughnutChart, this.chartLabels, this.chartData);
      }
    }
  }

  getCategories(startDate, endDate){
    
  }


  addData(chart, labels, data) {
    chart.data.labels = labels;
    chart.data.datasets.forEach((dataset) => {
      dataset.data = data;
    });
    chart.update();
  }
  removeData(chart) {
    chart.data.labels = [];
    chart.data.datasets.forEach((dataset) => {
      dataset.data = [];
    });
    chart.update();
  }
  createChart(labels, data){
    //setTimeout(()=>{console.log((this.doughnutCanvas))},100);
    console.log("chart created")

    if(this.storesArray.length){
      //setTimeout(()=>{
        console.log("doughtnut 1", this.doughnutChart,labels,data)
        Chart.defaults.global.legend.display = false;
        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
          type: 'doughnut',
          data: {
            labels: labels, //["Red", "Blue", "Yellow", "Green", "Purple", "Orange", "Grey"],
            datasets: [{
              label: '# of Votes',
              data: data,//[105,104,20],
              backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                '#ccc'
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#424242"
              ]
            }]
          }
        });
        console.log("doughtnut 2", this.doughnutChart)
      //},1);
    }
  }

  showHideStoresList(){
    this.expanded = !this.expanded;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatsPage');
  }
}
