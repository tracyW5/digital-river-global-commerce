import { Selector } from 'testcafe';

export default class CartPage {
  constructor() {
    this.proceedToCheckoutBtn = Selector('a').withText('PROCEED TO CHECKOUT');
  }
}
