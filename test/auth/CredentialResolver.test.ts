const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { CredentialResolver } from '../../src/auth/CredentialResolver';

suite('CredentialResolver', ()=> {
	let RestConfig = ConfigParams.fromTuples(
        "credential.username", "Negrienko",
        "credential.password", "qwerty",
        "credential.access_key", "key",
        "credential.store_key", "store key"
	);

    test('Configure', () => {
		let credentialResolver = new CredentialResolver(RestConfig);
		let configList = credentialResolver.getAll();
		
        assert.equal(configList[0].get("username"), "Negrienko");
		assert.equal(configList[0].get("password"), "qwerty");
		assert.equal(configList[0].get("access_key"), "key");
		assert.equal(configList[0].get("store_key"), "store key");
    });    
		
    test('Lookup', async () => {
        let credentialResolver = new CredentialResolver();
        let credential = await credentialResolver.lookup("correlationId");
        assert.isNull(credential);

        let RestConfigWithoutStoreKey = ConfigParams.fromTuples(
            "credential.username", "Negrienko",
            "credential.password", "qwerty",
            "credential.access_key", "key"
        );


        credentialResolver = new CredentialResolver(RestConfigWithoutStoreKey);
        credential = await credentialResolver.lookup("correlationId");
        assert.equal(credential.get("username"), "Negrienko");
        assert.equal(credential.get("password"), "qwerty");
        assert.equal(credential.get("access_key"), "key");
        assert.isNull(credential.get("store_key"));

        credentialResolver = new CredentialResolver(RestConfig);
        try {
            credential = await credentialResolver.lookup("correlationId");
            assert.fail("Expected to fail");
        } catch {
            // Expected exception
        }

        credentialResolver = new CredentialResolver(RestConfig);
        credentialResolver.setReferences(new References());
        try {
            credential = await credentialResolver.lookup("correlationId");
            assert.fail("Expected to fail");
        } catch {
            // Expected exception
        }
    });

});