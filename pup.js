const puppeteer = require('puppeteer');

    
 (async () => {
     const browser = await puppeteer.launch();
     const page = await browser.newPage();
     page.on('console', e => console.log(e._text));
     // await page.setViewport({width: 1024, height: 768});  
     const url = 'http://localhost:8000/assemblage/delay';
     await page.goto(url, {waitUntil: 'networkidle2'});

     // await page.goto('https://example.com');
     // await page.screenshot({path: 'example.png'});

     await page.waitForSelector('#cellUi-0-0-control-panel-icon', {visible:true});
     // await page.evaluate(async () => { try{ console.log("helo",
     //     "bye"); // open panels const button =
     //     document.getElementById("cellUi-0-0-control-panel-icon");
     //     console.log("me", button); button.click(); }catch(e){
     //     console.log("boum", e.message); } });

     await page.click("#cellUi-0-0-control-panel-icon");

     await page.waitForSelector('.tabs__title:nth-of-type(2)', {visible:true}); 
     // open editor panel
     await page.click('.tabs__title:nth-of-type(2)');
     await page.waitForSelector('.filename_display', {visible:true}); 

    await page.evaluate(async () => {
        let originalAnimationName = 'meuh';
        try{
            originalAnimationName = document.querySelector('.filename_display').innerHTML;
            console.log("youpi", originalAnimationName);
        }catch(e){
            console.log(e.message);
        }
    });
     await browser.close();
    // // document.querySelectorAll('.tabs__title')[1].click();
    
    // // document.querySelector(".animation_save_as_button").click();
    // // document.getElementById("prompt_input").value = "test_save_as";
    // // document.getElementById("ok_button").click();

    // //let fileContent = fs.read(path);

 })().catch(e => console.error('ouch',e));
