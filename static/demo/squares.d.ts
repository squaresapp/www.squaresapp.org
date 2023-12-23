declare const DEBUG: boolean;
declare const ELECTRON: boolean;
declare const TAURI: boolean;
declare const MAC: boolean;
declare const WINDOWS: boolean;
declare const LINUX: boolean;
declare const CAPACITOR: boolean;
declare const IOS: boolean;
declare const ANDROID: boolean;
declare const DEMO: boolean;
declare const Moduless: {
    getRunningFunctionName(): string;
};
declare namespace Electron {
    const fs: typeof import("fs");
    const path: typeof import("path");
}
declare namespace Tauri {
    const fs: typeof import("@tauri-apps/api").fs;
    const cli: typeof import("@tauri-apps/api").cli;
    const clipboard: typeof import("@tauri-apps/api").clipboard;
    const dialog: typeof import("@tauri-apps/api").dialog;
    const event: typeof import("@tauri-apps/api").event;
    const globalShortcut: typeof import("@tauri-apps/api").globalShortcut;
    const http: typeof import("@tauri-apps/api").http;
    const invoke: typeof import("@tauri-apps/api").invoke;
    const notification: typeof import("@tauri-apps/api").notification;
    const os: typeof import("@tauri-apps/api").os;
    const path: typeof import("@tauri-apps/api").path;
    const process: typeof import("@tauri-apps/api").process;
    const shell: typeof import("@tauri-apps/api").shell;
    const tauri: typeof import("@tauri-apps/api").tauri;
    const updater: typeof import("@tauri-apps/api").updater;
    const window: typeof import("@tauri-apps/api").window;
}
declare const Capacitor: typeof import("@capacitor/core").Capacitor & {
    platform: string;
};
declare const Toast: typeof import("@capacitor/toast").Toast;
declare const CapClipboard: typeof import("@capacitor/clipboard").Clipboard;
declare const BackgroundFetch: typeof import("@transistorsoft/capacitor-background-fetch").BackgroundFetch;
declare const t: {
    (template: TemplateStringsArray, ...placeholders: (string | HTMLElement)[]): (HTMLElement | Text)[];
    (string: string): Text;
};
declare namespace Squares {
    /**
     * This is the main entry point of the app.
     * When running in Tauri, this function is called from the auto-generated index.html file.
     */
    function startup(): Promise<void>;
}
declare namespace Squares {
    const feedsForDebug: string[];
}
declare namespace Squares {
    const feedsForDemo: string[];
}
declare namespace Squares {
    /** */
    function UnfollowSignal(feedKey: number): void;
    /** */
    function FollowSignal(feed: IFeed): void;
}
declare namespace Squares {
    const enum Strings {
        following = "Following",
        unfollow = "Unfollow",
        nowFollowing = "Now following",
        share = "Share",
        unknownAuthor = "(Author Unknown)"
    }
}
declare namespace Squares {
    /**
     *
     */
    class BackgroundFetcher {
        /** */
        constructor();
    }
}
declare namespace Squares.Data {
    /** */
    interface IReadArrayOptions {
        start?: number;
        limit?: number;
    }
    /** */
    function initialize(): Promise<void>;
    /** */
    function readScrollPostCount(scrollKey: number): number;
    /** */
    function writeScroll(defaults: Partial<IScroll>): Promise<IScroll>;
    /** */
    function writeScrollPost(scrollKey: number, post: IPost): Promise<void>;
    /**
     * Read the scroll object from the file system with the specified key.
     * If the argument is omitted, the first discovered scroll is returned.
     */
    function readScroll(key?: number): Promise<IScroll | null>;
    /** */
    function readScrolls(): AsyncGenerator<IScroll, void, unknown>;
    /** */
    function readScrollPost(scrollKey: number, index: number): Promise<IPost | null>;
    /** */
    function readScrollPosts(scrollKey: number, options?: IReadArrayOptions): AsyncGenerator<IPost, void, unknown>;
    /**
     * Creates a new IFeed object to disk, optionally populated with the
     * specified values, writes it to disk, and returns the constructed object.
     */
    function writeFeed(...defaults: Partial<IFeed>[]): Promise<IFeed>;
    /**
     *
     */
    function readFeed(key: number): Promise<IFeed | null>;
    /**
     * Reads all non-archived feeds from the file system.
     */
    function readFeeds(): AsyncGenerator<IFeed, void, unknown>;
    /** */
    function readFeedPosts(feedKey: number): AsyncGenerator<IPost, void, unknown>;
    /**
     * Moves the feed file to the archive (which is the unfollow operation).
     */
    function archiveFeed(feedKey: number): Promise<void>;
    /**
     * Writes the URLs contained in the specified to the file system, in their full-qualified
     * form, and returns an object that indicates what URLs where added and which ones
     * were removed from the previous time that this function was called.
     *
     * Worth noting that the URLs are expected to be in their fully-qualified form,
     * which is different from how the URLs are typically written in the feed text file.
     */
    function captureRawFeed(feed: IFeed, urls: string[]): Promise<{
        added: string[];
        removed: string[];
    }>;
    /** */
    function readPost(key: number): Promise<IPost | null>;
    /** */
    function writePost(post: Partial<IPost>): Promise<IPost>;
    /**
     * Deletes all data in the data folder.
     * Intended only for debugging purposes.
     */
    function clear(): Promise<void>;
}
declare namespace Squares {
    /**
     * Initializes the app with a list of default feeds, and populates
     * a single scroll with the content contained within those feeds.
     */
    function runDataInitializer(defaultFeedUrls: string[]): Promise<void>;
}
declare namespace Squares {
    /**
     * A namespace of functions which are shared between
     * the ForegroundFetcher and the BackgroundFetcher.
     */
    namespace Fetcher {
        /**
         *
         */
        function updateModifiedFeeds(modifiedFeeds: IFeed[]): Promise<void>;
    }
}
declare namespace Squares {
    /** */
    class ForegroundFetcher {
        /** */
        constructor();
        /**
         * Gets whether there is a fetch operation being carried out.
         */
        get isFetching(): boolean;
        private feedIterator;
        /** */
        fetch(): Promise<void>;
        /** */
        stopFetch(): void;
        private readonly abortControllers;
    }
}
declare namespace Squares {
    /**
     * Represents the IFeed object, as it is stored on disk.
     */
    interface IDiskFeed {
        /**
         * Stores the URL of the text file that contains the feed information.
         */
        url: string;
        /**
         * Stores the location of the avatar associated with the feed, which is
         * extracted from the standard <link rel="icon"> tag.
         */
        icon: string;
        /**
         * Stores the information that was extracted from the <meta name="author">
         * tag that was found on the URL that referenced the feed.
         */
        author: string;
        /**
         * Stores a description of the feed, which is typically the name of the person
         * or organization that owns the feed.
         */
        description: string;
        /**
         * Stores a value which can be used for comparison purposes to see if a
         * feed has been updated.
         */
        checksum: string;
    }
    /** */
    interface IFeed extends IDiskFeed {
        /** */
        key: number;
    }
}
declare namespace Squares {
    /** */
    interface IAbstractPost {
        /**
         *
         */
        visited: boolean;
        /**
         * Stores the path of the feed, relative to the URL of the feed text file.
         */
        path: string;
    }
    /** */
    interface IDiskPost extends IAbstractPost {
        /**
         * Stores the ID of the feed to which this post belongs.
         */
        feed: number;
    }
    /** */
    interface IPost extends IAbstractPost {
        /**
         *
         */
        key: number;
        /**
         * A reference to the feed
         */
        feed: IFeed;
    }
    /** */
    interface IPostFile {
        [key: number]: IDiskPost;
    }
}
declare namespace Squares {
    /** */
    interface IAbstractScroll {
        anchorIndex: number;
    }
    /** */
    interface IDiskScroll extends IAbstractScroll {
        feeds: number[];
    }
    /** */
    interface IScroll extends IAbstractScroll {
        key: number;
        feeds: readonly IFeed[];
    }
}
declare namespace Squares {
    namespace Util {
        /** */
        function getFeedChecksum(feedUrl: string): Promise<string | null>;
        /**
         * Returns the current date in ticks form, but with any incrementation
         * necessary to avoid returning the same ticks value twice.
         */
        function getSafeTicks(): number;
        /**
         * Returns the fully-qualified URL to the icon image
         * specified in the specified feed.
         */
        function getIconUrl(feed: IFeed): string;
        /**
         * Parses URIs as specified in the HTML feeds specification found at:
         * https://www.Squares.org/specs/htmlfeeds/
         */
        function parseHtmlUri(uri: string): string;
        /**
         * Safely parses a string JSON into an object.
         */
        function tryParseJson<T extends object = object>(jsonText: string): T | null;
        /**
         * Returns the environment-specific path to the application data folder.
         */
        function getDataFolder(): Promise<Fila>;
        /** */
        function readClipboardHtmlUri(): Promise<any>;
        /** */
        function readClipboard(): Promise<any>;
        /**
         * Removes problematic CSS attributes from the specified section tag,
         * and ensures that no external CSS is modifying its display propert
         */
        function getSectionSanitizationCss(): Raw.Style;
    }
}
declare namespace Squares {
    /** */
    class DotsHat {
        readonly head: HTMLDivElement;
        /** */
        constructor();
        /** */
        insert(count: number, at?: number): void;
        /** */
        highlight(index: number): void;
    }
}
declare namespace Squares {
    /** */
    class FeedMetaHat {
        readonly head: HTMLDivElement;
        /** */
        constructor(data: IFeed);
        /** */
        private renderButton;
    }
}
declare namespace Squares {
    /** */
    function coverFollowersHat(): void;
}
declare namespace Squares {
    /** */
    class FollowersHat {
        readonly head: HTMLDivElement;
        private readonly feedElements;
        /** */
        constructor();
        /** */
        private handleUnfollow;
        /** */
        private handleFollow;
        /** */
        private construct;
        /** */
        private renderIdentity;
    }
}
declare namespace Squares.Cover {
    /** */
    function coverTilerHat(): void;
}
declare namespace Squares {
    /**
     *
     */
    class GridHat {
        /** */
        readonly head: HTMLDivElement;
        /** */
        private readonly cornersElement;
        /** */
        constructor();
        /** */
        handleRender(fn: RenderFn): void;
        private renderFn;
        /** */
        handleSelect(fn: SelectFn): void;
        private selectFn;
        /**
         * Gets the pixel width of the head element.
         */
        get width(): number;
        private _width;
        /**
         * Gets the pixel height of the head element.
         */
        get height(): number;
        private _height;
        /**
         * Gets or sets the number of posters being displayed in one dimension.
         */
        get size(): number;
        set size(size: number);
        /** */
        private setSizeInner;
        private _size;
        /**
         * Gets the maximum possible size of the Omniview,
         * given the number of previews that are available.
         * A value of 0 indicates that there is no size limit.
         */
        private sizeLimit;
        /**
         * Returns an array of HTMLElement objects that contain the posters
         * that have at least a single pixel visible on the screen.
         */
        getVisiblePosters(): HTMLElement[];
        /** */
        get posterCount(): number;
        /** */
        tryAppendPosters(screenCount: number): Promise<void>;
        /** */
        private updatePosterVisibility;
        private lastVisiblePoster;
        private lastY;
        /** */
        private rowOf;
    }
    /**
     * Returns a poster HTMLElement for the given index in the stream.
     * The function should return null to stop looking for posters at or
     * beyond the specified index.
     */
    type RenderFn = (index: number) => Promise<HTMLElement> | HTMLElement | null;
    /** */
    type SelectFn = (selectedElement: HTMLElement, index: number) => void | Promise<void>;
}
declare namespace Squares.Cover {
    /** */
    function coverStoryHat(): void;
}
declare namespace Squares {
    /** */
    class PageHat {
        private readonly feed;
        readonly head: HTMLDivElement;
        private readonly swiper;
        private readonly scrollable;
        readonly onDisconnect: ((callback: () => void) => void) & {
            off(callback: () => void): void;
        };
        private readonly _onDisconnect;
        readonly onRetract: ((callback: (percent: number) => void) => void) & {
            off(callback: (percent: number) => void): void;
        };
        private readonly _onRetract;
        /** */
        constructor(head: HTMLElement[], sections: HTMLElement[], feed: IFeed);
        /** */
        private setupRetractionTracker;
        /** */
        forceRetract(): Promise<void>;
    }
}
declare namespace Squares {
    /**
     * A class that creates a series of panes that swipe horizontally on mobile.
     */
    class PaneSwiper {
        readonly head: HTMLDivElement;
        /** */
        constructor();
        /** */
        readonly visiblePaneChanged: ((callback: (visiblePaneIndex: number) => void) => void) & {
            off(callback: (visiblePaneIndex: number) => void): void;
        };
        private readonly _visiblePaneChanged;
        /** */
        addPane(element: HTMLElement, at?: number): void;
        /** */
        setVisiblePane(index: number): void;
        /** */
        private updateVisiblePane;
        private lastVisiblePane;
    }
}
declare namespace Squares {
    /** */
    class ProfileHat {
        readonly head: HTMLDivElement;
        /** */
        constructor();
    }
}
declare namespace Squares {
    /** */
    class PullToRefreshHat {
        private readonly target;
        readonly head: HTMLDivElement;
        private readonly symbol;
        private rotationDegress;
        private animation;
        /** */
        constructor(target: HTMLElement);
        readonly onRefresh: ((callback: () => void) => void) & {
            off(callback: () => void): void;
        };
        private readonly _onRefresh;
        /** */
        private handleTargetScroll;
        /** */
        private setAnimationFrame;
        /** */
        setLoadingAnimation(enable: boolean): void;
    }
}
declare namespace Squares {
    /** */
    class RootHat {
        readonly head: HTMLDivElement;
        /** */
        constructor();
        /** */
        construct(): Promise<void>;
        /**
         *
         */
        followFeedFromUri(htmlUri: string): Promise<void>;
        /**
         * Gets the fully qualified URL where the post resides, which is calculated
         * by concatenating the post path with the containing feed URL.
         */
        getPostUrl(post: IPost): string;
    }
}
declare namespace Squares {
    /** */
    class ScrollCreatorHat {
        readonly head: HTMLDivElement;
        /** */
        constructor();
    }
}
declare namespace Squares.Cover {
    /** */
    function coverScrollFeedViewerHat(): Promise<void>;
}
declare namespace Squares {
    /** */
    abstract class ScrollViewerHat {
        readonly head: HTMLDivElement;
        private readonly gridContainer;
        private readonly grid;
        private readonly pullToRefreshHat;
        private selectedGridItem;
        /** */
        constructor();
        /** */
        protected abstract getPost(index: number): ReturnType<RenderFn>;
        /** */
        protected abstract handleRefresh(): Promise<void>;
        /** */
        private handleRefreshInner;
        /** */
        protected abstract getPageInfo(index: number): Promise<{
            readonly head: HTMLElement[];
            readonly sections: HTMLElement[];
            readonly feed: IFeed;
        }>;
        /** */
        protected abstract handlePostVisited(index: number): void | Promise<void>;
        /** */
        private constructGrid;
        /** */
        private showPage;
        /** */
        private showGrid;
    }
    /**
     * A specialization of the ScrollViewerHat that supports scenarios where
     * multiple feeds are multiplexed into a single view.
     */
    class ScrollMuxViewerHat extends ScrollViewerHat {
        private readonly scroll;
        /** */
        constructor(scroll: IScroll);
        private readonly foregroundFetcher;
        /** */
        protected handleRefresh(): Promise<void>;
        /** */
        protected getPost(index: number): Promise<HTMLElement> | null;
        /** */
        protected getPageInfo(index: number): Promise<{
            head: HTMLElement[];
            sections: HTMLElement[];
            feed: IFeed;
        }>;
        /** */
        protected handlePostVisited(index: number): Promise<void>;
    }
    /**
     * A specialization of the ScrollViewerHat that supports scenarios where
     * a single feed is displayed within a single view.
     */
    class ScrollFeedViewerHat extends ScrollViewerHat {
        private readonly feed;
        private readonly urls;
        /** */
        constructor(feed: IFeed, urls: string[]);
        /** */
        protected handleRefresh(): Promise<void>;
        /** */
        protected getPost(index: number): Promise<HTMLElement> | null;
        /** */
        protected getPageInfo(index: number): Promise<{
            head: never[];
            sections: never[];
            feed: IFeed;
        }>;
        /** */
        protected handlePostVisited(index: number): void;
    }
}
declare namespace Squares.Instagram {
    /**
     * Describes the format of the file inthe content/posts_1.json file
     * in the exported data package.
     */
    type PostsJson = IPostJson[];
    /** */
    interface IPostJson {
        media: IPostMedia[];
    }
    /** */
    interface IPostMedia {
        uri: string;
        creation_timestamp: number;
        title: string;
    }
}
declare namespace Squares {
    /** */
    namespace Color {
        let defaultHue: number;
        /** */
        interface IColor {
            readonly h: number;
            readonly s: number;
            readonly l: number;
            readonly a?: number;
        }
        /** */
        function from(values: Partial<IColor>): string;
        /** */
        function white(alpha?: number): string;
        /** */
        function black(alpha?: number): string;
        /** */
        function gray(value?: number, alpha?: number): string;
    }
}
declare namespace Squares {
    /**
     * Namespace of functions for container query units.
     */
    namespace Cq {
        /**
         *
         */
        function width(amount: number, targetContainerClass: string): Raw.Param<Raw.ElementAttribute>;
        /**
         *
         */
        function height(amount: number, targetContainerClass: string): Raw.Param<Raw.ElementAttribute>;
        /**
         *
         */
        function left(amount: number, targetContainerClass: string): Raw.Param<Raw.ElementAttribute>;
    }
}
declare namespace Squares {
    /** */
    enum Origin {
        topLeft = "origin-tl",
        top = "origin-t",
        topRight = "origin-tr",
        left = "origin-l",
        center = "origin-c",
        right = "origin-r",
        bottomLeft = "origin-bl",
        bottom = "origin-b",
        bottomRight = "origin-br"
    }
}
declare namespace Squares {
    /**
     * A namespace of color values that define the color palette
     * used across the application.
     */
    namespace Pal {
        const gray1: string;
        const gray2: string;
        const gray3: string;
    }
}
declare namespace Squares {
    /** */
    function appendCssReset(): void;
}
declare namespace Squares {
    namespace Resize {
        /**
         * Observes the resizing of the particular element, and invokes
         * the specified callback when the element is resized.
         */
        function watch(e: HTMLElement, callback: (width: number, height: number) => void, runInitially?: boolean): void;
    }
}
declare namespace Squares {
    /**
     * A namespace of functions that produce generic CSS
     * styling values that aren't particular to any theme.
     */
    namespace Style {
        /** */
        function backgroundOverlay(): Raw.Param;
        /** */
        function backdropBlur(pixels?: number): Raw.Style;
        /** */
        const unselectable: Raw.Style;
        /** */
        const presentational: Raw.Style;
        /** */
        const keyable: Raw.Param;
        /** */
        const clickable: Raw.Style;
        /**
         * Returns styles that produce a font weight whose value
         * may or may not be perfectly divisible by 100.
         */
        function weight(weight: number): Raw.Style;
        /**
         * Displays text at a given font size and weight that
         * defaults to being unselectable.
         */
        function text(label?: string, size?: number | string, weight?: number): Raw.Param[];
        const borderRadiusLarge = "30px";
        const borderRadiusSmall = "10px";
    }
}
declare namespace Squares {
    /**
     *
     */
    namespace UI {
        /** */
        function cornerAbsolute(kind: "tl" | "tr" | "bl" | "br"): HTMLSpanElement | undefined;
        /**
         * Renders a single inverted rounded corner piece.
         */
        function corner(kind: "tl" | "tr" | "bl" | "br"): HTMLSpanElement;
        /** */
        function stretch(): Raw.Style[];
        /** */
        function escape(fn: () => void): Raw.Param[];
        /** */
        function click(handlerFn: (ev: Event) => void): Raw.Param;
        /** */
        function wait(ms?: number): Promise<unknown>;
        /** */
        function waitConnected(e: HTMLElement): Promise<void>;
        /** */
        function waitTransitionEnd(e: Element): Promise<void>;
        /** */
        function noScrollBars(): Raw.HTMLRawStyleElement;
        /** */
        function hide(): string;
        /** */
        function visibleWhenAlone(): string;
        /** */
        function visibleWhenNotAlone(): string;
        /** */
        function visibleWhenEmpty(watchTarget: HTMLElement): Raw.Param;
        /** */
        function visibleWhenNotEmpty(watchTarget: HTMLElement): Raw.Param;
        /** */
        function onChildrenChanged(e: HTMLElement, fn: () => void): void;
        /** */
        function collapse(e: HTMLElement): Promise<void>;
        /** */
        function fade(e: HTMLElement): Promise<void>;
    }
}
declare namespace Squares {
    /** */
    namespace Widget {
        /** */
        function fillButton(...params: Raw.Param[]): HTMLDivElement;
        /** */
        function hollowButton(options: {
            text: string;
            click?: (ev: Event) => void;
            params?: Raw.Param;
        }): HTMLDivElement;
        /** */
        function underlineTextbox(...params: Raw.Param[]): HTMLInputElement;
    }
}
//# sourceMappingURL=squares.d.ts.map