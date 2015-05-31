define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus = brackets.getModule("command/Menus"),
        EditorManager = brackets.getModule('editor/EditorManager'),
        AppInit = brackets.getModule("utils/AppInit"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeConnection = brackets.getModule("utils/NodeConnection"),
        KeyBindingManager = brackets.getModule("command/KeyBindingManager"),
        nodeConnection = new NodeConnection(),
        COPY_TO_CAMEL_CASE = "copy-to-camel-case",
        COPY_TO_SNAKE_CASE = "copy-to-snake-case",
        COPY_CASE = "copy-case",
        KEYBOARD_SHORTCUT = 'Ctrl-Shift-E',
        menu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU),
        dividerHandle,
        commandId;
        
    
    AppInit.appReady(function() {
        nodeConnection.connect(true).done(function() {
            var path = ExtensionUtils.getModulePath(module, "node/clipboard");
            nodeConnection.loadDomains([path], true).done(function() {
                nodeConnection.domains.clipboard.load();
            }).fail(error);
        }).fail(error);
        
    });
    
    CommandManager.register("Copy to snake-case", COPY_TO_SNAKE_CASE, handleCopyToSnakeCase);
    CommandManager.register("Copy to CamelCase", COPY_TO_CAMEL_CASE, handleCopyToCamelCase);
    CommandManager.register("Copy Case", COPY_CASE, handleCopyCase);
    
    menu.on('beforeContextMenuOpen', function() {
        var selection = getSelection();
        
        removeMenuItems();
        
        if(isWord(selection)) {
            dividerHandle = menu.addMenuDivider();
            commandId = COPY_TO_SNAKE_CASE;
            menu.addMenuItem(commandId);
        } else if(isSnakeWord(selection)) {
            dividerHandle = menu.addMenuDivider();
            commandId = COPY_TO_CAMEL_CASE;
            menu.addMenuItem(commandId);
        }
        
    });
    
    KeyBindingManager.addBinding(COPY_CASE, KEYBOARD_SHORTCUT);
    
    function error(e) {
        console.log("Error");
        console.log(e);
    }
  
    function removeMenuItems() {
        if(commandId) {
            menu.removeMenuItem(commandId);
        }
        
        if(dividerHandle) {
            menu.removeMenuDivider(dividerHandle.id);
        }
    }
    
    function getSelection() {
        return EditorManager
            .getCurrentFullEditor()
            ._codeMirror
            .doc
            .getSelection();
    }
    
    function handleCopyCase() {
        var selection = getSelection();
        
        if(isWord(selection)) {
            handleCopyToSnakeCase();
        } else if(isSnakeWord(selection)) {
            handleCopyToCamelCase();
        }
    }
    
    function handleCopyToCamelCase() {
        var text = getSelection().replace(/(\-[a-z])/g, function($1) {
            return $1.toUpperCase().replace('-','');
        });
        nodeConnection.domains.clipboard.callCopy(text)
    }

    function handleCopyToSnakeCase() {
        var text = getSelection()
            .replace(/^[A-Z]/g, function($1) {
                return $1.toLowerCase();
            }).replace(/([A-Z])/g, function($1) {
                return '-' + $1.toLowerCase();
            });
        nodeConnection.domains.clipboard.callCopy(text)
    }
    
    function isWord(text) {
        return /^[A-Za-z]+$/g.test(text);
    }
    
    function isSnakeWord(text) {
        return /^[a-z]+(-[a-z]+)*$/g.test(text);
    }


});