/*jshint esnext: true */
import {STORAGE} from './constants.js';

var items = {
  serverUrl: STORAGE.SERVER_URL
};

var Storage = {};
(function(){
  function get(key){
    return function(){
      return localStorage.getItem(key);
    };
  }
  function set(key){
    return function(value){
      return localStorage.setItem(key, value);
    };
  }

  for(var key in items){
    Storage[key] = {
      get: get(items[key]),
      set: set(items[key]),
    };
  }
}());

export default Storage;
