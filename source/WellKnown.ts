
straw.file("/.well-known/apple-app-site-association", 
	JSON.stringify({
		applinks: {
			apps: [],
			details: [
				{
					appID: "8799JZFW79.app.squaresapp.org",
					paths: ["*"]
				}
			]
		},
	})
);
