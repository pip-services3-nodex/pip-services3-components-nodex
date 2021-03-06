/** @module test */
import { ConfigParams } from "pip-services3-commons-nodex";
import { IConfigurable } from "pip-services3-commons-nodex";
import { IOpenable } from "pip-services3-commons-nodex";
import { RandomInteger } from "pip-services3-commons-nodex";
import { ApplicationException } from "pip-services3-commons-nodex";

/**
 * Random shutdown component that crashes the process
 * using various methods.
 * 
 * The component is usually used for testing, but brave developers
 * can try to use it in production to randomly crash microservices.
 * It follows the concept of "Chaos Monkey" popularized by Netflix.
 * 
 * ### Configuration parameters ###
 * 
 * - mode:          null - crash by NullPointer excepiton, zero - crash by dividing by zero, excetion = crash by unhandled exception, exit - exit the process
 * - min_timeout:   minimum crash timeout in milliseconds (default: 5 mins)
 * - max_timeout:   maximum crash timeout in milliseconds (default: 15 minutes)
 * 
 * ### Example ###
 * 
 *     let shutdown = new Shutdown();
 *     shutdown.configure(ConfigParams.fromTuples(
 *         "mode": "exception"
 *     ));
 *     shutdown.shutdown();         // Result: Bang!!! the process crashes
 */
export class Shutdown implements IConfigurable, IOpenable {
    private _interval: any;
    private _mode: string = 'exception';
    private _minTimeout: number = 300000;
    private _maxTimeout: number = 900000;

    /**
     * Creates a new instance of the shutdown component.
     */
    public constructor() {}

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this._mode = config.getAsStringWithDefault('mode', this._mode);
        this._minTimeout = config.getAsIntegerWithDefault('min_timeout', this._minTimeout);
        this._maxTimeout = config.getAsIntegerWithDefault('max_timeout', this._maxTimeout);
    }

	/**
	 * Checks if the component is opened.
	 * 
	 * @returns true if the component has been opened and false otherwise.
	 */
    public isOpen(): boolean {
        return this._interval != null;
    }

	/**
	 * Opens the component.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
	 */
    public async open(correlationId: string): Promise<void> {
        if (this._interval != null) {
            clearInterval(this._interval);
        }

        let timeout = RandomInteger.nextInteger(this._minTimeout, this._maxTimeout);
        this._interval = setInterval(() => {
            this.shutdown();
        }, timeout);
    }

	/**
	 * Closes component and frees used resources.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
	 */
    public async close(correlationId: string): Promise<void> {
        if (this._interval != null) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }

    /**
     * Crashes the process using the configured crash mode.
     */
    public shutdown(): void {
        if (this._mode == 'null' || this._mode == 'nullpointer') {
            let obj = null;
            obj.crash = 123;
        } else if (this._mode == 'zero' || this._mode == 'dividebyzero') {
            let crash = 0 / 100;
        } else if (this._mode == 'exit' || this._mode == 'processexit') {
            process.exit(1);
        } else {
            let err = new ApplicationException('test', null, 'CRASH', 'Crash test exception');
            throw err;
        }
    }
}