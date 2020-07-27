require('dotenv').config()
const puppeteer = require('puppeteer');

const EMAIL = process.env.EMAIL || 'johnDoe@gmail.com';
const INSTA_USER = process.env.INSTA_USER || 'something';
const INSTA_PW = process.env.INSTA_PW || 'something';

const LAXCoords = {
  latitude: 33.942791,
  longitude: -118.410042
};




(async () => {
  const browser = await puppeteer.launch({
    headless: false, 
    args: [
      '--start-maximized',
    ],
  });

  // allow geolocation
  const context = browser.defaultBrowserContext();
  await context.overridePermissions('https://tinder.com', ['geolocation']);


  const instaPage = await browser.newPage();

  await instaPage.setViewport({
    width: 0,
    height: 0,
  });

  await instaPage.goto('https://instagram.com', {
    waitFor: 'networkidle'
  });

  await instaPage.waitFor(3000);

  await instaPage.setGeolocation(LAXCoords);
  await instaPage.waitFor(3000);

  // LOGIN TO INSTA
  const usernameInput = await instaPage.$x('//*[@id="react-root"]/section/main/article/div[2]/div[1]/div/form/div[2]/div/label/input');
  await usernameInput[0].click();
  await usernameInput[0].type(`${INSTA_USER}`);
  
  const pwField = await instaPage.$x('//*[@id="react-root"]/section/main/article/div[2]/div[1]/div/form/div[3]/div/label/input')
  await pwField[0].click();
  await pwField[0].type(`${INSTA_PW}`);


  const loginButton = await instaPage.$x('//*[@id="react-root"]/section/main/article/div[2]/div[1]/div/form/div[4]/button')
  await loginButton[0].click()
  await instaPage.waitFor(3000);
  
  const allowCookiesButton = await instaPage.$x('//*[@id="react-root"]/section/main/div/div/div/div/button')
  await allowCookiesButton[0].click()
  await instaPage.waitFor(3000);
  
  const allowNotifications = await instaPage.$x('/html/body/div[4]/div/div/div/div[3]/button[2]')
  await allowNotifications[0].click()
  await instaPage.waitFor(3000);
  
  // // Click the Login button
  // const googleLoginButton = await instaPage.$x('//*[@id="modal-manager"]/div/div/div[1]/div/div[3]/span/div[1]/div/button');
  // await googleLoginButton[0].click();



  // // GOOOOGLE LOGIN POPUP!
  // // wait for pop up to load
  // await instaPage.waitFor(5000);
  // let pagesArr = await browser.pages();
  // let googlePopUp = pagesArr[pagesArr.length - 1];

  // // target email in the popup 
  // let el = await googlePopUp.evaluateHandle(() => document.activeElement);
  // await googlePopUp.waitFor(3000);
  // await el.type(`${EMAIL}`);
  // await googlePopUp.waitFor(500);
  // await googlePopUp.keyboard.press('Enter');
  // await googlePopUp.waitFor(10000);
  // // target pw field
  // el = await googlePopUp.evaluateHandle(() => document.activeElement);
  // await el.type(`${TINDER_PW}`);
  // await googlePopUp.waitFor(500);
  // await googlePopUp.keyboard.press('Enter');
  


  //await browser.close();
})();




