/*jshint esnext: true */
import React from 'react';
import MaharaBaseComponent from '../base.js';
import StateStore          from '../../state.js';
import Router              from '../../router.js';
import Library             from './library.js';
import {LIBRARY, PAGE_URL} from '../../constants.js';

class EditLibraryPage extends MaharaBaseComponent {
  render() {
    var height = window.innerHeight;
    return <section>
      <h1>Add Library Entry</h1>
      <Library ref="library" edit={true}/>
      <button ref="saveButton" onClick={this.saveButton}>Save</button>
    </section>;
  }
  componentDidMount(){
    var textarea = this.refs.library.refs.textarea,
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
        libraryItem;

    libraryItem = {
      type:  LIBRARY.TYPE,
      guid:  Math.random(), //FIXME: Replace with something more unique/GUIDy
      title: titlebox.value,
      body:  textarea.value,
      at:    Date.now()
    };

    StateStore.dispatch({type:LIBRARY.ADD_ENTRY, libraryItem:libraryItem});

    Router.navigate(PAGE_URL.PENDING);
  }
}

export default EditLibraryPage;
