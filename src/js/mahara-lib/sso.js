import httpLib from './http-lib.js';
import StateStore,
       {maharaServer}      from '../state.js';
//import Router              from '../router.js';
import {PAGE,
        LOGIN,
        PAGE_URL,
        STORAGE}           from '../constants.js';

const service = "maharamobile";
const component = "module/mobileapi/webservice";
const loginurl = "module/mobileapi/tokenform.php";

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
        + '&component=' + encodeURIComponent(component);
    var ssoWindow = cordova.InAppBrowser.open(
        ssoUrl,
        '_blank',
        'clearsessioncache=yes,clearcache=yes,location=yes,enableViewportScale=yes',
    );
    var loopid = null;
    
    ssoWindow.addEventListener(
        "loadstop",
        // Run this every time the child window finishes loading a page.
        function(event) {

            // Poll the child window once per second until the window.maharatoken
            // variable is available.
            var loadedUrl;
            if (typeof event.url === "string") {
                loadedUrl = event.url;
            }
            else if (typeof event.url.href === "string") {
                loadedUrl = event.url.href;
            }
            else {
                // Huh.
                console.log("Can't find URL string.");
                loadedUrl = '';
            }
            if (loadedUrl.indexOf(ssoUrl) === 0) {
                if (loopid) {
                    clearInterval(loopid);
                }
                loopid = setInterval(
                    // Execute this script once per second
                    function() {
                        ssoWindow.executeScript(
                            // Child script should set window.maharatoken
                            {code: "window.maharatoken;"},
                            // Final expression of the executed code will be
                            // returned here, enclosed in an array for some
                            // reason. 
                            function(token) {
                                if (token[0]) {
                                    clearInterval(loopid);
                                    this.setAccessToken(token[0]);
                                    ssoWindow.close();
                                    win(token[0]);
                                }
                            }
                        );
                    },
                    1000
                );
            }
        }
    );
};