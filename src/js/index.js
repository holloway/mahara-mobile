/*jshint esnext: true */
import React                from 'react';
import ReactDOM             from 'react-dom';
import $                    from 'jquery';
import MaharaState          from './state.js';
import StateStore           from './state.js';
import Storage              from './storage.js';
import Router               from './router.js';
import NavBar               from './components/navbar/navbar.js';
import LogoBar              from './components/logobar/logobar.js';
import ServerPage           from './components/server/server.js';
import LoginPage            from './components/login/login.js';
import UserPage             from './components/user/user.js';
import PendingPage          from './components/pending/pending.js';
import SyncPage             from './components/sync/sync.js';
import AddPage              from './components/add/add.js';
import AddLibraryPage       from './components/add-library/add-library.js';
import AddJournalEntryPage  from './components/add-journal-entry/add-journal-entry.js';
import EditLibraryPage      from './components/add-library/edit-library.js';
import EditJournalEntryPage from './components/add-journal-entry/edit-journal-entry.js';

import {PAGE, STORAGE, PAGE_CLASSNAME} from './constants.js';

var container = document.getElementById('container');

const render = () => {
  var state = StateStore.getState(),
      page,
      bar,
      i;

  document.documentElement.className = (document.documentElement.className.replace(/\w+/g, function(match){
    if(match.match(/^PAGE_/)) return "";
    return match;
  }) + " " + PAGE_CLASSNAME[state.page]).trim();

  //console.log(document.documentElement.classList);
  //document.documentElement.classList = ;

  switch(state.page){
    case PAGE.SERVER:
      page = <ServerPage {...state}/>;
      break;
    case PAGE.LOGIN:
      page = <LoginPage {...state}/>;
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
    case PAGE.ADD_LIBRARY:
      page = <AddLibraryPage {...state}/>;
      break;
    case PAGE.PENDING:
      page = <PendingPage {...state}/>;
      break;
    case PAGE.SYNC:
      page = <SyncPage {...state}/>;
      break;
    case PAGE.EDIT_LIBRARY:
      page = <EditLibraryPage {...state}/>;
      break;
    case PAGE.EDIT_JOURNAL_ENTRY:
      page = <EditJournalEntryPage {...state}/>;
      break;
  }

  switch(state.page){
    case PAGE.USER:
    case PAGE.ADD:
    case PAGE.ADD_JOURNAL_ENTRY:
    case PAGE.ADD_LIBRARY:
    case PAGE.EDIT_JOURNAL_ENTRY:
    case PAGE.EDIT_LIBRARY:
    case PAGE.PENDING:
    case PAGE.SYNC:
      bar = <NavBar {...state}/>;
      break;
    case PAGE.SERVER:
    case PAGE.LOGIN:
      bar = <LogoBar {...state}/>;
      break;
  }

  if(!bar || !page) {
    console.log("Unknown page state of " + state.page, bar, page);
  }

  ReactDOM.render(
    <div>
      {bar}
      {page}
    </div>,
    container
  );

};

var serverUrl = localStorage.getItem(STORAGE.SERVER_URL);
if(serverUrl){
  StateStore.dispatch({type:STORAGE.SET_SERVER_URL, serverUrl:serverUrl});
}

setTimeout(function(){
  document.documentElement.classList.add("ready");
  setTimeout(function(){
    document.documentElement.classList.remove("ready");
    document.documentElement.classList.remove("loading");
  }, 1000);
},1000);

render();

StateStore.subscribe(render);
