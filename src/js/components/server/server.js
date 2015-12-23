/*jshint esnext: true */
import React from 'react';
import {MaharaBaseComponent} from '../base.js';

class Server extends MaharaBaseComponent {
  render() {
    return <section className="Page_Server">
      <h1><img src="image/logo-big.png" alt="Mahara Mobile"/></h1>
      <h2>{this.gettext('server_step_1')}</h2>
      <input type="url" placeholder="https://..."/>
    </section>;
  }
}

export default Server;
