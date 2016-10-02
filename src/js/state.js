/*jshint esnext: true */
import {createStore }  from 'redux';
import {Provider}      from 'react-redux';
import MaharaServer    from './mahara-lib/mahara-server.js';
import Storage         from './storage.js';
import {arrayRemoveIf} from './util.js';
import {PAGE,
    LOGIN,
    LOGIN_TYPE,
    STORAGE,
    JOURNAL,
    FILE_ENTRY,
    PENDING}       from './constants.js';

/**
 * Bump this version number if we need to make a change to the state structure.
 * This will let us detect a change in state structure when the app is launched,
 * and upgrade from the old structure to the new structure if necessary.
 */
const stateVersion = 2;

const defaultState = {
    stateVersion: stateVersion,
    lang: ['en'],
    page: PAGE.SERVER,
    server: {
        wwwroot: null,
        wstoken: null,
        targetblogid: null,
        targetfoldername: null,
        loginTypes: [LOGIN_TYPE.LOCAL],
        siteName: null,
        maharaVersion: null,
        profile: {
            id: null, // User's Mahara ID number
            myname: null, // User's Display name
            username: null, // User's username
            quota: null, // User's storage quota on the server (in bytes)
            quotaused: null, // Quota used on server
        },
        icondata: { // Metadata about the icon.
            bytes: null,
            name: null,
            mimetype: null,
        },
        iconurl: null, // FileEntry.toURL() of image to display
        sync: {
            blogs: [], // list of blogs {id, title, description}
            folders: [], // list of folders {id, title}
            notifications: [], // list of notifications  {id, subject, message}
            tags: [] // list of tags {tag, usage}
        }
    },
    pendingUploads: []
};

function MaharaState(state, action) {
    if (state === undefined) { //Initial state upon page load
        state = Storage.state.get();
        if (!state) { // if there was no saved state
            state = { lang: ['en'] };
            action.type = PAGE.SERVER;
        }
        else if (stateVersion !== state.stateVersion) {
            // No upgrade script during development. Just wipe the stored data.
            state = defaultState;
        }
    }

    state = JSON.parse(JSON.stringify(state)); // clone so that we don't accidentally overwrite existing object

    switch (action.type) {
        case PAGE.SERVER:
        case PAGE.LOGIN_TYPE:
        case PAGE.LOGIN:
        case PAGE.SSO:
        case PAGE.USER:
        case PAGE.ADD:
        case PAGE.ADD_JOURNAL_ENTRY:
        case PAGE.PENDING:
        case PAGE.SYNC:
            //case PAGE.EDIT_JOURNAL_ENTRY:
            state.page = action.type;
            break;
        case STORAGE.SET_SERVER_URL:
            // state.server = state.server || {};
            state.server.wwwroot = action.serverUrl;
            state.startAutoDetectingProtocolAndLoginMethod = true;
            break;
        case STORAGE.STOP_AUTODETECTING:
            state.startAutoDetectingProtocolAndLoginMethod = undefined;
            break;
        case STORAGE.AUTODETECTED_SERVER:
            // state.server = state.server || {};
            state.server.loginTypes = action.server.loginTypes;
            state.server.siteName = action.server.siteName;
            state.server.maharaVersion = action.server.maharaVersion;
            break;
        case STORAGE.SET_USER_PROFILE_ICON:
            // state.server = state.server || {};
            // state.server.profile = state.server.profile || {};
            state.server.profile.iconurl = action.icon;
            break;
        case STORAGE.SET_USER_SYNC_DATA:
            // state.server = state.server || {};
            state.server.sync.blogs = action.sync.blogs;
            state.server.sync.folders = state.folders;
            state.server.sync.notifications = action.sync.notifications;
            state.server.sync.tags = action.sync.tags;
            state.server.profile = action.sync.userprofile;

            // Check to see whether the user's icon has changed, requiring
            // us to download the new one.
            {
                let newicon = action.sync.userprofileicon;
                let oldicon = state.server.icondata;
                if (
                        !newicon
                        || oldicon.bytes !== newicon.bytes
                        || oldicon.name !== newicon.name
                        || oldicon.mimetype !== newicon.mimetype
                ) {
                    state.needToRefreshIcon = true;
                }
            }
            state.server.icondata = action.sync.userprofileicon;
            if (!state.server.icondata) {
                state.server.icondata = defaultState.server.icondata;
            }

            // TODO: Let the user select the blog, instead of just using
            // the first one
            if (action.sync.blogs.length) {
                state.server.targetblogid = action.sync.blogs[0].id;
            }

            // TODO: Let the user select the folder, instead of just using one.
            state.server.targetfoldername = "Mahara Mobile Uploads";
            // if (action.sync.folders.length) {
            //     state.server.targetfoldername = action.sync.folders[0].title;
            // }
            break;
            
        case LOGIN.STOP_GET_USER_ICON:
            state.needToRefreshIcon = undefined;
            break;

        case JOURNAL.ADD_ENTRY:
            // state.pendingUploads = state.pendingUploads || [];
            state.pendingUploads.push(action.journalEntry);
            break;
        case FILE_ENTRY.ADD_ENTRY:
            // state.pendingUploads = state.pendingUploads || [];
            // Don't need to do this because I'm using local temp files instead
            // if (window.localStorage && action.fileEntry.dataURL) {
            //     // we store it seperately because it's a lot of data (often megabytes
            //     // of text), and every subsequent change to the MaharaState is
            //     // serialized to localStorage, so even a page change would mean
            //     // serializing this data yet again. This can cause 100ms+ stalls.
            //     // This means we only serialize it once, and read it once, and then
            //     // delete it.
            //     window.localStorage.setItem(action.fileEntry.guid, action.fileEntry.dataURL);
            //     action.fileEntry.dataURL = true;
            // }
            state.pendingUploads.push(action.fileEntry);
            break;
        case PENDING.STARTED_UPLOAD_AT:
            // state.pendingUploads = state.pendingUploads || [];
            var foundItem = false;
            state.pendingUploads.map(function (item, index) {
                if (item.guid && item.guid === action.guid) {
                    foundItem = true;
                    item.startedUploadAt = action.startedUploadAt;
                }
            });
            if (!foundItem) {
                var msg = "Fatal problem finding guid=" + action.guid;
                alert(msg);
                throw msg;
            }
            break;
        case PENDING.UPLOAD_NEXT:
            if (state.pendingUploads && state.pendingUploads.length) {
                state.uploadGuid = state.pendingUploads[0].guid;
            } else { // else there's nothing to process
                state.uploadGuid = undefined;
            }
            break;
        case PENDING.STOP_UPLOADS:
            state.uploadGuid = undefined;
            if (state.pendingUploads && state.pendingUploads.length) {
                for (var i = 0; i < state.pendingUploads.length; i++) {
                    state.startedUploadAt = undefined;
                }
            }
            break;
        case PENDING.DELETE_ALL:
            state.pendingUploads = [];
            break;
        case PENDING.DELETE:
            // state.pendingUploads = state.pendingUploads || [];
            var pendingUploadsBefore = state.pendingUploads.length;
            arrayRemoveIf.bind(state.pendingUploads)(function (item, index) {
                if (item.guid && item.guid === action.guid) {
                    if (window.localStorage && item.dataURL === true) {
                        window.localStorage.removeItem(action.guid);
                    }
                    return true;
                }
                return false;
            });
            if (pendingUploadsBefore === state.pendingUploads.length) {
                console.log("Warning not able to remove item ", action.guid, state.pendingUploads);
            }
            break;
        case LOGIN.AFTER_LOGIN_GET_PROFILE:
            state.getProfile = true;
            state.server.wstoken = action.wstoken;
            break;
        case LOGIN.STOP_GETTING_PROFILE:
            state.getProfile = undefined;
            break;
    }

    Storage.state.set(state);

    return state;
}

const StateStore = createStore(MaharaState);

export default StateStore;

// TODO: This doesn't really make sense exported from this module...
export const maharaServer = new MaharaServer();
