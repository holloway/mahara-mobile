/*jshint esnext: true */
import React from 'react';
import MaharaBaseComponent from '../base.js';
import {PAGE_URL}           from '../../constants.js';
import Router               from '../../router.js';

class Add extends MaharaBaseComponent {
  render() {
    return <section>
      <h1>Add New</h1>
      <button onClick={this.takePhoto} className="big">Photo</button>
      <button onClick={this.addLibrary} className="big">Library</button>
      <button onClick={this.addJournalEntry} className="big">Journal Entry</button>
    </section>;
  }
  takePhoto = (e) => {
    navigator.camera.getPicture(
      this.cameraSuccess,
      this.cameraError,
      {destinationType: navigator.camera.DestinationType.FILE_URI});
  }
  cameraSuccess = (imageData) => {

  }
  cameraError = (message) => {
    alertify.okBtn(this.gettext("alert_ok_button")).alert(this.gettext("camera_error") + " " + message);
  }
  addLibrary = (e) => {
    Router.navigate(PAGE_URL.ADD_LIBRARY);
  }
  addJournalEntry = (e) => {
    Router.navigate(PAGE_URL.ADD_JOURNAL_ENTRY);
  }
}

export default Add;
