<h1>BackFeed Chrome Extension</h1>

<h3>install</h3>

chrome -> options -> extensions -> developer mode ON -> load extension... -> select folder BF-Chrome-Extension -> finish -> 

open for example www.google.com 

Now you will see an icon B ( BackFeed Slack ) in the Extensions Menu

First, `cd contentScript/app/` and run `npm install`.<br>
This will create the `node_modules` folder which contains the packaged needed for the build process.<br>
Then, run `bower install` to install some more packages.<br>
Every time you update a LESS file, run `gulp` command from within the root folder to build the app's CSS file. Alternatively, use `gulp watch` to automatically build the CSS on-the-fly when one of the LESS files change.<br>

<h3>Communication between Content Script and Extension</h3>

Communication between Content Script and Extension can be seen in following Wiki Link

https://github.com/Backfeed/BF-Chrome-Extension/wiki/Message-Sending-Guide

<h3>Calling the Server API Remotely</h3>
See `extension/contentScript/app/contentServices/services.js` in the extension codebase (branch develop) for the list of endpoints.<br>
The environmentURL for the test server is https://stagingenviornment.elasticbeanstalk.com/<br>
You could search the codebase for method names (e.g. `ContributionDetail.getDetail``) to find out the expected data model of the request object.<br>
Most requests require data returned by https://stagingenviornment.elasticbeanstalk.com/api/me so make sure to call that before any subsequent calls.<br>
There are 2 _HTTP headers_ you need to add to all requests:

    1. `User-Agent`: the value is the string 'DEAP'
    2. `x-access-token`: the value should be the word `Bearer ` (with a whitespace after) immediately followed by the `satellizer_token` from the extension's localStorage.

![](http://backfeed.cc/wp-content/uploads/misc/where_to_find_satellizer_token.jpg)
You'll see it on a tab opened with domain *.slack.com while the extension in installed and you're logged in

<h3>On Demand Notifications</h3>
In cases where the Angular app wants to show notification alerts to the user, inject `PostMessageService` and run:

```
PostMessageService.showAlert('message to be displayed', type);
```

`type` can be one of: alert, success, error, warning, information, confirm.

Full documentation here: [http://ned.im/noty/](http://ned.im/noty/)
