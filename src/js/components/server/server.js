/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import StateStore,
       {maharaServer}      from '../../state.js';
import {STORAGE, PAGE_URL} from '../../constants.js';
import Router              from '../../router.js';

export default class ServerPage extends MaharaBaseComponent {

  constructor(props) {
    super(props);

    var serverUrl = "";
    if(props.server && props.server.wwwroot){
      serverUrl = props.server.wwwroot;
    }
    this.state = {
      serverUrl: serverUrl
    };
    this.nextButton = this.nextButton.bind(this);
    this.skipButton = this.skipButton.bind(this);
  }

  render() {
    return <section>
      <label htmlFor="serverUrl">{this.gettext('server_question')}</label>
      <input
        type="url" ref="serverUrl"
        value={this.state.serverUrl}
        onChange={this.onChange}
        placeholder={this.gettext('server_url_example')}
        id="serverUrl"
        onKeyPress={this.handleUrlSubmit}
        />
      <button onClick={this.skipButton} className="skip">{this.gettext('wizard_skip_button')}</button>
      <button onClick={this.nextButton} className="next">{this.gettext('wizard_next_button')}</button>
    </section>;
  }

  onChange = (e) => {
    this.setState({serverUrl: this.refs.serverUrl.value});
  }

  handleUrlSubmit = (e) => {
      if(e.charCode == 13) {
          this.nextButton();
      }
  }

  nextButton(){
    var serverUrl = this.refs.serverUrl.value;
    if(serverUrl.trim().length === 0) {
      alertify.alert(this.gettext("server_url_empty_validation"));
      return;
    }
    if (serverUrl.slice(-1) !== "/") {
      serverUrl = serverUrl + "/";
    }

    if (!/^https?:\/\//.test(serverUrl)) {
      serverUrl = "https://" + serverUrl;
    }
    this.setState({serverUrl: serverUrl});
    StateStore.dispatch({type:STORAGE.SET_SERVER_URL, serverUrl:serverUrl});
    Router.navigate(PAGE_URL.LOGIN_TYPE);
  }

  skipButton(){
    Router.navigate(PAGE_URL.ADD);
  }
}
