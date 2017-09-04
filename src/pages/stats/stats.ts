import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { UserInfo} from '../../providers/user-info/user-info';
import { BillDatabase } from "../../providers/bill-database/bill-database";
import {CategoriesService} from '../../providers/categories-service/categories-service';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {
  bills;
  selectedDay;
  selectedMonth;
  intervalStart;
  intervalEnd;
  stats;
  storesArray;
  storesArrayEmpty = true;
  categoriesArrayEmpty = true;
  categories;
  chartData;
  chartLabels;
  barChartData;
  barChartLabels;
  categoriesArray;
  total;
  viewInit = false;
  expanded = false;
  expandedBar = false;
  colors = [
    'rgba(255, 76, 76, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    '#ccc'
  ];
  barColors = [
    'rgba(255, 76, 76, 0.4)',
    'rgba(54, 162, 235, 0.4)',
    'rgba(255, 206, 86, 0.4)',
    'rgba(75, 192, 192, 0.4)',
    'rgba(153, 102, 255, 0.4)',
    'rgba(255, 159, 64, 0.4)',
    '#ccc'
  ];
  @ViewChild('doughnutCanvas') doughnutCanvas;
  doughnutChart: any;
  @ViewChild('barCanvas') barCanvas;
  barChart: any;


  constructor(
    public navCtrl: NavController,
    public billDatabase: BillDatabase,
    public navParams: NavParams,
    public categoriesService: CategoriesService,
    private rd: Renderer2
  ) {
    let d = new Date();
    //this.GMTOffset = Math.abs(new Date().getTimezoneOffset()) / 60;

    this.stats = 'days';

    this.selectedDay = new Date();
    this.selectedDay.setHours(this.selectedDay.getHours() + Math.abs(new Date().getTimezoneOffset()) / 60);
    this.selectedDay = this.selectedDay.toISOString();
    this.selectedMonth = new Date();
    this.selectedMonth.setHours(this.selectedMonth.getHours() + Math.abs(new Date().getTimezoneOffset()) / 60);
    let aux = this.selectedMonth.toISOString().slice(0, 7);
    this.selectedMonth = aux;
    this.intervalStart = this.intervalEnd = this.selectedDay;

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
    this.createDoughnutChart(this.chartLabels, this.chartData);
    this.createBarChart(this.barChartLabels, this.barChartData);
  }

  dateHasChanged(_case){
    let startDate, endDate;
    if(this.stats == 'days'){
      startDate = endDate = this.selectedDay;
      startDate = new Date(startDate); startDate.setHours(startDate.getHours() - Math.abs(new Date(startDate).getTimezoneOffset()) / 60);
      endDate = new Date(endDate); endDate.setHours(endDate.getHours() - Math.abs(new Date(endDate).getTimezoneOffset()) / 60);
    }
    if(this.stats == 'months'){
      startDate = this.selectedMonth;
      endDate = new Date(this.selectedMonth);
      startDate = new Date(startDate); startDate.setHours(startDate.getHours() - Math.abs(new Date(startDate).getTimezoneOffset()) / 60);
      endDate = new Date(endDate); endDate.setHours(endDate.getHours() - Math.abs(new Date(endDate).getTimezoneOffset()) / 60);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setSeconds(endDate.getSeconds() - 1);
    }
    if(this.stats == 'intervals'){
      startDate = this.intervalStart;
      endDate = this.intervalEnd;
      startDate = new Date(startDate); startDate.setHours(startDate.getHours() - Math.abs(new Date(startDate).getTimezoneOffset()) / 60);
      endDate = new Date(endDate); endDate.setHours(endDate.getHours() - Math.abs(new Date(endDate).getTimezoneOffset()) / 60);
    }
    console.log(startDate,endDate)
    if(_case == "stores"){
      this.getStores(startDate, endDate);
      console.log("stores")
    }
    if(_case == "categories"){
      this.getCategories(startDate, endDate);
      console.log("categories")
    }
    if(_case == "both"){
      this.getStores(startDate, endDate);
      this.getCategories(startDate, endDate);
      console.log("both")
    }
  }

  getStores(startDate, endDate){
    let storesObj: {[k: string]: any} = {};
    let storesArr= [];

    /* ================== CASES  ================== */

    if(this.stats == "days" || this.stats == "months"){
      this.total = 0;
      for(let bill of this.bills){

        let billDate = new Date(bill.dateISO);
        billDate.setHours(billDate.getHours() - Math.abs((new Date(bill.dateISO)).getTimezoneOffset()) / 60);

        if(startDate.getDate() <= billDate.getDate() && billDate.getDate() <= endDate.getDate()
        && billDate.getMonth() == startDate.getMonth()
        && billDate.getFullYear() == startDate.getFullYear()){
          if(storesObj[bill.storeName]){
            storesObj[bill.storeName]  += bill.totalAmount;
          }
          else{
            storesObj[bill.storeName] = bill.totalAmount;
          }
          this.total += bill.totalAmount;
        }
      }
    }

    if(this.stats == "intervals"){
      this.total = 0;
      for(let bill of this.bills){

        let billDate = new Date(bill.dateISO);
        billDate.setHours(billDate.getHours() - Math.abs((new Date(bill.dateISO)).getTimezoneOffset()) / 60);
        const moment = extendMoment(Moment);
        moment.locale('en-AU');
        let range = moment.range(moment(startDate).startOf('day').toDate(), moment(endDate).toDate());

        if(range.contains((moment(billDate).startOf('day')))){
          if(storesObj[bill.storeName]){
            storesObj[bill.storeName]  += bill.totalAmount;
          }
          else{
            storesObj[bill.storeName] = bill.totalAmount;
          }
          this.total += bill.totalAmount;
        }
      }
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
          this.chartData[this.chartData.length - 1] = Math.round(this.chartData[this.chartData.length - 1] * 100) / 100;
        }
        else{
          this.chartLabels.push(store.name);
          this.chartData.push(store.amount);
        }
      }
      if(this.viewInit){
        if(this.storesArrayEmpty){
          this.storesArrayEmpty = false;
          setTimeout(()=>{
            this.createDoughnutChart(this.chartLabels, this.chartData);
          },100);
        }
        else{
          this.removeData(this.doughnutChart);
          let auxArr = [];
          auxArr.push(this.chartData);
          this.addData(this.doughnutChart, this.chartLabels, this.chartData);
        }
      }
    }
    else{
      this.storesArrayEmpty = true;
    }
  }

  getCategories(startDate, endDate){
    let categoriesObj: {[k: string]: any} = {};
    let categoriesArr= [];

    if(this.stats == "days" || this.stats == "months"){
      for(let category of this.categories){
        for(let i in category.products){

          let product = category.products[i];
          let productDate = new Date(product.dateISO);
          productDate.setHours(productDate.getHours() - Math.abs((new Date(product.dateISO)).getTimezoneOffset()) / 60);

          if(startDate.getDate() <= productDate.getDate() && productDate.getDate() <= endDate.getDate()
          && productDate.getMonth() == startDate.getMonth()
          && productDate.getFullYear() == startDate.getFullYear()){
            if(categoriesObj[category.name]){
              categoriesObj[category.name]  += product.totalPrice;
            }
            else{
              categoriesObj[category.name] = product.totalPrice;
            }
          }
        }
      }
    }
    if(this.stats == "intervals"){
      for(let category of this.categories){
        for(let i in category.products){

          let product = category.products[i];
          let productDate = new Date(product.dateISO);
          productDate.setHours(productDate.getHours() - Math.abs((new Date(product.dateISO)).getTimezoneOffset()) / 60);
          const moment2 = extendMoment(Moment);
          moment2.locale('en-AU');
          let range = moment2.range(moment(startDate).clone().startOf('day').toDate(), moment(endDate).clone().toDate());

          if(range.contains((moment(productDate).clone().startOf('day')))){
            if(categoriesObj[category.name]){
              categoriesObj[category.name]  += product.totalPrice;
            }
            else{
              categoriesObj[category.name] = product.totalPrice;
            }
          }
        }
      }
    }

    /* ================== SORTING  ================== */

    for(let key in categoriesObj){
      categoriesArr.push({
        name: key,
        amount: Math.round(categoriesObj[key] * 100) / 100,
        color: ""
      });
    }
    categoriesArr.sort(function(a, b){ return (b.amount - a.amount);});
    this.categoriesArray = categoriesArr;

    for(let i = 0; i < this.categoriesArray.length; i++){
      if(i <= 6){
        this.categoriesArray[i].color = this.barColors[i];
      }
      else{
        this.categoriesArray[i].color = this.barColors[6];
      }
    }

    if(this.categoriesArray.length > 0){
      /* ================== CREATING CHART DATA AND LABELS  ================== */

      this.barChartLabels = [];
      this.barChartData = [];
      for(let category of this.categoriesArray){
        if(this.barChartLabels.length > 6){
          this.barChartLabels[this.barChartLabels.length - 1] = "Others";
          this.barChartData[this.barChartData.length - 1] += category.amount;
          this.barChartData[this.barChartData.length - 1] = Math.round(this.barChartData[this.barChartData.length - 1] * 100) / 100;
        }
        else{
          this.barChartLabels.push(category.name);
          this.barChartData.push(category.amount);
        }
      }
      if(this.viewInit){
        if(this.categoriesArrayEmpty){
          this.categoriesArrayEmpty = false;
          setTimeout(()=>{
            this.createBarChart(this.barChartLabels, this.barChartData);
          },100);
        }
        else{
          this.removeData(this.barChart);
          let auxArr = [];
          auxArr.push(this.barChartData);
          this.addData(this.barChart, this.barChartLabels, this.barChartData);
        }
      }
    }
    else{
      this.categoriesArrayEmpty = true;
    }
  }


  addData(chart, labels, data) {
    chart.data.labels = labels;
    chart.data.datasets.forEach((dataset) => {
      dataset.data = data;
    });
    console.log()
    chart.update();
  }
  removeData(chart) {
    chart.data.labels = [];
    chart.data.datasets.forEach((dataset) => {
      dataset.data = [];
    });
    chart.update();
  }

  createDoughnutChart(labels, data){
    this.doughnutChart = null;
    console.log("chart created")

    if(this.storesArray.length){
      Chart.defaults.global.legend.display = false;
      this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: labels, //["Red", "Blue", "Yellow", "Green", "Purple", "Orange", "Grey"],
          datasets: [{
            label: '#',
            data: data,//[105,104,20],
            backgroundColor: [
              'rgba(255, 76, 76, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              '#ccc'
            ],
            hoverBackgroundColor: [
              "#FF4C4C",
              "#36A2EB",
              "#FFCE56",
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#ccc"
            ]
          }]
        }
      });
    }
  }

  createBarChart(labels, data){
    //Chart.defaults.global.barThickness = 2;
    if(this.categoriesArray.length){
      this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: 'horizontalBar',
        data: {
          labels: labels,
          datasets: [{
            label: 'price',
            data: data,
            backgroundColor: [
              'rgba(255, 76, 76, 0.3)',
              'rgba(54, 162, 235, 0.3)',
              'rgba(255, 206, 86, 0.3)',
              'rgba(75, 192, 192, 0.3)',
              'rgba(153, 102, 255, 0.3)',
              'rgba(255, 159, 64, 0.3)',
              '#ccc'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              '#ccc'
            ],
            borderWidth: 1
          }]
        },
        options: {
          legend: {
            display: false,
          },
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              display: false,
              gridLines: {
                display:false
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero:true
              },
              barThickness: 27,
              lineHeight: 15
            }]
          }
        }
      });
    }
  }

  showHideStoresList(){
    this.expanded = !this.expanded;
  }

  showHideCategoriesList(){
    this.expandedBar = !this.expandedBar;
  }

  changeStatsValue(_case){
    setTimeout(()=>{
      this.createDoughnutChart(this.chartLabels, this.chartData);
      this.createBarChart(this.barChartLabels, this.barChartData);
      //setTimeout(()=>{console.log("!!!!!!!!!!!!!", _case,this.doughnutChart, this.doughnutCanvas);},1000);
    },200);
    this.dateHasChanged("both");
    console.log(this.stats);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatsPage');
  }
}
