
doc("/strawjs/documentation", "Straw JS Documentation", 
	straw.icon("straw-favicon"),
	
	p`In order to start using StrawJS, the first thing you should do is create a fresh directory for your new website, and run this command from within it in the terminal:`,

syntax.plain`npx strawjs init`,

p`You'll notice this ${b`creates 3 folders`}:`,

p`${b`/site`} - This folder contains the build output of your website. This folder isn't included in source control, as you can see from the generated .gitignore file.`,

p`${b`/source`} - This folder contains anything that needs to be processed by StrawJs. This includes TypeScript source files, images, and icons. For organizational purposes, you can also put original source documents in here, like .sketch or .psd files (if you're a Sketch of Photoshop user), even though these files aren't touched by StrawJS.`,

p`${b`/static`} - This folder contains any files that are used by your website without any processing by StrawJS. Examples would include downloadable PDFs, large video files, or CSS library files you've downloaded from somewhere (such as tailwind CSS).`,

p`The static folder is ${b`symlinked into the /site`} folder. In order to reference files in the static folder from within your site, you would structure the URI in your HTML element to look something like this:`,

syntax.typescript`raw.link({ rel: "stylesheet", href: "/static/tailwind.css" })`,


h2`Organizing Your Project`,

p`You'll also notice it creates a ${code`.code-workspace`} file. Open this file in Visual Studio Code.`,
p`Once the code is loaded, you'll notice that `,


p`StrawJS automatically ${b`hoists the elements that belong`} in the ${code`<head>`} section of the HTML page to the top. This includes (${code`<base>`}, ${code`<link>`}, ${code`<meta>`}, ${code`<style>`}, and ${code`<title>`}. This can make organizing your website much easier. For example, if you want to make a function that requires a custom CSS style sheet via a ${code`<link>`} tag whenever its used, you can simply return it as part of the function's return value, and the element will be rendered at the top.`,

h2`Image Processing`,

p`${b`StrawJS rewrites image URIs`} for you. StrawJS doesn't require you to specify a file extension for the URI that points to an image file. This is helps you avoid having to remember if an image is a jpg, a webp, or a png, and eliminates the book-keeping that otherwise happens if you change the format of an image.`,

p`${b`In StrawJS, you omit image paths`}. The paths to the source images are ${b`auto-discovered`} by searching the ${code`/source`} folder and all nested directories. After being processed, all images land in the ${code`/site/resources/images`} folder.`,

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

p`Because RawJS has full support for JSX, so does StrawJS. You're therefore able to construct as much or as little of your website code with the HTML syntax as you like. However, from an experience perspective, the developers of StrawJS don't actually use JSX because we find it both more powerful and convenient to use the ${code`raw.element`} syntax with ad-hoc string template functions (in order to shorten common things like the creation of ${code`<p>`} tags). Though your experience may be different. To understand what we mean, it may be helpful to see the original TypeScript source code of this exact page.`,

button.blue("See the TypeScript source of this page", "")

);
