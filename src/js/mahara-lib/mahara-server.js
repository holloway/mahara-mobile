/*jshint esnext: true */
import httpLib      from './http-lib.js';
import {LOGIN_TYPE} from './constants.js';

class MaharaServer {
  restore = (state) => {
    if(state.url){
      this.protocol = state.url.protocol;
      this.domain = state.url.domain;
    }
    this.loginType = state.loginType;
    this.token = state.token;
    this.user = state.user;
  }
  setUrl = (url, callback) => {
    var originalDomain = this.domain;
    this.domain = url.replace(/^.*?\:\/\//, '').replace(/\/.*?$/, ''); //remove any protocol and any path but leave any port numbers
    if(originalDomain !== undefined && originalDomain !== this.domain){
      this.autoDetectProtocolAndLoginMethod(callback);
    } else {
      console.log("No change in domain of mahara-server.js. Reusing existing settings");
      if(callback) callback();
    }
  }
  getServerUrl = () => {
    if(!this.protocol) return console.log("Error no protocol chosen yet. Run autoDetectProtocolAndLoginMethod(callback) first.");
    if(!this.domain) return console.log("Error no domain chosen yet. Run autoDetectProtocolAndLoginMethod(callback) first.");
    console.log(this);
    return this.protocol + "://" + this.domain;
  }
  loginPath = "/api/mobile/login.php"
  autoDetectProtocolAndLoginMethod = (callback) => {
    var that = this,
        protocols = {"https": undefined, "http": undefined},
        successFrom = function(protocol){
          return function(response){
            var loginUsername = "login_username", // a form field that we test for in the response
                tokenId = '"token"';
            if(response.target && response.target.response && (response.target.response.match(loginUsername) || response.target.response.match(tokenId))){
              protocols[protocol] = LOGIN_TYPE.USERNAME_PASSWORD; //TODO: scrape evidence of SSO-based login
            } else {
              protocols[protocol] = false;
            }
            next();
          }
        },
        failureFrom = function(protocol){
          return function(response){
            protocols[protocol] = false;
            next();
          }
        },
        next = function(){
          var allResponsesReceived = true;
          for(var protocol in protocols){
            if(protocols[protocol] === undefined) allResponsesReceived = false;
          }
          if(allResponsesReceived){
            if(protocols.http !== false && protocols.http !== undefined) {
              that.protocol = "http";
              that.loginType = protocols.http;
            }
            if(protocols.https !== false && protocols.https !== undefined) { // https is preferred
              that.protocol = "https";
              that.loginType = protocols.https;
            }
            if(callback) callback();
          }
        };

    this.protocol = undefined;
    for(var protocol in protocols){
      httpLib.get(protocol + "://" + this.domain + this.loginPath, undefined, successFrom(protocol), failureFrom(protocol));
    }
  }
  usernamePasswordLogin = (username, password, successCallback, errorCallback) => {
    var that = this;
    httpLib.post(this.getServerUrl() + this.loginPath, undefined, {
      login_username:username,
      login_password:password,
      submit:"Login",
      login_submitted: 1,
      sesskey: "",
      pieform_login: "",
    }, scrapeFromResponse(successCallback), errorCallback);

    function scrapeFromResponse(fn){
      return function(response){
        var responseData,
            login;

        if(!response.target || !response.target.response || !response.target.response.match('{"token":"') || !response.target.response.match("</script>")){
          console.log("Unable to scrape session from response so can't login (1). Response was", responseData);
          return errorCallback();
        }
        responseData = response.target.response,
        responseData = responseData.substr(responseData.indexOf("</script>") + "</script>".length);
        try {
          login = JSON.parse(responseData);
        } catch(e){
          console.log("Unable to scrape session from response so can't login (2). Response was", responseData);
          return errorCallback();
        }
        if(login.token) that.token = login.token;
        if(login.user)  that.user  = login.user;
        var args = Array.prototype.slice.call(arguments);
        args.unshift(login);
        fn.apply(this, args);
      }
    }
  }
}

const maharaServer = new MaharaServer();

export default maharaServer
