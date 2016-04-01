/*jshint esnext: true */
import React from 'react';
import MaharaBaseComponent from '../base.js';
import StateStore          from '../../state.js';
import Router              from '../../router.js';
import Library             from './library.js';
import {LIBRARY, PAGE_URL} from '../../constants.js';

class AddLibraryPage extends MaharaBaseComponent {
  render() {
    var height = window.innerHeight;
    return <section>
      <h1>Add Library Entry</h1>
      <Library ref="library" {...this.props}/>
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
    var titlebox = this.refs.library.refs.title,
        textarea = this.refs.library.refs.textarea,
        libraryItem,
        makeGuid = function(length){
          var guid = (Math.random() + 1).toString(36).substring(2, length + 2);
          if(guid.length !== length) return makeGuid(length);
          return guid;
        };

    libraryItem = {
      type:  LIBRARY.TYPE,
      guid:  makeGuid(10) + makeGuid(10),
      title: titlebox.value,
      body:  textarea.value,
      at:    Date.now()
    };

    StateStore.dispatch({type:LIBRARY.ADD_ENTRY, libraryItem:libraryItem});

    Router.navigate(PAGE_URL.PENDING);
  }
}

export default AddLibraryPage;
