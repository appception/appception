'use strict';

angular.module('appceptionApp')
  .controller('FilesCtrl', function ($scope, $stateParams, github, Auth) {

    $scope.repoName = $stateParams.repoName;

    var filer = new Filer.FileSystem({
      name: 'files',
      provider: new Filer.FileSystem.providers.Fallback('makedrive')
    });

    var shell = filer.Shell();    

    var exportLocalDB = function(callback){

      // get list of all files and directories in user's browsers local DB
      shell.ls('/', {recursive: true}, function(err, entries){
        console.log('entries', entries[0])
        var results = [];
        if (err) throw err;


        var traverseDirectory = function(item, fullpath){
          var itemObj = {};

          //  add path of directory to results 
          results.push({path: fullpath})
          // console.log('directory:', fullpath);

          // loop through every item in a directory
          item.contents.forEach(function(result, i){
            var entry = item.contents[i];
            var itemPath = fullpath + '/' + entry.path

            // if item is a file, add  file path and content to results
            if(entry.type === 'FILE'){
              filer.readFile(itemPath, function(err, data){
                // console.log('file2:', itemPath, data);
                results.push({path: itemPath, content: data.toString()})
              }) 

            // if item is directory, recursively traverse the directory
            } else if (entry.type === 'DIRECTORY') {
              traverseDirectory(entry, itemPath );
            }
          })

        }

        if(entries[0] && entries[0].type==="DIRECTORY"){
          traverseDirectory(entries[0], '/' + entries[0].path)
        } else {
          alert('You need a folder folder at the root of your project.')
        }

        setTimeout(function(){
          callback(results);
        }, 1000);

        
      });
    };


    $scope.getProjectFiles = function(){

      var files = exportLocalDB(function(results){

        console.log(results)

      });

    }

    $scope.createCommit = function(message) {
      var message = prompt('Enter a commit message:')
      Auth.isLoggedInAsync(function(boolean) {
        if(boolean === true){
          var user = Auth.getCurrentUser()
          console.log('user: ', user)
          github.createCommit(user.github.login, $scope.repoName, message).then(function(res){
            console.log('success!', res.data);
          })
        }else {
          console.log('Sorry, an error has occurred while committing');
        }
      });
    }
  });
