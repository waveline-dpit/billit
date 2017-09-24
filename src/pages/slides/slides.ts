import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import {  FabContainer } from 'ionic-angular';

/**
 * Generated class for the SlidesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html',
})
export class SlidesPage {
  @ViewChild('fab')  fabb;
  @ViewChild('slidingItem1') sliding1;
  @ViewChild('slidingItem2') sliding2;
  @ViewChild(Slides) slides: Slides;
  favButton1;
  favButton2;
  button;
  moved1; moved2;
  currentIndex = 0;
  favourite = false;
  clicked_fab = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SlidesPage');
  }
  ngAfterViewInit(){
    this.button = document.getElementById('fabButton');
  }

  slideChanged() {
    this.currentIndex = this.slides.getActiveIndex();
    if(this.currentIndex == 1 && !this.moved1){
      this.moved1 = true;
      setTimeout(()=>{
        this.click(1);
      }, 1000);
    }
    if(this.currentIndex == 2 && !this.moved2){
      this.moved2 = true;
      setTimeout(()=>{
        this.slide(1, false);
      }, 1000);
    }
  }

  click(pas){
    if(pas >= 10) {
      return;
    }
    this.button.click();
    setTimeout(()=>{
      this.closeFab(this.fabb);
      setTimeout(()=>{
        this.click(pas + 1);
      }, 2000)
    }, 2000)
  }

  slide(pas, favButton){
    if(pas >= 10) {
      return;
    }
    this.sliding1._setOpenAmount(100);
    setTimeout(()=>{
      if(favButton == false){
        this.favButton1 = document.getElementById('fav1');
        if(this.favButton1){
          this.favButton1.click();
        }
      }
      if(favButton == true){
        this.favButton2 = document.getElementById('fav2');
        if(this.favButton2){
          this.favButton2.click();
        }
      }
      setTimeout(()=>{
        this.sliding2._setOpenAmount(-100);
        setTimeout(()=>{
          this.sliding2.close();
          setTimeout(()=>{
            this.slide(pas + 1, !favButton);
          }, 1000)
        }, 1500)
      }, 1000)
    }, 1000)
  }

  closeFab(fab: FabContainer) {
    console.log("fab closed")
    fab.close();
    this.clicked_fab = false;
  }

  clickedFab(fab){
    console.log("fab clicked")
    this.clicked_fab = !this.clicked_fab;
    this.fabb = fab;
  }

  addToFavourite(slidingItem){
    this.favourite = true;
    setTimeout(() => {slidingItem.close()}, 300);
  }

  removeFromFavourite(slidingItem){
    this.favourite = false;
    setTimeout(() => {slidingItem.close()}, 300);
  }
  endTutorial(){
    this.navCtrl.pop();
  }
}
