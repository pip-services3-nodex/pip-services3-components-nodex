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
const assert = require('chai').assert;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const ConnectionParams_1 = require("../../src/connect/ConnectionParams");
const ConnectionResolver_1 = require("../../src/connect/ConnectionResolver");
suite('ConnectionResolver', () => {
    let RestConfig = pip_services3_commons_nodex_1.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "localhost", "connection.port", 3000);
    test('Configure', () => {
        let connectionResolver = new ConnectionResolver_1.ConnectionResolver(RestConfig);
        let configList = connectionResolver.getAll();
        assert.equal(configList[0].get("protocol"), "http");
        assert.equal(configList[0].get("host"), "localhost");
        assert.equal(configList[0].get("port"), "3000");
    });
    test('Register', () => __awaiter(void 0, void 0, void 0, function* () {
        let connectionParams = new ConnectionParams_1.ConnectionParams();
        let connectionResolver = new ConnectionResolver_1.ConnectionResolver(RestConfig);
        yield connectionResolver.register("correlationId", connectionParams);
        let configList = connectionResolver.getAll();
        assert.equal(configList.length, 1);
        yield connectionResolver.register("correlationId", connectionParams);
        configList = connectionResolver.getAll();
        assert.equal(configList.length, 1);
        connectionParams.setDiscoveryKey("Discovery key value");
        let references = new pip_services3_commons_nodex_2.References();
        connectionResolver.setReferences(references);
        yield connectionResolver.register("correlationId", connectionParams);
        configList = connectionResolver.getAll();
        assert.equal(configList.length, 2);
        assert.equal(configList[0].get("protocol"), "http");
        assert.equal(configList[0].get("host"), "localhost");
        assert.equal(configList[0].get("port"), "3000");
        //assert.equal(configList[0].get("discovery_key"), "Discovery key value");
    }));
    test('Resolve', () => __awaiter(void 0, void 0, void 0, function* () {
        let connectionResolver = new ConnectionResolver_1.ConnectionResolver(RestConfig);
        let connectionParams = yield connectionResolver.resolve("correlationId");
        assert.equal(connectionParams.get("protocol"), "http");
        assert.equal(connectionParams.get("host"), "localhost");
        assert.equal(connectionParams.get("port"), "3000");
        let RestConfigDiscovery = pip_services3_commons_nodex_1.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "localhost", "connection.port", 3000, "connection.discovery_key", "Discovery key value");
        let references = new pip_services3_commons_nodex_2.References();
        connectionResolver = new ConnectionResolver_1.ConnectionResolver(RestConfigDiscovery, references);
        try {
            let connectionParams = yield connectionResolver.resolve("correlationId");
        }
        catch (_a) {
            // Expected exception
        }
    }));
});
//# sourceMappingURL=ConnectionResolver.test.js.map