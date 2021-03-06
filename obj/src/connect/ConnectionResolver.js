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
exports.ConnectionResolver = void 0;
/** @module connect */
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const ConnectionParams_1 = require("./ConnectionParams");
/**
 * Helper class to retrieve component connections.
 *
 * If connections are configured to be retrieved from [[IDiscovery]],
 * it automatically locates [[IDiscovery]] in component references
 * and retrieve connections from there using discovery_key parameter.
 *
 * ### Configuration parameters ###
 *
 * - __connection:__
 *     - discovery_key:               (optional) a key to retrieve the connection from [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]]
 *     - ...                          other connection parameters
 *
 * - __connections:__                  alternative to connection
 *     - [connection params 1]:       first connection parameters
 *         - ...                      connection parameters for key 1
 *     - [connection params N]:       Nth connection parameters
 *         - ...                      connection parameters for key N
 *
 * ### References ###
 *
 * - <code>\*:discovery:\*:\*:1.0</code>    (optional) [[https://pip-services3-nodex.github.io/pip-services3-components-nodex/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connections
 *
 * @see [[ConnectionParams]]
 * @see [[IDiscovery]]
 *
 * ### Example ###
 *
 *     let config = ConfigParams.fromTuples(
 *         "connection.host", "10.1.1.100",
 *         "connection.port", 8080
 *     );
 *
 *     let connectionResolver = new ConnectionResolver();
 *     connectionResolver.configure(config);
 *     connectionResolver.setReferences(references);
 *
 *     let connection = await connectionResolver.resolve("123");
 *     // Now use connection...
 *
 */
class ConnectionResolver {
    /**
     * Creates a new instance of connection resolver.
     *
     * @param config        (optional) component configuration parameters
     * @param references    (optional) component references
     */
    constructor(config = null, references = null) {
        this._connections = [];
        this._references = null;
        if (config != null) {
            this.configure(config);
        }
        if (references != null) {
            this.setReferences(references);
        }
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        let connections = ConnectionParams_1.ConnectionParams.manyFromConfig(config);
        this._connections.push(...connections);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._references = references;
    }
    /**
     * Gets all connections configured in component configuration.
     *
     * Redirect to Discovery services is not done at this point.
     * If you need fully fleshed connection use [[resolve]] method instead.
     *
     * @returns a list with connection parameters
     */
    getAll() {
        return this._connections;
    }
    /**
     * Adds a new connection to component connections
     *
     * @param connection    new connection parameters to be added
     */
    add(connection) {
        this._connections.push(connection);
    }
    resolveInDiscovery(correlationId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!connection.useDiscovery()) {
                return null;
            }
            let key = connection.getDiscoveryKey();
            if (this._references == null) {
                return null;
            }
            let discoveryDescriptor = new pip_services3_commons_nodex_3.Descriptor("*", "discovery", "*", "*", "*");
            let discoveries = this._references.getOptional(discoveryDescriptor);
            if (discoveries.length == 0) {
                throw new pip_services3_commons_nodex_2.ReferenceException(correlationId, discoveryDescriptor);
            }
            for (let discovery of discoveries) {
                let discoveryTyped = discovery;
                let result = yield discoveryTyped.resolveOne(correlationId, key);
                if (result != null) {
                    return result;
                }
            }
            return null;
        });
    }
    /**
     * Resolves a single component connection. If connections are configured to be retrieved
     * from Discovery service it finds a [[IDiscovery]] and resolves the connection there.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @returns                 a found connection parameters or <code>null</code> otherwise
     *
     * @see [[IDiscovery]]
     */
    resolve(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._connections.length == 0) {
                return null;
            }
            let connections = [];
            for (let connection of this._connections) {
                if (!connection.useDiscovery()) {
                    return connection; //If a connection is not configured for discovery use - return it.
                }
                else {
                    connections.push(connection); //Otherwise, add it to the list of connections to resolve.
                }
            }
            if (connections.length == 0) {
                return null;
            }
            let resolved = null;
            for (let connection of connections) {
                let result = yield this.resolveInDiscovery(correlationId, connection);
                if (result != null) {
                    resolved = new ConnectionParams_1.ConnectionParams(pip_services3_commons_nodex_1.ConfigParams.mergeConfigs(connection, result));
                }
            }
            return resolved;
        });
    }
    resolveAllInDiscovery(correlationId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            let resolved = [];
            let key = connection.getDiscoveryKey();
            if (!connection.useDiscovery()) {
                return [];
            }
            if (this._references == null) {
                return [];
            }
            let discoveryDescriptor = new pip_services3_commons_nodex_3.Descriptor("*", "discovery", "*", "*", "*");
            let discoveries = this._references.getOptional(discoveryDescriptor);
            if (discoveries.length == 0) {
                throw new pip_services3_commons_nodex_2.ReferenceException(correlationId, discoveryDescriptor);
            }
            for (let discovery of discoveries) {
                let discoveryTyped = discovery;
                let result = yield discoveryTyped.resolveAll(correlationId, key);
                if (result != null) {
                    resolved = resolved.concat(result);
                }
            }
            return resolved;
        });
    }
    /**
     * Resolves all component connection. If connections are configured to be retrieved
     * from Discovery service it finds a [[IDiscovery]] and resolves the connection there.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @returns                 all found connection parameters
     *
     * @see [[IDiscovery]]
     */
    resolveAll(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let resolved = [];
            let toResolve = [];
            for (let connection of this._connections) {
                if (connection.useDiscovery())
                    toResolve.push(connection);
                else
                    resolved.push(connection);
            }
            if (toResolve.length <= 0) {
                return resolved;
            }
            for (let connection of toResolve) {
                let result = yield this.resolveAllInDiscovery(correlationId, connection);
                if (result != null) {
                    for (let index = 0; index < result.length; index++) {
                        let localResolvedConnection = new ConnectionParams_1.ConnectionParams(pip_services3_commons_nodex_1.ConfigParams.mergeConfigs(connection, result[index]));
                        resolved.push(localResolvedConnection);
                    }
                }
            }
            return resolved;
        });
    }
    registerInDiscovery(correlationId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!connection.useDiscovery()) {
                return false;
            }
            let key = connection.getDiscoveryKey();
            if (this._references == null) {
                return false;
            }
            let discoveries = this._references.getOptional(new pip_services3_commons_nodex_3.Descriptor("*", "discovery", "*", "*", "*"));
            if (discoveries == null) {
                return false;
            }
            for (let discovery of discoveries) {
                yield discovery.register(correlationId, key, connection);
            }
            return true;
        });
    }
    /**
     * Registers the given connection in all referenced discovery services.
     * This method can be used for dynamic service discovery.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param connection        a connection to register.
     * @returns 			    the registered connection parameters.
     *
     * @see [[IDiscovery]]
     */
    register(correlationId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            let ok = yield this.registerInDiscovery(correlationId, connection);
            if (ok) {
                this._connections.push(connection);
            }
        });
    }
}
exports.ConnectionResolver = ConnectionResolver;
//# sourceMappingURL=ConnectionResolver.js.map