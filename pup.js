const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
    const url = 'http://localhost:8000/assemblage/delay';
  await page.goto(url);
  // await page.goto('https://example.com');
  // await page.screenshot({path: 'example.png'});
    const dimensions = await page.evaluate(() => {
        console.log('hey');
        let originalAnimationName = 'meuh';
        try{
            // open panels
            document.getElementById("cellUi-0-0-control-panel-icon").click();
            // open editor panel
            originalAnimationName = document.querySelector('.filename_display').innerHTML;
            document.querySelectorAll('.tabs__title')[1].click();
            

            
            document.querySelector(".animation_save_as_button").click();
            document.getElementById("prompt_input").value = "test_save_as";
            document.getElementById("ok_button").click();

            //let fileContent = fs.read(path);
        }catch(e){
            console.log(e.message);
        }
        return {
            name: originalAnimationName,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });

  console.log('Dimensions:', dimensions);

  await browser.close();
})();
