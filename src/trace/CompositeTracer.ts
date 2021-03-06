/** @module trace */
import { IReferenceable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { ITracer } from './ITracer';
import { TraceTiming } from './TraceTiming';

/**
 * Aggregates all tracers from component references under a single component.
 * 
 * It allows to record traces and conveniently send them to multiple destinations. 
 * 
 * ### References ###
 * 
 * - <code>\*:tracer:\*:\*:1.0</code>     (optional) [[ITracer]] components to pass operation traces
 * 
 * @see [[ITracer]]
 * 
 * ### Example ###
 * 
 *     class MyComponent implements IReferenceable {
 *         private _tracer: CompositeTracer = new CompositeTracer();
 *         
 *         public setReferences(references: IReferences): void {
 *             this._tracer.setReferences(references);
 *             ...
 *         }
 *         
 *         public myMethod(correlatonId: string): void {
 *             var timing = this._tracer.beginTrace(correlationId, "mycomponent", "mymethod");
 *             try {
 *                 ...
 *                 timing.endTrace();
 *             } catch (err) {
 *                 timing.endFailure(err);
 *             }
 *         }
 *     }
 * 
 */
export class CompositeTracer implements ITracer, IReferenceable {
    protected readonly _tracers: ITracer[] = [];

    /**
     * Creates a new instance of the tracer.
     * 
	 * @param references 	references to locate the component dependencies. 
     */
    public constructor(references: IReferences = null) {
        if (references != null)
            this.setReferences(references);
    }

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        let tracers = references.getOptional<ITracer>(new Descriptor(null, "tracer", null, null, null));
        for (let i = 0; i < tracers.length; i++) {
            let tracer: any = tracers[i];

            if (tracer != this)
                this._tracers.push(tracer);
        }
    }

    /**
     * Records an operation trace with its name and duration
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param component         a name of called component
     * @param operation         a name of the executed operation. 
     * @param duration          execution duration in milliseconds. 
     */
    public trace(correlationId: string, component: string, operation: string, duration: number) : void {
        for (let tracer of this._tracers) {
            tracer.trace(correlationId, component, operation, duration);
        }
    }

     /**
      * Records an operation failure with its name, duration and error
      * 
      * @param correlationId     (optional) transaction id to trace execution through call chain.
      * @param component         a name of called component
      * @param operation         a name of the executed operation. 
      * @param error             an error object associated with this trace.
      * @param duration          execution duration in milliseconds. 
      */
    public failure(correlationId: string, component: string, operation: string, error: Error, duration: number) : void {
        for (let tracer of this._tracers) {
            tracer.failure(correlationId, component, operation, error, duration);
        }
    }
 
     /**
      * Begings recording an operation trace
      * 
      * @param correlationId     (optional) transaction id to trace execution through call chain.
      * @param component         a name of called component
      * @param operation         a name of the executed operation. 
      * @returns                 a trace timing object.
      */
    public beginTrace(correlationId: string, component: string, operation: string) : TraceTiming {
        return new TraceTiming(correlationId, component, operation, this);
    }     
}