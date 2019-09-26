import { Role } from 'testcafe';
import config from '../config';
const env = config.env;
const url = config.baseUrl[env] + '/wp-login.php';

const user = Role(url, async t => {
  await t
    .wait(500)
    .typeText('#user_login', config.username)
    .typeText('#user_pass', config.password)
    .click('#wp-submit');
}, { preserveUrl: true });

module.exports = user;
