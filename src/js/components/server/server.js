/*jshint esnext: true */
import React                 from 'react';
import {MaharaBaseComponent} from '../base.js';
import StateStore            from '../../state.js';
import {STORAGE, PAGE_URL}   from '../../constants.js';
import Router                from '../../router.js';

export default class ServerPage extends MaharaBaseComponent {
  render() {
    return <section>
      <h2>{this.gettext('server_step_1')}</h2>
      <input type="url" ref="serverUrl" placeholder={this.gettext('serverUrlExample')}/>
      <button onClick={this.nextButton}>{this.gettext('nextButton')}</button>
    </section>;
  }
  nextButton = (e) => {
    var serverUrl = this.refs.serverUrl.value;
    StateStore.dispatch({type:STORAGE.SET_SERVER_URL, serverUrl:serverUrl});
    Router.navigate(PAGE_URL.LOGIN);
  }
}
