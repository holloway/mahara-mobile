/*jshint esnext: true */
import httpLib              from './http-lib.js';
import ifLoggedIn           from './is-logged-in.js';
import autoDetectServerUrl,
       {getServerProtocolAndDomain,
        setUrl}             from './server-url.js';
import localLogin           from './local-login.js';
import logOut               from './logout.js';
import setMobileUploadToken from './set-mobile-upload-token.js';
import uploadJournal        from './upload-journal.js';
import generateUploadToken  from './generate-upload-token.js';
import getSyncData          from './get-sync-data.js';
// /api/mobile/sync.php?token=f9637a657736d08cbc317d0267ac9078&username=matth

class MaharaServer {
  restore = (state) => {
    if(state.url){
      this.protocol = state.url.protocol;
      this.domain = state.url.domain;
    }
    this.ssoUrl = state.ssoUrl;
    this.loginTypes = state.loginTypes;
    this.user = state.user;
    this.uploadToken = state.uploadToken;
  }
  autoDetectProtocolAndLoginMethod = autoDetectServerUrl;
  getServerProtocolAndDomain = getServerProtocolAndDomain;
  setMobileUploadToken = setMobileUploadToken;
  generateUploadToken = generateUploadToken;
  usernamePasswordLogin = localLogin;
  uploadJournal = uploadJournal;
  checkIfLoggedIn = ifLoggedIn;
  getSyncData = getSyncData;
  setUrl = setUrl;
  logout = logOut;
}

const maharaServer = new MaharaServer();

export default maharaServer
