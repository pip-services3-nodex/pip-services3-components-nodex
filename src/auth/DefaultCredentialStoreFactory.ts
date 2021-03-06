/** @module auth */
import { Descriptor } from 'pip-services3-commons-nodex';

import { Factory } from '../build/Factory';
import { MemoryCredentialStore } from './MemoryCredentialStore';

/**
 * Creates [[ICredentialStore]] components by their descriptors.
 * 
 * @see [[IFactory]]
 * @see [[ICredentialStore]]
 * @see [[MemoryCredentialStore]]
 */
export class DefaultCredentialStoreFactory extends Factory {
	private static readonly MemoryCredentialStoreDescriptor = new Descriptor("pip-services", "credential-store", "memory", "*", "1.0");
	
	/**
	 * Create a new instance of the factory.
	 */
	public constructor() {
        super();
		this.registerAsType(DefaultCredentialStoreFactory.MemoryCredentialStoreDescriptor, MemoryCredentialStore);
	}	
}
