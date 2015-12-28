/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import Router              from '../../router.js';
import StateStore          from '../../state.js';
import {STORAGE, PAGE_URL} from '../../constants.js';

class AddJournalEntry extends MaharaBaseComponent {
  render() {
    var height = window.innerHeight;
    return <section>
      <h1>Add Journal Entry</h1>
      <h2>Title</h2>
      <input ref="title" type="text" className="subject"/>
      <h2>Detail</h2>
      <textarea ref="textarea" className="body"></textarea>
      <button ref="saveButton" onClick={this.saveButton}>Save</button>
    </section>;
  }
  componentDidMount(){
    var textarea = this.refs.textarea,
        saveButton = this.refs.saveButton,
        textareaLayout = textarea.getBoundingClientRect(),
        saveButtonLayout = saveButton.getBoundingClientRect(),
        newTextAreaHeight = window.innerHeight - textareaLayout.top - saveButtonLayout.height,
        minimumHeight = 50; // 50 (pixels) is about 2 lines of text on most screens. Feel free to tweak this.

    newTextAreaHeight = newTextAreaHeight < minimumHeight ? minimumHeight : newTextAreaHeight; //clamping the value to a minimum
    textarea.style.height = newTextAreaHeight + "px";
  }
  saveButton = () => {
    var titlebox = this.refs.title,
        textarea = this.refs.textarea,
        journalEntry;

    journalEntry = {
      guid:  Math.random(), //FIXME: Replace with something more unique/GUIDy
      title: titlebox.value,
      body:  textarea.value,
      at:    Date.now()
    };

    StateStore.dispatch({type:STORAGE.ADD_JOURNAL_ENTRY_ACTION, journalEntry: journalEntry});

    Router.navigate(PAGE_URL.PENDING);
  }
}

export default AddJournalEntry;
