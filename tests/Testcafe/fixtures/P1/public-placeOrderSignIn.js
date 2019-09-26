import { Selector } from 'testcafe';
import config from '../../config';
import HomePage from '../../page-models/public/home-page-model';
import MinicartPage from '../../page-models/public/minicart-page-model';
import CartPage from '../../page-models/public/cart-page-model';
import CheckoutPage from '../../page-models/public/checkout-page-model';
import TYPage from '../../page-models/public/ty-page-model';

fixture `===== DRGC Automation Test =====`;

const env = config.env;
const baseURL = config.baseUrl[env];
const homePage = new HomePage();
const minicartPage = new MinicartPage();
const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();
const tyPage = new TYPage();
const num = Date.now();
const newEmail = 'qa' + num + '@dr.com'

test('Place order as a new customer', async t => {
  await t
      .navigateTo(baseURL)
      .expect(Selector('body').hasClass('hfeed')).ok()
      .maximizeWindow();

  await homePage.createNewCustomer(newEmail);
  console.log('>>New Customer created successfully');

  await t
    .click(homePage.productsMenu)
    .click(homePage.addPhyProduct)
    .expect(minicartPage.viewCartBtn.exists).ok();

  await homePage.userSignIn(newEmail);
  console.log('>>User login successfully');

  await t
    .expect(homePage.cartBtn.exists).ok()
    .expect(homePage.checkoutBtn.exists).ok()
    .click(homePage.cartBtn)
    .expect(cartPage.proceedToCheckoutBtn.exists).ok()
    .takeScreenshot('BWC/cart_s.jpg');
  console.log('>>Directs to the Cart page');

  await t
    .click(homePage.signIn)
    .click(homePage.checkoutBtn)
    .expect(checkoutPage.emailTexts.textContent).eql(newEmail)
    .expect(checkoutPage.shippingFirstName.value).eql('JOHN')
    .expect(checkoutPage.shippingLastName.value).eql('DOE')
    .takeScreenshot('BWC/shipping_s.jpg');;

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

  await checkoutPage.checkoutDelivery('standard');
  await t.expect(checkoutPage.submitPaymentBtn.exists).ok();
  console.log('>>Checkout page - completes DELIVERY OPTIONS');

  await checkoutPage.fillCreditCardInfo();
  console.log('>>Checkout page - completes PAYMENT INFO.');

  await t
    .takeScreenshot('BWC/payment_s.jpg')
    .click(checkoutPage.submitBtn)
    .expect(tyPage.tyMsg.innerText).eql('Your order was completed successfully.')
    .takeScreenshot('BWC/TY_s.jpg');

  console.log('>>Directs to the TY page');
  const orderNum = await tyPage.orderNumber.textContent;
  console.log(orderNum.trim());
});