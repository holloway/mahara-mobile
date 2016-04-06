/*jshint esnext: true */
import httpLib      from './http-lib.js';
import {LOGIN_TYPE} from './constants.js';

export default function autoDetectProtocolAndLoginMethod(successCallback, errorCallback, domain){
  var checkedProtocols = {"https": undefined, "http": undefined},
      logoutPath = "/?logout";

  for(var protocol in checkedProtocols){
    httpLib.get(protocol + "://" + domain + logoutPath, undefined, successFrom(protocol), failureFrom(protocol));
  }

  function successFrom(protocol){
     return function(response){
       var LOCALs = ["login_username", '"token"'], // scrape html for these fragments to indicate support for features. Not happy with this but necessary until we get API support (see README.md SERVER-TODO)
           SSOs   = ['>SSO<', 'saml'],
           ssoUrl,
           matches;

       if(!response || !response.target || !response.target.response){
         // nothing to scrape... presume at least a U/P login
         checkedProtocols[protocol] = [LOGIN_TYPE.LOCAL];
         console.log("Odd...nothing to scrape from " + domain, response.target.response);
         next();
         return;
       }

       if(response.target.response.match(LOCALs[0]) || response.target.response.match(LOCALs[1])){
         if(!checkedProtocols[protocol]) checkedProtocols[protocol] = [];
         checkedProtocols[protocol].push(LOGIN_TYPE.LOCAL);
       } else {
         checkedProtocols[protocol] = false;
       }

       if(response.target.response.match(SSOs[0]) || response.target.response.match(SSOs[1])){
         matches = response.target.response.match(/http[^'"]*?saml[^'"]+/gi);
         if(matches.length > 0){
           ssoUrl = matches[0].replace(/\\$/, ''); // because sometimes there's a trailing \
           while(ssoUrl.match(/^https?\:\\\//)){ // sometimes Url is JavaScript string escaped so a URL might start with "http:\/" so if it does then we need to decode it
             try {
               ssoUrl = JSON.parse("[\"" + ssoUrl + "\"]")[0];
             } catch(e){
               console.log("Problem decoding ssoUrl. ssoUrl=", ssoUrl, e);
             }
           }
           if(!checkedProtocols[protocol]) checkedProtocols[protocol] = [];
           checkedProtocols[protocol].push(LOGIN_TYPE.SINGLE_SIGN_ON);
           checkedProtocols[protocol].ssoUrl = ssoUrl;
         }
       }
       next();
     };
  }

  function failureFrom(protocol){
    return function(response){
      checkedProtocols[protocol] = false;
      next();
    };
  }

  function next(){
    var allResponsesReceived = true,
        response = {};
    for(var protocol in checkedProtocols){
      if(checkedProtocols[protocol] === undefined) allResponsesReceived = false;
    }
    if(allResponsesReceived){
      if(checkedProtocols.http !== false && checkedProtocols.http !== undefined) {
        response.protocol = "http";
        response.loginTypes = checkedProtocols.http;
        // Note that checkedProtocols.http.ssoUrl might be set;
      }
      if(checkedProtocols.https !== false && checkedProtocols.https !== undefined) { // https is preferred
        response.protocol = "https";
        response.loginTypes = checkedProtocols.https;
        // Note that checkedProtocols.https.ssoUrl might be set;
      }
      successCallback(response);
    }
  }


}

export function getServerProtocolAndDomain(){
  if(!this.protocol) return console.log("Error no protocol chosen yet. Run autoDetectProtocolAndLoginMethod(callback) first.");
  if(!this.domain)   return console.log("Error no domain chosen yet. Run autoDetectProtocolAndLoginMethod(callback) first.");
  return this.protocol + "://" + this.domain;
}

export function setUrl(url, successCallback, errorCallback){
  var domain = url.replace(/^.*?\:\/\//, '').replace(/\/.*?$/, ''); //remove any protocol and any path but leave any port numbers
  this.autoDetectProtocolAndLoginMethod(successCallback, errorCallback, domain);
  return domain;
}

