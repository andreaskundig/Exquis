define([], function(){

    
    // config
    // {
    //   tabsRoot: domId
    //   tabs: [ { name, clickHandler } ]
    // }
    var init = function(config){
        var tabsRoot = document.getElementById(config.tabsRoot),
            tabsContentRoot = document.createElement("div"),
            tabsHeader = document.createElement("div");

        tabsContentRoot.classList.add("tabs__content");
        tabsRoot.appendChild(tabsContentRoot);
        
        tabsRoot.appendChild(tabsHeader);
        
        config.tabs.forEach(function(tab, index){
            var tabTitle = document.createElement("div");
            tabTitle.classList.add("tabs__title");
            tabTitle.innerHTML = tab.name;
            if(index === 0){
                tabTitle.classList.add("tabs__title--active");
            }
            tabsHeader.appendChild(tabTitle);

            var tabContent = document.createElement("div");
            tabContent.id = tabsRoot.id + "_" + tab.name;

            tabsContentRoot.appendChild(tabContent);
            
            tabTitle.addEventListener("click", function(){
                
            });
        });
    };

    return {


    };
});
