
const css: (string | Raw.Style)[] = [
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
	".width", {
		margin: "auto",
		maxWidth: "1000px",
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
	},
	".paragraph + .paragraph", {
		marginTop: "1.5em",
	},
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
];

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

css.push(".red", { color: "hsl(345, 100%, 50%)" });

/** */
function blue(text: TemplateStringsArray)
{
	return raw.span("blue", raw.text(text[0]));
}

css.push(".blue", { color: "hsl(205, 100%, 50%)" });

/** */
function b(text: TemplateStringsArray)
{
	return raw.b(raw.text(text[0]));
}

css.push("B", { color: "white", fontWeight: 900 });

/** */
function p(boxWidth?: number): (tsa: TemplateStringsArray, ...items: (string | HTMLElement)[]) => HTMLElement
{
	return (tsa, ...items) => raw.p(
		"paragraph",
		!!boxWidth && { maxWidth: boxWidth + "em" },
		raw.text(tsa, ...items)
	);
}

/** */
function text(textSize: number, boxWidth?: number): 
	(tsa: TemplateStringsArray, ...items: (string | HTMLElement)[]) => HTMLElement
{
	return (tsa, ...items) => raw.p(
		"text",
		{ fontSize: textSize + "px", },
		!!boxWidth && { maxWidth: boxWidth + "em" },
		raw.text(tsa, ...items)
	);
}

/** */
function section(...params: Raw.Param<Raw.ElementAttribute>[]): HTMLElement
{
	return raw.section(align.center, ...params)
}

/** */
function br()
{
	return raw.br();
}

/** */
namespace button
{
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
		}
	);
	
	/** */
	export function ios()
	{
		return raw.a(
			"store-button apple-button",
			{
				href: "#",
				backgroundImage: `url(${straw.image("button-app-store")})`,
			},
		);
	}
	
	css.push(".apple-button", {
		backgroundImage: `url(${straw.image("button-app-store")})`,
	});
	
	/** */
	export function android()
	{
		return raw.a(
			"store-button play-button",
			{
				href: "#",
				backgroundImage: `url(${straw.image("button-play-store")})`,
			},
		);
	}
	
	css.push(".play-button", {
		backgroundImage: `url(${straw.image("button-play-store")})`,
	});
	
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
}

/** */
function dots(axis: "x" | "y" = "y", count = 4)
{
	const sub: HTMLElement[] = [];
	
	for (let i = -1; ++i < count;)
		sub.push(raw.div());
	
	return raw.div(
		"dots dots-" + axis,
		{
			
		},
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

css.push(
	".paragraph, .button", {
		fontSize: "23px",
	},
	".paragraph", {
		lineHeight: 1.5,
		fontWeight: 400,
		color: "#B3B3B3",
	},
	".paragraph B", {
		fontWeight: 900,
		color: "white",
	},
	".text", {
		fontWeight: 900,
		padding: "0.1em 0",
	},
);

/** */
function space(pixels: number)
{
	const cls = "space-" + pixels;
	const selector = "." + cls;
	
	if (!css.includes(selector))
		css.push(selector, { paddingTop: pixels + "px" });
	
	return raw.div(cls);
}
