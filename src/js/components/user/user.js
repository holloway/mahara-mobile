/*jshint esnext: true */
import React               from 'react';
import MaharaBaseComponent from '../base.js';
import {PAGE_URL}          from '../../constants.js';
import Router              from '../../router.js';
import {maharaServer}      from '../../state.js';
import ReactPullToRefresh  from 'react-pull-to-refresh';

const defaultIcon = "image/profile-default.png";
class User extends MaharaBaseComponent {
    constructor() {
        super();
        this.logoutButton = this.logoutButton.bind(this);
        this.renderServer = this.renderServer.bind(this);
        this.changeServer = this.changeServer.bind(this);
    }

    render() {
        //console.log("PROPS?", this.props);
        var siteName = 'Mahara';
        var icon;
        var displayName;

        if (this.props.server) {
            if (this.props.server.siteName) {
                siteName = this.props.server.siteName;
            }

            if (this.props.server.profile.iconurl) {
                icon = this.props.server.profile.iconurl;
            }
            else {
                icon = defaultIcon;
            }

            if (this.props.server && this.props.server.profile && this.props.server.profile.myname) {
                displayName = this.props.server.profile.myname;
            }
            else {
                displayName = "";
            }
        }
        else {
            siteName = `(${this.gettext('offline')})`;
            icon = defaultIcon;
            displayName = "";
        }
        // add timestamp to query to prevent image caching, because we're using same name 
        icon += `?${Date.now() || ''}`;
        return <ReactPullToRefresh onRefresh={maharaServer.refreshUserProfile}>
            <section>
                <h2>{siteName}</h2>
                <p className="userBlock"><img src={icon} className="profile"/> {displayName}</p>
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
                    // console.log("Is logged in?", isLoggedIn);
                    Router.navigate(PAGE_URL.SERVER);
                }, function (err) {
                    console.log("Couldn't logout. This probably doesn't matter.", err);
                    Router.navigate(PAGE_URL.SERVER);
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
