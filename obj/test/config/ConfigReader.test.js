"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const pip_services3_expressions_nodex_1 = require("pip-services3-expressions-nodex");
suite('ConfigReader', () => {
    test('Process Templates', () => {
        let config = "{{#if A}}{{B}}{{/if}}";
        let params = { A: "true", B: "XYZ" };
        let template = new pip_services3_expressions_nodex_1.MustacheTemplate(config);
        let result = template.evaluateWithVariables(params);
        assert.equal(result, "XYZ");
    });
});
//# sourceMappingURL=ConfigReader.test.js.map