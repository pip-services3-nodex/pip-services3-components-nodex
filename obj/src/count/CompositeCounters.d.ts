/** @module count */
import { IReferenceable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { ICounters } from './ICounters';
import { Timing } from './Timing';
import { ITimingCallback } from './ITimingCallback';
/**
 * Aggregates all counters from component references under a single component.
 *
 * It allows to capture metrics and conveniently send them to multiple destinations.
 *
 * ### References ###
 *
 * - <code>\*:counters:\*:\*:1.0</code>     (optional) [[ICounters]] components to pass collected measurements
 *
 * @see [[ICounters]]
 *
 * ### Example ###
 *
 *     class MyComponent implements IReferenceable {
 *         private _counters: CompositeCounters = new CompositeCounters();
 *
 *         public setReferences(references: IReferences): void {
 *             this._counters.setReferences(references);
 *             ...
 *         }
 *
 *         public myMethod(): void {
 *             this._counters.increment("mycomponent.mymethod.calls");
 *             var timing = this._counters.beginTiming("mycomponent.mymethod.exec_time");
 *             try {
 *                 ...
 *             } finally {
 *                 timing.endTiming();
 *             }
 *         }
 *     }
 *
 */
export declare class CompositeCounters implements ICounters, ITimingCallback, IReferenceable {
    protected readonly _counters: ICounters[];
    /**
     * Creates a new instance of the counters.
     *
     * @param references 	references to locate the component dependencies.
     */
    CompositeCounters(references?: IReferences): void;
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Begins measurement of execution time interval.
     * It returns [[Timing]] object which has to be called at
     * [[Timing.endTiming]] to end the measurement and update the counter.
     *
     * @param name 	a counter name of Interval type.
     * @returns a [[Timing]] callback object to end timing.
     */
    beginTiming(name: string): Timing;
    /**
     * Ends measurement of execution elapsed time and updates specified counter.
     *
     * @param name      a counter name
     * @param elapsed   execution elapsed time in milliseconds to update the counter.
     *
     * @see [[Timing.endTiming]]
     */
    endTiming(name: string, elapsed: number): void;
    /**
     * Calculates min/average/max statistics based on the current and previous values.
     *
     * @param name 		a counter name of Statistics type
     * @param value		a value to update statistics
     */
    stats(name: string, value: number): void;
    /**
     * Records the last calculated measurement value.
     *
     * Usually this method is used by metrics calculated
     * externally.
     *
     * @param name 		a counter name of Last type.
     * @param value		a last value to record.
     */
    last(name: string, value: number): void;
    /**
     * Records the current time as a timestamp.
     *
     * @param name 		a counter name of Timestamp type.
     */
    timestampNow(name: string): void;
    /**
     * Records the given timestamp.
     *
     * @param name 		a counter name of Timestamp type.
     * @param value		a timestamp to record.
     */
    timestamp(name: string, value: Date): void;
    /**
     * Increments counter by 1.
     *
     * @param name 		a counter name of Increment type.
     */
    incrementOne(name: string): void;
    /**
     * Increments counter by given value.
     *
     * @param name 		a counter name of Increment type.
     * @param value		a value to add to the counter.
     */
    increment(name: string, value: number): void;
}
