/*jshint esnext: true */
import httpLib      from './http-lib.js';

export default function localLogin(username, password, successCallback, errorCallback){
  var protocolAndDomain = this.getServerProtocolAndDomain(),
      loginPath = "/",
      that = this;

  if(!protocolAndDomain) return errorCallback();

  httpLib.post(protocolAndDomain + this.loginPath, undefined, {
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
      responseData = response.target.response;
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
    };
  }
}