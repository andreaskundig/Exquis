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
            activeContentSelector = '#'+tabsRoot.id+'>div.tabs__content>div:not(.invisible)',
            activeTabConfig;
        tabsRoot.appendChild(tabsHeaderRoot);
        tabsRoot.classList.add("tabs");
        tabsContentRoot.classList.add("tabs__content");
        tabsRoot.appendChild(tabsContentRoot);
        
        config.tabs.forEach(function(tabConfig, index){
            var tabHeader = document.createElement("div");
            tabHeader.classList.add("tabs__title");
            tabHeader.innerHTML = tabConfig.name;
            if(index === 0){
                tabHeader.classList.add("tabs__title--active");
                activeTabConfig = tabConfig;
            }
            tabsHeaderRoot.appendChild(tabHeader);

            var tabContentDiv = document.createElement("div");
            tabContentDiv.id = tabsRoot.id + "_" + tabConfig.name;
            tabsContentRoot.appendChild(tabContentDiv);
            
            tabHeader.addEventListener("click", function(event){
               var activeHeader = tabsHeaderRoot.querySelector('.tabs__title--active'),
                   activeContent = document.querySelector(activeContentSelector);
               if (event.target === activeHeader) { return; }
               tabHeader.classList.add('tabs__title--active');
               activeHeader.classList.remove('tabs__title--active');
               activeContent.classList.add('invisible');
               tabContentDiv.classList.remove('invisible');
               tabConfig.clickHandler(tabContentDiv);
               activeTabConfig = tabConfig;
            });

            tabConfig.initHandler && tabConfig.initHandler(tabContentDiv);
        });
        var refreshActiveTab = function(){
            activeTabConfig.clickHandler(document.querySelector(activeContentSelector));
        };
        return refreshActiveTab;
    };

    return create;
});
