angular.module('MyApp')
.service('Slack', Slack);

function Slack($q, $http, SLACK_API_URL) {

  var service = {

    getChannel: getChannel,
    get: get

  };

  return service;

  function getChannel(channelId, token) {
    return get('channels.info', {
      channel: channelId,
      token: token
    });
  }

  function get(url, params) {
    var deferred = $q.defer();
    
    $.ajax({
      type: "GET",
      url: SLACK_API_URL + url,
      data: params,
      success: function(res) { deferred.resolve(res) },
      persist: true,
      dataType: 'JSON'
    });

    return deferred.promise;

    // return $http.get(SLACK_API_URL + url, mergeParams(params))
    //         .then(function(response) {
    //           return response.data;
    //         });
  }

  // function getBaseParams() {
  //   return { user_token: '' };
  // }
  
  // function mergeParams(params) {
  //   return params;
    // return angular.extend(getBaseParams(), params);
  // }

}