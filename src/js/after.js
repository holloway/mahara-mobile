import StateStore,
       {maharaServer}   from './state.js';
import {LOGIN,
        STORAGE}        from './constants.js';

export function afterLoginGetProfile(){
  maharaServer.getSyncData(
    function winfn(syncData) {
      StateStore.dispatch(
        {
          type: STORAGE.SET_USER_SYNC_DATA,
          sync: syncData
        }
      );
    },
    function failfn(error) {
      console.log("Problem getting sync data.");
    }
  );
}


export function afterInputWwwroot(serverUrl){
  maharaServer.updateWwwroot(serverUrl, successCallback, errorCallback);

  function successCallback(response){
    StateStore.dispatch({
      type:       STORAGE.AUTODETECTED_SERVER,
      loginTypes: response.loginTypes
    });
  }

  function errorCallback(e){
    console.log("Problem...", e);
    // don't try again. might be network problems.
    // TODO: alert an error?
  }
}
