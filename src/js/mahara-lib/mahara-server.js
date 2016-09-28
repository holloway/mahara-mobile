/*jshint esnext: true */
import httpLib                 from './http-lib.js';
import getUserProfile          from './get-user-profile.js';
import autoDetectServerCapabilities,
       {getWwwroot,
        parseUrl}                from './server-url.js';
import localLogin              from './local-login.js';
import logOut                  from './logout.js';
import uploadJournal           from './upload-journal.js';
import getSyncData, {refreshUserProfile} from './get-sync-data.js';
import uploadFile              from './upload-file.js';
import openSsoWindow           from './sso.js';

export default class MaharaServer {
  
  constructor(){
    this.loadState = this.loadState.bind(this);
    this.autoDetectServerCapabilities = autoDetectServerCapabilities.bind(this);
    this.usernamePasswordLogin = localLogin.bind(this);
    this.uploadJournal = uploadJournal.bind(this);
    this.uploadFile = uploadFile.bind(this);
    this.getUserProfile = getUserProfile.bind(this);
    this.openSsoWindow = openSsoWindow.bind(this);
    this.getSyncData = getSyncData.bind(this);
    this.refreshUserProfile = refreshUserProfile.bind(this);
    this.logOut = logOut.bind(this);
    this.getWwwroot = getWwwroot.bind(this);

    this.getAccessToken = this.getAccessToken.bind(this);
  }
  
  loadState(state){
    this.wwwroot = state.server.wwwroot;
    this.loginTypes = state.server.loginTypes;
    this.siteName = state.server.siteName;
    this.maharaVersion = state.server.maharaVersion;
    this.profile = state.server.profile;
    this.sync = state.server.sync;
    this.accesstoken = state.server.accesstoken;
    // console.log("ServerState was", state);
  }

  getAccessToken = () => this.accesstoken;
}
