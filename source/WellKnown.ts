
// iOS Universal Links file
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

// Android Universal Links file
straw.file("/.well-known/assetlinks.json",
	JSON.stringify([{
		relation: ["delegate_permission/common.handle_all_urls"],
		target : {
			namespace: "android_app",
			package_name: "app.squaresapp.org",
			sha256_cert_fingerprints: ["79:26:BE:31:88:24:75:49:AC:BE:10:E1:D3:C3:9B:42:AE:D9:13:3B:FD:DE:25:5F:2B:A0:C7:A7:C1:0F:C3:9A"]
		}
	}])
);
