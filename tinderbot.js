// Emails and PWS
require("dotenv").config();
const EMAIL = process.env.EMAIL || "johnDoe@gmail.com";
const TINDER_PW = process.env.TINDER_PW || "something";

const { random, redditPickUpLines, LAXCoords, USCCoords } = require("./utilities");
const puppeteer = require("puppeteer");


// Invocation
(async () => {
	
	// Pull 25 pickup lines from reddit
	const pickUpLines = await redditPickUpLines();

	const browser = await puppeteer.launch({
		headless: false,
		args: ["--start-maximized"],
	});

	// allow geolocation
	const context = browser.defaultBrowserContext();
	await context.overridePermissions("https://tinder.com", ["geolocation"]);

	const tinderPage = await browser.newPage();

	await tinderPage.setViewport({
		width: 0,
		height: 0,
	});

	await tinderPage.goto("https://tinder.com", {
		waitFor: "networkidle",
	});

	await tinderPage.waitFor(2000);

	await tinderPage.setGeolocation(LAXCoords);
	await tinderPage.waitFor(3000);

	//remove the Allow Cookies button
	let popUpBotton = await tinderPage.$x('//*[@id="content"]/div/div[2]/div/div/div[1]/button');
	await popUpBotton[0].click();
	await tinderPage.waitFor(200);

	// Click the Login button
	const googleLoginButton = await tinderPage.$x(
		'//*[@id="modal-manager"]/div/div/div[1]/div/div[3]/span/div[1]/div/button'
	);
	await googleLoginButton[0].click();

	// Wait for pop up to load and grab google pop up
	await tinderPage.waitFor(5000);

	let pagesArr = await browser.pages();
	console.log(pagesArr.length);
	let googlePopUp = pagesArr[pagesArr.length - 1];

	// target the already selected email field
	// in the popup
	const googleEmailInput = await googlePopUp.$x('//*[@id="identifierId"]');
	await googleEmailInput[0].click();
	await googlePopUp.waitFor(3000);
	await googleEmailInput[0].type(`${EMAIL}`);
	await googlePopUp.waitFor(5000);
	await googlePopUp.keyboard.press("Enter");
	await googlePopUp.waitFor(10000);

	// target pw field
	const googlePasswordInput = await googlePopUp.$x('//*[@id="password"]/div[1]/div/div[1]/input');
	await googlePasswordInput[0].type(`${TINDER_PW}`);
	await googlePopUp.waitFor(500);
	await googlePopUp.keyboard.press("Enter");

	// WE ARE LOGGED IN
	await tinderPage.waitFor(10000);
	console.log("We're In");

	//CHECKING TO SEE IF WE CAN SWIPE RIGHT

	const likeButton = await tinderPage.$x(
		'//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[2]/div[4]/button'
	);

	// for (let i = 0; i < 3; i++){
	//   await likeAndSendPickUpLine()
	// }

	// TODO decouple the code from Scope?
	const likeAndSendPickUpLine = async () => {
		await likeButton[0].click();
		// check if we matched
		await tinderPage.waitFor(1000);
		// check if we matched
		// If the array has length then we hit a match while swiping right
		let weMatchedInput = await tinderPage.$x('//*[@id="chat-text-area"]');
		let weMatchedSubmitButton = await tinderPage.$x(
			'//*[@id="modal-manager-canvas"]/div/div/div[1]/div/div[3]/div[3]/form/button'
		);

		// TODO update database
		if (!weMatchedInput.length) {
			console.log("No Match");
		} else {
			// database promise
			console.log("We Matched!");
			// Drop a pick Up line and submit
			await weMatchedInput[0].focus();
			await tinderPage.waitFor(500);
			await weMatchedInput[0].type(pickUpLines[random(0, pickUpLines.length)]);
			await weMatchedSubmitButton[0].click();
		}

		await tinderPage.waitFor(5000);
	};

	const profileCard = await tinderPage.$x('//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]');

	// show more info
	await tinderPage.keyboard.press("ArrowUp");
	await tinderPage.hover(".profileCard");

	const bodyOfText = await tinderPage.$x(
		'//*[@id="content"]/div/div[1]/div/main/div[1]/div/div/div[1]/div[1]/div/div[2]/div[2]/div'
	);
	const profileText = await bodyOfText[0].evaluate((element) => element.textContent, element);
	console.log(profileText);

	//await browser.close();
})();
