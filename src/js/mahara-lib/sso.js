/*jshint esnext: true */
import httpLib      from './http-lib.js';

export default function isSSOServerAvailable(availableCallback, notAvailableCallback){
  if(!this.ssoUrl) return notAvailableCall();

  var ssoTimer = setTimeout(notAvailableCallback, 10000);

  httpLib.get(this.ssoUrl, undefined, function(resp){
    if(ssoTimer) clearTimeout(ssoTimer);
    availableCallback();
  }, function(resp){
    if(ssoTimer) clearTimeout(ssoTimer);
    notAvailableCallback();
  });
}