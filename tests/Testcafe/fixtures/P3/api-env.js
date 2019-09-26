import { RequestLogger, Selector } from 'testcafe';
import config from '../../config';
import HomePage from '../../page-models/public/home-page-model';

const logger = new RequestLogger();
const env = config.env;
const baseURL = config.baseUrl[env];
const homePage = new HomePage();
const apiURL = config.apiUrl[config.apiEnv];
let apiCheck = false;

fixture `API Environment TEST`
  .page(baseURL)
  .requestHooks(logger);

test('Verify API Environment', async t => {
  await t
    .expect(Selector('body').hasClass('page-home')).ok()
    .maximizeWindow()
    .click(homePage.addProduct)
    .click(homePage.minicartToggle)
    .click(homePage.minicartCheckout);

  console.log("API ENVIROMENT SET:" + config.apiEnv);
  console.log("API ENVIROMENT URL:" + apiURL);
  logger.requests.forEach(function (item, index, array) {
    if (item.request.url.includes(apiURL)) {
      apiCheck = true;
    }
  });
  await t.expect(apiCheck).eql(true);

});