import { install } from "./LoaderMiddleware";
import SoundLibrary from "./SoundLibrary";

// Mixin any deprecations
import "./deprecations";

// Create instance of the library
const sound: SoundLibrary = new SoundLibrary();

/**
 * @namespace PIXI
 */

// There's no PIXI object, create it
// library doesn't depend on PIXI strictly
if ((global as any).PIXI === undefined)
{
    throw new Error("pixi.js is required");
}

if (PIXI.loaders !== undefined)
{
    // Install the middleware to support
    // PIXI.loader and new PIXI.loaders.Loader
    install();
}

/**
 * Playing sound files with WebAudio API
 * @namespace PIXI.sound
 */
Object.defineProperty(PIXI, "sound",
{
    get() { return sound; },
});

// Export the default plugin instance
export default sound;
