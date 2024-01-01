
/** */
function page(path: string, title: string, ...params: Straw.PageParam[])
{
	straw.page(path,
		
		raw.title(title),
		raw.meta({ charset: "UTF-8" }),
		raw.meta({ name: "viewport", content: "" }),
		raw.link({ rel: "preconnect", href: "https://fonts.googleapis.com" }),
		raw.link({ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true }),
		raw.link({ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap" }),
		raw.link({ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Inter:wght@400;900&display=swap" }),
		raw.link({ rel: "stylesheet", type: "text/css", href: "/static/prism.css" }),
		raw.style(...css),
		
		raw.script({
			src: "https://cdn.counter.dev/script.js",
			data: { id: "a7871322-aef0-45c0-8e10-9b636242c2dc", utcoffset: -5 }
		}),
		
		...params,
		footer()
	);
}

/** */
function doc(path: string, title: string, ...params: Straw.PageParam[])
{
	return page(path, title,
		raw.div(
			{
				maxWidth: "1000px",
				margin: "auto",
			},
			raw.css(
				" .button", {
					margin: "50px auto",
				}
			),
			...params
		)
	);
}
