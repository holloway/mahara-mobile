/*jshint esnext: true */
import React from 'react';
import MaharaBaseComponent from '../base.js';
import {PAGE_URL}           from '../../constants.js';
import Router               from '../../router.js';

class Add extends MaharaBaseComponent {
  render() {
    return <section>
      <h1>Add New</h1>
      <button onClick={this.takePhoto}>Photo</button>
      <button onClick={this.addLibrary}>Library</button>
      <button onClick={this.addJournalEntry}>Journal Entry</button>
    </section>;
  }
  takePhoto = (e) => {
    alert("Use phonegap phone plugin")
  }
  addLibrary = (e) => {
    Router.navigate(PAGE_URL.ADD_LIBRARY);
  }
  addJournalEntry = (e) => {
    Router.navigate(PAGE_URL.ADD_JOURNAL_ENTRY);
  }
}

export default Add;
