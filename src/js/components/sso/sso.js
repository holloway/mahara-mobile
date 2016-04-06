/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import StateStore,
       {maharaServer}      from '../../state.js';
import Router              from '../../router.js';
import {PAGE,
        LOGIN,
        PAGE_URL,
        STORAGE}           from '../../constants.js';

class SSOPage extends MaharaBaseComponent {
  render() {
    console.log("maharaServer.ssoUrl", maharaServer.ssoUrl);
    if(maharaServer.ssoUrl){
      return <iframe src={maharaServer.ssoUrl} ref="iframe" onError={this.iframeError}></iframe>
    } else {
      return <section>
        <p>
          {this.gettext('no_sso_url_found')}
          <a onClick={this.goBackToServer} className="noSSOFound">{this.gettext('try_again_question')}</a>
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
    maharaServer.getLoginStatus(this.checkIfLoggedInResult, this.checkIfLoggedInFailure);
  }
  checkIfLoggedInResult = (isLoggedIn) => {
    if(this.loginChecker) clearTimeout(this.loginChecker);
    console.log("isLoggedIn", isLoggedIn);
    if(isLoggedIn){
      Router.navigate(PAGE_URL.ADD);
      StateStore.dispatch({type:LOGIN.AFTER_LOGIN_GET_PROFILE});
    } else {
      if(!this.hasUnmounted) this.loginChecker = setTimeout(this.checkIfLoggedIn, this.checkIfLoggedInEveryMilliseconds);
    }
  }
  checkIfLoggedInFailure = (e) => {
    console.log("sso failure", arguments);
    if(this.loginChecker) clearTimeout(this.loginChecker);
    this.loginChecker = setTimeout(this.checkIfLoggedIn, this.checkIfLoggedInEveryMilliseconds);
  }
  componentWillUnmount = () => {
    this.hasUnmounted = true; //TODO: refactor this into Redux
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
