/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import StateStore,
       {maharaServer}          from '../../state.js';
import Router              from '../../router.js';
import {PAGE, PAGE_URL, STORAGE} from '../../constants.js';

class SSOPage extends MaharaBaseComponent {
  render() {
    if(maharaServer.ssoUrl){
      return <iframe src={maharaServer.ssoUrl} ref="iframe"></iframe>
    } else {
      return <section>
        <p>
          {this.gettext('no_sso_url_found')}
          <a onClick={this.goBackToServer}>{this.gettext('try_again_question')}</a>
        </p>
      </section>
    }
  }
  componentDidMount = () => {
    if(!this.refs.iframe) return;
    this.loginChecker = setTimeout(this.checkIfLoggedIn, this.checkIfLoggedInEveryMilliseconds);
  };
  checkIfLoggedInEveryMilliseconds = 1000;
  checkIfLoggedIn = () => {
    maharaServer.checkIfLoggedIn(this.checkIfLoggedInResult);
  }
  checkIfLoggedInResult = (isLoggedIn) => {
    if(this.loginChecker) clearTimeout(this.loginChecker);
    //console.log("isLoggedIn", isLoggedIn);
    if(isLoggedIn === true){
      Router.navigate(PAGE_URL.ADD);
    } else {
      this.loginChecker = setTimeout(this.checkIfLoggedIn, this.checkIfLoggedInEveryMilliseconds);
    }
  }
  componentWillUnmount = () => {
    if(this.loginChecker) clearTimeout(this.loginChecker);
  }
  goBackToServer = () => {
    Router.navigate(PAGE_URL.SERVER);
  }
  iframeError = (e) => {
    console.log("iframe error", e);
  }
}

export default SSOPage;
