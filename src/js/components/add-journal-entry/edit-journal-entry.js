import React               from 'react';
import MaharaBaseComponent from '../base.js';
import Router              from '../../router.js';
import StateStore          from '../../state.js';
import JournalEntry        from './journal-entry.js';
import {JOURNAL, PAGE_URL} from '../../constants.js';

class EditJournalEntry extends MaharaBaseComponent {
  render() {
    return <section>
      <h1>Add Journal Entry</h1>
      <JournalEntry parent={this} {...this.props} edit={true} ref="journalEntry"/>
      <button ref="saveButton" onClick={this.saveButton}>Save</button>
    </section>;
  }
  saveButton = () => {
    var titlebox = this.refs.journalEntry.refs.title,
        textarea = this.refs.journalEntry.refs.textarea,
        journalEntry;

    journalEntry = {
      type:  JOURNAL.TYPE,
      guid:  Math.random(), //FIXME: Replace with something more unique/GUIDy
      title: titlebox.value,
      body:  textarea.value,
      at:    Date.now()
    };

    StateStore.dispatch({type:JOURNAL.ADD_ENTRY, journalEntry:journalEntry});

    Router.navigate(PAGE_URL.PENDING);
  }
}

export default EditJournalEntry;
