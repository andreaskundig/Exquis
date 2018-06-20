// Configure requirejs, for example to use shims of non AMD libraries
requirejs.config({
    shim: {
        // 'bibs/paper-core' : {
        //     exports:'paper'
        // }
    },
    paths: {
        "esprima": "lib/esprima",
        "escodegen": "lib/escodegen.browser.min"
    }
});
