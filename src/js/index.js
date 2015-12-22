/*jshint esnext: true */

import { createStore } from 'redux';
import { Provider}     from 'react-redux';
import React           from 'react';
import ReactDOM        from 'react-dom';
import Grapnel         from 'grapnel';
import $               from 'jquery';
import MaharaState     from './mahara-state.js';
import NavBar          from './components/navbar/navbar.js';
import UserPage        from './components/user/user.js';
import Server          from './components/server/server.js';
import AddPage         from './components/add/add.js';
import PendingPage     from './components/pending/pending.js';
import SyncPage        from './components/sync/sync.js';
import {MENU_ITEMS}    from './constants.js';

var container = document.getElementById('container');

const store = createStore(MaharaState);

const render = () => {
  var state = store.getState(),
      page;

  if(state.menu === MENU_ITEMS.User){
    page = <UserPage/>;
  } else if(state.menu === MENU_ITEMS.Add){
    page = <AddPage/>;
  } else if(state.menu === MENU_ITEMS.Pending){
    page = <PendingPage/>;
  } else if(state.menu === MENU_ITEMS.Sync){
    page = <SyncPage/>;
  }

  if(page){
    ReactDOM.render(
      <div>
        <NavBar menu={state.menu}/>
        {page}
      </div>,
      container
    );
  } else {
    ReactDOM.render(
      <div>
        <Server/>
      </div>,
      container
    );
  }


};

var router = new Grapnel({pushState:false});

router.get('User', function(req){
  store.dispatch({type:"MENU_USER"});
});

router.get('Add', function(req){
  store.dispatch({type:"MENU_ADD"});
});

router.get('Pending', function(req){
  store.dispatch({type:"MENU_PENDING"});
});

router.get('Sync', function(req){
  store.dispatch({type:"MENU_SYNC"});
});


setTimeout(function(){
  document.documentElement.classList.add("ready");
  setTimeout(function(){
    document.documentElement.className = "";
  }, 1000);
},250);

render();

store.subscribe(render);
