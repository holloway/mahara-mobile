/*jshint esnext: true */
import httpLib      from './http-lib.js';

export default function ifLoggedIn(callback){
  var protocolAndDomain = this.getServerProtocolAndDomain(),
      that = this;

  // TODO: Cache logged in status for a minute or something

  if(!protocolAndDomain){
    callback(undefined);
    return;
  }

  var successFrom = function(callback){
    return function(response){
      var LOGGEDIN = [/\?logout/],
          isLoggedIn,
          results,
          settings;

      if(!response || !response.target || !response.target.response){
        callback(undefined);
        return;
      }

      isLoggedIn = !!response.target.response.match(LOGGEDIN[0]);

      if(response.target.response.replace(/<script[\s\S]*?\/script>/g, function(regexMatch){
        if(regexMatch.match(/config[\s]*?\=[\s]*?/)){
          //console.log("regexMatch1", regexMatch);
          regexMatch = regexMatch.replace(/<[^>]*?>/g, '');
          //console.log("regexMatch2", regexMatch);
          regexMatch = regexMatch.replace(/^[\s\S]*?config[\s]*?\=[\s]*?/g, '');
          //console.log("regexMatch3", regexMatch);
          regexMatch = regexMatch.replace(/('[^']+')/g, function(keyMatch){
            return '"' + keyMatch.substr(1, keyMatch.length - 2) + '"';
          });
          //console.log("regexMatch4", regexMatch);
          regexMatch = regexMatch.replace(/\}[\s]*?;/g, '}'); // remove trailing ';'
          //console.log("regexMatch5", regexMatch);
          try {
            settings = JSON.parse(regexMatch);
          } catch(e){
            console.log("Problem extracting metadata", e, settings);
          }
        }
      }));

      results = response.target.response.match(/<title>.*?<\/title>/g);
      if(results && results.length){
        results = results[0].match(/\(.*?\)/g);
        if(results && results.length){
          if(!settings) settings = {};
          settings.username = results[0].substr(1, results[0].length - 2);
        }
        console.log("settings", settings);
      }
      callback(isLoggedIn, settings);
    };
  };

  var failureFrom = function(callback){
    return function(response){
      callback(undefined);
    };
  };

  httpLib.get(protocolAndDomain + "/user/view.php", undefined, successFrom(callback), failureFrom(callback));
}
