define(['esprima', 'net'], function(esprima, net){


    const makeParser = function(){
        const parseCodeString = function(codeString){
            return esprima.parse(codeString);
        };

        const generateCodeString = function(ast){
            // return escodegen.generate(ast);
            return astring.generate(ast);
        };

        const findDefineArguments = function(parseTree){
            const define = parseTree.body.find(e => {
                const isExpr = e.type == "ExpressionStatement";
                const isDef = e.expression.callee.name == 'define';
                return isExpr && isDef;
            });
            return define && define.expression.arguments;
        };

        const extractParamsFromArguments = function(args){
            return args[0].properties.find(
                p => p.key.name == "params");
        };

        const extractParamsObject = function(paramsAst) {
            // let codeString = escodegen.generate(paramsAst.value);
            let codeString = astring.generate(paramsAst.value);
            eval(`var paramsObject = ${codeString}`);
            return paramsObject;
        };

        const setParamsValue = function(paramsAst, paramsValueObject){
            let paramsCodeString = JSON.stringify(paramsValueObject);
            let paramsValueAst = esprima.parse('a = '+paramsCodeString).body[0].expression.right;
            paramsAst.value = paramsValueAst;
        };

        return {
            parseCodeString,
            generateCodeString,
            findDefineArguments,
            extractParamsFromArguments,
            extractParamsObject,
            setParamsValue
        };
    };
    return makeParser; 
});
