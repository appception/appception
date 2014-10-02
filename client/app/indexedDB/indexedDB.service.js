'use strict';

angular.module('appceptionApp')
  .factory('indexedDB', function ($q) {

    // insert files and directories for a given repo
    // into the user's browsers local database
    var insertRepoIntoLocalDB = function(repo, items) {

      var filer = new Filer.FileSystem({
        name: 'files',
        provider: new Filer.FileSystem.providers.Fallback('makedrive')
      });
      
      // iterate through the items from the repo.
      for(var i =0; i < items.length; i++){
        var item = items[i];

        var filePath = '/'+repo + '/' + item[0].path.replace(/^.*?\//, '');

        // if item has no content, create a directory
        if(! item[0].hasOwnProperty('content')) {
          filer.mkdir( filePath , function(err){
            if(err) throw err;
          });
        // if item has content, create a file
        }  else {
          filer.writeFile(filePath , item[0].content, function(error) {
            if(error) throw error;
          })
        }
      }
    };

    // export files and directories from the user's browsers local database
    var exportLocalDB = function(){

      var filer = new Filer.FileSystem({
        name: 'files',
        provider: new Filer.FileSystem.providers.Fallback('makedrive')
      });
      var shell = filer.Shell();

      var promises = [];
      var results = [];

      // turn shell.ls callback into a promise
      var defer = $q.defer();

      // shell.ls get list of all files and directories in user's browsers local DB
      shell.ls('/', {recursive: true}, function(err, entries){
        // console.log('entries', entries[0])
        if (err) throw err;
        // counter keeps track of the number of promises
        var counter = 0;

        var traverseDirectory = function(item, fullpath){

          // loop through every item in a directory
          angular.forEach(item.contents, function(entry, i){
            var entry = item.contents[i];
            var itemPath = fullpath + '/' + entry.path;

            // if item is a file, read the file,  
            // and add  file path and content to promises
            if(entry.type === 'FILE'){

              (function(i) {
                // turns filer.readFile callback into a promise
                promises[i] = $q.defer();
                filer.readFile(itemPath, function(err, data){
                  if (err) {
                    return promises[i].reject(err);
                  } 
                  // console.log('file2:', itemPath, data);
                  promises[i].resolve({path: itemPath, content: data.toString()});
                }) 
              })(counter++)

            // if item is directory, add directory path to promises, and 
            //  recursively traverse the directory
            } else if (entry.type === 'DIRECTORY') {
             // console.log('directory:', itemPath);
              promises[counter]  = $q.defer();
              promises[counter].resolve({path: itemPath});
              counter++;
              traverseDirectory(entry, itemPath );
            }

            // console.log(promises)

          })
        }

        // get all the files and directories for the root directory
        if(entries[0] && entries[0].type==="DIRECTORY"){
          traverseDirectory(entries[0], '/' + entries[0].path)
        } else {
          alert('You need a folder folder at the root of your project.')
        }

        // since there are two nested level of promises,
        // push every  promise in 2nd level of promise (promises[])
        // into the promise of the 1st level (REALpromises[]) 
        var REALpromises = [];
        angular.forEach(promises, function(promise) {
          REALpromises.push(promise.promise);
        })
        defer.resolve($q.all(REALpromises));
    
      });

      return defer.promise;

    };

    return {
      exportLocalDB: exportLocalDB,
      insertRepoIntoLocalDB: insertRepoIntoLocalDB
    }

  });
