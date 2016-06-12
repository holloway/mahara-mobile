/*jshint esnext: true */
import {STORAGE} from './constants.js';

var items = {};

items.state = {
  key: STORAGE.STATE_STORAGE_KEY,
  isJSON: true
};

var Storage = {};
(function(){
  function get(item){
    return function(){
      var value = localStorage.getItem(item.key);
      if(item.isJSON) return JSON.parse(value);
      return value;
    };
  }
  function set(item){
    return function(value){
      if(item.isJSON) value = JSON.stringify(value);
      return localStorage.setItem(item.key, value);
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
