"use strict";
/** @module connect */
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
exports.CompositeConnectionResolver = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const CredentialParams_1 = require("../auth/CredentialParams");
const CredentialResolver_1 = require("../auth/CredentialResolver");
const ConnectionResolver_1 = require("./ConnectionResolver");
/**
 * Helper class that resolves connection and credential parameters,
 * validates them and generates connection options.
 *
 *  ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:               (optional) a key to retrieve the connection from [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - protocol:                    communication protocol
 *   - host:                        host name or IP address
 *   - port:                        port number
 *   - uri:                         resource URI or connection string with all parameters in it
 * - credential(s):
 *   - store_key:                   (optional) a key to retrieve the credentials from [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/auth.icredentialstore.html ICredentialStore]]
 *   - username:                    user name
 *   - password:                    user password
 *
 * ### References ###
 *
 * - <code>\*:discovery:\*:\*:1.0</code>          (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connections
 * - <code>\*:credential-store:\*:\*:1.0</code>   (optional) Credential stores to resolve credentials
 */
class CompositeConnectionResolver {
    constructor() {
        /**
         * The connections resolver.
         */
        this._connectionResolver = new ConnectionResolver_1.ConnectionResolver();
        /**
         * The credentials resolver.
         */
        this._credentialResolver = new CredentialResolver_1.CredentialResolver();
        /**
         * The cluster support (multiple connections)
         */
        this._clusterSupported = true;
        /**
         * The default protocol
         */
        this._defaultProtocol = null;
        /**
         * The default port number
         */
        this._defaultPort = 0;
        /**
         * The list of supported protocols
         */
        this._supportedProtocols = null;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._connectionResolver.configure(config);
        this._credentialResolver.configure(config);
        this._options = config.getSection("options");
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._connectionResolver.setReferences(references);
        this._credentialResolver.setReferences(references);
    }
    /**
     * Resolves connection options from connection and credential parameters.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @returns resolved options.
     */
    resolve(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Todo: Why Promise.all returns promises instead of resolved values??
            // let [connections, credential] = await Promise.all([
            //     async () => {
            let connections = yield this._connectionResolver.resolveAll(correlationId);
            connections = connections || [];
            // Validate if cluster (multiple connections) is supported
            if (connections.length > 0 && !this._clusterSupported) {
                throw new pip_services3_commons_nodex_2.ConfigException(correlationId, "MULTIPLE_CONNECTIONS_NOT_SUPPORTED", "Multiple (cluster) connections are not supported");
            }
            for (let connection of connections) {
                this.validateConnection(correlationId, connection);
            }
            //     return connections;
            // },
            // async () => {
            let credential = yield this._credentialResolver.lookup(correlationId);
            credential = credential || new CredentialParams_1.CredentialParams();
            // Validate credential
            this.validateCredential(correlationId, credential);
            //         return credential;
            //     }
            // ]);
            return this.composeOptions(connections, credential, this._options);
        });
    }
    /**
     * Composes Composite connection options from connection and credential parameters.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param connections        connection parameters
     * @param credential        credential parameters
     * @param parameters        optional parameters
     * @returns 			    resolved options.
     */
    compose(correlationId, connections, credential, parameters) {
        // Validate connection parameters
        for (let connection of connections) {
            this.validateConnection(correlationId, connection);
        }
        // Validate credential parameters
        this.validateCredential(correlationId, credential);
        // Compose final options
        return this.composeOptions(connections, credential, parameters);
    }
    /**
     * Validates connection parameters and throws an exception on error.
     * This method can be overriden in child classes.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param connection connection parameters to be validated
     */
    validateConnection(correlationId, connection) {
        if (connection == null) {
            throw new pip_services3_commons_nodex_2.ConfigException(correlationId, "NO_CONNECTION", "Connection parameters are not set is not set");
        }
        // URI usually contains all information
        let uri = connection.getUri();
        if (uri != null) {
            return;
        }
        let protocol = connection.getProtocolWithDefault(this._defaultProtocol);
        if (protocol == null) {
            throw new pip_services3_commons_nodex_2.ConfigException(correlationId, "NO_PROTOCOL", "Connection protocol is not set");
        }
        if (this._supportedProtocols != null && this._supportedProtocols.indexOf(protocol) < 0) {
            throw new pip_services3_commons_nodex_2.ConfigException(correlationId, "UNSUPPORTED_PROTOCOL", "The protocol " + protocol + " is not supported");
        }
        let host = connection.getHost();
        if (host == null) {
            throw new pip_services3_commons_nodex_2.ConfigException(correlationId, "NO_HOST", "Connection host is not set");
        }
        let port = connection.getPortWithDefault(this._defaultPort);
        if (port == 0) {
            throw new pip_services3_commons_nodex_2.ConfigException(correlationId, "NO_PORT", "Connection port is not set");
        }
    }
    /**
     * Validates credential parameters and throws an exception on error.
     * This method can be overriden in child classes.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param credential  credential parameters to be validated
     */
    validateCredential(correlationId, credential) {
        // By default the rules are open
    }
    /**
     * Composes connection and credential parameters into connection options.
     * This method can be overriden in child classes.
     *
     * @param connections a list of connection parameters
     * @param credential credential parameters
     * @param parameters optional parameters
     * @returns a composed connection options.
     */
    composeOptions(connections, credential, parameters) {
        // Connection options
        let options = new pip_services3_commons_nodex_1.ConfigParams();
        // Merge connection parameters
        for (let connection of connections) {
            options = this.mergeConnection(options, connection);
        }
        // Merge credential parameters
        options = this.mergeCredential(options, credential);
        // Merge optional parameters
        options = this.mergeOptional(options, parameters);
        // Perform final processing
        options = this.finalizeOptions(options);
        return options;
    }
    /**
     * Merges connection options with connection parameters
     * This method can be overriden in child classes.
     *
     * @param options connection options
     * @param connection connection parameters to be merged
     * @returns merged connection options.
     */
    mergeConnection(options, connection) {
        let mergedOptions = options.setDefaults(connection);
        return mergedOptions;
    }
    /**
     * Merges connection options with credential parameters
     * This method can be overriden in child classes.
     *
     * @param options connection options
     * @param credential credential parameters to be merged
     * @returns merged connection options.
     */
    mergeCredential(options, credential) {
        let mergedOptions = options.override(credential);
        return mergedOptions;
    }
    /**
     * Merges connection options with optional parameters
     * This method can be overriden in child classes.
     *
     * @param options connection options
     * @param parameters optional parameters to be merged
     * @returns merged connection options.
     */
    mergeOptional(options, parameters) {
        let mergedOptions = options.setDefaults(parameters);
        return mergedOptions;
    }
    /**
     * Finalize merged options
     * This method can be overriden in child classes.
     *
     * @param options connection options
     * @returns finalized connection options
     */
    finalizeOptions(options) {
        return options;
    }
}
exports.CompositeConnectionResolver = CompositeConnectionResolver;
//# sourceMappingURL=CompositeConnectionResolver.js.map