import { Selector, ClientFunction } from 'testcafe';
import config from '../../config';
import CartPage from '../../page-models/public/cart-page-model';

const env = config.env;
const baseURL = config.baseUrl[env];
const cartPage = new CartPage();

fixture `===== Loading Icon For AJAX =====`;

test('Home page should display loading icon when AJAX call is in progress and 8 products when the call is completed', async t => {
  const loader = Selector('#dr-home-offers .dr-loader');
  const pdItem = Selector('#dr-home-offers .dr-pd-item');

  await t.navigateTo(baseURL);
  if (!await pdItem.count) {
    // AJAX call is not completed yet
    await t.expect(loader.exists).ok();
  }
  await pdItem();
  await t
    .expect(pdItem.count).eql(8)
    .expect(loader.exists).notOk();
});

test('PD page should display loading icon when AJAX call is in progress and 4 products when the call is completed', async t => {
  const loader = Selector('#dr-pd-offers .dr-loader');
  const pdItem = Selector('#dr-pd-offers .dr-pd-item');

  await t.navigateTo(`${baseURL}/dr_product/${config.testingProducts[0].permalink}`);
  if (!await pdItem.count) {
    // AJAX call is not completed yet
    await t.expect(loader.exists).ok();
  }
  await pdItem();
  await t
    .expect(pdItem.count).eql(4)
    .expect(loader.exists).notOk();
});

test('Cart page should display loading icon when AJAX call is in progress and iframe when the call is completed', async t => {
  const loader = Selector('.page-dr-cart .dr-loader');

  await t.navigateTo(`${baseURL}/dr-cart`);
  if (!await cartPage.cartIframe.visible) {
    // AJAX call is not completed yet
    await t.expect(loader.exists).ok();
  }
  await cartPage.cartIframe.with({ visibilityCheck: true })();
  await t.expect(loader.exists).notOk();
});
