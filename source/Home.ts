
page("/", "Squares: Programmable Social Media",
	
	raw.meta({ name: "og:image", content: "https://www.squaresapp.org/static/res.ogimage.jpg" }),
	description("Squares: The energy of social, the freedom of email, and the power of a website in one app."),
	
	raw.div(
		{
			backgroundColor: "hsl(212, 15%, 33%)",
			textAlign: "center",
			padding: "23px",
		},
		raw.p(
			{
				fontSize: "30px",
				fontWeight: 600,
				padding: "10px",
			},
			raw.text("Website under construction.")
		),
		raw.p(
			{
				fontSize: "20px",
			},
			raw.text("Squares is still in private beta. Please check back later."),
		),
	),
	
	section(
		{
			overflow: "hidden",
		},
		raw.css(":before", {
			content: `""`,
			position: "absolute",
			zIndex: -1,
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundImage: `url(res.glow)`,
			backgroundSize: "contain",
			backgroundPosition: "50% -70%",
			backgroundRepeat: "no-repeat",
		}),
		raw.img({
			src: "res.logo.svg",
			display: "block",
			marginBottom: "-5%"
		}),
		raw.h1(
			{
				fontSize: "5vw",
				textTransform: "uppercase",
				marginBottom: "50px",
				textShadow: "0px 5px 15px black",
			},
			raw.text("Squares")
		),
		raw.get(loud(4, 58)`
			The ${red`flow`} of social.${br()}
			The ${blue`freedom`} of email.${br()}
			The ${red`power`} of a website.${br()}
			In ${blue`one`} app.
		`)({ 
			textShadow: "0px 5px 15px black",
		}),
		space(50),
		
		prose(17)`
			${b`Squares`} is an ${b`open-source`} app
			for consuming ${b`Webfeeds`}, an open
			media format that fixes many
			problems with ${b`today's internet`}.
		`,
		space(70),
		button.ios(),
		button.android(),
		
		Fn.iPhone(
			{
				position: "absolute",
				top: "300px",
				left: 0,
				zIndex: -1,
				transform: "rotate(-15deg)",
				transformOrigin: "100% 100%",
			},
			raw.img(
				{
					src: "res.hero.webfeed",
					width: "25vw",
				}
			)
		),
		Fn.iPhone(
			{
				position: "absolute",
				top: "300px",
				right: 0,
				zIndex: -1,
				transform: "rotate(15deg)",
				transformOrigin: "0 100%",
			},
			raw.img(
				{
					src: "res.hero.webfeed",
					width: "25vw",
				}
			)
		),
		
		space("5vw"),
		dots(),
		space("5vw"),
	),
	
	section(
		loud(10, 84)`
			Today's media channels have
			${red`lots`} of ${red`issues`}.
		`,
		dots(),
	),
	
	section(
		loud(10)`Social Media`,
		loud(4, 73)`
			Where you ${blue`grow`} 📈. But you often
			get ${red`lost`} in the ${red`noise`} 😱. There's tons
			of ${red`rules`} 👮🏻‍♀️ and ${red`restrictions`} 😡. And
			one ${red`algorithm change`} could = 🪦
		`,
		dots(),
	),
	
	section(
		loud(10)`Email`,
		loud(4, 73)`
			It's ${blue`personalizable`} 🤙🏻 + ${blue`open tech`} 👍🏻.${br()}
			Your list is ${blue`yours`} 💪🏻. But it's ${red`old`} and${br()}
			${red`crusty`} 👎🏻. And there's Gmail's${br()}
			${red`promotions tab`} ☠️ from ${red`hell`} 👿.
		`,
		dots(),
	),
	
	section(
		loud(10)`Websites`,
		loud(4, 70)`
			They're easy to ${blue`monetize`} 💰.${br()}
			Freedom to ${blue`do anything`} 🌈. But it's${br()}
			${red`super hard`} to get people to ${red`visit`} 😢.
		`,
		space(300),
		dots(),
		space(300)
	),
	
	section(
		loud(8, 70)`
			We need a new
			${blue`media channel`}
			where you can
			${blue`have`} your ${blue`cake`}
			and ${red`eat`} it ${red`too`}.
		`,
		space(500)
	),
	
	section(
		loud(10)`Introducing ${br()} Webfeeds`,
		dots()
	),
	
	section(
		loud(7, 80)`
			${blue`Webfeeds`} are just ${blue`web pages`} that ${blue`push`}
			to your audience ${blue`automatically`}.
		`,
		dots()
	),
	
	raw.section(
		loud(7, 80)`
			${blue`Webfeeds`} come to followers via an app.
			Like ${red`Squares`}.
		`,
		space(800)
	),
	
	raw.section(
		align.right,
		loud(7, 60)`
			${red`Squares`} folds ${blue`webfeeds`} into a visual ${blue`timeline`}.
		`,
		space(800),
		dots(),
	),
	
	raw.section(
		align.left,
		loud(7)`
			Webfeed ${blue`pages`} are ${blue`carousels`} built with the
			${blue`native language`} of the web: ${red`HTML`} and ${red`CSS`}.
		`,
		space(50),
		prose(24)`
			This means they can contain any type of thing
			you've ever seen online: ${b`podcast players`}, 
			${b`shopping carts`}, even ${b`interactive games`}.
		`,
		dots()
	),
	
	section(
		loud(10)`Designed to be ${blue`reshared`}.`,
		space(50),
		prose(30)`Webfeeds don't need to be limited to your own carousels. Like any ${b`social network`}, they can reshare carousels from other webfeeds. They form a ${b`decentralized network`} where ${b`communal resharing`} is baked in.`,
		space(200),
	),
	
	section(
		loud(10, 83)`${red`Nobody`} wants to ${blue`say`} this, but...`,
		space(150),
		loud(6, 75)`Pay-to-reshare is a ${red`cheat code`} to ${blue`exploding`} on social media.`,
		space(150),
		prose(37)`
			The ${b`fastest way`} to ${b`grow on Twitter`} (and other platforms) is to create good content, and then pay bigger accounts for reshares. Platforms ${b`hate this`}. They want you to buy their ads. But webfeeds are an ${b`escape hatch`} from ${b`ad-peddling overlords`}. So go after those resharing deals with fellow webfeeders, and ${b`grow`} your ${b`webfeed following`} to your hearts content. 
		`,
		space(100),
		button.blue("Watch a growth expert discuss this.", "https://www.youtube.com/watch?v=eBNMhkDrxcY"),
		dots()
	),
	
	section(
		loud(10, 80)`Webfeeds can be ${blue`algorithms`}.`,
		space(50),
		prose(33)`
			There are ${b`no rules`} around how webfeeds come to life. They could be a stream of reshared pages, ${b`generated`} by an algorithm, and personalized to your interests. There is an ${b`open market`} for webfeeds which are actually content recommendation algorithms. And a growing swarm of algorithms looking to reshare your content.
		`,
		space(100),
		raw.div(
			align.left,
			loud(4, 65)`
				Are you an ${blue`algorithm developer`}?
				There is big ${red`profit potential`} in ${br()}
				AI-generated webfeeds.
			`,
			space(50),
			raw.get(button.blue("Contact us to learn more.", ""))(
				{ id: "contact-us-link" }
			),
			Fn.maskEmail("contact-us-link", "hello@squaresapp.org")
		),
		dots(),
	),
	
	section(
		loud(8)`Attract swarms of scrapers looking to ${blue`promote you`} for ${red`free`}.`,
		space(100),
		prose(30)`
			${b`Scraper bots are your friends`}. They redistribute your content to places you don't expect. They're an unpaid marketing force.
		`,
		prose(32)`
			The web was designed for scraper bots. This is why we have Google, Bing, and all other search engines. The web ${b`doesn't even work`} without them. Yet platforms do everything possible to kill them.
		`,
		prose(32)`It's ${b`near-impossible`} to scrape content them. So instead of contributing content to the collective, they act like ${b`greedy hoarders`}. They do this to keep as much as attention on themselves as possible. They don't care that this comes at the expense of creators.
		`,
		dots(),
	),
	
	section(
		raw.img({ src: "webfeeds-in-box" }),
		loud(7, 90)`${blue`Webfeeds`} are ${blue`open`} tech. Anyone can make a tool ${red`like Squares`} to view them`,
		space(100),
		prose(23)`
			Are you a ${b`developer`}? If you know ${b`HTML`}, you already know how to build Webfeeds.
			Learn how they work in ${b`5 minutes`}. They're ${b`really`} simple.
		`,
		space(100),
		button.blue("Learn Webfeeds in 5 minutes.", ""),
		dots(),
	),
	
	section(
		loud(7, 90)`${blue`Webfeeds`} are the ultimate technology for ${red`engaging`} your ${red`followers`}.`,
		space(100),
		prose(35)`
			Imagine the engagement rates of having an ${b`appointment booker`} within a LinkedIn post, a ${b`donation button`} in an Instagram story, a ${b`podcast`} in an email, or a ${b`3D game`} in a Tweet. And imagine having all this ${b`personalizable`} for each of your followers.
		`,
		prose(35)`
			All this and more is possible with webfeeds. Social media platforms will ${b`never allow you to do things like this`}, because doing so could compromise their ability to keep uesrs ${b`scrolling`} and ${b`addicted`}.
		`,
		space(100),
		button.blue("See Webfeed Examples", ""),
		dots(),
	),
	
	section(
		loud(9)`
			It's time for a${br()}
			${red`radical reformation`}${br()}
			of social media.
		`,
		space(80),
		prose(36)`
			Social media has done great things for civilization. But its darker side is a ${b`cancerous force`}. Platforms treat humans like cows to be milked for their time and attention, and actively ${b`stifle innovation`}. They could easily build webfeed-like power into their products. But they won't, because they exist to ${b`sell ads`} rather than ${b`spur greatness`}.
		`,
		space(80),
		loud(6, 50)`Is doesn't need to be this way.`,
		space(80),
		prose(36)`
			Squares and Webfeeds are ${b`open-source initiatives`} that are on track to reignite greatness within humans. A great future is where we build our ${b`own digital identities`} on our ${b`own digital properties`}. Let's create the counter-force against an increasingly medival feudalist-style internet.
		`,
		dots(),
	),
	
	section(
		
		raw.div(
			{
				position: "absolute",
				zIndex: -1,
				top: "-10vw",
				left: 0,
				right: 0,
				height: "100vw",
				overflow: "hidden"
			},
			Fn.iPhone(
				{
					position: "absolute",
					top: 0,
					left: "-16%",
					zIndex: -1,
					transform: "rotate(-15deg)",
					transformOrigin: "100% 100%",
				},
				raw.img(
					{
						src: "res.hero.webfeed",
						width: "35vw",
					}
				)
			),
			Fn.iPhone(
				{
					position: "absolute",
					top: 0,
					right: "-16%",
					zIndex: -1,
					transform: "rotate(15deg)",
					transformOrigin: "0 100%",
				},
				raw.img(
					{
						src: "res.hero.webfeed",
						width: "35vw",
					}
				)
			),
		),
		loud(7, 90)`
			Let's ${blue`exit serfdom`} and
			enter a new land where
			${blue`digital independence`}
			reigns ${red`supreme`}.`,
		
		space(60),
		prose()`Download ${b`Squares`} and get started today.`,
		space(60),
		button.ios(),
		button.android(),
		space(200),
		raw.p(
			{
				textAlign: "center",
				opacity: 0.2,
				fontWeight: 900,
				fontSize: "8vw",
				transform: "rotate(-10deg) translate(-10%) ",
				transformOrigin: "80% -500%"
			},
			raw.text("#digital1776")
		),
	),
	
	githubCorner("https://github.com/squaresapp/squares")
);
