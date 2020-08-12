// Emails and PWS
require('dotenv').config()
// Library
const puppeteer = require('puppeteer');
const { random, redditPickUpLines } = require('./utilities')

const EMAIL = process.env.EMAIL || 'johnDoe@gmail.com';
const TINDER_PW = process.env.TINDER_PW || 'something';





// Tinder requires location
// for local singles functionality
const LAXCoords = {
  latitude: 33.942791,
  longitude: -118.410042
};
const USCCoords = {
  latitude: 34.0205,
  longitude: -118.2856
};


// Beginning the scraper bot
;(async () => {
  // Pull 25 pickup lines from reddit
  // These are probably some of the worths 
  // words ever written by man
  const pickUpLines = await redditPickUpLines()


  const browser = await puppeteer.launch({
    headless: false, 
    args: [
      '--start-maximized',
    ],
  });

  // allow geolocation
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
  await el.type(`${TINDER_PW}`);
  await googlePopUp.waitFor(500);
  await googlePopUp.keyboard.press('Enter');
  


  // WE ARE LOGGED IN
 
  await tinderPage.waitFor(10000)
  console.log('We\'re In');


  //CHECKING TO SEE IF WE CAN SWIPE RIGHT
  const likeButton = await tinderPage.$x('//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[2]/div[4]/button');
 

 
  // for (let i = 0; i < 3; i++){
  //   await likeAndSendPickUpLine()
  // }

  

  // TODO decouple the code from Scope?
  const likeAndSendPickUpLine = async () => {
    await likeButton[0].click();
    // check if we matched
    await tinderPage.waitFor(1000)
    // check if we matched
    // If the array has length then we hit a match while swiping right
    let weMatchedInput = await tinderPage.$x('//*[@id="chat-text-area"]')
    let weMatchedSubmitButton = await tinderPage.$x('//*[@id="modal-manager-canvas"]/div/div/div[1]/div/div[3]/div[3]/form/button')
    
    // TODO update database 
    if(!weMatchedInput.length){
      console.log('No Match')
    } else {
      // database promise
      console.log('We Matched!')
      // Drop a pick Up line and submit
      await weMatchedInput[0].focus()
      await tinderPage.waitFor(500)
      await weMatchedInput[0].type(pickUpLines[random(0, pickUpLines.length)])
      await weMatchedSubmitButton[0].click()
    }
    
    await tinderPage.waitFor(5000)
  }
  
  const profileCard = await tinderPage.$x('//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]');
  
  
  // show more info
  await tinderPage.keyboard.press('ArrowUp')
  await tinderPage.hover('.profileCard')


  const bodyOfText = await tinderPage.$x('//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div[1]/div/div[2]/div[2]/div')
  const profileText = await bodyOfText[0].evaluate(element =>element.textContent, element )
  console.log(profileText)
  
  //await browser.close();
})();



