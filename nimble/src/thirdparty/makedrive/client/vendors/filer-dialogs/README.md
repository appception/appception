# filer-dialogs

Open and save as filer dialogs for use with MakeDrive.

## Getting Started

Include filer-dialog.js in the page or with require.

Inclue style/style.css and bower_components/font-awesome/css/font-awesome.min.css

## API

### showOpenDialog

`filerDialogs.showOpenDialog(allowMultipleSelection, chooseDirectories, title, initialPath, fileTypes, callback)`

- allowMultipleSelection allows multiple files to be selected and opened.
- chooseDirectories allows for directories to be opened.
- title is the title of the dialog.
- initialPath is the path to display initially when the dialog opens.
- fileTypes the file types to display.
- callback called on open, `callback(error, files)` files is an array of file paths to be opened.

### showSaveAsDialog

`filerDialogs.showSaveAsDialog(title, initialPath, defaultName, callback)`

- title is the title of the dialog.
- initialPath is the path to display initially when the dialog opens.
- defaultName is the file name to be initially displayed as the name when opened.
- callback called on save as, `callback(error, path)` path is the path to save the new file as.
