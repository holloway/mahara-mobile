/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import TagsInput           from 'react-tagsinput';

class Library extends MaharaBaseComponent {
  constructor(props) {
    super(props);
    this.state = {tags:[]};
  }
  render() {
    return <div>
      <h2>{this.gettext("library_title")}</h2>
      <input ref="title" type="text" className="subject"/>
      <h2>{this.gettext("library_body")}</h2>
      <textarea ref="textarea" className="body"></textarea>
      <h2>{this.gettext("library_tags")}</h2>
      <TagsInput value={this.state.tags} onChange={this.changeTags} />
    </div>;
  }
  changeTags = (tags) => {
    this.setState({
      tags: tags
    });
  }
}

export default Library;
