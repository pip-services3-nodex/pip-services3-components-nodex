import { Factory } from '../build/Factory';
/**
 * Creates [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]] components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[IDiscovery]]
 * @see [[MemoryDiscovery]]
 */
export declare class DefaultDiscoveryFactory extends Factory {
    private static readonly MemoryDiscoveryDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
