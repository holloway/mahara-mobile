/*jshint esnext: true */
import httpLib      from './http-lib.js';

export default function ifLoggedIn(successCallback, errorCallback){
  var protocolAndDomain = this.getServerProtocolAndDomain(),
      userHomePath = "/user/view.php",
      that = this;

  // TODO: Cache logged in status for a minute or something

  if(!protocolAndDomain) return errorCallback(undefined);

  function successFrom(successCallback, errorCallback){
    return function(response){
      var LOGGEDIN = [/\?logout/],
          isLoggedIn,
          results,
          settings;

      if(!response || !response.target || !response.target.response) return errorCallback({error:true, isLoggedIn:false, data:response});

      isLoggedIn = !!response.target.response.match(LOGGEDIN[0]);

      // begin ugly scraping code...
      if(response.target.response.replace(/<script[\s\S]*?\/script>/g, function(regexMatch){
        if(regexMatch.match(/config[\s]*?\=[\s]*?/)){
          regexMatch = regexMatch.replace(/<[^>]*?>/g, '')
                                 .replace(/^[\s\S]*?config[\s]*?\=[\s]*?/g, '')
                                 .replace(/('[^']+')/g, function(keyMatch){
                                    return '"' + keyMatch.substr(1, keyMatch.length - 2) + '"';
                                 })
                                 .replace(/\}[\s]*?;/g, '}')  // remove trailing ';'
                                 .replace(/'"/g, '""')
                                 .replace(/':/g, '":');

          try {
            settings = JSON.parse(regexMatch);
          } catch(e){
            console.log("Problem extracting metadata", regexMatch, e, settings);
          }
        }
      }));

      if(!settings) settings = {};

      results = response.target.response.match(/<title>.*?<\/title>/g);
      if(results && results.length){
        results = results[0].match(/\(.*?\)/g);
        if(results && results.length){
          settings.username = results[0].substr(1, results[0].length - 2);
        }
      }

      successCallback(settings);
    };
  }

  function failureFrom(errorCallback){
    return function(response){
      errorCallback({error:true, isLoggedIn:false, data:response});
    };
  }

  httpLib.get(protocolAndDomain + userHomePath, undefined, successFrom(successCallback, errorCallback), failureFrom(errorCallback));
}
