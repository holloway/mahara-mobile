/*jshint esnext: true */
import React from 'react';
import MaharaBaseComponent from '../base.js';

class Pending extends MaharaBaseComponent {
  render() {
    return <section>
      <h1>Pending</h1>
      {this.renderPendingUploads()}
    </section>;
  }
  renderPendingUploads = (PAGE_ID) => {
    if(!this.props.pendingUploads) return "";
    return this.props.pendingUploads.map(function(item){
      return <div key={item.guid}>
        <h2>{item.title}</h2>
        <p>{item.body}</p>
      </div>
    })
  }
}

export default Pending;
