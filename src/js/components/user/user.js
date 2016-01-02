/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import {PAGE_URL}          from '../../constants.js';
import Router              from '../../router.js';

class User extends MaharaBaseComponent {
  render() {
    return <section>
      <h1>User</h1>
      <button onClick={this.loginButton} className="big">Login</button>
    </section>;
  }
  loginButton = (e) => {
    Router.navigate(PAGE_URL.LOGIN);
  }
}

export default User;
