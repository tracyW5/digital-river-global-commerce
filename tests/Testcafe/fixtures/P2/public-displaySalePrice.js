import { Selector } from 'testcafe';
import config from '../../config';

fixture `Displaying Sale Price`;

const baseURL = config.baseUrl[config.env];
const getSaleBuyBtn = (pId) => Selector(`button[data-product-id="${pId}"]`);
const getRegularPrice = (buyBtn, parent) => buyBtn.parent(parent).find('.dr-strike-price');
const getSalePrice = (buyBtn, parent) => buyBtn.parent(parent).find('.dr-sale-price');
const getMinicartItem = (pId) => Selector(`li.dr-minicart-item > div[data-product-id="${pId}"]`);

test('HomeOffer & Minicart price', async t => {
  const loader = Selector('#dr-home-offers .dr-loader');
  const pdItem = Selector('#dr-home-offers .dr-pd-item');
  const minicartLink = Selector('.dr-minicart-toggle');
  const saleBuyBtn = getSaleBuyBtn(config.testingProducts[0].productID);
  const regularPrice = getRegularPrice(saleBuyBtn, 'a');
  const salePrice = getSalePrice(saleBuyBtn, 'a');
  const minicartItem = getMinicartItem(config.testingProducts[0].productID);
  const minicartRegularPrice = minicartItem.find('p.dr-minicart-item-price > .dr-strike-price');
  const minicartSalePrice = minicartItem.find('p.dr-minicart-item-price > .dr-sale-price');

  await t
    .navigateTo(baseURL)
    .maximizeWindow();

  if (!await pdItem.count) await t.expect(loader.exists).ok();

  await t
    .expect(pdItem.count).eql(8)
    .expect(loader.exists).notOk()
    .expect(saleBuyBtn.exists).ok()
    .expect(regularPrice.exists).ok()
    .expect(salePrice.exists).ok();

  await t
    .wait(500)
    .click(saleBuyBtn)
    .click(minicartLink)
    .expect(minicartItem.exists).ok()
    .expect(minicartRegularPrice.exists).ok()
    .expect(minicartSalePrice.exists).ok();
});

test('Category page price', async t => {
  const saleBuyBtn = getSaleBuyBtn(config.testingProducts[1].productID);
  const regularPrice = getRegularPrice(saleBuyBtn, 'a');
  const salePrice = getSalePrice(saleBuyBtn, 'a');

  await t
    .navigateTo(`${baseURL}/dr_product_category/${config.testingCategories[0].categoryID}`)
    .maximizeWindow()
    .expect(saleBuyBtn.exists).ok()
    .expect(regularPrice.exists).ok()
    .expect(salePrice.exists).ok();
});

test('PD page price', async t => {
  const saleBuyBtn = getSaleBuyBtn(config.testingProducts[0].productID);
  const regularPrice = getRegularPrice(saleBuyBtn, 'form');
  const salePrice = getSalePrice(saleBuyBtn, 'form');

  await t
    .navigateTo(`${baseURL}/dr_product/${config.testingProducts[0].permalink}`)
    .maximizeWindow()
    .expect(saleBuyBtn.exists).ok()
    .expect(regularPrice.exists).ok()
    .expect(salePrice.exists).ok();
});
