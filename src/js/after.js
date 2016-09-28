import StateStore,
{maharaServer}   from './state.js';
import {LOGIN,
    STORAGE}        from './constants.js';

export function afterLoginGetProfile() {
    maharaServer.refreshUserProfile();
}


export function afterInputWwwroot(serverUrl) {
    maharaServer.autoDetectServerCapabilities(
        serverUrl,
        function successCallback(serverData) {
           StateStore.dispatch({
                type: STORAGE.AUTODETECTED_SERVER,
                server: serverData
            });
        },
        function errorCallback(e) {
            console.log("Problem...", e);
            alertify.alert("That Mahara server doesn't have webservice set up.");
        }
    );
}
