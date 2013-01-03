/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
    "use strict";
    
    var CommandManager          =   brackets.getModule("command/CommandManager"),
        Menus                   =   brackets.getModule("command/Menus"),
        EditorManager			=	brackets.getModule("editor/EditorManager"),
        DocumentManager         =   brackets.getModule("document/DocumentManager"),
        DocumentCommandHandlers	=   brackets.getModule("document/DocumentCommandHandlers");
        
    var WORD_WRAP_COMMAND_ID    =   "view.wordwrap";
    
	function checkUncheckWordWrapMenu() {
        var wordWrapRef = CommandManager.get(WORD_WRAP_COMMAND_ID);
        if (!wordWrapRef) {
            return;
        }
        var toggleCheck = !wordWrapRef.getChecked();
        wordWrapRef.setChecked(toggleCheck);
                
        return toggleCheck;
    }
    
    function handleWordWrap() {
        var isChecked = checkUncheckWordWrapMenu();
        
        var listOfOpenDocuments = DocumentManager.getAllOpenDocuments();
        DocumentManager.closeAll();
        EditorManager.setWordWrapForEditor(isChecked);
    	
        var doc;
        for (doc in listOfOpenDocuments) {
            if (listOfOpenDocuments.hasOwnProperty(doc)) {
                DocumentCommandHandlers.doOpen(listOfOpenDocuments[doc].file.fullPath);
                DocumentManager.addToWorkingSet(listOfOpenDocuments[doc].file);
            }
        }
    }
    
    CommandManager.register("Word Wrap", WORD_WRAP_COMMAND_ID, handleWordWrap);
    
    var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
    menu.addMenuDivider();
    menu.addMenuItem(WORD_WRAP_COMMAND_ID);
});