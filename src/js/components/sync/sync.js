/*jshint esnext: true */
import React from 'react';

import MaharaBaseComponent from '../base.js';
import StateStore          from '../../state.js';
import {PENDING}           from '../../constants.js';

export default class Sync extends MaharaBaseComponent {
  constructor(){
    super();
    this.uploadNextJournal = this.uploadNextJournal.bind(this);
  }
  render() {
    return <section>
      <h1>Sync</h1>
      <p>...</p>
      <button onClick={this.uploadNextJournal}>upload journal</button>
    </section>;
  }
  uploadNextJournal(){
    var journalEntry,
        that = this,
        dontReattemptUploadWithinMilliseconds = 1000 * 60 * 10;

    if(!this.props.pendingUploads || this.props.pendingUploads.length === 0) return;

    StateStore.dispatch({type:PENDING.UPLOAD_NEXT});
  }
}
