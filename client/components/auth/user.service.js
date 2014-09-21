'use strict';

angular.module('appceptionApp')
  .factory('User', function ($resource) {

    // $resource(url, [paramDefaults], [actions], options);
    return $resource('/api/users/:id/:controller',
    {
      // @: Angular 'this'; _id: MongoDB default field name for ids
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });


  });
