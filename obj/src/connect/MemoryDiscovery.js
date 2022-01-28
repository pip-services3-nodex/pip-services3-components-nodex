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
exports.MemoryDiscovery = void 0;
const ConnectionParams_1 = require("./ConnectionParams");
/**
 * Used to store key-identifiable information about connections.
 */
class DiscoveryItem {
}
/**
 * Discovery service that keeps connections in memory.
 *
 * ### Configuration parameters ###
 *
 * - [connection key 1]:
 *     - ...                          connection parameters for key 1
 * - [connection key 2]:
 *     - ...                          connection parameters for key N
 *
 * @see [[IDiscovery]]
 * @see [[ConnectionParams]]
 *
 * ### Example ###
 *
 *     let config = ConfigParams.fromTuples(
 *         "connections.key1.host", "10.1.1.100",
 *         "connections.key1.port", "8080",
 *         "connections.key2.host", "10.1.1.101",
 *         "connections.key2.port", "8082"
 *     );
 *
 *     let discovery = new MemoryDiscovery();
 *     discovery.configure(config);
 *
 *     let connection = await discovery.resolveOne("123", "key1");
 *     // Result: host=10.1.1.100;port=8080
 *
 */
class MemoryDiscovery {
    /**
     * Creates a new instance of discovery service.
     *
     * @param config    (optional) configuration with connection parameters.
     */
    constructor(config = null) {
        this._items = [];
        if (config != null) {
            this.configure(config);
        }
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this.readConnections(config);
    }
    /**
     * Reads connections from configuration parameters.
     * Each section represents an individual Connectionparams
     *
     * @param config   configuration parameters to be read
     */
    readConnections(config) {
        this._items = [];
        let connections = config.getSection("connections");
        if (connections.length() > 0) {
            let connectionSections = connections.getSectionNames();
            for (let index = 0; index < connectionSections.length; index++) {
                let key = connectionSections[index];
                let value = connections.getSection(key);
                let item = new DiscoveryItem();
                item.key = key;
                item.connection = new ConnectionParams_1.ConnectionParams(value);
                this._items.push(item);
            }
        }
    }
    /**
     * Registers connection parameters into the discovery service.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a key to uniquely identify the connection parameters.
     * @param credential        a connection to be registered.
     * @returns 			    the registered connection parameters.
     */
    register(correlationId, key, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            let item = new DiscoveryItem();
            item.key = key;
            item.connection = connection;
            this._items.push(item);
            return connection;
        });
    }
    /**
     * Resolves a single connection parameters by its key.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a key to uniquely identify the connection.
     * @returns                 a found connection parameters or <code>null</code> otherwise
     */
    resolveOne(correlationId, key) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = null;
            for (let item of this._items) {
                if (item.key == key && item.connection != null) {
                    connection = item.connection;
                    break;
                }
            }
            return connection;
        });
    }
    /**
     * Resolves all connection parameters by their key.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a key to uniquely identify the connections.
     * @returns                 all found connection parameters
     */
    resolveAll(correlationId, key) {
        return __awaiter(this, void 0, void 0, function* () {
            let connections = [];
            for (let item of this._items) {
                if (item.key == key && item.connection != null) {
                    connections.push(item.connection);
                }
            }
            return connections;
        });
    }
}
exports.MemoryDiscovery = MemoryDiscovery;
//# sourceMappingURL=MemoryDiscovery.js.map