define([], function(){

    
    // config
    // {
    //   tabsRoot: domId
    //   tabs: [ { name, initHandler, clickHandler } ]
    // }
    var create = function(config){
        var tabsRoot = document.getElementById(config.tabsRoot),
            tabsHeaderRoot = document.createElement("div"),
            tabsContentRoot = document.createElement("div"),
            activeContentSelector = '#'+tabsRoot.id+'>div>div.tabs__content:not(.invisible)';
        tabsRoot.appendChild(tabsHeaderRoot);
        tabsContentRoot.classList.add("tabs__content");
        tabsRoot.appendChild(tabsContentRoot);
        
        config.tabs.forEach(function(tabConfig, index){
            var tabHeader = document.createElement("div");
            tabHeader.classList.add("tabs__title");
            tabHeader.innerHTML = tabConfig.name;
            if(index === 0){
                tabHeader.classList.add("tabs__title--active");
            }
            tabsHeaderRoot.appendChild(tabHeader);

            var tabContent = document.createElement("div");
            tabContent.id = tabsRoot.id + "_" + tabConfig.name;
            tabsContentRoot.appendChild(tabContent);
            
            tabHeader.addEventListener("click", function(event){
               var activeHeader = tabsHeaderRoot.querySelector('.tabs__title--active'),
                   activeContent = document.querySelector(activeContentSelector);
               if (event.target === activeHeader) { return; }
               activeHeader.classList.remove('tabs__title--active');
               activeContent.classList.add('invisible');
               tabHeader.classList.add('tabs__title--active');
               tabContent.classList.remove('invisible');
               tabConfig.clickHandler(tabContent);
            });

            tabConfig.initHandler && tabConfig.initHandler(tabContent);
        });
    };

    return create;
});
