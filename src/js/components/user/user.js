/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import {PAGE_URL}          from '../../constants.js';
import Router              from '../../router.js';
import {maharaServer}      from '../../state.js';
import ReactPullToRefresh  from 'react-pull-to-refresh';

class User extends MaharaBaseComponent {
    constructor() {
        super();
        this.logoutButton = this.logoutButton.bind(this);
        this.renderServer = this.renderServer.bind(this);
        this.changeServer = this.changeServer.bind(this);
    }

    render() {
        //console.log("PROPS?", this.props);
        return <ReactPullToRefresh onRefresh={maharaServer.refreshUserProfile}>
            <section>
                <h2>{this.props.server && this.props.server.user ? this.props.server.user : ""}</h2>
                <p className="userBlock"><img src={this.props.server && this.props.server.profile && this.props.server.profile.icon ? this.props.server.profile.icon : "image/profile-default.png"} className="profile"/> {this.props.server && this.props.server.profile && this.props.server.profile.myname ? this.props.server.profile.myname : ""}</p>
                <p>{this.renderServer() }</p>
                <hr/>
                <button onClick={this.logoutButton} className="big">{this.gettext("logout_button") }</button>
            </section>
        </ReactPullToRefresh>
        ;
    }

    logoutButton() {
        alertify.okBtn(this.gettext("alert_ok_button"));
        alertify.cancelBtn(this.gettext("button_cancel"));
        alertify.confirm(this.gettext("logout_confirmation"), function (e, str) {
            if (e) {
                maharaServer.logOut(function (isLoggedIn) {
                    console.log("Is logged in?", isLoggedIn);
                    Router.navigate(PAGE_URL.LOGIN_TYPE);
                }, function (err) {
                    console.log("Couldn't logout. This probably doesn't matter.", err);
                    Router.navigate(PAGE_URL.LOGIN_TYPE);
                });
            } else {
                //nothing
            }
        });
    }
    renderServer() {
        if (!this.props.server || !this.props.server.wwwroot) return "";
        return <span>
            {this.props.server.wwwroot}

            <span className="changeServerBrackets">(<a onClick={this.changeServer} className="changeServer">{this.gettext("change_server") }</a>) </span>
        </span>;
    }
    
    changeServer() {
        Router.navigate(PAGE_URL.SERVER);
    }
}

export default User;
