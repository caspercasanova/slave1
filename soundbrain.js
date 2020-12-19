require("dotenv").config();
const puppeteer = require("puppeteer");
const Twitter = require("twitter");
const { random } = require("./utilities");
// https://dev.to/developer_buddy/let-s-create-a-twitter-bot-using-node-js-and-heroku-3-3-agk

const sanitizeDjName = (name) => {
	if (name.includes("-")) {
		return name.replace("-", "");
	} else if (name.includes("_")) {
		return name.replace("_", "");
	} else {
		return name;
	}
};
const randomDJPhrase = () => {
	let phrases = [
		"Spin This Track With Your Homies",
		"Make Love To This",
		"Ever Had Musical #HEAD",
		"Cant Make Spins Any Better",
		"Absolute Smasher This",
		"#soaked..",
		"OH Fuck Yea Spread It",
		"Let this #suckyouoff",
		"M E L T E D",
		"No Protection Needed",
		"Make A Movie To This",
		"Stay Sexually Active My Friends",
		"S M A S H that like button",
		"Suck This One Up",
		"Dont Tell Your Mom About Us",
		"Smoke, Drink And #Snort This Up",
		"Send This To Your Side Piece Tonight",
		"P A N T Y  D R O P P E R",
		"wana bang..... er?",
		"If #Sex Were Sonic...",
		"Put The Kids To Bed 'n' Give This A Listen",
		"Our Fan Base Is Dying, Show Your Support 'n' RT",
		"S e n s a y s h - #anal",
		"No One #Loves U Like #House Music",
		"Upbeat n #Banging. Like Your Moms Love Life",
		"Need A Fix Baby?",
		"#House R Us",
		"When She Says Go Deeper So You Play This",
		" *SexVibes Enter Your Pants* ",
		"If Your Man Dont Like House Music, He A #SIMP",
		"C R E A M",
		"...swallow this...",
		"X X X",
		" M O I S T ",
		"RT If You Like SM/MED/LG Titties + #House",
		"Caution, Slippery When 💧 ",
		"Caution, Slippery When 💧 ",
	];

	return phrases[random(0, phrases.length)];
};

const client = new Twitter({
	consumer_key: process.env.SoundBrain_API_KEY,
	consumer_secret: process.env.SoundBrain_SECRET_KEY,
	access_token_key: process.env.SoundBrain_ACCESS_TOKEN,
	access_token_secret: process.env.SoundBrain_ACCESS_TOKEN_SECRET,
});

(async () => {
	const browser = await puppeteer.launch({
		headless: true,
		// args: ["--start-maximized"],
		args: ["--no-sandbox"],
	});

	const soundCloud = await browser.newPage();

	await soundCloud.setViewport({
		width: 0,
		height: 0,
	});

	await soundCloud.goto("https://soundcloud.com/caspercasanova/likes", {
		waitFor: "networkidle",
	});

	let link_urls;
	try {
		const xpath_expression =
			'//*[@id="content"]/div/div/div[2]/div/div[2]/ul/li[1]/div/div/div/div[2]/div[1]/div/div/div[2]/a';
		await soundCloud.waitForXPath(xpath_expression);
		const links = await soundCloud.$x(xpath_expression);
		link_urls = await soundCloud.evaluate((...links) => {
			return links.map((e) => e.href);
		}, ...links);

		// console.log(link_urls);
	} catch (error) {
		console.error(error);
		throw new Error(`SoundCloud Scape Failed ${error}`);
	}

	await browser.close();

	console.log(link_urls[0].split("/"));
	let splitLink = link_urls[0].split("/");

	let post = `${randomDJPhrase()}\n@${sanitizeDjName(splitLink[splitLink.length - 2])}\n${
		splitLink[splitLink.length - 1]
	}\n${link_urls[0]}`;

	let terminate;
	var params = { screen_name: "_0131310", count: 10 };
	client.get("statuses/user_timeline", params, function (error, tweets, response) {
		if (error) {
			console.error(tweets);
		}

		const sortedTweets = tweets.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
		console.log(sortedTweets);

		if (sortedTweets[0].text.includes(splitLink[splitLink.length - 1])) {
			console.log(sortedTweets[0].text, splitLink[splitLink.length - 1]);
			console.log("This Track Was Already Posted");
			terminate = true;
			console.log(terminate);
		} else {
			console.log("This has not been posted before");
			terminate = false;
		}

		if (terminate) {
			console.log("The Process is ending");
		} else {
			client.post("statuses/update", { status: `${post}` }, function (error, tweet, response) {
				if (error) throw error;
				console.log("The Tweet Was Success");
			});
		}
	});
})();
