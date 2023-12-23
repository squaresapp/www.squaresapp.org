"use strict";
// The globalThis value isn't available in Safari, so a polyfill is necessary:
if (typeof globalThis === "undefined")
    window.globalThis = window;
// If the DEBUG flag is undefined, that means that the executing code
// has not passed through terser, and so we are either running in a
// cover function, or in one of the hosts in debug mode. In this case,
// we set the compilation constants explicitly at runtime.
if (typeof DEBUG === "undefined")
    Object.assign(globalThis, { DEBUG: true });
if (typeof ELECTRON === "undefined")
    Object.assign(globalThis, { ELECTRON: typeof screen + typeof require === "objectfunction" });
if (typeof TAURI === "undefined")
    Object.assign(globalThis, { TAURI: typeof window !== "undefined" && typeof window.__TAURI__ !== "undefined" });
if (typeof IOS === "undefined")
    Object.assign(globalThis, { IOS: navigator.platform.startsWith("iP") });
if (typeof ANDROID === "undefined")
    Object.assign(globalThis, { ANDROID: navigator.userAgent.includes("Android") });
if (typeof DEMO === "undefined")
    Object.assign(globalThis, { DEMO: !(Number(window.location.hostname.split(".").join("")) > 0) });
const t = raw.text;
var Squares;
(function (Squares) {
    /**
     * This is the main entry point of the app.
     * When running in Tauri, this function is called from the auto-generated index.html file.
     */
    async function startup() {
        // The CAPACITOR constant needs to be defined after the document has loaded,
        // otherwise, window.Capacitor will be undefined (on Android, it doesn't appear
        // to be injected right away.
        if (typeof CAPACITOR === "undefined")
            Object.assign(globalThis, { CAPACITOR: typeof Capacitor === "object" });
        const g = globalThis;
        if (ELECTRON) {
            const g = globalThis;
            g.Electron = Object.freeze({
                fs: require("fs"),
                path: require("path")
            });
        }
        else if (TAURI) {
            const g = globalThis;
            g.Tauri = g.__TAURI__;
        }
        if (CAPACITOR) {
            g.Toast = g.Capacitor?.Plugins?.Toast;
            g.BackgroundFetch = g.Capacitor?.Plugins?.BackgroundFetch;
            g.Capactor?.Clipboard;
        }
        if (ELECTRON) {
            g.Hat = require("@squaresapp/hatjs").Hat;
            g.Fila = require("fila-core").Fila;
            g.FilaNode = require("fila-node").FilaNode;
            FilaNode.use();
        }
        else if (TAURI)
            FilaTauri.use();
        else if (CAPACITOR)
            FilaCapacitor.use();
        else if (DEMO)
            FilaKeyva.use();
        if (DEBUG || DEMO)
            await Squares.Data.clear();
        if (DEBUG) {
            const dataFolder = await Squares.Util.getDataFolder();
            if (!await dataFolder.exists())
                await dataFolder.writeDirectory();
            await Squares.runDataInitializer(Squares.feedsForDebug);
        }
        else if (DEMO) {
            await Squares.runDataInitializer(Squares.feedsForDemo);
        }
        Squares.appendCssReset();
        await Squares.Data.initialize();
        const rootHat = new Squares.RootHat();
        await rootHat.construct();
        document.body.append(rootHat.head);
    }
    Squares.startup = startup;
    document.addEventListener("readystatechange", () => document.readyState === "complete" && startup());
})(Squares || (Squares = {}));
//@ts-ignore
if (typeof module === "object")
    Object.assign(module.exports, { Squares });
//! This file is assume-unchanged in git
var Squares;
//! This file is assume-unchanged in git
(function (Squares) {
    //@ts-ignore
    if (!DEBUG)
        return;
    Squares.feedsForDebug = [
        "https://raw.githubusercontent.com/squaresapp/webfeed-examples/main/raccoons/index.txt",
        "https://raw.githubusercontent.com/squaresapp/webfeed-examples/main/red-flowers/index.txt",
    ];
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    //@ts-ignore
    if (!DEMO)
        return;
    Squares.feedsForDemo = [
        "https://raw.githubusercontent.com/squaresapp/webfeed-examples/main/raccoons/index.txt",
        "https://raw.githubusercontent.com/squaresapp/webfeed-examples/main/red-flowers/index.txt",
    ];
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /** */
    function UnfollowSignal(feedKey) { }
    Squares.UnfollowSignal = UnfollowSignal;
    /** */
    function FollowSignal(feed) { }
    Squares.FollowSignal = FollowSignal;
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    let Strings;
    (function (Strings) {
        Strings["following"] = "Following";
        Strings["unfollow"] = "Unfollow";
        Strings["nowFollowing"] = "Now following";
        Strings["share"] = "Share";
        Strings["unknownAuthor"] = "(Author Unknown)";
    })(Strings = Squares.Strings || (Squares.Strings = {}));
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /**
     *
     */
    class BackgroundFetcher {
        /** */
        constructor() {
            //! Not implemented
        }
    }
    Squares.BackgroundFetcher = BackgroundFetcher;
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    var Data;
    (function (Data) {
        /** */
        async function initialize() {
            for (const postFila of await readScrollFilas("json")) {
                const key = parseInt(postFila.name) || 0;
                const postKeys = await readScrollPostKeys(key);
                scrollPostCounts.set(key, postKeys.length);
            }
        }
        Data.initialize = initialize;
        /** */
        function readScrollPostCount(scrollKey) {
            return scrollPostCounts.get(scrollKey) || 0;
        }
        Data.readScrollPostCount = readScrollPostCount;
        const scrollPostCounts = new Map();
        /** */
        async function writeScroll(defaults) {
            const scroll = Object.assign({
                key: Squares.Util.getSafeTicks(),
                anchorIndex: 0,
                feeds: []
            }, defaults);
            const diskScroll = {
                anchorIndex: scroll.anchorIndex,
                feeds: scroll.feeds.map(s => s.key),
            };
            const key = scroll.key;
            const json = JSON.stringify(diskScroll);
            const fila = await getScrollFile(key);
            await fila.writeText(json);
            return scroll;
        }
        Data.writeScroll = writeScroll;
        /** */
        async function writeScrollPost(scrollKey, post) {
            const fila = await getScrollPostsFile(scrollKey);
            const keys = [post.key];
            await appendArrayFile(fila, keys);
            scrollPostCounts.set(scrollKey, (scrollPostCounts.get(scrollKey) || 0) + 1);
        }
        Data.writeScrollPost = writeScrollPost;
        /**
         * Read the scroll object from the file system with the specified key.
         * If the argument is omitted, the first discovered scroll is returned.
         */
        async function readScroll(key) {
            if (!key)
                for (const fila of await readScrollFilas("json"))
                    key = keyOf(fila);
            if (!key)
                return null;
            const fila = await getScrollFile(key);
            if (!await fila.exists())
                return null;
            const diskScrollJson = await fila.readText();
            const diskScroll = JSON.parse(diskScrollJson);
            const feeds = [];
            for (const feedKey of diskScroll.feeds) {
                const feed = await readFeed(feedKey);
                if (feed)
                    feeds.push(feed);
            }
            const scroll = {
                anchorIndex: diskScroll.anchorIndex,
                key,
                feeds,
            };
            return scroll;
        }
        Data.readScroll = readScroll;
        /** */
        async function* readScrolls() {
            for (const fila of await readScrollFilas("json")) {
                const key = keyOf(fila);
                const scroll = await readScroll(key);
                if (scroll)
                    yield scroll;
            }
        }
        Data.readScrolls = readScrolls;
        /** */
        async function readScrollFilas(type) {
            const folder = await getScrollFolder();
            const filas = await folder.readDirectory();
            const reg = new RegExp("^[0-9]+\\." + type + "$");
            return filas.filter(f => reg.test(f.name));
        }
        /** */
        async function readScrollPost(scrollKey, index) {
            for await (const post of readScrollPosts(scrollKey, { start: index, limit: 1 }))
                return post;
            return null;
        }
        Data.readScrollPost = readScrollPost;
        /** */
        async function* readScrollPosts(scrollKey, options) {
            for (const postKey of await readScrollPostKeys(scrollKey, options)) {
                const post = await readPost(postKey);
                if (post)
                    yield post;
            }
        }
        Data.readScrollPosts = readScrollPosts;
        /** */
        async function readScrollPostKeys(scrollKey, options) {
            const fila = await getScrollPostsFile(scrollKey);
            const postKeys = await readArrayFile(fila, options);
            return postKeys;
        }
        /** */
        async function getScrollFolder() {
            const fila = await Squares.Util.getDataFolder();
            return fila.down("scrolls");
        }
        /** */
        async function getScrollFile(key) {
            return (await getScrollFolder()).down(key + ".json");
        }
        /** */
        async function getScrollPostsFile(key) {
            return (await getScrollFolder()).down(key + ".txt");
        }
        /**
         * Creates a new IFeed object to disk, optionally populated with the
         * specified values, writes it to disk, and returns the constructed object.
         */
        async function writeFeed(...defaults) {
            const key = Squares.Util.getSafeTicks();
            const feed = Object.assign({
                key,
                url: "",
                icon: "",
                author: "",
                description: "",
                size: 0,
            }, ...defaults);
            const diskFeed = Object.assign({}, feed);
            delete diskFeed.key;
            const json = JSON.stringify(diskFeed);
            const fila = await getFeedFile(key);
            await fila.writeText(json);
            return feed;
        }
        Data.writeFeed = writeFeed;
        /** */
        async function writeFeedPost(feedKey, postKeys) {
            const fila = await getFeedPostsFile(feedKey);
            await appendArrayFile(fila, postKeys);
        }
        /**
         *
         */
        async function readFeed(key) {
            let fila = await getFeedFile(key);
            if (!await fila.exists()) {
                fila = await getFeedFileArchived(key);
                if (!await fila.exists())
                    return null;
            }
            const jsonText = await fila.readText();
            const feed = JSON.parse(jsonText);
            feed.key = key;
            return feed;
        }
        Data.readFeed = readFeed;
        /**
         * Reads all non-archived feeds from the file system.
         */
        async function* readFeeds() {
            const folder = (await getFeedFile(0)).up();
            const files = await folder.readDirectory();
            for (const file of files) {
                if (file.extension !== ".json")
                    continue;
                const key = keyOf(file);
                const feed = await readFeed(key);
                if (feed)
                    yield feed;
            }
        }
        Data.readFeeds = readFeeds;
        /** */
        async function* readFeedPosts(feedKey) {
            for (const postKey of await readFeedPostKeys(feedKey)) {
                const post = await readPost(postKey);
                if (post)
                    yield post;
            }
        }
        Data.readFeedPosts = readFeedPosts;
        /** */
        async function readFeedPostKeys(feedKey) {
            const fila = await getFeedPostsFile(feedKey);
            const postKeys = await readArrayFile(fila);
            return postKeys;
        }
        /**
         * Moves the feed file to the archive (which is the unfollow operation).
         */
        async function archiveFeed(feedKey) {
            const src = await getFeedFile(feedKey);
            const json = await src.readText();
            const dst = await getFeedFileArchived(feedKey);
            dst.writeText(json);
            src.delete();
            // Remove the feed from any scroll files.
            for (const fila of await readScrollFilas("json")) {
                const diskScrollJson = await fila.readText();
                const diskScroll = JSON.parse(diskScrollJson);
                for (let i = diskScroll.feeds.length; i-- > 0;) {
                    const key = diskScroll.feeds[i];
                    if (key === feedKey)
                        diskScroll.feeds.splice(i, 1);
                }
                const diskScrollJsonNew = JSON.stringify(diskScroll);
                fila.writeText(diskScrollJsonNew);
            }
        }
        Data.archiveFeed = archiveFeed;
        /** */
        async function getFeedsFolder() {
            const fila = await Squares.Util.getDataFolder();
            return fila.down("feeds");
        }
        /** */
        async function getFeedFile(key) {
            return (await getFeedsFolder()).down(key + ".json");
        }
        /** */
        async function getFeedPostsFile(key) {
            return (await getFeedsFolder()).down(key + ".txt");
        }
        /** */
        async function getFeedFileArchived(key) {
            const fila = await Squares.Util.getDataFolder();
            return fila.down("feeds-archived").down(key + ".json");
        }
        /**
         * Writes the URLs contained in the specified to the file system, in their full-qualified
         * form, and returns an object that indicates what URLs where added and which ones
         * were removed from the previous time that this function was called.
         *
         * Worth noting that the URLs are expected to be in their fully-qualified form,
         * which is different from how the URLs are typically written in the feed text file.
         */
        async function captureRawFeed(feed, urls) {
            if (!feed.key)
                throw new Error("Cannot capture this feed because it has no key.");
            const added = [];
            const removed = [];
            const filaRaw = (await getFeedsRawFolder()).down(feed.key + ".txt");
            if (await filaRaw.exists()) {
                const rawText = await filaRaw.readText();
                const rawLines = rawText.split("\n");
                const rawLinesSet = new Set(rawLines);
                const urlsSet = new Set(urls);
                for (const url of rawLines)
                    if (!urlsSet.has(url))
                        removed.push(url);
                for (const url of urls)
                    if (!rawLinesSet.has(url))
                        added.push(url);
            }
            else {
                added.push(...urls);
            }
            const text = urls.join("\n");
            await filaRaw.writeText(text);
            return { added, removed };
        }
        Data.captureRawFeed = captureRawFeed;
        /** */
        async function getFeedsRawFolder() {
            const fila = await Squares.Util.getDataFolder();
            return fila.down("feeds-raw");
        }
        /** */
        async function readPost(key) {
            const postsFile = await getPostsFile(key);
            const postsObject = await readPostsFile(postsFile);
            const diskPost = postsObject[key];
            if (!diskPost)
                return null;
            const feed = await readFeed(diskPost.feed);
            if (!feed)
                return null;
            return {
                key,
                feed,
                visited: diskPost.visited,
                path: diskPost.path,
            };
        }
        Data.readPost = readPost;
        /** */
        async function writePost(post) {
            if (!post.key)
                post.key = Squares.Util.getSafeTicks();
            const fullPost = post;
            const diskPost = {
                visited: fullPost.visited || false,
                feed: fullPost.feed?.key || 0,
                path: fullPost.path || ""
            };
            if (!diskPost.path)
                throw new Error("Post has no .path property.");
            const postsFile = await getPostsFile(post.key);
            const postsObject = await readPostsFile(postsFile);
            // This may either override the post at the existing key,
            // or assign a new post at the new key.
            postsObject[post.key] = diskPost;
            const postsObjectJsonText = JSON.stringify(postsObject);
            await postsFile.writeText(postsObjectJsonText);
            // Add the post to the feed
            await writeFeedPost(diskPost.feed, [post.key]);
            return fullPost;
        }
        Data.writePost = writePost;
        /**
         * Reads the contents of a JSON file that contains multiple posts.
         */
        async function readPostsFile(postsFila) {
            if (!await postsFila.exists())
                return {};
            const postsJson = await postsFila.readText();
            const postsObject = Squares.Util.tryParseJson(postsJson);
            return postsObject;
        }
        /** */
        async function getPostsFolder() {
            const fila = await Squares.Util.getDataFolder();
            return fila.down("posts");
        }
        /** */
        async function getPostsFile(key) {
            const date = new Date(key);
            const y = date.getFullYear();
            const m = ("0" + (date.getMonth() + 1)).slice(-2);
            const d = ("0" + date.getDate()).slice(-2);
            const postsFileName = [y, m, d].join("-") + ".json";
            return (await getPostsFolder()).down(postsFileName);
        }
        /** */
        function keyOf(fila) {
            return Number(fila.name.split(".")[0]) || 0;
        }
        /** */
        async function readArrayFile(fila, options) {
            if (!await fila.exists())
                return [];
            const text = await fila.readText();
            const numbers = [];
            let lines = text.split("\n");
            const start = options?.start || 0;
            lines = lines.slice(start);
            lines = lines.slice(0, options?.limit);
            for (const line of lines) {
                const n = Number(line) || 0;
                if (n > 0)
                    numbers.push(n);
            }
            return numbers;
        }
        /** */
        async function appendArrayFile(fila, keys) {
            const text = keys.map(k => k + "\n").join("");
            await fila.writeText(text, { append: true });
        }
        /**
         * Deletes all data in the data folder.
         * Intended only for debugging purposes.
         */
        async function clear() {
            const scrollFolder = await getScrollFolder();
            const feedFolder = await getFeedsFolder();
            const feedRawFolder = await getFeedsRawFolder();
            const postsFolder = await getPostsFolder();
            const all = [];
            if (await scrollFolder.exists())
                all.push(...await scrollFolder.readDirectory());
            if (await feedFolder.exists())
                all.push(...await feedFolder.readDirectory());
            if (await feedRawFolder.exists())
                all.push(...await feedRawFolder.readDirectory());
            if (await postsFolder.exists())
                all.push(...await postsFolder.readDirectory());
            await Promise.all(all.map(fila => fila.delete()));
        }
        Data.clear = clear;
    })(Data = Squares.Data || (Squares.Data = {}));
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /**
     * Initializes the app with a list of default feeds, and populates
     * a single scroll with the content contained within those feeds.
     */
    async function runDataInitializer(defaultFeedUrls) {
        const feeds = [];
        const urlLists = [];
        for (const url of defaultFeedUrls) {
            const urls = await Webfeed.getFeedUrls(url);
            if (!urls)
                continue;
            const checksum = await Squares.Util.getFeedChecksum(url);
            if (!checksum)
                continue;
            urlLists.push(urls);
            const feedMeta = await Webfeed.getFeedMetaData(url);
            const feed = await Squares.Data.writeFeed(feedMeta, { checksum });
            await Squares.Data.captureRawFeed(feed, urls);
            feeds.push(feed);
        }
        const scroll = await Squares.Data.writeScroll({ feeds });
        const maxLength = urlLists.reduce((a, b) => a > b.length ? a : b.length, 0);
        for (let i = -1; ++i < maxLength * urlLists.length;) {
            const indexOfList = i % urlLists.length;
            const urlList = urlLists[indexOfList];
            const indexWithinList = Math.floor(i / urlLists.length);
            if (urlList.length <= indexWithinList)
                continue;
            const feed = feeds[indexOfList];
            const feedDirectory = Webfeed.Url.folderOf(feed.url);
            const path = urlList[indexWithinList].slice(feedDirectory.length);
            const post = await Squares.Data.writePost({ feed, path });
            await Squares.Data.writeScrollPost(scroll.key, post);
        }
    }
    Squares.runDataInitializer = runDataInitializer;
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /**
     * A namespace of functions which are shared between
     * the ForegroundFetcher and the BackgroundFetcher.
     */
    let Fetcher;
    (function (Fetcher) {
        /**
         *
         */
        async function updateModifiedFeeds(modifiedFeeds) {
            const scroll = await Squares.Data.readScroll();
            for (const feed of modifiedFeeds) {
                Webfeed.getFeedUrls(feed.url).then(async (urls) => {
                    if (!urls)
                        return;
                    const feedUrlFolder = Webfeed.Url.folderOf(feed.url);
                    const { added, removed } = await Squares.Data.captureRawFeed(feed, urls);
                    for (const url of added) {
                        const path = url.slice(feedUrlFolder.length);
                        const post = await Squares.Data.writePost({ feed, path });
                        if (scroll)
                            Squares.Data.writeScrollPost(scroll.key, post);
                    }
                });
            }
        }
        Fetcher.updateModifiedFeeds = updateModifiedFeeds;
    })(Fetcher = Squares.Fetcher || (Squares.Fetcher = {}));
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /** */
    class ForegroundFetcher {
        /** */
        constructor() { }
        /**
         * Gets whether there is a fetch operation being carried out.
         */
        get isFetching() {
            return !!this.feedIterator;
        }
        feedIterator = null;
        /** */
        async fetch() {
            this.stopFetch();
            this.feedIterator = Squares.Data.readFeeds();
            const threads = [];
            const modifiedFeeds = [];
            for (let i = -1; ++i < maxFetchThreads;) {
                // Creates a "thread" that attempts to ping
                // the URL of the next feed in the line.
                threads.push(new Promise(async (r) => {
                    for (;;) {
                        const feedIteration = await this.feedIterator?.next();
                        if (!feedIteration || feedIteration.done) {
                            // If i is less than the number of "threads" running,
                            // and the iterator has run out, that means there's
                            // fewer feeds than there are threads (so avoid
                            // termination in this case).
                            if (i >= maxFetchThreads) {
                                this.feedIterator = null;
                                this.abortControllers.clear();
                            }
                            return r();
                        }
                        const feed = feedIteration.value;
                        const checksum = await Squares.Util.getFeedChecksum(feed.url);
                        if (checksum !== feed.checksum)
                            modifiedFeeds.push(feed);
                    }
                }));
            }
            await Promise.all(threads);
            await Squares.Fetcher.updateModifiedFeeds(modifiedFeeds);
        }
        /** */
        stopFetch() {
            for (const ac of this.abortControllers)
                ac.abort();
            this.abortControllers.clear();
            this.feedIterator?.return();
        }
        abortControllers = new Set();
    }
    Squares.ForegroundFetcher = ForegroundFetcher;
    const maxFetchThreads = 10;
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    let Util;
    (function (Util) {
        /** */
        async function getFeedChecksum(feedUrl) {
            try {
                const ac = new AbortController();
                const id = setTimeout(() => ac.abort(), timeout);
                const fetchResult = await fetch(feedUrl, {
                    method: "HEAD",
                    mode: "cors",
                    signal: ac.signal,
                });
                clearTimeout(id);
                if (!fetchResult.ok)
                    return null;
                const len = fetchResult.headers.get("Content-Length") || "";
                const mod = fetchResult.headers.get("Last-Modified") || "";
                if (!len && !mod)
                    return null;
                const checksum = (mod + ";" + len).replace(/[,:\s]/g, "");
                return checksum;
            }
            catch (e) { }
            return null;
        }
        Util.getFeedChecksum = getFeedChecksum;
        const timeout = 500;
        /**
         * Returns the current date in ticks form, but with any incrementation
         * necessary to avoid returning the same ticks value twice.
         */
        function getSafeTicks() {
            let now = Date.now();
            if (now <= lastTicks)
                now = ++lastTicks;
            lastTicks = now;
            return now;
        }
        Util.getSafeTicks = getSafeTicks;
        let lastTicks = 0;
        /**
         * Returns the fully-qualified URL to the icon image
         * specified in the specified feed.
         */
        function getIconUrl(feed) {
            const folder = Webfeed.Url.folderOf(feed.url);
            return Webfeed.Url.resolve(feed.icon, folder);
        }
        Util.getIconUrl = getIconUrl;
        /**
         * Parses URIs as specified in the HTML feeds specification found at:
         * https://www.Squares.org/specs/htmlfeeds/
         */
        function parseHtmlUri(uri) {
            uri = uri.trim();
            const prefix = "html://follow?";
            if (!uri.startsWith(prefix))
                return "";
            uri = uri.slice(prefix.length);
            if (uri.length > 2048)
                return "";
            try {
                const url = new URL(uri);
                return url.toString();
            }
            catch (e) { }
            return "";
        }
        Util.parseHtmlUri = parseHtmlUri;
        /**
         * Safely parses a string JSON into an object.
         */
        function tryParseJson(jsonText) {
            try {
                return JSON.parse(jsonText);
            }
            catch (e) { }
            return null;
        }
        Util.tryParseJson = tryParseJson;
        /**
         * Returns the environment-specific path to the application data folder.
         */
        async function getDataFolder() {
            if (TAURI) {
                const dir = await Tauri.path.appDataDir();
                return Fila.new(dir);
            }
            else if (ELECTRON) {
                const fila = Fila.new(__dirname).down(DEBUG ? "+data" : "data");
                await fila.writeDirectory();
                return fila;
            }
            else if (CAPACITOR) {
                const path = DEBUG ?
                    "DOCUMENTS" /* FilaCapacitor.Directory.documents */ :
                    "DATA" /* FilaCapacitor.Directory.data */;
                return Fila.new(path);
            }
            else if (DEMO) {
                return Fila.new();
            }
            throw new Error("Not implemented");
        }
        Util.getDataFolder = getDataFolder;
        /** */
        async function readClipboardHtmlUri() {
            const text = await readClipboard();
            const uri = parseHtmlUri(text);
            return uri ? text : "";
        }
        Util.readClipboardHtmlUri = readClipboardHtmlUri;
        /** */
        async function readClipboard() {
            if (ELECTRON) {
                const electron = require("electron");
                return electron.clipboard.readText() || "";
            }
            else if (TAURI) {
                const text = await Tauri.clipboard.readText();
                return text || "";
            }
            else if (CAPACITOR) {
                const text = await CapClipboard.read();
                return text.value;
            }
            return "";
        }
        Util.readClipboard = readClipboard;
        /**
         * Removes problematic CSS attributes from the specified section tag,
         * and ensures that no external CSS is modifying its display propert
         */
        function getSectionSanitizationCss() {
            return {
                position: "relative !",
                zIndex: 0,
                width: "auto !",
                height: "100% !",
                margin: "0 !",
                boxSizing: "border-box !",
                display: "block !",
                float: "none !",
                clipPath: "inset(0 0) !",
                mask: "none !",
                opacity: "1 !",
                transform: "none !",
            };
        }
        Util.getSectionSanitizationCss = getSectionSanitizationCss;
    })(Util = Squares.Util || (Squares.Util = {}));
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /** */
    class DotsHat {
        head;
        /** */
        constructor() {
            this.head = raw.div(Squares.Style.backgroundOverlay(), {
                width: "fit-content",
                padding: "5px 10px",
                borderRadius: "1000px",
                textAlign: "center",
            }, raw.css(" > SPAN", {
                display: "inline-block",
                width: "10px",
                height: "10px",
                margin: "3px",
                borderRadius: "100%",
                backgroundColor: "rgba(128, 128, 128)",
            }), raw.css(" > SPAN." + highlightClass, {
                backgroundColor: "hsl(205, 100%, 50%)",
            }));
            Hat.wear(this);
        }
        /** */
        insert(count, at = this.head.childElementCount) {
            const spans = [];
            for (let i = -1; ++i < count;)
                spans.push(raw.span());
            at = Math.max(0, at);
            at = Math.min(this.head.childElementCount, at);
            if (at >= this.head.childElementCount) {
                this.head.append(...spans);
            }
            else {
                const elements = Array.from(this.head.children);
                elements[at].before(...spans);
            }
        }
        /** */
        highlight(index) {
            index = Math.max(0, index);
            index = Math.min(this.head.childElementCount - 1, index);
            const children = Array.from(this.head.children);
            children.forEach(e => e.classList.remove(highlightClass));
            children[index].classList.add(highlightClass);
        }
    }
    Squares.DotsHat = DotsHat;
    const highlightClass = "highlight";
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /** */
    class FeedMetaHat {
        head;
        /** */
        constructor(data) {
            const iconUrl = Squares.Util.getIconUrl(data);
            const author = data.author || "(Author Unknown)" /* Strings.unknownAuthor */;
            const isFollowing = data.key > 0;
            this.head = raw.div({
                display: "flex",
                height: "100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
            }, raw.div({
                display: "flex",
                width: "140px",
                padding: "20px",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
            }, raw.div({
                width: "100%",
                aspectRatio: "1/1",
                borderRadius: "100%",
                backgroundImage: `url(${iconUrl})`,
                backgroundSize: "cover"
            })), raw.div({
                flex: "1 0",
                fontSize: "18px",
            }, raw.css(" > :not(:first-child)", {
                marginTop: "10px"
            }), raw.div({
                fontWeight: 700,
                display: "-webkit-box",
                webkitBoxOrient: "vertical",
                webkitLineClamp: "1",
                overflow: "hidden",
            }, raw.text(author)), !!data.description && raw.div({
                fontWeight: 500,
                display: "-webkit-box",
                webkitBoxOrient: "vertical",
                webkitLineClamp: "2",
                overflow: "hidden",
            }, raw.text(data.description)), this.renderButton("Share" /* Strings.share */, () => { }), isFollowing && (e => this.renderButton("Unfollow" /* Strings.unfollow */, () => {
                Hat.over(this, Squares.PageHat).head.scrollBy({ top: -1 });
                Hat.signal(Squares.UnfollowSignal, data.key);
                Squares.UI.fade(e);
            }))));
            Hat.wear(this);
        }
        /** */
        renderButton(label, clickFn) {
            return Squares.Widget.fillButton({
                marginRight: "15px",
            }, raw.text(label), raw.on("click", () => clickFn()));
        }
    }
    Squares.FeedMetaHat = FeedMetaHat;
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /** */
    function coverFollowersHat() {
        Squares.appendCssReset();
        const hat = new Squares.FollowersHat();
        document.body.append(hat.head);
    }
    Squares.coverFollowersHat = coverFollowersHat;
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /** */
    class FollowersHat {
        head;
        feedElements;
        /** */
        constructor() {
            this.head = raw.div({
                padding: "20px",
            }, raw.on("connected", () => this.construct()), raw.div({
                fontSize: "22px",
                fontWeight: 600,
                marginBottom: "20px",
            }, raw.text("Following" /* Strings.following */)), this.feedElements = raw.div());
            Hat
                .wear(this)
                .wear(Squares.UnfollowSignal, this.handleUnfollow)
                .wear(Squares.FollowSignal, this.handleFollow);
        }
        /** */
        handleUnfollow(feedKey) {
            const cls = keyPrefix + feedKey;
            Array.from(this.head.children)
                .filter(e => e instanceof HTMLElement && e.classList.contains(cls))
                .map(e => e.remove());
        }
        /** */
        handleFollow(feed) {
            this.feedElements.prepend(this.renderIdentity(feed));
        }
        /** */
        async construct() {
            for await (const feed of Squares.Data.readFeeds())
                this.feedElements.append(this.renderIdentity(feed));
        }
        /** */
        renderIdentity(feed) {
            const iconUrl = Squares.Util.getIconUrl(feed);
            const author = feed.author || "(Author Unknown)" /* Strings.unknownAuthor */;
            const e = raw.div({
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                marginBottom: "10px",
                padding: "10px",
                fontSize: "15px",
                backgroundColor: "rgba(128, 128, 128, 0.25)",
                borderRadius: Squares.Style.borderRadiusSmall,
            }, keyPrefix + feed.key, raw.div({
                width: "50px",
                padding: "10px",
                marginRight: "20px",
                aspectRatio: "1/1",
                borderRadius: "100%",
                backgroundImage: `url(${iconUrl})`,
                backgroundSize: "cover",
            }), raw.div({
                fontWeight: 500,
                flex: "1 0",
            }, raw.text(author)), Squares.Widget.fillButton(raw.text("Unfollow" /* Strings.unfollow */), raw.on("click", async () => {
                Hat.signal(Squares.UnfollowSignal, feed.key);
                await Squares.UI.collapse(e);
                e.remove();
            })));
            return e;
        }
    }
    Squares.FollowersHat = FollowersHat;
    const keyPrefix = "id:";
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    var Cover;
    (function (Cover) {
        /** */
        function coverTilerHat() {
            Squares.appendCssReset();
            const gridHat = new Squares.GridHat();
            gridHat.handleRender(index => {
                return generateFakeScene("Post " + index);
            });
            gridHat.handleSelect((e, index) => {
                console;
            });
            const container = raw.div({
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: "80vw",
                height: "80vh",
                margin: "auto",
                outline: "10px solid white",
            }, gridHat);
            document.body.append(container);
        }
        Cover.coverTilerHat = coverTilerHat;
        /** */
        function generateFakeScene(text) {
            return raw.div({
                backgroundImage: "linear-gradient(45deg, orange, crimson)",
                minHeight: "100vh",
            }, raw.div({
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                margin: "auto",
                width: "fit-content",
                height: "fit-content",
                color: "white",
                fontSize: "20vmin",
                fontWeight: 900,
                textAlign: "center",
            }, raw.text(text)));
        }
    })(Cover = Squares.Cover || (Squares.Cover = {}));
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /**
     *
     */
    class GridHat {
        /** */
        head;
        /** */
        cornersElement;
        /** */
        constructor() {
            maybeAppendDefaultCss();
            this.head = raw.div(Squares.Style.unselectable, {
                minHeight: "100%",
                overflowY: "auto",
            }, Squares.UI.stretch(), raw.css("> ." + "poster" /* Class.poster */, {
                display: "none",
                position: "absolute",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                outline: "2px solid black",
                ...Squares.Style.clickable,
            }), raw.on("scroll", () => this.updatePosterVisibility(true)), raw.on("connected", () => {
                this.setSizeInner(calculateNaturalSize());
                this._width = this.head.offsetWidth;
                this._height = this.head.offsetHeight;
                Squares.Resize.watch(this.head, (w, h) => [this._width, this._height] = [w, h]);
                this.tryAppendPosters(3);
            }), (CAPACITOR || DEMO) && [
                Squares.UI.cornerAbsolute("tl"),
                Squares.UI.cornerAbsolute("tr"),
                this.cornersElement = raw.span("corners-element", {
                    display: "block",
                    position: "absolute",
                    pointerEvents: "none",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 2,
                }, Squares.UI.cornerAbsolute("bl"), Squares.UI.cornerAbsolute("br"))
            ]);
            Hat.wear(this);
        }
        /** */
        handleRender(fn) {
            this.renderFn = fn;
        }
        renderFn = () => null;
        /** */
        handleSelect(fn) {
            this.selectFn = fn;
        }
        selectFn = () => { };
        //# Size
        /**
         * Gets the pixel width of the head element.
         */
        get width() {
            return this._width;
        }
        _width = 0;
        /**
         * Gets the pixel height of the head element.
         */
        get height() {
            return this._height;
        }
        _height = 0;
        /**
         * Gets or sets the number of posters being displayed in one dimension.
         */
        get size() {
            return this._size;
        }
        set size(size) {
            this.setSizeInner(size);
        }
        /** */
        setSizeInner(size) {
            size = Math.max(minSize, Math.min(size, maxSize));
            if (size === this._size)
                return;
            this._size = size;
            const cls = sizeClasses.get(size);
            if (cls) {
                this.head.classList.remove(...sizeClasses.values());
                this.head.classList.add(cls);
            }
            this.updatePosterVisibility();
        }
        _size = -1;
        /**
         * Gets the maximum possible size of the Omniview,
         * given the number of previews that are available.
         * A value of 0 indicates that there is no size limit.
         */
        sizeLimit = 0;
        //# Posters
        /**
         * Returns an array of HTMLElement objects that contain the posters
         * that have at least a single pixel visible on the screen.
         */
        getVisiblePosters() {
            const elements = [];
            for (const element of getByClass(showClass, this.head)) {
                const rect = element.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0)
                    continue;
                if (rect.top > this.height)
                    continue;
                elements.push(element);
            }
            return elements;
        }
        /** */
        get posterCount() {
            return this.head.getElementsByClassName("poster" /* Class.poster */).length;
        }
        /** */
        async tryAppendPosters(screenCount) {
            const pullCount = this.size * this.size * screenCount;
            const rangeStart = this.posterCount;
            const rangeEnd = rangeStart + pullCount;
            const maybePromises = [];
            let canContinue = true;
            for (let i = rangeStart; i < rangeEnd; i++) {
                const result = this.renderFn(i);
                // If null is returned, this means that the stream has terminated.
                if (result === null) {
                    canContinue = false;
                    break;
                }
                maybePromises.push(result);
            }
            const newPosterCount = maybePromises.length;
            if (newPosterCount === 0)
                return;
            if (rangeStart === 0 && newPosterCount < this.size) {
                // The constrained size cannot go below 2. This means that if there
                // is only 1 preview returned, the Omniview is going to look a bit
                // awkward with a preview on the left side of the screen, and an
                // empty space on the right. If this is undesirable, the component
                // that owns the Omniview is responsible for avoiding this situation
                // by it's own means.
                this.sizeLimit = Math.max(2, newPosterCount);
                this.setSizeInner(this.sizeLimit);
            }
            const elements = [];
            for (const maybePromise of maybePromises) {
                if (!maybePromise)
                    throw "?";
                if (maybePromise instanceof Promise) {
                    const shim = raw.div("element-placeholder", getDefaultBackground());
                    elements.push(shim);
                    maybePromise.then(element => {
                        if (element === null)
                            return;
                        for (const n of shim.getAttributeNames())
                            if (n !== "style" && n !== "class")
                                element.setAttribute(n, shim.getAttribute(n) || "");
                        for (const definedProperty of Array.from(shim.style)) {
                            element.style.setProperty(definedProperty, shim.style.getPropertyValue(definedProperty));
                        }
                        raw.get(element)(
                        // Classes that have been set on the shim since it was inserted
                        // must be copied over to the element.
                        Array.from(shim.classList), raw.on("click", () => this.selectFn(element, getIndex(element))));
                        shim.replaceWith(element);
                    });
                }
                else {
                    elements.push(raw.get(maybePromise)(raw.on("click", () => this.selectFn(maybePromise, getIndex(maybePromise)))));
                }
            }
            for (const [i, e] of elements.entries()) {
                setIndex(e, this.posterCount + i);
                e.classList.add("poster" /* Class.poster */);
            }
            this.head.append(...elements);
            this.updatePosterVisibility(canContinue);
        }
        /** */
        updatePosterVisibility(canContinue = false) {
            if (!this.head.isConnected)
                return;
            let isNearingBottom = false;
            if (this.posterCount > 0) {
                const y = this.head.scrollTop;
                const rowHeight = this.height / this.size;
                const rowCount = this.posterCount / this.size;
                const visibleRowStart = Math.floor(y / rowHeight);
                const visibleItemStart = visibleRowStart * this.size;
                const visibleItemEnd = visibleItemStart + this.size * (this.size + 2);
                const elementsWithTop = new Set(getByClass("has-top" /* Class.hasCssTop */, this.head));
                const elementsVisible = new Set(getByClass(showClass, this.head));
                const children = Array.from(this.head.children).filter(e => e instanceof HTMLDivElement);
                for (let i = visibleItemStart; i < visibleItemEnd; i++) {
                    const e = children[i];
                    if (!(e instanceof HTMLDivElement)) {
                        if (i >= children.length)
                            break;
                        continue;
                    }
                    const mul = getIndex(e) > 0 ? 1 : -1;
                    const pct = (100 * this.rowOf(e) * mul || 0).toFixed(5);
                    e.style.top = `calc(${pct}% / var(${"--size" /* Class.sizeVar */}))`;
                    e.classList.add("has-top" /* Class.hasCssTop */, showClass);
                    elementsWithTop.delete(e);
                    elementsVisible.delete(e);
                }
                for (const e of elementsWithTop) {
                    e.style.removeProperty("top");
                    e.classList.remove("has-top" /* Class.hasCssTop */);
                }
                for (const e of elementsVisible)
                    e.classList.remove(showClass);
                if (y !== this.lastY) {
                    this.lastY = y;
                    isNearingBottom = (y + this.height) > (rowCount - 1) * (this.height / this.size);
                }
            }
            if (canContinue && isNearingBottom)
                this.tryAppendPosters(1);
            if (CAPACITOR || DEMO) {
                const query = this.head.getElementsByClassName("has-top" /* Class.hasCssTop */);
                if (query.length > 0) {
                    const last = query.item(query.length - 1);
                    if (last && last !== this.lastVisiblePoster) {
                        this.cornersElement.style.height = (1 + last.offsetTop + last.offsetHeight / this.size) + "px";
                        this.lastVisiblePoster = last;
                    }
                }
            }
        }
        lastVisiblePoster = null;
        lastY = -1;
        /** */
        rowOf(previewElement) {
            const eIdx = getIndex(previewElement);
            const rowIndex = Math.floor(eIdx / this.size);
            return rowIndex;
        }
    }
    Squares.GridHat = GridHat;
    /** */
    let Class;
    (function (Class) {
        Class["poster"] = "poster";
        Class["body"] = "body";
        Class["hasCssTop"] = "has-top";
        Class["sizeVar"] = "--size";
    })(Class || (Class = {}));
    /** */
    let getDefaultBackground = () => {
        const canvas = raw.canvas({ width: 32, height: 32 });
        const ctx = canvas.getContext("2d");
        const grad = ctx.createLinearGradient(0, 0, 32, 32);
        grad.addColorStop(0, "rgb(50, 50, 50)");
        grad.addColorStop(1, "rgb(0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
        const cls = raw.css({
            backgroundImage: `url(${canvas.toDataURL()})`,
            backgroundSize: "100% 100%",
        });
        getDefaultBackground = () => cls;
    };
    /** */
    let maybeAppendDefaultCss = () => {
        maybeAppendDefaultCss = () => { };
        raw.style("." + "body" /* Class.body */, {
            position: "fixed",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            zIndex: 1,
            transform: "translateY(0)",
            transitionProperty: "transform",
            transitionDuration: "0.33s",
            scrollSnapType: "y mandatory",
            overflowY: "auto",
        }, `.${"body" /* Class.body */}:before, .${"body" /* Class.body */}:after`, {
            content: `""`,
            display: "block",
            height: "1px",
            scrollSnapStop: "always",
        }, `.${"body" /* Class.body */}:before`, {
            scrollSnapAlign: "start",
        }, `.${"body" /* Class.body */}:after`, {
            scrollSnapAlign: "end",
        }, `.${"body" /* Class.body */} > *`, {
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            height: "100%",
        }, 
        // Place a screen over the poster element to kill any selection
        // events. This has to be done in another element rather than 
        // just doing a pointer-events: none on the children because the
        // poster element's contents are within a shadow root.
        `.${"poster" /* Class.poster */}:before`, {
            content: `""`,
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            zIndex: 1,
            userSelect: "none",
        }).attach();
        const classes = new Map();
        for (let size = minSize; size <= maxSize; size++) {
            const params = [];
            const scale = 1 / size;
            const sizeClass = "size-" + size;
            classes.set(size, sizeClass);
            params.push("." + sizeClass, {
                ["--size" /* Class.sizeVar */]: size
            });
            for (let n = -1; ++n < size;) {
                params.push(` .${sizeClass} > DIV:nth-of-type(${size}n + ${n + 1})`, {
                    left: (scale * 100 * n) + "%",
                    transform: `scale(${scale.toFixed(4)})`,
                    transformOrigin: "0 0",
                });
            }
            raw.style(...params).attach();
        }
        sizeClasses = classes;
    };
    let sizeClasses;
    /**
     * Calculates a comfortable preview size based on the size and pixel density
     * of the screen. (The technique used is probably quite faulty, but good enough
     * for most scenarios).
     */
    function calculateNaturalSize() {
        return 3;
        const dp1 = window.devicePixelRatio === 1;
        const logicalWidth = window.innerWidth / window.devicePixelRatio;
        if (logicalWidth <= (dp1 ? 900 : 450))
            return 2;
        if (logicalWidth <= (dp1 ? 1400 : 700))
            return 3;
        if (logicalWidth <= 1800)
            return 4;
        return 5;
    }
    const minSize = 2;
    const maxSize = 7;
    //const ratioX = 9;
    //const ratioY = 16;
    /** */
    function getIndex(e) {
        return Number((Array.from(e.classList)
            .find(cls => cls.startsWith(indexPrefix)) || "")
            .slice(indexPrefix.length)) || 0;
    }
    /** */
    function setIndex(e, index) {
        e.classList.add(indexPrefix + index);
    }
    const indexPrefix = "index:";
    //# Utilities
    /** */
    const showClass = raw.css({
        display: "block !",
    });
    /** */
    function getByClass(cls, element) {
        const col = (element || document).getElementsByClassName(cls);
        return Array.from(col);
    }
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    var Cover;
    (function (Cover) {
        /** */
        function coverStoryHat() {
            Squares.appendCssReset();
            const sections = [
                raw.div({
                    scrollSnapStop: "always",
                    scrollSnapAlign: "start",
                    backgroundColor: "red",
                }),
                raw.div({
                    scrollSnapStop: "always",
                    scrollSnapAlign: "start",
                    backgroundColor: "green",
                }),
                raw.div({
                    scrollSnapStop: "always",
                    scrollSnapAlign: "start",
                    backgroundColor: "blue",
                })
            ];
            const feed = {
                key: Squares.Util.getSafeTicks(),
                author: "Paul Gordon",
                url: "http://localhost:43332/raccoons/index.txt",
                description: "A description of the feed",
                icon: "http://localhost:43332/raccoons/icon.jpg",
                checksum: "?",
            };
            const hat = new Squares.PageHat([], sections, feed);
            document.body.append(hat.head);
        }
        Cover.coverStoryHat = coverStoryHat;
    })(Cover = Squares.Cover || (Squares.Cover = {}));
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /** */
    class PageHat {
        feed;
        head;
        swiper;
        scrollable;
        onDisconnect;
        _onDisconnect;
        onRetract;
        _onRetract;
        /** */
        constructor(head, sections, feed) {
            this.feed = feed;
            if (sections.length < 1)
                throw new Error("Must have at least one section.");
            if (CAPACITOR || DEMO) {
                raw.get(sections[0])({
                    borderTopLeftRadius: Squares.Style.borderRadiusLarge + " !",
                    borderTopRightRadius: Squares.Style.borderRadiusLarge + " !",
                });
            }
            for (const section of sections) {
                raw.get(section)(Squares.Util.getSectionSanitizationCss(), {
                    scrollSnapStop: "always !",
                    scrollSnapAlign: "start",
                });
            }
            this.swiper = new Squares.PaneSwiper();
            const metaHat = new Squares.FeedMetaHat(this.feed);
            const metaHatHeight = 200;
            this.head = raw.div("head", {
                width: "100%",
                height: "100%",
            }, raw.on("connected", () => {
                this.swiper.setVisiblePane(1);
                this.setupRetractionTracker();
                setTimeout(() => {
                    const e = this.scrollable;
                    e.scrollTo(0, e.offsetHeight + metaHatHeight);
                });
            }), this.swiper);
            this.scrollable = raw.div("scrollable-element", {
                scrollSnapType: "y mandatory",
                overflowY: "auto",
                height: "100%",
            }, raw.div("snap-top", snap, { height: "100%" }), raw.get(metaHat)({
                height: (metaHatHeight - 10) + "px",
                marginBottom: "10px",
                backgroundColor: "rgba(128, 128, 128, 0.33)",
                borderRadius: Squares.Style.borderRadiusLarge,
            }, Squares.Style.backdropBlur(8), snap), (CAPACITOR || DEMO) && raw.div("corners-container", {
                position: "absolute",
                left: 0,
                right: 0,
                zIndex: 2,
                pointerEvents: "none",
            }, [
                Squares.UI.cornerAbsolute("tl"),
                Squares.UI.cornerAbsolute("tr"),
            ]), raw.div("shadow-container", { display: "contents" }, raw.shadow(...head, raw.body({ display: "contents !" }, ...sections))), raw.div("snap-bottom", snap, { height: "100%" }));
            this.swiper.addPane(raw.div("exit-left-element"));
            this.swiper.addPane(this.scrollable);
            [this.onRetract, this._onRetract] = Force.create();
            [this.onDisconnect, this._onDisconnect] = Force.create();
            this.onDisconnect(() => this.head.remove());
            Hat.wear(this);
        }
        /** */
        setupRetractionTracker() {
            const e = this.scrollable;
            let lastScrollTop = -1;
            let lastScrollLeft = -1;
            let timeoutId = 0;
            const handler = () => {
                let clipTop = 0;
                let clipBottom = 0;
                let clipLeft = 0;
                const w = e.offsetWidth;
                const offsetHeight = e.offsetHeight;
                const scrollHeight = e.scrollHeight;
                const scrollLeft = this.swiper.head.scrollLeft;
                const scrollTop = e.scrollTop;
                clipTop = offsetHeight - scrollTop;
                if (scrollLeft < w)
                    clipLeft = 1 - scrollLeft / w;
                else if (scrollTop > scrollHeight - offsetHeight)
                    clipBottom = scrollTop - (scrollHeight - offsetHeight);
                clipLeft *= 100;
                this.head.style.clipPath = `inset(${clipTop}px 0 ${clipBottom}px ${clipLeft}%)`;
                // Deal with retraction notification
                let retractPct = -1;
                if (scrollLeft < w)
                    retractPct = scrollLeft / w;
                else if (scrollTop < offsetHeight)
                    retractPct = scrollTop / offsetHeight;
                else if (scrollTop >= scrollHeight - offsetHeight * 2)
                    retractPct = (scrollHeight - offsetHeight - scrollTop) / offsetHeight;
                if (retractPct > 0)
                    this._onRetract(retractPct);
                // Remove the element if necessary
                clearTimeout(timeoutId);
                if (retractPct > 0) {
                    lastScrollLeft = scrollLeft;
                    lastScrollTop = scrollTop;
                    timeoutId = setTimeout(() => {
                        if (scrollLeft !== lastScrollLeft)
                            return;
                        if (scrollTop !== lastScrollTop)
                            return;
                        // A more elegant way to deal with this would be to animate
                        // it off the screen... but just removing it is good enough for now
                        // because this is just an edge case that isn't going to happen
                        // very often.
                        if (scrollLeft <= 2 ||
                            scrollTop <= 2 ||
                            scrollTop >= scrollHeight - offsetHeight - 2) {
                            this._onDisconnect();
                        }
                    });
                }
            };
            e.addEventListener("scroll", handler);
            this.swiper.head.addEventListener("scroll", handler);
        }
        /** */
        forceRetract() {
            return new Promise(r => {
                const slideAway = (axis, amount) => {
                    const ms = 100;
                    const e = this.head;
                    e.style.transitionDuration = ms + "ms";
                    e.style.transitionProperty = "transform";
                    e.style.transform = `translate${axis.toLocaleUpperCase()}(${amount}px)`;
                    e.style.pointerEvents = "none";
                    setTimeout(() => {
                        this._onDisconnect();
                        r();
                    }, ms);
                };
                const e = this.scrollable;
                const w = e.offsetWidth;
                const offsetHeight = e.offsetHeight;
                const scrollLeft = this.swiper.head.scrollLeft;
                const scrollTop = e.scrollTop;
                // This check will indicate whether the pageHat has rightward
                // scrolling inertia. If it does, it's scrolling will halt and it will be
                // necessary to animate the pageHat away manually.
                if (scrollLeft > 0 && scrollLeft < w)
                    slideAway("x", scrollLeft);
                else if (scrollTop > 0 && scrollTop < offsetHeight)
                    slideAway("y", scrollTop);
            });
        }
    }
    Squares.PageHat = PageHat;
    const snap = {
        scrollSnapStop: "always",
        scrollSnapAlign: "start",
    };
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /**
     * A class that creates a series of panes that swipe horizontally on mobile.
     */
    class PaneSwiper {
        head;
        /** */
        constructor() {
            this.head = raw.div(Dock.cover(), {
                whiteSpace: "nowrap",
                overflowX: "auto",
                overflowY: "hidden",
                scrollSnapType: "x mandatory",
            }, raw.css(" > DIV", {
                display: "inline-block",
                width: "100%",
                height: "100%",
                whiteSpace: "normal",
                scrollSnapAlign: "start",
                scrollSnapStop: "always",
                overflowX: "hidden",
                overflowY: "auto",
            }), raw.on("scroll", () => this.updateVisiblePane()));
            Hat.wear(this);
            [this.visiblePaneChanged, this._visiblePaneChanged] =
                Force.create();
        }
        /** */
        visiblePaneChanged;
        _visiblePaneChanged;
        /** */
        addPane(element, at = -0) {
            const pane = raw.div("swiper-pane", {
                height: "100%",
                overflowX: "hidden",
                overflowY: "auto",
                whiteSpace: "normal",
            }, element);
            if (at >= this.head.childElementCount || Object.is(at, -0)) {
                this.head.append(pane);
            }
            else if (at < 0) {
                at = Math.max(0, this.head.childElementCount + at);
                const children = Array.from(this.head.children);
                children[at].before(pane);
            }
        }
        /** */
        setVisiblePane(index) {
            const w = this.head.offsetWidth;
            this.head.scrollBy(w * index, 0);
        }
        /** */
        updateVisiblePane() {
            const w = this.head.offsetWidth;
            const s = this.head.scrollLeft;
            const paneIndex = Math.round(s / w);
            if (paneIndex !== this.lastVisiblePane)
                this._visiblePaneChanged(paneIndex);
            this.lastVisiblePane = paneIndex;
        }
        lastVisiblePane = 0;
    }
    Squares.PaneSwiper = PaneSwiper;
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /** */
    class ProfileHat {
        head;
        /** */
        constructor() {
            this.head = raw.div();
            Hat.wear(this);
        }
    }
    Squares.ProfileHat = ProfileHat;
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /** */
    class PullToRefreshHat {
        target;
        head;
        symbol;
        rotationDegress = 0;
        animation = null;
        /** */
        constructor(target) {
            this.target = target;
            const size = (parseInt(Squares.Style.borderRadiusLarge) * 2) + "px";
            this.head = raw.div({
                width: size,
                height: size,
                textAlign: "center",
                borderRadius: "100%",
                zIndex: 1,
                opacity: 0,
                pointerEvents: "none",
            }, Squares.Style.backdropBlur(), raw.on(target, "scroll", () => this.handleTargetScroll()), this.symbol = raw.div(Dock.center(), {
                width: factor * 9 + "px",
                height: factor * 16 + "px",
                borderRadius: "6px",
                backgroundColor: "rgba(128, 128, 128, 0.75)",
                transitionDuration: "0.1s",
            }));
            Hat.wear(this);
            [this.onRefresh, this._onRefresh] = Force.create();
        }
        onRefresh;
        _onRefresh;
        /** */
        handleTargetScroll() {
            if (this.animation)
                return;
            const e = this.target;
            const overscrollAmount = Math.max(0, e.scrollTop + e.offsetHeight - e.scrollHeight);
            if (overscrollAmount <= 0)
                this.setLoadingAnimation(false);
            else if (overscrollAmount < beginRefreshFrame)
                this.setAnimationFrame(overscrollAmount);
            else if (overscrollAmount >= beginRefreshFrame)
                this.setLoadingAnimation(true);
        }
        /** */
        setAnimationFrame(n) {
            n = Math.max(0, n);
            const opacity = Math.min(1, n / beginRefreshFrame);
            this.rotationDegress = Math.round(n * 1.5);
            this.head.style.opacity = opacity.toString();
            this.symbol.style.transform = `rotateZ(${this.rotationDegress}deg)`;
        }
        /** */
        setLoadingAnimation(enable) {
            if (enable && !this.animation) {
                this.head.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                this.animation = this.symbol.animate([
                    { transform: `rotateZ(${this.rotationDegress}deg)` },
                    { transform: `rotateZ(${this.rotationDegress + 360}deg)` },
                ], {
                    iterations: 10000,
                    duration: 800,
                });
                this._onRefresh();
            }
            else if (!enable && this.animation)
                (async () => {
                    const animation = this.animation;
                    this.animation = null;
                    const s = this.head.style;
                    s.transitionDuration = "0.8s";
                    s.transitionProperty = "transform";
                    s.transform = "scale(1)";
                    await Squares.UI.wait(1);
                    s.transform = "scale(0)";
                    await Squares.UI.waitTransitionEnd(this.head);
                    animation.finish();
                    s.opacity = "0";
                    s.transform = "scale(1)";
                })();
        }
    }
    Squares.PullToRefreshHat = PullToRefreshHat;
    /** The frame at which the RefreshHat becomes fully opaque */
    const beginRefreshFrame = 100;
    const factor = 2;
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /** */
    class RootHat {
        head;
        /** */
        constructor() {
            this.head = raw.div(Squares.UI.noScrollBars, {
                height: "inherit",
                top: "env(safe-area-inset-top)",
                tabIndex: 0,
            }, raw.on(window, "paste", async (ev) => {
                const uri = await Squares.Util.readClipboardHtmlUri();
                if (uri)
                    this.followFeedFromUri(uri);
            }), raw.on(window, "follow", ev => {
                this.followFeedFromUri(ev.data);
            }));
            Hat.wear(this)
                .wear(Squares.UnfollowSignal, key => Squares.Data.archiveFeed(key));
        }
        /** */
        async construct() {
            const paneSwiper = new Squares.PaneSwiper();
            for await (const scroll of Squares.Data.readScrolls()) {
                const viewer = new Squares.ScrollMuxViewerHat(scroll);
                paneSwiper.addPane(viewer.head);
            }
            paneSwiper.addPane(new Squares.FollowersHat().head);
            this.head.append(paneSwiper.head);
            const dotsHat = new Squares.DotsHat();
            dotsHat.insert(2);
            dotsHat.highlight(0);
            raw.get(dotsHat.head)({
                position: "absolute",
                left: 0,
                right: 0,
                bottom: CAPACITOR ? "105px" :
                    DEMO ? 0 :
                        "15px",
                margin: "auto",
            });
            this.head.append(dotsHat.head);
            paneSwiper.visiblePaneChanged(index => {
                dotsHat.highlight(index);
            });
        }
        /**
         *
         */
        async followFeedFromUri(htmlUri) {
            const followUri = Squares.Util.parseHtmlUri(htmlUri);
            if (!followUri)
                return;
            const urls = await Webfeed.getFeedUrls(followUri);
            if (!urls)
                return;
            const checksum = await Squares.Util.getFeedChecksum(followUri);
            if (!checksum)
                return;
            const feedMeta = await Webfeed.getFeedMetaData(followUri);
            const feed = await Squares.Data.writeFeed(feedMeta, { checksum });
            await Squares.Data.captureRawFeed(feed, urls);
            Hat.signal(Squares.FollowSignal, feed);
            if (CAPACITOR) {
                await Toast.show({
                    position: "center",
                    duration: "long",
                    text: "Now following" /* Strings.nowFollowing */ + " " + feed.author,
                });
            }
        }
        /**
         * Gets the fully qualified URL where the post resides, which is calculated
         * by concatenating the post path with the containing feed URL.
         */
        getPostUrl(post) {
            const feedFolder = Webfeed.Url.folderOf(post.feed.url);
            return feedFolder + post.path;
        }
    }
    Squares.RootHat = RootHat;
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /** */
    class ScrollCreatorHat {
        head;
        /** */
        constructor() {
            this.head = raw.div();
        }
    }
    Squares.ScrollCreatorHat = ScrollCreatorHat;
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    var Cover;
    (function (Cover) {
        /** */
        async function coverScrollFeedViewerHat() {
            const feed = {
                key: 1696947977011,
                url: "http://localhost:43332/raccoons/index.txt",
                icon: "icon.jpg",
                author: "Mr Raccoons",
                description: "Sample feed of raccoons",
                checksum: "?"
            };
            const feedUrl = "http://localhost:43332/raccoons/index.txt";
            const urls = await Webfeed.getFeedUrls(feedUrl);
            if (!urls)
                throw "No feed loaded";
            const hat = new Squares.ScrollFeedViewerHat(feed, urls);
            document.body.append(hat.head);
        }
        Cover.coverScrollFeedViewerHat = coverScrollFeedViewerHat;
    })(Cover = Squares.Cover || (Squares.Cover = {}));
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    const transitionDuration = "0.5s";
    /** */
    class ScrollViewerHat {
        head;
        gridContainer;
        grid;
        pullToRefreshHat;
        selectedGridItem = null;
        /** */
        constructor() {
            this.grid = new Squares.GridHat();
            const borderRadius = (CAPACITOR || DEMO) ? "30px" : 0;
            this.head = raw.div({
                height: (CAPACITOR || DEMO) ? "177.7777vw" : "100%",
                alignSelf: "center",
                borderRadius,
                overflow: "hidden",
            }, this.gridContainer = raw.div("grid-container", {
                height: "100%",
                borderRadius,
                overflow: "hidden",
                transitionDuration,
                transitionProperty: "transform, opacity",
            }), !(CAPACITOR || DEMO) && raw.div(Dock.bottomRight(10), {
                zIndex: 1,
                color: "white",
                borderRadius: "100%",
                padding: "10px",
                width: "50px",
                height: "50px",
                lineHeight: "33px",
                textAlign: "center",
                fontSize: "25px",
                fontWeight: 700,
            }, Squares.Style.backgroundOverlay(), Squares.Style.clickable, t `↻`, raw.on("click", () => this.handleRefreshInner())), raw.get(this.pullToRefreshHat = new Squares.PullToRefreshHat(this.grid.head))({
                position: "absolute",
                bottom: "20px",
                left: 0,
                right: 0,
                margin: "auto",
            }));
            Hat.wear(this);
            this.constructGrid();
            this.showGrid(true);
            this.pullToRefreshHat.onRefresh(() => this.handleRefreshInner());
            this.gridContainer.append(this.grid.head);
        }
        /** */
        async handleRefreshInner() {
            await this.handleRefresh();
            this.grid.tryAppendPosters(1);
        }
        /** */
        constructGrid() {
            this.grid.head.style.borderRadius = "inherit";
            this.grid.handleRender(index => this.getPost(index));
            this.grid.handleSelect(async (e, index) => {
                if (this.selectedGridItem)
                    return;
                this.selectedGridItem = e;
                this.showPage(index);
            });
        }
        /** */
        async showPage(index) {
            const pageInfo = await this.getPageInfo(index);
            const pageHat = new Squares.PageHat(pageInfo.head, pageInfo.sections, pageInfo.feed);
            raw.get(pageHat)(Dock.cover(), {
                transitionDuration,
                transitionProperty: "transform",
                transform: "translateY(110%)",
            }, raw.on("connected", () => setTimeout(async () => {
                for (const e of Query.ancestors(this.head))
                    if (e instanceof HTMLElement)
                        e.classList.add(noOverflowClass);
                await Squares.UI.wait(1);
                pageHat.head.style.transform = "translateY(0)";
                await Squares.UI.waitTransitionEnd(pageHat.head);
                this.gridContainer.style.transitionDuration = "0s";
            })), raw.on(this.grid.head, "scroll", async () => {
                if (pageHat.head.isConnected) {
                    await pageHat.forceRetract();
                    this.showGrid(true);
                }
            }));
            pageHat.onRetract(pct => window.requestAnimationFrame(() => {
                const s = this.gridContainer.style;
                s.transform = translateZ(pct * translateZMax + "px");
                s.opacity = (1 - pct).toString();
            }));
            const disconnected = async () => {
                if (this.selectedGridItem) {
                    const s = this.selectedGridItem.style;
                    s.transitionDuration = "0.75s";
                    s.transitionProperty = "opacity, filter";
                    //! These transitions break after a few openings and
                    //! closings on mobile Safari. Is this a bug in the engine?
                    applyVisitedStyle(this.selectedGridItem);
                }
                this.selectedGridItem = null;
                this.gridContainer.style.transitionDuration = transitionDuration;
                for (const e of Query.ancestors(this.head))
                    if (e instanceof HTMLElement)
                        e.classList.remove(noOverflowClass);
                const info = this.getPost(index);
                if (info)
                    this.handlePostVisited(index);
            };
            pageHat.onDisconnect(disconnected);
            //! Temp fix
            await Squares.UI.wait(100);
            this.gridContainer.after(pageHat.head);
            await Squares.UI.wait(100);
            this.showGrid(false);
        }
        /** */
        showGrid(show) {
            const s = this.gridContainer.style;
            s.transitionDuration = transitionDuration;
            s.transform = translateZ(show ? "0" : translateZMax + "px");
            s.opacity = show ? "1" : "0";
        }
    }
    Squares.ScrollViewerHat = ScrollViewerHat;
    /**
     * A specialization of the ScrollViewerHat that supports scenarios where
     * multiple feeds are multiplexed into a single view.
     */
    class ScrollMuxViewerHat extends ScrollViewerHat {
        scroll;
        /** */
        constructor(scroll) {
            super();
            this.scroll = scroll;
            this.foregroundFetcher = new Squares.ForegroundFetcher();
        }
        foregroundFetcher;
        /** */
        async handleRefresh() {
            await this.foregroundFetcher.fetch();
        }
        /** */
        getPost(index) {
            if (index >= Squares.Data.readScrollPostCount(this.scroll.key))
                return null;
            return (async () => {
                block: {
                    const post = await Squares.Data.readScrollPost(this.scroll.key, index);
                    if (post === null)
                        break block;
                    const url = Hat.over(this, Squares.RootHat).getPostUrl(post);
                    if (!url)
                        break block;
                    const poster = await Webfeed.getPosterFromUrl(url);
                    if (!poster)
                        break block;
                    return post.visited ?
                        applyVisitedStyle(poster) :
                        poster;
                }
                return Webfeed.getErrorPoster();
            })();
        }
        /** */
        async getPageInfo(index) {
            const post = await Squares.Data.readScrollPost(this.scroll.key, index);
            if (!post)
                throw new Error();
            const root = Hat.over(this, Squares.RootHat);
            const postUrl = root.getPostUrl(post) || "";
            const page = await Webfeed.getPageFromUrl(postUrl);
            const head = page?.head || [];
            const sections = page ?
                page.sections.slice() :
                [Webfeed.getErrorPoster()];
            const feed = await Squares.Data.readFeed(post.feed.key);
            if (!feed)
                throw new Error();
            return { head, sections, feed };
        }
        /** */
        async handlePostVisited(index) {
            const post = await Squares.Data.readScrollPost(this.scroll.key, index);
            if (post) {
                post.visited = true;
                Squares.Data.writePost(post);
            }
        }
    }
    Squares.ScrollMuxViewerHat = ScrollMuxViewerHat;
    /**
     * A specialization of the ScrollViewerHat that supports scenarios where
     * a single feed is displayed within a single view.
     */
    class ScrollFeedViewerHat extends ScrollViewerHat {
        feed;
        urls;
        /** */
        constructor(feed, urls) {
            super();
            this.feed = feed;
            this.urls = urls;
        }
        /** */
        async handleRefresh() {
        }
        /** */
        getPost(index) {
            if (index < 0 || index >= this.urls.length)
                return null;
            const url = this.urls[index];
            return (async () => {
                const maybePoster = await Webfeed.getPosterFromUrl(url);
                return maybePoster || Webfeed.getErrorPoster();
            })();
        }
        /** */
        async getPageInfo(index) {
            return {
                head: [],
                sections: [],
                feed: this.feed,
            };
        }
        /** */
        handlePostVisited(index) { }
    }
    Squares.ScrollFeedViewerHat = ScrollFeedViewerHat;
    /** */
    function applyVisitedStyle(e) {
        const s = e.style;
        s.filter = "saturate(0) brightness(0.4)";
        return e;
    }
    const translateZ = (amount) => `perspective(10px) translateZ(${amount})`;
    const translateZMax = -3;
    const noOverflowClass = raw.css({
        overflow: "hidden !"
    });
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /** */
    let Color;
    (function (Color) {
        Color.defaultHue = 215;
        /** */
        function from(values) {
            const h = (Array.isArray(values) ? values.at(0) : values.h) ?? Color.defaultHue;
            const s = (Array.isArray(values) ? values.at(1) : values.s) ?? 50;
            const l = (Array.isArray(values) ? values.at(2) : values.l) ?? 50;
            const a = Array.isArray(values) ? 1 : values.a ?? 1;
            return a === 1 ?
                `hsl(${h}, ${s}%, ${l}%)` :
                `hsla(${h}, ${s}%, ${l}%, ${a})`;
        }
        Color.from = from;
        /** */
        function white(alpha = 1) {
            return alpha === 1 ? "white" : `rgba(255, 255, 255, ${alpha})`;
        }
        Color.white = white;
        /** */
        function black(alpha = 1) {
            return alpha === 1 ? "black" : `rgba(0, 0, 0, ${alpha})`;
        }
        Color.black = black;
        /** */
        function gray(value = 128, alpha = 1) {
            return alpha === 1 ?
                `rgb(${value}, ${value}, ${value})` :
                `rgba(${value}, ${value}, ${value}, ${alpha})`;
        }
        Color.gray = gray;
    })(Color = Squares.Color || (Squares.Color = {}));
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /**
     * Namespace of functions for container query units.
     */
    let Cq;
    (function (Cq) {
        /**
         *
         */
        function width(amount, targetContainerClass) {
            return getProperty("width", "w", amount, targetContainerClass);
        }
        Cq.width = width;
        /**
         *
         */
        function height(amount, targetContainerClass) {
            return getProperty("height", "h", amount, targetContainerClass);
        }
        Cq.height = height;
        /**
         *
         */
        function left(amount, targetContainerClass) {
            return getProperty("left", "w", amount, targetContainerClass);
        }
        Cq.left = left;
        /** */
        function getProperty(property, axis, amount, cls) {
            if (supportsContainerUnits === null)
                supportsContainerUnits = raw.div({ width: "1cqw" }).style.width !== "";
            let container = null;
            return e => raw.on("connected", () => {
                container ||= Query.ancestors(e).find((c) => c instanceof HTMLElement &&
                    c.classList.contains(cls)) || null;
                if (!container)
                    throw "Container not found.";
                if (supportsContainerUnits) {
                    container.style.containerType = "size";
                    e.style.setProperty(property, amount + "cq" + axis);
                }
                else
                    Squares.Resize.watch(container, (w, h) => {
                        const wOrH = axis === "w" ? w : h;
                        const stringified = ((amount / 100) * wOrH).toFixed(3) + "px";
                        e.style.setProperty(property, stringified);
                    }, true);
            });
        }
        let supportsContainerUnits = null;
    })(Cq = Squares.Cq || (Squares.Cq = {}));
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /** */
    let Origin;
    (function (Origin) {
        Origin["topLeft"] = "origin-tl";
        Origin["top"] = "origin-t";
        Origin["topRight"] = "origin-tr";
        Origin["left"] = "origin-l";
        Origin["center"] = "origin-c";
        Origin["right"] = "origin-r";
        Origin["bottomLeft"] = "origin-bl";
        Origin["bottom"] = "origin-b";
        Origin["bottomRight"] = "origin-br";
    })(Origin = Squares.Origin || (Squares.Origin = {}));
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /**
     * A namespace of color values that define the color palette
     * used across the application.
     */
    let Pal;
    (function (Pal) {
        Pal.gray1 = Squares.Color.gray(180);
        Pal.gray2 = Squares.Color.gray(100);
        Pal.gray3 = Squares.Color.gray(60);
    })(Pal = Squares.Pal || (Squares.Pal = {}));
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /** */
    function appendCssReset() {
        document.head.append(raw.style("*", {
            position: "relative",
            padding: 0,
            margin: 0,
            zIndex: 0,
            boxSizing: "border-box",
            webkitFontSmoothing: "antialiased",
            color: "inherit",
            fontSize: "inherit",
        }, ":root", {
            height: "100vh",
            fontSize: "20px",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, roboto, noto, arial, sans-serif",
            color: "white",
            backgroundColor: "black",
        }, "BODY", {
            height: "inherit",
        }, 
        // Eliminate margin collapsing
        "ADDRESS, ARTICLE, ASIDE, BLOCKQUOTE, DD, DIV, FORM, " +
            "H1, H2, H3, H4, H4, H6, HEADER, HGROUP, OL, UL, P, PRE, SECTION", {
            padding: "0.016px 0"
        }, 
        // No scrollbars anywhere... for now
        "*::-webkit-scrollbar", {
            display: "none"
        }));
    }
    Squares.appendCssReset = appendCssReset;
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    let Resize;
    (function (Resize) {
        /**
         * Observes the resizing of the particular element, and invokes
         * the specified callback when the element is resized.
         */
        function watch(e, callback, runInitially = false) {
            if (typeof ResizeObserver !== "undefined") {
                new ResizeObserver(rec => {
                    if (rec.length === 0)
                        return;
                    const entry = rec[0];
                    if (entry.borderBoxSize?.length > 0) {
                        const size = entry.borderBoxSize[0];
                        callback(size.inlineSize, size.blockSize);
                    }
                    else {
                        const width = e.offsetWidth;
                        const height = e.offsetHeight;
                        callback(width, height);
                    }
                }).observe(e, { box: "border-box" });
            }
            else
                raw.get(e)(raw.on(window, "resize", () => {
                    window.requestAnimationFrame(() => {
                        const width = e.offsetWidth;
                        const height = e.offsetHeight;
                        callback(width, height);
                    });
                }));
            if (runInitially) {
                const exec = () => callback(e.offsetWidth, e.offsetHeight);
                if (e.isConnected)
                    exec();
                else
                    raw.get(e)(raw.on("connected", exec));
            }
        }
        Resize.watch = watch;
    })(Resize = Squares.Resize || (Squares.Resize = {}));
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /**
     * A namespace of functions that produce generic CSS
     * styling values that aren't particular to any theme.
     */
    let Style;
    (function (Style) {
        /** */
        function backgroundOverlay() {
            return [
                {
                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                },
                Style.backdropBlur(5),
            ];
        }
        Style.backgroundOverlay = backgroundOverlay;
        /** */
        function backdropBlur(pixels = 5) {
            const value = pixels > 0 ? `blur(${pixels}px)` : "none";
            return {
                backdropFilter: value,
                webkitBackdropFilter: value,
            };
        }
        Style.backdropBlur = backdropBlur;
        /** */
        Style.unselectable = {
            userSelect: "none",
            webkitUserSelect: "none",
        };
        /** */
        Style.presentational = {
            ...Style.unselectable,
            pointerEvents: "none",
            cursor: "default",
        };
        /** */
        Style.keyable = {
            tabIndex: 0,
            outline: 0,
        };
        /** */
        Style.clickable = {
            ...Style.unselectable,
            cursor: "pointer"
        };
        /**
         * Returns styles that produce a font weight whose value
         * may or may not be perfectly divisible by 100.
         */
        function weight(weight) {
            return {
                fontWeight: weight.toString(),
                ...(weight % 100 === 0 ? {} : { fontVariationSettings: "'wght' " + weight })
            };
        }
        Style.weight = weight;
        /**
         * Displays text at a given font size and weight that
         * defaults to being unselectable.
         */
        function text(label = "", size = 20, weight) {
            return [
                Style.unselectable,
                {
                    fontSize: typeof size === "number" ? size + "px" : size,
                },
                weight ? Style.weight(weight) : null,
                label ? new Text(label) : null,
                e => {
                    // Only apply this weakly. The goal here is to get away from the I-beam,
                    // but other uses of this function could specify a pointer or something else,
                    // so this function shouldn't overwrite that.
                    if (e.style.cursor === "")
                        e.style.cursor = "default";
                }
            ];
        }
        Style.text = text;
        Style.borderRadiusLarge = "30px";
        Style.borderRadiusSmall = "10px";
    })(Style = Squares.Style || (Squares.Style = {}));
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /**
     *
     */
    let UI;
    (function (UI) {
        /** */
        function cornerAbsolute(kind) {
            if (kind === "tl")
                return raw.get(UI.corner("tl"))(cornerStyles, { top: 0, left: 0 });
            if (kind === "tr")
                return raw.get(UI.corner("tr"))(cornerStyles, { top: 0, right: 0 });
            else if (kind === "bl")
                return raw.get(UI.corner("bl"))(cornerStyles, { bottom: 0, left: 0 });
            else if (kind === "br")
                return raw.get(UI.corner("br"))(cornerStyles, { bottom: 0, right: 0 });
        }
        UI.cornerAbsolute = cornerAbsolute;
        const size = parseInt(Squares.Style.borderRadiusLarge);
        const cornerStyles = {
            position: "absolute",
            zIndex: 1,
            width: size + "px",
            height: size + "px",
            pointerEvents: "none",
        };
        /**
         * Renders a single inverted rounded corner piece.
         */
        function corner(kind) {
            let top = 0;
            let right = 0;
            let bottom = 0;
            let left = 0;
            if (kind === "tl")
                bottom = right = -100;
            else if (kind === "tr")
                bottom = left = -100;
            else if (kind === "bl")
                top = right = -100;
            else if (kind === "br")
                top = left = -100;
            return raw.span("corner", {
                overflow: "hidden",
                width: "100px",
                height: "100px",
                clipPath: "inset(0 0)"
            }, raw.span({
                position: "absolute",
                top: top + "%",
                right: right + "%",
                bottom: bottom + "%",
                left: left + "%",
                borderRadius: "100%",
                boxShadow: "0 0 0 1000px black",
            }));
        }
        UI.corner = corner;
        /** */
        function stretch() {
            return [
                { width: "-moz-available" },
                { width: "-webkit-fill-available" },
                { width: "fill-available" },
                { width: "stretch" }
            ];
        }
        UI.stretch = stretch;
        /** */
        function escape(fn) {
            return [
                { tabIndex: 0 },
                raw.on("keydown", ev => {
                    if (ev.key === "Escape")
                        fn();
                })
            ];
        }
        UI.escape = escape;
        /** */
        function click(handlerFn) {
            return [
                e => (e.role = "button"),
                Squares.Style.clickable,
                raw.on("click", handlerFn)
            ];
        }
        UI.click = click;
        /** */
        function wait(ms = 0) {
            return new Promise(r => setTimeout(r, ms));
        }
        UI.wait = wait;
        /** */
        async function waitConnected(e) {
            if (!e.isConnected)
                await new Promise(r => raw.get(e)(raw.on("connected", r)));
            // Wait an additional 1ms so that the element becomes transition-ready
            await new Promise(r => setTimeout(r, 1));
        }
        UI.waitConnected = waitConnected;
        /** */
        async function waitTransitionEnd(e) {
            await new Promise(r => e.addEventListener("transitionend", ev => {
                if (ev.target === e)
                    r();
            }));
        }
        UI.waitTransitionEnd = waitTransitionEnd;
        /** */
        function noScrollBars() {
            return raw.style("*::-webkit-scrollbar", {
                display: "none"
            });
        }
        UI.noScrollBars = noScrollBars;
        /** */
        function hide() {
            const cls = "hide";
            if (!hideHasRun) {
                raw.style("." + cls, { display: "none !" }).attach();
                hideHasRun = true;
            }
            return cls;
        }
        UI.hide = hide;
        let hideHasRun = false;
        /** */
        function visibleWhenAlone() {
            return raw.css(":not(:only-child) !", { display: "none" });
        }
        UI.visibleWhenAlone = visibleWhenAlone;
        /** */
        function visibleWhenNotAlone() {
            return raw.css(":only-child !", { display: "none" });
        }
        UI.visibleWhenNotAlone = visibleWhenNotAlone;
        /** */
        function visibleWhenEmpty(watchTarget) {
            return [
                watchTarget.children.length === 0 ? "" : UI.hide(),
                raw.on("connected", ev => addVisibilityObserver(ev.target, watchTarget, true)),
            ];
        }
        UI.visibleWhenEmpty = visibleWhenEmpty;
        /** */
        function visibleWhenNotEmpty(watchTarget) {
            return [
                watchTarget.children.length === 0 ? UI.hide() : "",
                raw.on("connected", ev => addVisibilityObserver(ev.target, watchTarget, false)),
            ];
        }
        UI.visibleWhenNotEmpty = visibleWhenNotEmpty;
        /** */
        function addVisibilityObserver(visibilityTarget, watchTarget, forEmpty) {
            if (!(visibilityTarget instanceof HTMLElement))
                return;
            const exec = () => {
                const children = Query.children(watchTarget);
                if (forEmpty && children.length > 0)
                    visibilityTarget.classList.add(UI.hide());
                else if (!forEmpty && children.length === 0)
                    visibilityTarget.classList.add(UI.hide());
                else
                    visibilityTarget.classList.remove(UI.hide());
            };
            exec();
            UI.onChildrenChanged(watchTarget, exec);
        }
        /** */
        function onChildrenChanged(e, fn) {
            new MutationObserver(() => fn()).observe(e, { childList: true });
        }
        UI.onChildrenChanged = onChildrenChanged;
        /** */
        async function collapse(e) {
            const height = e.offsetHeight;
            e.style.marginBottom = "0px";
            e.style.clipPath = "inset(0 0 0 0)";
            e.style.transitionProperty = "opacity, margin-bottom, clip-path";
            e.style.transitionDuration = "0.5s";
            await UI.wait();
            e.style.opacity = "0";
            e.style.marginBottom = "-" + height + "px";
            e.style.clipPath = "inset(0 0 100% 0)";
            await UI.waitTransitionEnd(e);
        }
        UI.collapse = collapse;
        /** */
        async function fade(e) {
            e.style.transitionProperty = "opacity";
            e.style.transitionDuration = "0.5s";
            e.style.pointerEvents = "none";
            if (!e.style.opacity)
                e.style.opacity = "1";
            await UI.wait();
            e.style.opacity = "0";
            await UI.waitTransitionEnd(e);
            e.style.visibility = "hidden";
        }
        UI.fade = fade;
    })(UI = Squares.UI || (Squares.UI = {}));
})(Squares || (Squares = {}));
var Squares;
(function (Squares) {
    /** */
    let Widget;
    (function (Widget) {
        /** */
        function fillButton(...params) {
            return raw.div({
                display: "inline-block",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: "rgba(128, 128, 128, 0.5)",
                fontWeight: 500,
            }, Squares.Style.clickable, Squares.Style.backdropBlur(5), ...params);
        }
        Widget.fillButton = fillButton;
        /** */
        function hollowButton(options) {
            return raw.div({
                padding: "15px",
                border: "2px solid " + Squares.Pal.gray1,
                borderRadius: "15px",
                color: Squares.Pal.gray1,
                textAlign: "center",
                cursor: "pointer",
                whiteSpace: "nowrap",
            }, options.click && raw.on("click", options.click), Squares.Style.text(options.text, 23, 500));
        }
        Widget.hollowButton = hollowButton;
        /** */
        function underlineTextbox(...params) {
            return raw.input({
                outline: 0,
                border: 0,
                padding: "10px 0",
                borderBottom: "2px solid " + Squares.Pal.gray2,
                backgroundColor: "transparent",
                color: "white",
                display: "block",
                fontSize: "inherit",
                spellcheck: false,
            }, Squares.UI.stretch(), params);
        }
        Widget.underlineTextbox = underlineTextbox;
    })(Widget = Squares.Widget || (Squares.Widget = {}));
})(Squares || (Squares = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3F1YXJlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NvcmUvIS50cyIsIi4uL2NvcmUvRmVlZHNEZWJ1Zy50cyIsIi4uL2NvcmUvRmVlZHNEZW1vLnRzIiwiLi4vY29yZS9TaWduYWxzLnRzIiwiLi4vY29yZS9TdHJpbmdzLnRzIiwiLi4vY29yZS9iYWNrZW5kL0JhY2tncm91bmRGZXRjaGVyLnRzIiwiLi4vY29yZS9iYWNrZW5kL0RhdGEudHMiLCIuLi9jb3JlL2JhY2tlbmQvRGF0YUluaXRpYWxpemVyLnRzIiwiLi4vY29yZS9iYWNrZW5kL0ZldGNoZXIudHMiLCIuLi9jb3JlL2JhY2tlbmQvRm9yZWdyb3VuZEZldGNoZXIudHMiLCIuLi9jb3JlL2JhY2tlbmQvSUZlZWQudHMiLCIuLi9jb3JlL2JhY2tlbmQvSVBvc3QudHMiLCIuLi9jb3JlL2JhY2tlbmQvSVNjcm9sbC50cyIsIi4uL2NvcmUvYmFja2VuZC9VdGlsLnRzIiwiLi4vY29yZS9oYXRzL0RvdHNIYXQudHMiLCIuLi9jb3JlL2hhdHMvRmVlZE1ldGFIYXQudHMiLCIuLi9jb3JlL2hhdHMvRm9sbG93ZXJzSGF0LmNvdmVyLnRzIiwiLi4vY29yZS9oYXRzL0ZvbGxvd2Vyc0hhdC50cyIsIi4uL2NvcmUvaGF0cy9HcmlkSGF0LmNvdmVyLnRzIiwiLi4vY29yZS9oYXRzL0dyaWRIYXQudHMiLCIuLi9jb3JlL2hhdHMvUGFnZUhhdC5jb3Zlci50cyIsIi4uL2NvcmUvaGF0cy9QYWdlSGF0LnRzIiwiLi4vY29yZS9oYXRzL1BhbmVTd2lwZXIudHMiLCIuLi9jb3JlL2hhdHMvUHJvZmlsZUhhdC50cyIsIi4uL2NvcmUvaGF0cy9QdWxsVG9SZWZyZXNoSGF0LnRzIiwiLi4vY29yZS9oYXRzL1Jvb3RIYXQudHMiLCIuLi9jb3JlL2hhdHMvU2Nyb2xsQ3JlYXRvckhhdC50cyIsIi4uL2NvcmUvaGF0cy9TY3JvbGxWaWV3ZXJIYXQuY292ZXIudHMiLCIuLi9jb3JlL2hhdHMvU2Nyb2xsVmlld2VySGF0LnRzIiwiLi4vY29yZS9pbXBvcnRlci9JbnN0YWdyYW1FeHBvcnRUeXBlcy50cyIsIi4uL2NvcmUvc3R5bGUvQ29sb3IudHMiLCIuLi9jb3JlL3N0eWxlL0NxLnRzIiwiLi4vY29yZS9zdHlsZS9PcmlnaW4udHMiLCIuLi9jb3JlL3N0eWxlL1BhbC50cyIsIi4uL2NvcmUvc3R5bGUvUmVzZXQudHMiLCIuLi9jb3JlL3N0eWxlL1Jlc2l6ZS50cyIsIi4uL2NvcmUvc3R5bGUvU3R5bGVzLnRzIiwiLi4vY29yZS9zdHlsZS9VSU1hY3Jvcy50cyIsIi4uL2NvcmUvc3R5bGUvV2lkZ2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFnREEsOEVBQThFO0FBQzlFLElBQUksT0FBTyxVQUFVLEtBQUssV0FBVztJQUNuQyxNQUFjLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztBQUVyQyxxRUFBcUU7QUFDckUsbUVBQW1FO0FBQ25FLHNFQUFzRTtBQUN0RSwwREFBMEQ7QUFDMUQsSUFBSSxPQUFPLEtBQUssS0FBSyxXQUFXO0lBQy9CLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFFNUMsSUFBSSxPQUFPLFFBQVEsS0FBSyxXQUFXO0lBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sTUFBTSxHQUFHLE9BQU8sT0FBTyxLQUFLLGdCQUFnQixFQUFFLENBQUMsQ0FBQztBQUU5RixJQUFJLE9BQU8sS0FBSyxLQUFLLFdBQVc7SUFDL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLE9BQVEsTUFBYyxDQUFDLFNBQVMsS0FBSyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBRXpILElBQUksT0FBTyxHQUFHLEtBQUssV0FBVztJQUM3QixNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLEdB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Q0FBQyxLQUFLO2dCQUN0QyxlQUFlLEVBQUUsYUFBYTtnQkFDOUIsS0FBSyxFQUFFLE9BQU87Z0JBQ2QsT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLFFBQVEsRUFBRSxTQUFTO2dCQUNuQixVQUFVLEVBQUUsS0FBSzthQUNqQixFQUNELFFBQUEsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUNaLE1BQU0sQ0FDTixDQUFDO1FBQ0gsQ0FBQztRQWpCZSx1QkFBZ0IsbUJBaUIvQixDQUFBO0lBQ0YsQ0FBQyxFQTVEZ0IsTUFBTSxHQUFOLGNBQU0sS0FBTixjQUFNLFFBNER0QjtBQUNGLENBQUMsRUFoRVMsT0FBTyxLQUFQLE9BQU8sUUFnRWhCIiwic291cmNlc0NvbnRlbnQiOlsiXG5kZWNsYXJlIGNvbnN0IERFQlVHOiBib29sZWFuO1xuZGVjbGFyZSBjb25zdCBFTEVDVFJPTjogYm9vbGVhbjtcbmRlY2xhcmUgY29uc3QgVEFVUkk6IGJvb2xlYW47XG5kZWNsYXJlIGNvbnN0IE1BQzogYm9vbGVhbjtcbmRlY2xhcmUgY29uc3QgV0lORE9XUzogYm9vbGVhbjtcbmRlY2xhcmUgY29uc3QgTElOVVg6IGJvb2xlYW47XG5kZWNsYXJlIGNvbnN0IENBUEFDSVRPUjogYm9vbGVhbjtcbmRlY2xhcmUgY29uc3QgSU9TOiBib29sZWFuO1xuZGVjbGFyZSBjb25zdCBBTkRST0lEOiBib29sZWFuO1xuZGVjbGFyZSBjb25zdCBERU1POiBib29sZWFuO1xuZGVjbGFyZSBjb25zdCBNb2R1bGVzczogeyBnZXRSdW5uaW5nRnVuY3Rpb25OYW1lKCk6IHN0cmluZzsgfVxuXG5kZWNsYXJlIG5hbWVzcGFjZSBFbGVjdHJvblxue1xuXHRleHBvcnQgY29uc3QgZnM6IHR5cGVvZiBpbXBvcnQoXCJmc1wiKTtcblx0ZXhwb3J0IGNvbnN0IHBhdGg6IHR5cGVvZiBpbXBvcnQoXCJwYXRoXCIpO1xufVxuXG5kZWNsYXJlIG5hbWVzcGFjZSBUYXVyaVxue1xuXHRleHBvcnQgY29uc3QgZnM6IHR5cGVvZiBpbXBvcnQoXCJAdGF1cmktYXBwcy9hcGlcIikuZnM7XG5cdGV4cG9ydCBjb25zdCBjbGk6IHR5cGVvZiBpbXBvcnQoXCJAdGF1cmktYXBwcy9hcGlcIikuY2xpO1xuXHRleHBvcnQgY29uc3QgY2xpcGJvYXJkOiB0eXBlb2YgaW1wb3J0KFwiQHRhdXJpLWFwcHMvYXBpXCIpLmNsaXBib2FyZDtcblx0ZXhwb3J0IGNvbnN0IGRpYWxvZzogdHlwZW9mIGltcG9ydChcIkB0YXVyaS1hcHBzL2FwaVwiKS5kaWFsb2c7XG5cdGV4cG9ydCBjb25zdCBldmVudDogdHlwZW9mIGltcG9ydChcIkB0YXVyaS1hcHBzL2FwaVwiKS5ldmVudDtcblx0ZXhwb3J0IGNvbnN0IGdsb2JhbFNob3J0Y3V0OiB0eXBlb2YgaW1wb3J0KFwiQHRhdXJpLWFwcHMvYXBpXCIpLmdsb2JhbFNob3J0Y3V0O1xuXHRleHBvcnQgY29uc3QgaHR0cDogdHlwZW9mIGltcG9ydChcIkB0YXVyaS1hcHBzL2FwaVwiKS5odHRwO1xuXHRleHBvcnQgY29uc3QgaW52b2tlOiB0eXBlb2YgaW1wb3J0KFwiQHRhdXJpLWFwcHMvYXBpXCIpLmludm9rZTtcblx0ZXhwb3J0IGNvbnN0IG5vdGlmaWNhdGlvbjogdHlwZW9mIGltcG9ydChcIkB0YXVyaS1hcHBzL2FwaVwiKS5ub3RpZmljYXRpb247XG5cdGV4cG9ydCBjb25zdCBvczogdHlwZW9mIGltcG9ydChcIkB0YXVyaS1hcHBzL2FwaVwiKS5vcztcblx0ZXhwb3J0IGNvbnN0IHBhdGg6IHR5cGVvZiBpbXBvcnQoXCJAdGF1cmktYXBwcy9hcGlcIikucGF0aDtcblx0ZXhwb3J0IGNvbnN0IHByb2Nlc3M6IHR5cGVvZiBpbXBvcnQoXCJAdGF1cmktYXBwcy9hcGlcIikucHJvY2Vzcztcblx0ZXhwb3J0IGNvbnN0IHNoZWxsOiB0eXBlb2YgaW1wb3J0KFwiQHRhdXJpLWFwcHMvYXBpXCIpLnNoZWxsO1xuXHRleHBvcnQgY29uc3QgdGF1cmk6IHR5cGVvZiBpbXBvcnQoXCJAdGF1cmktYXBwcy9hcGlcIikudGF1cmk7XG5cdGV4cG9ydCBjb25zdCB1cGRhdGVyOiB0eXBlb2YgaW1wb3J0KFwiQHRhdXJpLWFwcHMvYXBpXCIpLnVwZGF0ZXI7XG5cdGV4cG9ydCBjb25zdCB3aW5kb3c6IHR5cGVvZiBpbXBvcnQoXCJAdGF1cmktYXBwcy9hcGlcIikud2luZG93O1xufVxuXG5kZWNsYXJlIGNvbnN0IENhcGFjaXRvcjogdHlwZW9mIGltcG9ydChcIkBjYXBhY2l0b3IvY29yZVwiKS5DYXBhY2l0b3IgJlxue1xuXHRwbGF0Zm9ybTogc3RyaW5nO1xufVxuXG5kZWNsYXJlIGNvbnN0IFRvYXN0OiB0eXBlb2YgaW1wb3J0KFwiQGNhcGFjaXRvci90b2FzdFwiKS5Ub2FzdDtcbmRlY2xhcmUgY29uc3QgQ2FwQ2xpcGJvYXJkOiB0eXBlb2YgaW1wb3J0KFwiQGNhcGFjaXRvci9jbGlwYm9hcmRcIikuQ2xpcGJvYXJkO1xuZGVjbGFyZSBjb25zdCBCYWNrZ3JvdW5kRmV0Y2g6IHR5cGVvZiBpbXBvcnQoXCJAdHJhbnNpc3RvcnNvZnQvY2FwYWNpdG9yLWJhY2tncm91bmQtZmV0Y2hcIikuQmFja2dyb3VuZEZldGNoO1xuXG4vLyBUaGUgZ2xvYmFsVGhpcyB2YWx1ZSBpc24ndCBhdmFpbGFibGUgaW4gU2FmYXJpLCBzbyBhIHBvbHlmaWxsIGlzIG5lY2Vzc2FyeTpcbmlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gXCJ1bmRlZmluZWRcIilcblx0KHdpbmRvdyBhcyBhbnkpLmdsb2JhbFRoaXMgPSB3aW5kb3c7XG5cbi8vIElmIHRoZSBERUJVRyBmbGFnIGlzIHVuZGVmaW5lZCwgdGhhdCBtZWFucyB0aGF0IHRoZSBleGVjdXRpbmcgY29kZVxuLy8gaGFzIG5vdCBwYXNzZWQgdGhyb3VnaCB0ZXJzZXIsIGFuZCBzbyB3ZSBhcmUgZWl0aGVyIHJ1bm5pbmcgaW4gYVxuLy8gY292ZXIgZnVuY3Rpb24sIG9yIGluIG9uZSBvZiB0aGUgaG9zdHMgaW4gZGVidWcgbW9kZS4gSW4gdGhpcyBjYXNlLFxuLy8gd2Ugc2V0IHRoZSBjb21waWxhdGlvbiBjb25zdGFudHMgZXhwbGljaXRseSBhdCBydW50aW1lLlxuaWYgKHR5cGVvZiBERUJVRyA9PT0gXCJ1bmRlZmluZWRcIilcblx0T2JqZWN0LmFzc2lnbihnbG9iYWxUaGlzLCB7IERFQlVHOiB0cnVlIH0pO1xuXG5pZiAodHlwZW9mIEVMRUNUUk9OID09PSBcInVuZGVmaW5lZFwiKVxuXHRPYmplY3QuYXNzaWduKGdsb2JhbFRoaXMsIHsgRUxFQ1RST046IHR5cGVvZiBzY3JlZW4gKyB0eXBlb2YgcmVxdWlyZSA9PT0gXCJvYmplY3RmdW5jdGlvblwiIH0pO1xuXG5pZiAodHlwZW9mIFRBVVJJID09PSBcInVuZGVmaW5lZFwiKVxuXHRPYmplY3QuYXNzaWduKGdsb2JhbFRoaXMsIHsgVEFVUkk6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mICh3aW5kb3cgYXMgYW55KS5fX1RBVVJJX18gIT09IFwidW5kZWZpbmVkXCIgfSk7XG5cbmlmICh0eXBlb2YgSU9TID09PSBcInVuZGVmaW5lZFwiKVxuXHRPYmplY3QuYXNzaWduKGdsb2JhbFRoaXMsIHsgSU9TOiBuYXZpZ2F0b3IucGxhdGZvcm0uc3RhcnRzV2l0aChcImlQXCIpIH0pO1xuXG5pZiAodHlwZW9mIEFORFJPSUQgPT09IFwidW5kZWZpbmVkXCIpXG5cdE9iamVjdC5hc3NpZ24oZ2xvYmFsVGhpcywgeyBBTkRST0lEOiBuYXZpZ2F0b3IudXNlckFnZW50LmluY2x1ZGVzKFwiQW5kcm9pZFwiKSB9KTtcblxuaWYgKHR5cGVvZiBERU1PID09PSBcInVuZGVmaW5lZFwiKVxuXHRPYmplY3QuYXNzaWduKGdsb2JhbFRoaXMsIHsgREVNTzogIShOdW1iZXIod2luZG93LmxvY2F0aW9uLmhvc3RuYW1lLnNwbGl0KFwiLlwiKS5qb2luKFwiXCIpKSA+IDApIH0pO1xuXG5jb25zdCB0ID0gcmF3LnRleHQ7XG5cbm5hbWVzcGFjZSBTcXVhcmVzXG57XG5cdC8qKlxuXHQgKiBUaGlzIGlzIHRoZSBtYWluIGVudHJ5IHBvaW50IG9mIHRoZSBhcHAuXG5cdCAqIFdoZW4gcnVubmluZyBpbiBUYXVyaSwgdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgZnJvbSB0aGUgYXV0by1nZW5lcmF0ZWQgaW5kZXguaHRtbCBmaWxlLlxuXHQgKi9cblx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN0YXJ0dXAoKVxuXHR7XG5cdFx0Ly8gVGhlIENBUEFDSVRPUiBjb25zdGFudCBuZWVkcyB0byBiZSBkZWZpbmVkIGFmdGVyIHRoZSBkb2N1bWVudCBoYXMgbG9hZGVkLFxuXHRcdC8vIG90aGVyd2lzZSwgd2luZG93LkNhcGFjaXRvciB3aWxsIGJlIHVuZGVmaW5lZCAob24gQW5kcm9pZCwgaXQgZG9lc24ndCBhcHBlYXJcblx0XHQvLyB0byBiZSBpbmplY3RlZCByaWdodCBhd2F5LlxuXHRcdGlmICh0eXBlb2YgQ0FQQUNJVE9SID09PSBcInVuZGVmaW5lZFwiKVxuXHRcdFx0T2JqZWN0LmFzc2lnbihnbG9iYWxUaGlzLCB7IENBUEFDSVRPUjogdHlwZW9mIENhcGFjaXRvciA9PT0gXCJvYmplY3RcIiB9KTtcblx0XHRcblx0XHRjb25zdCBnID0gZ2xvYmFsVGhpcyBhcyBhbnk7XG5cdFx0XG5cdFx0aWYgKEVMRUNUUk9OKVxuXHRcdHtcblx0XHRcdGNvbnN0IGcgPSBnbG9iYWxUaGlzIGFzIGFueTtcblx0XHRcdGcuRWxlY3Ryb24gPSBPYmplY3QuZnJlZXplKHtcblx0XHRcdFx0ZnM6IHJlcXVpcmUoXCJmc1wiKSxcblx0XHRcdFx0cGF0aDogcmVxdWlyZShcInBhdGhcIilcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRlbHNlIGlmIChUQVVSSSlcblx0XHR7XG5cdFx0XHRjb25zdCBnID0gZ2xvYmFsVGhpcyBhcyBhbnk7XG5cdFx0XHRnLlRhdXJpID0gZy5fX1RBVVJJX187XG5cdFx0fVxuXHRcdFxuXHRcdGlmIChDQVBBQ0lUT1IpXG5cdFx0e1xuXHRcdFx0Zy5Ub2FzdCA9IGcuQ2FwYWNpdG9yPy5QbHVnaW5zPy5Ub2FzdDtcblx0XHRcdGcuQmFja2dyb3VuZEZldGNoID0gZy5DYXBhY2l0b3I/LlBsdWdpbnM/LkJhY2tncm91bmRGZXRjaDtcblx0XHRcdGcuQ2FwYWN0b3I/LkNsaXBib2FyZDtcblx0XHR9XG5cdFx0XG5cdFx0aWYgKEVMRUNUUk9OKVxuXHRcdHtcblx0XHRcdGcuSGF0ID0gcmVxdWlyZShcIkBzcXVhcmVzYXBwL2hhdGpzXCIpLkhhdDtcblx0XHRcdGcuRmlsYSA9IHJlcXVpcmUoXCJmaWxhLWNvcmVcIikuRmlsYTtcblx0XHRcdGcuRmlsYU5vZGUgPSByZXF1aXJlKFwiZmlsYS1ub2RlXCIpLkZpbGFOb2RlO1xuXHRcdFx0RmlsYU5vZGUudXNlKCk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKFRBVVJJKVxuXHRcdFx0RmlsYVRhdXJpLnVzZSgpO1xuXHRcdFxuXHRcdGVsc2UgaWYgKENBUEFDSVRPUilcblx0XHRcdEZpbGFDYXBhY2l0b3IudXNlKCk7XG5cdFx0XG5cdFx0ZWxzZSBpZiAoREVNTylcblx0XHRcdEZpbGFLZXl2YS51c2UoKTtcblx0XHRcblx0XHRpZiAoREVCVUcgfHwgREVNTylcblx0XHRcdGF3YWl0IERhdGEuY2xlYXIoKTtcblx0XHRcblx0XHRpZiAoREVCVUcpXG5cdFx0e1xuXHRcdFx0Y29uc3QgZGF0YUZvbGRlciA9IGF3YWl0IFV0aWwuZ2V0RGF0YUZvbGRlcigpO1xuXHRcdFx0aWYgKCFhd2FpdCBkYXRhRm9sZGVyLmV4aXN0cygpKVxuXHRcdFx0XHRhd2FpdCBkYXRhRm9sZGVyLndyaXRlRGlyZWN0b3J5KCk7XG5cdFx0XHRcblx0XHRcdGF3YWl0IFNxdWFyZXMucnVuRGF0YUluaXRpYWxpemVyKFNxdWFyZXMuZmVlZHNGb3JEZWJ1Zyk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKERFTU8pXG5cdFx0e1xuXHRcdFx0YXdhaXQgU3F1YXJlcy5ydW5EYXRhSW5pdGlhbGl6ZXIoU3F1YXJlcy5mZWVkc0ZvckRlbW8pO1xuXHRcdH1cblx0XHRcblx0XHRTcXVhcmVzLmFwcGVuZENzc1Jlc2V0KCk7XG5cdFx0YXdhaXQgRGF0YS5pbml0aWFsaXplKCk7XG5cdFx0Y29uc3Qgcm9vdEhhdCA9IG5ldyBSb290SGF0KCk7XG5cdFx0YXdhaXQgcm9vdEhhdC5jb25zdHJ1Y3QoKTtcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZChyb290SGF0LmhlYWQpO1xuXHR9XG5cdFxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxuXHRcdFwicmVhZHlzdGF0ZWNoYW5nZVwiLFxuXHRcdCgpID0+IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiY29tcGxldGVcIiAmJiBzdGFydHVwKCkpO1xufVxuXG4vL0B0cy1pZ25vcmVcbmlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiKSBPYmplY3QuYXNzaWduKG1vZHVsZS5leHBvcnRzLCB7IFNxdWFyZXMgfSk7IiwiXG4vLyEgVGhpcyBmaWxlIGlzIGFzc3VtZS11bmNoYW5nZWQgaW4gZ2l0XG5cbm5hbWVzcGFjZSBTcXVhcmVzXG57XG5cdC8vQHRzLWlnbm9yZVxuXHRpZiAoIURFQlVHKSByZXR1cm47XG5cdFxuXHRleHBvcnQgY29uc3QgZmVlZHNGb3JEZWJ1ZyA9IFtcblx0XHRcImh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9zcXVhcmVzYXBwL3dlYmZlZWQtZXhhbXBsZXMvbWFpbi9yYWNjb29ucy9pbmRleC50eHRcIixcblx0XHRcImh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9zcXVhcmVzYXBwL3dlYmZlZWQtZXhhbXBsZXMvbWFpbi9yZWQtZmxvd2Vycy9pbmRleC50eHRcIixcblx0XTtcbn1cbiIsIlxubmFtZXNwYWNlIFNxdWFyZXNcbntcblx0Ly9AdHMtaWdub3JlXG5cdGlmICghREVNTykgcmV0dXJuO1xuXHRcblx0ZXhwb3J0IGNvbnN0IGZlZWRzRm9yRGVtbyA9IFtcblx0XHRcImh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9zcXVhcmVzYXBwL3dlYmZlZWQtZXhhbXBsZXMvbWFpbi9yYWNjb29ucy9pbmRleC50eHRcIixcblx0XHRcImh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9zcXVhcmVzYXBwL3dlYmZlZWQtZXhhbXBsZXMvbWFpbi9yZWQtZmxvd2Vycy9pbmRleC50eHRcIixcblx0XTtcbn1cbiIsIlxubmFtZXNwYWNlIFNxdWFyZXNcbntcblx0LyoqICovXG5cdGV4cG9ydCBmdW5jdGlvbiBVbmZvbGxvd1NpZ25hbChmZWVkS2V5OiBudW1iZXIpIHt9XG5cdFxuXHQvKiogKi9cblx0ZXhwb3J0IGZ1bmN0aW9uIEZvbGxvd1NpZ25hbChmZWVkOiBJRmVlZCkge31cbn1cbiIsIlxubmFtZXNwYWNlIFNxdWFyZXNcbntcblx0ZXhwb3J0IGNvbnN0IGVudW0gU3RyaW5nc1xuXHR7XG5cdFx0Zm9sbG93aW5nID0gXCJGb2xsb3dpbmdcIixcblx0XHR1bmZvbGxvdyA9IFwiVW5mb2xsb3dcIixcblx0XHRub3dGb2xsb3dpbmcgPSBcIk5vdyBmb2xsb3dpbmdcIixcblx0XHRzaGFyZSA9IFwiU2hhcmVcIixcblx0XHR1bmtub3duQXV0aG9yID0gXCIoQXV0aG9yIFVua25vd24pXCIsXG5cdH1cbn1cbiIsIlxubmFtZXNwYWNlIFNxdWFyZXNcbntcblx0LyoqXG5cdCAqIFxuXHQgKi9cblx0ZXhwb3J0IGNsYXNzIEJhY2tncm91bmRGZXRjaGVyXG5cdHtcblx0XHQvKiogKi9cblx0XHRjb25zdHJ1Y3RvcigpXG5cdFx0e1xuXHRcdFx0Ly8hIE5vdCBpbXBsZW1lbnRlZFxuXHRcdH1cblx0fVxufVxuIiwiXG5uYW1lc3BhY2UgU3F1YXJlcy5EYXRhXG57XG5cdC8qKiAqL1xuXHRleHBvcnQgaW50ZXJmYWNlIElSZWFkQXJyYXlPcHRpb25zXG5cdHtcblx0XHRzdGFydD86IG51bWJlcjtcblx0XHRsaW1pdD86IG51bWJlcjtcblx0fVxuXHRcblx0LyoqICovXG5cdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0aWFsaXplKClcblx0e1xuXHRcdGZvciAoY29uc3QgcG9zdEZpbGEgb2YgYXdhaXQgcmVhZFNjcm9sbEZpbGFzKFwianNvblwiKSlcblx0XHR7XG5cdFx0XHRjb25zdCBrZXkgPSBwYXJzZUludChwb3N0RmlsYS5uYW1lKSB8fCAwO1xuXHRcdFx0Y29uc3QgcG9zdEtleXMgPSBhd2FpdCByZWFkU2Nyb2xsUG9zdEtleXMoa2V5KTtcblx0XHRcdHNjcm9sbFBvc3RDb3VudHMuc2V0KGtleSwgcG9zdEtleXMubGVuZ3RoKTtcblx0XHR9XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRleHBvcnQgZnVuY3Rpb24gcmVhZFNjcm9sbFBvc3RDb3VudChzY3JvbGxLZXk6IG51bWJlcilcblx0e1xuXHRcdHJldHVybiBzY3JvbGxQb3N0Q291bnRzLmdldChzY3JvbGxLZXkpIHx8IDA7XG5cdH1cblx0XG5cdGNvbnN0IHNjcm9sbFBvc3RDb3VudHMgPSBuZXcgTWFwPG51bWJlciwgbnVtYmVyPigpO1xuXHRcblx0LyoqICovXG5cdGV4cG9ydCBhc3luYyBmdW5jdGlvbiB3cml0ZVNjcm9sbChkZWZhdWx0czogUGFydGlhbDxJU2Nyb2xsPilcblx0e1xuXHRcdGNvbnN0IHNjcm9sbDogSVNjcm9sbCA9IE9iamVjdC5hc3NpZ24oXG5cdFx0XHR7XG5cdFx0XHRcdGtleTogVXRpbC5nZXRTYWZlVGlja3MoKSxcblx0XHRcdFx0YW5jaG9ySW5kZXg6IDAsXG5cdFx0XHRcdGZlZWRzOiBbXVxuXHRcdFx0fSxcblx0XHRcdGRlZmF1bHRzXG5cdFx0KTtcblx0XHRcblx0XHRjb25zdCBkaXNrU2Nyb2xsOiBJRGlza1Njcm9sbCA9IHtcblx0XHRcdGFuY2hvckluZGV4OiBzY3JvbGwuYW5jaG9ySW5kZXgsXG5cdFx0XHRmZWVkczogc2Nyb2xsLmZlZWRzLm1hcChzID0+IHMua2V5KSxcblx0XHR9O1xuXHRcdFxuXHRcdGNvbnN0IGtleSA9IHNjcm9sbC5rZXk7XG5cdFx0Y29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KGRpc2tTY3JvbGwpO1xuXHRcdGNvbnN0IGZpbGEgPSBhd2FpdCBnZXRTY3JvbGxGaWxlKGtleSk7XG5cdFx0YXdhaXQgZmlsYS53cml0ZVRleHQoanNvbik7XG5cdFx0cmV0dXJuIHNjcm9sbDtcblx0fVxuXHRcblx0LyoqICovXG5cdGV4cG9ydCBhc3luYyBmdW5jdGlvbiB3cml0ZVNjcm9sbFBvc3Qoc2Nyb2xsS2V5OiBudW1iZXIsIHBvc3Q6IElQb3N0KVxuXHR7XG5cdFx0Y29uc3QgZmlsYSA9IGF3YWl0IGdldFNjcm9sbFBvc3RzRmlsZShzY3JvbGxLZXkpO1xuXHRcdGNvbnN0IGtleXMgPSBbcG9zdC5rZXldO1xuXHRcdGF3YWl0IGFwcGVuZEFycmF5RmlsZShmaWxhLCBrZXlzKTtcblx0XHRzY3JvbGxQb3N0Q291bnRzLnNldChzY3JvbGxLZXksIChzY3JvbGxQb3N0Q291bnRzLmdldChzY3JvbGxLZXkpIHx8IDApICsgMSk7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBSZWFkIHRoZSBzY3JvbGwgb2JqZWN0IGZyb20gdGhlIGZpbGUgc3lzdGVtIHdpdGggdGhlIHNwZWNpZmllZCBrZXkuXG5cdCAqIElmIHRoZSBhcmd1bWVudCBpcyBvbWl0dGVkLCB0aGUgZmlyc3QgZGlzY292ZXJlZCBzY3JvbGwgaXMgcmV0dXJuZWQuXG5cdCAqL1xuXHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVhZFNjcm9sbChrZXk/OiBudW1iZXIpXG5cdHtcblx0XHRpZiAoIWtleSlcblx0XHRcdGZvciAoY29uc3QgZmlsYSBvZiBhd2FpdCByZWFkU2Nyb2xsRmlsYXMoXCJqc29uXCIpKVxuXHRcdFx0XHRrZXkgPSBrZXlPZihmaWxhKTtcblx0XHRcblx0XHRpZiAoIWtleSlcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdFxuXHRcdGNvbnN0IGZpbGEgPSBhd2FpdCBnZXRTY3JvbGxGaWxlKGtleSk7XG5cdFx0aWYgKCFhd2FpdCBmaWxhLmV4aXN0cygpKVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XG5cdFx0Y29uc3QgZGlza1Njcm9sbEpzb24gPSBhd2FpdCBmaWxhLnJlYWRUZXh0KCk7XG5cdFx0Y29uc3QgZGlza1Njcm9sbDogSURpc2tTY3JvbGwgPSBKU09OLnBhcnNlKGRpc2tTY3JvbGxKc29uKTtcblx0XHRjb25zdCBmZWVkczogSUZlZWRbXSA9IFtdO1xuXHRcdFxuXHRcdGZvciAoY29uc3QgZmVlZEtleSBvZiBkaXNrU2Nyb2xsLmZlZWRzKVxuXHRcdHtcblx0XHRcdGNvbnN0IGZlZWQgPSBhd2FpdCByZWFkRmVlZChmZWVkS2V5KTtcblx0XHRcdGlmIChmZWVkKVxuXHRcdFx0XHRmZWVkcy5wdXNoKGZlZWQpO1xuXHRcdH1cblx0XHRcblx0XHRjb25zdCBzY3JvbGw6IElTY3JvbGwgPSB7XG5cdFx0XHRhbmNob3JJbmRleDogZGlza1Njcm9sbC5hbmNob3JJbmRleCxcblx0XHRcdGtleSxcblx0XHRcdGZlZWRzLFxuXHRcdH07XG5cdFx0XG5cdFx0cmV0dXJuIHNjcm9sbDtcblx0fVxuXHRcblx0LyoqICovXG5cdGV4cG9ydCBhc3luYyBmdW5jdGlvbiAqIHJlYWRTY3JvbGxzKClcblx0e1xuXHRcdGZvciAoY29uc3QgZmlsYSBvZiBhd2FpdCByZWFkU2Nyb2xsRmlsYXMoXCJqc29uXCIpKVxuXHRcdHtcblx0XHRcdGNvbnN0IGtleSA9IGtleU9mKGZpbGEpO1xuXHRcdFx0Y29uc3Qgc2Nyb2xsID0gYXdhaXQgcmVhZFNjcm9sbChrZXkpO1xuXHRcdFx0aWYgKHNjcm9sbClcblx0XHRcdFx0eWllbGQgc2Nyb2xsO1xuXHRcdH1cblx0fVxuXHRcblx0LyoqICovXG5cdGFzeW5jIGZ1bmN0aW9uIHJlYWRTY3JvbGxGaWxhcyh0eXBlOiBcImpzb25cIiB8IFwidHh0XCIpXG5cdHtcblx0XHRjb25zdCBmb2xkZXIgPSBhd2FpdCBnZXRTY3JvbGxGb2xkZXIoKTtcblx0XHRjb25zdCBmaWxhcyA9IGF3YWl0IGZvbGRlci5yZWFkRGlyZWN0b3J5KCk7XG5cdFx0Y29uc3QgcmVnID0gbmV3IFJlZ0V4cChcIl5bMC05XStcXFxcLlwiICsgdHlwZSArIFwiJFwiKTtcblx0XHRyZXR1cm4gZmlsYXMuZmlsdGVyKGYgPT4gcmVnLnRlc3QoZi5uYW1lKSk7XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVhZFNjcm9sbFBvc3Qoc2Nyb2xsS2V5OiBudW1iZXIsIGluZGV4OiBudW1iZXIpXG5cdHtcblx0XHRmb3IgYXdhaXQgKGNvbnN0IHBvc3Qgb2YgcmVhZFNjcm9sbFBvc3RzKHNjcm9sbEtleSwgeyBzdGFydDogaW5kZXgsIGxpbWl0OiAxIH0pKVxuXHRcdFx0cmV0dXJuIHBvc3Q7XG5cdFx0XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gKiByZWFkU2Nyb2xsUG9zdHMoc2Nyb2xsS2V5OiBudW1iZXIsIG9wdGlvbnM/OiBJUmVhZEFycmF5T3B0aW9ucylcblx0e1xuXHRcdGZvciAoY29uc3QgcG9zdEtleSBvZiBhd2FpdCByZWFkU2Nyb2xsUG9zdEtleXMoc2Nyb2xsS2V5LCBvcHRpb25zKSlcblx0XHR7XG5cdFx0XHRjb25zdCBwb3N0ID0gYXdhaXQgcmVhZFBvc3QocG9zdEtleSk7XG5cdFx0XHRpZiAocG9zdClcblx0XHRcdFx0eWllbGQgcG9zdDtcblx0XHR9XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRhc3luYyBmdW5jdGlvbiByZWFkU2Nyb2xsUG9zdEtleXMoc2Nyb2xsS2V5OiBudW1iZXIsIG9wdGlvbnM/OiBJUmVhZEFycmF5T3B0aW9ucylcblx0e1xuXHRcdGNvbnN0IGZpbGEgPSBhd2FpdCBnZXRTY3JvbGxQb3N0c0ZpbGUoc2Nyb2xsS2V5KTtcblx0XHRjb25zdCBwb3N0S2V5cyA9IGF3YWl0IHJlYWRBcnJheUZpbGUoZmlsYSwgb3B0aW9ucyk7XG5cdFx0cmV0dXJuIHBvc3RLZXlzO1xuXHR9XG5cdFxuXHQvKiogKi9cblx0YXN5bmMgZnVuY3Rpb24gZ2V0U2Nyb2xsRm9sZGVyKClcblx0e1xuXHRcdGNvbnN0IGZpbGEgPSBhd2FpdCBVdGlsLmdldERhdGFGb2xkZXIoKTtcblx0XHRyZXR1cm4gZmlsYS5kb3duKFwic2Nyb2xsc1wiKTtcblx0fVxuXHRcblx0LyoqICovXG5cdGFzeW5jIGZ1bmN0aW9uIGdldFNjcm9sbEZpbGUoa2V5OiBudW1iZXIpXG5cdHtcblx0XHRyZXR1cm4gKGF3YWl0IGdldFNjcm9sbEZvbGRlcigpKS5kb3duKGtleSArIFwiLmpzb25cIik7XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRhc3luYyBmdW5jdGlvbiBnZXRTY3JvbGxQb3N0c0ZpbGUoa2V5OiBudW1iZXIpXG5cdHtcblx0XHRyZXR1cm4gKGF3YWl0IGdldFNjcm9sbEZvbGRlcigpKS5kb3duKGtleSArIFwiLnR4dFwiKTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgSUZlZWQgb2JqZWN0IHRvIGRpc2ssIG9wdGlvbmFsbHkgcG9wdWxhdGVkIHdpdGggdGhlXG5cdCAqIHNwZWNpZmllZCB2YWx1ZXMsIHdyaXRlcyBpdCB0byBkaXNrLCBhbmQgcmV0dXJucyB0aGUgY29uc3RydWN0ZWQgb2JqZWN0LlxuXHQgKi9cblx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdyaXRlRmVlZCguLi5kZWZhdWx0czogUGFydGlhbDxJRmVlZD5bXSlcblx0e1xuXHRcdGNvbnN0IGtleSA9ICBVdGlsLmdldFNhZmVUaWNrcygpO1xuXHRcdGNvbnN0IGZlZWQ6IElGZWVkID0gT2JqZWN0LmFzc2lnbihcblx0XHRcdHtcblx0XHRcdFx0a2V5LFxuXHRcdFx0XHR1cmw6IFwiXCIsXG5cdFx0XHRcdGljb246IFwiXCIsXG5cdFx0XHRcdGF1dGhvcjogXCJcIixcblx0XHRcdFx0ZGVzY3JpcHRpb246IFwiXCIsXG5cdFx0XHRcdHNpemU6IDAsXG5cdFx0XHR9LFxuXHRcdFx0Li4uZGVmYXVsdHMpO1xuXHRcdFxuXHRcdGNvbnN0IGRpc2tGZWVkID0gT2JqZWN0LmFzc2lnbih7fSwgZmVlZCkgYXMgSURpc2tGZWVkO1xuXHRcdGRlbGV0ZSAoZGlza0ZlZWQgYXMgYW55KS5rZXk7XG5cdFx0Y29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KGRpc2tGZWVkKTtcblx0XHRjb25zdCBmaWxhID0gYXdhaXQgZ2V0RmVlZEZpbGUoa2V5KTtcblx0XHRhd2FpdCBmaWxhLndyaXRlVGV4dChqc29uKTtcblx0XHRyZXR1cm4gZmVlZDtcblx0fVxuXHRcblx0LyoqICovXG5cdGFzeW5jIGZ1bmN0aW9uIHdyaXRlRmVlZFBvc3QoZmVlZEtleTogbnVtYmVyLCBwb3N0S2V5czogbnVtYmVyW10pXG5cdHtcblx0XHRjb25zdCBmaWxhID0gYXdhaXQgZ2V0RmVlZFBvc3RzRmlsZShmZWVkS2V5KTtcblx0XHRhd2FpdCBhcHBlbmRBcnJheUZpbGUoZmlsYSwgcG9zdEtleXMpO1xuXHR9XG5cdFxuXHQvKipcblx0ICogXG5cdCAqL1xuXHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVhZEZlZWQoa2V5OiBudW1iZXIpXG5cdHtcblx0XHRsZXQgZmlsYSA9IGF3YWl0IGdldEZlZWRGaWxlKGtleSk7XG5cdFx0aWYgKCFhd2FpdCBmaWxhLmV4aXN0cygpKVxuXHRcdHtcblx0XHRcdGZpbGEgPSBhd2FpdCBnZXRGZWVkRmlsZUFyY2hpdmVkKGtleSk7XG5cdFx0XHRpZiAoIWF3YWl0IGZpbGEuZXhpc3RzKCkpXG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0XHRcblx0XHRjb25zdCBqc29uVGV4dCA9IGF3YWl0IGZpbGEucmVhZFRleHQoKTtcblx0XHRjb25zdCBmZWVkOiBJRmVlZCA9IEpTT04ucGFyc2UoanNvblRleHQpO1xuXHRcdGZlZWQua2V5ID0ga2V5O1xuXHRcdHJldHVybiBmZWVkO1xuXHR9XG5cdFxuXHQvKipcblx0ICogUmVhZHMgYWxsIG5vbi1hcmNoaXZlZCBmZWVkcyBmcm9tIHRoZSBmaWxlIHN5c3RlbS5cblx0ICovXG5cdGV4cG9ydCBhc3luYyBmdW5jdGlvbiAqIHJlYWRGZWVkcygpXG5cdHtcblx0XHRjb25zdCBmb2xkZXIgPSAoYXdhaXQgZ2V0RmVlZEZpbGUoMCkpLnVwKCk7XG5cdFx0Y29uc3QgZmlsZXMgPSBhd2FpdCBmb2xkZXIucmVhZERpcmVjdG9yeSgpO1xuXHRcdFxuXHRcdGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcylcblx0XHR7XG5cdFx0XHRpZiAoZmlsZS5leHRlbnNpb24gIT09IFwiLmpzb25cIilcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcblx0XHRcdGNvbnN0IGtleSA9IGtleU9mKGZpbGUpO1xuXHRcdFx0Y29uc3QgZmVlZCA9IGF3YWl0IHJlYWRGZWVkKGtleSk7XG5cdFx0XHRpZiAoZmVlZClcblx0XHRcdFx0eWllbGQgZmVlZDtcblx0XHR9XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gKiByZWFkRmVlZFBvc3RzKGZlZWRLZXk6IG51bWJlcilcblx0e1xuXHRcdGZvciAoY29uc3QgcG9zdEtleSBvZiBhd2FpdCByZWFkRmVlZFBvc3RLZXlzKGZlZWRLZXkpKVxuXHRcdHtcblx0XHRcdGNvbnN0IHBvc3QgPSBhd2FpdCByZWFkUG9zdChwb3N0S2V5KTtcblx0XHRcdGlmIChwb3N0KVxuXHRcdFx0XHR5aWVsZCBwb3N0O1xuXHRcdH1cblx0fVxuXHRcblx0LyoqICovXG5cdGFzeW5jIGZ1bmN0aW9uIHJlYWRGZWVkUG9zdEtleXMoZmVlZEtleTogbnVtYmVyKVxuXHR7XG5cdFx0Y29uc3QgZmlsYSA9IGF3YWl0IGdldEZlZWRQb3N0c0ZpbGUoZmVlZEtleSk7XG5cdFx0Y29uc3QgcG9zdEtleXMgPSBhd2FpdCByZWFkQXJyYXlGaWxlKGZpbGEpO1xuXHRcdHJldHVybiBwb3N0S2V5cztcblx0fVxuXHRcblx0LyoqXG5cdCAqIE1vdmVzIHRoZSBmZWVkIGZpbGUgdG8gdGhlIGFyY2hpdmUgKHdoaWNoIGlzIHRoZSB1bmZvbGxvdyBvcGVyYXRpb24pLlxuXHQgKi9cblx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFyY2hpdmVGZWVkKGZlZWRLZXk6IG51bWJlcilcblx0e1xuXHRcdGNvbnN0IHNyYyA9IGF3YWl0IGdldEZlZWRGaWxlKGZlZWRLZXkpO1xuXHRcdGNvbnN0IGpzb24gPSBhd2FpdCBzcmMucmVhZFRleHQoKTtcblx0XHRjb25zdCBkc3QgPSBhd2FpdCBnZXRGZWVkRmlsZUFyY2hpdmVkKGZlZWRLZXkpO1xuXHRcdGRzdC53cml0ZVRleHQoanNvbik7XG5cdFx0c3JjLmRlbGV0ZSgpO1xuXHRcdFxuXHRcdC8vIFJlbW92ZSB0aGUgZmVlZCBmcm9tIGFueSBzY3JvbGwgZmlsZXMuXG5cdFx0Zm9yIChjb25zdCBmaWxhIG9mIGF3YWl0IHJlYWRTY3JvbGxGaWxhcyhcImpzb25cIikpXG5cdFx0e1xuXHRcdFx0Y29uc3QgZGlza1Njcm9sbEpzb24gPSBhd2FpdCBmaWxhLnJlYWRUZXh0KCk7XG5cdFx0XHRjb25zdCBkaXNrU2Nyb2xsOiBJRGlza1Njcm9sbCA9IEpTT04ucGFyc2UoZGlza1Njcm9sbEpzb24pO1xuXHRcdFx0XG5cdFx0XHRmb3IgKGxldCBpID0gZGlza1Njcm9sbC5mZWVkcy5sZW5ndGg7IGktLSA+IDA7KVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCBrZXkgPSBkaXNrU2Nyb2xsLmZlZWRzW2ldO1xuXHRcdFx0XHRpZiAoa2V5ID09PSBmZWVkS2V5KVxuXHRcdFx0XHRcdGRpc2tTY3JvbGwuZmVlZHMuc3BsaWNlKGksIDEpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRjb25zdCBkaXNrU2Nyb2xsSnNvbk5ldyA9IEpTT04uc3RyaW5naWZ5KGRpc2tTY3JvbGwpO1xuXHRcdFx0ZmlsYS53cml0ZVRleHQoZGlza1Njcm9sbEpzb25OZXcpO1xuXHRcdH1cblx0fVxuXHRcblx0LyoqICovXG5cdGFzeW5jIGZ1bmN0aW9uIGdldEZlZWRzRm9sZGVyKClcblx0e1xuXHRcdGNvbnN0IGZpbGEgPSBhd2FpdCBVdGlsLmdldERhdGFGb2xkZXIoKTtcblx0XHRyZXR1cm4gZmlsYS5kb3duKFwiZmVlZHNcIik7XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRhc3luYyBmdW5jdGlvbiBnZXRGZWVkRmlsZShrZXk6IG51bWJlcilcblx0e1xuXHRcdHJldHVybiAoYXdhaXQgZ2V0RmVlZHNGb2xkZXIoKSkuZG93bihrZXkgKyBcIi5qc29uXCIpO1xuXHR9XG5cdFxuXHQvKiogKi9cblx0YXN5bmMgZnVuY3Rpb24gZ2V0RmVlZFBvc3RzRmlsZShrZXk6IG51bWJlcilcblx0e1xuXHRcdHJldHVybiAoYXdhaXQgZ2V0RmVlZHNGb2xkZXIoKSkuZG93bihrZXkgKyBcIi50eHRcIik7XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRhc3luYyBmdW5jdGlvbiBnZXRGZWVkRmlsZUFyY2hpdmVkKGtleTogbnVtYmVyKVxuXHR7XG5cdFx0Y29uc3QgZmlsYSA9IGF3YWl0IFV0aWwuZ2V0RGF0YUZvbGRlcigpO1xuXHRcdHJldHVybiBmaWxhLmRvd24oXCJmZWVkcy1hcmNoaXZlZFwiKS5kb3duKGtleSArIFwiLmpzb25cIik7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBXcml0ZXMgdGhlIFVSTHMgY29udGFpbmVkIGluIHRoZSBzcGVjaWZpZWQgdG8gdGhlIGZpbGUgc3lzdGVtLCBpbiB0aGVpciBmdWxsLXF1YWxpZmllZFxuXHQgKiBmb3JtLCBhbmQgcmV0dXJucyBhbiBvYmplY3QgdGhhdCBpbmRpY2F0ZXMgd2hhdCBVUkxzIHdoZXJlIGFkZGVkIGFuZCB3aGljaCBvbmVzXG5cdCAqIHdlcmUgcmVtb3ZlZCBmcm9tIHRoZSBwcmV2aW91cyB0aW1lIHRoYXQgdGhpcyBmdW5jdGlvbiB3YXMgY2FsbGVkLlxuXHQgKiBcblx0ICogV29ydGggbm90aW5nIHRoYXQgdGhlIFVSTHMgYXJlIGV4cGVjdGVkIHRvIGJlIGluIHRoZWlyIGZ1bGx5LXF1YWxpZmllZCBmb3JtLFxuXHQgKiB3aGljaCBpcyBkaWZmZXJlbnQgZnJvbSBob3cgdGhlIFVSTHMgYXJlIHR5cGljYWxseSB3cml0dGVuIGluIHRoZSBmZWVkIHRleHQgZmlsZS5cblx0ICovXG5cdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBjYXB0dXJlUmF3RmVlZChmZWVkOiBJRmVlZCwgdXJsczogc3RyaW5nW10pXG5cdHtcblx0XHRpZiAoIWZlZWQua2V5KVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGNhcHR1cmUgdGhpcyBmZWVkIGJlY2F1c2UgaXQgaGFzIG5vIGtleS5cIik7XG5cdFx0XG5cdFx0Y29uc3QgYWRkZWQ6IHN0cmluZ1tdID0gW107XG5cdFx0Y29uc3QgcmVtb3ZlZDogc3RyaW5nW10gPSBbXTtcblx0XHRjb25zdCBmaWxhUmF3ID0gKGF3YWl0IGdldEZlZWRzUmF3Rm9sZGVyKCkpLmRvd24oZmVlZC5rZXkgKyBcIi50eHRcIik7XG5cdFx0XG5cdFx0aWYgKGF3YWl0IGZpbGFSYXcuZXhpc3RzKCkpXG5cdFx0e1xuXHRcdFx0Y29uc3QgcmF3VGV4dCA9IGF3YWl0IGZpbGFSYXcucmVhZFRleHQoKTtcblx0XHRcdGNvbnN0IHJhd0xpbmVzID0gcmF3VGV4dC5zcGxpdChcIlxcblwiKTtcblx0XHRcdGNvbnN0IHJhd0xpbmVzU2V0ID0gbmV3IFNldChyYXdMaW5lcyk7XG5cdFx0XHRjb25zdCB1cmxzU2V0ID0gbmV3IFNldCh1cmxzKTtcblx0XHRcdFxuXHRcdFx0Zm9yIChjb25zdCB1cmwgb2YgcmF3TGluZXMpXG5cdFx0XHRcdGlmICghdXJsc1NldC5oYXModXJsKSlcblx0XHRcdFx0XHRyZW1vdmVkLnB1c2godXJsKTtcblx0XHRcdFxuXHRcdFx0Zm9yIChjb25zdCB1cmwgb2YgdXJscylcblx0XHRcdFx0aWYgKCFyYXdMaW5lc1NldC5oYXModXJsKSlcblx0XHRcdFx0XHRhZGRlZC5wdXNoKHVybCk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRhZGRlZC5wdXNoKC4uLnVybHMpO1xuXHRcdH1cblx0XHRcblx0XHRjb25zdCB0ZXh0ID0gdXJscy5qb2luKFwiXFxuXCIpO1xuXHRcdGF3YWl0IGZpbGFSYXcud3JpdGVUZXh0KHRleHQpO1xuXHRcdFxuXHRcdHJldHVybiB7IGFkZGVkLCByZW1vdmVkIH07XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRhc3luYyBmdW5jdGlvbiBnZXRGZWVkc1Jhd0ZvbGRlcigpXG5cdHtcblx0XHRjb25zdCBmaWxhID0gYXdhaXQgVXRpbC5nZXREYXRhRm9sZGVyKCk7XG5cdFx0cmV0dXJuIGZpbGEuZG93bihcImZlZWRzLXJhd1wiKTtcblx0fVxuXHRcblx0LyoqICovXG5cdGV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWFkUG9zdChrZXk6IG51bWJlcilcblx0e1xuXHRcdGNvbnN0IHBvc3RzRmlsZSA9IGF3YWl0IGdldFBvc3RzRmlsZShrZXkpO1xuXHRcdGNvbnN0IHBvc3RzT2JqZWN0ID0gYXdhaXQgcmVhZFBvc3RzRmlsZShwb3N0c0ZpbGUpO1xuXHRcdGNvbnN0IGRpc2tQb3N0OiBJRGlza1Bvc3QgPSBwb3N0c09iamVjdFtrZXldO1xuXHRcdGlmICghZGlza1Bvc3QpXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcblx0XHRjb25zdCBmZWVkID0gYXdhaXQgcmVhZEZlZWQoZGlza1Bvc3QuZmVlZCk7XG5cdFx0aWYgKCFmZWVkKVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XG5cdFx0cmV0dXJuIDxJUG9zdD57XG5cdFx0XHRrZXksXG5cdFx0XHRmZWVkLFxuXHRcdFx0dmlzaXRlZDogZGlza1Bvc3QudmlzaXRlZCxcblx0XHRcdHBhdGg6IGRpc2tQb3N0LnBhdGgsXG5cdFx0fTtcblx0fVxuXHRcblx0LyoqICovXG5cdGV4cG9ydCBhc3luYyBmdW5jdGlvbiB3cml0ZVBvc3QocG9zdDogUGFydGlhbDxJUG9zdD4pXG5cdHtcblx0XHRpZiAoIXBvc3Qua2V5KVxuXHRcdFx0cG9zdC5rZXkgPSBVdGlsLmdldFNhZmVUaWNrcygpO1xuXHRcdFxuXHRcdGNvbnN0IGZ1bGxQb3N0ID0gcG9zdCBhcyBJUG9zdDtcblx0XHRcblx0XHRjb25zdCBkaXNrUG9zdDogSURpc2tQb3N0ID0ge1xuXHRcdFx0dmlzaXRlZDogZnVsbFBvc3QudmlzaXRlZCB8fCBmYWxzZSxcblx0XHRcdGZlZWQ6IGZ1bGxQb3N0LmZlZWQ/LmtleSB8fCAwLFxuXHRcdFx0cGF0aDogZnVsbFBvc3QucGF0aCB8fCBcIlwiXG5cdFx0fTtcblx0XHRcblx0XHRpZiAoIWRpc2tQb3N0LnBhdGgpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJQb3N0IGhhcyBubyAucGF0aCBwcm9wZXJ0eS5cIik7XG5cdFx0XG5cdFx0Y29uc3QgcG9zdHNGaWxlID0gYXdhaXQgZ2V0UG9zdHNGaWxlKHBvc3Qua2V5KTtcblx0XHRjb25zdCBwb3N0c09iamVjdCA9IGF3YWl0IHJlYWRQb3N0c0ZpbGUocG9zdHNGaWxlKTtcblx0XHRcblx0XHQvLyBUaGlzIG1heSBlaXRoZXIgb3ZlcnJpZGUgdGhlIHBvc3QgYXQgdGhlIGV4aXN0aW5nIGtleSxcblx0XHQvLyBvciBhc3NpZ24gYSBuZXcgcG9zdCBhdCB0aGUgbmV3IGtleS5cblx0XHRwb3N0c09iamVjdFtwb3N0LmtleV0gPSBkaXNrUG9zdDtcblx0XHRcblx0XHRjb25zdCBwb3N0c09iamVjdEpzb25UZXh0ID0gSlNPTi5zdHJpbmdpZnkocG9zdHNPYmplY3QpO1xuXHRcdGF3YWl0IHBvc3RzRmlsZS53cml0ZVRleHQocG9zdHNPYmplY3RKc29uVGV4dCk7XG5cdFx0XG5cdFx0Ly8gQWRkIHRoZSBwb3N0IHRvIHRoZSBmZWVkXG5cdFx0YXdhaXQgd3JpdGVGZWVkUG9zdChkaXNrUG9zdC5mZWVkLCBbcG9zdC5rZXldKTtcblx0XHRcblx0XHRyZXR1cm4gZnVsbFBvc3Q7XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBSZWFkcyB0aGUgY29udGVudHMgb2YgYSBKU09OIGZpbGUgdGhhdCBjb250YWlucyBtdWx0aXBsZSBwb3N0cy5cblx0ICovXG5cdGFzeW5jIGZ1bmN0aW9uIHJlYWRQb3N0c0ZpbGUocG9zdHNGaWxhOiBGaWxhKVxuXHR7XG5cdFx0aWYgKCFhd2FpdCBwb3N0c0ZpbGEuZXhpc3RzKCkpXG5cdFx0XHRyZXR1cm4ge307XG5cdFx0XG5cdFx0Y29uc3QgcG9zdHNKc29uID0gYXdhaXQgcG9zdHNGaWxhLnJlYWRUZXh0KCk7XG5cdFx0Y29uc3QgcG9zdHNPYmplY3QgPSBVdGlsLnRyeVBhcnNlSnNvbihwb3N0c0pzb24pIGFzIElQb3N0RmlsZTtcblx0XHRyZXR1cm4gcG9zdHNPYmplY3Q7XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRhc3luYyBmdW5jdGlvbiBnZXRQb3N0c0ZvbGRlcigpXG5cdHtcblx0XHRjb25zdCBmaWxhID0gYXdhaXQgVXRpbC5nZXREYXRhRm9sZGVyKCk7XG5cdFx0cmV0dXJuIGZpbGEuZG93bihcInBvc3RzXCIpO1xuXHR9XG5cdFxuXHQvKiogKi9cblx0YXN5bmMgZnVuY3Rpb24gZ2V0UG9zdHNGaWxlKGtleTogbnVtYmVyKVxuXHR7XG5cdFx0Y29uc3QgZGF0ZSA9IG5ldyBEYXRlKGtleSk7XG5cdFx0Y29uc3QgeSA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcblx0XHRjb25zdCBtID0gKFwiMFwiICsgKGRhdGUuZ2V0TW9udGgoKSArIDEpKS5zbGljZSgtMik7XG5cdFx0Y29uc3QgZCA9IChcIjBcIiArIGRhdGUuZ2V0RGF0ZSgpKS5zbGljZSgtMik7XG5cdFx0Y29uc3QgcG9zdHNGaWxlTmFtZSA9IFt5LCBtLCBkXS5qb2luKFwiLVwiKSArIFwiLmpzb25cIjtcblx0XHRyZXR1cm4gKGF3YWl0IGdldFBvc3RzRm9sZGVyKCkpLmRvd24ocG9zdHNGaWxlTmFtZSk7XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRmdW5jdGlvbiBrZXlPZihmaWxhOiBGaWxhKVxuXHR7XG5cdFx0cmV0dXJuIE51bWJlcihmaWxhLm5hbWUuc3BsaXQoXCIuXCIpWzBdKSB8fCAwO1xuXHR9XG5cdFxuXHQvKiogKi9cblx0YXN5bmMgZnVuY3Rpb24gcmVhZEFycmF5RmlsZShmaWxhOiBGaWxhLCBvcHRpb25zPzogSVJlYWRBcnJheU9wdGlvbnMpXG5cdHtcblx0XHRpZiAoIWF3YWl0IGZpbGEuZXhpc3RzKCkpXG5cdFx0XHRyZXR1cm4gW107XG5cdFx0XG5cdFx0Y29uc3QgdGV4dCA9IGF3YWl0IGZpbGEucmVhZFRleHQoKTtcblx0XHRjb25zdCBudW1iZXJzOiBudW1iZXJbXSA9IFtdO1xuXHRcdGxldCBsaW5lcyA9IHRleHQuc3BsaXQoXCJcXG5cIik7XG5cdFx0XG5cdFx0Y29uc3Qgc3RhcnQgPSBvcHRpb25zPy5zdGFydCB8fCAwO1xuXHRcdGxpbmVzID0gbGluZXMuc2xpY2Uoc3RhcnQpO1xuXHRcdGxpbmVzID0gbGluZXMuc2xpY2UoMCwgb3B0aW9ucz8ubGltaXQpO1xuXHRcdFxuXHRcdGZvciAoY29uc3QgbGluZSBvZiBsaW5lcylcblx0XHR7XG5cdFx0XHRjb25zdCBuID0gTnVtYmVyKGxpbmUpIHx8IDA7XG5cdFx0XHRpZiAobiA+IDApXG5cdFx0XHRcdG51bWJlcnMucHVzaChuKTtcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIG51bWJlcnM7XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRhc3luYyBmdW5jdGlvbiBhcHBlbmRBcnJheUZpbGUoZmlsYTogRmlsYSwga2V5czogbnVtYmVyW10pXG5cdHtcblx0XHRjb25zdCB0ZXh0ID0ga2V5cy5tYXAoayA9PiBrICsgXCJcXG5cIikuam9pbihcIlwiKTtcblx0XHRhd2FpdCBmaWxhLndyaXRlVGV4dCh0ZXh0LCB7IGFwcGVuZDogdHJ1ZSB9KTtcblx0fVxuXHRcblx0LyoqXG5cdCAqIERlbGV0ZXMgYWxsIGRhdGEgaW4gdGhlIGRhdGEgZm9sZGVyLlxuXHQgKiBJbnRlbmRlZCBvbmx5IGZvciBkZWJ1Z2dpbmcgcHVycG9zZXMuXG5cdCAqL1xuXHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xlYXIoKVxuXHR7XG5cdFx0Y29uc3Qgc2Nyb2xsRm9sZGVyID0gYXdhaXQgZ2V0U2Nyb2xsRm9sZGVyKCk7XG5cdFx0Y29uc3QgZmVlZEZvbGRlciA9IGF3YWl0IGdldEZlZWRzRm9sZGVyKCk7XG5cdFx0Y29uc3QgZmVlZFJhd0ZvbGRlciA9IGF3YWl0IGdldEZlZWRzUmF3Rm9sZGVyKCk7XG5cdFx0Y29uc3QgcG9zdHNGb2xkZXIgPSBhd2FpdCBnZXRQb3N0c0ZvbGRlcigpO1xuXHRcdGNvbnN0IGFsbDogRmlsYVtdID0gW107XG5cdFx0XG5cdFx0aWYgKGF3YWl0IHNjcm9sbEZvbGRlci5leGlzdHMoKSlcblx0XHRcdGFsbC5wdXNoKC4uLmF3YWl0IHNjcm9sbEZvbGRlci5yZWFkRGlyZWN0b3J5KCkpO1xuXHRcdFxuXHRcdGlmIChhd2FpdCBmZWVkRm9sZGVyLmV4aXN0cygpKVxuXHRcdFx0YWxsLnB1c2goLi4uYXdhaXQgZmVlZEZvbGRlci5yZWFkRGlyZWN0b3J5KCkpO1xuXHRcdFxuXHRcdGlmIChhd2FpdCBmZWVkUmF3Rm9sZGVyLmV4aXN0cygpKVxuXHRcdFx0YWxsLnB1c2goLi4uYXdhaXQgZmVlZFJhd0ZvbGRlci5yZWFkRGlyZWN0b3J5KCkpO1xuXHRcdFxuXHRcdGlmIChhd2FpdCBwb3N0c0ZvbGRlci5leGlzdHMoKSlcblx0XHRcdGFsbC5wdXNoKC4uLmF3YWl0IHBvc3RzRm9sZGVyLnJlYWREaXJlY3RvcnkoKSk7XG5cdFx0XG5cdFx0YXdhaXQgUHJvbWlzZS5hbGwoYWxsLm1hcChmaWxhID0+IGZpbGEuZGVsZXRlKCkpKTtcblx0fVxufVxuIiwiXG5uYW1lc3BhY2UgU3F1YXJlc1xue1xuXHQvKipcblx0ICogSW5pdGlhbGl6ZXMgdGhlIGFwcCB3aXRoIGEgbGlzdCBvZiBkZWZhdWx0IGZlZWRzLCBhbmQgcG9wdWxhdGVzXG5cdCAqIGEgc2luZ2xlIHNjcm9sbCB3aXRoIHRoZSBjb250ZW50IGNvbnRhaW5lZCB3aXRoaW4gdGhvc2UgZmVlZHMuXG5cdCAqL1xuXHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gcnVuRGF0YUluaXRpYWxpemVyKGRlZmF1bHRGZWVkVXJsczogc3RyaW5nW10pXG5cdHtcblx0XHRjb25zdCBmZWVkczogSUZlZWRbXSA9IFtdO1xuXHRcdGNvbnN0IHVybExpc3RzOiBzdHJpbmdbXVtdID0gW107XG5cdFx0XG5cdFx0Zm9yIChjb25zdCB1cmwgb2YgZGVmYXVsdEZlZWRVcmxzKVxuXHRcdHtcblx0XHRcdGNvbnN0IHVybHMgPSBhd2FpdCBXZWJmZWVkLmdldEZlZWRVcmxzKHVybCk7XG5cdFx0XHRpZiAoIXVybHMpXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XG5cdFx0XHRjb25zdCBjaGVja3N1bSA9IGF3YWl0IFV0aWwuZ2V0RmVlZENoZWNrc3VtKHVybCk7XG5cdFx0XHRpZiAoIWNoZWNrc3VtKVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFxuXHRcdFx0dXJsTGlzdHMucHVzaCh1cmxzKTtcblx0XHRcdFxuXHRcdFx0Y29uc3QgZmVlZE1ldGEgPSBhd2FpdCBXZWJmZWVkLmdldEZlZWRNZXRhRGF0YSh1cmwpO1xuXHRcdFx0Y29uc3QgZmVlZCA9IGF3YWl0IERhdGEud3JpdGVGZWVkKGZlZWRNZXRhLCB7IGNoZWNrc3VtIH0pO1xuXHRcdFx0YXdhaXQgRGF0YS5jYXB0dXJlUmF3RmVlZChmZWVkLCB1cmxzKTtcblx0XHRcdGZlZWRzLnB1c2goZmVlZCk7XG5cdFx0fVxuXHRcdFxuXHRcdGNvbnN0IHNjcm9sbCA9IGF3YWl0IERhdGEud3JpdGVTY3JvbGwoeyBmZWVkcyB9KTtcblx0XHRjb25zdCBtYXhMZW5ndGggPSB1cmxMaXN0cy5yZWR1Y2UoKGEsIGIpID0+IGEgPiBiLmxlbmd0aCA/IGEgOiBiLmxlbmd0aCwgMCk7XG5cdFx0XG5cdFx0Zm9yIChsZXQgaSA9IC0xOyArK2kgPCBtYXhMZW5ndGggKiB1cmxMaXN0cy5sZW5ndGg7KVxuXHRcdHtcblx0XHRcdGNvbnN0IGluZGV4T2ZMaXN0ID0gaSAlIHVybExpc3RzLmxlbmd0aDtcblx0XHRcdGNvbnN0IHVybExpc3QgPSB1cmxMaXN0c1tpbmRleE9mTGlzdF07XG5cdFx0XHRjb25zdCBpbmRleFdpdGhpbkxpc3QgPSBNYXRoLmZsb29yKGkgLyB1cmxMaXN0cy5sZW5ndGgpO1xuXHRcdFx0XG5cdFx0XHRpZiAodXJsTGlzdC5sZW5ndGggPD0gaW5kZXhXaXRoaW5MaXN0KVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFxuXHRcdFx0Y29uc3QgZmVlZCA9IGZlZWRzW2luZGV4T2ZMaXN0XTtcblx0XHRcdGNvbnN0IGZlZWREaXJlY3RvcnkgPSBXZWJmZWVkLlVybC5mb2xkZXJPZihmZWVkLnVybCk7XG5cdFx0XHRjb25zdCBwYXRoID0gdXJsTGlzdFtpbmRleFdpdGhpbkxpc3RdLnNsaWNlKGZlZWREaXJlY3RvcnkubGVuZ3RoKTtcblx0XHRcdGNvbnN0IHBvc3QgPSBhd2FpdCBEYXRhLndyaXRlUG9zdCh7IGZlZWQsIHBhdGggfSk7XG5cdFx0XHRhd2FpdCBEYXRhLndyaXRlU2Nyb2xsUG9zdChzY3JvbGwua2V5LCBwb3N0KTtcblx0XHR9XG5cdH1cbn1cbiIsIlxubmFtZXNwYWNlIFNxdWFyZXNcbntcblx0LyoqXG5cdCAqIEEgbmFtZXNwYWNlIG9mIGZ1bmN0aW9ucyB3aGljaCBhcmUgc2hhcmVkIGJldHdlZW5cblx0ICogdGhlIEZvcmVncm91bmRGZXRjaGVyIGFuZCB0aGUgQmFja2dyb3VuZEZldGNoZXIuXG5cdCAqL1xuXHRleHBvcnQgbmFtZXNwYWNlIEZldGNoZXJcblx0e1xuXHRcdC8qKlxuXHRcdCAqIFxuXHRcdCAqL1xuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVNb2RpZmllZEZlZWRzKG1vZGlmaWVkRmVlZHM6IElGZWVkW10pXG5cdFx0e1xuXHRcdFx0Y29uc3Qgc2Nyb2xsID0gYXdhaXQgRGF0YS5yZWFkU2Nyb2xsKCk7XG5cdFx0XHRcblx0XHRcdGZvciAoY29uc3QgZmVlZCBvZiBtb2RpZmllZEZlZWRzKVxuXHRcdFx0e1xuXHRcdFx0XHRXZWJmZWVkLmdldEZlZWRVcmxzKGZlZWQudXJsKS50aGVuKGFzeW5jIHVybHMgPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmICghdXJscylcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRjb25zdCBmZWVkVXJsRm9sZGVyID0gV2ViZmVlZC5VcmwuZm9sZGVyT2YoZmVlZC51cmwpO1xuXHRcdFx0XHRcdGNvbnN0IHsgYWRkZWQsIHJlbW92ZWQgfSA9IGF3YWl0IERhdGEuY2FwdHVyZVJhd0ZlZWQoZmVlZCwgdXJscyk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Zm9yIChjb25zdCB1cmwgb2YgYWRkZWQpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgcGF0aCA9IHVybC5zbGljZShmZWVkVXJsRm9sZGVyLmxlbmd0aCk7XG5cdFx0XHRcdFx0XHRjb25zdCBwb3N0ID0gYXdhaXQgRGF0YS53cml0ZVBvc3QoeyBmZWVkLCBwYXRoIH0pO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRpZiAoc2Nyb2xsKVxuXHRcdFx0XHRcdFx0XHREYXRhLndyaXRlU2Nyb2xsUG9zdChzY3JvbGwua2V5LCBwb3N0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuIiwiXG5uYW1lc3BhY2UgU3F1YXJlc1xue1xuXHQvKiogKi9cblx0ZXhwb3J0IGNsYXNzIEZvcmVncm91bmRGZXRjaGVyXG5cdHtcblx0XHQvKiogKi9cblx0XHRjb25zdHJ1Y3RvcigpIHsgfVxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIEdldHMgd2hldGhlciB0aGVyZSBpcyBhIGZldGNoIG9wZXJhdGlvbiBiZWluZyBjYXJyaWVkIG91dC5cblx0XHQgKi9cblx0XHRnZXQgaXNGZXRjaGluZygpXG5cdFx0e1xuXHRcdFx0cmV0dXJuICEhdGhpcy5mZWVkSXRlcmF0b3I7XG5cdFx0fVxuXHRcdHByaXZhdGUgZmVlZEl0ZXJhdG9yOiBBc3luY0dlbmVyYXRvcjxJRmVlZCwgdm9pZCwgdW5rbm93bj4gfCBudWxsID0gbnVsbDtcblx0XHRcblx0XHQvKiogKi9cblx0XHRhc3luYyBmZXRjaCgpXG5cdFx0e1xuXHRcdFx0dGhpcy5zdG9wRmV0Y2goKTtcblx0XHRcdHRoaXMuZmVlZEl0ZXJhdG9yID0gRGF0YS5yZWFkRmVlZHMoKTtcblx0XHRcdGNvbnN0IHRocmVhZHM6IFByb21pc2U8dm9pZD5bXSA9IFtdO1xuXHRcdFx0Y29uc3QgbW9kaWZpZWRGZWVkczogSUZlZWRbXSA9IFtdO1xuXHRcdFx0XG5cdFx0XHRmb3IgKGxldCBpID0gLTE7ICsraSA8IG1heEZldGNoVGhyZWFkczspXG5cdFx0XHR7XG5cdFx0XHRcdC8vIENyZWF0ZXMgYSBcInRocmVhZFwiIHRoYXQgYXR0ZW1wdHMgdG8gcGluZ1xuXHRcdFx0XHQvLyB0aGUgVVJMIG9mIHRoZSBuZXh0IGZlZWQgaW4gdGhlIGxpbmUuXG5cdFx0XHRcdHRocmVhZHMucHVzaChuZXcgUHJvbWlzZTx2b2lkPihhc3luYyByID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRmb3IgKDs7KVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbnN0IGZlZWRJdGVyYXRpb24gPSBhd2FpdCB0aGlzLmZlZWRJdGVyYXRvcj8ubmV4dCgpO1xuXHRcdFx0XHRcdFx0aWYgKCFmZWVkSXRlcmF0aW9uIHx8IGZlZWRJdGVyYXRpb24uZG9uZSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Ly8gSWYgaSBpcyBsZXNzIHRoYW4gdGhlIG51bWJlciBvZiBcInRocmVhZHNcIiBydW5uaW5nLFxuXHRcdFx0XHRcdFx0XHQvLyBhbmQgdGhlIGl0ZXJhdG9yIGhhcyBydW4gb3V0LCB0aGF0IG1lYW5zIHRoZXJlJ3Ncblx0XHRcdFx0XHRcdFx0Ly8gZmV3ZXIgZmVlZHMgdGhhbiB0aGVyZSBhcmUgdGhyZWFkcyAoc28gYXZvaWRcblx0XHRcdFx0XHRcdFx0Ly8gdGVybWluYXRpb24gaW4gdGhpcyBjYXNlKS5cblx0XHRcdFx0XHRcdFx0aWYgKGkgPj0gbWF4RmV0Y2hUaHJlYWRzKVxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5mZWVkSXRlcmF0b3IgPSBudWxsO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuYWJvcnRDb250cm9sbGVycy5jbGVhcigpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcigpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRjb25zdCBmZWVkID0gZmVlZEl0ZXJhdGlvbi52YWx1ZTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0Y29uc3QgY2hlY2tzdW0gPSBhd2FpdCBVdGlsLmdldEZlZWRDaGVja3N1bShmZWVkLnVybCk7XG5cdFx0XHRcdFx0XHRpZiAoY2hlY2tzdW0gIT09IGZlZWQuY2hlY2tzdW0pXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkRmVlZHMucHVzaChmZWVkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwodGhyZWFkcyk7XG5cdFx0XHRhd2FpdCBGZXRjaGVyLnVwZGF0ZU1vZGlmaWVkRmVlZHMobW9kaWZpZWRGZWVkcyk7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdHN0b3BGZXRjaCgpXG5cdFx0e1xuXHRcdFx0Zm9yIChjb25zdCBhYyBvZiB0aGlzLmFib3J0Q29udHJvbGxlcnMpXG5cdFx0XHRcdGFjLmFib3J0KCk7XG5cdFx0XHRcblx0XHRcdHRoaXMuYWJvcnRDb250cm9sbGVycy5jbGVhcigpO1xuXHRcdFx0dGhpcy5mZWVkSXRlcmF0b3I/LnJldHVybigpO1xuXHRcdH1cblx0XHRcblx0XHRwcml2YXRlIHJlYWRvbmx5IGFib3J0Q29udHJvbGxlcnMgPSBuZXcgU2V0PEFib3J0Q29udHJvbGxlcj4oKTtcblx0fVxuXHRcblx0Y29uc3QgbWF4RmV0Y2hUaHJlYWRzID0gMTA7XG59XG4iLCJcbm5hbWVzcGFjZSBTcXVhcmVzXG57XG5cdC8qKlxuXHQgKiBSZXByZXNlbnRzIHRoZSBJRmVlZCBvYmplY3QsIGFzIGl0IGlzIHN0b3JlZCBvbiBkaXNrLlxuXHQgKi9cblx0ZXhwb3J0IGludGVyZmFjZSBJRGlza0ZlZWRcblx0e1xuXHRcdC8qKlxuXHRcdCAqIFN0b3JlcyB0aGUgVVJMIG9mIHRoZSB0ZXh0IGZpbGUgdGhhdCBjb250YWlucyB0aGUgZmVlZCBpbmZvcm1hdGlvbi5cblx0XHQgKi9cblx0XHR1cmw6IHN0cmluZztcblx0XHRcblx0XHQvKipcblx0XHQgKiBTdG9yZXMgdGhlIGxvY2F0aW9uIG9mIHRoZSBhdmF0YXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBmZWVkLCB3aGljaCBpc1xuXHRcdCAqIGV4dHJhY3RlZCBmcm9tIHRoZSBzdGFuZGFyZCA8bGluayByZWw9XCJpY29uXCI+IHRhZy5cblx0XHQgKi9cblx0XHRpY29uOiBzdHJpbmc7XG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogU3RvcmVzIHRoZSBpbmZvcm1hdGlvbiB0aGF0IHdhcyBleHRyYWN0ZWQgZnJvbSB0aGUgPG1ldGEgbmFtZT1cImF1dGhvclwiPlxuXHRcdCAqIHRhZyB0aGF0IHdhcyBmb3VuZCBvbiB0aGUgVVJMIHRoYXQgcmVmZXJlbmNlZCB0aGUgZmVlZC5cblx0XHQgKi9cblx0XHRhdXRob3I6IHN0cmluZztcblx0XHRcblx0XHQvKipcblx0XHQgKiBTdG9yZXMgYSBkZXNjcmlwdGlvbiBvZiB0aGUgZmVlZCwgd2hpY2ggaXMgdHlwaWNhbGx5IHRoZSBuYW1lIG9mIHRoZSBwZXJzb25cblx0XHQgKiBvciBvcmdhbml6YXRpb24gdGhhdCBvd25zIHRoZSBmZWVkLlxuXHRcdCAqL1xuXHRcdGRlc2NyaXB0aW9uOiBzdHJpbmc7XG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogU3RvcmVzIGEgdmFsdWUgd2hpY2ggY2FuIGJlIHVzZWQgZm9yIGNvbXBhcmlzb24gcHVycG9zZXMgdG8gc2VlIGlmIGFcblx0XHQgKiBmZWVkIGhhcyBiZWVuIHVwZGF0ZWQuXG5cdFx0ICovXG5cdFx0Y2hlY2tzdW06IHN0cmluZztcblx0fVxuXHRcblx0LyoqICovXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUZlZWQgZXh0ZW5kcyBJRGlza0ZlZWRcblx0e1xuXHRcdC8qKiAqL1xuXHRcdGtleTogbnVtYmVyO1xuXHR9XG59XG5cbiIsIlxubmFtZXNwYWNlIFNxdWFyZXNcbntcblx0LyoqICovXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUFic3RyYWN0UG9zdFxuXHR7XG5cdFx0LyoqXG5cdFx0ICogXG5cdFx0ICovXG5cdFx0dmlzaXRlZDogYm9vbGVhbjtcblx0XHRcblx0XHQvKipcblx0XHQgKiBTdG9yZXMgdGhlIHBhdGggb2YgdGhlIGZlZWQsIHJlbGF0aXZlIHRvIHRoZSBVUkwgb2YgdGhlIGZlZWQgdGV4dCBmaWxlLlxuXHRcdCAqL1xuXHRcdHBhdGg6IHN0cmluZztcblx0fVxuXHRcblx0LyoqICovXG5cdGV4cG9ydCBpbnRlcmZhY2UgSURpc2tQb3N0IGV4dGVuZHMgSUFic3RyYWN0UG9zdFxuXHR7XG5cdFx0LyoqXG5cdFx0ICogU3RvcmVzIHRoZSBJRCBvZiB0aGUgZmVlZCB0byB3aGljaCB0aGlzIHBvc3QgYmVsb25ncy5cblx0XHQgKi9cblx0XHRmZWVkOiBudW1iZXI7XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRleHBvcnQgaW50ZXJmYWNlIElQb3N0IGV4dGVuZHMgSUFic3RyYWN0UG9zdFxuXHR7XG5cdFx0LyoqXG5cdFx0ICogXG5cdFx0ICovXG5cdFx0a2V5OiBudW1iZXI7XG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogQSByZWZlcmVuY2UgdG8gdGhlIGZlZWRcblx0XHQgKi9cblx0XHRmZWVkOiBJRmVlZDtcblx0fVxuXHRcblx0LyoqICovXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVBvc3RGaWxlXG5cdHtcblx0XHRba2V5OiBudW1iZXJdOiBJRGlza1Bvc3Rcblx0fVxufVxuIiwiXG5uYW1lc3BhY2UgU3F1YXJlc1xue1xuXHQvKiogKi9cblx0ZXhwb3J0IGludGVyZmFjZSBJQWJzdHJhY3RTY3JvbGxcblx0e1xuXHRcdGFuY2hvckluZGV4OiBudW1iZXI7XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRleHBvcnQgaW50ZXJmYWNlIElEaXNrU2Nyb2xsIGV4dGVuZHMgSUFic3RyYWN0U2Nyb2xsXG5cdHtcblx0XHRmZWVkczogbnVtYmVyW107XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRleHBvcnQgaW50ZXJmYWNlIElTY3JvbGwgZXh0ZW5kcyBJQWJzdHJhY3RTY3JvbGxcblx0e1xuXHRcdGtleTogbnVtYmVyO1xuXHRcdGZlZWRzOiByZWFkb25seSBJRmVlZFtdO1xuXHR9XG59XG4iLCJcbm5hbWVzcGFjZSBTcXVhcmVzXG57XG5cdGV4cG9ydCBuYW1lc3BhY2UgVXRpbFxuXHR7XG5cdFx0LyoqICovXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEZlZWRDaGVja3N1bShmZWVkVXJsOiBzdHJpbmcpXG5cdFx0e1xuXHRcdFx0dHJ5XG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IGFjID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuXHRcdFx0XHRjb25zdCBpZCA9IHNldFRpbWVvdXQoKCkgPT4gYWMuYWJvcnQoKSwgdGltZW91dCk7XG5cdFx0XHRcdFxuXHRcdFx0XHRjb25zdCBmZXRjaFJlc3VsdCA9IGF3YWl0IGZldGNoKGZlZWRVcmwsIHtcblx0XHRcdFx0XHRtZXRob2Q6IFwiSEVBRFwiLFxuXHRcdFx0XHRcdG1vZGU6IFwiY29yc1wiLFxuXHRcdFx0XHRcdHNpZ25hbDogYWMuc2lnbmFsLFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0XG5cdFx0XHRcdGNsZWFyVGltZW91dChpZCk7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoIWZldGNoUmVzdWx0Lm9rKVxuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHRcblx0XHRcdFx0Y29uc3QgbGVuID0gZmV0Y2hSZXN1bHQuaGVhZGVycy5nZXQoXCJDb250ZW50LUxlbmd0aFwiKSB8fCBcIlwiO1xuXHRcdFx0XHRjb25zdCBtb2QgPSBmZXRjaFJlc3VsdC5oZWFkZXJzLmdldChcIkxhc3QtTW9kaWZpZWRcIikgfHwgXCJcIjtcblx0XHRcdFx0XG5cdFx0XHRcdGlmICghbGVuICYmICFtb2QpXG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdGNvbnN0IGNoZWNrc3VtID0gKG1vZCArIFwiO1wiICsgbGVuKS5yZXBsYWNlKC9bLDpcXHNdL2csIFwiXCIpO1xuXHRcdFx0XHRyZXR1cm4gY2hlY2tzdW07XG5cdFx0XHR9XG5cdFx0XHRjYXRjaCAoZSkgeyB9XG5cdFx0XHRcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0XHRcblx0XHRjb25zdCB0aW1lb3V0ID0gNTAwO1xuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFJldHVybnMgdGhlIGN1cnJlbnQgZGF0ZSBpbiB0aWNrcyBmb3JtLCBidXQgd2l0aCBhbnkgaW5jcmVtZW50YXRpb25cblx0XHQgKiBuZWNlc3NhcnkgdG8gYXZvaWQgcmV0dXJuaW5nIHRoZSBzYW1lIHRpY2tzIHZhbHVlIHR3aWNlLlxuXHRcdCAqL1xuXHRcdGV4cG9ydCBmdW5jdGlvbiBnZXRTYWZlVGlja3MoKVxuXHRcdHtcblx0XHRcdGxldCBub3cgPSBEYXRlLm5vdygpO1xuXHRcdFx0XG5cdFx0XHRpZiAobm93IDw9IGxhc3RUaWNrcylcblx0XHRcdFx0bm93ID0gKytsYXN0VGlja3M7XG5cdFx0XHRcblx0XHRcdGxhc3RUaWNrcyA9IG5vdztcblx0XHRcdHJldHVybiBub3c7XG5cdFx0fVxuXHRcdGxldCBsYXN0VGlja3MgPSAwO1xuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFJldHVybnMgdGhlIGZ1bGx5LXF1YWxpZmllZCBVUkwgdG8gdGhlIGljb24gaW1hZ2Vcblx0XHQgKiBzcGVjaWZpZWQgaW4gdGhlIHNwZWNpZmllZCBmZWVkLlxuXHRcdCAqL1xuXHRcdGV4cG9ydCBmdW5jdGlvbiBnZXRJY29uVXJsKGZlZWQ6IElGZWVkKVxuXHRcdHtcblx0XHRcdGNvbnN0IGZvbGRlciA9IFdlYmZlZWQuVXJsLmZvbGRlck9mKGZlZWQudXJsKTtcblx0XHRcdHJldHVybiBXZWJmZWVkLlVybC5yZXNvbHZlKGZlZWQuaWNvbiwgZm9sZGVyKTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogUGFyc2VzIFVSSXMgYXMgc3BlY2lmaWVkIGluIHRoZSBIVE1MIGZlZWRzIHNwZWNpZmljYXRpb24gZm91bmQgYXQ6XG5cdFx0ICogaHR0cHM6Ly93d3cuU3F1YXJlcy5vcmcvc3BlY3MvaHRtbGZlZWRzL1xuXHRcdCAqL1xuXHRcdGV4cG9ydCBmdW5jdGlvbiBwYXJzZUh0bWxVcmkodXJpOiBzdHJpbmcpXG5cdFx0e1xuXHRcdFx0dXJpID0gdXJpLnRyaW0oKTtcblx0XHRcdGNvbnN0IHByZWZpeCA9IFwiaHRtbDovL2ZvbGxvdz9cIjtcblx0XHRcdFxuXHRcdFx0aWYgKCF1cmkuc3RhcnRzV2l0aChwcmVmaXgpKVxuXHRcdFx0XHRyZXR1cm4gXCJcIjtcblx0XHRcdFxuXHRcdFx0dXJpID0gdXJpLnNsaWNlKHByZWZpeC5sZW5ndGgpO1xuXHRcdFx0XG5cdFx0XHRpZiAodXJpLmxlbmd0aCA+IDIwNDgpXG5cdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdFx0XG5cdFx0XHR0cnlcblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgdXJsID0gbmV3IFVSTCh1cmkpO1xuXHRcdFx0XHRyZXR1cm4gdXJsLnRvU3RyaW5nKCk7XG5cdFx0XHR9XG5cdFx0XHRjYXRjaCAoZSkgeyB9XG5cdFx0XHRcblx0XHRcdHJldHVybiBcIlwiO1xuXHRcdH1cblx0XHRcblx0XHQvKipcblx0XHQgKiBTYWZlbHkgcGFyc2VzIGEgc3RyaW5nIEpTT04gaW50byBhbiBvYmplY3QuXG5cdFx0ICovXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHRyeVBhcnNlSnNvbjxUIGV4dGVuZHMgb2JqZWN0ID0gb2JqZWN0Pihqc29uVGV4dDogc3RyaW5nKTogVCB8IG51bGxcblx0XHR7XG5cdFx0XHR0cnlcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIEpTT04ucGFyc2UoanNvblRleHQpO1xuXHRcdFx0fVxuXHRcdFx0Y2F0Y2ggKGUpIHsgfVxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogUmV0dXJucyB0aGUgZW52aXJvbm1lbnQtc3BlY2lmaWMgcGF0aCB0byB0aGUgYXBwbGljYXRpb24gZGF0YSBmb2xkZXIuXG5cdFx0ICovXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldERhdGFGb2xkZXIoKVxuXHRcdHtcblx0XHRcdGlmIChUQVVSSSlcblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgZGlyID0gYXdhaXQgVGF1cmkucGF0aC5hcHBEYXRhRGlyKCk7XG5cdFx0XHRcdHJldHVybiBGaWxhLm5ldyhkaXIpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoRUxFQ1RST04pXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IGZpbGEgPSBGaWxhLm5ldyhfX2Rpcm5hbWUpLmRvd24oREVCVUcgPyBcIitkYXRhXCIgOiBcImRhdGFcIik7XG5cdFx0XHRcdGF3YWl0IGZpbGEud3JpdGVEaXJlY3RvcnkoKTtcblx0XHRcdFx0cmV0dXJuIGZpbGE7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChDQVBBQ0lUT1IpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IHBhdGggPSBERUJVRyA/XG5cdFx0XHRcdFx0RmlsYUNhcGFjaXRvci5EaXJlY3RvcnkuZG9jdW1lbnRzIDpcblx0XHRcdFx0XHRGaWxhQ2FwYWNpdG9yLkRpcmVjdG9yeS5kYXRhO1xuXHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuIEZpbGEubmV3KHBhdGgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoREVNTylcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIEZpbGEubmV3KCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZFwiKTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYWRDbGlwYm9hcmRIdG1sVXJpKClcblx0XHR7XG5cdFx0XHRjb25zdCB0ZXh0ID0gYXdhaXQgcmVhZENsaXBib2FyZCgpO1xuXHRcdFx0Y29uc3QgdXJpID0gcGFyc2VIdG1sVXJpKHRleHQpO1xuXHRcdFx0cmV0dXJuIHVyaSA/IHRleHQgOiBcIlwiO1xuXHRcdH1cblx0XHRcblx0XHQvKiogKi9cblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVhZENsaXBib2FyZCgpXG5cdFx0e1xuXHRcdFx0aWYgKEVMRUNUUk9OKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCBlbGVjdHJvbiA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTtcblx0XHRcdFx0cmV0dXJuIGVsZWN0cm9uLmNsaXBib2FyZC5yZWFkVGV4dCgpIHx8IFwiXCI7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChUQVVSSSlcblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgdGV4dCA9IGF3YWl0IFRhdXJpLmNsaXBib2FyZC5yZWFkVGV4dCgpO1xuXHRcdFx0XHRyZXR1cm4gdGV4dCB8fCBcIlwiO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoQ0FQQUNJVE9SKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCB0ZXh0ID0gYXdhaXQgQ2FwQ2xpcGJvYXJkLnJlYWQoKTtcblx0XHRcdFx0cmV0dXJuIHRleHQudmFsdWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gXCJcIjtcblx0XHR9XG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogUmVtb3ZlcyBwcm9ibGVtYXRpYyBDU1MgYXR0cmlidXRlcyBmcm9tIHRoZSBzcGVjaWZpZWQgc2VjdGlvbiB0YWcsXG5cdFx0ICogYW5kIGVuc3VyZXMgdGhhdCBubyBleHRlcm5hbCBDU1MgaXMgbW9kaWZ5aW5nIGl0cyBkaXNwbGF5IHByb3BlcnRcblx0XHQgKi9cblx0XHRleHBvcnQgZnVuY3Rpb24gZ2V0U2VjdGlvblNhbml0aXphdGlvbkNzcygpOiBSYXcuU3R5bGVcblx0XHR7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRwb3NpdGlvbjogXCJyZWxhdGl2ZSAhXCIsXG5cdFx0XHRcdHpJbmRleDogMCxcblx0XHRcdFx0d2lkdGg6IFwiYXV0byAhXCIsXG5cdFx0XHRcdGhlaWdodDogXCIxMDAlICFcIixcblx0XHRcdFx0bWFyZ2luOiBcIjAgIVwiLFxuXHRcdFx0XHRib3hTaXppbmc6IFwiYm9yZGVyLWJveCAhXCIsXG5cdFx0XHRcdGRpc3BsYXk6IFwiYmxvY2sgIVwiLFxuXHRcdFx0XHRmbG9hdDogXCJub25lICFcIixcblx0XHRcdFx0Y2xpcFBhdGg6IFwiaW5zZXQoMCAwKSAhXCIsXG5cdFx0XHRcdG1hc2s6IFwibm9uZSAhXCIsXG5cdFx0XHRcdG9wYWNpdHk6IFwiMSAhXCIsXG5cdFx0XHRcdHRyYW5zZm9ybTogXCJub25lICFcIixcblx0XHRcdH07XG5cdFx0fVxuXHR9XG59XG4iLCJcbm5hbWVzcGFjZSBTcXVhcmVzXG57XG5cdC8qKiAqL1xuXHRleHBvcnQgY2xhc3MgRG90c0hhdFxuXHR7XG5cdFx0cmVhZG9ubHkgaGVhZDtcblx0XHRcblx0XHQvKiogKi9cblx0XHRjb25zdHJ1Y3RvcigpXG5cdFx0e1xuXHRcdFx0dGhpcy5oZWFkID0gcmF3LmRpdihcblx0XHRcdFx0U3R5bGUuYmFja2dyb3VuZE92ZXJsYXkoKSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHdpZHRoOiBcImZpdC1jb250ZW50XCIsXG5cdFx0XHRcdFx0cGFkZGluZzogXCI1cHggMTBweFwiLFxuXHRcdFx0XHRcdGJvcmRlclJhZGl1czogXCIxMDAwcHhcIixcblx0XHRcdFx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHJhdy5jc3MoXCIgPiBTUEFOXCIsIHtcblx0XHRcdFx0XHRkaXNwbGF5OiBcImlubGluZS1ibG9ja1wiLFxuXHRcdFx0XHRcdHdpZHRoOiBcIjEwcHhcIixcblx0XHRcdFx0XHRoZWlnaHQ6IFwiMTBweFwiLFxuXHRcdFx0XHRcdG1hcmdpbjogXCIzcHhcIixcblx0XHRcdFx0XHRib3JkZXJSYWRpdXM6IFwiMTAwJVwiLFxuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJyZ2JhKDEyOCwgMTI4LCAxMjgpXCIsXG5cdFx0XHRcdH0pLFxuXHRcdFx0XHRyYXcuY3NzKFwiID4gU1BBTi5cIiArIGhpZ2hsaWdodENsYXNzLCB7XG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcImhzbCgyMDUsIDEwMCUsIDUwJSlcIixcblx0XHRcdFx0fSlcblx0XHRcdCk7XG5cdFx0XHRcblx0XHRcdEhhdC53ZWFyKHRoaXMpO1xuXHRcdH1cblx0XHRcblx0XHQvKiogKi9cblx0XHRpbnNlcnQoY291bnQ6IG51bWJlciwgYXQgPSB0aGlzLmhlYWQuY2hpbGRFbGVtZW50Q291bnQpXG5cdFx0e1xuXHRcdFx0Y29uc3Qgc3BhbnM6IEhUTUxTcGFuRWxlbWVudFtdID0gW107XG5cdFx0XHRcblx0XHRcdGZvciAobGV0IGkgPSAtMTsgKytpIDwgY291bnQ7KVxuXHRcdFx0XHRzcGFucy5wdXNoKHJhdy5zcGFuKCkpO1xuXHRcdFx0XG5cdFx0XHRhdCA9IE1hdGgubWF4KDAsIGF0KTtcblx0XHRcdGF0ID0gTWF0aC5taW4odGhpcy5oZWFkLmNoaWxkRWxlbWVudENvdW50LCBhdCk7XG5cdFx0XHRcblx0XHRcdGlmIChhdCA+PSB0aGlzLmhlYWQuY2hpbGRFbGVtZW50Q291bnQpXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMuaGVhZC5hcHBlbmQoLi4uc3BhbnMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCBlbGVtZW50cyA9IEFycmF5LmZyb20odGhpcy5oZWFkLmNoaWxkcmVuKTtcblx0XHRcdFx0ZWxlbWVudHNbYXRdLmJlZm9yZSguLi5zcGFucyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdGhpZ2hsaWdodChpbmRleDogbnVtYmVyKVxuXHRcdHtcblx0XHRcdGluZGV4ID0gTWF0aC5tYXgoMCwgaW5kZXgpO1xuXHRcdFx0aW5kZXggPSBNYXRoLm1pbih0aGlzLmhlYWQuY2hpbGRFbGVtZW50Q291bnQgLSAxLCBpbmRleCk7XG5cdFx0XHRjb25zdCBjaGlsZHJlbiA9IEFycmF5LmZyb20odGhpcy5oZWFkLmNoaWxkcmVuKTtcblx0XHRcdGNoaWxkcmVuLmZvckVhY2goZSA9PiBlLmNsYXNzTGlzdC5yZW1vdmUoaGlnaGxpZ2h0Q2xhc3MpKTtcblx0XHRcdGNoaWxkcmVuW2luZGV4XS5jbGFzc0xpc3QuYWRkKGhpZ2hsaWdodENsYXNzKTtcblx0XHR9XG5cdH1cblx0XG5cdGNvbnN0IGhpZ2hsaWdodENsYXNzID0gXCJoaWdobGlnaHRcIjtcbn1cbiIsIlxubmFtZXNwYWNlIFNxdWFyZXNcbntcblx0LyoqICovXG5cdGV4cG9ydCBjbGFzcyBGZWVkTWV0YUhhdFxuXHR7XG5cdFx0cmVhZG9ubHkgaGVhZDtcblx0XHRcblx0XHQvKiogKi9cblx0XHRjb25zdHJ1Y3RvcihkYXRhOiBJRmVlZClcblx0XHR7XG5cdFx0XHRjb25zdCBpY29uVXJsID0gVXRpbC5nZXRJY29uVXJsKGRhdGEpO1xuXHRcdFx0Y29uc3QgYXV0aG9yID0gZGF0YS5hdXRob3IgfHwgU3RyaW5ncy51bmtub3duQXV0aG9yO1xuXHRcdFx0Y29uc3QgaXNGb2xsb3dpbmcgPSBkYXRhLmtleSA+IDA7XG5cdFx0XHRcblx0XHRcdHRoaXMuaGVhZCA9IHJhdy5kaXYoXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRkaXNwbGF5OiBcImZsZXhcIixcblx0XHRcdFx0XHRoZWlnaHQ6IFwiMTAwJVwiLFxuXHRcdFx0XHRcdGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxuXHRcdFx0XHRcdGFsaWduQ29udGVudDogXCJjZW50ZXJcIixcblx0XHRcdFx0XHRhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRyYXcuZGl2KFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IFwiZmxleFwiLFxuXHRcdFx0XHRcdFx0d2lkdGg6IFwiMTQwcHhcIixcblx0XHRcdFx0XHRcdHBhZGRpbmc6IFwiMjBweFwiLFxuXHRcdFx0XHRcdFx0anVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXG5cdFx0XHRcdFx0XHRhbGlnbkNvbnRlbnQ6IFwiY2VudGVyXCIsXG5cdFx0XHRcdFx0XHRhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0cmF3LmRpdihcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0d2lkdGg6IFwiMTAwJVwiLFxuXHRcdFx0XHRcdFx0XHRhc3BlY3RSYXRpbzogXCIxLzFcIixcblx0XHRcdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiBcIjEwMCVcIixcblx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiBgdXJsKCR7aWNvblVybH0pYCxcblx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZFNpemU6IFwiY292ZXJcIlxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdCksXG5cdFx0XHRcdHJhdy5kaXYoXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ZmxleDogXCIxIDBcIixcblx0XHRcdFx0XHRcdGZvbnRTaXplOiBcIjE4cHhcIixcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHJhdy5jc3MoXCIgPiA6bm90KDpmaXJzdC1jaGlsZClcIiwge1xuXHRcdFx0XHRcdFx0bWFyZ2luVG9wOiBcIjEwcHhcIlxuXHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdHJhdy5kaXYoXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGZvbnRXZWlnaHQ6IDcwMCxcblx0XHRcdFx0XHRcdFx0ZGlzcGxheTogXCItd2Via2l0LWJveFwiLFxuXHRcdFx0XHRcdFx0XHR3ZWJraXRCb3hPcmllbnQ6IFwidmVydGljYWxcIixcblx0XHRcdFx0XHRcdFx0d2Via2l0TGluZUNsYW1wOiBcIjFcIixcblx0XHRcdFx0XHRcdFx0b3ZlcmZsb3c6IFwiaGlkZGVuXCIsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0cmF3LnRleHQoYXV0aG9yKSxcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdCEhZGF0YS5kZXNjcmlwdGlvbiAmJiByYXcuZGl2KFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRmb250V2VpZ2h0OiA1MDAsXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXk6IFwiLXdlYmtpdC1ib3hcIixcblx0XHRcdFx0XHRcdFx0d2Via2l0Qm94T3JpZW50OiBcInZlcnRpY2FsXCIsXG5cdFx0XHRcdFx0XHRcdHdlYmtpdExpbmVDbGFtcDogXCIyXCIsXG5cdFx0XHRcdFx0XHRcdG92ZXJmbG93OiBcImhpZGRlblwiLFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHJhdy50ZXh0KGRhdGEuZGVzY3JpcHRpb24pXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR0aGlzLnJlbmRlckJ1dHRvbihTdHJpbmdzLnNoYXJlLCAoKSA9PiB7fSksXG5cdFx0XHRcdFx0aXNGb2xsb3dpbmcgJiYgKGUgPT4gdGhpcy5yZW5kZXJCdXR0b24oU3RyaW5ncy51bmZvbGxvdywgKCkgPT5cblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRIYXQub3Zlcih0aGlzLCBQYWdlSGF0KS5oZWFkLnNjcm9sbEJ5KHsgdG9wOiAtMSB9KTtcblx0XHRcdFx0XHRcdEhhdC5zaWduYWwoVW5mb2xsb3dTaWduYWwsIGRhdGEua2V5KTtcblx0XHRcdFx0XHRcdFVJLmZhZGUoZSk7XG5cdFx0XHRcdFx0fSkpLFxuXHRcdFx0XHQpLFxuXHRcdFx0KTtcblx0XHRcdFxuXHRcdFx0SGF0LndlYXIodGhpcyk7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdHByaXZhdGUgcmVuZGVyQnV0dG9uKGxhYmVsOiBzdHJpbmcsIGNsaWNrRm46ICgpID0+IHZvaWQpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIFdpZGdldC5maWxsQnV0dG9uKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bWFyZ2luUmlnaHQ6IFwiMTVweFwiLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRyYXcudGV4dChsYWJlbCksXG5cdFx0XHRcdHJhdy5vbihcImNsaWNrXCIsICgpID0+IGNsaWNrRm4oKSlcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG59XG4iLCJcbm5hbWVzcGFjZSBTcXVhcmVzXG57XG5cdC8qKiAqL1xuXHRleHBvcnQgZnVuY3Rpb24gY292ZXJGb2xsb3dlcnNIYXQoKVxuXHR7XG5cdFx0U3F1YXJlcy5hcHBlbmRDc3NSZXNldCgpO1xuXHRcdGNvbnN0IGhhdCA9IG5ldyBGb2xsb3dlcnNIYXQoKTtcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZChoYXQuaGVhZCk7XG5cdH1cbn1cbiIsIlxubmFtZXNwYWNlIFNxdWFyZXNcbntcblx0LyoqICovXG5cdGV4cG9ydCBjbGFzcyBGb2xsb3dlcnNIYXRcblx0e1xuXHRcdHJlYWRvbmx5IGhlYWQ7XG5cdFx0cHJpdmF0ZSByZWFkb25seSBmZWVkRWxlbWVudHM7XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0Y29uc3RydWN0b3IoKVxuXHRcdHtcblx0XHRcdHRoaXMuaGVhZCA9IHJhdy5kaXYoXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRwYWRkaW5nOiBcIjIwcHhcIixcblx0XHRcdFx0fSxcblx0XHRcdFx0cmF3Lm9uKFwiY29ubmVjdGVkXCIsICgpID0+IHRoaXMuY29uc3RydWN0KCkpLFxuXHRcdFx0XHRyYXcuZGl2KFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGZvbnRTaXplOiBcIjIycHhcIixcblx0XHRcdFx0XHRcdGZvbnRXZWlnaHQ6IDYwMCxcblx0XHRcdFx0XHRcdG1hcmdpbkJvdHRvbTogXCIyMHB4XCIsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRyYXcudGV4dChTdHJpbmdzLmZvbGxvd2luZylcblx0XHRcdFx0KSxcblx0XHRcdFx0dGhpcy5mZWVkRWxlbWVudHMgPSByYXcuZGl2KClcblx0XHRcdCk7XG5cdFx0XHRcblx0XHRcdEhhdFxuXHRcdFx0XHQud2Vhcih0aGlzKVxuXHRcdFx0XHQud2VhcihVbmZvbGxvd1NpZ25hbCwgdGhpcy5oYW5kbGVVbmZvbGxvdylcblx0XHRcdFx0LndlYXIoRm9sbG93U2lnbmFsLCB0aGlzLmhhbmRsZUZvbGxvdyk7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdHByaXZhdGUgaGFuZGxlVW5mb2xsb3coZmVlZEtleTogbnVtYmVyKVxuXHRcdHtcblx0XHRcdGNvbnN0IGNscyA9IGtleVByZWZpeCArIGZlZWRLZXk7XG5cdFx0XHRBcnJheS5mcm9tKHRoaXMuaGVhZC5jaGlsZHJlbilcblx0XHRcdFx0LmZpbHRlcihlID0+IGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBlLmNsYXNzTGlzdC5jb250YWlucyhjbHMpKVxuXHRcdFx0XHQubWFwKGUgPT4gZS5yZW1vdmUoKSk7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdHByaXZhdGUgaGFuZGxlRm9sbG93KGZlZWQ6IElGZWVkKVxuXHRcdHtcblx0XHRcdHRoaXMuZmVlZEVsZW1lbnRzLnByZXBlbmQodGhpcy5yZW5kZXJJZGVudGl0eShmZWVkKSk7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdHByaXZhdGUgYXN5bmMgY29uc3RydWN0KClcblx0XHR7XG5cdFx0XHRmb3IgYXdhaXQgKGNvbnN0IGZlZWQgb2YgRGF0YS5yZWFkRmVlZHMoKSlcblx0XHRcdFx0dGhpcy5mZWVkRWxlbWVudHMuYXBwZW5kKHRoaXMucmVuZGVySWRlbnRpdHkoZmVlZCkpO1xuXHRcdH1cblx0XHRcblx0XHQvKiogKi9cblx0XHRwcml2YXRlIHJlbmRlcklkZW50aXR5KGZlZWQ6IElGZWVkKVxuXHRcdHtcblx0XHRcdGNvbnN0IGljb25VcmwgPSBVdGlsLmdldEljb25VcmwoZmVlZCk7XG5cdFx0XHRjb25zdCBhdXRob3IgPSBmZWVkLmF1dGhvciB8fCBTdHJpbmdzLnVua25vd25BdXRob3I7XG5cdFx0XHRcblx0XHRcdGNvbnN0IGUgPSByYXcuZGl2KFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZGlzcGxheTogXCJmbGV4XCIsXG5cdFx0XHRcdFx0YWxpZ25Db250ZW50OiBcImNlbnRlclwiLFxuXHRcdFx0XHRcdGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXG5cdFx0XHRcdFx0bWFyZ2luQm90dG9tOiBcIjEwcHhcIixcblx0XHRcdFx0XHRwYWRkaW5nOiBcIjEwcHhcIixcblx0XHRcdFx0XHRmb250U2l6ZTogXCIxNXB4XCIsXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcInJnYmEoMTI4LCAxMjgsIDEyOCwgMC4yNSlcIixcblx0XHRcdFx0XHRib3JkZXJSYWRpdXM6IFN0eWxlLmJvcmRlclJhZGl1c1NtYWxsLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRrZXlQcmVmaXggKyBmZWVkLmtleSxcblx0XHRcdFx0cmF3LmRpdihcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR3aWR0aDogXCI1MHB4XCIsXG5cdFx0XHRcdFx0XHRwYWRkaW5nOiBcIjEwcHhcIixcblx0XHRcdFx0XHRcdG1hcmdpblJpZ2h0OiBcIjIwcHhcIixcblx0XHRcdFx0XHRcdGFzcGVjdFJhdGlvOiBcIjEvMVwiLFxuXHRcdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiBcIjEwMCVcIixcblx0XHRcdFx0XHRcdGJhY2tncm91bmRJbWFnZTogYHVybCgke2ljb25Vcmx9KWAsXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kU2l6ZTogXCJjb3ZlclwiLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdCksXG5cdFx0XHRcdHJhdy5kaXYoXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Zm9udFdlaWdodDogNTAwLFxuXHRcdFx0XHRcdFx0ZmxleDogXCIxIDBcIixcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHJhdy50ZXh0KGF1dGhvcilcblx0XHRcdFx0KSxcblx0XHRcdFx0V2lkZ2V0LmZpbGxCdXR0b24oXG5cdFx0XHRcdFx0cmF3LnRleHQoU3RyaW5ncy51bmZvbGxvdyksXG5cdFx0XHRcdFx0cmF3Lm9uKFwiY2xpY2tcIiwgYXN5bmMgKCkgPT5cblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRIYXQuc2lnbmFsKFVuZm9sbG93U2lnbmFsLCBmZWVkLmtleSk7XG5cdFx0XHRcdFx0XHRhd2FpdCBVSS5jb2xsYXBzZShlKTtcblx0XHRcdFx0XHRcdGUucmVtb3ZlKCk7XG5cdFx0XHRcdFx0fSksXG5cdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0XHRcblx0XHRcdHJldHVybiBlO1xuXHRcdH1cblx0fVxuXHRcblx0Y29uc3Qga2V5UHJlZml4ID0gXCJpZDpcIjtcbn1cbiIsIlxubmFtZXNwYWNlIFNxdWFyZXMuQ292ZXJcbntcblx0LyoqICovXG5cdGV4cG9ydCBmdW5jdGlvbiBjb3ZlclRpbGVySGF0KClcblx0e1xuXHRcdFNxdWFyZXMuYXBwZW5kQ3NzUmVzZXQoKTtcblx0XHRjb25zdCBncmlkSGF0ID0gbmV3IEdyaWRIYXQoKTtcblx0XHRcblx0XHRncmlkSGF0LmhhbmRsZVJlbmRlcihpbmRleCA9PlxuXHRcdHtcblx0XHRcdHJldHVybiBnZW5lcmF0ZUZha2VTY2VuZShcIlBvc3QgXCIgKyBpbmRleCk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0Z3JpZEhhdC5oYW5kbGVTZWxlY3QoKGUsIGluZGV4KSA9PlxuXHRcdHtcblx0XHRcdGNvbnNvbGU7XG5cdFx0fSk7XG5cdFx0XG5cdFx0Y29uc3QgY29udGFpbmVyID0gcmF3LmRpdihcblx0XHRcdHtcblx0XHRcdFx0cG9zaXRpb246IFwiYWJzb2x1dGVcIixcblx0XHRcdFx0dG9wOiAwLFxuXHRcdFx0XHRsZWZ0OiAwLFxuXHRcdFx0XHRib3R0b206IDAsXG5cdFx0XHRcdHJpZ2h0OiAwLFxuXHRcdFx0XHR3aWR0aDogXCI4MHZ3XCIsXG5cdFx0XHRcdGhlaWdodDogXCI4MHZoXCIsXG5cdFx0XHRcdG1hcmdpbjogXCJhdXRvXCIsXG5cdFx0XHRcdG91dGxpbmU6IFwiMTBweCBzb2xpZCB3aGl0ZVwiLFxuXHRcdFx0fSxcblx0XHRcdGdyaWRIYXRcblx0XHQpO1xuXHRcdFxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kKGNvbnRhaW5lcik7XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRmdW5jdGlvbiBnZW5lcmF0ZUZha2VTY2VuZSh0ZXh0OiBzdHJpbmcpXG5cdHtcblx0XHRyZXR1cm4gcmF3LmRpdihcblx0XHRcdHtcblx0XHRcdFx0YmFja2dyb3VuZEltYWdlOiBcImxpbmVhci1ncmFkaWVudCg0NWRlZywgb3JhbmdlLCBjcmltc29uKVwiLFxuXHRcdFx0XHRtaW5IZWlnaHQ6IFwiMTAwdmhcIixcblx0XHRcdH0sXG5cdFx0XHRyYXcuZGl2KFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cG9zaXRpb246IFwiYWJzb2x1dGVcIixcblx0XHRcdFx0XHR0b3A6IDAsXG5cdFx0XHRcdFx0bGVmdDogMCxcblx0XHRcdFx0XHRib3R0b206IDAsXG5cdFx0XHRcdFx0cmlnaHQ6IDAsXG5cdFx0XHRcdFx0bWFyZ2luOiBcImF1dG9cIixcblx0XHRcdFx0XHR3aWR0aDogXCJmaXQtY29udGVudFwiLFxuXHRcdFx0XHRcdGhlaWdodDogXCJmaXQtY29udGVudFwiLFxuXHRcdFx0XHRcdGNvbG9yOiBcIndoaXRlXCIsXG5cdFx0XHRcdFx0Zm9udFNpemU6IFwiMjB2bWluXCIsXG5cdFx0XHRcdFx0Zm9udFdlaWdodDogOTAwLFxuXHRcdFx0XHRcdHRleHRBbGlnbjogXCJjZW50ZXJcIixcblx0XHRcdFx0fSxcblx0XHRcdFx0cmF3LnRleHQodGV4dClcblx0XHRcdClcblx0XHQpO1xuXHR9XG59XG4iLCJcbm5hbWVzcGFjZSBTcXVhcmVzXG57XG5cdC8qKlxuXHQgKiBcblx0ICovXG5cdGV4cG9ydCBjbGFzcyBHcmlkSGF0XG5cdHtcblx0XHQvKiogKi9cblx0XHRyZWFkb25seSBoZWFkO1xuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdHByaXZhdGUgcmVhZG9ubHkgY29ybmVyc0VsZW1lbnQ7XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0Y29uc3RydWN0b3IoKVxuXHRcdHtcblx0XHRcdG1heWJlQXBwZW5kRGVmYXVsdENzcygpO1xuXHRcdFx0XG5cdFx0XHR0aGlzLmhlYWQgPSByYXcuZGl2KFxuXHRcdFx0XHRTdHlsZS51bnNlbGVjdGFibGUsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRtaW5IZWlnaHQ6IFwiMTAwJVwiLFxuXHRcdFx0XHRcdG92ZXJmbG93WTogXCJhdXRvXCIsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFVJLnN0cmV0Y2goKSxcblx0XHRcdFx0cmF3LmNzcyhcIj4gLlwiICsgQ2xhc3MucG9zdGVyLCB7XG5cdFx0XHRcdFx0ZGlzcGxheTogXCJub25lXCIsXG5cdFx0XHRcdFx0cG9zaXRpb246IFwiYWJzb2x1dGVcIixcblx0XHRcdFx0XHR3aWR0aDogXCIxMDAlXCIsXG5cdFx0XHRcdFx0aGVpZ2h0OiBcIjEwMCVcIixcblx0XHRcdFx0XHRvdmVyZmxvdzogXCJoaWRkZW5cIixcblx0XHRcdFx0XHRvdXRsaW5lOiBcIjJweCBzb2xpZCBibGFja1wiLFxuXHRcdFx0XHRcdC4uLlN0eWxlLmNsaWNrYWJsZSxcblx0XHRcdFx0fSksXG5cdFx0XHRcdHJhdy5vbihcInNjcm9sbFwiLCAoKSA9PiB0aGlzLnVwZGF0ZVBvc3RlclZpc2liaWxpdHkodHJ1ZSkpLFxuXHRcdFx0XHRyYXcub24oXCJjb25uZWN0ZWRcIiwgKCkgPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRoaXMuc2V0U2l6ZUlubmVyKGNhbGN1bGF0ZU5hdHVyYWxTaXplKCkpO1xuXHRcdFx0XHRcdHRoaXMuX3dpZHRoID0gdGhpcy5oZWFkLm9mZnNldFdpZHRoO1xuXHRcdFx0XHRcdHRoaXMuX2hlaWdodCA9IHRoaXMuaGVhZC5vZmZzZXRIZWlnaHQ7XG5cdFx0XHRcdFx0UmVzaXplLndhdGNoKHRoaXMuaGVhZCwgKHcsIGgpID0+IFt0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0XSA9IFt3LCBoXSk7XG5cdFx0XHRcdFx0dGhpcy50cnlBcHBlbmRQb3N0ZXJzKDMpO1xuXHRcdFx0XHR9KSxcblx0XHRcdFx0XG5cdFx0XHRcdChDQVBBQ0lUT1IgfHwgREVNTykgJiYgW1xuXHRcdFx0XHRcdFVJLmNvcm5lckFic29sdXRlKFwidGxcIiksXG5cdFx0XHRcdFx0VUkuY29ybmVyQWJzb2x1dGUoXCJ0clwiKSxcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR0aGlzLmNvcm5lcnNFbGVtZW50ID0gcmF3LnNwYW4oXG5cdFx0XHRcdFx0XHRcImNvcm5lcnMtZWxlbWVudFwiLFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRkaXNwbGF5OiBcImJsb2NrXCIsXG5cdFx0XHRcdFx0XHRcdHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG5cdFx0XHRcdFx0XHRcdHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLFxuXHRcdFx0XHRcdFx0XHR0b3A6IDAsXG5cdFx0XHRcdFx0XHRcdGxlZnQ6IDAsXG5cdFx0XHRcdFx0XHRcdHJpZ2h0OiAwLFxuXHRcdFx0XHRcdFx0XHR6SW5kZXg6IDIsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0VUkuY29ybmVyQWJzb2x1dGUoXCJibFwiKSxcblx0XHRcdFx0XHRcdFVJLmNvcm5lckFic29sdXRlKFwiYnJcIiksXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHRdXG5cdFx0XHQpO1xuXHRcdFx0XG5cdFx0XHRIYXQud2Vhcih0aGlzKTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0aGFuZGxlUmVuZGVyKGZuOiBSZW5kZXJGbilcblx0XHR7XG5cdFx0XHR0aGlzLnJlbmRlckZuID0gZm47XG5cdFx0fVxuXHRcdHByaXZhdGUgcmVuZGVyRm46IFJlbmRlckZuID0gKCkgPT4gbnVsbDtcblx0XHRcblx0XHQvKiogKi9cblx0XHRoYW5kbGVTZWxlY3QoZm46IFNlbGVjdEZuKVxuXHRcdHtcblx0XHRcdHRoaXMuc2VsZWN0Rm4gPSBmbjtcblx0XHR9XG5cdFx0cHJpdmF0ZSBzZWxlY3RGbjogU2VsZWN0Rm4gPSAoKSA9PiB7fTtcblx0XHRcblx0XHQvLyMgU2l6ZVxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIEdldHMgdGhlIHBpeGVsIHdpZHRoIG9mIHRoZSBoZWFkIGVsZW1lbnQuXG5cdFx0ICovXG5cdFx0Z2V0IHdpZHRoKClcblx0XHR7XG5cdFx0XHRyZXR1cm4gdGhpcy5fd2lkdGg7XG5cdFx0fVxuXHRcdHByaXZhdGUgX3dpZHRoID0gMDtcblx0XHRcblx0XHQvKipcblx0XHQgKiBHZXRzIHRoZSBwaXhlbCBoZWlnaHQgb2YgdGhlIGhlYWQgZWxlbWVudC5cblx0XHQgKi9cblx0XHRnZXQgaGVpZ2h0KClcblx0XHR7XG5cdFx0XHRyZXR1cm4gdGhpcy5faGVpZ2h0O1xuXHRcdH1cblx0XHRwcml2YXRlIF9oZWlnaHQgPSAwO1xuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIEdldHMgb3Igc2V0cyB0aGUgbnVtYmVyIG9mIHBvc3RlcnMgYmVpbmcgZGlzcGxheWVkIGluIG9uZSBkaW1lbnNpb24uXG5cdFx0ICovXG5cdFx0Z2V0IHNpemUoKVxuXHRcdHtcblx0XHRcdHJldHVybiB0aGlzLl9zaXplO1xuXHRcdH1cblx0XHRzZXQgc2l6ZShzaXplOiBudW1iZXIpXG5cdFx0e1xuXHRcdFx0dGhpcy5zZXRTaXplSW5uZXIoc2l6ZSk7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdHByaXZhdGUgc2V0U2l6ZUlubmVyKHNpemU6IG51bWJlcilcblx0XHR7XG5cdFx0XHRzaXplID0gTWF0aC5tYXgobWluU2l6ZSwgTWF0aC5taW4oc2l6ZSwgbWF4U2l6ZSkpO1xuXHRcdFx0aWYgKHNpemUgPT09IHRoaXMuX3NpemUpXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdFxuXHRcdFx0dGhpcy5fc2l6ZSA9IHNpemU7XG5cdFx0XHRcblx0XHRcdGNvbnN0IGNscyA9IHNpemVDbGFzc2VzLmdldChzaXplKTtcblx0XHRcdGlmIChjbHMpXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMuaGVhZC5jbGFzc0xpc3QucmVtb3ZlKC4uLnNpemVDbGFzc2VzLnZhbHVlcygpKTtcblx0XHRcdFx0dGhpcy5oZWFkLmNsYXNzTGlzdC5hZGQoY2xzKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0dGhpcy51cGRhdGVQb3N0ZXJWaXNpYmlsaXR5KCk7XG5cdFx0fVxuXHRcdFxuXHRcdHByaXZhdGUgX3NpemUgPSAtMTtcblx0XHRcblx0XHQvKipcblx0XHQgKiBHZXRzIHRoZSBtYXhpbXVtIHBvc3NpYmxlIHNpemUgb2YgdGhlIE9tbml2aWV3LCBcblx0XHQgKiBnaXZlbiB0aGUgbnVtYmVyIG9mIHByZXZpZXdzIHRoYXQgYXJlIGF2YWlsYWJsZS5cblx0XHQgKiBBIHZhbHVlIG9mIDAgaW5kaWNhdGVzIHRoYXQgdGhlcmUgaXMgbm8gc2l6ZSBsaW1pdC5cblx0XHQgKi9cblx0XHRwcml2YXRlIHNpemVMaW1pdCA9IDA7XG5cdFx0XG5cdFx0Ly8jIFBvc3RlcnNcblx0XHRcblx0XHQvKipcblx0XHQgKiBSZXR1cm5zIGFuIGFycmF5IG9mIEhUTUxFbGVtZW50IG9iamVjdHMgdGhhdCBjb250YWluIHRoZSBwb3N0ZXJzXG5cdFx0ICogdGhhdCBoYXZlIGF0IGxlYXN0IGEgc2luZ2xlIHBpeGVsIHZpc2libGUgb24gdGhlIHNjcmVlbi5cblx0XHQgKi9cblx0XHRnZXRWaXNpYmxlUG9zdGVycygpOiBIVE1MRWxlbWVudFtdXG5cdFx0e1xuXHRcdFx0Y29uc3QgZWxlbWVudHM6IEhUTUxFbGVtZW50W10gPSBbXTtcblx0XHRcdFxuXHRcdFx0Zm9yIChjb25zdCBlbGVtZW50IG9mIGdldEJ5Q2xhc3Moc2hvd0NsYXNzLCB0aGlzLmhlYWQpKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRcdFx0aWYgKHJlY3Qud2lkdGggPT09IDAgfHwgcmVjdC5oZWlnaHQgPT09IDApXG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAocmVjdC50b3AgPiB0aGlzLmhlaWdodClcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XG5cdFx0XHRcdGVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHJldHVybiBlbGVtZW50cztcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0Z2V0IHBvc3RlckNvdW50KClcblx0XHR7XG5cdFx0XHRyZXR1cm4gdGhpcy5oZWFkLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoQ2xhc3MucG9zdGVyKS5sZW5ndGg7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdGFzeW5jIHRyeUFwcGVuZFBvc3RlcnMoc2NyZWVuQ291bnQ6IG51bWJlcilcblx0XHR7XG5cdFx0XHRjb25zdCBwdWxsQ291bnQgPSB0aGlzLnNpemUgKiB0aGlzLnNpemUgKiBzY3JlZW5Db3VudDtcblx0XHRcdGNvbnN0IHJhbmdlU3RhcnQgPSB0aGlzLnBvc3RlckNvdW50O1xuXHRcdFx0Y29uc3QgcmFuZ2VFbmQgPSByYW5nZVN0YXJ0ICsgcHVsbENvdW50O1xuXHRcdFx0Y29uc3QgbWF5YmVQcm9taXNlczogUmV0dXJuVHlwZTxSZW5kZXJGbj5bXSA9IFtdO1xuXHRcdFx0bGV0IGNhbkNvbnRpbnVlID0gdHJ1ZTtcblx0XHRcdFxuXHRcdFx0Zm9yIChsZXQgaSA9IHJhbmdlU3RhcnQ7IGkgPCByYW5nZUVuZDsgaSsrKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCByZXN1bHQgPSB0aGlzLnJlbmRlckZuKGkpO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8gSWYgbnVsbCBpcyByZXR1cm5lZCwgdGhpcyBtZWFucyB0aGF0IHRoZSBzdHJlYW0gaGFzIHRlcm1pbmF0ZWQuXG5cdFx0XHRcdGlmIChyZXN1bHQgPT09IG51bGwpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjYW5Db250aW51ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRtYXliZVByb21pc2VzLnB1c2gocmVzdWx0KTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0Y29uc3QgbmV3UG9zdGVyQ291bnQgPSBtYXliZVByb21pc2VzLmxlbmd0aDtcblx0XHRcdGlmIChuZXdQb3N0ZXJDb3VudCA9PT0gMClcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XG5cdFx0XHRpZiAocmFuZ2VTdGFydCA9PT0gMCAmJiBuZXdQb3N0ZXJDb3VudCA8IHRoaXMuc2l6ZSlcblx0XHRcdHtcblx0XHRcdFx0Ly8gVGhlIGNvbnN0cmFpbmVkIHNpemUgY2Fubm90IGdvIGJlbG93IDIuIFRoaXMgbWVhbnMgdGhhdCBpZiB0aGVyZVxuXHRcdFx0XHQvLyBpcyBvbmx5IDEgcHJldmlldyByZXR1cm5lZCwgdGhlIE9tbml2aWV3IGlzIGdvaW5nIHRvIGxvb2sgYSBiaXRcblx0XHRcdFx0Ly8gYXdrd2FyZCB3aXRoIGEgcHJldmlldyBvbiB0aGUgbGVmdCBzaWRlIG9mIHRoZSBzY3JlZW4sIGFuZCBhblxuXHRcdFx0XHQvLyBlbXB0eSBzcGFjZSBvbiB0aGUgcmlnaHQuIElmIHRoaXMgaXMgdW5kZXNpcmFibGUsIHRoZSBjb21wb25lbnRcblx0XHRcdFx0Ly8gdGhhdCBvd25zIHRoZSBPbW5pdmlldyBpcyByZXNwb25zaWJsZSBmb3IgYXZvaWRpbmcgdGhpcyBzaXR1YXRpb25cblx0XHRcdFx0Ly8gYnkgaXQncyBvd24gbWVhbnMuXG5cdFx0XHRcdHRoaXMuc2l6ZUxpbWl0ID0gTWF0aC5tYXgoMiwgbmV3UG9zdGVyQ291bnQpO1xuXHRcdFx0XHR0aGlzLnNldFNpemVJbm5lcih0aGlzLnNpemVMaW1pdCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGNvbnN0IGVsZW1lbnRzOiBIVE1MRWxlbWVudFtdID0gW107XG5cdFx0XHRcblx0XHRcdGZvciAoY29uc3QgbWF5YmVQcm9taXNlIG9mIG1heWJlUHJvbWlzZXMpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICghbWF5YmVQcm9taXNlKVxuXHRcdFx0XHRcdHRocm93IFwiP1wiO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYgKG1heWJlUHJvbWlzZSBpbnN0YW5jZW9mIFByb21pc2UpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zdCBzaGltID0gcmF3LmRpdihcblx0XHRcdFx0XHRcdFwiZWxlbWVudC1wbGFjZWhvbGRlclwiLFxuXHRcdFx0XHRcdFx0Z2V0RGVmYXVsdEJhY2tncm91bmQoKSk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0ZWxlbWVudHMucHVzaChzaGltKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRtYXliZVByb21pc2UudGhlbihlbGVtZW50ID0+XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYgKGVsZW1lbnQgPT09IG51bGwpXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0Zm9yIChjb25zdCBuIG9mIHNoaW0uZ2V0QXR0cmlidXRlTmFtZXMoKSlcblx0XHRcdFx0XHRcdFx0aWYgKG4gIT09IFwic3R5bGVcIiAmJiBuICE9PSBcImNsYXNzXCIpXG5cdFx0XHRcdFx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUobiwgc2hpbS5nZXRBdHRyaWJ1dGUobikgfHwgXCJcIik7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGZvciAoY29uc3QgZGVmaW5lZFByb3BlcnR5IG9mIEFycmF5LmZyb20oc2hpbS5zdHlsZSkpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoXG5cdFx0XHRcdFx0XHRcdFx0ZGVmaW5lZFByb3BlcnR5LFxuXHRcdFx0XHRcdFx0XHRcdHNoaW0uc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShkZWZpbmVkUHJvcGVydHkpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0cmF3LmdldChlbGVtZW50KShcblx0XHRcdFx0XHRcdFx0Ly8gQ2xhc3NlcyB0aGF0IGhhdmUgYmVlbiBzZXQgb24gdGhlIHNoaW0gc2luY2UgaXQgd2FzIGluc2VydGVkXG5cdFx0XHRcdFx0XHRcdC8vIG11c3QgYmUgY29waWVkIG92ZXIgdG8gdGhlIGVsZW1lbnQuXG5cdFx0XHRcdFx0XHRcdEFycmF5LmZyb20oc2hpbS5jbGFzc0xpc3QpLCBcblx0XHRcdFx0XHRcdFx0cmF3Lm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zZWxlY3RGbihlbGVtZW50LCBnZXRJbmRleChlbGVtZW50KSkpXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRzaGltLnJlcGxhY2VXaXRoKGVsZW1lbnQpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGVsZW1lbnRzLnB1c2gocmF3LmdldChtYXliZVByb21pc2UpKFxuXHRcdFx0XHRcdFx0cmF3Lm9uKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zZWxlY3RGbihtYXliZVByb21pc2UsIGdldEluZGV4KG1heWJlUHJvbWlzZSkpKVxuXHRcdFx0XHRcdCkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGZvciAoY29uc3QgW2ksIGVdIG9mIGVsZW1lbnRzLmVudHJpZXMoKSlcblx0XHRcdHtcblx0XHRcdFx0c2V0SW5kZXgoZSwgdGhpcy5wb3N0ZXJDb3VudCArIGkpO1xuXHRcdFx0XHRlLmNsYXNzTGlzdC5hZGQoQ2xhc3MucG9zdGVyKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0dGhpcy5oZWFkLmFwcGVuZCguLi5lbGVtZW50cyk7XG5cdFx0XHR0aGlzLnVwZGF0ZVBvc3RlclZpc2liaWxpdHkoY2FuQ29udGludWUpO1xuXHRcdH1cblx0XHRcblx0XHQvKiogKi9cblx0XHRwcml2YXRlIHVwZGF0ZVBvc3RlclZpc2liaWxpdHkoY2FuQ29udGludWU6IGJvb2xlYW4gPSBmYWxzZSlcblx0XHR7XG5cdFx0XHRpZiAoIXRoaXMuaGVhZC5pc0Nvbm5lY3RlZClcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XG5cdFx0XHRsZXQgaXNOZWFyaW5nQm90dG9tID0gZmFsc2U7XG5cdFx0XHRcblx0XHRcdGlmICh0aGlzLnBvc3RlckNvdW50ID4gMClcblx0XHRcdHtcblx0XHRcdFx0Y29uc3QgeSA9IHRoaXMuaGVhZC5zY3JvbGxUb3A7XG5cdFx0XHRcdGNvbnN0IHJvd0hlaWdodCA9IHRoaXMuaGVpZ2h0IC8gdGhpcy5zaXplO1xuXHRcdFx0XHRjb25zdCByb3dDb3VudCA9IHRoaXMucG9zdGVyQ291bnQgLyB0aGlzLnNpemU7XG5cdFx0XHRcdGNvbnN0IHZpc2libGVSb3dTdGFydCA9IE1hdGguZmxvb3IoeSAvIHJvd0hlaWdodCk7XG5cdFx0XHRcdGNvbnN0IHZpc2libGVJdGVtU3RhcnQgPSB2aXNpYmxlUm93U3RhcnQgKiB0aGlzLnNpemU7XG5cdFx0XHRcdGNvbnN0IHZpc2libGVJdGVtRW5kID0gdmlzaWJsZUl0ZW1TdGFydCArIHRoaXMuc2l6ZSAqICh0aGlzLnNpemUgKyAyKTtcblx0XHRcdFx0Y29uc3QgZWxlbWVudHNXaXRoVG9wID0gbmV3IFNldChnZXRCeUNsYXNzKENsYXNzLmhhc0Nzc1RvcCwgdGhpcy5oZWFkKSk7XG5cdFx0XHRcdGNvbnN0IGVsZW1lbnRzVmlzaWJsZSA9IG5ldyBTZXQoZ2V0QnlDbGFzcyhzaG93Q2xhc3MsIHRoaXMuaGVhZCkpO1xuXHRcdFx0XHRjb25zdCBjaGlsZHJlbiA9IEFycmF5LmZyb20odGhpcy5oZWFkLmNoaWxkcmVuKS5maWx0ZXIoZSA9PiBlIGluc3RhbmNlb2YgSFRNTERpdkVsZW1lbnQpO1xuXHRcdFx0XHRcblx0XHRcdFx0Zm9yIChsZXQgaSA9IHZpc2libGVJdGVtU3RhcnQ7IGkgPCB2aXNpYmxlSXRlbUVuZDsgaSsrKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc3QgZSA9IGNoaWxkcmVuW2ldO1xuXHRcdFx0XHRcdGlmICghKGUgaW5zdGFuY2VvZiBIVE1MRGl2RWxlbWVudCkpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYgKGkgPj0gY2hpbGRyZW4ubGVuZ3RoKVxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnN0IG11bCA9IGdldEluZGV4KGUpID4gMCA/IDEgOiAtMTtcblx0XHRcdFx0XHRjb25zdCBwY3QgPSAoMTAwICogdGhpcy5yb3dPZihlKSAqIG11bCB8fCAwKS50b0ZpeGVkKDUpO1xuXHRcdFx0XHRcdGUuc3R5bGUudG9wID0gYGNhbGMoJHtwY3R9JSAvIHZhcigke0NsYXNzLnNpemVWYXJ9KSlgO1xuXHRcdFx0XHRcdGUuY2xhc3NMaXN0LmFkZChDbGFzcy5oYXNDc3NUb3AsIHNob3dDbGFzcyk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0ZWxlbWVudHNXaXRoVG9wLmRlbGV0ZShlKTtcblx0XHRcdFx0XHRlbGVtZW50c1Zpc2libGUuZGVsZXRlKGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRmb3IgKGNvbnN0IGUgb2YgZWxlbWVudHNXaXRoVG9wKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZS5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcInRvcFwiKTtcblx0XHRcdFx0XHRlLmNsYXNzTGlzdC5yZW1vdmUoQ2xhc3MuaGFzQ3NzVG9wKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0Zm9yIChjb25zdCBlIG9mIGVsZW1lbnRzVmlzaWJsZSlcblx0XHRcdFx0XHRlLmNsYXNzTGlzdC5yZW1vdmUoc2hvd0NsYXNzKTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmICh5ICE9PSB0aGlzLmxhc3RZKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGhpcy5sYXN0WSA9IHk7XG5cdFx0XHRcdFx0aXNOZWFyaW5nQm90dG9tID0gKHkgKyB0aGlzLmhlaWdodCkgPiAocm93Q291bnQgLSAxKSAqICh0aGlzLmhlaWdodCAvIHRoaXMuc2l6ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYgKGNhbkNvbnRpbnVlICYmIGlzTmVhcmluZ0JvdHRvbSlcblx0XHRcdFx0dGhpcy50cnlBcHBlbmRQb3N0ZXJzKDEpO1xuXHRcdFx0XG5cdFx0XHRpZiAoQ0FQQUNJVE9SIHx8IERFTU8pXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IHF1ZXJ5ID0gdGhpcy5oZWFkLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoQ2xhc3MuaGFzQ3NzVG9wKTtcblx0XHRcdFx0aWYgKHF1ZXJ5Lmxlbmd0aCA+IDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zdCBsYXN0ID0gcXVlcnkuaXRlbShxdWVyeS5sZW5ndGggLSAxKSBhcyBIVE1MRWxlbWVudDtcblx0XHRcdFx0XHRpZiAobGFzdCAmJiBsYXN0ICE9PSB0aGlzLmxhc3RWaXNpYmxlUG9zdGVyKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRoaXMuY29ybmVyc0VsZW1lbnQhLnN0eWxlLmhlaWdodCA9ICgxICsgbGFzdC5vZmZzZXRUb3AgKyBsYXN0Lm9mZnNldEhlaWdodCAvIHRoaXMuc2l6ZSkgKyBcInB4XCI7XG5cdFx0XHRcdFx0XHR0aGlzLmxhc3RWaXNpYmxlUG9zdGVyID0gbGFzdDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0cHJpdmF0ZSBsYXN0VmlzaWJsZVBvc3RlcjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblx0XHRwcml2YXRlIGxhc3RZID0gLTE7XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0cHJpdmF0ZSByb3dPZihwcmV2aWV3RWxlbWVudDogRWxlbWVudClcblx0XHR7XG5cdFx0XHRjb25zdCBlSWR4ID0gZ2V0SW5kZXgocHJldmlld0VsZW1lbnQpO1xuXHRcdFx0Y29uc3Qgcm93SW5kZXggPSBNYXRoLmZsb29yKGVJZHggLyB0aGlzLnNpemUpO1xuXHRcdFx0cmV0dXJuIHJvd0luZGV4O1xuXHRcdH1cblx0fVxuXHRcblx0LyoqICovXG5cdGNvbnN0IGVudW0gQ2xhc3Ncblx0e1xuXHRcdHBvc3RlciA9IFwicG9zdGVyXCIsXG5cdFx0Ym9keSA9IFwiYm9keVwiLFxuXHRcdGhhc0Nzc1RvcCA9IFwiaGFzLXRvcFwiLFxuXHRcdHNpemVWYXIgPSBcIi0tc2l6ZVwiLFxuXHR9XG5cdFxuXHQvKiogKi9cblx0bGV0IGdldERlZmF1bHRCYWNrZ3JvdW5kID0gKCkgPT5cblx0e1xuXHRcdGNvbnN0IGNhbnZhcyA9IHJhdy5jYW52YXMoeyB3aWR0aDogMzIsIGhlaWdodDogMzIgfSk7XG5cdFx0Y29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKSE7XG5cdFx0Y29uc3QgZ3JhZCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAzMiwgMzIpO1xuXHRcdGdyYWQuYWRkQ29sb3JTdG9wKDAsIFwicmdiKDUwLCA1MCwgNTApXCIpO1xuXHRcdGdyYWQuYWRkQ29sb3JTdG9wKDEsIFwicmdiKDAsIDAsIDApXCIpO1xuXHRcdGN0eC5maWxsU3R5bGUgPSBncmFkO1xuXHRcdGN0eC5maWxsUmVjdCgwLCAwLCAzMiwgMzIpO1xuXHRcdFxuXHRcdGNvbnN0IGNscyA9IHJhdy5jc3Moe1xuXHRcdFx0YmFja2dyb3VuZEltYWdlOiBgdXJsKCR7Y2FudmFzLnRvRGF0YVVSTCgpfSlgLFxuXHRcdFx0YmFja2dyb3VuZFNpemU6IFwiMTAwJSAxMDAlXCIsXG5cdFx0fSk7XG5cdFx0XG5cdFx0Z2V0RGVmYXVsdEJhY2tncm91bmQgPSAoKSA9PiBjbHM7XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRsZXQgbWF5YmVBcHBlbmREZWZhdWx0Q3NzID0gKCkgPT5cblx0e1xuXHRcdG1heWJlQXBwZW5kRGVmYXVsdENzcyA9ICgpID0+IHt9O1xuXHRcdFxuXHRcdHJhdy5zdHlsZShcblx0XHRcdFwiLlwiICsgQ2xhc3MuYm9keSwge1xuXHRcdFx0XHRwb3NpdGlvbjogXCJmaXhlZFwiLFxuXHRcdFx0XHR0b3A6IDAsXG5cdFx0XHRcdHJpZ2h0OiAwLFxuXHRcdFx0XHRsZWZ0OiAwLFxuXHRcdFx0XHRib3R0b206IDAsXG5cdFx0XHRcdHpJbmRleDogMSxcblx0XHRcdFx0dHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoMClcIixcblx0XHRcdFx0dHJhbnNpdGlvblByb3BlcnR5OiBcInRyYW5zZm9ybVwiLFxuXHRcdFx0XHR0cmFuc2l0aW9uRHVyYXRpb246IFwiMC4zM3NcIixcblx0XHRcdFx0c2Nyb2xsU25hcFR5cGU6IFwieSBtYW5kYXRvcnlcIixcblx0XHRcdFx0b3ZlcmZsb3dZOiBcImF1dG9cIixcblx0XHRcdH0sXG5cdFx0XHRgLiR7Q2xhc3MuYm9keX06YmVmb3JlLCAuJHtDbGFzcy5ib2R5fTphZnRlcmAsIHtcblx0XHRcdFx0Y29udGVudDogYFwiXCJgLFxuXHRcdFx0XHRkaXNwbGF5OiBcImJsb2NrXCIsXG5cdFx0XHRcdGhlaWdodDogXCIxcHhcIixcblx0XHRcdFx0c2Nyb2xsU25hcFN0b3A6IFwiYWx3YXlzXCIsXG5cdFx0XHR9LFxuXHRcdFx0YC4ke0NsYXNzLmJvZHl9OmJlZm9yZWAsIHtcblx0XHRcdFx0c2Nyb2xsU25hcEFsaWduOiBcInN0YXJ0XCIsXG5cdFx0XHR9LFxuXHRcdFx0YC4ke0NsYXNzLmJvZHl9OmFmdGVyYCwge1xuXHRcdFx0XHRzY3JvbGxTbmFwQWxpZ246IFwiZW5kXCIsXG5cdFx0XHR9LFxuXHRcdFx0YC4ke0NsYXNzLmJvZHl9ID4gKmAsIHtcblx0XHRcdFx0c2Nyb2xsU25hcEFsaWduOiBcInN0YXJ0XCIsXG5cdFx0XHRcdHNjcm9sbFNuYXBTdG9wOiBcImFsd2F5c1wiLFxuXHRcdFx0XHRoZWlnaHQ6IFwiMTAwJVwiLFxuXHRcdFx0fSxcblx0XHRcdC8vIFBsYWNlIGEgc2NyZWVuIG92ZXIgdGhlIHBvc3RlciBlbGVtZW50IHRvIGtpbGwgYW55IHNlbGVjdGlvblxuXHRcdFx0Ly8gZXZlbnRzLiBUaGlzIGhhcyB0byBiZSBkb25lIGluIGFub3RoZXIgZWxlbWVudCByYXRoZXIgdGhhbiBcblx0XHRcdC8vIGp1c3QgZG9pbmcgYSBwb2ludGVyLWV2ZW50czogbm9uZSBvbiB0aGUgY2hpbGRyZW4gYmVjYXVzZSB0aGVcblx0XHRcdC8vIHBvc3RlciBlbGVtZW50J3MgY29udGVudHMgYXJlIHdpdGhpbiBhIHNoYWRvdyByb290LlxuXHRcdFx0YC4ke0NsYXNzLnBvc3Rlcn06YmVmb3JlYCwge1xuXHRcdFx0XHRjb250ZW50OiBgXCJcImAsXG5cdFx0XHRcdHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG5cdFx0XHRcdHRvcDogMCxcblx0XHRcdFx0cmlnaHQ6IDAsXG5cdFx0XHRcdGxlZnQ6IDAsXG5cdFx0XHRcdGJvdHRvbTogMCxcblx0XHRcdFx0ekluZGV4OiAxLFxuXHRcdFx0XHR1c2VyU2VsZWN0OiBcIm5vbmVcIixcblx0XHRcdH0sXG5cdFx0KS5hdHRhY2goKTtcblx0XHRcblx0XHRjb25zdCBjbGFzc2VzID0gbmV3IE1hcDxudW1iZXIsIHN0cmluZz4oKTtcblx0XHRmb3IgKGxldCBzaXplID0gbWluU2l6ZTsgc2l6ZSA8PSBtYXhTaXplOyBzaXplKyspXG5cdFx0e1xuXHRcdFx0Y29uc3QgcGFyYW1zOiAoc3RyaW5nIHwgUmF3LlN0eWxlKVtdID0gW107XG5cdFx0XHRjb25zdCBzY2FsZSA9IDEgLyBzaXplO1xuXHRcdFx0Y29uc3Qgc2l6ZUNsYXNzID0gXCJzaXplLVwiICsgc2l6ZTtcblx0XHRcdGNsYXNzZXMuc2V0KHNpemUsIHNpemVDbGFzcyk7XG5cdFx0XHRcblx0XHRcdHBhcmFtcy5wdXNoKFxuXHRcdFx0XHRcIi5cIiArIHNpemVDbGFzcywge1xuXHRcdFx0XHRcdFtDbGFzcy5zaXplVmFyXTogc2l6ZVxuXHRcdFx0XHR9IGFzIGFueVxuXHRcdFx0KTtcblx0XHRcdFxuXHRcdFx0Zm9yIChsZXQgbiA9IC0xOyArK24gPCBzaXplOylcblx0XHRcdHtcblx0XHRcdFx0cGFyYW1zLnB1c2goXG5cdFx0XHRcdFx0YCAuJHtzaXplQ2xhc3N9ID4gRElWOm50aC1vZi10eXBlKCR7c2l6ZX1uICsgJHtuICsgMX0pYCwge1xuXHRcdFx0XHRcdFx0bGVmdDogKHNjYWxlICogMTAwICogbikgKyBcIiVcIixcblx0XHRcdFx0XHRcdHRyYW5zZm9ybTogYHNjYWxlKCR7c2NhbGUudG9GaXhlZCg0KX0pYCxcblx0XHRcdFx0XHRcdHRyYW5zZm9ybU9yaWdpbjogXCIwIDBcIixcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHJhdy5zdHlsZSguLi5wYXJhbXMpLmF0dGFjaCgpO1xuXHRcdH1cblx0XHRcblx0XHRzaXplQ2xhc3NlcyA9IGNsYXNzZXM7XG5cdH1cblx0XG5cdGxldCBzaXplQ2xhc3NlczogUmVhZG9ubHlNYXA8bnVtYmVyLCBzdHJpbmc+O1xuXHRcblx0LyoqXG5cdCAqIENhbGN1bGF0ZXMgYSBjb21mb3J0YWJsZSBwcmV2aWV3IHNpemUgYmFzZWQgb24gdGhlIHNpemUgYW5kIHBpeGVsIGRlbnNpdHlcblx0ICogb2YgdGhlIHNjcmVlbi4gKFRoZSB0ZWNobmlxdWUgdXNlZCBpcyBwcm9iYWJseSBxdWl0ZSBmYXVsdHksIGJ1dCBnb29kIGVub3VnaFxuXHQgKiBmb3IgbW9zdCBzY2VuYXJpb3MpLlxuXHQgKi9cblx0ZnVuY3Rpb24gY2FsY3VsYXRlTmF0dXJhbFNpemUoKVxuXHR7XG5cdFx0cmV0dXJuIDM7XG5cdFx0XG5cdFx0Y29uc3QgZHAxID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gPT09IDE7XG5cdFx0Y29uc3QgbG9naWNhbFdpZHRoID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcblx0XHRcblx0XHRpZiAobG9naWNhbFdpZHRoIDw9IChkcDEgPyA5MDAgOiA0NTApKVxuXHRcdFx0cmV0dXJuIDI7XG5cdFx0XG5cdFx0aWYgKGxvZ2ljYWxXaWR0aCA8PSAoZHAxID8gMTQwMCA6IDcwMCkpXG5cdFx0XHRyZXR1cm4gMztcblx0XHRcblx0XHRpZiAobG9naWNhbFdpZHRoIDw9IDE4MDApXG5cdFx0XHRyZXR1cm4gNDtcblx0XHRcblx0XHRyZXR1cm4gNTtcblx0fVxuXHRcblx0Y29uc3QgbWluU2l6ZSA9IDI7XG5cdGNvbnN0IG1heFNpemUgPSA3O1xuXHQvL2NvbnN0IHJhdGlvWCA9IDk7XG5cdC8vY29uc3QgcmF0aW9ZID0gMTY7XG5cdFxuXHQvKiogKi9cblx0ZnVuY3Rpb24gZ2V0SW5kZXgoZTogRWxlbWVudClcblx0e1xuXHRcdHJldHVybiBOdW1iZXIoKEFycmF5LmZyb20oZS5jbGFzc0xpc3QpXG5cdFx0XHQuZmluZChjbHMgPT4gY2xzLnN0YXJ0c1dpdGgoaW5kZXhQcmVmaXgpKSB8fCBcIlwiKVxuXHRcdFx0LnNsaWNlKGluZGV4UHJlZml4Lmxlbmd0aCkpIHx8IDA7XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRmdW5jdGlvbiBzZXRJbmRleChlOiBFbGVtZW50LCBpbmRleDogbnVtYmVyKVxuXHR7XG5cdFx0ZS5jbGFzc0xpc3QuYWRkKGluZGV4UHJlZml4ICsgaW5kZXgpO1xuXHR9XG5cdFxuXHRjb25zdCBpbmRleFByZWZpeCA9IFwiaW5kZXg6XCI7XG5cdFxuXHQvKipcblx0ICogUmV0dXJucyBhIHBvc3RlciBIVE1MRWxlbWVudCBmb3IgdGhlIGdpdmVuIGluZGV4IGluIHRoZSBzdHJlYW0uXG5cdCAqIFRoZSBmdW5jdGlvbiBzaG91bGQgcmV0dXJuIG51bGwgdG8gc3RvcCBsb29raW5nIGZvciBwb3N0ZXJzIGF0IG9yXG5cdCAqIGJleW9uZCB0aGUgc3BlY2lmaWVkIGluZGV4LlxuXHQgKi9cblx0ZXhwb3J0IHR5cGUgUmVuZGVyRm4gPSAoaW5kZXg6IG51bWJlcikgPT4gUHJvbWlzZTxIVE1MRWxlbWVudD4gfCBIVE1MRWxlbWVudCB8IG51bGw7XG5cdFxuXHQvKiogKi9cblx0ZXhwb3J0IHR5cGUgU2VsZWN0Rm4gPSAoc2VsZWN0ZWRFbGVtZW50OiBIVE1MRWxlbWVudCwgaW5kZXg6IG51bWJlcikgPT4gdm9pZCB8IFByb21pc2U8dm9pZD47XG5cdFxuXHQvLyMgVXRpbGl0aWVzXG5cdFxuXHQvKiogKi9cblx0Y29uc3Qgc2hvd0NsYXNzID0gcmF3LmNzcyh7XG5cdFx0ZGlzcGxheTogXCJibG9jayAhXCIsXG5cdH0pO1xuXHRcblx0LyoqICovXG5cdGZ1bmN0aW9uIGdldEJ5Q2xhc3MoY2xzOiBzdHJpbmcsIGVsZW1lbnQ/OiBFbGVtZW50KVxuXHR7XG5cdFx0Y29uc3QgY29sID0gKGVsZW1lbnQgfHwgZG9jdW1lbnQpLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xzKTtcblx0XHRyZXR1cm4gQXJyYXkuZnJvbShjb2wpIGFzIEhUTUxFbGVtZW50W107XG5cdH1cbn1cbiIsIlxubmFtZXNwYWNlIFNxdWFyZXMuQ292ZXJcbntcblx0LyoqICovXG5cdGV4cG9ydCBmdW5jdGlvbiBjb3ZlclN0b3J5SGF0KClcblx0e1xuXHRcdFNxdWFyZXMuYXBwZW5kQ3NzUmVzZXQoKTtcblx0XHRcblx0XHRjb25zdCBzZWN0aW9ucyA9IFtcblx0XHRcdHJhdy5kaXYoXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzY3JvbGxTbmFwU3RvcDogXCJhbHdheXNcIixcblx0XHRcdFx0XHRzY3JvbGxTbmFwQWxpZ246IFwic3RhcnRcIixcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwicmVkXCIsXG5cdFx0XHRcdH1cblx0XHRcdCksXG5cdFx0XHRyYXcuZGl2KFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c2Nyb2xsU25hcFN0b3A6IFwiYWx3YXlzXCIsXG5cdFx0XHRcdFx0c2Nyb2xsU25hcEFsaWduOiBcInN0YXJ0XCIsXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcImdyZWVuXCIsXG5cdFx0XHRcdH1cblx0XHRcdCksXG5cdFx0XHRyYXcuZGl2KFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c2Nyb2xsU25hcFN0b3A6IFwiYWx3YXlzXCIsXG5cdFx0XHRcdFx0c2Nyb2xsU25hcEFsaWduOiBcInN0YXJ0XCIsXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcImJsdWVcIixcblx0XHRcdFx0fVxuXHRcdFx0KVxuXHRcdF07XG5cdFx0XG5cdFx0Y29uc3QgZmVlZDogSUZlZWQgPSB7XG5cdFx0XHRrZXk6IFV0aWwuZ2V0U2FmZVRpY2tzKCksXG5cdFx0XHRhdXRob3I6IFwiUGF1bCBHb3Jkb25cIixcblx0XHRcdHVybDogXCJodHRwOi8vbG9jYWxob3N0OjQzMzMyL3JhY2Nvb25zL2luZGV4LnR4dFwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiQSBkZXNjcmlwdGlvbiBvZiB0aGUgZmVlZFwiLFxuXHRcdFx0aWNvbjogXCJodHRwOi8vbG9jYWxob3N0OjQzMzMyL3JhY2Nvb25zL2ljb24uanBnXCIsXG5cdFx0XHRjaGVja3N1bTogXCI/XCIsXG5cdFx0fTtcblx0XHRcblx0XHRjb25zdCBoYXQgPSBuZXcgUGFnZUhhdChbXSwgc2VjdGlvbnMsIGZlZWQpO1xuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kKGhhdC5oZWFkKTtcblx0fVxufVxuIiwiXG5uYW1lc3BhY2UgU3F1YXJlc1xue1xuXHQvKiogKi9cblx0ZXhwb3J0IGNsYXNzIFBhZ2VIYXRcblx0e1xuXHRcdHJlYWRvbmx5IGhlYWQ7XG5cdFx0cHJpdmF0ZSByZWFkb25seSBzd2lwZXI7XG5cdFx0cHJpdmF0ZSByZWFkb25seSBzY3JvbGxhYmxlO1xuXHRcdFxuXHRcdHJlYWRvbmx5IG9uRGlzY29ubmVjdDtcblx0XHRwcml2YXRlIHJlYWRvbmx5IF9vbkRpc2Nvbm5lY3Q7XG5cdFx0XG5cdFx0cmVhZG9ubHkgb25SZXRyYWN0O1xuXHRcdHByaXZhdGUgcmVhZG9ubHkgX29uUmV0cmFjdDtcblx0XHRcblx0XHQvKiogKi9cblx0XHRjb25zdHJ1Y3Rvcihcblx0XHRcdGhlYWQ6IEhUTUxFbGVtZW50W10sXG5cdFx0XHRzZWN0aW9uczogSFRNTEVsZW1lbnRbXSxcblx0XHRcdHByaXZhdGUgcmVhZG9ubHkgZmVlZDogSUZlZWQpXG5cdFx0e1xuXHRcdFx0aWYgKHNlY3Rpb25zLmxlbmd0aCA8IDEpXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIk11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgc2VjdGlvbi5cIik7XG5cdFx0XHRcblx0XHRcdGlmIChDQVBBQ0lUT1IgfHwgREVNTylcblx0XHRcdHtcblx0XHRcdFx0cmF3LmdldChzZWN0aW9uc1swXSkoe1xuXHRcdFx0XHRcdGJvcmRlclRvcExlZnRSYWRpdXM6IFN0eWxlLmJvcmRlclJhZGl1c0xhcmdlICsgXCIgIVwiLFxuXHRcdFx0XHRcdGJvcmRlclRvcFJpZ2h0UmFkaXVzOiBTdHlsZS5ib3JkZXJSYWRpdXNMYXJnZSArIFwiICFcIixcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGZvciAoY29uc3Qgc2VjdGlvbiBvZiBzZWN0aW9ucylcblx0XHRcdHtcblx0XHRcdFx0cmF3LmdldChzZWN0aW9uKShcblx0XHRcdFx0XHRVdGlsLmdldFNlY3Rpb25TYW5pdGl6YXRpb25Dc3MoKSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRzY3JvbGxTbmFwU3RvcDogXCJhbHdheXMgIVwiLFxuXHRcdFx0XHRcdFx0c2Nyb2xsU25hcEFsaWduOiBcInN0YXJ0XCIsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0dGhpcy5zd2lwZXIgPSBuZXcgUGFuZVN3aXBlcigpO1xuXHRcdFx0Y29uc3QgbWV0YUhhdCA9IG5ldyBGZWVkTWV0YUhhdCh0aGlzLmZlZWQpO1xuXHRcdFx0Y29uc3QgbWV0YUhhdEhlaWdodCA9IDIwMDtcblx0XHRcdFxuXHRcdFx0dGhpcy5oZWFkID0gcmF3LmRpdihcblx0XHRcdFx0XCJoZWFkXCIsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR3aWR0aDogXCIxMDAlXCIsXG5cdFx0XHRcdFx0aGVpZ2h0OiBcIjEwMCVcIixcblx0XHRcdFx0fSxcblx0XHRcdFx0cmF3Lm9uKFwiY29ubmVjdGVkXCIsICgpID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0aGlzLnN3aXBlci5zZXRWaXNpYmxlUGFuZSgxKTtcblx0XHRcdFx0XHR0aGlzLnNldHVwUmV0cmFjdGlvblRyYWNrZXIoKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3QgZSA9IHRoaXMuc2Nyb2xsYWJsZTtcblx0XHRcdFx0XHRcdGUuc2Nyb2xsVG8oMCwgZS5vZmZzZXRIZWlnaHQgKyBtZXRhSGF0SGVpZ2h0KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSksXG5cdFx0XHRcdHRoaXMuc3dpcGVyXG5cdFx0XHQpO1xuXHRcdFx0XG5cdFx0XHR0aGlzLnNjcm9sbGFibGUgPSByYXcuZGl2KFxuXHRcdFx0XHRcInNjcm9sbGFibGUtZWxlbWVudFwiLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c2Nyb2xsU25hcFR5cGU6IFwieSBtYW5kYXRvcnlcIixcblx0XHRcdFx0XHRvdmVyZmxvd1k6IFwiYXV0b1wiLFxuXHRcdFx0XHRcdGhlaWdodDogXCIxMDAlXCIsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHJhdy5kaXYoXG5cdFx0XHRcdFx0XCJzbmFwLXRvcFwiLFxuXHRcdFx0XHRcdHNuYXAsXG5cdFx0XHRcdFx0eyBoZWlnaHQ6IFwiMTAwJVwiIH0sXG5cdFx0XHRcdCksXG5cdFx0XHRcdHJhdy5nZXQobWV0YUhhdCkoXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aGVpZ2h0OiAobWV0YUhhdEhlaWdodCAtIDEwKSArIFwicHhcIixcblx0XHRcdFx0XHRcdG1hcmdpbkJvdHRvbTogXCIxMHB4XCIsXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgxMjgsIDEyOCwgMTI4LCAwLjMzKVwiLFxuXHRcdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiBTdHlsZS5ib3JkZXJSYWRpdXNMYXJnZSxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFN0eWxlLmJhY2tkcm9wQmx1cig4KSxcblx0XHRcdFx0XHRzbmFwLFxuXHRcdFx0XHQpLFxuXHRcdFx0XHQoQ0FQQUNJVE9SIHx8IERFTU8pICYmIHJhdy5kaXYoXG5cdFx0XHRcdFx0XCJjb3JuZXJzLWNvbnRhaW5lclwiLFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG5cdFx0XHRcdFx0XHRsZWZ0OiAwLFxuXHRcdFx0XHRcdFx0cmlnaHQ6IDAsXG5cdFx0XHRcdFx0XHR6SW5kZXg6IDIsXG5cdFx0XHRcdFx0XHRwb2ludGVyRXZlbnRzOiBcIm5vbmVcIixcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdFVJLmNvcm5lckFic29sdXRlKFwidGxcIiksXG5cdFx0XHRcdFx0XHRVSS5jb3JuZXJBYnNvbHV0ZShcInRyXCIpLFxuXHRcdFx0XHRcdF0sXG5cdFx0XHRcdCksXG5cdFx0XHRcdHJhdy5kaXYoXG5cdFx0XHRcdFx0XCJzaGFkb3ctY29udGFpbmVyXCIsXG5cdFx0XHRcdFx0eyBkaXNwbGF5OiBcImNvbnRlbnRzXCIgfSxcblx0XHRcdFx0XHRyYXcuc2hhZG93KFxuXHRcdFx0XHRcdFx0Li4uaGVhZCxcblx0XHRcdFx0XHRcdHJhdy5ib2R5KFxuXHRcdFx0XHRcdFx0XHR7IGRpc3BsYXk6IFwiY29udGVudHMgIVwiIH0sXG5cdFx0XHRcdFx0XHRcdC4uLnNlY3Rpb25zXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0KSxcblx0XHRcdFx0cmF3LmRpdihcblx0XHRcdFx0XHRcInNuYXAtYm90dG9tXCIsXG5cdFx0XHRcdFx0c25hcCxcblx0XHRcdFx0XHR7IGhlaWdodDogXCIxMDAlXCIgfVxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdFx0XG5cdFx0XHR0aGlzLnN3aXBlci5hZGRQYW5lKHJhdy5kaXYoXCJleGl0LWxlZnQtZWxlbWVudFwiKSk7XG5cdFx0XHR0aGlzLnN3aXBlci5hZGRQYW5lKHRoaXMuc2Nyb2xsYWJsZSk7XG5cdFx0XHRcblx0XHRcdFt0aGlzLm9uUmV0cmFjdCwgdGhpcy5fb25SZXRyYWN0XSA9IEZvcmNlLmNyZWF0ZTwocGVyY2VudDogbnVtYmVyKSA9PiB2b2lkPigpO1xuXHRcdFx0W3RoaXMub25EaXNjb25uZWN0LCB0aGlzLl9vbkRpc2Nvbm5lY3RdID0gRm9yY2UuY3JlYXRlPCgpID0+IHZvaWQ+KCk7XG5cdFx0XHR0aGlzLm9uRGlzY29ubmVjdCgoKSA9PiB0aGlzLmhlYWQucmVtb3ZlKCkpO1xuXHRcdFx0XG5cdFx0XHRIYXQud2Vhcih0aGlzKTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0cHJpdmF0ZSBzZXR1cFJldHJhY3Rpb25UcmFja2VyKClcblx0XHR7XG5cdFx0XHRjb25zdCBlID0gdGhpcy5zY3JvbGxhYmxlO1xuXHRcdFx0bGV0IGxhc3RTY3JvbGxUb3AgPSAtMTtcblx0XHRcdGxldCBsYXN0U2Nyb2xsTGVmdCA9IC0xO1xuXHRcdFx0bGV0IHRpbWVvdXRJZDogYW55ID0gMDtcblx0XHRcdFxuXHRcdFx0Y29uc3QgaGFuZGxlciA9ICgpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGxldCBjbGlwVG9wID0gMDtcblx0XHRcdFx0bGV0IGNsaXBCb3R0b20gPSAwO1xuXHRcdFx0XHRsZXQgY2xpcExlZnQgPSAwO1xuXHRcdFx0XHRcblx0XHRcdFx0Y29uc3QgdyA9IGUub2Zmc2V0V2lkdGg7XG5cdFx0XHRcdGNvbnN0IG9mZnNldEhlaWdodCA9IGUub2Zmc2V0SGVpZ2h0O1xuXHRcdFx0XHRjb25zdCBzY3JvbGxIZWlnaHQgPSBlLnNjcm9sbEhlaWdodDtcblx0XHRcdFx0Y29uc3Qgc2Nyb2xsTGVmdCA9IHRoaXMuc3dpcGVyLmhlYWQuc2Nyb2xsTGVmdDtcblx0XHRcdFx0Y29uc3Qgc2Nyb2xsVG9wID0gZS5zY3JvbGxUb3A7XG5cdFx0XHRcdFxuXHRcdFx0XHRjbGlwVG9wID0gb2Zmc2V0SGVpZ2h0IC0gc2Nyb2xsVG9wO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYgKHNjcm9sbExlZnQgPCB3KVxuXHRcdFx0XHRcdGNsaXBMZWZ0ID0gMSAtIHNjcm9sbExlZnQgLyB3O1xuXHRcdFx0XHRcblx0XHRcdFx0ZWxzZSBpZiAoc2Nyb2xsVG9wID4gc2Nyb2xsSGVpZ2h0IC0gb2Zmc2V0SGVpZ2h0KVxuXHRcdFx0XHRcdGNsaXBCb3R0b20gPSBzY3JvbGxUb3AgLSAoc2Nyb2xsSGVpZ2h0IC0gb2Zmc2V0SGVpZ2h0KTtcblx0XHRcdFx0XG5cdFx0XHRcdGNsaXBMZWZ0ICo9IDEwMDsgXG5cdFx0XHRcdHRoaXMuaGVhZC5zdHlsZS5jbGlwUGF0aCA9IGBpbnNldCgke2NsaXBUb3B9cHggMCAke2NsaXBCb3R0b219cHggJHtjbGlwTGVmdH0lKWA7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBEZWFsIHdpdGggcmV0cmFjdGlvbiBub3RpZmljYXRpb25cblx0XHRcdFx0bGV0IHJldHJhY3RQY3QgPSAtMTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChzY3JvbGxMZWZ0IDwgdylcblx0XHRcdFx0XHRyZXRyYWN0UGN0ID0gc2Nyb2xsTGVmdCAvIHc7XG5cdFx0XHRcdFxuXHRcdFx0XHRlbHNlIGlmIChzY3JvbGxUb3AgPCBvZmZzZXRIZWlnaHQpXG5cdFx0XHRcdFx0cmV0cmFjdFBjdCA9IHNjcm9sbFRvcCAvIG9mZnNldEhlaWdodDtcblx0XHRcdFx0XG5cdFx0XHRcdGVsc2UgaWYgKHNjcm9sbFRvcCA+PSBzY3JvbGxIZWlnaHQgLSBvZmZzZXRIZWlnaHQgKiAyKVxuXHRcdFx0XHRcdHJldHJhY3RQY3QgPSAoc2Nyb2xsSGVpZ2h0IC0gb2Zmc2V0SGVpZ2h0IC0gc2Nyb2xsVG9wKSAvIG9mZnNldEhlaWdodDtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChyZXRyYWN0UGN0ID4gMClcblx0XHRcdFx0XHR0aGlzLl9vblJldHJhY3QocmV0cmFjdFBjdCk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBSZW1vdmUgdGhlIGVsZW1lbnQgaWYgbmVjZXNzYXJ5XG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuXHRcdFx0XHRpZiAocmV0cmFjdFBjdCA+IDApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRsYXN0U2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQ7XG5cdFx0XHRcdFx0bGFzdFNjcm9sbFRvcCA9IHNjcm9sbFRvcDtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYgKHNjcm9sbExlZnQgIT09IGxhc3RTY3JvbGxMZWZ0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGlmIChzY3JvbGxUb3AgIT09IGxhc3RTY3JvbGxUb3ApXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0Ly8gQSBtb3JlIGVsZWdhbnQgd2F5IHRvIGRlYWwgd2l0aCB0aGlzIHdvdWxkIGJlIHRvIGFuaW1hdGVcblx0XHRcdFx0XHRcdC8vIGl0IG9mZiB0aGUgc2NyZWVuLi4uIGJ1dCBqdXN0IHJlbW92aW5nIGl0IGlzIGdvb2QgZW5vdWdoIGZvciBub3dcblx0XHRcdFx0XHRcdC8vIGJlY2F1c2UgdGhpcyBpcyBqdXN0IGFuIGVkZ2UgY2FzZSB0aGF0IGlzbid0IGdvaW5nIHRvIGhhcHBlblxuXHRcdFx0XHRcdFx0Ly8gdmVyeSBvZnRlbi5cblx0XHRcdFx0XHRcdGlmIChzY3JvbGxMZWZ0IDw9IDJ8fFxuXHRcdFx0XHRcdFx0XHRzY3JvbGxUb3AgPD0gMiB8fFxuXHRcdFx0XHRcdFx0XHRzY3JvbGxUb3AgPj0gc2Nyb2xsSGVpZ2h0IC0gb2Zmc2V0SGVpZ2h0IC0gMilcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fb25EaXNjb25uZWN0KCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRcblx0XHRcdGUuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBoYW5kbGVyKTtcblx0XHRcdHRoaXMuc3dpcGVyLmhlYWQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBoYW5kbGVyKTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0Zm9yY2VSZXRyYWN0KClcblx0XHR7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2U8dm9pZD4ociA9PlxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCBzbGlkZUF3YXkgPSAoYXhpczogXCJ4XCIgfCBcInlcIiwgYW1vdW50OiBudW1iZXIpID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zdCBtcyA9IDEwMDtcblx0XHRcdFx0XHRjb25zdCBlID0gdGhpcy5oZWFkO1xuXHRcdFx0XHRcdGUuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gbXMgKyBcIm1zXCI7XG5cdFx0XHRcdFx0ZS5zdHlsZS50cmFuc2l0aW9uUHJvcGVydHkgPSBcInRyYW5zZm9ybVwiO1xuXHRcdFx0XHRcdGUuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSR7YXhpcy50b0xvY2FsZVVwcGVyQ2FzZSgpfSgke2Ftb3VudH1weClgO1xuXHRcdFx0XHRcdGUuc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT5cblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0aGlzLl9vbkRpc2Nvbm5lY3QoKTtcblx0XHRcdFx0XHRcdHIoKTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG1zKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0Y29uc3QgZSA9IHRoaXMuc2Nyb2xsYWJsZTtcblx0XHRcdFx0Y29uc3QgdyA9IGUub2Zmc2V0V2lkdGg7XG5cdFx0XHRcdGNvbnN0IG9mZnNldEhlaWdodCA9IGUub2Zmc2V0SGVpZ2h0O1xuXHRcdFx0XHRjb25zdCBzY3JvbGxMZWZ0ID0gdGhpcy5zd2lwZXIuaGVhZC5zY3JvbGxMZWZ0O1xuXHRcdFx0XHRjb25zdCBzY3JvbGxUb3AgPSBlLnNjcm9sbFRvcDtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIFRoaXMgY2hlY2sgd2lsbCBpbmRpY2F0ZSB3aGV0aGVyIHRoZSBwYWdlSGF0IGhhcyByaWdodHdhcmRcblx0XHRcdFx0Ly8gc2Nyb2xsaW5nIGluZXJ0aWEuIElmIGl0IGRvZXMsIGl0J3Mgc2Nyb2xsaW5nIHdpbGwgaGFsdCBhbmQgaXQgd2lsbCBiZVxuXHRcdFx0XHQvLyBuZWNlc3NhcnkgdG8gYW5pbWF0ZSB0aGUgcGFnZUhhdCBhd2F5IG1hbnVhbGx5LlxuXHRcdFx0XHRpZiAoc2Nyb2xsTGVmdCA+IDAgJiYgc2Nyb2xsTGVmdCA8IHcpXG5cdFx0XHRcdFx0c2xpZGVBd2F5KFwieFwiLCBzY3JvbGxMZWZ0KTtcblx0XHRcdFx0XG5cdFx0XHRcdGVsc2UgaWYgKHNjcm9sbFRvcCA+IDAgJiYgc2Nyb2xsVG9wIDwgb2Zmc2V0SGVpZ2h0KVxuXHRcdFx0XHRcdHNsaWRlQXdheShcInlcIiwgc2Nyb2xsVG9wKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXHRcblx0Y29uc3Qgc25hcDogUmF3LlN0eWxlID0ge1xuXHRcdHNjcm9sbFNuYXBTdG9wOiBcImFsd2F5c1wiLFxuXHRcdHNjcm9sbFNuYXBBbGlnbjogXCJzdGFydFwiLFxuXHR9O1xufVxuIiwiXG5uYW1lc3BhY2UgU3F1YXJlc1xue1xuXHQvKipcblx0ICogQSBjbGFzcyB0aGF0IGNyZWF0ZXMgYSBzZXJpZXMgb2YgcGFuZXMgdGhhdCBzd2lwZSBob3Jpem9udGFsbHkgb24gbW9iaWxlLlxuXHQgKi9cblx0ZXhwb3J0IGNsYXNzIFBhbmVTd2lwZXJcblx0e1xuXHRcdHJlYWRvbmx5IGhlYWQ7XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0Y29uc3RydWN0b3IoKVxuXHRcdHtcblx0XHRcdHRoaXMuaGVhZCA9IHJhdy5kaXYoXG5cdFx0XHRcdERvY2suY292ZXIoKSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHdoaXRlU3BhY2U6IFwibm93cmFwXCIsXG5cdFx0XHRcdFx0b3ZlcmZsb3dYOiBcImF1dG9cIixcblx0XHRcdFx0XHRvdmVyZmxvd1k6IFwiaGlkZGVuXCIsXG5cdFx0XHRcdFx0c2Nyb2xsU25hcFR5cGU6IFwieCBtYW5kYXRvcnlcIixcblx0XHRcdFx0fSxcblx0XHRcdFx0cmF3LmNzcyhcIiA+IERJVlwiLCB7XG5cdFx0XHRcdFx0ZGlzcGxheTogXCJpbmxpbmUtYmxvY2tcIixcblx0XHRcdFx0XHR3aWR0aDogXCIxMDAlXCIsXG5cdFx0XHRcdFx0aGVpZ2h0OiBcIjEwMCVcIixcblx0XHRcdFx0XHR3aGl0ZVNwYWNlOiBcIm5vcm1hbFwiLFxuXHRcdFx0XHRcdHNjcm9sbFNuYXBBbGlnbjogXCJzdGFydFwiLFxuXHRcdFx0XHRcdHNjcm9sbFNuYXBTdG9wOiBcImFsd2F5c1wiLFxuXHRcdFx0XHRcdG92ZXJmbG93WDogXCJoaWRkZW5cIixcblx0XHRcdFx0XHRvdmVyZmxvd1k6IFwiYXV0b1wiLFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0cmF3Lm9uKFwic2Nyb2xsXCIsICgpID0+IHRoaXMudXBkYXRlVmlzaWJsZVBhbmUoKSksXG5cdFx0XHQpO1xuXHRcdFx0XG5cdFx0XHRIYXQud2Vhcih0aGlzKTtcblx0XHRcdFt0aGlzLnZpc2libGVQYW5lQ2hhbmdlZCwgdGhpcy5fdmlzaWJsZVBhbmVDaGFuZ2VkXSA9IFxuXHRcdFx0XHRGb3JjZS5jcmVhdGU8KHZpc2libGVQYW5lSW5kZXg6IG51bWJlcikgPT4gdm9pZD4oKTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0cmVhZG9ubHkgdmlzaWJsZVBhbmVDaGFuZ2VkO1xuXHRcdHByaXZhdGUgcmVhZG9ubHkgX3Zpc2libGVQYW5lQ2hhbmdlZDtcblx0XHRcblx0XHQvKiogKi9cblx0XHRhZGRQYW5lKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBhdDogbnVtYmVyID0gLTApXG5cdFx0e1xuXHRcdFx0Y29uc3QgcGFuZSA9IHJhdy5kaXYoXG5cdFx0XHRcdFwic3dpcGVyLXBhbmVcIixcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGhlaWdodDogXCIxMDAlXCIsXG5cdFx0XHRcdFx0b3ZlcmZsb3dYOiBcImhpZGRlblwiLFxuXHRcdFx0XHRcdG92ZXJmbG93WTogXCJhdXRvXCIsXG5cdFx0XHRcdFx0d2hpdGVTcGFjZTogXCJub3JtYWxcIixcblx0XHRcdFx0fSxcblx0XHRcdFx0ZWxlbWVudFxuXHRcdFx0KTtcblx0XHRcdFxuXHRcdFx0aWYgKGF0ID49IHRoaXMuaGVhZC5jaGlsZEVsZW1lbnRDb3VudCB8fCBPYmplY3QuaXMoYXQsIC0wKSlcblx0XHRcdHtcblx0XHRcdFx0dGhpcy5oZWFkLmFwcGVuZChwYW5lKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKGF0IDwgMClcblx0XHRcdHtcblx0XHRcdFx0YXQgPSBNYXRoLm1heCgwLCB0aGlzLmhlYWQuY2hpbGRFbGVtZW50Q291bnQgKyBhdCk7XG5cdFx0XHRcdGNvbnN0IGNoaWxkcmVuID0gQXJyYXkuZnJvbSh0aGlzLmhlYWQuY2hpbGRyZW4pO1xuXHRcdFx0XHRjaGlsZHJlblthdF0uYmVmb3JlKHBhbmUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHQvKiogKi9cblx0XHRzZXRWaXNpYmxlUGFuZShpbmRleDogbnVtYmVyKVxuXHRcdHtcblx0XHRcdGNvbnN0IHcgPSB0aGlzLmhlYWQub2Zmc2V0V2lkdGg7XG5cdFx0XHR0aGlzLmhlYWQuc2Nyb2xsQnkodyAqIGluZGV4LCAwKTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0cHJpdmF0ZSB1cGRhdGVWaXNpYmxlUGFuZSgpXG5cdFx0e1xuXHRcdFx0Y29uc3QgdyA9IHRoaXMuaGVhZC5vZmZzZXRXaWR0aDtcblx0XHRcdGNvbnN0IHMgPSB0aGlzLmhlYWQuc2Nyb2xsTGVmdDtcblx0XHRcdGNvbnN0IHBhbmVJbmRleCA9IE1hdGgucm91bmQocyAvIHcpO1xuXHRcdFx0XG5cdFx0XHRpZiAocGFuZUluZGV4ICE9PSB0aGlzLmxhc3RWaXNpYmxlUGFuZSlcblx0XHRcdFx0dGhpcy5fdmlzaWJsZVBhbmVDaGFuZ2VkKHBhbmVJbmRleCk7XG5cdFx0XHRcblx0XHRcdHRoaXMubGFzdFZpc2libGVQYW5lID0gcGFuZUluZGV4O1xuXHRcdH1cblx0XHRcblx0XHRwcml2YXRlIGxhc3RWaXNpYmxlUGFuZSA9IDA7XG5cdH1cbn1cbiIsIlxubmFtZXNwYWNlIFNxdWFyZXNcbntcblx0LyoqICovXG5cdGV4cG9ydCBjbGFzcyBQcm9maWxlSGF0XG5cdHtcblx0XHRyZWFkb25seSBoZWFkO1xuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdGNvbnN0cnVjdG9yKClcblx0XHR7XG5cdFx0XHR0aGlzLmhlYWQgPSByYXcuZGl2KFxuXHRcdFx0XHRcblx0XHRcdCk7XG5cdFx0XHRcblx0XHRcdEhhdC53ZWFyKHRoaXMpO1xuXHRcdH1cblx0fVxufVxuIiwiXG5uYW1lc3BhY2UgU3F1YXJlc1xue1xuXHQvKiogKi9cblx0ZXhwb3J0IGNsYXNzIFB1bGxUb1JlZnJlc2hIYXRcblx0e1xuXHRcdHJlYWRvbmx5IGhlYWQ7XG5cdFx0cHJpdmF0ZSByZWFkb25seSBzeW1ib2w7XG5cdFx0cHJpdmF0ZSByb3RhdGlvbkRlZ3Jlc3MgPSAwO1xuXHRcdHByaXZhdGUgYW5pbWF0aW9uOiBBbmltYXRpb24gfCBudWxsID0gbnVsbDtcblx0XHRcblx0XHQvKiogKi9cblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHRhcmdldDogSFRNTEVsZW1lbnQpXG5cdFx0e1xuXHRcdFx0Y29uc3Qgc2l6ZSA9IChwYXJzZUludChTdHlsZS5ib3JkZXJSYWRpdXNMYXJnZSkgKiAyKSArIFwicHhcIjtcblx0XHRcdFxuXHRcdFx0dGhpcy5oZWFkID0gcmF3LmRpdihcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHdpZHRoOiBzaXplLFxuXHRcdFx0XHRcdGhlaWdodDogc2l6ZSxcblx0XHRcdFx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG5cdFx0XHRcdFx0Ym9yZGVyUmFkaXVzOiBcIjEwMCVcIixcblx0XHRcdFx0XHR6SW5kZXg6IDEsXG5cdFx0XHRcdFx0b3BhY2l0eTogMCxcblx0XHRcdFx0XHRwb2ludGVyRXZlbnRzOiBcIm5vbmVcIixcblx0XHRcdFx0fSxcblx0XHRcdFx0U3R5bGUuYmFja2Ryb3BCbHVyKCksXG5cdFx0XHRcdHJhdy5vbih0YXJnZXQsIFwic2Nyb2xsXCIsICgpID0+IHRoaXMuaGFuZGxlVGFyZ2V0U2Nyb2xsKCkpLFxuXHRcdFx0XHR0aGlzLnN5bWJvbCA9IHJhdy5kaXYoXG5cdFx0XHRcdFx0RG9jay5jZW50ZXIoKSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR3aWR0aDogZmFjdG9yICogOSArIFwicHhcIixcblx0XHRcdFx0XHRcdGhlaWdodDogZmFjdG9yICogMTYgKyBcInB4XCIsXG5cdFx0XHRcdFx0XHRib3JkZXJSYWRpdXM6IFwiNnB4XCIsXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgxMjgsIDEyOCwgMTI4LCAwLjc1KVwiLFxuXHRcdFx0XHRcdFx0dHJhbnNpdGlvbkR1cmF0aW9uOiBcIjAuMXNcIixcblx0XHRcdFx0XHR9XG5cdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0XHRcblx0XHRcdEhhdC53ZWFyKHRoaXMpO1xuXHRcdFx0W3RoaXMub25SZWZyZXNoLCB0aGlzLl9vblJlZnJlc2hdID0gRm9yY2UuY3JlYXRlPCgpID0+IHZvaWQ+KCk7XG5cdFx0fVxuXHRcdFxuXHRcdHJlYWRvbmx5IG9uUmVmcmVzaDtcblx0XHRwcml2YXRlIHJlYWRvbmx5IF9vblJlZnJlc2g7XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0cHJpdmF0ZSBoYW5kbGVUYXJnZXRTY3JvbGwoKVxuXHRcdHtcblx0XHRcdGlmICh0aGlzLmFuaW1hdGlvbilcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XG5cdFx0XHRjb25zdCBlID0gdGhpcy50YXJnZXQ7XG5cdFx0XHRjb25zdCBvdmVyc2Nyb2xsQW1vdW50ID0gTWF0aC5tYXgoMCwgZS5zY3JvbGxUb3AgKyBlLm9mZnNldEhlaWdodCAtIGUuc2Nyb2xsSGVpZ2h0KTtcblx0XHRcdFx0XG5cdFx0XHRpZiAob3ZlcnNjcm9sbEFtb3VudCA8PSAwKVxuXHRcdFx0XHR0aGlzLnNldExvYWRpbmdBbmltYXRpb24oZmFsc2UpO1xuXHRcdFx0XG5cdFx0XHRlbHNlIGlmIChvdmVyc2Nyb2xsQW1vdW50IDwgYmVnaW5SZWZyZXNoRnJhbWUpXG5cdFx0XHRcdHRoaXMuc2V0QW5pbWF0aW9uRnJhbWUob3ZlcnNjcm9sbEFtb3VudCk7XG5cdFx0XHRcblx0XHRcdGVsc2UgaWYgKG92ZXJzY3JvbGxBbW91bnQgPj0gYmVnaW5SZWZyZXNoRnJhbWUpXG5cdFx0XHRcdHRoaXMuc2V0TG9hZGluZ0FuaW1hdGlvbih0cnVlKTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0cHJpdmF0ZSBzZXRBbmltYXRpb25GcmFtZShuOiBudW1iZXIpXG5cdFx0e1xuXHRcdFx0biA9IE1hdGgubWF4KDAsIG4pO1xuXHRcdFx0Y29uc3Qgb3BhY2l0eSA9IE1hdGgubWluKDEsIG4gLyBiZWdpblJlZnJlc2hGcmFtZSk7XG5cdFx0XHR0aGlzLnJvdGF0aW9uRGVncmVzcyA9IE1hdGgucm91bmQobiAqIDEuNSk7XG5cdFx0XHR0aGlzLmhlYWQuc3R5bGUub3BhY2l0eSA9IG9wYWNpdHkudG9TdHJpbmcoKTtcblx0XHRcdHRoaXMuc3ltYm9sLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGVaKCR7dGhpcy5yb3RhdGlvbkRlZ3Jlc3N9ZGVnKWA7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdHNldExvYWRpbmdBbmltYXRpb24oZW5hYmxlOiBib29sZWFuKVxuXHRcdHtcblx0XHRcdGlmIChlbmFibGUgJiYgIXRoaXMuYW5pbWF0aW9uKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLmhlYWQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2JhKDAsIDAsIDAsIDAuNSlcIjtcblx0XHRcdFx0XG5cdFx0XHRcdHRoaXMuYW5pbWF0aW9uID0gdGhpcy5zeW1ib2wuYW5pbWF0ZShcblx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHR7IHRyYW5zZm9ybTogYHJvdGF0ZVooJHt0aGlzLnJvdGF0aW9uRGVncmVzc31kZWcpYCB9LFxuXHRcdFx0XHRcdFx0eyB0cmFuc2Zvcm06IGByb3RhdGVaKCR7dGhpcy5yb3RhdGlvbkRlZ3Jlc3MgKyAzNjB9ZGVnKWAgfSxcblx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGl0ZXJhdGlvbnM6IDEwMDAwLFxuXHRcdFx0XHRcdFx0ZHVyYXRpb246IDgwMCxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLl9vblJlZnJlc2goKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCFlbmFibGUgJiYgdGhpcy5hbmltYXRpb24pIChhc3luYyAoKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCBhbmltYXRpb24gPSB0aGlzLmFuaW1hdGlvbiE7XG5cdFx0XHRcdHRoaXMuYW5pbWF0aW9uID0gbnVsbDtcblx0XHRcdFx0Y29uc3QgcyA9IHRoaXMuaGVhZC5zdHlsZTtcblx0XHRcdFx0cy50cmFuc2l0aW9uRHVyYXRpb24gPSBcIjAuOHNcIjtcblx0XHRcdFx0cy50cmFuc2l0aW9uUHJvcGVydHkgPSBcInRyYW5zZm9ybVwiO1xuXHRcdFx0XHRzLnRyYW5zZm9ybSA9IFwic2NhbGUoMSlcIjtcblx0XHRcdFx0YXdhaXQgVUkud2FpdCgxKTtcblx0XHRcdFx0cy50cmFuc2Zvcm0gPSBcInNjYWxlKDApXCI7XG5cdFx0XHRcdGF3YWl0IFVJLndhaXRUcmFuc2l0aW9uRW5kKHRoaXMuaGVhZCk7XG5cdFx0XHRcdGFuaW1hdGlvbi5maW5pc2goKTtcblx0XHRcdFx0cy5vcGFjaXR5ID0gXCIwXCI7XG5cdFx0XHRcdHMudHJhbnNmb3JtID0gXCJzY2FsZSgxKVwiO1xuXHRcdFx0fSkoKTtcblx0XHR9XG5cdH1cblx0XG5cdC8qKiBUaGUgZnJhbWUgYXQgd2hpY2ggdGhlIFJlZnJlc2hIYXQgYmVjb21lcyBmdWxseSBvcGFxdWUgKi9cblx0Y29uc3QgYmVnaW5SZWZyZXNoRnJhbWUgPSAxMDA7XG5cdFxuXHRjb25zdCBmYWN0b3IgPSAyO1xufVxuIiwiXG5uYW1lc3BhY2UgU3F1YXJlc1xue1xuXHQvKiogKi9cblx0ZXhwb3J0IGNsYXNzIFJvb3RIYXRcblx0e1xuXHRcdHJlYWRvbmx5IGhlYWQ7XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0Y29uc3RydWN0b3IoKVxuXHRcdHtcblx0XHRcdHRoaXMuaGVhZCA9IHJhdy5kaXYoXG5cdFx0XHRcdFVJLm5vU2Nyb2xsQmFycyxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGhlaWdodDogXCJpbmhlcml0XCIsXG5cdFx0XHRcdFx0dG9wOiBcImVudihzYWZlLWFyZWEtaW5zZXQtdG9wKVwiLFxuXHRcdFx0XHRcdHRhYkluZGV4OiAwLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRyYXcub24od2luZG93LCBcInBhc3RlXCIsIGFzeW5jIGV2ID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zdCB1cmkgPSBhd2FpdCBVdGlsLnJlYWRDbGlwYm9hcmRIdG1sVXJpKCk7XG5cdFx0XHRcdFx0aWYgKHVyaSlcblx0XHRcdFx0XHRcdHRoaXMuZm9sbG93RmVlZEZyb21VcmkodXJpKTtcblx0XHRcdFx0fSksXG5cdFx0XHRcdHJhdy5vbih3aW5kb3csIFwiZm9sbG93XCIgYXMgYW55LCBldiA9PlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGhpcy5mb2xsb3dGZWVkRnJvbVVyaSgoZXYgYXMgYW55KS5kYXRhKTtcblx0XHRcdFx0fSlcblx0XHRcdCk7XG5cdFx0XHRcblx0XHRcdEhhdC53ZWFyKHRoaXMpXG5cdFx0XHRcdC53ZWFyKFVuZm9sbG93U2lnbmFsLCBrZXkgPT4gRGF0YS5hcmNoaXZlRmVlZChrZXkpKTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0YXN5bmMgY29uc3RydWN0KClcblx0XHR7XG5cdFx0XHRjb25zdCBwYW5lU3dpcGVyID0gbmV3IFBhbmVTd2lwZXIoKTtcblx0XHRcdFxuXHRcdFx0Zm9yIGF3YWl0IChjb25zdCBzY3JvbGwgb2YgRGF0YS5yZWFkU2Nyb2xscygpKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCB2aWV3ZXIgPSBuZXcgU2Nyb2xsTXV4Vmlld2VySGF0KHNjcm9sbCk7XG5cdFx0XHRcdHBhbmVTd2lwZXIuYWRkUGFuZSh2aWV3ZXIuaGVhZCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHBhbmVTd2lwZXIuYWRkUGFuZShuZXcgRm9sbG93ZXJzSGF0KCkuaGVhZCk7XG5cdFx0XHR0aGlzLmhlYWQuYXBwZW5kKHBhbmVTd2lwZXIuaGVhZCk7XG5cdFx0XHRcblx0XHRcdGNvbnN0IGRvdHNIYXQgPSBuZXcgRG90c0hhdCgpO1xuXHRcdFx0ZG90c0hhdC5pbnNlcnQoMik7XG5cdFx0XHRkb3RzSGF0LmhpZ2hsaWdodCgwKTtcblx0XHRcdFxuXHRcdFx0cmF3LmdldChkb3RzSGF0LmhlYWQpKHtcblx0XHRcdFx0cG9zaXRpb246IFwiYWJzb2x1dGVcIixcblx0XHRcdFx0bGVmdDogMCxcblx0XHRcdFx0cmlnaHQ6IDAsXG5cdFx0XHRcdGJvdHRvbTpcblx0XHRcdFx0XHRDQVBBQ0lUT1IgPyBcIjEwNXB4XCIgOlxuXHRcdFx0XHRcdERFTU8gPyAwIDpcblx0XHRcdFx0XHRcIjE1cHhcIixcblx0XHRcdFx0bWFyZ2luOiBcImF1dG9cIixcblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHR0aGlzLmhlYWQuYXBwZW5kKGRvdHNIYXQuaGVhZCk7XG5cdFx0XHRcblx0XHRcdHBhbmVTd2lwZXIudmlzaWJsZVBhbmVDaGFuZ2VkKGluZGV4ID0+XG5cdFx0XHR7XG5cdFx0XHRcdGRvdHNIYXQuaGlnaGxpZ2h0KGluZGV4KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRcblx0XHQvKipcblx0XHQgKiBcblx0XHQgKi9cblx0XHRhc3luYyBmb2xsb3dGZWVkRnJvbVVyaShodG1sVXJpOiBzdHJpbmcpXG5cdFx0e1xuXHRcdFx0Y29uc3QgZm9sbG93VXJpID0gVXRpbC5wYXJzZUh0bWxVcmkoaHRtbFVyaSk7XG5cdFx0XHRpZiAoIWZvbGxvd1VyaSlcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XG5cdFx0XHRjb25zdCB1cmxzID0gYXdhaXQgV2ViZmVlZC5nZXRGZWVkVXJscyhmb2xsb3dVcmkpO1xuXHRcdFx0aWYgKCF1cmxzKVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcblx0XHRcdGNvbnN0IGNoZWNrc3VtID0gYXdhaXQgVXRpbC5nZXRGZWVkQ2hlY2tzdW0oZm9sbG93VXJpKTtcblx0XHRcdGlmICghY2hlY2tzdW0pXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdFxuXHRcdFx0Y29uc3QgZmVlZE1ldGEgPSBhd2FpdCBXZWJmZWVkLmdldEZlZWRNZXRhRGF0YShmb2xsb3dVcmkpO1xuXHRcdFx0Y29uc3QgZmVlZCA9IGF3YWl0IERhdGEud3JpdGVGZWVkKGZlZWRNZXRhLCB7IGNoZWNrc3VtIH0pO1xuXHRcdFx0YXdhaXQgRGF0YS5jYXB0dXJlUmF3RmVlZChmZWVkLCB1cmxzKTtcblx0XHRcdFxuXHRcdFx0SGF0LnNpZ25hbChGb2xsb3dTaWduYWwsIGZlZWQpO1xuXHRcdFx0XG5cdFx0XHRpZiAoQ0FQQUNJVE9SKVxuXHRcdFx0e1xuXHRcdFx0XHRhd2FpdCBUb2FzdC5zaG93KHtcblx0XHRcdFx0XHRwb3NpdGlvbjogXCJjZW50ZXJcIixcblx0XHRcdFx0XHRkdXJhdGlvbjogXCJsb25nXCIsXG5cdFx0XHRcdFx0dGV4dDogU3RyaW5ncy5ub3dGb2xsb3dpbmcgKyBcIiBcIiArIGZlZWQuYXV0aG9yLFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogR2V0cyB0aGUgZnVsbHkgcXVhbGlmaWVkIFVSTCB3aGVyZSB0aGUgcG9zdCByZXNpZGVzLCB3aGljaCBpcyBjYWxjdWxhdGVkXG5cdFx0ICogYnkgY29uY2F0ZW5hdGluZyB0aGUgcG9zdCBwYXRoIHdpdGggdGhlIGNvbnRhaW5pbmcgZmVlZCBVUkwuXG5cdFx0ICovXG5cdFx0Z2V0UG9zdFVybChwb3N0OiBJUG9zdClcblx0XHR7XG5cdFx0XHRjb25zdCBmZWVkRm9sZGVyID0gV2ViZmVlZC5VcmwuZm9sZGVyT2YocG9zdC5mZWVkLnVybCk7XG5cdFx0XHRyZXR1cm4gZmVlZEZvbGRlciArIHBvc3QucGF0aDtcblx0XHR9XG5cdH1cbn1cbiIsIlxubmFtZXNwYWNlIFNxdWFyZXNcbntcblx0LyoqICovXG5cdGV4cG9ydCBjbGFzcyBTY3JvbGxDcmVhdG9ySGF0XG5cdHtcblx0XHRyZWFkb25seSBoZWFkO1xuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdGNvbnN0cnVjdG9yKClcblx0XHR7XG5cdFx0XHR0aGlzLmhlYWQgPSByYXcuZGl2KFxuXHRcdFx0XHRcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG59XG4iLCJcbm5hbWVzcGFjZSBTcXVhcmVzLkNvdmVyXG57XG5cdC8qKiAqL1xuXHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gY292ZXJTY3JvbGxGZWVkVmlld2VySGF0KClcblx0e1xuXHRcdGNvbnN0IGZlZWQ6IElGZWVkID0ge1xuXHRcdFx0a2V5OiAxNjk2OTQ3OTc3MDExLFxuXHRcdFx0dXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6NDMzMzIvcmFjY29vbnMvaW5kZXgudHh0XCIsXG5cdFx0XHRpY29uOiBcImljb24uanBnXCIsXG5cdFx0XHRhdXRob3I6IFwiTXIgUmFjY29vbnNcIixcblx0XHRcdGRlc2NyaXB0aW9uOiBcIlNhbXBsZSBmZWVkIG9mIHJhY2Nvb25zXCIsXG5cdFx0XHRjaGVja3N1bTogXCI/XCJcblx0XHR9O1xuXHRcdFxuXHRcdGNvbnN0IGZlZWRVcmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6NDMzMzIvcmFjY29vbnMvaW5kZXgudHh0XCI7XG5cdFx0Y29uc3QgdXJscyA9IGF3YWl0IFdlYmZlZWQuZ2V0RmVlZFVybHMoZmVlZFVybCk7XG5cdFx0aWYgKCF1cmxzKVxuXHRcdFx0dGhyb3cgXCJObyBmZWVkIGxvYWRlZFwiO1xuXHRcdFxuXHRcdGNvbnN0IGhhdCA9IG5ldyBTY3JvbGxGZWVkVmlld2VySGF0KGZlZWQsIHVybHMpO1xuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kKGhhdC5oZWFkKTtcblx0fVxufVxuIiwiXG5uYW1lc3BhY2UgU3F1YXJlc1xue1xuXHRjb25zdCB0cmFuc2l0aW9uRHVyYXRpb24gPSBcIjAuNXNcIjtcblx0XG5cdC8qKiAqL1xuXHRleHBvcnQgYWJzdHJhY3QgY2xhc3MgU2Nyb2xsVmlld2VySGF0XG5cdHtcblx0XHRyZWFkb25seSBoZWFkO1xuXHRcdHByaXZhdGUgcmVhZG9ubHkgZ3JpZENvbnRhaW5lcjtcblx0XHRwcml2YXRlIHJlYWRvbmx5IGdyaWQ6IEdyaWRIYXQ7XG5cdFx0cHJpdmF0ZSByZWFkb25seSBwdWxsVG9SZWZyZXNoSGF0O1xuXHRcdHByaXZhdGUgc2VsZWN0ZWRHcmlkSXRlbTogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblx0XHRcblx0XHQvKiogKi9cblx0XHRjb25zdHJ1Y3RvcigpXG5cdFx0e1xuXHRcdFx0dGhpcy5ncmlkID0gbmV3IEdyaWRIYXQoKTtcblx0XHRcdGNvbnN0IGJvcmRlclJhZGl1cyA9IChDQVBBQ0lUT1IgfHwgREVNTykgPyBcIjMwcHhcIiA6IDA7XG5cdFx0XHRcblx0XHRcdHRoaXMuaGVhZCA9IHJhdy5kaXYoXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRoZWlnaHQ6IChDQVBBQ0lUT1IgfHwgREVNTykgPyBcIjE3Ny43Nzc3dndcIiA6IFwiMTAwJVwiLFxuXHRcdFx0XHRcdGFsaWduU2VsZjogXCJjZW50ZXJcIixcblx0XHRcdFx0XHRib3JkZXJSYWRpdXMsXG5cdFx0XHRcdFx0b3ZlcmZsb3c6IFwiaGlkZGVuXCIsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHRoaXMuZ3JpZENvbnRhaW5lciA9IHJhdy5kaXYoXG5cdFx0XHRcdFx0XCJncmlkLWNvbnRhaW5lclwiLFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGhlaWdodDogXCIxMDAlXCIsXG5cdFx0XHRcdFx0XHRib3JkZXJSYWRpdXMsXG5cdFx0XHRcdFx0XHRvdmVyZmxvdzogXCJoaWRkZW5cIixcblx0XHRcdFx0XHRcdHRyYW5zaXRpb25EdXJhdGlvbixcblx0XHRcdFx0XHRcdHRyYW5zaXRpb25Qcm9wZXJ0eTogXCJ0cmFuc2Zvcm0sIG9wYWNpdHlcIixcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCksXG5cdFx0XHRcdCEoQ0FQQUNJVE9SIHx8IERFTU8pICYmIHJhdy5kaXYoXG5cdFx0XHRcdFx0RG9jay5ib3R0b21SaWdodCgxMCksXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ekluZGV4OiAxLFxuXHRcdFx0XHRcdFx0Y29sb3I6IFwid2hpdGVcIixcblx0XHRcdFx0XHRcdGJvcmRlclJhZGl1czogXCIxMDAlXCIsXG5cdFx0XHRcdFx0XHRwYWRkaW5nOiBcIjEwcHhcIixcblx0XHRcdFx0XHRcdHdpZHRoOiBcIjUwcHhcIixcblx0XHRcdFx0XHRcdGhlaWdodDogXCI1MHB4XCIsXG5cdFx0XHRcdFx0XHRsaW5lSGVpZ2h0OiBcIjMzcHhcIixcblx0XHRcdFx0XHRcdHRleHRBbGlnbjogXCJjZW50ZXJcIixcblx0XHRcdFx0XHRcdGZvbnRTaXplOiBcIjI1cHhcIixcblx0XHRcdFx0XHRcdGZvbnRXZWlnaHQ6IDcwMCxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFN0eWxlLmJhY2tncm91bmRPdmVybGF5KCksXG5cdFx0XHRcdFx0U3R5bGUuY2xpY2thYmxlLFxuXHRcdFx0XHRcdHRg4oa7YCxcblx0XHRcdFx0XHRyYXcub24oXCJjbGlja1wiLCAoKSA9PiB0aGlzLmhhbmRsZVJlZnJlc2hJbm5lcigpKSxcblx0XHRcdFx0KSxcblx0XHRcdFx0cmF3LmdldCh0aGlzLnB1bGxUb1JlZnJlc2hIYXQgPSBuZXcgUHVsbFRvUmVmcmVzaEhhdCh0aGlzLmdyaWQuaGVhZCkpKFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG5cdFx0XHRcdFx0XHRib3R0b206IFwiMjBweFwiLFxuXHRcdFx0XHRcdFx0bGVmdDogMCxcblx0XHRcdFx0XHRcdHJpZ2h0OiAwLFxuXHRcdFx0XHRcdFx0bWFyZ2luOiBcImF1dG9cIixcblx0XHRcdFx0XHR9XG5cdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0XHRcblx0XHRcdEhhdC53ZWFyKHRoaXMpO1xuXHRcdFx0dGhpcy5jb25zdHJ1Y3RHcmlkKCk7XG5cdFx0XHR0aGlzLnNob3dHcmlkKHRydWUpO1xuXHRcdFx0dGhpcy5wdWxsVG9SZWZyZXNoSGF0Lm9uUmVmcmVzaCgoKSA9PiB0aGlzLmhhbmRsZVJlZnJlc2hJbm5lcigpKTtcblx0XHRcdHRoaXMuZ3JpZENvbnRhaW5lci5hcHBlbmQodGhpcy5ncmlkLmhlYWQpO1xuXHRcdH1cblx0XHRcblx0XHQvKiogKi9cblx0XHRwcm90ZWN0ZWQgYWJzdHJhY3QgZ2V0UG9zdChpbmRleDogbnVtYmVyKTogUmV0dXJuVHlwZTxSZW5kZXJGbj47XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0cHJvdGVjdGVkIGFic3RyYWN0IGhhbmRsZVJlZnJlc2goKTogUHJvbWlzZTx2b2lkPjtcblx0XHRcblx0XHQvKiogKi9cblx0XHRwcml2YXRlIGFzeW5jIGhhbmRsZVJlZnJlc2hJbm5lcigpXG5cdFx0e1xuXHRcdFx0YXdhaXQgdGhpcy5oYW5kbGVSZWZyZXNoKCk7XG5cdFx0XHR0aGlzLmdyaWQudHJ5QXBwZW5kUG9zdGVycygxKTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0cHJvdGVjdGVkIGFic3RyYWN0IGdldFBhZ2VJbmZvKGluZGV4OiBudW1iZXIpOiBQcm9taXNlPHtcblx0XHRcdHJlYWRvbmx5IGhlYWQ6IEhUTUxFbGVtZW50W107XG5cdFx0XHRyZWFkb25seSBzZWN0aW9uczogSFRNTEVsZW1lbnRbXTtcblx0XHRcdHJlYWRvbmx5IGZlZWQ6IElGZWVkO1xuXHRcdH0+O1xuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdHByb3RlY3RlZCBhYnN0cmFjdCBoYW5kbGVQb3N0VmlzaXRlZChpbmRleDogbnVtYmVyKTogdm9pZCB8IFByb21pc2U8dm9pZD47XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0cHJpdmF0ZSBjb25zdHJ1Y3RHcmlkKClcblx0XHR7XG5cdFx0XHR0aGlzLmdyaWQuaGVhZC5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcImluaGVyaXRcIjtcblx0XHRcdHRoaXMuZ3JpZC5oYW5kbGVSZW5kZXIoaW5kZXggPT4gdGhpcy5nZXRQb3N0KGluZGV4KSk7XG5cdFx0XHR0aGlzLmdyaWQuaGFuZGxlU2VsZWN0KGFzeW5jIChlLCBpbmRleCkgPT5cblx0XHRcdHtcblx0XHRcdFx0aWYgKHRoaXMuc2VsZWN0ZWRHcmlkSXRlbSlcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLnNlbGVjdGVkR3JpZEl0ZW0gPSBlO1xuXHRcdFx0XHR0aGlzLnNob3dQYWdlKGluZGV4KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRcblx0XHQvKiogKi9cblx0XHRwcml2YXRlIGFzeW5jIHNob3dQYWdlKGluZGV4OiBudW1iZXIpXG5cdFx0e1xuXHRcdFx0Y29uc3QgcGFnZUluZm8gPSBhd2FpdCB0aGlzLmdldFBhZ2VJbmZvKGluZGV4KTtcblx0XHRcdGNvbnN0IHBhZ2VIYXQgPSBuZXcgUGFnZUhhdChwYWdlSW5mby5oZWFkLCBwYWdlSW5mby5zZWN0aW9ucywgcGFnZUluZm8uZmVlZCk7XG5cdFx0XHRcblx0XHRcdHJhdy5nZXQocGFnZUhhdCkoXG5cdFx0XHRcdERvY2suY292ZXIoKSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHRyYW5zaXRpb25EdXJhdGlvbixcblx0XHRcdFx0XHR0cmFuc2l0aW9uUHJvcGVydHk6IFwidHJhbnNmb3JtXCIsXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoMTEwJSlcIixcblx0XHRcdFx0fSxcblx0XHRcdFx0cmF3Lm9uKFwiY29ubmVjdGVkXCIsICgpID0+IHNldFRpbWVvdXQoYXN5bmMgKCkgPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdGZvciAoY29uc3QgZSBvZiBRdWVyeS5hbmNlc3RvcnModGhpcy5oZWFkKSlcblx0XHRcdFx0XHRcdGlmIChlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG5cdFx0XHRcdFx0XHRcdGUuY2xhc3NMaXN0LmFkZChub092ZXJmbG93Q2xhc3MpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGF3YWl0IFVJLndhaXQoMSk7XG5cdFx0XHRcdFx0cGFnZUhhdC5oZWFkLnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlWSgwKVwiO1xuXHRcdFx0XHRcdGF3YWl0IFVJLndhaXRUcmFuc2l0aW9uRW5kKHBhZ2VIYXQuaGVhZCk7XG5cdFx0XHRcdFx0dGhpcy5ncmlkQ29udGFpbmVyLnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IFwiMHNcIjtcblx0XHRcdFx0fSkpLFxuXHRcdFx0XHRyYXcub24odGhpcy5ncmlkLmhlYWQsIFwic2Nyb2xsXCIsIGFzeW5jICgpID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAocGFnZUhhdC5oZWFkLmlzQ29ubmVjdGVkKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGF3YWl0IHBhZ2VIYXQuZm9yY2VSZXRyYWN0KCk7XG5cdFx0XHRcdFx0XHR0aGlzLnNob3dHcmlkKHRydWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdCk7XG5cdFx0XHRcblx0XHRcdHBhZ2VIYXQub25SZXRyYWN0KHBjdCA9PiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IHMgPSB0aGlzLmdyaWRDb250YWluZXIuc3R5bGU7XG5cdFx0XHRcdHMudHJhbnNmb3JtID0gdHJhbnNsYXRlWihwY3QgKiB0cmFuc2xhdGVaTWF4ICsgXCJweFwiKTtcblx0XHRcdFx0cy5vcGFjaXR5ID0gKDEgLSBwY3QpLnRvU3RyaW5nKCk7XG5cdFx0XHR9KSk7XG5cdFx0XHRcblx0XHRcdGNvbnN0IGRpc2Nvbm5lY3RlZCA9IGFzeW5jICgpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGlmICh0aGlzLnNlbGVjdGVkR3JpZEl0ZW0pXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjb25zdCBzID0gdGhpcy5zZWxlY3RlZEdyaWRJdGVtLnN0eWxlO1xuXHRcdFx0XHRcdHMudHJhbnNpdGlvbkR1cmF0aW9uID0gXCIwLjc1c1wiO1xuXHRcdFx0XHRcdHMudHJhbnNpdGlvblByb3BlcnR5ID0gXCJvcGFjaXR5LCBmaWx0ZXJcIjtcblx0XHRcdFx0XHQvLyEgVGhlc2UgdHJhbnNpdGlvbnMgYnJlYWsgYWZ0ZXIgYSBmZXcgb3BlbmluZ3MgYW5kXG5cdFx0XHRcdFx0Ly8hIGNsb3NpbmdzIG9uIG1vYmlsZSBTYWZhcmkuIElzIHRoaXMgYSBidWcgaW4gdGhlIGVuZ2luZT9cblx0XHRcdFx0XHRhcHBseVZpc2l0ZWRTdHlsZSh0aGlzLnNlbGVjdGVkR3JpZEl0ZW0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHR0aGlzLnNlbGVjdGVkR3JpZEl0ZW0gPSBudWxsO1xuXHRcdFx0XHR0aGlzLmdyaWRDb250YWluZXIuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gdHJhbnNpdGlvbkR1cmF0aW9uO1xuXHRcdFx0XHRcblx0XHRcdFx0Zm9yIChjb25zdCBlIG9mIFF1ZXJ5LmFuY2VzdG9ycyh0aGlzLmhlYWQpKVxuXHRcdFx0XHRcdGlmIChlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG5cdFx0XHRcdFx0XHRlLmNsYXNzTGlzdC5yZW1vdmUobm9PdmVyZmxvd0NsYXNzKTtcblx0XHRcdFx0XG5cdFx0XHRcdGNvbnN0IGluZm8gPSB0aGlzLmdldFBvc3QoaW5kZXgpO1xuXHRcdFx0XHRpZiAoaW5mbylcblx0XHRcdFx0XHR0aGlzLmhhbmRsZVBvc3RWaXNpdGVkKGluZGV4KTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0cGFnZUhhdC5vbkRpc2Nvbm5lY3QoZGlzY29ubmVjdGVkKTtcblx0XHRcdFxuXHRcdFx0Ly8hIFRlbXAgZml4XG5cdFx0XHRhd2FpdCBVSS53YWl0KDEwMCk7XG5cdFx0XHR0aGlzLmdyaWRDb250YWluZXIuYWZ0ZXIocGFnZUhhdC5oZWFkKTtcblx0XHRcdGF3YWl0IFVJLndhaXQoMTAwKTtcblx0XHRcdFxuXHRcdFx0dGhpcy5zaG93R3JpZChmYWxzZSk7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdHByaXZhdGUgc2hvd0dyaWQoc2hvdzogYm9vbGVhbilcblx0XHR7XG5cdFx0XHRjb25zdCBzID0gdGhpcy5ncmlkQ29udGFpbmVyLnN0eWxlO1xuXHRcdFx0cy50cmFuc2l0aW9uRHVyYXRpb24gPSB0cmFuc2l0aW9uRHVyYXRpb247XG5cdFx0XHRzLnRyYW5zZm9ybSA9IHRyYW5zbGF0ZVooc2hvdyA/IFwiMFwiIDogdHJhbnNsYXRlWk1heCArIFwicHhcIik7XG5cdFx0XHRzLm9wYWNpdHkgPSBzaG93ID8gXCIxXCIgOiBcIjBcIjtcblx0XHR9XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBBIHNwZWNpYWxpemF0aW9uIG9mIHRoZSBTY3JvbGxWaWV3ZXJIYXQgdGhhdCBzdXBwb3J0cyBzY2VuYXJpb3Mgd2hlcmVcblx0ICogbXVsdGlwbGUgZmVlZHMgYXJlIG11bHRpcGxleGVkIGludG8gYSBzaW5nbGUgdmlldy5cblx0ICovXG5cdGV4cG9ydCBjbGFzcyBTY3JvbGxNdXhWaWV3ZXJIYXQgZXh0ZW5kcyBTY3JvbGxWaWV3ZXJIYXRcblx0e1xuXHRcdC8qKiAqL1xuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgc2Nyb2xsOiBJU2Nyb2xsKVxuXHRcdHtcblx0XHRcdHN1cGVyKCk7XG5cdFx0XHR0aGlzLmZvcmVncm91bmRGZXRjaGVyID0gbmV3IEZvcmVncm91bmRGZXRjaGVyKCk7XG5cdFx0fVxuXHRcdFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgZm9yZWdyb3VuZEZldGNoZXI7XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0cHJvdGVjdGVkIGFzeW5jIGhhbmRsZVJlZnJlc2goKVxuXHRcdHtcblx0XHRcdGF3YWl0IHRoaXMuZm9yZWdyb3VuZEZldGNoZXIuZmV0Y2goKTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0cHJvdGVjdGVkIGdldFBvc3QoaW5kZXg6IG51bWJlcilcblx0XHR7XG5cdFx0XHRpZiAoaW5kZXggPj0gRGF0YS5yZWFkU2Nyb2xsUG9zdENvdW50KHRoaXMuc2Nyb2xsLmtleSkpXG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gKGFzeW5jICgpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGJsb2NrOlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc3QgcG9zdCA9IGF3YWl0IERhdGEucmVhZFNjcm9sbFBvc3QodGhpcy5zY3JvbGwua2V5LCBpbmRleCk7XG5cdFx0XHRcdFx0aWYgKHBvc3QgPT09IG51bGwpXG5cdFx0XHRcdFx0XHRicmVhayBibG9jaztcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRjb25zdCB1cmwgPSBIYXQub3Zlcih0aGlzLCBSb290SGF0KS5nZXRQb3N0VXJsKHBvc3QpO1xuXHRcdFx0XHRcdGlmICghdXJsKVxuXHRcdFx0XHRcdFx0YnJlYWsgYmxvY2s7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc3QgcG9zdGVyID0gYXdhaXQgV2ViZmVlZC5nZXRQb3N0ZXJGcm9tVXJsKHVybCk7XG5cdFx0XHRcdFx0aWYgKCFwb3N0ZXIpXG5cdFx0XHRcdFx0XHRicmVhayBibG9jaztcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRyZXR1cm4gcG9zdC52aXNpdGVkID8gXG5cdFx0XHRcdFx0XHRhcHBseVZpc2l0ZWRTdHlsZShwb3N0ZXIpIDpcblx0XHRcdFx0XHRcdHBvc3Rlcjtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuIFdlYmZlZWQuZ2V0RXJyb3JQb3N0ZXIoKTtcblx0XHRcdH0pKCk7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdHByb3RlY3RlZCBhc3luYyBnZXRQYWdlSW5mbyhpbmRleDogbnVtYmVyKVxuXHRcdHtcblx0XHRcdGNvbnN0IHBvc3QgPSBhd2FpdCBEYXRhLnJlYWRTY3JvbGxQb3N0KHRoaXMuc2Nyb2xsLmtleSwgaW5kZXgpO1xuXHRcdFx0aWYgKCFwb3N0KVxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoKTtcblx0XHRcdFxuXHRcdFx0Y29uc3Qgcm9vdCA9IEhhdC5vdmVyKHRoaXMsIFJvb3RIYXQpO1xuXHRcdFx0Y29uc3QgcG9zdFVybCA9IHJvb3QuZ2V0UG9zdFVybChwb3N0KSB8fCBcIlwiO1xuXHRcdFx0Y29uc3QgcGFnZSA9IGF3YWl0IFdlYmZlZWQuZ2V0UGFnZUZyb21VcmwocG9zdFVybCk7XG5cdFx0XHRjb25zdCBoZWFkID0gcGFnZT8uaGVhZCB8fCBbXTtcblx0XHRcdGNvbnN0IHNlY3Rpb25zOiBIVE1MRWxlbWVudFtdID0gcGFnZSA/XG5cdFx0XHRcdHBhZ2Uuc2VjdGlvbnMuc2xpY2UoKSA6XG5cdFx0XHRcdFtXZWJmZWVkLmdldEVycm9yUG9zdGVyKCldO1xuXHRcdFx0XG5cdFx0XHRjb25zdCBmZWVkID0gYXdhaXQgRGF0YS5yZWFkRmVlZChwb3N0LmZlZWQua2V5KTtcblx0XHRcdGlmICghZmVlZClcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCk7XG5cdFx0XHRcblx0XHRcdHJldHVybiB7IGhlYWQsIHNlY3Rpb25zLCBmZWVkIH07XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdHByb3RlY3RlZCBhc3luYyBoYW5kbGVQb3N0VmlzaXRlZChpbmRleDogbnVtYmVyKVxuXHRcdHtcblx0XHRcdGNvbnN0IHBvc3QgPSBhd2FpdCBEYXRhLnJlYWRTY3JvbGxQb3N0KHRoaXMuc2Nyb2xsLmtleSwgaW5kZXgpO1xuXHRcdFx0aWYgKHBvc3QpXG5cdFx0XHR7XG5cdFx0XHRcdHBvc3QudmlzaXRlZCA9IHRydWU7XG5cdFx0XHRcdERhdGEud3JpdGVQb3N0KHBvc3QpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRcblx0LyoqXG5cdCAqIEEgc3BlY2lhbGl6YXRpb24gb2YgdGhlIFNjcm9sbFZpZXdlckhhdCB0aGF0IHN1cHBvcnRzIHNjZW5hcmlvcyB3aGVyZVxuXHQgKiBhIHNpbmdsZSBmZWVkIGlzIGRpc3BsYXllZCB3aXRoaW4gYSBzaW5nbGUgdmlldy5cblx0ICovXG5cdGV4cG9ydCBjbGFzcyBTY3JvbGxGZWVkVmlld2VySGF0IGV4dGVuZHMgU2Nyb2xsVmlld2VySGF0XG5cdHtcblx0XHQvKiogKi9cblx0XHRjb25zdHJ1Y3Rvcihcblx0XHRcdHByaXZhdGUgcmVhZG9ubHkgZmVlZDogSUZlZWQsXG5cdFx0XHRwcml2YXRlIHJlYWRvbmx5IHVybHM6IHN0cmluZ1tdKVxuXHRcdHtcblx0XHRcdHN1cGVyKCk7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdHByb3RlY3RlZCBhc3luYyBoYW5kbGVSZWZyZXNoKClcblx0XHR7XG5cdFx0XHRcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0cHJvdGVjdGVkIGdldFBvc3QoaW5kZXg6IG51bWJlcilcblx0XHR7XG5cdFx0XHRpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMudXJscy5sZW5ndGgpXG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XG5cdFx0XHRjb25zdCB1cmwgPSB0aGlzLnVybHNbaW5kZXhdO1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gKGFzeW5jICgpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IG1heWJlUG9zdGVyID0gYXdhaXQgV2ViZmVlZC5nZXRQb3N0ZXJGcm9tVXJsKHVybCk7XG5cdFx0XHRcdHJldHVybiBtYXliZVBvc3RlciB8fCBXZWJmZWVkLmdldEVycm9yUG9zdGVyKCk7XG5cdFx0XHR9KSgpO1xuXHRcdH1cblx0XHRcblx0XHQvKiogKi9cblx0XHRwcm90ZWN0ZWQgYXN5bmMgZ2V0UGFnZUluZm8oaW5kZXg6IG51bWJlcilcblx0XHR7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRoZWFkOiBbXSxcblx0XHRcdFx0c2VjdGlvbnM6IFtdLFxuXHRcdFx0XHRmZWVkOiB0aGlzLmZlZWQsXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRcblx0XHQvKiogKi9cblx0XHRwcm90ZWN0ZWQgaGFuZGxlUG9zdFZpc2l0ZWQoaW5kZXg6IG51bWJlcikgeyB9XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRmdW5jdGlvbiBhcHBseVZpc2l0ZWRTdHlsZShlOiBIVE1MRWxlbWVudClcblx0e1xuXHRcdGNvbnN0IHMgPSBlLnN0eWxlO1xuXHRcdHMuZmlsdGVyID0gXCJzYXR1cmF0ZSgwKSBicmlnaHRuZXNzKDAuNClcIjtcblx0XHRyZXR1cm4gZTtcblx0fVxuXHRcblx0Y29uc3QgdHJhbnNsYXRlWiA9IChhbW91bnQ6IHN0cmluZykgPT4gYHBlcnNwZWN0aXZlKDEwcHgpIHRyYW5zbGF0ZVooJHthbW91bnR9KWA7XG5cdGNvbnN0IHRyYW5zbGF0ZVpNYXggPSAtMztcblx0XG5cdGNvbnN0IG5vT3ZlcmZsb3dDbGFzcyA9IHJhdy5jc3Moe1xuXHRcdG92ZXJmbG93OiBcImhpZGRlbiAhXCJcblx0fSk7XG59XG4iLCJcbm5hbWVzcGFjZSBTcXVhcmVzLkluc3RhZ3JhbVxue1xuXHQvKipcblx0ICogRGVzY3JpYmVzIHRoZSBmb3JtYXQgb2YgdGhlIGZpbGUgaW50aGUgY29udGVudC9wb3N0c18xLmpzb24gZmlsZVxuXHQgKiBpbiB0aGUgZXhwb3J0ZWQgZGF0YSBwYWNrYWdlLlxuXHQgKi9cblx0ZXhwb3J0IHR5cGUgUG9zdHNKc29uID0gSVBvc3RKc29uW107XG5cdFxuXHQvKiogKi9cblx0ZXhwb3J0IGludGVyZmFjZSBJUG9zdEpzb25cblx0e1xuXHRcdG1lZGlhOiBJUG9zdE1lZGlhW107XG5cdH1cblx0XG5cdC8qKiAqL1xuXHRleHBvcnQgaW50ZXJmYWNlIElQb3N0TWVkaWFcblx0e1xuXHRcdHVyaTogc3RyaW5nO1xuXHRcdGNyZWF0aW9uX3RpbWVzdGFtcDogbnVtYmVyO1xuXHRcdHRpdGxlOiBzdHJpbmc7XG5cdH1cbn1cbiIsIlxubmFtZXNwYWNlIFNxdWFyZXNcbntcblx0LyoqICovXG5cdGV4cG9ydCBuYW1lc3BhY2UgQ29sb3Jcblx0e1xuXHRcdGV4cG9ydCBsZXQgZGVmYXVsdEh1ZSA9IDIxNTtcblx0XHRcblx0XHQvKiogKi9cblx0XHRleHBvcnQgaW50ZXJmYWNlIElDb2xvclxuXHRcdHtcblx0XHRcdHJlYWRvbmx5IGg6IG51bWJlcjtcblx0XHRcdHJlYWRvbmx5IHM6IG51bWJlcjtcblx0XHRcdHJlYWRvbmx5IGw6IG51bWJlcjtcblx0XHRcdHJlYWRvbmx5IGE/OiBudW1iZXI7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdGV4cG9ydCBmdW5jdGlvbiBmcm9tKHZhbHVlczogUGFydGlhbDxJQ29sb3I+KVxuXHRcdHtcblx0XHRcdGNvbnN0IGggPSAoQXJyYXkuaXNBcnJheSh2YWx1ZXMpID8gdmFsdWVzLmF0KDApIDogdmFsdWVzLmgpID8/IGRlZmF1bHRIdWU7XG5cdFx0XHRjb25zdCBzID0gKEFycmF5LmlzQXJyYXkodmFsdWVzKSA/IHZhbHVlcy5hdCgxKSA6IHZhbHVlcy5zKSA/PyA1MDtcblx0XHRcdGNvbnN0IGwgPSAoQXJyYXkuaXNBcnJheSh2YWx1ZXMpID8gdmFsdWVzLmF0KDIpIDogdmFsdWVzLmwpID8/IDUwO1xuXHRcdFx0Y29uc3QgYSA9IEFycmF5LmlzQXJyYXkodmFsdWVzKSA/IDEgOiB2YWx1ZXMuYSA/PyAxO1xuXHRcdFx0cmV0dXJuIGEgPT09IDEgP1xuXHRcdFx0XHRgaHNsKCR7aH0sICR7c30lLCAke2x9JSlgIDpcblx0XHRcdFx0YGhzbGEoJHtofSwgJHtzfSUsICR7bH0lLCAke2F9KWA7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdGV4cG9ydCBmdW5jdGlvbiB3aGl0ZShhbHBoYSA9IDEpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIGFscGhhID09PSAxID8gXCJ3aGl0ZVwiIDogYHJnYmEoMjU1LCAyNTUsIDI1NSwgJHthbHBoYX0pYDtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGJsYWNrKGFscGhhID0gMSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gYWxwaGEgPT09IDEgPyBcImJsYWNrXCIgOiBgcmdiYSgwLCAwLCAwLCAke2FscGhhfSlgO1xuXHRcdH1cblx0XHRcblx0XHQvKiogKi9cblx0XHRleHBvcnQgZnVuY3Rpb24gZ3JheSh2YWx1ZSA9IDEyOCwgYWxwaGEgPSAxKVxuXHRcdHtcblx0XHRcdHJldHVybiBhbHBoYSA9PT0gMSA/XG5cdFx0XHRcdGByZ2IoJHt2YWx1ZX0sICR7dmFsdWV9LCAke3ZhbHVlfSlgIDpcblx0XHRcdFx0YHJnYmEoJHt2YWx1ZX0sICR7dmFsdWV9LCAke3ZhbHVlfSwgJHthbHBoYX0pYDtcblx0XHR9XG5cdH1cbn1cbiIsIlxubmFtZXNwYWNlIFNxdWFyZXNcbntcblx0LyoqXG5cdCAqIE5hbWVzcGFjZSBvZiBmdW5jdGlvbnMgZm9yIGNvbnRhaW5lciBxdWVyeSB1bml0cy5cblx0ICovXG5cdGV4cG9ydCBuYW1lc3BhY2UgQ3Fcblx0e1xuXHRcdC8qKlxuXHRcdCAqIFxuXHRcdCAqL1xuXHRcdGV4cG9ydCBmdW5jdGlvbiB3aWR0aChhbW91bnQ6IG51bWJlciwgdGFyZ2V0Q29udGFpbmVyQ2xhc3M6IHN0cmluZylcblx0XHR7XG5cdFx0XHRyZXR1cm4gZ2V0UHJvcGVydHkoXCJ3aWR0aFwiLCBcIndcIiwgYW1vdW50LCB0YXJnZXRDb250YWluZXJDbGFzcyk7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFxuXHRcdCAqL1xuXHRcdGV4cG9ydCBmdW5jdGlvbiBoZWlnaHQoYW1vdW50OiBudW1iZXIsIHRhcmdldENvbnRhaW5lckNsYXNzOiBzdHJpbmcpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIGdldFByb3BlcnR5KFwiaGVpZ2h0XCIsIFwiaFwiLCBhbW91bnQsIHRhcmdldENvbnRhaW5lckNsYXNzKTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogXG5cdFx0ICovXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGxlZnQoYW1vdW50OiBudW1iZXIsIHRhcmdldENvbnRhaW5lckNsYXNzOiBzdHJpbmcpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIGdldFByb3BlcnR5KFwibGVmdFwiLCBcIndcIiwgYW1vdW50LCB0YXJnZXRDb250YWluZXJDbGFzcyk7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdGZ1bmN0aW9uIGdldFByb3BlcnR5KFxuXHRcdFx0cHJvcGVydHk6IHN0cmluZyxcblx0XHRcdGF4aXM6IFwid1wiIHwgXCJoXCIsXG5cdFx0XHRhbW91bnQ6IG51bWJlcixcblx0XHRcdGNsczogc3RyaW5nKTogUmF3LlBhcmFtXG5cdFx0e1xuXHRcdFx0aWYgKHN1cHBvcnRzQ29udGFpbmVyVW5pdHMgPT09IG51bGwpXG5cdFx0XHRcdHN1cHBvcnRzQ29udGFpbmVyVW5pdHMgPSByYXcuZGl2KHsgd2lkdGg6IFwiMWNxd1wiIH0pLnN0eWxlLndpZHRoICE9PSBcIlwiO1xuXHRcdFx0XG5cdFx0XHRsZXQgY29udGFpbmVyOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gZSA9PiByYXcub24oXCJjb25uZWN0ZWRcIiwgKCkgPT5cblx0XHRcdHtcblx0XHRcdFx0Y29udGFpbmVyIHx8PSBRdWVyeS5hbmNlc3RvcnMoZSkuZmluZCgoYyk6IGMgaXMgSFRNTEVsZW1lbnQgPT4gXG5cdFx0XHRcdFx0YyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmXG5cdFx0XHRcdFx0Yy5jbGFzc0xpc3QuY29udGFpbnMoY2xzKSkgfHwgbnVsbDtcblx0XHRcdFx0XG5cdFx0XHRcdGlmICghY29udGFpbmVyKVxuXHRcdFx0XHRcdHRocm93IFwiQ29udGFpbmVyIG5vdCBmb3VuZC5cIjtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChzdXBwb3J0c0NvbnRhaW5lclVuaXRzKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29udGFpbmVyLnN0eWxlLmNvbnRhaW5lclR5cGUgPSBcInNpemVcIjtcblx0XHRcdFx0XHRlLnN0eWxlLnNldFByb3BlcnR5KHByb3BlcnR5LCBhbW91bnQgKyBcImNxXCIgKyBheGlzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIFJlc2l6ZS53YXRjaChjb250YWluZXIsICh3LCBoKSA9PlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y29uc3Qgd09ySCA9IGF4aXMgPT09IFwid1wiID8gdyA6IGg7XG5cdFx0XHRcdFx0Y29uc3Qgc3RyaW5naWZpZWQgPSAoKGFtb3VudCAvIDEwMCkgKiB3T3JIKS50b0ZpeGVkKDMpICsgXCJweFwiO1xuXHRcdFx0XHRcdGUuc3R5bGUuc2V0UHJvcGVydHkocHJvcGVydHksIHN0cmluZ2lmaWVkKTtcblx0XHRcdFx0fSwgdHJ1ZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0XG5cdFx0bGV0IHN1cHBvcnRzQ29udGFpbmVyVW5pdHM6IGJvb2xlYW4gfCBudWxsID0gbnVsbDtcblx0fVxufSIsIlxubmFtZXNwYWNlIFNxdWFyZXNcbntcblx0LyoqICovXG5cdGV4cG9ydCBlbnVtIE9yaWdpblxuXHR7XG5cdFx0dG9wTGVmdCA9IFwib3JpZ2luLXRsXCIsXG5cdFx0dG9wID0gXCJvcmlnaW4tdFwiLFxuXHRcdHRvcFJpZ2h0ID0gXCJvcmlnaW4tdHJcIixcblx0XHRsZWZ0ID0gXCJvcmlnaW4tbFwiLFxuXHRcdGNlbnRlciA9IFwib3JpZ2luLWNcIixcblx0XHRyaWdodCA9IFwib3JpZ2luLXJcIixcblx0XHRib3R0b21MZWZ0ID0gXCJvcmlnaW4tYmxcIixcblx0XHRib3R0b20gPSBcIm9yaWdpbi1iXCIsXG5cdFx0Ym90dG9tUmlnaHQgPSBcIm9yaWdpbi1iclwiLFxuXHR9XG59XG4iLCJcbm5hbWVzcGFjZSBTcXVhcmVzXG57XG5cdC8qKlxuXHQgKiBBIG5hbWVzcGFjZSBvZiBjb2xvciB2YWx1ZXMgdGhhdCBkZWZpbmUgdGhlIGNvbG9yIHBhbGV0dGVcblx0ICogdXNlZCBhY3Jvc3MgdGhlIGFwcGxpY2F0aW9uLlxuXHQgKi9cblx0ZXhwb3J0IG5hbWVzcGFjZSBQYWxcblx0e1xuXHRcdGV4cG9ydCBjb25zdCBncmF5MSA9IENvbG9yLmdyYXkoMTgwKTtcblx0XHRleHBvcnQgY29uc3QgZ3JheTIgPSBDb2xvci5ncmF5KDEwMCk7XG5cdFx0ZXhwb3J0IGNvbnN0IGdyYXkzID0gQ29sb3IuZ3JheSg2MCk7XG5cdH1cbn1cbiIsIlxubmFtZXNwYWNlIFNxdWFyZXNcbntcblx0LyoqICovXG5cdGV4cG9ydCBmdW5jdGlvbiBhcHBlbmRDc3NSZXNldCgpXG5cdHtcblx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZChcblx0XHRcdHJhdy5zdHlsZShcblx0XHRcdFx0XCIqXCIsIHtcblx0XHRcdFx0XHRwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLFxuXHRcdFx0XHRcdHBhZGRpbmc6IDAsXG5cdFx0XHRcdFx0bWFyZ2luOiAwLFxuXHRcdFx0XHRcdHpJbmRleDogMCxcblx0XHRcdFx0XHRib3hTaXppbmc6IFwiYm9yZGVyLWJveFwiLFxuXHRcdFx0XHRcdHdlYmtpdEZvbnRTbW9vdGhpbmc6IFwiYW50aWFsaWFzZWRcIixcblx0XHRcdFx0XHRjb2xvcjogXCJpbmhlcml0XCIsXG5cdFx0XHRcdFx0Zm9udFNpemU6IFwiaW5oZXJpdFwiLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcIjpyb290XCIsIHtcblx0XHRcdFx0XHRoZWlnaHQ6IFwiMTAwdmhcIixcblx0XHRcdFx0XHRmb250U2l6ZTogXCIyMHB4XCIsXG5cdFx0XHRcdFx0Zm9udEZhbWlseTogXCJJbnRlciwgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBhdmVuaXIgbmV4dCwgYXZlbmlyLCBzZWdvZSB1aSwgaGVsdmV0aWNhIG5ldWUsIGhlbHZldGljYSwgVWJ1bnR1LCByb2JvdG8sIG5vdG8sIGFyaWFsLCBzYW5zLXNlcmlmXCIsXG5cdFx0XHRcdFx0Y29sb3I6IFwid2hpdGVcIixcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiYmxhY2tcIixcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJCT0RZXCIsIHtcblx0XHRcdFx0XHRoZWlnaHQ6IFwiaW5oZXJpdFwiLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHQvLyBFbGltaW5hdGUgbWFyZ2luIGNvbGxhcHNpbmdcblx0XHRcdFx0XCJBRERSRVNTLCBBUlRJQ0xFLCBBU0lERSwgQkxPQ0tRVU9URSwgREQsIERJViwgRk9STSwgXCIrXG5cdFx0XHRcdFwiSDEsIEgyLCBIMywgSDQsIEg0LCBINiwgSEVBREVSLCBIR1JPVVAsIE9MLCBVTCwgUCwgUFJFLCBTRUNUSU9OXCIsICB7XG5cdFx0XHRcdFx0cGFkZGluZzogXCIwLjAxNnB4IDBcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHQvLyBObyBzY3JvbGxiYXJzIGFueXdoZXJlLi4uIGZvciBub3dcblx0XHRcdFx0XCIqOjotd2Via2l0LXNjcm9sbGJhclwiLCB7XG5cdFx0XHRcdFx0ZGlzcGxheTogXCJub25lXCJcblx0XHRcdFx0fSxcblx0XHRcdClcblx0XHQpO1xuXHR9XG59XG4iLCJcbm5hbWVzcGFjZSBTcXVhcmVzXG57XG5cdGV4cG9ydCBuYW1lc3BhY2UgUmVzaXplXG5cdHtcblx0XHQvKipcblx0XHQgKiBPYnNlcnZlcyB0aGUgcmVzaXppbmcgb2YgdGhlIHBhcnRpY3VsYXIgZWxlbWVudCwgYW5kIGludm9rZXNcblx0XHQgKiB0aGUgc3BlY2lmaWVkIGNhbGxiYWNrIHdoZW4gdGhlIGVsZW1lbnQgaXMgcmVzaXplZC5cblx0XHQgKi9cblx0XHRleHBvcnQgZnVuY3Rpb24gd2F0Y2goXG5cdFx0XHRlOiBIVE1MRWxlbWVudCxcblx0XHRcdGNhbGxiYWNrOiAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpID0+IHZvaWQsXG5cdFx0XHRydW5Jbml0aWFsbHk6IGJvb2xlYW4gPSBmYWxzZSlcblx0XHR7XG5cdFx0XHRpZiAodHlwZW9mIFJlc2l6ZU9ic2VydmVyICE9PSBcInVuZGVmaW5lZFwiKVxuXHRcdFx0e1xuXHRcdFx0XHRuZXcgUmVzaXplT2JzZXJ2ZXIocmVjID0+XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAocmVjLmxlbmd0aCA9PT0gMClcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRjb25zdCBlbnRyeSA9IHJlY1swXTtcblx0XHRcdFx0XHRpZiAoZW50cnkuYm9yZGVyQm94U2l6ZT8ubGVuZ3RoID4gMClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb25zdCBzaXplID0gZW50cnkuYm9yZGVyQm94U2l6ZVswXTtcblx0XHRcdFx0XHRcdGNhbGxiYWNrKHNpemUuaW5saW5lU2l6ZSwgc2l6ZS5ibG9ja1NpemUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc3Qgd2lkdGggPSBlLm9mZnNldFdpZHRoO1xuXHRcdFx0XHRcdFx0Y29uc3QgaGVpZ2h0ID0gZS5vZmZzZXRIZWlnaHQ7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayh3aWR0aCwgaGVpZ2h0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pLm9ic2VydmUoZSwgeyBib3g6IFwiYm9yZGVyLWJveFwiIH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSByYXcuZ2V0KGUpKHJhdy5vbih3aW5kb3csIFwicmVzaXplXCIsICgpID0+XG5cdFx0XHR7XG5cdFx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdGNvbnN0IHdpZHRoID0gZS5vZmZzZXRXaWR0aDtcblx0XHRcdFx0XHRjb25zdCBoZWlnaHQgPSBlLm9mZnNldEhlaWdodDtcblx0XHRcdFx0XHRjYWxsYmFjayh3aWR0aCwgaGVpZ2h0KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KSk7XG5cdFx0XHRcblx0XHRcdGlmIChydW5Jbml0aWFsbHkpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnN0IGV4ZWMgPSAoKSA9PiBjYWxsYmFjayhlLm9mZnNldFdpZHRoLCBlLm9mZnNldEhlaWdodCk7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoZS5pc0Nvbm5lY3RlZClcblx0XHRcdFx0XHRleGVjKCk7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyYXcuZ2V0KGUpKHJhdy5vbihcImNvbm5lY3RlZFwiLCBleGVjKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG4iLCJcbm5hbWVzcGFjZSBTcXVhcmVzXG57XG5cdC8qKlxuXHQgKiBBIG5hbWVzcGFjZSBvZiBmdW5jdGlvbnMgdGhhdCBwcm9kdWNlIGdlbmVyaWMgQ1NTXG5cdCAqIHN0eWxpbmcgdmFsdWVzIHRoYXQgYXJlbid0IHBhcnRpY3VsYXIgdG8gYW55IHRoZW1lLlxuXHQgKi9cblx0ZXhwb3J0IG5hbWVzcGFjZSBTdHlsZVxuXHR7XG5cdFx0LyoqICovXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGJhY2tncm91bmRPdmVybGF5KCk6IFJhdy5QYXJhbVxuXHRcdHtcblx0XHRcdHJldHVybiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgwLCAwLCAwLCAwLjc1KVwiLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRTdHlsZS5iYWNrZHJvcEJsdXIoNSksXG5cdFx0XHRdXG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdGV4cG9ydCBmdW5jdGlvbiBiYWNrZHJvcEJsdXIocGl4ZWxzID0gNSk6IFJhdy5TdHlsZVxuXHRcdHtcblx0XHRcdGNvbnN0IHZhbHVlID0gcGl4ZWxzID4gMCA/IGBibHVyKCR7cGl4ZWxzfXB4KWAgOiBcIm5vbmVcIjtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGJhY2tkcm9wRmlsdGVyOiB2YWx1ZSxcblx0XHRcdFx0d2Via2l0QmFja2Ryb3BGaWx0ZXI6IHZhbHVlLFxuXHRcdFx0fTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0ZXhwb3J0IGNvbnN0IHVuc2VsZWN0YWJsZTogUmF3LlN0eWxlID0ge1xuXHRcdFx0dXNlclNlbGVjdDogXCJub25lXCIsXG5cdFx0XHR3ZWJraXRVc2VyU2VsZWN0OiBcIm5vbmVcIixcblx0XHR9O1xuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdGV4cG9ydCBjb25zdCBwcmVzZW50YXRpb25hbDogUmF3LlN0eWxlID0ge1xuXHRcdFx0Li4udW5zZWxlY3RhYmxlLFxuXHRcdFx0cG9pbnRlckV2ZW50czogXCJub25lXCIsXG5cdFx0XHRjdXJzb3I6IFwiZGVmYXVsdFwiLFxuXHRcdH07XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0ZXhwb3J0IGNvbnN0IGtleWFibGU6IFJhdy5QYXJhbSA9IHtcblx0XHRcdHRhYkluZGV4OiAwLFxuXHRcdFx0b3V0bGluZTogMCxcblx0XHR9O1xuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdGV4cG9ydCBjb25zdCBjbGlja2FibGU6IFJhdy5TdHlsZSA9IHtcblx0XHRcdC4uLnVuc2VsZWN0YWJsZSxcblx0XHRcdGN1cnNvcjogXCJwb2ludGVyXCJcblx0XHR9IGFzIGNvbnN0O1xuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFJldHVybnMgc3R5bGVzIHRoYXQgcHJvZHVjZSBhIGZvbnQgd2VpZ2h0IHdob3NlIHZhbHVlXG5cdFx0ICogbWF5IG9yIG1heSBub3QgYmUgcGVyZmVjdGx5IGRpdmlzaWJsZSBieSAxMDAuXG5cdFx0ICovXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHdlaWdodCh3ZWlnaHQ6IG51bWJlcik6IFJhdy5TdHlsZVxuXHRcdHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdGZvbnRXZWlnaHQ6IHdlaWdodC50b1N0cmluZygpLFxuXHRcdFx0XHQuLi4od2VpZ2h0ICUgMTAwID09PSAwID8ge30gOiB7IGZvbnRWYXJpYXRpb25TZXR0aW5nczogXCInd2dodCcgXCIgKyB3ZWlnaHQgfSlcblx0XHRcdH07XG5cdFx0fVxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIERpc3BsYXlzIHRleHQgYXQgYSBnaXZlbiBmb250IHNpemUgYW5kIHdlaWdodCB0aGF0XG5cdFx0ICogZGVmYXVsdHMgdG8gYmVpbmcgdW5zZWxlY3RhYmxlLlxuXHRcdCAqL1xuXHRcdGV4cG9ydCBmdW5jdGlvbiB0ZXh0KGxhYmVsOiBzdHJpbmcgPSBcIlwiLCBzaXplOiBudW1iZXIgfCBzdHJpbmcgPSAyMCwgd2VpZ2h0PzogbnVtYmVyKTogUmF3LlBhcmFtW11cblx0XHR7XG5cdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRTdHlsZS51bnNlbGVjdGFibGUsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRmb250U2l6ZTogdHlwZW9mIHNpemUgPT09IFwibnVtYmVyXCIgPyBzaXplICsgXCJweFwiIDogc2l6ZSxcblx0XHRcdFx0fSxcblx0XHRcdFx0d2VpZ2h0ID8gU3R5bGUud2VpZ2h0KHdlaWdodCkgOiBudWxsLFxuXHRcdFx0XHRsYWJlbCA/IG5ldyBUZXh0KGxhYmVsKSA6IG51bGwsXG5cdFx0XHRcdGUgPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vIE9ubHkgYXBwbHkgdGhpcyB3ZWFrbHkuIFRoZSBnb2FsIGhlcmUgaXMgdG8gZ2V0IGF3YXkgZnJvbSB0aGUgSS1iZWFtLFxuXHRcdFx0XHRcdC8vIGJ1dCBvdGhlciB1c2VzIG9mIHRoaXMgZnVuY3Rpb24gY291bGQgc3BlY2lmeSBhIHBvaW50ZXIgb3Igc29tZXRoaW5nIGVsc2UsXG5cdFx0XHRcdFx0Ly8gc28gdGhpcyBmdW5jdGlvbiBzaG91bGRuJ3Qgb3ZlcndyaXRlIHRoYXQuXG5cdFx0XHRcdFx0aWYgKGUuc3R5bGUuY3Vyc29yID09PSBcIlwiKVxuXHRcdFx0XHRcdFx0ZS5zdHlsZS5jdXJzb3IgPSBcImRlZmF1bHRcIjtcblx0XHRcdFx0fVxuXHRcdFx0XTtcblx0XHR9XG5cdFx0XG5cdFx0ZXhwb3J0IGNvbnN0IGJvcmRlclJhZGl1c0xhcmdlID0gXCIzMHB4XCI7XG5cdFx0ZXhwb3J0IGNvbnN0IGJvcmRlclJhZGl1c1NtYWxsID0gXCIxMHB4XCI7XG5cdH1cbn1cbiIsIlxubmFtZXNwYWNlIFNxdWFyZXNcbntcblx0LyoqXG5cdCAqIFxuXHQgKi9cblx0ZXhwb3J0IG5hbWVzcGFjZSBVSVxuXHR7XG5cdFx0LyoqICovXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGNvcm5lckFic29sdXRlKGtpbmQ6IFwidGxcIiB8IFwidHJcIiB8IFwiYmxcIiB8IFwiYnJcIilcblx0XHR7XG5cdFx0XHRpZiAoa2luZCA9PT0gXCJ0bFwiKVxuXHRcdFx0XHRyZXR1cm4gcmF3LmdldChVSS5jb3JuZXIoXCJ0bFwiKSkoY29ybmVyU3R5bGVzLCB7IHRvcDogMCwgbGVmdDogMCB9KTtcblx0XHRcdFxuXHRcdFx0aWYgKGtpbmQgPT09IFwidHJcIilcblx0XHRcdFx0cmV0dXJuIHJhdy5nZXQoVUkuY29ybmVyKFwidHJcIikpKGNvcm5lclN0eWxlcywgeyB0b3A6IDAsIHJpZ2h0OiAwIH0pO1xuXHRcdFx0XG5cdFx0XHRlbHNlIGlmIChraW5kID09PSBcImJsXCIpXG5cdFx0XHRcdHJldHVybiByYXcuZ2V0KFVJLmNvcm5lcihcImJsXCIpKShjb3JuZXJTdHlsZXMsIHsgYm90dG9tOiAwLCBsZWZ0OiAwIH0pO1xuXHRcdFx0XG5cdFx0XHRlbHNlIGlmIChraW5kID09PSBcImJyXCIpXG5cdFx0XHRcdHJldHVybiByYXcuZ2V0KFVJLmNvcm5lcihcImJyXCIpKShjb3JuZXJTdHlsZXMsIHsgYm90dG9tOiAwLCByaWdodDogMCB9KTtcblx0XHR9XG5cdFx0XG5cdFx0Y29uc3Qgc2l6ZSA9IHBhcnNlSW50KFN0eWxlLmJvcmRlclJhZGl1c0xhcmdlKTtcblx0XHRjb25zdCBjb3JuZXJTdHlsZXM6IFJhdy5TdHlsZSA9IHtcblx0XHRcdHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG5cdFx0XHR6SW5kZXg6IDEsXG5cdFx0XHR3aWR0aDogc2l6ZSArIFwicHhcIixcblx0XHRcdGhlaWdodDogc2l6ZSArIFwicHhcIixcblx0XHRcdHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLFxuXHRcdH07XG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogUmVuZGVycyBhIHNpbmdsZSBpbnZlcnRlZCByb3VuZGVkIGNvcm5lciBwaWVjZS5cblx0XHQgKi9cblx0XHRleHBvcnQgZnVuY3Rpb24gY29ybmVyKGtpbmQ6IFwidGxcIiB8IFwidHJcIiB8IFwiYmxcIiB8IFwiYnJcIilcblx0XHR7XG5cdFx0XHRsZXQgdG9wID0gMDtcblx0XHRcdGxldCByaWdodCA9IDA7XG5cdFx0XHRsZXQgYm90dG9tID0gMDtcblx0XHRcdGxldCBsZWZ0ID0gMFxuXHRcdFx0XG5cdFx0XHRpZiAoa2luZCA9PT0gXCJ0bFwiKVxuXHRcdFx0XHRib3R0b20gPSByaWdodCA9IC0xMDA7XG5cdFx0XHRcblx0XHRcdGVsc2UgaWYgKGtpbmQgPT09IFwidHJcIilcblx0XHRcdFx0Ym90dG9tID0gbGVmdCA9IC0xMDA7XG5cdFx0XHRcblx0XHRcdGVsc2UgaWYgKGtpbmQgPT09IFwiYmxcIilcblx0XHRcdFx0dG9wID0gcmlnaHQgPSAtMTAwO1xuXHRcdFx0XG5cdFx0XHRlbHNlIGlmIChraW5kID09PSBcImJyXCIpXG5cdFx0XHRcdHRvcCA9IGxlZnQgPSAtMTAwO1xuXHRcdFx0XG5cdFx0XHRyZXR1cm4gcmF3LnNwYW4oXG5cdFx0XHRcdFwiY29ybmVyXCIsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRvdmVyZmxvdzogXCJoaWRkZW5cIixcblx0XHRcdFx0XHR3aWR0aDogXCIxMDBweFwiLFxuXHRcdFx0XHRcdGhlaWdodDogXCIxMDBweFwiLFxuXHRcdFx0XHRcdGNsaXBQYXRoOiBcImluc2V0KDAgMClcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRyYXcuc3Bhbih7XG5cdFx0XHRcdFx0cG9zaXRpb246IFwiYWJzb2x1dGVcIixcblx0XHRcdFx0XHR0b3A6IHRvcCArIFwiJVwiLFxuXHRcdFx0XHRcdHJpZ2h0OiByaWdodCArIFwiJVwiLFxuXHRcdFx0XHRcdGJvdHRvbTogYm90dG9tICsgXCIlXCIsXG5cdFx0XHRcdFx0bGVmdDogbGVmdCArIFwiJVwiLFxuXHRcdFx0XHRcdGJvcmRlclJhZGl1czogXCIxMDAlXCIsXG5cdFx0XHRcdFx0Ym94U2hhZG93OiBcIjAgMCAwIDEwMDBweCBibGFja1wiLFxuXHRcdFx0XHR9KSxcblx0XHRcdCk7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdGV4cG9ydCBmdW5jdGlvbiBzdHJldGNoKCk6IFJhdy5TdHlsZVtdXG5cdFx0e1xuXHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0eyB3aWR0aDogXCItbW96LWF2YWlsYWJsZVwiIH0sXG5cdFx0XHRcdHsgd2lkdGg6IFwiLXdlYmtpdC1maWxsLWF2YWlsYWJsZVwiIH0sXG5cdFx0XHRcdHsgd2lkdGg6IFwiZmlsbC1hdmFpbGFibGVcIiB9LFxuXHRcdFx0XHR7IHdpZHRoOiBcInN0cmV0Y2hcIiB9XG5cdFx0XHRdO1xuXHRcdH1cblx0XHRcblx0XHQvKiogKi9cblx0XHRleHBvcnQgZnVuY3Rpb24gZXNjYXBlKGZuOiAoKSA9PiB2b2lkKTogUmF3LlBhcmFtW11cblx0XHR7XG5cdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHR7IHRhYkluZGV4OiAwIH0sXG5cdFx0XHRcdHJhdy5vbihcImtleWRvd25cIiwgZXYgPT5cblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmIChldi5rZXkgPT09IFwiRXNjYXBlXCIpXG5cdFx0XHRcdFx0XHRmbigpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGNsaWNrKGhhbmRsZXJGbjogKGV2OiBFdmVudCkgPT4gdm9pZCk6IFJhdy5QYXJhbVxuXHRcdHtcblx0XHRcdHJldHVybiBbXG5cdFx0XHRcdGUgPT4gKChlIGFzIGFueSkucm9sZSA9IFwiYnV0dG9uXCIpLFxuXHRcdFx0XHRTdHlsZS5jbGlja2FibGUsXG5cdFx0XHRcdHJhdy5vbihcImNsaWNrXCIsIGhhbmRsZXJGbilcblx0XHRcdF07XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdGV4cG9ydCBmdW5jdGlvbiB3YWl0KG1zID0gMClcblx0XHR7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UociA9PiBzZXRUaW1lb3V0KHIsIG1zKSk7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiB3YWl0Q29ubmVjdGVkKGU6IEhUTUxFbGVtZW50KVxuXHRcdHtcblx0XHRcdGlmICghZS5pc0Nvbm5lY3RlZClcblx0XHRcdFx0YXdhaXQgbmV3IFByb21pc2UociA9PiByYXcuZ2V0KGUpKHJhdy5vbihcImNvbm5lY3RlZFwiLCByKSkpO1xuXHRcdFx0XG5cdFx0XHQvLyBXYWl0IGFuIGFkZGl0aW9uYWwgMW1zIHNvIHRoYXQgdGhlIGVsZW1lbnQgYmVjb21lcyB0cmFuc2l0aW9uLXJlYWR5XG5cdFx0XHRhd2FpdCBuZXcgUHJvbWlzZShyID0+IHNldFRpbWVvdXQociwgMSkpO1xuXHRcdH1cblx0XHRcblx0XHQvKiogKi9cblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gd2FpdFRyYW5zaXRpb25FbmQoZTogRWxlbWVudClcblx0XHR7XG5cdFx0XHRhd2FpdCBuZXcgUHJvbWlzZTx2b2lkPihyID0+IGUuYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgZXYgPT5cblx0XHRcdHtcblx0XHRcdFx0aWYgKGV2LnRhcmdldCA9PT0gZSlcblx0XHRcdFx0XHRyKCk7XG5cdFx0XHR9KSk7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdGV4cG9ydCBmdW5jdGlvbiBub1Njcm9sbEJhcnMoKVxuXHRcdHtcblx0XHRcdHJldHVybiByYXcuc3R5bGUoXG5cdFx0XHRcdFwiKjo6LXdlYmtpdC1zY3JvbGxiYXJcIiwge1xuXHRcdFx0XHRcdGRpc3BsYXk6IFwibm9uZVwiXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdGV4cG9ydCBmdW5jdGlvbiBoaWRlKClcblx0XHR7XG5cdFx0XHRjb25zdCBjbHMgPSBcImhpZGVcIjtcblx0XHRcdFxuXHRcdFx0aWYgKCFoaWRlSGFzUnVuKVxuXHRcdFx0e1xuXHRcdFx0XHRyYXcuc3R5bGUoXCIuXCIgKyBjbHMsIHsgZGlzcGxheTogXCJub25lICFcIiB9KS5hdHRhY2goKTtcblx0XHRcdFx0aGlkZUhhc1J1biA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHJldHVybiBjbHM7XG5cdFx0fVxuXHRcdGxldCBoaWRlSGFzUnVuID0gZmFsc2U7XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHZpc2libGVXaGVuQWxvbmUoKVxuXHRcdHtcblx0XHRcdHJldHVybiByYXcuY3NzKFwiOm5vdCg6b25seS1jaGlsZCkgIVwiLCB7IGRpc3BsYXk6IFwibm9uZVwiIH0pO1xuXHRcdH1cblx0XHRcblx0XHQvKiogKi9cblx0XHRleHBvcnQgZnVuY3Rpb24gdmlzaWJsZVdoZW5Ob3RBbG9uZSgpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIHJhdy5jc3MoXCI6b25seS1jaGlsZCAhXCIsIHsgZGlzcGxheTogXCJub25lXCIgfSk7XG5cdFx0fVxuXHRcdFxuXHRcdC8qKiAqL1xuXHRcdGV4cG9ydCBmdW5jdGlvbiB2aXNpYmxlV2hlbkVtcHR5KHdhdGNoVGFyZ2V0OiBIVE1MRWxlbWVudCk6IFJhdy5QYXJhbVxuXHRcdHtcblx0XHRcdHJldHVybiBbXG5cdFx0XHRcdHdhdGNoVGFyZ2V0LmNoaWxkcmVuLmxlbmd0aCA9PT0gMCA/IFwiXCIgOiBVSS5oaWRlKCksXG5cdFx0XHRcdHJhdy5vbihcImNvbm5lY3RlZFwiLCBldiA9PiBhZGRWaXNpYmlsaXR5T2JzZXJ2ZXIoZXYudGFyZ2V0LCB3YXRjaFRhcmdldCwgdHJ1ZSkpLFxuXHRcdFx0XTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHZpc2libGVXaGVuTm90RW1wdHkod2F0Y2hUYXJnZXQ6IEhUTUxFbGVtZW50KTogUmF3LlBhcmFtXG5cdFx0e1xuXHRcdFx0cmV0dXJuIFtcblx0XHRcdFx0d2F0Y2hUYXJnZXQuY2hpbGRyZW4ubGVuZ3RoID09PSAwID8gVUkuaGlkZSgpIDogXCJcIixcblx0XHRcdFx0cmF3Lm9uKFwiY29ubmVjdGVkXCIsIGV2ID0+IGFkZFZpc2liaWxpdHlPYnNlcnZlcihldi50YXJnZXQsIHdhdGNoVGFyZ2V0LCBmYWxzZSkpLFxuXHRcdFx0XTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0ZnVuY3Rpb24gYWRkVmlzaWJpbGl0eU9ic2VydmVyKFxuXHRcdFx0dmlzaWJpbGl0eVRhcmdldDogTm9kZSB8IG51bGwsXG5cdFx0XHR3YXRjaFRhcmdldDogSFRNTEVsZW1lbnQsXG5cdFx0XHRmb3JFbXB0eTogYm9vbGVhbilcblx0XHR7XG5cdFx0XHRpZiAoISh2aXNpYmlsaXR5VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcblx0XHRcdGNvbnN0IGV4ZWMgPSAoKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRjb25zdCBjaGlsZHJlbiA9IFF1ZXJ5LmNoaWxkcmVuKHdhdGNoVGFyZ2V0KTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChmb3JFbXB0eSAmJiBjaGlsZHJlbi5sZW5ndGggPiAwKVxuXHRcdFx0XHRcdHZpc2liaWxpdHlUYXJnZXQuY2xhc3NMaXN0LmFkZChVSS5oaWRlKCkpO1xuXHRcdFx0XHRcblx0XHRcdFx0ZWxzZSBpZiAoIWZvckVtcHR5ICYmIGNoaWxkcmVuLmxlbmd0aCA9PT0gMClcblx0XHRcdFx0XHR2aXNpYmlsaXR5VGFyZ2V0LmNsYXNzTGlzdC5hZGQoVUkuaGlkZSgpKTtcblx0XHRcdFx0XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR2aXNpYmlsaXR5VGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoVUkuaGlkZSgpKTtcblx0XHRcdH07XG5cdFx0XHRcblx0XHRcdGV4ZWMoKTtcblx0XHRcdFVJLm9uQ2hpbGRyZW5DaGFuZ2VkKHdhdGNoVGFyZ2V0LCBleGVjKTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIG9uQ2hpbGRyZW5DaGFuZ2VkKGU6IEhUTUxFbGVtZW50LCBmbjogKCkgPT4gdm9pZClcblx0XHR7XG5cdFx0XHRuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiBmbigpKS5vYnNlcnZlKGUsIHsgY2hpbGRMaXN0OiB0cnVlIH0pO1xuXHRcdH1cblx0XHRcblx0XHQvKiogKi9cblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gY29sbGFwc2UoZTogSFRNTEVsZW1lbnQpXG5cdFx0e1xuXHRcdFx0Y29uc3QgaGVpZ2h0ID0gZS5vZmZzZXRIZWlnaHQ7XG5cdFx0XHRlLnN0eWxlLm1hcmdpbkJvdHRvbSA9IFwiMHB4XCI7XG5cdFx0XHRlLnN0eWxlLmNsaXBQYXRoID0gXCJpbnNldCgwIDAgMCAwKVwiO1xuXHRcdFx0ZS5zdHlsZS50cmFuc2l0aW9uUHJvcGVydHkgPSBcIm9wYWNpdHksIG1hcmdpbi1ib3R0b20sIGNsaXAtcGF0aFwiO1xuXHRcdFx0ZS5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBcIjAuNXNcIjtcblx0XHRcdGF3YWl0IFVJLndhaXQoKTtcblx0XHRcdGUuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuXHRcdFx0ZS5zdHlsZS5tYXJnaW5Cb3R0b20gPSBcIi1cIiArIGhlaWdodCArIFwicHhcIjtcblx0XHRcdGUuc3R5bGUuY2xpcFBhdGggPSBcImluc2V0KDAgMCAxMDAlIDApXCI7XG5cdFx0XHRhd2FpdCBVSS53YWl0VHJhbnNpdGlvbkVuZChlKTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZhZGUoZTogSFRNTEVsZW1lbnQpXG5cdFx0e1xuXHRcdFx0ZS5zdHlsZS50cmFuc2l0aW9uUHJvcGVydHkgPSBcIm9wYWNpdHlcIjtcblx0XHRcdGUuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gXCIwLjVzXCI7XG5cdFx0XHRlLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcblx0XHRcdFxuXHRcdFx0aWYgKCFlLnN0eWxlLm9wYWNpdHkpXG5cdFx0XHRcdGUuc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xuXHRcdFx0XG5cdFx0XHRhd2FpdCBVSS53YWl0KCk7XG5cdFx0XHRlLnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcblx0XHRcdGF3YWl0IFVJLndhaXRUcmFuc2l0aW9uRW5kKGUpO1xuXHRcdFx0ZS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcblx0XHR9XG5cdH1cbn1cbiIsIlxubmFtZXNwYWNlIFNxdWFyZXNcbntcblx0LyoqICovXG5cdGV4cG9ydCBuYW1lc3BhY2UgV2lkZ2V0XG5cdHtcblx0XHQvKiogKi9cblx0XHRleHBvcnQgZnVuY3Rpb24gZmlsbEJ1dHRvbiguLi5wYXJhbXM6IFJhdy5QYXJhbVtdKVxuXHRcdHtcblx0XHRcdHJldHVybiByYXcuZGl2KFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZGlzcGxheTogXCJpbmxpbmUtYmxvY2tcIixcblx0XHRcdFx0XHRwYWRkaW5nOiBcIjEwcHhcIixcblx0XHRcdFx0XHRib3JkZXJSYWRpdXM6IFwiNXB4XCIsXG5cdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcInJnYmEoMTI4LCAxMjgsIDEyOCwgMC41KVwiLFxuXHRcdFx0XHRcdGZvbnRXZWlnaHQ6IDUwMCxcblx0XHRcdFx0fSxcblx0XHRcdFx0U3R5bGUuY2xpY2thYmxlLFxuXHRcdFx0XHRTdHlsZS5iYWNrZHJvcEJsdXIoNSksXG5cdFx0XHRcdC4uLnBhcmFtc1xuXHRcdFx0KVxuXHRcdH1cblx0XHRcblx0XHQvKiogKi9cblx0XHRleHBvcnQgZnVuY3Rpb24gaG9sbG93QnV0dG9uKG9wdGlvbnM6IHtcblx0XHRcdHRleHQ6IHN0cmluZyxcblx0XHRcdGNsaWNrPzogKGV2OiBFdmVudCkgPT4gdm9pZCxcblx0XHRcdHBhcmFtcz86IFJhdy5QYXJhbSxcblx0XHR9KVxuXHRcdHtcblx0XHRcdHJldHVybiByYXcuZGl2KFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cGFkZGluZzogXCIxNXB4XCIsXG5cdFx0XHRcdFx0Ym9yZGVyOiBcIjJweCBzb2xpZCBcIiArIFBhbC5ncmF5MSxcblx0XHRcdFx0XHRib3JkZXJSYWRpdXM6IFwiMTVweFwiLFxuXHRcdFx0XHRcdGNvbG9yOiBQYWwuZ3JheTEsXG5cdFx0XHRcdFx0dGV4dEFsaWduOiBcImNlbnRlclwiLFxuXHRcdFx0XHRcdGN1cnNvcjogXCJwb2ludGVyXCIsXG5cdFx0XHRcdFx0d2hpdGVTcGFjZTogXCJub3dyYXBcIixcblx0XHRcdFx0fSxcblx0XHRcdFx0b3B0aW9ucy5jbGljayAmJiByYXcub24oXCJjbGlja1wiLCBvcHRpb25zLmNsaWNrKSxcblx0XHRcdFx0U3R5bGUudGV4dChvcHRpb25zLnRleHQsIDIzLCA1MDApLFxuXHRcdFx0KTtcblx0XHR9XG5cdFx0XG5cdFx0LyoqICovXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHVuZGVybGluZVRleHRib3goLi4ucGFyYW1zOiBSYXcuUGFyYW1bXSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gcmF3LmlucHV0KFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0b3V0bGluZTogMCxcblx0XHRcdFx0XHRib3JkZXI6IDAsXG5cdFx0XHRcdFx0cGFkZGluZzogXCIxMHB4IDBcIixcblx0XHRcdFx0XHRib3JkZXJCb3R0b206IFwiMnB4IHNvbGlkIFwiICsgUGFsLmdyYXkyLFxuXHRcdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuXHRcdFx0XHRcdGNvbG9yOiBcIndoaXRlXCIsXG5cdFx0XHRcdFx0ZGlzcGxheTogXCJibG9ja1wiLFxuXHRcdFx0XHRcdGZvbnRTaXplOiBcImluaGVyaXRcIixcblx0XHRcdFx0XHRzcGVsbGNoZWNrOiBmYWxzZSxcblx0XHRcdFx0fSxcblx0XHRcdFx0VUkuc3RyZXRjaCgpLFxuXHRcdFx0XHRwYXJhbXNcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG59XG4iXX0=