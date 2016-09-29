/*jshint esnext: true */
import httpLib                 from './http-lib.js';
import getUserProfile          from './get-user-profile.js';
import autoDetectServerCapabilities,
       {getWwwroot}                from './server-url.js';
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

    this.getWSToken = this.getWSToken.bind(this);
  }
  
  loadState(server){
    this.wwwroot = server.wwwroot;
    this.loginTypes = server.loginTypes;
    this.siteName = server.siteName;
    this.maharaVersion = server.maharaVersion;
    this.profile = server.profile;
    this.sync = server.sync;
    this.wstoken = server.wstoken;
  }

  getWSToken = () => this.wstoken;
}
