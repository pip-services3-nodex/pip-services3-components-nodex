const assert = require('chai').assert;

import { MustacheTemplate } from 'pip-services3-expressions-nodex';

suite('ConfigReader', ()=> {

    test('Process Templates', () => {
        let config = "{{#if A}}{{B}}{{/if}}"
        let params = { A: "true", B: "XYZ" };

        let template = new MustacheTemplate(config);
        let result = template.evaluateWithVariables(params);

		assert.equal(result, "XYZ");
    });

});
