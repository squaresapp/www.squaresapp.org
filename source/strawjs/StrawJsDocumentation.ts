
doc("/strawjs/documentation", "Straw JS Documentation", 
	straw.icon("straw-favicon"),
	
	raw.get(renderStrawHeader(10))(
		raw.div(
			{
				textAlign: "center",
				fontSize: "22px",
				fontWeight: 900,
				textTransform: "uppercase",
			},
			raw.text("Documentation")
		)
	),
	
	h2`Getting Started`,
	
	p`In order to start using StrawJS, the first thing you should do is create a fresh directory for your new website, and run this command from within it in the terminal:`,

syntax.plain`npx strawjs init`,

p`This creates a minimal project with just enough to get going.`,

p`${b`There are 3 directories`} of interest:`,

p`${b`/site`} - This directory contains the build output of your website. This directory isn't included in source control, as you can see from the generated ${code`.gitignore`} file.`,

p`${b`/source`} - This directory contains anything that needs to be processed by StrawJs. This includes TypeScript source files, images, and icons. For organizational purposes, you can also put original source documents in here, like .sketch or .psd files (if you're a Sketch of Photoshop user), even though these files aren't touched by StrawJS.`,

p`${b`/static`} - This directory contains any files that are used by your website without any processing by StrawJS. Examples would include downloadable PDFs, large video files, or CSS library files you've downloaded from somewhere (such as tailwind CSS).`,

p`The static directory is ${b`symlinked into the /site`} directory. In order to reference files in the static directory from within your site, you would structure the URI in your HTML element to look something like this:`,

syntax.typescript`raw.link({ rel: "stylesheet", href: "/static/tailwind.css" })`,

h2`Organizing Your Project`,

p`You'll also notice it creates a ${code`.code-workspace`} file. Open this file in Visual Studio Code. Then run the code by hitting the run and debug button. Running your code and debugging are the same action.`,

p`Ideally, you should have Visual Studio Code installation configured with a well-selected hotkey to trigger a debugging session. This will let you quickly rebuild with a keystroke. To view or assign a hotkey, open ${b`Code`} Menu > ${b`Settings...`} > ${b`Keyboard Shortcuts`} and search for ${b`debug start`}.`,

p`You'll find that there's no use of ${code`import`} statements in the default code. Feel free to put code files anywhere in the ${code`/source`} directory, and TypeScript will find all your source files, calls to ${code`straw.page(...)`}, and build everything. An organization technique we've found useful is to mirror your expected URL structure as directories, and then each directory has a TypeScript file that contains the page content, and the resources associated with it (images, or otherwise).`,

p`
StrawJS encourages avoiding modules only because ${a("ES Modules are terrible, actually", "https://gist.github.com/joepie91/bca2fda868c1e8b2c2caf76af7dfcad3?permalink_comment_id=4657938")}, but because the sheer magnitude of suck increases beyond the point of tractability when your content pages are code files. Having an ${code`import x from y`} dumpster at the top of every content page is ${b`objectively awful`}.
`,

p`This is why we strongly encourage TypeScript. StrawJS makes use of TypeScript's ${b`big-list-of-files`} bundling feature to auto-discover all code files, merge them together, and run the code. Even if you're a JavaScript die-hard and dislike having typings in your code, the amount typings you'll actually see is near zero, due to the way StrawJS website code works.`,

p`Some people believe that big-list-of-files means you can't get type-safe dependencies. ${b`This isn't true`}. If you need use an npm dependency and don't want to lose the TypeScript typings, you can ${code`require`} the dependency this:`,

syntax.typescript`
	const foo = require("foo") as typeof import("foo");
`,

h2`Element Hoisting`,

p`StrawJS automatically ${b`hoists the elements that belong`} in the ${code`<head>`} section of the HTML page to the top. This includes (${code`<base>`}, ${code`<link>`}, ${code`<meta>`}, ${code`<style>`}, and ${code`<title>`}. This can make organizing your website much easier. For example, if you want to make a function that requires a custom CSS style sheet via a ${code`<link>`} tag whenever its used, you can simply return it as part of the function's return value, and the element will be rendered at the top.`,

h2`Image Processing`,

p`${b`StrawJS rewrites image URIs`} for you. StrawJS doesn't require you to specify a file extension for the URI that points to an image file. This is helps you avoid having to remember if an image is a jpg, a webp, or a png, and eliminates the book-keeping that otherwise happens if you change the format of an image.`,

p`${b`In StrawJS, you omit image paths`}. The paths to the source images are ${b`auto-discovered`} by searching the ${code`/source`} directory and all nested directories. After being processed, all images land in the ${code`/site/resources/images`} directory.`,

p`${b`Image URI rewriting happens`} on image files specified in HTML attributes (such as ${code`src`}), CSS properties (such as ${code`background-image`} and ${code`mask-image`}), as well as generated icons.`,

syntax.typescript`
straw.page("/",

	// Will generate a series of <link> tags pointing
	// to icons with different sizes, with each href
	// attribute looking like:
	// href="/resources/icons/favicon.crc.32w.png"
	straw.icon("favicon"),

	raw.div({
		// Rewritten in the generated CSS as
		// url("/resources/images/my-bg.crc.png")
		backgroundImage: "url(my-bg)",
	}),
	
	// Rewritten in the output HTML file as
	// src="/resources/images/my-image.crc.jpg"
	raw.img({ src: "my-image" }),
);
`,

p`${b`StrawJS includes image manipulation features`}, such as resizing, cropping, and basic filters. This is powered by the Rust-based image processing library ${a("Photon", "https://silvia-odwyer.github.io/photon/")}. These features are accessed by appending a querystring on to the end of the image file name.`,

syntax.typescript`"my-image?w=100,crop=0,0,200,200,blur=10"`,

p`The query parameters are comma-separated. The above example takes an image, crops it to 200x200 starting at the top left corner, then resizes it to 100x100, and adds a 10 pixel blur.`,

p`StrawJS tries to ${b`maintain the aspect ratio`} of the source image, or the crop region. If you omit the ${code`w`} parameter, but keep the ${code`h`} parameter, or vice versa, it will calculate the missing dimension automatically by proportionally scaling the specified dimesion.`,

raw.get(h2`All Processing Options Specified`)({ textAlign: "center" }),

syntax.typescript`
// Resizes the image to 100 pixels in width,
// and infers the height proportionally.
"my-image?w=100"

// Resizes the image to 100 pixels in height,
// and infers the width proportionally.
"my-image?h=100"

// Creates a potentially distorted image by
// forcing the dimensions to be 100x100
"my=image?w=100,h=100"

// Cropping takes 4 numbers which are
// in the order x1, y1, x2, y2. Crops the
// image at the points (0, 0), (100, 100)
// The number in the second coordinate
// pair needs to be greater than the first,
// or an error will be generated.
"my-image?crop=0,0,100,100"

// Applies a blur filter to the image. The
// blur filter doesn't screw up the blurring
// around edges like some naive blur filters
// do. It doesn't suck.
"my-image?blur=10"

// Performs an HSL hue rotation on the image.
// The number is expected to be somewhere
// between -360 and 360.
"my-image?hue=-30"

// Performs an HSL saturation adjustment 
// on the image. The number is expected to
// be somewhere between -100 and 100.
// To grayscale the image, make this -100.
"my-image?sat=-100"

// Performs an HSL lightness adjustment 
// on the image. The number is expected to
// be somewhere between -100 and 100.
"my-image?light=-100"
`,

h2`A Complete Example`,

p`Sometimes it's helpful to see what a real production website looks like in order to get an idea for how to use something. For this, you should take a look at the repository for this very website.`,

button.blue(
	"See the repository for this website.",
	"https://github.com/squaresapp/www.squaresapp.org"
),

p`This website uses a custom theme that we call the "American Hero Theme". If you open the ${code`AmericanHeroTheme.ts`} file, you'll notice that it contains a bunch of loose functions that we reuse everywhere in order to create the multi-colored titles and syntax-colored code blocks that you see everywhere across this website. This website is MIT licensed, so you're free to copy this theme and make it your own.`,

h2`JSX Usage`,

p`Because RawJS has full support for JSX, so does StrawJS. You're therefore able to construct as much or as little of your website code with the (JSX-flavored) HTML syntax as you like.`,

syntax.typescript`
	straw.page("/",
		<h1>Welcome to my <b>website</b>!</h1>
	);
`,

p`However, from an experience perspective, we as the developers of StrawJS don't actually use JSX because we find it both more powerful and convenient to use the ${code`raw.element`} syntax with ad-hoc string template functions (in order to shorten common things like the creation of ${code`<p>`} tags). To understand our perspective, it may be helpful to see the original TypeScript source code of this page.`,

button.blue("See the TypeScript source of this page.", "https://github.com/squaresapp/www.squaresapp.org/blob/main/source/strawjs/StrawJsDocumentations.ts"),

h2`Webfeed Generation`,

p`StrawJS allows you to very easily create and manage webfeeds in order to make your pages discoverable by ${b`webfeed`} readers such as ${a("Squares", "/")}. In order to make a page webfeed-compatible, use the overload of ${code`straw.page()`} that takes a creation date parameter:`,

syntax.typescript`
	straw.page(
		"/myfeed/some-feed-post/",
		new Date("01-20-2024"),
		
		// ...
	);
`,

p`Then, define a webfeed index by calling ${code`straw.feed()`} method. The path specified in ${code`root`} signals to StrawJS that all pages nested within this path are to be included in the webfeed index, and are to be sorted according to their creation dates. An ${code`index.txt`} file (the webfeed index) is written in the root directory.`,

syntax.typescript`
	straw.feed({
		root: "/myfeed/",
		author: "Paul Gordon",
		description: "Paul's Webfeed",
		icon: "avatar.png",
	});
`,

button.blue("See Squares to learn about Webfeeds.", "/"),

githubCorner("https://github.com/squaresapp/strawjs"),

);