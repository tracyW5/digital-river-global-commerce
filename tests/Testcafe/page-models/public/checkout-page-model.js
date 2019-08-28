import { Selector, t } from 'testcafe';

export default class CheckoutPage {
  constructor() {
    this.primary = Selector('#primary');

    this.email = Selector('#checkout-email-form > div > input');
    this.emailTexts = Selector('#dr-panel-email-result');

    this.emailBtn = Selector('#checkout-email-form > button');
    this.shippingBtn = Selector('#checkout-shipping-form > button');
    this.billingBtn = Selector('#checkout-billing-form > button');
    this.delOptionExpress = Selector('.field-radio:nth-child(1)');
    this.delOptionStandard = Selector('.field-radio:nth-child(2)');
    this.deliveryBtn = Selector('#checkout-delivery-form > button');
    this.billingCheckbox = Selector('#checkbox-billing');
    this.submitPaymentBtn = Selector('#dr-submit-payment');
    this.submitBtn = Selector("#checkout-confirmation-form > button");

    this.shippingFirstName = Selector('#shipping-field-first-name');
    this.shippingLastName = Selector('#shipping-field-last-name');
    this.shippingAddress1 = Selector('#shipping-field-address1');
    this.shippingCity = Selector('#shipping-field-city');
    this.shippingState = Selector('#shipping-field-state');
    this.shippingPostalCode = Selector('#shipping-field-zip');
    this.shippingCountry = Selector('#shipping-field-country');
    this.shippingPhoneNumber = Selector('#shipping-field-phone');

    // Billing Address Info.
    this.billingFirstName = Selector('#billing-field-first-name');
    this.billingLastName = Selector('#billing-field-last-name');
    this.billingAddress1 = Selector('#billing-field-address1');
    this.billingCity = Selector('#billing-field-city');
    this.billingPostalCode = Selector('#billing-field-zip');
    this.billingState = Selector('#billing-field-state');
    this.billingCountry = Selector('#billing-field-country');
    this.billingPhoneNumber = Selector('#billing-field-phone');

    // Payment Info.
    this.creditCard = Selector('#radio-credit-card');
    this.cardNumberIframe = Selector('#card-number > iframe');
    this.ccNumber = Selector('#ccNumber');
    this.cardExpIframe = Selector('#card-expiration > iframe');
    this.ccExpiry = Selector('#ccExpiry');
    this.cardCVVIframe = Selector('#card-cvv > iframe');
    this.ccCVV = Selector('#ccCVV');
  }

  async checkoutEmail(testEmail) {
    await t
      .typeText(this.email, testEmail)
      .click(this.emailBtn);
  }

  async checkoutShipping() {
    const shippingStateOption = this.shippingState.find('option');
    const shippingCountryOption = this.shippingCountry.find('option');

    await t
      .typeText(this.shippingFirstName, 'Helen', { replace: true })
      .typeText(this.shippingLastName, 'Mcclinton', { replace: true })
      .typeText(this.shippingAddress1, '10451 Gunpowder Falls St')
      .typeText(this.shippingCity, 'Las Vegas')
      .click(this.shippingCountry)
      .click(shippingCountryOption.withText('United States of America'))
      .expect(this.shippingCountry.value).eql('US')
      .click(this.shippingState)
      .click(shippingStateOption.withText('Nevada'))
      .expect(this.shippingState.value).eql('NV')
      .typeText(this.shippingPostalCode, '89123')
      .typeText(this.shippingPhoneNumber, '7028962624')
      .click(this.shippingBtn);
  }

  async checkoutBilling() {
    const billingStateOption = this.billingState.find('option');
    const billingCountryOption = this.billingCountry.find('option');

    await t
      .typeText(this.billingFirstName, 'John', { replace: true })
      .typeText(this.billingLastName, 'Doe', { replace: true })
      .typeText(this.billingAddress1, '10380 Bren Rd W')
      .typeText(this.billingCity, 'Minnetonka')
      .click(this.billingState)
      .click(billingStateOption.withText('Minnesota'))
      .expect(this.billingState.value).eql('MN')
      .typeText(this.billingPostalCode, '55343')
      .click(this.billingCountry)
      .click(billingCountryOption.withText('United States of America'))
      .expect(this.billingCountry.value).eql('US')
      .typeText(this.billingPhoneNumber, '9522531234')
      .click(this.billingBtn);
  }

  async checkoutDelivery(delOption) {
    if (delOption === 'express') {
      await t.click(this.delOptionExpress);
    }
    else if (delOption === 'standard') {
        await t.click(this.delOptionStandard);
    }

    await t.click(this.deliveryBtn);
  }

  async fillCreditCardInfo() {
    const currentTime = new Date();
    const year = (currentTime.getFullYear() + 3).toString();

    await t
      .click(this.creditCard)
      .switchToIframe(this.cardNumberIframe)
      .typeText(this.ccNumber, '4444222233331111')
      .switchToMainWindow()
      .switchToIframe(this.cardExpIframe)
      .typeText(this.ccExpiry, '01'+ year.slice(-2))
      .switchToMainWindow()
      .switchToIframe(this.cardCVVIframe)
      .typeText(this.ccCVV, '123')
      .switchToMainWindow()
      .click(this.submitPaymentBtn);
  }
}
