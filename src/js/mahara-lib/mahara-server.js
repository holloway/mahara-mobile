/*jshint esnext: true */
import httpLib                 from './http-lib.js';
import getLoginStatus          from './login-status.js';
import getUserProfile,
       {parseUserConfigFromHTML,
        getLocalLoginProfile,
        getSSOProfile}         from './get-user-profile.js';
import autoDetectProtocolAndLoginMethod,
       {getServerProtocolAndDomain,
        parseUrl,
        setUrl}                from './server-url.js';
import localLogin              from './local-login.js';
import logOut                  from './logout.js';
import setMobileUploadToken    from './set-mobile-upload-token.js';
import uploadJournal           from './upload-journal.js';
import generateUploadToken     from './generate-upload-token.js';
import getSyncData             from './get-sync-data.js';

export default class MaharaServer {
  constructor(){
    this.loadState = this.loadState.bind(this);
    this.autoDetectProtocolAndLoginMethod = autoDetectProtocolAndLoginMethod.bind(this);
    this.setUrl = setUrl.bind(this);
    this.getServerProtocolAndDomain = getServerProtocolAndDomain.bind(this);
    this.setMobileUploadToken = setMobileUploadToken.bind(this);
    this.generateUploadToken = generateUploadToken.bind(this);
    this.usernamePasswordLogin = localLogin.bind(this);
    this.uploadJournal = uploadJournal.bind(this);
    this.getLoginStatus = getLoginStatus.bind(this);
    this.getUserProfile = getUserProfile.bind(this);
    this.parseUserConfigFromHTML = parseUserConfigFromHTML.bind(this);
    this.getLocalLoginProfile = getLocalLoginProfile.bind(this);
    this.getSSOProfile = getSSOProfile.bind(this);
    this.getSyncData = getSyncData.bind(this);
    this.logOut = logOut.bind(this);
  }
  loadState(state){
    this.protocol = state.protocol;
    this.domain = state.domain;
    this.ssoUrl = state.ssoUrl;
    this.loginTypes = state.loginTypes;
    this.loginType = state.loginType;
    this.user = state.user;
    this.uploadToken = state.uploadToken;
    this.profile = state.profile;
    this.sync = state.sync;
    console.log("state was", state);
  }
}
