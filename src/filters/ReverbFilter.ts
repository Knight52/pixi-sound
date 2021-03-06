import Filter from './Filter';
import soundLibrary from '../index';

/**
 * Filter for adding reverb. Refactored from 
 * https://github.com/web-audio-components/simple-reverb/
 *
 * @class ReverbFilter
 * @memberof PIXI.sound.filters
 * @param {Number} [seconds=3] Seconds for reverb
 * @param {Number} [decay=2] The decay length
 * @param {Boolean} [reverse=false] Reverse reverb
 */
export default class ReverbFilter extends Filter
{
    /**
     * The covolver node
     * @name PIXI.sound.filters.ReverbFilter#_convolver
     * @type {ConvolverNode}
     * @private
     */
    private _convolver:ConvolverNode;

    /**
     * @name PIXI.sound.filters.ReverbFilter#_seconds
     * @type {Number}
     * @private
     */
    private _seconds:number;

    /**
     * @name PIXI.sound.filters.ReverbFilter#_decay
     * @type {Number}
     * @private
     */
    private _decay:number;

    /**
     * @name PIXI.sound.filters.ReverbFilter#_reverse
     * @type {Number}
     * @private
     */
    private _reverse:boolean;

    constructor(seconds:number = 3, decay:number = 2, reverse:boolean = false)
    {
        const convolver:ConvolverNode = soundLibrary.context.audioContext.createConvolver();

        super(convolver);

        this._convolver = convolver;
        this._seconds = this._clamp(seconds, 1, 50);
        this._decay = this._clamp(decay, 0, 100);
        this._reverse = reverse;
        this._rebuild();
    }

    /**
     * Clamp a value
     * @method PIXI.sound.filters.ReverbFilter#_clamp 
     * @private
     * @param {Number} value
     * @param {Number} min Minimum value
     * @param {Number} max Maximum value
     * @return {Number} Clamped number
     */
    private _clamp(value:number, min:number, max:number): number
    {
        return Math.min(max, Math.max(min, value));
    }

    /**
     * Decay value from 1 to 50
     * @name PIXI.sound.filters.ReverbFilter#decay
     * @type {Number}
     * @default 3
     */
    get seconds():number
    {
        return this._seconds;
    }
    set seconds(seconds:number)
    {
        this._seconds = this._clamp(seconds, 1, 50);
        this._rebuild();
    }

    /**
     * Decay value from 0 to 100
     * @name PIXI.sound.filters.ReverbFilter#decay
     * @type {Number}
     * @default 2
     */
    get decay():number
    {
        return this._decay;
    }
    set decay(decay:number)
    {
        this._decay = this._clamp(decay, 0, 100);
        this._rebuild();
    }

    /**
     * Reverse value from 0 to 1
     * @name PIXI.sound.filters.ReverbFilter#reverse
     * @type {Boolean}
     * @default false
     */
    get reverse():boolean
    {
        return this._reverse;
    }
    set reverse(reverse:boolean)
    {
        this._reverse = reverse;
        this._rebuild();
    }

    /**
     * Utility function for building an impulse response
     * from the module parameters.
     * @method PIXI.sound.filters.ReverbFilter#_rebuild
     * @private
     */
    private _rebuild(): void
    {
        const context = soundLibrary.context.audioContext;
        const rate:number = context.sampleRate;
        const length:number = rate * this._seconds;
        const impulse:AudioBuffer = context.createBuffer(2, length, rate);
        const impulseL:Float32Array = impulse.getChannelData(0);
        const impulseR:Float32Array = impulse.getChannelData(1);
        let n:number;

        for (let i:number = 0; i < length; i++)
        {
            n = this._reverse ? length - i : i;
            impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, this._decay);
            impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, this._decay);
        }
        this._convolver.buffer = impulse;
    }

    destroy(): void
    {
        this._convolver = null;
        super.destroy();
    }
}
