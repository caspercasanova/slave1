require('dotenv').config()
const puppeteer = require('puppeteer');

const EMAIL = process.env.EMAIL || 'johnDoe@gmail.com';
const PW = process.env.PW || 'something';
const { random } = require('./utilities')

const LAXCoords = {
  latitude: 33.942791,
  longitude: -118.410042
};
const USCCoords = {
  latitude: 34.0205,
  longitude: -118.2856
};





let pickUpLines = [
  'What did the bot say to the girl?',
  'I’m the droid you’re looking for.',
  'You make my interface GUI',
  '¿ gOt a RoBoT kInK ?',
  'Skiddy Beep Bop',
  '"They said take off my jacket..."',
  'Want to grab some Java?',
  'ERROR ERROR: cAnNot ComPuTe bEaUty',
  'my homie r2d2 thinks u cute'
];


(async () => {
  const browser = await puppeteer.launch({
    headless: false, 
    args: [
      '--start-maximized',
    ],
  });

  const context = browser.defaultBrowserContext();
  await context.overridePermissions('https://tinder.com', ['geolocation']);

  const tinderPage = await browser.newPage();
  await tinderPage.setViewport({
    width: 0,
    height: 0,
  });
  await tinderPage.goto('https://tinder.com', {
    waitFor: 'networkidle'
  });
  await tinderPage.waitFor(3000);
  await tinderPage.setGeolocation(LAXCoords);
  await tinderPage.waitFor(3000);

  //remove the Allow Cookies button
  let popUpBotton = await tinderPage.$x('//*[@id="content"]/div/div[2]/div/div/div[1]/button');
  await popUpBotton[0].click();
  await tinderPage.waitFor(200);
  // Click the Login button
  const googleLoginButton = await tinderPage.$x('//*[@id="modal-manager"]/div/div/div[1]/div/div[3]/span/div[1]/div/button');
  await googleLoginButton[0].click();
  //wait for pop up to load
  await tinderPage.waitFor(5000);
  let pagesArr = await browser.pages();
  let googlePopUp = pagesArr[pagesArr.length - 1];
  // target email in the popup 
  let el = await googlePopUp.evaluateHandle(() => document.activeElement);
  await googlePopUp.waitFor(3000);
  await el.type(`${EMAIL}`);
  await googlePopUp.waitFor(500);
  await googlePopUp.keyboard.press('Enter');
  await googlePopUp.waitFor(10000);
  // target pw field
  el = await googlePopUp.evaluateHandle(() => document.activeElement);
  await el.type(`${PW}`);
  await googlePopUp.waitFor(500);
  await googlePopUp.keyboard.press('Enter');
  


  // WE ARE LOGGED IN
  await googlePopUp.waitFor(10000);
  console.log('We\'re In');



  //CHECKING TO SEE IF WE CAN SWIPE RIGHT
  const likeButton = await tinderPage.$x('//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[2]/div[4]/button');
 


  const checkAndSendPickUpLine = async () => {
    let weMatchedInput = await tinderPage.$x('//*[@id="chat-text-area"]')
    let weMatchedSubmitButton = await tinderPage.$x('//*[@id="modal-manager-canvas"]/div/div/div[1]/div/div[3]/div[3]/form/button')
    
    if(!weMatchedInput.length){
      return
    } else {
      console.log('We Matched!')
    }
    await weMatchedInput[0].focus()
    tinderPage.waitFor(500)
    await weMatchedInput[0].type(pickUpLines[random(0, pickUpLines.length)])
    await weMatchedSubmitButton[0].click()
  }

  await likeButton[0].click();
  for(let i = 0; i<3; i++){
    await likeButton[0].click();
    // check if we matched
    await tinderPage.waitFor(1000)
    // check if we matched
    await checkAndSendPickUpLine()
    // wait 5 sec
    await tinderPage.waitFor(5000)
  }


  // grab image
  //process image
  //click ya or nay

  //await browser.close();
})();




