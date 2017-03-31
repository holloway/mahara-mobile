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
        <form onSubmit={this.nextButton} noValidate>
            <label htmlFor="serverUrl">{this.gettext('server_question')}</label>
            <input
              type="url" ref="serverUrl"
              value={this.state.serverUrl}
              onChange={this.onChange}
              placeholder={this.gettext('server_url_example')}
              id="serverUrl"
              />
            <button type="button" onClick={this.skipButton} className="skip">{this.gettext('wizard_skip_button')}</button>
            <button type="submit" className="next">{this.gettext('wizard_next_button')}</button>
        </form>
    </section>;
  }

  onChange = (e) => {
    this.setState({serverUrl: this.refs.serverUrl.value});
  }

  nextButton = (e) =>  {
    e.preventDefault();
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
