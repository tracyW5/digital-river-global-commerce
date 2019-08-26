/* minicart-iPhone6.js */
import { Selector } from 'testcafe';
import config from '../../config';
import HomePage from '../../page-models/public/home-page-model';

fixture `====== minicart-iPhone6 ======`;

const env = config.env;
const baseURL = config.baseUrl[env];
const homePage = new HomePage();


test('Verify minicart lineItem quanaity exist in iPhone6 portrait', async t => {
  await t
    .navigateTo(baseURL)
    .resizeWindowToFitDevice('iPhone 6', {
      portraitOrientation: true
    })
    .click(homePage.addProduct)
    .click(homePage.mobileViewHamburgList)
    .click(homePage.minicartToggle)
    .click('.dr-minicart-toggle')
    .expect(Selector('.dr-minicart-display').exists).ok()
    .expect(Selector('.dr-minicart-item-qty').innerText).eql('Qty.1')
    .takeScreenshot('BWC/minicart-iPhone6-portrait.png');
});

/*
Currently, testcafe doesn't have entire page screenshot feature available. A short-term solution is to use
resizeWindow and run test script in headless mode.

More details:
https://github.com/DevExpress/testcafe/issues/1520
*/
test('Verify minicart lineItem quanaity exist in iPhone6 landscape', async t => {
  await t
    .navigateTo(baseURL)
    .resizeWindowToFitDevice('iPhone 6', {
      portraitOrientation: false
    })
    .click(homePage.addProduct)
    .click(homePage.mobileViewHamburgList)
    .click(homePage.minicartToggle)
    .click('.dr-minicart-toggle')
    .expect(Selector('.dr-minicart-display').exists).ok()
    .expect(Selector('.dr-minicart-item-qty').innerText).eql('Qty.1')
    .resizeWindow(667, 375)
    .takeScreenshot('BWC/minicart-iPhone6-landscape.png');
});
