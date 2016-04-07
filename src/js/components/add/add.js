/*jshint esnext: true */
import React from 'react';
import MaharaBaseComponent from '../base.js';
import {PAGE_URL,
        FILE_ENTRY}          from '../../constants.js';
import Router              from '../../router.js';
import StateStore          from '../../state.js';

class Add extends MaharaBaseComponent {
  render() {
    // <button onClick={this.addLibrary} className="big">Library</button>
    return <section>
      <h1>Add New</h1>
      <button onClick={this.takePhoto} className="big">{this.gettext('camera_take_photo_button')}</button>
      <button onClick={this.addJournalEntry} className="big">{this.gettext('add_journal_entry')}</button>
    </section>;
  }
  takePhoto = (e) => {
    this.cameraSuccess("/sdfsdf/sdfsdfs/image.jpg");
    if(!navigator.camera || !navigator.camera.getPicture || !navigator.camera.DestinationType){
      //this.html5Camera();
      alertify.okBtn(this.gettext('alert_ok_button'));
      alertify.alert(this.gettext('camera_unavailable'));
      return;
    }
    navigator.camera.getPicture(
      this.cameraSuccess,
      this.cameraError,
      {destinationType: navigator.camera.DestinationType.FILE_URI});
  }
  cameraSuccess = (imageUri) => {
    var fileName = (imageUri.indexOf("/") === -1) ? imageUri : imageUri.substring(imageUri.lastIndexOf("/") + 1);
    var fileEntry = {
      title:     fileName,
      type:      FILE_ENTRY.TYPE,
      guid:      this.guidGenerator(),
      uri:       imageUri,
      filename:  fileName,
      createdOn: Date.now()
    };
    StateStore.dispatch({type:FILE_ENTRY.ADD_ENTRY, fileEntry:fileEntry})
  }
  cameraError = (message) => {
    alertify
        .okBtn(this.gettext("alert_ok_button"))
        .alert(this.gettext("camera_error") + " " + message);
  }
  guidGenerator(){
    return (Math.random() + 1).toString(36).substring(2, 12) + (Math.random() + 1).toString(36).substring(2, 12);
  }
  addLibrary = (e) => {
    Router.navigate(PAGE_URL.ADD_LIBRARY);
  }
  addJournalEntry = (e) => {
    Router.navigate(PAGE_URL.ADD_JOURNAL_ENTRY);
  }
}

export default Add;

/*
html5Camera = (e) => {
  //TODO: Make this work as a browser fallback, or perhaps just have a file upload?

  var canvas = document.createElement("canvas"),
      context = canvas.getContext("2d"),
      video = document.createElement("video"),
      videoObj = {"video": true},
      errBack = function(error) {
        console.log("Video capture error: ", error.code, error);
      };

  if(navigator.getUserMedia) { // Standard
    navigator.getUserMedia(videoObj, function(stream) {
      video.src = stream;
      video.play();
    }, errBack);
  } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia(videoObj, function(stream){
      video.src = window.webkitURL.createObjectURL(stream);
      video.play();
    }, errBack);
  }
  else if(navigator.mozGetUserMedia) { // Firefox-prefixed
    navigator.mozGetUserMedia(videoObj, function(stream){
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }, errBack);
  }
}

 */