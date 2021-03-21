/** 
 * @module count 
 * 
 * Todo: Rewrite this description
 * 
 * @preferred
 * Performance counters. They show non-functional characteristics about how the code works, 
 * like: times called, response time, objects saved/processed. Using these numbers, we can 
 * show how the code works in the system – how stable, fast, expandable it is. 
 */
export { Timing } from './Timing';
export { ITimingCallback } from './ITimingCallback';
export { ICounters } from './ICounters';
export { CachedCounters } from './CachedCounters';
export { NullCounters } from './NullCounters';
export { LogCounters } from './LogCounters';
export { CompositeCounters } from './CompositeCounters';
export { CounterType } from './CounterType';
export { Counter } from './Counter';
export { DefaultCountersFactory } from './DefaultCountersFactory';
