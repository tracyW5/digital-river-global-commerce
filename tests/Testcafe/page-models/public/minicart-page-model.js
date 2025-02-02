import { Selector, t } from 'testcafe';

export default class MinicartPage {
  constructor() {
    this.miniCartToggle = Selector('.dr-minicart-toggle');
    this.viewCartBtn = Selector('#dr-minicart-view-cart-btn');
    this.checkoutBtn = Selector('#dr-minicart-checkout-btn');
  }

  async clickViewCartBtn() {
    await t
      .click(this.viewCartBtn)
      .expect(Selector('a').withText('PROCEED TO CHECKOUT').exists).ok();
  }

  async clickCheckoutBtn() {
    await t
      .click(this.checkoutBtn)
      .expect(Selector('.dr-btn').exists).ok();
  }
}
