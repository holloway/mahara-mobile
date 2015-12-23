/*jshint esnext: true */

import { createStore }    from 'redux';
import { Provider}        from 'react-redux';
import React              from 'react';
import ReactDOM           from 'react-dom';
import Grapnel            from 'grapnel';
import $                  from 'jquery';
import MaharaState        from './state.js';
import NavBar             from './components/navbar/navbar.js';
import UserPage           from './components/user/user.js';
import Server             from './components/server/server.js';
import AddPage            from './components/add/add.js';
import PendingPage        from './components/pending/pending.js';
import SyncPage           from './components/sync/sync.js';
import {PAGES,STORAGE}    from './constants.js';
import {getLangStrings}   from './i18n.js';

var container = document.getElementById('container');

const store = createStore(MaharaState);

const render = () => {
  var state = store.getState(),
      strings = getLangStrings(state.lang),
      page;

  console.log("sdfsdf", state);

  if(state.page === PAGES.USER){
    page = <UserPage/>;
  } else if(state.page === PAGES.ADD){
    page = <AddPage/>;
  } else if(state.page === PAGES.PENDING){
    page = <PendingPage/>;
  } else if(state.page === PAGES.SYNC){
    page = <SyncPage/>;
  }

  if(page){
    ReactDOM.render(
      <div className={"Page" + state.page}>
        <NavBar menu={state.page} lang={strings}/>
        {page}
      </div>,
      container
    );
  } else {
    ReactDOM.render(
      <div className={"Page" + state.page}>
        <Server lang={strings}/>
      </div>,
      container
    );
  }
};

var router = new Grapnel({pushState:false});

var server = localStorage.getItem(STORAGE.SERVER_URL);

router.get(PAGES.USER, function(req){
  store.dispatch({type:"PAGE_" + PAGES.USER.toUpperCase(), server:server});
});

router.get(PAGES.ADD, function(req){
  store.dispatch({type:"PAGE_" + PAGES.ADD.toUpperCase(), server:server});
});

router.get(PAGES.PENDING, function(req){
  store.dispatch({type:"PAGE_" + PAGES.PENDING.toUpperCase(), server:server});
});

router.get(PAGES.SYNC, function(req){
  store.dispatch({type:"PAGE_" + PAGES.SYNC.toUpperCase(), server:server});
});

router.get('', function(req){
  console.log("matching empty")
  store.dispatch({type:"PAGE_" + PAGES.SERVER.toUpperCase(), server:server});
});


setTimeout(function(){
  document.documentElement.classList.add("ready");
  setTimeout(function(){
    document.documentElement.className = "";
  }, 1000);
},250);

render();

store.subscribe(render);
