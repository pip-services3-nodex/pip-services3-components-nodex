/** @module connect */
import { Descriptor } from 'pip-services3-commons-nodex';

import { Factory } from '../build/Factory';
import { MemoryDiscovery } from './MemoryDiscovery';

/**
 * Creates [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]] components by their descriptors.
 * 
 * @see [[Factory]]
 * @see [[IDiscovery]]
 * @see [[MemoryDiscovery]]
 */
export class DefaultDiscoveryFactory extends Factory {
	private static readonly MemoryDiscoveryDescriptor = new Descriptor("pip-services", "discovery", "memory", "*", "1.0");
	
	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultDiscoveryFactory.MemoryDiscoveryDescriptor, MemoryDiscovery);
	}	
}
