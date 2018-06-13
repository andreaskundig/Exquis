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
            activeTabConfig,
            tabNameToParentDivMap = {};
        tabsRoot.appendChild(tabsHeaderRoot);
        tabsRoot.classList.add("tabs");
        tabsContentRoot.classList.add("tabs__content");
        tabsRoot.appendChild(tabsContentRoot);
        tabsHeaderRoot.classList.add("tabs__header");
        
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
            if(index > 0){
                tabContentDiv.classList.add("invisible");
            }
            tabContentDiv.id = tabsRoot.id + "_" + tabConfig.name;
            tabsContentRoot.appendChild(tabContentDiv);
            tabNameToParentDivMap[tabConfig.name] = tabContentDiv;
            
            tabHeader.addEventListener("click", function(event){
               var activeHeader = tabsHeaderRoot.querySelector('.tabs__title--active'),
                   activeContent = document.querySelector(activeContentSelector);
               if (event.target === activeHeader) { return; }
               tabHeader.classList.add('tabs__title--active');
               activeHeader.classList.remove('tabs__title--active');
               activeContent.classList.add('invisible');
               tabContentDiv.classList.remove('invisible');
                tabConfig.clickHandler(tabContentDiv);
                console.log(tabContentDiv);
               activeTabConfig = tabConfig;
            });

            tabConfig.initHandler && tabConfig.initHandler(tabContentDiv);
        });

        // add dummy tab to display a bottom border
        var bottomBorderDiv = document.createElement('div');
        bottomBorderDiv.classList.add('tabs__title--empty', 'tabs__title');
        
        tabsHeaderRoot.appendChild(bottomBorderDiv);

        
        var refreshActiveTab = function(){
            activeTabConfig.clickHandler(document.querySelector(activeContentSelector));
        };

        var getParentDiv = function(tabName){
            return tabNameToParentDivMap[tabName];
        };
        
        return {refreshActiveTab, getParentDiv};
    };

    return create;
});
