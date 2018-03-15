const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const assert = require('assert');

function waitUntil(cb, timeLimit){
    return new Promise((resolve, reject) => {
        const start = Date.now();
        let id = setInterval(() => {
            if(cb()){
                clearInterval(id);
                resolve();
            }else if(Date.now() - start > timeLimit * 1000){
                clearInterval(id);
                reject('time out');
            }
        }, 500);
    });
}

(async () => {
    const browser = await puppeteer.launch();
    try{
        const page = await browser.newPage();
        page.on('console', e => console.log('page says:', e._text));
        await page.setViewport({width: 1024, height: 768});  
        const url = 'http://localhost:8000/assemblage/delay';
        await page.goto(url, {waitUntil: 'networkidle2'});

        await page.waitForSelector('#cellUi-0-0-control-panel-icon', {visible:true});

        await page.click("#cellUi-0-0-control-panel-icon");

        await page.waitForSelector('.tabs__title:nth-of-type(2)', {visible:true}); 
        // open editor panel
        await page.click('.tabs__title:nth-of-type(2)');
        await page.waitForSelector('.filename_display', {visible:true}); 

        const newAnimationName = 'save-as-test';
        const filePath =`./public/animations/${newAnimationName}.js`;

        fs.removeSync(filePath);
        assert(!fs.existsSync(filePath));
        //const correctFileContent = 'define({setup:()=>{}, draw:()=>{}})';
        const correctFileContent = 'define({setup: function (context){}, draw: function (context, borders){}})';
        await page.evaluate(async (newAnimationName, correctFileContent) => {
            let originalAnimationName = 'meuh';
            try{
                const aceEditor = ace.edit('the_ace_editor');
                aceEditor.setValue(correctFileContent);
                // TODO check that
                //x.cells[0][0].canvasAnim.evaluateCode exists TODO
                //wait until the code is added to the animation
                //x.cells[0][0].canvasAnim.evaluateCode is undefined


                originalAnimationName = document.querySelector('.filename_display').innerHTML;
                console.log("animations", originalAnimationName, newAnimationName);
                const editors = [... document.querySelector('#control-panel_Editor').children];
                const theEditor = editors.filter(n => !n.classList.contains('invisible'))[0];
                theEditor.querySelector('.animation_save_as_button').click();
                document.querySelector('#prompt_input').value = newAnimationName;
                document.querySelector('#ok_button').click();
            }catch(e){
                console.log('page complains:', e.message);
            }
        }, newAnimationName, correctFileContent);

        await waitUntil(()=> fs.existsSync(filePath), 2);

        let fileContent = fs.readFileSync(filePath, 'utf8');
        assert.equal(fileContent, correctFileContent);

        console.log("test done");
    }finally{
        await browser.close();
    }
 })().catch(e => {
     console.error('ouch',e);
     
 });
