/* searchbox-iPhone6.js */
import { Selector } from 'testcafe';
import config from '../../config';
import HomePage from '../../page-models/public/home-page-model';

fixture `====== searchbox-iPhone6 ======`;

const env = config.env;
const baseURL = config.baseUrl[env];
const homePage = new HomePage();


test('Verify searchbox is visible in iPhone6 portrait mode', async t => {
  await t
    .navigateTo(baseURL)
    .resizeWindowToFitDevice('iPhone 6', {
      portraitOrientation: true
    })
    .click(homePage.addProduct)
    .click(homePage.mobileViewHamburgList)
    .click(homePage.searchboxToggle)
    .expect(Selector('.main-search-input').exists).ok()
    .takeScreenshot('BWC/searchbox-iPhone6-portrait.png');
});

test('Verify searchbox is visible in iPhone6 landscape mode', async t => {
  await t
    .navigateTo(baseURL)
    .resizeWindowToFitDevice('iPhone 6', {
      portraitOrientation: false
    })
    .click(homePage.addProduct)
    .click(homePage.mobileViewHamburgList)
    .click(homePage.searchboxToggle)
    .expect(Selector('.main-search-input').exists).ok()
    .takeScreenshot('BWC/searchbox-iPhone6-landscape.png');
});
