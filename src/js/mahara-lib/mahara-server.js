/*jshint esnext: true */
import httpLib              from './http-lib.js';
import ifLoggedIn           from './is-logged-in.js';
import autoDetectServerUrl,
       {getServerProtocolAndDomain,
        parseUrl,
        setUrl}             from './server-url.js';
import localLogin           from './local-login.js';
import logOut               from './logout.js';
import setMobileUploadToken from './set-mobile-upload-token.js';
import uploadJournal        from './upload-journal.js';
import generateUploadToken  from './generate-upload-token.js';
import getSyncData          from './get-sync-data.js';

export default class MaharaServer {
  constructor(){
    this.autoDetectProtocolAndLoginMethod = autoDetectServerUrl.bind(this);
    this.getServerProtocolAndDomain = getServerProtocolAndDomain.bind(this);
    this.setMobileUploadToken = setMobileUploadToken.bind(this);
    this.generateUploadToken = generateUploadToken.bind(this);
    this.usernamePasswordLogin = localLogin.bind(this);
    this.uploadJournal = uploadJournal.bind(this);
    this.checkIfLoggedIn = ifLoggedIn.bind(this);
    this.getSyncData = getSyncData.bind(this);
    this.setUrl = setUrl.bind(this);
    this.logout = logOut.bind(this);
    this.loadState = this.loadState.bind(this);
  }
  loadState(state){
    this.protocol = state.protocol;
    this.domain = state.domain;
    this.ssoUrl = state.ssoUrl;
    this.loginTypes = state.loginTypes;
    this.user = state.user;
    this.uploadToken = state.uploadToken;
    console.log("loadState", this, state);
  }
}
