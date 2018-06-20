define(['paramsManager', 'escodegen'],function(paramsManager, escodegen){

    const paramMgr = paramsManager(escodegen);
    console.log('foo', escodegen);
    // https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
    const htmlToElement = function(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    };


    const refreshController = function(activeContentDiv, theCell, editorController){
        activeContentDiv.innerHTML = '';
        let params = theCell.canvasAnim.getParams();
        for(let key in params){
            let param = params[key];
            let labelString = `<p>${key}</p>`;
            let label = htmlToElement(labelString);
            activeContentDiv.appendChild(label);
            
            let sliderString = `<input type=range value=${param.value} min=${param.min || 0} 
                                         max=${param.max || 1} step=${param.step || 0.0001}>`;
            let slider = htmlToElement(sliderString);
            activeContentDiv.appendChild(slider);
            slider.addEventListener('input', async (event) => {
                 if (editorController) {
                     const sourceCode = await theCell.canvasAnim.getSourceCode();
                     const codeString = sourceCode.code;
                     const rootAst = paramMgr.parseCodeString(codeString);
                     let argsAst = paramMgr.findDefineArguments(rootAst);
                     let paramsAst = paramMgr.extractParamsFromArguments(argsAst);
                     let paramsO = paramMgr.extractParamsObject(paramsAst);
                     
                     paramsO.speed.value = event.target.value;
                     paramMgr.setParamsValue(paramsAst, paramsO);
                     sourceCode.code = paramMgr.generateCodeString(rootAst);
                     
                     // editorController.updateWithCanvasAnim(theCell.canvasAnim);
                     editorController.updateWithSource(sourceCode, theCell.canvasAnim.animationName);
                 }else{
                     param.value = event.target.value;
                 }
            });
        }
    };

    return {refreshController};
});
