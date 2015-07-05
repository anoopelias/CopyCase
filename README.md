#CopyCase

A brackets plugin to enable developers to copy the text while toggling the case of the content. This plugin currently enable converting `snake-case` to `CamelCase` and vice-versa.

This is particularly useful for Angular developers who might have to search for the toggled case content in the project.

## How to Install

 - Open brackets and go to File -> Extension Manager
 - Search for `copycase` in the search box.
 - Select install button on the right

## Usage

### Using pointer,

 - Select a word in the editor and right-click
 - If the selected word is in CamelCase, there will be an option `Copy to snake-case`
 - Similarly, if the word is in snake-case, there will be an option `Copy to CamelCase`
 - For any other kind of selection, there won't be any option from copy case.

### Keyboard Shortcut

Use `Ctrl-Shift-E`.

Since the pointer menu is contextual, we generate it on right-click event. So unlike other right-click options it will *not* list the Keyboard shortcut.
