/*jshint esnext: true */
import httpLib from './http-lib.js';

export default function generateUploadToken(){
  var token = "",
      makeToken = function(){
        return (Math.random() + 1).toString(36).substring(2, 12);
      };

  while(token.length !== 10){
    token = makeToken();
  }
  return token;
}