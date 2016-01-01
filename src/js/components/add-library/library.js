/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';

class Library extends MaharaBaseComponent {
  render() {
    return <div>
      <h2>Title</h2>
      <input ref="title" type="text" className="subject"/>
      <h2>Detail</h2>
      <textarea ref="textarea" className="body"></textarea>
    </div>;
  }
}

export default Library;
