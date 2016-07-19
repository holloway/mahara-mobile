/*jshint esnext: true */

import StateStore,
       {maharaServer}   from './state.js';
import {LOGIN,
        STORAGE}        from './constants.js';

export function afterLoginGetProfile(){
  maharaServer.getUserProfile(profileSuccessCallback, errorCallback);

  function profileSuccessCallback(profile){
    //console.log("pr", profile);
    StateStore.dispatch({type:STORAGE.SET_USER_PROFILE, profile:profile});
    maharaServer.getSyncData(syncDataSuccessCallback, errorCallback);
  }

  function syncDataSuccessCallback(response){
    //console.log("sc", response);
    if(response.success){
      StateStore.dispatch({type:STORAGE.SET_USER_SYNC_DATA, sync:response.sync});
    } else {
      errorCallback(response);
    }
  }

  function errorCallback(e){
    console.log("Problem...", e);
    // don't try again. might be network problems.
    // TODO: alert an error?
  }
}


export function afterUpdateProtocolAndLoginMethods(serverUrl){
  maharaServer.setUrl(serverUrl, successCallback, errorCallback);

  function successCallback(response){
    StateStore.dispatch({
      type:       STORAGE.AUTODETECTED_SERVER,
      protocol:   response.protocol,
      loginTypes: response.loginTypes,
      ssoUrl:     response.loginTypes.ssoUrl
    });
  }

  function errorCallback(e){
    console.log("Problem...", e);
    // don't try again. might be network problems.
    // TODO: alert an error?
  }
}
