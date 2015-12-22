/*jshint esnext: true */
import React from 'react';
import {l10n} from '../../language.js';

/* {this.props.menuItems.map(function(item, index) */

class User extends React.Component {
  static defaultProps = {
    menuItems: [
      {menuType: "User",    langId:'options_menu_account'},
      {menuType: 'Add',     langId:'options_menu_compose'},
      {menuType: 'Pending', langId:'pref_sync_url_title'},
      {menuType: 'Sync',    langId:'options_menu_viewsaved'},
    ]
  }
  render() {
    var that = this;
    return <nav>
        <ul>
          {this.props.menuItems.map(function(item, index){
            return <li key={item.menuType} className={item.menuType === that.props.menu ? "active": ""}>
              <a href={"#" + item.menuType}>
                {l10n(item.langId)}
                <span className="sr-only">({l10n(item)})</span>
              </a>
            </li>
          })}
        </ul>
    </nav>;
  }
}

export default User;
