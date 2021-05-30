const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { ConnectionParams } from '../../src/connect/ConnectionParams';
import { CompositeConnectionResolver } from '../../src/connect/CompositeConnectionResolver';

suite('CompositeConnectionResolver', ()=> {

    test('Resolver', async () => {
        let config = ConfigParams.fromTuples(
            "connection.protocol", "http",
            "connection.host", "localhost",
            "connection.port", 3000,
            "credential.username", "user",
            "credential.password", "pass"
        );

        let connectionResolver = new CompositeConnectionResolver();
        connectionResolver.configure(config);
        let options = await connectionResolver.resolve(null);
		assert.equal(options.get("protocol"), "http");
		assert.equal(options.get("host"), "localhost");
		assert.equal(options.get("port"), "3000");
    });    
		
});