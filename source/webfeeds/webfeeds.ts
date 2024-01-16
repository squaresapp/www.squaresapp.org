
page("/webfeeds", "Squares - Webfeeds",
	
	section(
		space(50),
		raw.img({ src: "res.webfeeds-icon" }),
		space(30),
		loud(10)`Webfeeds`,
		space(10),
		prose(25)`
			Webfeeds are very simple way of organizing HTML+CSS web pages in order to make them suitable for ${b`push distribution`} (syndication) into a webfeed reader installed on an end-users device.
		`,
		prose(25)`
			Webfeeds present an opportunity to reignite the blogosphere, by making our websites competitive against modern social media.
		`,
		space(150)
	),
	
	section(
		raw.css(" .prose", { textAlign: "left" }),
		loud(7, 60)`Why We ${red`Need`} ${blue`Webfeeds`}`,
		space(50),
		prose(28)`
			${b`Social media platforms suck vast amounts of profit away from creators`}. There are many things they could do to help creators&#8212;like allowing links in a post (on Insta). But they'll never do this because they have one single goal: keep users scrolling through their ads.
		`,
		prose(28)`
			${b`Social media is hostile to mental health.`}. Likes, algorithms, and publicized follower counts are all all just tricks to keep you addicted with cheap hits of dopamine. Study after study shows the damanging effects of social media.
		`,
		prose(28)`
			${b`One company makes all the decisions`} around how (or if) your content reaches your audience. This is the exact opposite of how the internet is supposed to work.
		`,
		prose(28)`
			${b`Platforms are most likely going to collapse anyway`}. Why? Read up on ${a(`Platform decay`, "https://en.wikipedia.org/wiki/Enshittification")}. We might as well build our own Noah's Arks to prepare for what is to come.
		`,
		space(100),
	),
	
	section(
		raw.css(" .prose", { textAlign: "left" }),
		loud(7)`How do they ${red`work`}?`,
		space(30),
				
		loud(4)`Index Files`,
		space(30),
		prose(28)`
			Webfeeds start with an ${b`index file`}, which is a plain text file on your website named ${code`index.txt`}. The public URL might be ${code`http://xyz.com/index.txt`}. The contents of this file are a list of URLs that point to ${b`carousel pages`}.
		`,
		syntax.plain`
			/carousels/jan-1-2024/
			/carousels/jan-2-2024/
			/carousels/jan-3-2024/
			https://www.external.com/something-worth-resharing
		`,
		
		loud(4)`A Webfeed Reader App`,
		space(30),
		prose(30)`
			Webfeeds are downloaded and displayed by a Webfeed reader app installed on a user's device, though a reader could be purely web-based as well. Users connect webfeeds to their reader by clicking a button on a website.
		`,
		space(30),
		button.blue("See the Webfeed button on GitHub", "https://github.com/squaresapp/webfeed-follow"),
		space(50),
		
		prose(30)`Once the webfeed is connected to the reader, the reader begins to check it periodically for updates. It does this by issuing a ${code`HEAD`} request to the index file, and scanning the returned ${code`ETag`}, ${code`Last-Modified`}, and ${code`Content-Length`} headers that are sent back for differences. This avoids needless re-downloading of the whole index.`,
		
		space(50),
		loud(4)`Carousel Pages`,
		space(50),
		prose(30)`
			The HTML pages referenced in an index file are called ${b`Carousels Pages`}, because that's how they're displayed in the webfeed reader. In HTML, the basic file structure is a top-level ${code`<html>`} tag, which contains a ${code`<head>`} tag, and a ${code`<body>`} tag.  Carousel pages are similar, although instead of a top-level ${code`<body>`} tag, there are one or more top-level ${code`<section>`} tags. In order to prevent UX failures in the reader, sections have some simple constraints:
		`,
		unordered(
			30,
			`Each section has the exact dimensions of the viewport.`,
			`Visual content can't overflow outside of them.`,
			`There are some HTML tags (?) and CSS properties (?) that aren't allowed.`,
			`They can have scripts, but this forces the section into a sandbox, which comes with some additional limitations.`,
		),
		space(50),
		button.blue("See the Webfeed repo on Github", "https://github.com/squaresapp/webfeed-js")
	)
);
