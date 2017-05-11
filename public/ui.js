
define(["csshelper"], function( csshelper){

    var modalScreen = document.getElementById("modal"),
	dialog = document.getElementById("dialog"),
        dialogContent = document.getElementById("dialog_content"),
        dialogTitle = document.getElementById("dialog_title"),
        dialogFooter = document.getElementById("dialog_footer");
    
    var makeCancelButton = function(){
        var cancelButton = document.createElement("button");
	cancelButton.textContent = "cancel";
        csshelper.addClass(cancelButton, "btn");
	cancelButton.addEventListener('click', function() {
            showDialog(false); 
        });
        return cancelButton;
    };

    var buildPrompt = function(promptText){
        return new Promise(function(resolve, reject){
            var input = document.createElement("input"),
            buttonRow = document.createElement("div");

            dialogTitle.innerHTML = "";
            dialogContent.innerHTML = "";
            dialogFooter.innerHTML = "";
            dialogTitle.textContent = promptText;
            dialogContent.appendChild(input);
            dialogFooter.appendChild(buttonRow);

            input.setAttribute("id", "prompt_input");

            var okButton = document.createElement("button");
            okButton.textContent = "ok";
            okButton.id = "ok_button";
            csshelper.addClass(okButton, "btn");
            okButton.addEventListener('click', function(){
                var maybeFilename = input.value;
                if(maybeFilename){
                    resolve(maybeFilename);
                }else{
                    reject();
                }
                showDialog(false);
            });
            buttonRow.appendChild(okButton);
            var cancelButton = makeCancelButton();
            cancelButton.addEventListener('click', function(){
                resolve(null);
            });
            buttonRow.appendChild(cancelButton);
            showDialog(true);
            input.focus();

        });
    };

    var populateNamePicker = function(title, names){
        return new Promise(function(resolve, reject){
            
            dialogTitle.innerHTML = title;
            dialogContent.innerHTML = "";
            dialogFooter.innerHTML = "";
	    
	    var list = document.createElement("ul");
	    dialogContent.appendChild(list);

	    for(var i = 0; i < names.length; ++i){
	        var item = document.createElement("li");
	        item.textContent = names[i];
                item.id = names[i];
                item.addEventListener('click', function(e){
                    showDialog(false);
                    resolve(e.target.textContent);
                });
	        
	        list.appendChild(item);
	    }

            var cancelButton = makeCancelButton();
            cancelButton.addEventListener('click', function(){
                resolve(null);
            });
            dialogFooter.appendChild(cancelButton);

            showDialog(true);
        });
    };

    var selectText = function(textToSelect, selectedText, scrollToTop){ 
        if(selectedText){
            selectedText.classList.remove('selected');
        }
        textToSelect.classList.add('selected');

        if(scrollToTop){
            var top = textToSelect.offsetTop,
                container = textToSelect.parentNode.parentNode.parentNode;
            container.scrollTop = top - container.getBoundingClientRect().top;
        }
        return textToSelect;
    };
    
    var createList = function(parent, names, onClickName, selectedName){
        parent.innerHTML = '';
        var nameList = document.createElement("div"),
            list = document.createElement("ul"),
            selectedText;
        nameList.classList.add('name-list');
        nameList.appendChild(list);
        parent.appendChild(nameList);
        for(var i = 0; i < names.length; ++i){
            var item = document.createElement("li"),
                text = document.createElement("p");
            item.appendChild(text);
            list.appendChild(item);

            text.textContent = names[i];
            text.id = names[i];
            if(names[i] === selectedName){
                selectedText = selectText(text, selectedText, true);
            }
            text.addEventListener('click', function(e){
                selectedText = selectText(e.target, selectedText, false);
                onClickName(e.target.textContent);
            });
            
        }
    };

    var setKeyHandler = function(handler){
        document.getElementsByTagName('body')[0].onkeyup = handler;
    };

    var hideOnBackgroundClick = function(activate){
        var handler = function(e){
            if(e.target === modalScreen){
                showDialog(false);
            }
        };
        modalScreen.onclick = activate ? handler : null;
    };

    var showDialog = function(visible){
        if (visible){
            csshelper.removeClass(modalScreen, "invisible"); 
            setKeyHandler(function(e){
                // 27 = escape
                if(e.keyCode === 27){
                    showDialog(false);
                }
            });
            hideOnBackgroundClick(true); 
        }else{
            csshelper.addClass(modalScreen, "invisible"); 
            setKeyHandler(null);
            hideOnBackgroundClick(false); 
        }
    };

    return {
        buildPrompt: buildPrompt,
        createList: createList,
        populateNamePicker: populateNamePicker
    };
});
