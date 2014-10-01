/*global define, $, brackets, Mustache, console */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return (root.filerDialogs = factory());
    });
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.filerDialogs = factory();
  }
}(this, function() {

  function createDialog(data) {

    var dialogWrapper = document.createElement("div");
    dialogWrapper.classList.add("file-dialog-wrapper");
    var dialogBackdrop = document.createElement("div");
    dialogBackdrop.classList.add("file-dialog-backdrop");
    var dialogInnerWrapper = document.createElement("div");
    dialogInnerWrapper.classList.add("file-dialog-inner-wrapper");
    var dialog = document.createElement("div");
    dialog.classList.add("makedrive-file-dialog");

    dialogWrapper.appendChild(dialogInnerWrapper);
    dialogInnerWrapper.appendChild(dialogBackdrop);
    dialogInnerWrapper.appendChild(dialog);

    // I want to fix this. Having HTML live in a string is not awesome. Should be an HTML file.
    // I need the HTML template to be loaded via a relative path, without require.
    // Problem is this file itself may be loaded in via require, which changes any relative paths.
    // I also cannot have large changes to a require config that loads this module.
    // For now, this string may be ugly, but it's working.
    dialogString =
      '  <div class="file-dialog-header">' +
      '    <h1 class="file-dialog-title"></h1>';
    if (data.saveAs) {
      dialogString +=
        '    <div class="file-name-container">' +
        '      <span class="input-label">Name </span>' +
        '      <span class="fa-floppy-o fa-icon floppy-icon"></span>' +
        '      <input class="file-name-input" value="">' +
        '    </div>';
    }
    dialogString +=
      '    <div class="file-path">' +
      '      <span class="input-label">Folder </span>' +
      '      <span class="fa-arrow-left fa-icon back-button"></span>' +
      '      <input class="folder-name" value="">' +
      '      <span class="fa-chevron-down fa-icon drop-down"></span>' +
      '    </div>' +
      '  </div>' +
      '  <div class="file-dialog-body">' +
      '    <div class="file-selector-box"></div>' +
      '    <div class="open-files-container"></div>' +
      '  </div>' +
      '  <div class="file-dialog-footer">' +
      '    <button class="cancel-button" data-button-id="cancel"></button>' +
      '    <button class="open-button" data-button-id="done"></button>' +
      '  </div>';

    dialog.innerHTML = dialogString;

    dialog.querySelector(".open-button").textContent = data.done;
    dialog.querySelector(".cancel-button").textContent = data.cancel;
    dialog.querySelector(".file-dialog-title").textContent = data.title;

    return dialogWrapper;
  }

  // Also wish this was a template and I could clone it.
  function createIcon(name, type) {
    var file = document.createElement("span");
    var iconContainer = document.createElement("div");
    var icon = document.createElement("span");
    var fileNameContainer = document.createElement("div");
    var fileName = document.createElement("div");
    file.classList.add("file");

    icon.classList.add(type);
    icon.classList.add("file-icon");
    fileNameContainer.classList.add("file-name");
    fileName.textContent = name;

    iconContainer.appendChild(icon);
    fileNameContainer.appendChild(fileName);

    file.appendChild(iconContainer);
    file.appendChild(fileNameContainer);

    return file;
  }

  function FileDialog() {
    var workingFiles = [];
    var dialog;
    var dialogWrapper;
    var openMultiples = false;
    var openDirectories = false;
    var doneButton;
    var sh;
    var fs;
    var MakeDrive;
    var Path;
    // This is starting to be a thing.
    // I think I need a small event system,
    // or callbacks passed to a ctor.
    var onSelection = function() {};
    var onAction = function() {};
    var onPathInput = function() {};
    var onPathChange = function() {};
    var fileSelected = function() {};

    function enableButton(button, enable) {
      if (enable) {
        button.classList.remove("disabled");
        button.disabled = false;
      } else {
        button.classList.add("disabled");
        button.disabled = true;
      }
    }

    function displayFilesForDir(dir) {
      sh.cd(dir, function(err) {
        if (err) {
          console.error(err);
          return;
        }
        displayFiles();
      });
    }

    function displayFiles() {
      sh.ls(".", function(err, files) {
        if (err) {
          console.error(err);
          return;
        }
        var container = dialog.querySelector(".open-files-container");
        container.innerHTML = "";
        var pathInput = dialog.querySelector(".folder-name");

        pathInput.value = sh.pwd();
        workingFiles = [];
        files.forEach(function(item, index) {
          var type;
          if (item.type === "DIRECTORY") {
            type = "fa-folder";
          } else {
            type = "fa-file-code-o";
          }
          var file = createIcon(item.path, type);
          function onSelect(event) {
            var selected = container.querySelectorAll(".selected");
            var nameInput = dialog.querySelector(".file-name-input");
            if (nameInput && item.type !== "DIRECTORY") {
              nameInput.value = item.path.trim();
            }
            // This is out of hand, I need to fix.
            if (event.shiftKey && openMultiples && (item.type !== "DIRECTORY" || openDirectories) && (!workingFiles[0] || (workingFiles[0].type !== "DIRECTORY" || openDirectories))) {
              file.classList.add("selected");
              // Using unshift so we can check the first item and know it's the most recently selected.
              workingFiles.unshift(item);
            } else {
              if (selected.length) {
                for (var i = 0; i < selected.length; i++) {
                  selected[i].classList.remove("selected");
                }
              }
              file.classList.add("selected");
              workingFiles = [item];
            }
            fileSelected(item);
          }
          file.querySelector(".file-icon").addEventListener("mousedown", onSelect);
          file.querySelector(".file-name").addEventListener("mousedown", onSelect);
          file.querySelector(".file-icon").addEventListener("dblclick", onSelection);
          container.appendChild(file);
        });
      });
    }

    function closeModal() {
      window.removeEventListener("keydown", onKeyDown, true);
      if(dialogWrapper && dialogWrapper.parentNode) {
        dialogWrapper.parentNode.removeChild(dialogWrapper);
      }
    }

    function onKeyDown(event) {
      if (event.keyCode === 27) {
        closeModal();
      } else if (event.keyCode === 13) {
        onAction();
      }
    }

    function setupDialog(initialPath, data) {

      if (window.appshell) {
        MakeDrive = appshell.MakeDrive;
      } else if (window.MakeDrive) {
        MakeDrive = window.MakeDrive;
      }

      fs = MakeDrive.fs();
      sh = fs.Shell();
      Path = MakeDrive.Path;

      initialPath = initialPath || "/";
      dialogWrapper = createDialog(data);
      dialog = dialogWrapper.querySelector(".makedrive-file-dialog");
      doneButton = dialog.querySelector(".open-button[data-button-id='done']");
      $("body").append(dialogWrapper);


      dialog.querySelector(".cancel-button[data-button-id='cancel']").addEventListener("click", closeModal);

      dialog.querySelector(".back-button").addEventListener("click", function() {
        displayFilesForDir("../");
      });

      window.addEventListener("keydown", onKeyDown, true);

      displayFilesForDir(initialPath);
    }

    return {
      showSaveAsDialog: function(title, initialPath, defaultName, callback) {
        callback = callback || arguments[arguments.length - 1]; // get last arg for callback
        setupDialog(initialPath, {
          title: title,
          cancel: "Cancel",
          done: "Save",
          saveAs: true
        });

        onAction = function() {
          var fileName = dialog.querySelector(".file-name-input").value.trim();
          if (!fileName) {
            return;
          }

          callback(null, Path.join(sh.pwd(), fileName));
          closeModal();
        };
        onSelection = function() {
          var workingFile = workingFiles[0];
          if (workingFile.type === "DIRECTORY") {
            displayFilesForDir(workingFile.path);
          }
        }
        doneButton.addEventListener("click", onAction);

        var nameInput = dialog.querySelector(".file-name-input");
        nameInput.focus();
        defaultName = defaultName.trim();
        enableButton(doneButton, defaultName);
        nameInput.value = defaultName || "";
        nameInput.addEventListener("input", function() {
          if (nameInput.value.trim()) {
            enableButton(doneButton, true);
          } else {
            enableButton(doneButton, false);
          }
        });
        var pathInput = dialog.querySelector(".folder-name");
        pathInput.addEventListener("change", function() {
          var inputValue = pathInput.value.trim();
          // starting work on getting the url bar to trigger changes
          fs.stat(inputValue, function(err, stats) {
            if (err || stats.type !== "DIRECTORY") {
              pathInput.value = sh.pwd();
              return;
              // kaboom?
            }
            displayFilesForDir(inputValue);
          });
        });
      },
      showOpenDialog: function(allowMultipleSelection, chooseDirectories, title, initialPath, fileTypes, callback) {
        openDirectories = chooseDirectories;
        openMultiples = allowMultipleSelection;
        callback = callback || arguments[arguments.length - 1]; // get last arg for callback
        onAction = function() {
          var filesToOpen = [];
          var isDirectory = workingFiles[0].type === "DIRECTORY";
          if (!workingFiles || !workingFiles.length) {
            return;
          }
          if ((isDirectory && chooseDirectories) || (!isDirectory && !chooseDirectories)) {
            for (var i = 0; i < workingFiles.length; i++) {
              filesToOpen.push(Path.join(sh.pwd(), workingFiles[i].path));
            }
            callback(null, filesToOpen);
            closeModal();
          }
        };
        onSelection = function() {
          var workingFile = workingFiles[0];
          enableButton(doneButton, false);
          if (workingFile.type === "DIRECTORY") {
            displayFilesForDir(workingFile.path);
            return;
          }
          onAction();
        }
        fileSelected = function(item) {
          if (chooseDirectories) {
            enableButton(doneButton, item.type === "DIRECTORY");
          } else {
            enableButton(doneButton, item.type !== "DIRECTORY");
          }
        };

        setupDialog(initialPath, {
          title: title,
          cancel: "Cancel",
          done: "Open"
        });
        enableButton(doneButton, false);
        doneButton.addEventListener("click", onAction);
        var pathInput = dialog.querySelector(".folder-name");
        var container = dialog.querySelector(".open-files-container");
        pathInput.addEventListener("input", function() {
          var inputValue = pathInput.value.trim();
          var selected = container.querySelector(".selected");
          if (selected) {
            selected.classList.remove("selected");
          }
          workingFiles = [];
          // starting work on getting the url bar to trigger changes
          fs.stat(inputValue, function(err, stats) {
            if (err) {
              enableButton(doneButton, false);
              return;
              // kaboom?
            }
            var fileName;
            var filePath;
            if (chooseDirectories) {
              enableButton(doneButton, stats.type === "DIRECTORY");
            } else {
              enableButton(doneButton, stats.type !== "DIRECTORY");
            }
          });
        });
        pathInput.addEventListener("change", function() {
          var inputValue = pathInput.value.trim();
          // starting work on getting the url bar to trigger changes
          fs.stat(inputValue, function(err, stats) {
            if (err) {
              pathInput.value = sh.pwd();
              return;
              // kaboom?
            }
            var fileName;
            var filePath;

            if ((stats.type === "DIRECTORY" && chooseDirectories) || (stats.type !== "DIRECTORY" && !chooseDirectories)) {
              enableButton(doneButton, true);
              filePath = Path.dirname(inputValue);
              fileName = Path.basename(inputValue);
              sh.cd(filePath, function(err) {
                if (err) {
                  console.error(err);
                  return;
                }
                workingFiles = [{path:fileName}];
                onSelection();
              });
            } else {
              enableButton(doneButton, false);
              if (stats.type === "DIRECTORY") {
                displayFilesForDir(inputValue);
              }
            }
          });
        });
      }
    };
  }

  return {
    showOpenDialog: function() {
      var dialog = new FileDialog();
      dialog.showOpenDialog.apply(null, arguments);
    },

    showSaveAsDialog: function() {
      var dialog = new FileDialog();
      dialog.showSaveAsDialog.apply(null, arguments);
    }
  };
}));
