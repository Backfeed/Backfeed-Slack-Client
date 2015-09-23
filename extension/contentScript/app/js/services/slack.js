angular.module('MyApp')
.service('Slack', Slack);

function Slack($http, SLACK_API_URL) {

  var service = {

    getChannel: getChannel,
    get: get

  };

  return service;

  function getChannel(channelId, token) {
    return get('channels.info', {
      channelId: channelId,
      token: token
    })
  }

  function get(url, params) {
    return $http.get(SLACK_API_URL + url, mergeParams(params))
            .then(function(response) {
              return response.data;
            });
  }

  function getBaseParams() {
    return { user_token: '' };
  }
  
  function mergeParams(params) {
    return params;
    // return angular.extend(getBaseParams(), params);
  }

}