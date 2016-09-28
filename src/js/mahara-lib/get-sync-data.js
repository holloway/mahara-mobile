import httpLib from './http-lib.js';
import StateStore from '../state.js';
import {STORAGE} from '../constants.js';
import fsLib from './files-lib.js';

function refreshUserProfile() {
    this.getSyncData(
        function winfn(syncData) {
            StateStore.dispatch(
                {
                    type: STORAGE.SET_USER_SYNC_DATA,
                    sync: syncData
                }
            );
        },
        function failfn(error) {
            console.log("Problem getting sync data.");
        }
    );
}

export {refreshUserProfile};

/**
 * A function to sync data from the user's account
 */
export default function getSyncData(winfn, failfn) {
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
            userprofile: {},
            userprofileicon: {},
        },
        function (syncData) {
            fetchUserIcon(syncData, maharaServer);
            winfn(syncData);
        },
        failfn
    );
}

function fetchUserIcon(syncData, maharaServer) {
    if (
        typeof syncData.userprofileicon === undefined
        || syncData.userprofileicon === null
    ) {
        console.log("User is on default usericon");
        return clearUserIcon();
    }

    var state = StateStore.getState();
    var newicon = syncData.userprofileicon;
    if (state.profile !== undefined && state.profile.icon !== undefined) {
        var oldicon = state.profile.icon;
        if (newicon.bytes === oldicon.bytes && newicon.name === oldicon.name && newicon.mimetype === oldicon.mimetype) {
            console.log('Icon unchanged from current version.');
            return;
        }
    }

    var filename = 'userprofileicon';
    switch (newicon.mimetype) {
        case 'image/jpeg':
            filename = filename + '.jpg';
            break;
        case 'image/gif':
            filename = filename + '.png';
            break;
        case 'image/png':
            filename = filename + '.png';
            break;
        default:
            console.log("Unsupported mimetype for profileicon: " + newicon.mimetype);
            return clearUserIcon();
    }

    var url = maharaServer.getWwwroot()
        + "module/mobileapi/download.php?wsfunction=module_mobileapi_get_user_profileicon&wstoken="
        + maharaServer.getAccessToken();

    fsLib.createFile(
        filename,
        function win(fileEntry) {
            console.log('Opened local file ' + filename);
            new FileTransfer().download(
                encodeURI(url),
                fileEntry.toURL(),
                function gotDownload(fileEntry) {
                    StateStore.dispatch(
                        {
                            type: STORAGE.SET_USER_PROFILE_ICON,
                            icon: fileEntry.toURL()
                        }
                    );
                    return fileEntry;
                },
                function failedDownload(error) {
                    console.log("Failed downloading " + url);
                    console.log(JSON.stringify(error, null, 4));
                    return clearUserIcon();
                }
            )
        },
        function fail(e) {
            console.log('Failed getting FileEntry to save user icon in. Details follow.');
            console.log(e);
        }
    );
}

function clearUserIcon() {
    StateStore.dispatch(
        {
            'type': STORAGE.SET_USER_PROFILE_ICON,
            'icon': null,
        }
    );
    return null;
}