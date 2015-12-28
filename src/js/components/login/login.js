/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import StateStore          from '../../state.js';
import {PAGE, PAGE_URL}    from '../../constants.js';
import Router              from '../../router.js';

class LoginPage extends MaharaBaseComponent {
  render() {
    return <section>
      <h3>{this.gettext('username')}</h3>
      <input type="text" ref="username"/>
      <h3>{this.gettext('password')}</h3>
      <input type="password" ref="password"/>
      <button onClick={this.backButton} className="back">{this.gettext('backButton')}</button>
      <button onClick={this.nextButton} className="next">{this.gettext('nextButton')}</button>
    </section>;
  }
  backButton = (e) => {
    Router.navigate(PAGE_URL.SERVER);
  }
  nextButton = (e) => {
    Router.navigate(PAGE_URL.ADD);
  }
}

export default LoginPage;
