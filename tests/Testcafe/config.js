let config = {
  env: 'dev', // local: dev; staging/systest: sys; production/demo: prod
  apiEnv: 'PRD',
  testEmail: 'qa@dr.com',
  username: 'pwang', //localhost admin username
  password: 'Tvt2test!', //localhost admin and testing password
  testingProducts: [
    {
      productID: '5104521700',
      productName: 'Digital River Gaming Headset',
      permalink: 'digital-river-gaming-headset'
    },
    {
      productID: '5104502000',
      productName: 'Digital River Internet Security For Mac',
      permalink: 'digital-river-internet-security-for-mac'
    }
  ],
  baseUrl: {
    dev: 'http://localhost/BWC/',
    sys: 'http://tpedevapp0264.d010.digitalriverws.net/',
    prod: 'http://wordpress.c141.digitalriverws.net/',
    demo: 'http://gcwpdemo.wpengine.com',
  },
  apiUrl: {
    PRD: 'https://api.digitalriver.com',
    NONPRD: 'https://dispatch-test.digitalriver.com',
  },
  drSettings: {
    siteID:     'drdod15',
    apiKey:     '99477953970e432da4d89b982f6bcc49',
    apiSecret:  'a4dccc3558ec4e09ae2879864f900f24',
    domainInput:  'api.digitalriver.com',
    pluginKey:  '6eb251a648bc4e6b87b24671262f2e91',
  },
};

module.exports = config;
