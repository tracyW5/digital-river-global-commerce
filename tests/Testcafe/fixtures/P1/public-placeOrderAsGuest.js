import { Selector, ClientFunction } from 'testcafe';
import config from '../../config';
import HomePage from '../../page-models/public/home-page-model';
import MinicartPage from '../../page-models/public/minicart-page-model';
import CartPage from '../../page-models/public/cart-page-model';
import CheckoutPage from '../../page-models/public/checkout-page-model';
import TYPage from '../../page-models/public/ty-page-model';

const env = config.env;
const baseURL = config.baseUrl[env];
const testEmail = config.testEmail;
const homePage = new HomePage();
const minicartPage = new MinicartPage();
const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();
const tyPage = new TYPage();

fixture `===== DRGC Automation Test =====`
  .beforeEach(async t => {
    await t
      .navigateTo(baseURL)
      .maximizeWindow()
      .click(homePage.productsMenu)
      .expect(Selector('body').hasClass('hfeed')).ok()
});

test('Place order with physical product', async t => {
  await t
    .click(homePage.addPhyProduct)
    .takeScreenshot('BWC/minicart.jpg');
  await minicartPage.clickViewCartBtn();
  console.log('>>Directs to the Cart page');

  await t
    .takeScreenshot('BWC/cart.jpg')
    .click(cartPage.proceedToCheckoutBtn)
    .expect(checkoutPage.primary.exists).ok();
  console.log('>>Directs to the Checkout page');

  await checkoutPage.checkoutEmail(testEmail);
  await t.expect(checkoutPage.shippingBtn.exists).ok();
  console.log('>>Checkout page - completes EMAIL');

  await checkoutPage.checkoutShipping();
  await t.expect(checkoutPage.billingCheckbox.exists).ok();
  console.log('>>Checkout page - completes SHIPPING INFO.');

  //Billing address is different from shipping
  await t
    .click(checkoutPage.billingCheckbox)
    .expect(checkoutPage.billingBtn.exists).ok();

  await checkoutPage.checkoutBilling();
  await t.expect(checkoutPage.deliveryBtn.exists).ok();
  console.log('>>Checkout page - completes BILLING INFO.');

  await checkoutPage.checkoutDelivery('express');
  await t.expect(checkoutPage.submitPaymentBtn.exists).ok();
  console.log('>>Checkout page - completes DELIVERY OPTIONS');

  await checkoutPage.fillCreditCardInfo();
  console.log('>>Checkout page - completes PAYMENT INFO.');

  await t
    .takeScreenshot('BWC/payment.jpg')
    .click(checkoutPage.submitBtn)
    .expect(tyPage.tyMsg.innerText).eql('Your order was completed successfully.')
    .takeScreenshot('BWC/TY.jpg');

  console.log('>>Directs to the TY page');
  const orderNum = await tyPage.orderNumber.textContent;
  console.log(orderNum.trim());
});

test('Place order with digital product', async t => {
  await t
    .click(homePage.addDigiProduct)
    .takeScreenshot('BWC/minicart_d.jpg');
  await minicartPage.clickViewCartBtn();
  console.log('>>Directs to the Cart page');

  await t
    .takeScreenshot('BWC/cart_d.jpg')
    .click(cartPage.proceedToCheckoutBtn)
    .expect(checkoutPage.primary.exists).ok();
  console.log('>>Directs to the Checkout page');

  await checkoutPage.checkoutEmail(testEmail);
  await t.expect(checkoutPage.billingBtn.exists).ok();
  console.log('>>Checkout page - completes EMAIL');

  await checkoutPage.checkoutBilling();
  await t.expect(checkoutPage.submitPaymentBtn.exists).ok();
  console.log('>>Checkout page - completes BILLING INFO.');

  await checkoutPage.fillCreditCardInfo();
  console.log('>>Checkout page - completes PAYMENT INFO.');

  await t
    .takeScreenshot('BWC/payment_d.jpg')
    .click(checkoutPage.submitBtn)
    .expect(tyPage.tyMsg.innerText).eql('Your order was completed successfully.')
    .takeScreenshot('BWC/TY_d.jpg');

  console.log('>>Directs to the TY page');
  const orderNum = await tyPage.orderNumber.textContent;
  console.log(orderNum.trim());
});
