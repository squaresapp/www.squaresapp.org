
page("/rawjs", "RawJS: Make document.createElement() Great Again",
	raw.style(
		".bubbles", {
			margin: "auto",
			width: "100%",
			maxWidth: "800px",
		},
		".bubbles BLOCKQUOTE", {
			maxWidth: "12em"
		},
		".bubbles BLOCKQUOTE:nth-of-type(odd)", {
			textAlign: "left",
			marginRight: "auto",
		},
		".bubbles BLOCKQUOTE:nth-of-type(even)", {
			textAlign: "right",
			marginLeft: "auto",
		}
	),
	section(
		space(200),
		raw.img({ src: "rawjs.logo", width: "50vw" }),
		space(200),
		
		loud(5, 75)`
			A library that makes
			${blue`document.createElement()`}
			so awesome, you may not need ${red`React`}, ${red`Vue`}, or others.
		`,
		space(60),
		prose(40)`
			RawJS is a better way to call document.createElement(). Create full HTML element hierarchies, build complex CSS styling, and wire event handlers, all without leaving JavaScript. RawJS is inspired by the belief that ${b`web frameworks`} ought to be disbanded in favor of ${b`web standards`}.
		`,
		space(60),
		button.blue(
			"See the demo project.", 
			"https://github.com/squaresapp/rawjs-sample"),
		
		space(200),
	),
	
	section(
		loud(8, 68)`
			${red`RawJS`} isn't so much a ${blue`library`} as it is a ${blue`mindset`}.
		`,
		space(60),
		prose(32)`
			At ${b`2.3 KB`}, RawJS doesn't do much. What RawJS really does is open you up to the idea of ${b`zero-magic code`}. This is about clever use of the JavaScript language to DIY things like data-binding, controllers, list synchronization, and reusable components.
		`,
		space(60),
		
		button.blue(
			"See how simple RawJS apps can be.", 
			"https://github.com/squaresapp/rawjs-sample"),
		
		space(200),
	),
	
	section(
		space(100),
		loud(6, 60)`
			With ${red`RawJS`}, you can build seriously ${red`difficult UI`} in vanilla JavaScript.
		`,
		space(100),
		loud(6, 60)`
			And with ${blue`outstanding`} results.
		`,
		space(100),
		loud(6, 70)`
			Think ${blue`collaborative`} text editors, ${blue`animators`}, and drag and drop
			${blue`design tools`}.
		`,
		space(100),
		prose(33)`
			RawJS was initially built for ${b`Squares`}, a mobile media consumption app with a highly advanced UI. Squares was able to leverage the power of RawJS to craft an experience that feels so silky smooth, many users believe it's built with native technologies. RawJS has since grown and is now powering a variety of mission-critical web and mobile apps.
		`,
		space(100),
		button.blue(
			"Check out Squares.", 
			"https://github.com/squaresapp/rawjs-sample"),
		
		space(200),
	),
	
	section(
		loud(5, 70)`
			${blue`Wisdom`} &gt; Party Tricks
		`,
		space(50),
		prose(33)`
			Considering leaving React for something else? Don't be seduced by demos of databinding done with a few keystrokes less than last years framework. Excessive focus on optimizing for code length (especially in toy examples) often risks deoptimizing for actual time drains.
		`,
		space(100),
		loud(5, 60)`
			The ${red`RawJS`} mindset is about focusing on
			${blue`questions`} that ${blue`matter`}.
		`,
		space(50),
		
		raw.div(
			"bubbles",
			Fn.quoteBubble`
				How long with it take to ${red`find`} and ${red`fix bugs`}
				as our app grows?
			`,
			space(50),
			Fn.quoteBubble`
				How easily can our code be ${blue`reused`} and ${blue`refactored`}?
			`,
			space(50),
			Fn.quoteBubble`
				How do we reduce ${red`unexpected behavior`}?
			`,
			space(50),
			Fn.quoteBubble`
				Does this ${blue`hold strong`} if we need to do something
				${blue`outside the box`}?
			`,
		)
	),
	
	section(
		space(300),
		loud(8, 68)`
			No ${red`hidden magic`} makes ${red`RawJS`} play nice with
			${blue`everything else`}.
		`,
		prose(32)`
			Are you a Tailwind user? Or DaisyUI? Framework7? Are you a Svelte user, but you need to go raw with one component? ${b`No problem`}. RawJS returns plain HTMLElement objects. It has ${b`no virtual DOM`} of its own, so it's never an obstacle in the way of anyone else's.
		`
	),
	
	section(
		space(300),
		loud(6, 68)`Bet on time-tested ${blue`web standards`}.`,
		space(50),
		prose(32)`
			Way back it was all about Backbone.js. Then it was Knockout. Then Angular. Then Ember. Then React. Then new Angular. Then Vue. Then React again. Now it's Svelte. And there are about 500 others that were once “the current thing”.
		`,
		prose(32)`
			${b`Web frameworks have the lifespan of a gnat`}. You can exit the rat race by using RawJS to make subtle changes (but big improvements) to the ergonomics of creating DOM element heirarchies, which have been around since the 90's.
		`,
		space(50),
		loud(5, 50)`Not the fashionable ${blue`web framework`} of ${red`the week`}.`,
	),
	
	section(
		space(300),
		loud(6, 50)`Ready for ${blue`production`}`,
		space(50),
		prose(30)`
			RawJS has been the foundation of many apps. It's API design is complete and there are ${b`no known bugs`}. And it's unlikely to ever change in the future because it reached a point where there is both ${b`nothing left to add`} and ${b`nothing left to remove`}.
		`,
		space(50),
		button.red(
			"Check out RawJS on GitHub", 
			"https://github.com/squaresapp/rawjs")
	),
	
	space(300),
	
	githubCorner("https://github.com/squaresapp/rawjs")
);
