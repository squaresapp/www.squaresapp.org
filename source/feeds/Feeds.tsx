
{
	type TWebfeed = { name: string, url: string, poster: string };
	
	const webfeeds: TWebfeed[] = [
		{
			name: "Tulips",
			url: "https://webfeed-tulips.pages.dev/index.txt",
			poster: "https://webfeed-tulips.pages.dev/resources/images/pexels-photo-1076607.1y4p07k.jpeg",
		},
		{
			name: "Homes",
			url: "https://webfeed-homes.pages.dev/index.txt",
			poster: "https://webfeed-homes.pages.dev/resources/images/pexels-photo-2816323.l2t0n4.jpeg"
		},
		{
			name: "Beaches",
			url: "https://webfeed-beaches.pages.dev/index.txt",
			poster: "https://webfeed-beaches.pages.dev/resources/images/pexels-photo-269583.6abr13.jpeg"
		}
	];
	
	function renderWebfeed(wf: TWebfeed)
	{
		const out = <div class="webfeed-item">
			<div class="image-container">
				<img src={ wf.poster } />
				<div class="image-title">{ wf.name }</div>
			</div>
			{ button.blue("Follow", wf.url) }
		</div>;
		
		return out;
	}
	
	css.push(
		".webfeeds-list", {
			maxWidth: "1000px",
		},
		".webfeeds-list:after", {
			content: `""`,
			display: "table",
			clear: "both",
		},
		".webfeeds-list .webfeed-item", {
			width: "30%",
			margin: "1.65%",
			float: "left",
		},
		".webfeeds-list IMG", {
			maxWidth: "100%",
			borderRadius: "10px",
		},
		".webfeeds-list .image-title", {
			position: "absolute",
			left: "20px",
			bottom: "20px",
			fontWeight: 900,
			fontSize: "30px",
			textShadow: "0 4px 5px rgba(0, 0, 0, 0.33)",
		},
		".webfeed-item > .button", {
			width: "100%",
			margin: "20px 0",
		}
	);
	
	page("/feeds", "Sample Webfeeds",
		section(
			space(100),
			loud(8)`Webfeed Samples`,
			prose(30)`
				Below are some sample webfeeds that you can add to your webfeed reader (Squares). You should have Squares installed on your device in order to follow these feeds.
			`,
			space(50),
			<div class="webfeeds-list">
				{webfeeds.map(wf => renderWebfeed(wf))}
			</div>
		)
	);
}
