/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import TagsInput           from 'react-tagsinput';

class Library extends MaharaBaseComponent {
  render() {
    return <div>
      <h2>{this.gettext("library_title")}</h2>
      <input ref="title" type="text" className="subject"/>
      <h2>{this.gettext("library_body")}</h2>
      <textarea ref="textarea" className="body"></textarea>
      <h2>{this.gettext("library_tags")}</h2>
      <TagsInput value={['what']} onChange={::this.change} />
    </div>;
  }
  change  = (e) => {
    console.log(e);
  }
}

export default Library;
