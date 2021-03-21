"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigReader = void 0;
/** @module config */
/** @hidden */
const handlebars = require('handlebars');
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
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
class ConfigReader {
    /**
     * Creates a new instance of the config reader.
     */
    constructor() {
        this._parameters = new pip_services3_commons_nodex_1.ConfigParams();
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        let parameters = config.getSection("parameters");
        if (parameters.length() > 0) {
            this._parameters = parameters;
        }
    }
    /**
     * Parameterized configuration template given as string with dynamic parameters.
     *
     * The method uses [[https://handlebarsjs.com Handlebars]] template engine.
     *
     * @param config        a string with configuration template to be parameterized
     * @param parameters    dynamic parameters to inject into the template
     * @returns a parameterized configuration string.
     */
    parameterize(config, parameters) {
        parameters = this._parameters.override(parameters);
        // Convert template to lodash
        //config = config.replace(/{{/g, "<%=").replace(/}}/g, "%>");
        //let template = _.template(config);
        //return template(parameters);
        // return mustache.render(config, parameters);
        let template = handlebars.compile(config);
        return template(parameters);
    }
}
exports.ConfigReader = ConfigReader;
//# sourceMappingURL=ConfigReader.js.map