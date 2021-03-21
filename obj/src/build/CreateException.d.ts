/** @module build */
import { InternalException } from 'pip-services3-commons-nodex';
/**
 * Error raised when factory is not able to create requested component.
 *
 * @see [[https://pip-services3-nodex.github.io/pip-services3-commons-nodex/classes/errors.internalexception.html InternalException]] (in the PipServices "Commons" package)
 * @see [[https://pip-services3-nodex.github.io/pip-services3-commons-nodex/classes/errors.applicationexception.html ApplicationException]] (in the PipServices "Commons" package)
 */
export declare class CreateException extends InternalException {
    /**
     * Creates an error instance and assigns its values.
     *
     * @param correlation_id    (optional) a unique transaction id to trace execution through call chain.
     * @param messageOrLocator  human-readable error or locator of the component that cannot be created.
     */
    constructor(correlationId: string, messageOrLocator: any);
}
