/** @module count */
import { Descriptor } from 'pip-services3-commons-nodex';

import { NullCounters } from './NullCounters';
import { LogCounters } from './LogCounters';
import { CompositeCounters } from './CompositeCounters';
import { Factory } from '../build/Factory';

/**
 * Creates [[ICounters]] components by their descriptors.
 * 
 * @see [[Factory]]
 * @see [[NullCounters]]
 * @see [[LogCounters]]
 * @see [[CompositeCounters]]
 */
export class DefaultCountersFactory extends Factory {
	private static readonly NullCountersDescriptor = new Descriptor("pip-services", "counters", "null", "*", "1.0");
	private static readonly LogCountersDescriptor = new Descriptor("pip-services", "counters", "log", "*", "1.0");
	private static readonly CompositeCountersDescriptor = new Descriptor("pip-services", "counters", "composite", "*", "1.0");

	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultCountersFactory.NullCountersDescriptor, NullCounters);
		this.registerAsType(DefaultCountersFactory.LogCountersDescriptor, LogCounters);
		this.registerAsType(DefaultCountersFactory.CompositeCountersDescriptor, CompositeCounters);
	}
}