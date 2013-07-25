
define(["csshelper"], function( csshelper){

    var modalScreen = document.getElementById("modal"),
	dialog = document.getElementById("dialog");
    
    var makeCancelButton = function(modalScreen){
        var cancelButton = document.createElement("button");
	cancelButton.innerHTML = "cancel";
	cancelButton.addEventListener('click', function() { csshelper.addClass(modalScreen, "invisible"); });
        return cancelButton;
    };

    var buildPrompt = function(promptText, onAccept){
        var textArea = document.createElement("textarea"),
            promptParagraph = document.createElement("p"),
            buttonRow = document.createElement("div");
        
        promptParagraph.innerHTML = promptText;
        dialog.innerHTML = "";
        dialog.appendChild(promptParagraph);
        dialog.appendChild(textArea);
        dialog.appendChild(buttonRow);

        textArea.setAttribute("id", "prompt_text_area");
        
        var okButton = document.createElement("button");
	okButton.innerHTML = "ok";
        okButton.id = "ok_button";
	okButton.addEventListener('click', function(){
            onAccept(textArea.value);
	    csshelper.addClass(modalScreen, "invisible");
        });
        buttonRow.appendChild(okButton);
        buttonRow.appendChild(makeCancelButton(modalScreen));
	csshelper.removeClass(modalScreen, "invisible");
        textArea.focus();
    };
   
    var populateFilePicker = function(files, clickHandler){
	dialog.innerHTML = '';
	
	for(var i = 0; i < files.length; ++i){
	    var paragraph = document.createElement("p"),
		animationName = files[i].replace(/\.json$/, "");
	    paragraph.innerHTML = animationName;
            paragraph.id = animationName;

	    paragraph.addEventListener('click', clickHandler);
	    
	    dialog.appendChild(paragraph);
	}

        dialog.appendChild(makeCancelButton(modalScreen));
	
    };

    var showDialog = function(visible){
        if (visible){
            csshelper.removeClass(modalScreen, "invisible"); 
        }else{
            csshelper.addClass(modalScreen, "invisible"); 
        }
    };

    return {
        buildPrompt: buildPrompt,
        populateFilePicker: populateFilePicker,
        showDialog: showDialog
    };
});
