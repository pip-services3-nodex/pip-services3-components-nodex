/** @module connect */
import { ConfigParams } from 'pip-services3-commons-nodex';
import { IReconfigurable } from 'pip-services3-commons-nodex';

import { ConnectionParams } from './ConnectionParams';
import { IDiscovery } from './IDiscovery';

/**
 * Used to store key-identifiable information about connections.
 */
class DiscoveryItem {
    public key: string;
    public connection: ConnectionParams;
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
 *         "key1.host", "10.1.1.100",
 *         "key1.port", "8080",
 *         "key2.host", "10.1.1.100",
 *         "key2.port", "8082"
 *     );
 *     
 *     let discovery = new MemoryDiscovery();
 *     discovery.readConnections(config);
 *     
 *     let connection = await discovery.resolve("123", "key1");
 *     // Result: host=10.1.1.100;port=8080
 *     
 */
export class MemoryDiscovery implements IDiscovery, IReconfigurable {
    private _items: DiscoveryItem[] = [];

    /**
     * Creates a new instance of discovery service.
     * 
     * @param config    (optional) configuration with connection parameters.
     */
    public constructor(config: ConfigParams = null) {
        if (config != null) {
            this.configure(config);
        }
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this.readConnections(config);
    }

    /**
     * Reads connections from configuration parameters.
     * Each section represents an individual Connectionparams
     * 
     * @param config   configuration parameters to be read
     */
    public readConnections(config: ConfigParams) {
        this._items = [];
        let keys = config.getKeys();
        for (let key of keys) {
            let value = config.getAsNullableString(key);
            let item: DiscoveryItem = new DiscoveryItem();
            item.key = key;
            item.connection = ConnectionParams.fromString(value);
            this._items.push(item);
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
    public async register(correlationId: string, key: string, connection: ConnectionParams): Promise<ConnectionParams> {
        let item: DiscoveryItem = new DiscoveryItem();
        item.key = key;
        item.connection = connection;
        this._items.push(item);
        return connection;
    }

    /**
     * Resolves a single connection parameters by its key.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a key to uniquely identify the connection.
     * @returns                 a found connection parameters or <code>null</code> otherwise
     */
    public async resolveOne(correlationId: string, key: string): Promise<ConnectionParams> {
        let connection: ConnectionParams = null;
        for (let item of this._items) {
            if (item.key == key && item.connection != null) {
                connection = item.connection;
                break;
            }
        }
        return connection;
    }

    /**
     * Resolves all connection parameters by their key.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a key to uniquely identify the connections.
     * @returns                 all found connection parameters
     */
    public async resolveAll(correlationId: string, key: string): Promise<ConnectionParams[]> {
        let connections: ConnectionParams[] = [];
        for (let item of this._items) {
            if (item.key == key && item.connection != null) {
                connections.push(item.connection);
            }
        }
        return connections;
    }
}