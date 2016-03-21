/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import {PAGE_URL}          from '../../constants.js';
import Router              from '../../router.js';

class User extends MaharaBaseComponent {
  render() {
    console.log(this.props)
    return <section>
      <h2>{this.props.server.user}</h2>

      <hr/>
      <button onClick={this.loginButton} className="big">{this.gettext("logout_button")}</button>
    </section>;
  }
  loginButton = (e) => {
    alerify()
    Router.navigate(PAGE_URL.LOGIN);
  }
}

export default User;
