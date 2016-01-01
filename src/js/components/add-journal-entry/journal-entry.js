/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import TagsInput           from 'react-tagsinput';

class JournalEntry extends MaharaBaseComponent {
  render() {
    return <div>
      <h2>Title</h2>
      <input ref="title" type="text" className="subject"/>
      <h2>Detail</h2>
      <textarea ref="textarea" className="body"></textarea>
      <TagsInput value={['what']} onChange={::this.change} />
    </div>;
  }
  change = (e) => {
    console.log(e);
  }
  componentDidMount(){
    var textarea = this.refs.textarea,
        saveButtonHeight = 50, //todo: approximate height most of the time
        textareaLayout = textarea.getBoundingClientRect(),
        newTextAreaHeight = window.innerHeight - textareaLayout.top - saveButtonHeight,
        minimumHeight = 50; // 50 (pixels) is about 2 lines of text on most screens. Feel free to tweak this.

    newTextAreaHeight = newTextAreaHeight < minimumHeight ? minimumHeight : newTextAreaHeight; //clamping the value to a minimum
    textarea.style.height = newTextAreaHeight + "px";
  }
}

export default JournalEntry;
