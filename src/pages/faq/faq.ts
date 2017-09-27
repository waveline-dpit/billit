import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FaqPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {

  questions = [
    {
      question: "How can i add a bill?",
      answer: `By clicking on the red "plus" button in the bottom right corner on "Bills" page. You can then choose to scan it's QR, add it manually or take a photo of it.`
    },
    {
      question: `How can i delete a bill?`,
      answer: `By swiping right on the bill listed on "Bills" page or by clicking on the "plus" button in the top right corner of the bill's page and then hitting "Delete".`
    },
    {
      question: `How can I find a specific bill?`,
      answer: `By clicking on the search button in the top left corner on "Bills" page. You can then search for a bill's number, a store or a product. Another alternative is to add that bill to "Favourites".`
    },
    {
      question: `What does "Favourites" mean?`,
      answer: `Adding a bill to "Favourites" (by swiping right on the bill) helps you highlight the ones that are important to you. You can find them all by clicking on the filter button in the top right corner of "Bills" page and hitting "Favourites".`
    },
    {
      question: `What does "Trusted" mean?`,
      answer: `The bills listed on "Trusted" with the store icon in green are the ones you added by scanning a QR from a trusted store. You can use those bills to return your products just like you would use the original paper bill.`
    },
    {
      question: `What is a trusted store?`,
      answer: `A trusted store is a partner of ours that offers you the option to scan a bill's QR and have it on your phone instead of using the actual paper bill.`
    },
    {
      question: `I've entered the bill's information wrong. How can i edit that bill?`,
      answer: `By clicking on the "plus" button in the top right corner of the bill's page and hitting "Edit".  You will not be able to edit a "Trusted" bill.`
    },
    {
      question: `What should i do if the bill's information aren't displayed correctly after i took a photo of the bill?`,
      answer: `Follow the steps explained in the question above.`
    },
    {
      question: `What's the deal with "Categories"?`,
      answer: `This is a feature that helps you keep track of the products you bought and better organise yourself. Either it's about coffe, vegetables or clothes, you can manually add a product to a category like this after you've added the bill and then see some statistics about them.`
    },
    {
      question: `What's the difference between adding a product to a category and adding a bill to a category?`,
      answer: `You can add the whole bill to a category by clicking on the "plus" button in the top right corner of the bill's page and then hitting "Add to category". This will add all the products to the chosen category.`
    },
    {
      question: `Why can't I see any category? `,
      answer: `Because you have to add one first. This can be done by clicking on the "plus"  button on "Categories" page and the hitting "Add a new category" or by swiping right on a bill from "Bills" page and then clicking the "plus" button.`
    },
    {
      question: `What the deal with "Share" button?`,
      answer: `The "Share" button, accessible by clicking on the "plus" button in the top right corner of the bill's page displays the QR code of that bill that you can then show to others.`
    },
    {
      question: `Why can't I scan a QR/barcode?`,
      answer: `Scanning a random QR or barcode will do nothing. You can only scan QR codes of a bill from a trusted store or from other's people phones.`
    },
  ];
  expanded = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.questions)
    for(let i = 0; i < this.questions.length; i++)
    {
      this.expanded[i] = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FaqPage');
  }

  expand(i){
    this.expanded[i] = !this.expanded[i];
  }
}
