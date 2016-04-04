/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import Router              from '../../router.js';
import StateStore          from '../../state.js';
import JournalEntry        from './journal-entry.js';
import {JOURNAL, PAGE_URL} from '../../constants.js';

class AddJournalEntry extends MaharaBaseComponent {
  render() {
    return <section>
      <h1>Add Journal Entry</h1>
      <JournalEntry parent={this} ref="journalEntry"/>
      <button ref="saveButton" onClick={this.saveButton}>Save</button>
    </section>;
  }
  saveButton = () => {
    var titlebox = this.refs.journalEntry.refs.title,
        textarea = this.refs.journalEntry.refs.textarea,
        journalEntry;

    journalEntry = {
      type:      JOURNAL.TYPE,
      guid:      this.guidGenerator(),
      title:     titlebox.value,
      body:      textarea.value,
      createdOn: Date.now()
    };

    StateStore.dispatch({type:JOURNAL.ADD_ENTRY, journalEntry:journalEntry});

    Router.navigate(PAGE_URL.PENDING);
  }
  guidGenerator(){
    return (Math.random() + 1).toString(36).substring(2, 12) + (Math.random() + 1).toString(36).substring(2, 12);
  }
}

export default AddJournalEntry;
