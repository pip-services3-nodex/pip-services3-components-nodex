"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const ContextInfo_1 = require("../../src/info/ContextInfo");
suite('ContextInfo', () => {
    let contextInfo;
    setup(() => {
        contextInfo = new ContextInfo_1.ContextInfo();
    });
    test('Name', () => {
        assert.equal(contextInfo.name, "unknown");
        let update = "new name";
        contextInfo.name = update;
        assert.equal(contextInfo.name, update);
    });
    test('Description', () => {
        assert.isNull(contextInfo.description);
        let update = "new description";
        contextInfo.description = update;
        assert.equal(contextInfo.description, update);
    });
    test('ContextId', () => {
        assert.isNotNull(contextInfo.contextId);
        let update = "new context id";
        contextInfo.contextId = update;
        assert.equal(contextInfo.contextId, update);
    });
    test('StartTime', () => {
        let now = new Date();
        assert.equal(contextInfo.startTime.getFullYear(), now.getFullYear());
        assert.equal(contextInfo.startTime.getMonth(), now.getMonth());
        contextInfo.startTime = new Date(1975, 4, 8);
        assert.equal(contextInfo.startTime.getFullYear(), 1975);
        assert.equal(contextInfo.startTime.getMonth(), 4);
        assert.equal(contextInfo.startTime.getDate(), 8);
    });
    test('FromConfig', () => {
        let config = pip_services3_commons_nodex_1.ConfigParams.fromTuples("name", "new name", "description", "new description", "properties.access_key", "key", "properties.store_key", "store key");
        let contextInfo = ContextInfo_1.ContextInfo.fromConfig(config);
        assert.equal(contextInfo.name, "new name");
        assert.equal(contextInfo.description, "new description");
    });
});
//# sourceMappingURL=ContextInfo.test.js.map