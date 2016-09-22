/*jshint esnext: true */
import httpLib                 from './http-lib.js';
import getLoginStatus          from './login-status.js';
import getUserProfile          from './get-user-profile.js';
import autoDetectServerCapabilities,
       {getWwwroot,
        parseUrl,
        updateWwwroot}                from './server-url.js';
import localLogin              from './local-login.js';
import logOut                  from './logout.js';
import uploadJournal           from './upload-journal.js';
import getSyncData             from './get-sync-data.js';
import uploadFile              from './upload-file.js';
import openSsoWindow           from './sso.js';

export default class MaharaServer {
  
  constructor(){
    this.loadState = this.loadState.bind(this);
    this.autoDetectServerCapabilities = autoDetectServerCapabilities.bind(this);
    this.usernamePasswordLogin = localLogin.bind(this);
    this.uploadJournal = uploadJournal.bind(this);
    this.uploadFile = uploadFile.bind(this);
    this.getLoginStatus = getLoginStatus.bind(this);
    this.getUserProfile = getUserProfile.bind(this);
    this.openSsoWindow = openSsoWindow.bind(this);
    this.getSyncData = getSyncData.bind(this);
    this.logOut = logOut.bind(this);
    this.getWwwroot = getWwwroot.bind(this);
    this.updateWwwroot = updateWwwroot.bind(this);

    this.getAccessToken = this.getAccessToken.bind(this);
    this.setAccessToken = this.setAccessToken.bind(this);
  }
  
  loadState(state){
    this.wwwroot = state.wwwroot;
    this.ssoUrl = state.ssoUrl;
    this.loginTypes = state.loginTypes;
    this.loginType = state.loginType;
    this.user = state.user;
    this.uploadToken = state.uploadToken;
    this.profile = state.profile;
    this.sync = state.sync;
    // console.log("ServerState was", state);
  }

  getAccessToken = () => this.accesstoken;

  setAccessToken = (token) => {
    this.accesstoken = token;
    return this.accesstoken;
  }
}
