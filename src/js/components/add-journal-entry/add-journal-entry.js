/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import Router              from '../../router.js';
import StateStore,
       {maharaServer}      from '../../state.js';
import JournalEntry        from './journal-entry.js';
import {JOURNAL, PAGE_URL} from '../../constants.js';

class AddJournalEntry extends MaharaBaseComponent {
  render() {
    return <section>
      <h1>{this.gettext("add_journal_title")}</h1>
      <JournalEntry parent={this} {...this.props} ref="journalEntry"/>
      <button ref="saveButton" onClick={this.saveButton}>{this.gettext("add_journal_save_button")}</button>
    </section>;
  }
  saveButton = () => {
    var titlebox = this.refs.journalEntry.refs.title,
        textarea = this.refs.journalEntry.refs.textarea,
        tags = this.refs.journalEntry.tags,
        journalEntry;

    journalEntry = {
      type:      JOURNAL.TYPE,
      guid:      this.guidGenerator(),
      title:     titlebox.value,
      body:      textarea.value,
      tags:      tags,
      createdOn: Date.now()
    };

    if(!journalEntry.title || !journalEntry.body) {
      alertify
          .okBtn(this.gettext("alert_ok_button"))
          .alert(this.gettext("add_journal_required"));
      return;
    }

    StateStore.dispatch({type:JOURNAL.ADD_ENTRY, journalEntry:journalEntry});

    Router.navigate(PAGE_URL.PENDING);
  }
  guidGenerator(){
    return (Math.random() + 1).toString(36).substring(2, 12) + (Math.random() + 1).toString(36).substring(2, 12);
  }
}

export default AddJournalEntry;
