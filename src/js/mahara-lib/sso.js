import httpLib from './http-lib.js';
import StateStore,
       {maharaServer}      from '../state.js';
import {PAGE,
        LOGIN,
        PAGE_URL,
        STORAGE}           from '../constants.js';

const service = "maharamobile";
const component = "module/mobileapi";
const loginurl = "module/mobileapi/tokenform.php";

// HACK: Workaround to get rid of the Cordova inAppBrowser's override of window.open
// when we're in the browser. (Otherwise it tries to open SSO in a weird iframe with
// simulated device buttons around it, instead of in a popup.)
if (cordova.platformId === "browser") {
    window.open = cordova.require('cordova/modulemapper').getOriginalSymbol(window, 'window.open');
}

/**
 * Opens another webview in the app, with the SSO
 * login screen in it.
 * 
 * This function has no error callback. If the SSO process fails, the user
 * is expected to just close the popup window.
 */
export default function openSsoWindow(win) {
    var ssoUrl = this.getWwwroot() + loginurl
        + '?service=' + service
        + '&component=' + encodeURIComponent(component)
        + '&clientname=' + encodeURIComponent("Mahara Mobile") // TODO: lang string
        + '&clientenv=' + encodeURIComponent(device.platform + ', ' + device.manufacturer + ', ' + device.model)
        + '&clientguid=' + encodeURIComponent(device.uuid)
        + '#sso'
    ;

    var ssoWindowArgs = [
        ssoUrl,
        '_blank',
        'clearsessioncache=yes,clearcache=yes,location=yes,enableViewportScale=yes',
    ];
    var ssoWindow;
    var eventname;
    // HACK: Workaround for desktop browser
    if (cordova.platformId === "browser") {
        eventname = 'load';
        ssoWindow = window.open(...ssoWindowArgs);
        window.ssoWindow = ssoWindow;
    }
    else {
        eventname = 'loadstop';
        ssoWindow = cordova.InAppBrowser.open(...ssoWindowArgs);
    }
    var loopid = null;
    
    ssoWindow.addEventListener(
        eventname,
        // Run this every time the child window finishes loading a page.
        function(event) {

            // Poll the child window once per second until the window.maharatoken
            // variable is available.
            var loadedUrl;
            if (cordova.platformId === "browser") {
                // HACK: Workaround for desktop browser
                loadedUrl = ssoWindow.location.href;
            }
            else {
                if (typeof event.url === "string") {
                    loadedUrl = event.url;
                }
                else if (event.url && typeof event.url.href === "string") {
                    loadedUrl = event.url.href;
                }
                else {
                    console.log("Could not locate SSO window's URL in this event: ", event);
                    // TODO: error handling... maybe close the SSO window, and show an error message?
                    loadedUrl = "";
                }
            }

            if (loadedUrl.indexOf(ssoUrl) === 0) {
                if (loopid) {
                    clearInterval(loopid);
                }
                loopid = setInterval(
                    // Execute this script once per second
                    function() {
                        if (cordova.platformId === "browser") {
                            // HACK: workaround for desktop browser
                            if (ssoWindow.maharatoken) {
                                clearInterval(loopid);
                                ssoWindow.close();
                                win(ssoWindow.maharatoken);
                            }
                        }
                        else {
                            ssoWindow.executeScript(
                                // Child script should set window.maharatoken
                                {code: "window.maharatoken;"},
                                // Final expression of the executed code will be
                                // returned here, enclosed in an array for some
                                // reason. 
                                function(wstoken) {
                                    if (wstoken[0]) {
                                        clearInterval(loopid);
                                        ssoWindow.close();
                                        win(wstoken[0]);
                                    }
                                }
                            );
                        }
                    },
                    1000
                );
            }
        }
    );
}