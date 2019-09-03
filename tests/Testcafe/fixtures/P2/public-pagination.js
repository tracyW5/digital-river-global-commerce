import { Selector, ClientFunction } from 'testcafe';
import config from '../../config';

const env = config.env;
const baseURL = config.baseUrl[env];
const getLocation = ClientFunction(() => document.location.href);
const pagiCon = Selector('.pagination-container');
const pagiMsg = Selector('.pagination-container > span');
const prevBtn = pagiCon.find('.page-numbers.prev');
const nextBtn = pagiCon.find('.page-numbers.next');

fixture `===== Pagination on PD Category, PD List & Search Page =====`;

test('PD category page should have 2 paginations, at most 10 posts per page with correct message and buttons', async t => {
  await t
    .navigateTo(`${baseURL}/dr_product_category/${config.testingCategories[0].categoryID}`)
    .expect(pagiCon.count).eql(2);

  const pagiMsgText = await pagiMsg.innerText;
  const displayingPosts = parseInt(pagiMsgText.match(/\d+/g)[0]) || 0;
  const totalPosts = parseInt(pagiMsgText.match(/\d+/g)[1]) || 0;
  const expectedPages = Math.ceil(totalPosts / displayingPosts);
  const lastPageBtn = pagiCon.find('.page-numbers').withText(expectedPages.toString());

  if (expectedPages > 1) {
    await t
      .expect(nextBtn.exists).ok()
      .expect(nextBtn.innerText).eql('>')
      .expect(displayingPosts).eql(10)
      .expect(lastPageBtn.exists).ok()
      .click(lastPageBtn)
      .expect(getLocation()).contains(`/page/${expectedPages}`)
      .expect(prevBtn.exists).ok()
      .expect(prevBtn.innerText).eql('<');
  } else {
    await t
      .expect(nextBtn.exists).notOk()
      .expect(prevBtn.exists).notOk();
  }
});

test('PD list page should have 2 paginations, at most 12 posts per page with correct message and buttons', async t => {
  await t
    .navigateTo(`${baseURL}/dr_product`)
    .expect(pagiCon.count).eql(2);

  const pagiMsgText = await pagiMsg.innerText;
  const displayingPosts = parseInt(pagiMsgText.match(/\d+/g)[0]) || 0;
  const totalPosts = parseInt(pagiMsgText.match(/\d+/g)[1]) || 0;
  const expectedPages = Math.ceil(totalPosts / displayingPosts);
  const lastPageBtn = pagiCon.find('.page-numbers').withText(expectedPages.toString());

  if (expectedPages > 1) {
    await t
      .expect(nextBtn.exists).ok()
      .expect(nextBtn.innerText).eql('>')
      .expect(displayingPosts).eql(12)
      .expect(lastPageBtn.exists).ok()
      .click(lastPageBtn)
      .expect(getLocation()).contains(`/page/${expectedPages}`)
      .expect(prevBtn.exists).ok()
      .expect(prevBtn.innerText).eql('<');
  } else {
    await t
      .expect(nextBtn.exists).notOk()
      .expect(prevBtn.exists).notOk();
  }
});

test('Search page should have 2 paginations, at most 12 posts per page with correct message and buttons', async t => {
  await t
    .navigateTo(`${baseURL}/?s=digital&post_type=dr_product`)
    .expect(pagiCon.count).eql(2);

  const pagiMsgText = await pagiMsg.innerText;
  const displayingPosts = parseInt(pagiMsgText.match(/\d+/g)[0]) || 0;
  const totalPosts = parseInt(pagiMsgText.match(/\d+/g)[1]) || 0;
  const expectedPages = Math.ceil(totalPosts / displayingPosts);
  const lastPageBtn = pagiCon.find('.page-numbers').withText(expectedPages.toString());

  if (expectedPages > 1) {
    await t
      .expect(nextBtn.exists).ok()
      .expect(nextBtn.innerText).eql('>')
      .expect(displayingPosts).eql(12)
      .expect(lastPageBtn.exists).ok()
      .click(lastPageBtn)
      .expect(getLocation()).contains(`/page/${expectedPages}`)
      .expect(prevBtn.exists).ok()
      .expect(prevBtn.innerText).eql('<');
  } else {
    await t
      .expect(nextBtn.exists).notOk()
      .expect(prevBtn.exists).notOk();
  }
});
