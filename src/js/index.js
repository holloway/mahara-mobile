import React                from 'react';
import ReactDOM             from 'react-dom';
import "babel-polyfill";
import $                    from 'jquery';
import StateStore,
       {maharaServer}       from './state.js';
import Storage              from './storage.js';
import Router               from './router.js';
import fsLib                from './mahara-lib/files-lib.js';
import {getLangString}      from './i18n.js';
import NavBar               from './components/navbar/navbar.js';
import LogoBar              from './components/logobar/logobar.js';
import ServerPage           from './components/server/server.js';
import LoginTypePage        from './components/login-type/login-type.js';
import LoginPage            from './components/login/login.js';
import TokenPage            from './components/token/token.js';
import UserPage             from './components/user/user.js';
import PendingPage          from './components/pending/pending.js';
import AddPage              from './components/add/add.js';
import AddImage             from './components/add-image/add-image.js';
import AddJournalEntryPage  from './components/add-journal-entry/add-journal-entry.js';
import EditJournalEntryPage from './components/add-journal-entry/edit-journal-entry.js';
import uploadNextItem       from './upload.js';
import {afterLoginGetProfile,
    afterInputWwwroot}    from './after.js';
import {PAGE,
    LOGIN,
    STORAGE,
    PENDING,
    JOURNAL}     from './constants.js';

var container = document.getElementById('container');
var previousPage = 'NONE';

/**
 * This function subscribes to StateStore(). It's called every time
 * the app's state changes. It looks at the stored state object, decides
 * which page should be displayed, and tells React to render that page.
 */
const render = () => {
    var state = StateStore.getState();
    var page;
    var bar;
    var i;

    // Update the maharaServer class's knowledge of the state
    // (In a Redux-perfect world, this data would probably flow down through
    // the React component and be injected into the API libs as needed)
    maharaServer.loadState(state.server);

    // Set the overall CSS class for the new page
    if (state.page !== previousPage) {
        $('html').removeClass().addClass('PAGE_' + state.page);
    }

    // Decide which page to display
    switch (state.page) {
        case PAGE.SERVER:
            page = <ServerPage {...state}/>;
            break;
        case PAGE.LOGIN_TYPE:
            page = <LoginTypePage {...state}/>;
            break;
        case PAGE.LOGIN:
            page = <LoginPage {...state}/>;
            break;
        case PAGE.TOKEN_ENTRY:
            page = <TokenPage {...state}/>;
            break;
        case PAGE.USER:
            page = <UserPage {...state}/>;
            break;
        case PAGE.ADD:
            page = <AddPage {...state}/>;
            break;
        case PAGE.ADD_JOURNAL_ENTRY:
            page = <AddJournalEntryPage {...state}/>;
            break;
        case PAGE.ADD_IMAGE:
            page = <AddImage {...state} />;
            break;
        case PAGE.PENDING:
            page = <PendingPage {...state}/>;
            break;
    }

    // Set up navigation elements
    switch (state.page) {
        case PAGE.USER:
        case PAGE.ADD:
        case PAGE.ADD_JOURNAL_ENTRY:
        case PAGE.ADD_IMAGE:
        case PAGE.PENDING:
            bar = <NavBar {...state}/>;
            break;
        case PAGE.SERVER:
        case PAGE.LOGIN_TYPE:
        case PAGE.LOGIN:
        case PAGE.TOKEN_ENTRY:
            bar = <LogoBar {...state}/>;
            break;
    }

    if (!bar || !page) {
        console.log("Unknown page state of " + state.page, bar, page);
    }

    // Render the page.
    ReactDOM.render(
        <div>
            {bar}
            {page}
        </div>,
        container
    );

    // Take additional actions, based on the state change.
    // These are here, rather than in the main StateStore
    // method, because the main StateStore method is only
    // supposed to update the state, and not do anything
    // else.
    //
    // It would probably be more architecturally sound if
    // these were in a different function, also subscribed
    // to the statestore.
    if (state.uploadGuid) {
        StateStore.dispatch({ type: PENDING.STOP_UPLOADS });
        uploadNextItem(state);
    }
    if (state.getProfile) {
        StateStore.dispatch({ type: LOGIN.STOP_GETTING_PROFILE });
        afterLoginGetProfile();
    }
    if (state.startAutoDetectingProtocolAndLoginMethod) {
        StateStore.dispatch({ type: STORAGE.STOP_AUTODETECTING });
        afterInputWwwroot(state.server.wwwroot);
    }
    if (state.needToRefreshIcon) {
        StateStore.dispatch({type: LOGIN.STOP_GET_USER_ICON});
        maharaServer.refreshUserIcon(state.server.icondata);
    }
    if (state.startEditingJournal) {
        Router.navigate(PAGE.ADD_JOURNAL_ENTRY);
    }
    if (state.startEditingImage) {
        Router.navigate(PAGE.ADD_IMAGE);
    }
    if (state.startVerifyingManualToken) {
        let lang = state.lang;
        StateStore.dispatch({type: STORAGE.STOP_VERIFYING_MANUAL_TOKEN});
        maharaServer.verifyManualToken(
            function winFn() {
                Router.navigate(PAGE.USER);
            },
            function failFn() {
                StateStore.dispatch({type: STORAGE.CLEAR_MANUAL_TOKEN});
                alertify
                    .okBtn(getLangString(lang, "alert_ok_button"))
                    .alert(getLangString(lang, "server_login_error"));
            }
        );
    }
};

setTimeout(function () {
    document.documentElement.classList.add("ready");
    setTimeout(function () {
        document.documentElement.classList.remove("ready");
        document.documentElement.classList.remove("loading");
    }, 1000);
}, 1000);

// Load filesystem
fsLib.init();

// Set up render function, to refresh the page in response to changes
StateStore.subscribe(render);
StateStore.dispatch({type: 'launch'});



if (!StateStore.getState().lang) {
  // Set user language
  navigator.globalization.getPreferredLanguage(
    function(locale) {
      StateStore.dispatch({type: 'SET_USER_LANGUAGE', language: locale.value});
    },
    function() {
      StateStore.dispatch({type: 'SET_USER_LANGUAGE', language: STORAGE.DEFAULT_LANGUAGE});
    });
}
