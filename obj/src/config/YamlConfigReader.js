"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YamlConfigReader = void 0;
/** @module config */
/** @hidden */
const fs = require('fs');
/** @hidden */
const yaml = require('js-yaml');
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const FileConfigReader_1 = require("./FileConfigReader");
/**
 * Config reader that reads configuration from YAML file.
 *
 * The reader supports parameterization using [[https://handlebarsjs.com Handlebars]] template engine.
 *
 * ### Configuration parameters ###
 *
 * - path:          path to configuration file
 * - parameters:    this entire section is used as template parameters
 * - ...
 *
 * @see [[IConfigReader]]
 * @see [[FileConfigReader]]
 *
 * ### Example ###
 *
 *     ======== config.yml ======
 *     key1: "{{KEY1_VALUE}}"
 *     key2: "{{KEY2_VALUE}}"
 *     ===========================
 *
 *     let configReader = new YamlConfigReader("config.yml");
 *
 *     let parameters = ConfigParams.fromTuples("KEY1_VALUE", 123, "KEY2_VALUE", "ABC");
 *     let config = await configReader.readConfig("123", parameters);
 *     // Result: key1=123;key2=ABC
 *
 */
class YamlConfigReader extends FileConfigReader_1.FileConfigReader {
    /**
     * Creates a new instance of the config reader.
     *
     * @param path  (optional) a path to configuration file.
     */
    constructor(path = null) {
        super(path);
    }
    /**
     * Reads configuration file, parameterizes its content and converts it into JSON object.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param parameters        values to parameters the configuration.
     * @returns                 a JSON object with configuration.
     */
    readObject(correlationId, parameters) {
        if (super.getPath() == null)
            throw new pip_services3_commons_nodex_2.ConfigException(correlationId, "NO_PATH", "Missing config file path");
        try {
            let content = fs.readFileSync(super.getPath(), 'utf8');
            content = this.parameterize(content, parameters);
            let data = yaml.load(content);
            return data;
        }
        catch (e) {
            throw new pip_services3_commons_nodex_3.FileException(correlationId, "READ_FAILED", "Failed reading configuration " + super.getPath() + ": " + e)
                .withDetails("path", super.getPath())
                .withCause(e);
        }
    }
    /**
     * Reads configuration and parameterize it with given values.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns                 retrieved configuration parameters.
     */
    readConfig(correlationId, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = this.readObject(correlationId, parameters);
            let config = pip_services3_commons_nodex_1.ConfigParams.fromValue(value);
            return config;
        });
    }
    /**
     * Reads configuration file, parameterizes its content and converts it into JSON object.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param file              a path to configuration file.
     * @param parameters        values to parameters the configuration.
     * @returns                 a JSON object with configuration.
     */
    static readObject(correlationId, path, parameters) {
        return new YamlConfigReader(path).readObject(correlationId, parameters);
    }
    /**
     * Reads configuration from a file, parameterize it with given values and returns a new ConfigParams object.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param file              a path to configuration file.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @param callback          callback function that receives configuration or error.
     */
    static readConfig(correlationId, path, parameters) {
        let value = new YamlConfigReader(path).readObject(correlationId, parameters);
        let config = pip_services3_commons_nodex_1.ConfigParams.fromValue(value);
        return config;
    }
}
exports.YamlConfigReader = YamlConfigReader;
//# sourceMappingURL=YamlConfigReader.js.map