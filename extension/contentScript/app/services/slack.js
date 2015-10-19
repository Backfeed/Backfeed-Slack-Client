angular.module('MyApp')
.service('Slack', Slack);

function Slack($q, $http, SLACK_API_URL, CurrentUser) {

  var currentUser = CurrentUser.get();

  var service = {

    getChannel: getChannel,
    get: get,
    postMessage: postMessage

  };

  return service;

  function getChannel(channelId) {
    return get('channels.info', {
      channel: channelId,
      token: currentUser.slackAccessToken
    });
  }

  function postMessage(channelId, message) {
    log('sending test message to slack: ' + message);

    return get('chat.postMessage', {
      icon_url: 'https://s-media-cache-ak0.pinimg.com/236x/71/71/f9/7171f9ba59d5055dd0a865b41ac4b987.jpg',
      username: 'backfeed-bot',
      token: currentUser.access_token,
      channel: channelId,
      text: message,
      link_names: 1,
      parse: "full"
    });

  };

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