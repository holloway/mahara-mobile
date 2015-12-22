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
import AddPage         from './components/add/add.js';
import PendingPage     from './components/pending/pending.js';
import SyncPage        from './components/navbar/navbar.js';

var container = document.getElementById('container');

const store = createStore(MaharaState);

const render = () => {
  var state = store.getState();
  ReactDOM.render(
    <div>
      <NavBar menu={state.menu}/>
    </div>,
    container
  );
};

var router = new Grapnel({pushState:false});

//['User','Add','Pending','Sync']

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
