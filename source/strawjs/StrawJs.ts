
page("/strawjs", "StrawJS: A Static Site Generation Library",
	section(
		space(100),
		raw.div(
			raw.css(
				"&", {
					width: "fit-content",
					padding: "0 6%",
				},
				"&:before, &:after", {
					content: `""`,
					position: "absolute",
					top: 0,
					bottom: 0,
					width: "40px",
					transform: "rotate(10deg)",
					backgroundImage: "url(graphic-straw)",
					backgroundSize: "contain",
					backgroundRepeat: "no-repeat",
					zIndex: 1
				},
				":before", {
					left: 0,
					transformOrigin: "0 100%",
					backgroundPosition: "0 0",
				},
				":after", {
					right: 0,
					transformOrigin: "100% 0",
					backgroundPosition: "100% 0",
				}
			),
			raw.h1(
				{
					fontSize: "15vw"
				},
				t`Straw${red`JS`}`
			)
		),
		space(80),
		p(31)`
			${b`StrawJS`} is a new approach to static site generation. StrawJS allows your entire website to be a ${b`runnable block of JavaScript`} that leverages the powerful ergonomics found in RawJS. StrawJS isn't another pile of plugins, preprocessors, and configuration. Rather&#8212;it's a lightweight static site generation ${b`library`}.
		`,
		Fn.colorPlain(`$ npx strawjs init`),
		Fn.colorTypescript(`
			require("strawjs");
			const straw = new Straw.Site();
			
			straw.page("/",
				<h1>Welcome to my website!</h1>
			);
			
			straw.emit();
		`),
		space(200),
	),
	
	section(
		text(5, 60)`${red`Axe`} the pre-processors and use ${blue`JavaScript`} for ${blue`everything`}.`,
		space(50),
		p(33)`
			The elegance of ${b`RawJS`} combined with its best-in-class CSS-within-JS feature means you can use JavaScript as your ${b`one language for everything`}. End the hodge-podge of EJS, Handlebars, SASS, LESS, and endless other preprocessors that are all basically less-featured versions of JavaScript. Want something like an HTML import or a CSS @include?  ${b`Make a function and call it`}.
		`,
		Fn.colorTypescript(`
			straw.page("/",
				mySharedHeader(),
				<h1>Welcome to my website!</h1>,
				mySharedFooter()
			);
		`),
		space(200),
	),
	
	section(
		text(8, 80)`
			${red`Code`} your website with the ${red`full power`} of ${blue`JavaScript`}.
		`,
		space(50),
		p(32)`
			Remember&#8212;StrawJS is a static site generation library, without opinions. Your entire website becomes a ${b`simple emitter function`} written in JavaScript. Step-debugging is a first-class feature. Want some pages to be generated from a database? Just make your emitter function do this. You don't have to worry about plugins or hooking into some API.
		`,
		space(200),
	),
	
	section(
		text(10, 70)`Image processing ${blue`done`} ${red`right`}.`,
		space(50),
		raw.div(
			{
				width: "600px",
				height: "550px",
				margin: "auto",
			},
			raw.img({
				src: "image-processing-photo?width=300",
				position: "absolute",
				top: "40px",
				left: "-12px",
				transformOrigin: "50% 50%",
				transform: "rotate(-10deg)",
				border: "10px solid white",
			}),
			raw.img({
				src: "image-processing-photo?width=200,gray",
				position: "absolute",
				top: "40px",
				right: 0,
				transformOrigin: "50% 50%",
				transform: "rotate(10deg)",
				border: "10px solid white",
			}),
			raw.img({
				src: "image-processing-arrow",
				position: "absolute",
				top: "30px",
				left: "280px",
				transform: "rotate(-10deg)",
				zIndex: -1
			}),
		),
		p(30)`
			StrawJS uses the ultra-fast rust-based ${b`Photon`} library for ${b`on-the-fly`} image processing. It generates size, crop, and effects variations from source images according to your specs, and ${b`auto-resolves`} file extensions and source paths.
		`,
		Fn.colorTypescript(`
			straw.page("/products/my-product", 
				// "my-image" could be my-image.jpg, my-image.webp,
				// or another image extension and it will still be found.
				// The final path in the src attribute will be a path in
				// StrawJS's output images folder.
				raw.img({ src: "my-image?width=300,gray" })
			);
		`),
		button.blue(
			"See all image processing options",
			"https://github.com/squaresapp/straw/blob/main/readme.md"),
		space(200),
	),
	
	section(
		text(15)`${red`Fast`}.`,
		p(30)`
			When your entire website is readily-executable ${b`JavaScript code`}, you avoid the weight and bloat caused by preprocessors that have to deal with parsing and transformation.
		`,
		space(150),
	),
	
	section(
		text(10)`${blue`Maintained`}.`,
		p(27)`
			${b`StrawJS`} is being used to support a number of production websites, ${b`including this one`}. It's also the official library for creating webfeeds, which is the foundational technology that powers the content in ${b`Squares`}, a funded social media technology app.
		`,
		space(150)
	)
);
