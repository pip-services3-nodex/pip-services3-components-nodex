/** @module config */
import { ConfigParams } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex'
import { INotifiable } from 'pip-services3-commons-nodex';
import { MustacheTemplate } from 'pip-services3-expressions-nodex';
import { IConfigReader } from './IConfigReader';

/**
 * Abstract config reader that supports configuration parameterization.
 * 
 * ### Configuration parameters ###
 * 
 * - __parameters:__            this entire section is used as template parameters
 *     - ...
 * 
 *  @see [[IConfigReader]]
 */
export abstract class ConfigReader implements IConfigurable, IConfigReader {
    private _parameters: ConfigParams = new ConfigParams();

    /**
     * Creates a new instance of the config reader.
     */
    public constructor() {}

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        let parameters = config.getSection("parameters")
        if (parameters.length() > 0) {
            this._parameters = parameters;
        }
    }    

    /**
     * Reads configuration and parameterize it with given values.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns                 retrieved configuration parameters.
     */
    public abstract readConfig(correlationId: string, parameters: ConfigParams): Promise<ConfigParams>;

    /**
     * Parameterized configuration template given as string with dynamic parameters.
     * 
     * The method uses [[https://handlebarsjs.com Handlebars]] template engine.
     * 
     * @param config        a string with configuration template to be parameterized
     * @param parameters    dynamic parameters to inject into the template
     * @returns a parameterized configuration string.
     */
    protected parameterize(config: string, parameters: ConfigParams): string {
        parameters = this._parameters.override(parameters);

        let template = new MustacheTemplate(config);
        return template.evaluateWithVariables(parameters);
    }

    /**
     * Adds a listener that will be notified when configuration is changed
     * @param listener a listener to be added.
     */
    public addChangeListener(listener: INotifiable): void {
        // Do nothing...
    }

    /**
     * Remove a previously added change listener.
     * @param listener a listener to be removed.
     */
    public removeChangeListener(listener: INotifiable): void {
        // Do nothing...
    }
     
}