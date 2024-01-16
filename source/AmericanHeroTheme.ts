
css.push(
	"*", {
		position: "relative",
		boxSizing: "border-box",
		margin: 0,
		padding: 0,
		fontFamily: "inherit",
	},
	"BODY", {
		color: "white",
		backgroundColor: "black",
		fontFamily: "Inter",
	},
	"SECTION", {
		marginLeft: "auto",
		marginRight: "auto",
		paddingLeft: "3vw",
		paddingRight: "3vw",
	},
	".left", {
		textAlign: "left",
	},
	".center", {
		textAlign: "center",
		marginLeft: "auto",
		marginRight: "auto",
	},
	".center > *", {
		marginLeft: "auto",
		marginRight: "auto",
	},
	".right", {
		textAlign: "right",
		marginLeft: "auto",
	},
	".right > *", {
		marginLeft: "auto",
	}
);

/** */
const enum align
{
	left = "left",
	center = "center",
	right = "right",
}

/** */
function red(text: TemplateStringsArray)
{
	return raw.span("red", raw.text(text[0]));
}

const redColor = "hsl(345, 100%, 50%)";
css.push(".red", { color: redColor });

/** */
function blue(text: TemplateStringsArray)
{
	return raw.span("blue", raw.text(text[0]));
}

const blueColor = "hsl(205, 100%, 50%)";
css.push(".blue", { color: blueColor });

/** */
function b(text: TemplateStringsArray)
{
	return raw.b(raw.text(text[0]));
}

css.push("B", { color: "white", fontWeight: 900 });

/** */
function loud(textSize: number, boxWidth?: number): 
	(tsa: TemplateStringsArray, ...items: (string | HTMLElement)[]) => HTMLElement
{
	return (tsa, ...items) => raw.p(
		"loud",
		{ fontSize: textSize + "vw", },
		!!boxWidth && { maxWidth: boxWidth + "vw" },
		raw.text(tsa, ...items)
	);
}

css.push(
	".loud", {
		fontWeight: 900,
		padding: "0.1em 0",
	}
);

/** */
function prose(boxWidth?: number): (tsa: TemplateStringsArray, ...items: (string | HTMLElement)[]) => HTMLElement
{
	return (tsa, ...items) => raw.p(
		"prose",
		!!boxWidth && { maxWidth: boxWidth + "em" },
		raw.text(tsa, ...items)
	);
}

css.push(
	".prose + .prose", {
		marginTop: "1.5em",
	},
	".prose, .button", {
		fontSize: "23px",
	},
	".prose", {
		lineHeight: 1.5,
		fontWeight: 400,
		color: "#AAA",
	},
	".prose B", {
		fontWeight: 900,
		color: "white",
	}
);

/** */
function unordered(...items: string[]): void;
function unordered(boxWidth: number, ...items: string[]): void;
function unordered(...args: any[])
{
	const boxWidth = typeof args[0] === "number" ? args.shift() : undefined;
	const items = args.slice(1);
	return raw.ul(
		"prose unordered",
		!!boxWidth && { maxWidth: boxWidth + "em" },
		items.map(item => raw.li(raw.text(item)))
	);
}

css.push(
	".unordered", {
		textAlign: "left",
		paddingLeft: "1em",
	}
);

/** */
function section(...params: Raw.Param<Raw.ElementAttribute>[]): HTMLElement
{
	return raw.section(align.center, ...params)
}

/** */
function h1(text: TemplateStringsArray,  ...items: (string | HTMLElement)[])
{
	return raw.h1(raw.text(text, ...items));
}

/** */
function h2(text: TemplateStringsArray,  ...items: (string | HTMLElement)[])
{
	return raw.h2(raw.text(text, ...items));
}

css.push(
	"H2", {
		fontSize: "40px",
		padding: "60px 0 20px 0",
	}
);

/** */
function p(text: TemplateStringsArray,  ...items: (string | HTMLElement)[])
{
	return prose()(text, ...items);
}

/** */
function br()
{
	return raw.br();
}

/** */
function code(text: TemplateStringsArray)
{
	return raw.code(raw.text(syntax.escape(text[0])));
}

css.push(
	"CODE", {
		color: "white",
		fontFamily: `"Fira Code", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace`,
	}
);

/** */
function a(label: string, href: string)
{
	return raw.a({ href }, raw.text(label));
}

css.push(
	".prose A", {
		color: "white",
		fontWeight: 900,
	}
);

/** */
namespace button
{
	/** */
	export function blue(text: string, href: string)
	{
		return raw.a(
			"button button-blue",
			{ href },
			raw.text(text)
		);
	}
	
	/** */
	export function red(text: string, href: string)
	{
		return raw.a(
			"button button-red",
			{ href },
			raw.text(text)
		);
	}
	
	css.push(
		".button", {
			display: "block",
			width: "fit-content",
			padding: "1em 3em",
			borderRadius: "10px",
			fontWeight: 900,
			textDecoration: "none",
			color: "white",
		},
		".button:focus", {
			outline: 0,
		},
		".button-blue", {
			backgroundColor: "hsl(205, 100%, 50%)",
		},
		".button-red", {
			backgroundColor: "hsl(345, 100%, 50%)",
		},
	);
	
	/** */
	export function ios()
	{
		return raw.a(
			"store-button apple-button",
			{
				href: "#",
				backgroundImage: `url(button-app-store)`,
			},
		);
	}
	
	css.push(".apple-button", {
		backgroundImage: `url(button-app-store)`,
	});
	
	/** */
	export function android()
	{
		return raw.a(
			"store-button play-button",
			{
				href: "#",
				backgroundImage: `url(button-play-store)`,
			},
		);
	}
	
	css.push(
		".store-button", {
			display: "block",
				boxShadow: `
					inset 0 0 4px rgba(255, 255, 255, 0.75)
				`,
				width: "300px",
				height: "100px",
				backgroundColor: "black",
				padding: "10px 30px",
				borderRadius: "20px",
				backgroundRepeat: "no-repeat",
				backgroundSize: "contain",
				backgroundPosition: "50% 50%",
				backgroundOrigin: "content-box",
		},
		".store-button + .store-button", {
			marginTop: "15px",
		},
		".play-button", {
			backgroundImage: `url(button-play-store)`,
		}
	);
}

/** */
function dots(axis: "x" | "y" = "y", count = 4)
{
	const sub: HTMLElement[] = [];
	
	for (let i = -1; ++i < count;)
		sub.push(raw.div());
	
	return raw.div(
		"dots dots-" + axis,
		{ zIndex: -2 },
		...sub
	);
}

css.push(
	".dots", {
		padding: "100px",
	},
	".dots > DIV", {
		margin: "auto",
		width: "26px",
		height: "26px",
		borderRadius: "100%",
		backgroundColor: "rgba(255, 255, 255, 0.25)"
	},
	".dots > DIV:not(:first-child)", {
		marginTop: "40px",
	}
);

/** */
function space(pixels: number): HTMLDivElement;
function space(unit: string): HTMLDivElement
function space(amount: number | string)
{
	const val = typeof amount === "string" ? amount : amount + "px";
	const cls = "space-" + amount.toString();
	const selector = "." + cls;
	
	if (!css.includes(selector))
		css.push(selector, { paddingTop: val });
	
	return raw.div(cls);
}

/** */
function githubCorner(url: string)
{
	const html = `
		<a href="${url}" class="github-corner" aria-label="View source on GitHub" style="position: fixed; top: 0; right: 0"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#fff; color:#151513; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
		<path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>
	`;
	
	const div = raw.div();
	div.innerHTML = html;
	const children = Array.from(div.children);
	children.map(c => c.remove());
	return children;
}


/*
This code is commented for now.
Once we make the transition to LinkeDOM,
we can start using custom elements.

declare namespace JSX
{
	interface IntrinsicElements
	{
		loud: E<LoudElementAttribute>;
	}
}

interface LoudElementAttribute extends Raw.ElementAttribute
{
	size: number;
	width: number;
}

class LoudElement extends HTMLElement
{
	set size(value: number)
	{
		this.style.fontSize = value + "vw";
	}
	
	set width(value: number)
	{
		this.style.maxWidth = value + "vw";
	}
	
	readonly nodeName = "DIV";
	readonly tagName = "DIV";
}

raw.define("loud", LoudElement);
*/