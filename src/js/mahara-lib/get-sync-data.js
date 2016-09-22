import httpLib from './http-lib.js';

/**
 * A function to sync data from the user's account
 */
export default function getSyncData(winfn, failfn){
  var wsfunction = "module_mobileapi_sync";
  var wscomponent = "module/mobileapi/webservice";
  var maharaServer = this;

  // Can't sync if the user hasn't authenticated yet.
  if (!this.getWwwroot() || !this.getAccessToken()) {
    return failfn(
      {
        error: true,
        isLoggedin: false
      }
    );
  }

  httpLib.callWebservice(
    wsfunction,
    {
      blogs: {},
      folders: {},
      notifications: {
        lastsync: 0 // TODO: Store lastsync
      },
      tags: {},
      userprofile: {}
    },
    function(syncData) {
      // TODO: Download profile icon and save it locally instead
      // of just loading it by URL.
      syncData.userprofile.iconurl = maharaServer.getWwwroot()
       + "module/mobileapi/download.php?wsfunction=module_mobileapi_get_user_profileicon&wstoken="
       + maharaServer.getAccessToken();
      winfn(syncData);
    },
    failfn
  );
}