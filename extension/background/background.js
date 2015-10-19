console.log("background.js");


chrome.runtime.onConnect.addListener(addPortMsgListener);
chrome.runtime.onMessage.addListener(addMsgListener);

function addPortMsgListener(port) {
  port.onMessage.addListener(function(msg) {
    if (msg.gesture) {
      sendGesture(msg)
    }
  });
}

function addMsgListener(msg, sender, sendResponse) {

  switch (msg.message) {

    case 'beginOAuth':
      beginOAuth();
      break;

    case 'submitToken':
      submitToken(msg.token);
      break;

    case 'logout':
      sendGesture({
        "gesture": 'logout',
        "options": {}
      });
      break;

    case 'updateChannelIds':
      if (localStorage['satellizer_token'] != undefined && localStorage['bf-ext-team'] == msg.teamName) {
        var params = {
          team: JSON.parse(localStorage['bf-ext-team-info']).id
        };

        $.ajax({
          type: 'POST',
          url: 'https://developslackext.elasticbeanstalk.com/allChannelIdsForTeam',
          data: params,
          success: function(data) {
            sendResponse({
              login: "true"
            });
            if (data != '') {
              data = data.substring(1, data.length - 1);
              chrome.storage.sync.set({
                'channelId': data
              }, function() {
                console.log("set channelId")
              });
            }
          }
        });
        return true;
      }
      break;

    default:
      if (localStorage['satellizer_token'] == undefined || localStorage['bf-ext-team'] != msg.teamName) {
        sendResponse({
          login: "false"
        });
        sendGesture({
          "gesture": 'showAlertFromMainCtr',
          "options": {}
        });
      } else {
        var token = localStorage['bf-ext-token'];
        var params = {
          token: token,channelId: msg.channelId
        };

        // get satellizer_token (to be used in API calls)
        $.ajax({
          type: 'POST',
          url: 'https://developslackext.elasticbeanstalk.com/allContributionsFromUser',
          data: params,
          success: function(data) {
            console.log('server returned, satellizer token:' + data);
            console.log('server returned, satellizer token:' + JSON.parse(data).contribitions);
            sendResponse({
              login: "true",
              contributionIds: JSON.parse(data).contribitions,
              milestonesIds: JSON.parse(data).milestones,
              closeContributionIds: JSON.parse(data).closedContribitions,
              closeMilestonesIds: JSON.parse(data).closedMilestones
            });
            sendGesture(msg.message, sendResponse);
          }
        });

        return true;

      }

      break;
  }

}


function beginStream() {
  console.log("log in completed.");

  chrome.tabs.query({
    url: "https://*.slack.com/*"
  }, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.tabs.reload(tab.id);
    });
  });
  sendGesture({
    "gesture": 'refreshWindows',
    "options": {}
  });

}

function getTeamData(token) {

  var response = $.ajax({
    type: 'GET',
    url: 'https://slack.com/api/team.info',
    data: {
      token: token
    },
    async: false,
    success: function(data) {
      return data;
    }
  }).responseJSON;

  if (response.ok === true) {
    return response.team;
  } else {
    return false;
  }
}

function getUserData(user, token) {
  var data = {
    token: token,
    user: user
  };

  var response = $.ajax({
    type: 'POST',
    url: 'https://slack.com/api/users.info',
    data: data,
    async: false,
    success: function(data) {
      return data;
    }
  }).responseJSON;

  if (response.ok === true) {
    return response.user;
  } else {
    return false;
  }
}

// Checks that provided API key is valid
function isTokenValid(token) {
  var data = {
    token: token
  };

  var response = $.ajax({
    type: 'POST',
    url: 'https://slack.com/api/auth.test',
    data: data,
    async: false,
    success: function(data) {
      return data;
    }
  }).responseJSON;

  if (response.ok === true) {
    return response;
  } else {
    return false;
  }
}

function getParams(url) {
  var paramsObj = {};
  var splitUrl = url.split('?');
  var paramString = splitUrl[1];
  var params = paramString.split('&');
  for (var i in params) {
    var param = params[i];
    var array = param.split('=');
    var key = array[0];
    var value = array[1];
    paramsObj[key] = value;
  }
  return paramsObj;
}

function submitToken(token) {
  var auth = isTokenValid(token);

  if (auth === false) {
    console.info('[info] Authenticated failed');
    return false;
  } else {
    var team = auth.team;
    var user_id = auth.user_id;
    var authUser = getUserData(user_id, token);
    var authTeam = getTeamData(token);
    localStorage.setItem('bf-ext-user', JSON.stringify(authUser));
    localStorage.setItem('bf-ext-team-info', JSON.stringify(authTeam));
    localStorage.setItem('bf-ext-token', token);
    localStorage.setItem('bf-ext-team', team);

    // get satellizer_token (to be used in API calls)
    $.ajax({
      type: 'POST',
      url: 'https://developslackext.elasticbeanstalk.com/auth/ext_login',
      data: { token: token },
      success: function(data) {
        console.log('server returned, satellizer token:' + data.token);
        if (data.orgChannelId != '') {
          chrome.storage.sync.set({
            'channelId': data.orgChannelId
          }, function() {
            console.log("set channelId")
          });
        }
        localStorage.setItem('satellizer_token', data.token);
        beginStream();
      }
    });

    return true;
  }
}


function exchangeSlackCode(data) {

  $.ajax({
    type: 'POST',
    url: 'https://slack.com/api/oauth.access',
    data: data,
    success: function(data) {
      if (data.ok === true) {
        submitToken(data.slackAccessToken);
      }
    }
  });
}

function generateState() {

  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function beginOAuth() {
  console.log('beginOAuth ')

  $.ajax({
    type: 'GET',
    url: '/config.json',
    success: function(json) {

      var data = JSON.parse(json);
      var b = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        e: function(e) {
          var t = "";
          var n, r, i, s, o, u, a;
          var f = 0;
          e = b._utf8_encode(e);
          while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
              u = a = 64;
            } else if (isNaN(i)) {
              a = 64;
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
          }
          return t;
        },
        d: function(e) {
          var t = "";
          var n, r, i;
          var s, o, u, a;
          var f = 0;
          e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
          while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
              t = t + String.fromCharCode(r);
            }
            if (a != 64) {
              t = t + String.fromCharCode(i);
            }
          }
          t = b._utf8_decode(t);
          return t;
        },
        _utf8_encode: function(e) {
          e = e.replace(/\r\n/g, "\n");
          var t = "";
          for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
              t += String.fromCharCode(r);
            } else if (r > 127 && r < 2048) {
              t += String.fromCharCode(r >> 6 | 192);
              t += String.fromCharCode(r & 63 | 128);
            } else {
              t += String.fromCharCode(r >> 12 | 224);
              t += String.fromCharCode(r >> 6 & 63 | 128);
              t += String.fromCharCode(r & 63 | 128);
            }
          }
          return t;
        },
        _utf8_decode: function(e) {
          var t = "";
          var n = 0;
          var r = c1 = c2 = 0;
          while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
              t += String.fromCharCode(r);
              n++;
            } else if (r > 191 && r < 224) {
              c2 = e.charCodeAt(n + 1);
              t += String.fromCharCode((r & 31) << 6 | c2 & 63);
              n += 2;
            } else {
              c2 = e.charCodeAt(n + 1);
              c3 = e.charCodeAt(n + 2);
              t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
              n += 3;
            }
          }
          return t;
        }
      };
      var j = b.d(data.c);
      var d = JSON.parse(j);

      // TBD: d = {client_secret:'5b42578a37563c31ee665f646d92228c',client_id:'3655944058.7646397622'}

      var state = generateState();
      var url = 'https://slack.com/oauth/authorize';
      url += '?client_id=' + d.client_id;
      url += '&state=' + state;
      url += '&scope=identify,read,post,client';

      var options = {
        'interactive': true,
        'url': url
      };

      console.log('beginOAuth calling: launchWebAuthFlow.')

      chrome.identity.launchWebAuthFlow(options, function(redirectUrl) {
        console.log('launchWebAuthFlow returned.');
        var params = getParams(redirectUrl);
        if (params.state == state) {
          d.code = params.code;
          exchangeSlackCode(d);
        }
      });

    }
  });

}

function sendGesture(msg) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, msg)
  });
}
