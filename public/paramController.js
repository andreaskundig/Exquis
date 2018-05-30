define(function(){
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
            slider.addEventListener('input', (event) => {
                 //TODO make this work without needing to know the parentId 
                 // if (editorController) {
                 //     editorController.updateWithCanvasAnim(theCell.canvasAnim, parentId);
                 // }else{
                     param.value = event.target.value;
                 // }
            });
        }
    };

    return {refreshController};
});
