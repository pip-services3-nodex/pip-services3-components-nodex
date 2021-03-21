/** @module log */
import { ErrorDescription } from 'pip-services3-commons-nodex';
/**
 * Data object to store captured log messages.
 * This object is used by [[CachedLogger]].
 */
export declare class LogMessage {
    /** The time then message was generated */
    time: Date;
    /** The source (context name) */
    source: string;
    /** This log level */
    level: string;
    /** The transaction id to trace execution through call chain. */
    correlation_id: string;
    /**
     * The description of the captured error
     *
     * [[https://pip-services3-nodex.github.io/pip-services3-commons-nodex/classes/errors.errordescription.html ErrorDescription]]
     * [[https://pip-services3-nodex.github.io/pip-services3-commons-nodex/classes/errors.applicationexception.html ApplicationException]]
     */
    error: ErrorDescription;
    /** The human-readable message */
    message: string;
}
