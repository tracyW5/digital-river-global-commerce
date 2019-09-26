import { Selector, t } from 'testcafe';
import config from '../../config';

const physicalProd = config.testingProducts[0].productID;
const DigitalProd = config.testingProducts[1].productID;

export default class HomePage {
  constructor() {
    this.productsMenu = Selector('[title="Products"]');
    this.signIn = Selector('.menu-sign-in > a.nav-link');
    this.addPhyProduct = Selector('.dr-buy-btn[data-product-id="' + physicalProd + '"]');
    this.addDigiProduct = Selector('.dr-buy-btn[data-product-id="' + DigitalProd + '"]');

    this.firstName = Selector('[name="first_name"]');
    this.lastName = Selector('[name="last_name"]');
    this.ueMail = Selector('[name="uemail"]');
    this.uPW = Selector('[name="upw"]');
    this.uPW2 = Selector('[name="upw2"]');
    this.signUpBtn = Selector('.dr-signup');
    this.logOutBtn = Selector('.dr-logout');
    this.userName = Selector('[name="username"]');
    this.userPW = Selector('[name="password"]');
    this.logInBtn = Selector('#dr-auth-submit');

    this.cartBtn = Selector('a.btn.dr-btn:nth-child(1)');
    this.checkoutBtn = Selector('a.btn.dr-btn:nth-child(2)');
  }

  async createNewCustomer(userEmail) {
    await t
      .click(this.signIn)
      .expect(this.signUpBtn.exists).ok()
      .typeText(this.firstName, 'JOHN', { replace: true })
      .typeText(this.lastName, 'DOE', { replace: true })
      .typeText(this.ueMail, userEmail, { replace: true })
      .typeText(this.uPW, config.password, { replace: true })
      .typeText(this.uPW2, config.password, { replace: true })
      .takeScreenshot('BWC/signup.jpg')
      .click(this.signUpBtn)
      .expect(this.logOutBtn.exists).ok()
      .click(this.logOutBtn)
      .expect(this.signUpBtn.exists).ok();
  }

  async userSignIn(userEmail) {
    await t
      .click(this.signIn)
      .expect(this.logInBtn.exists).ok()
      .typeText(this.userName, userEmail, { replace: true })
      .typeText(this.userPW, config.password, { replace: true })
      .takeScreenshot('BWC/login.jpg')
      .click(this.logInBtn)
      .expect(this.logOutBtn.exists).ok();
  }
}
