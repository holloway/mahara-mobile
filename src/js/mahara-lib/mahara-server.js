/*jshint esnext: true */
import httpLib                 from './http-lib.js';
import getUserProfile          from './get-user-profile.js';
import autoDetectServerCapabilities from './server-url.js';
import localLogin              from './local-login.js';
import verifyManualToken       from './manual-token.js';
import logOut                  from './logout.js';
import uploadJournal           from './upload-journal.js';
import getSyncData,
    {refreshUserProfile,
    refreshUserIcon}             from './get-sync-data.js';
import uploadFile              from './upload-file.js';
import openSsoWindow           from './sso.js';

export default class MaharaServer {

    constructor() {
        this.loadState = this.loadState.bind(this);
        this.autoDetectServerCapabilities = autoDetectServerCapabilities.bind(this);
        this.usernamePasswordLogin = localLogin.bind(this);
        this.verifyManualToken = verifyManualToken.bind(this);
        this.uploadJournal = uploadJournal.bind(this);
        this.uploadFile = uploadFile.bind(this);
        this.getUserProfile = getUserProfile.bind(this);
        this.openSsoWindow = openSsoWindow.bind(this);
        this.getSyncData = getSyncData.bind(this);
        this.refreshUserProfile = refreshUserProfile.bind(this);
        this.refreshUserIcon = refreshUserIcon.bind(this);
        this.logOut = logOut.bind(this);
    }

    loadState(server) {
        this.wstoken = server.wstoken;
        this.wwwroot = server.wwwroot;
        this.defaultBlogId = server.defaultBlogId;
        this.defaultFolderName = server.defaultFolderName;
    }

    getWSToken = () => this.wstoken;
    getWwwroot = () => this.wwwroot;
    getDefaultBlogId = () => this.defaultBlogId;
    getDefaultFolderName = () => this.defaultFolderName;
}
