/*jshint esnext: true */
import React                 from 'react';
import {MENU_ITEMS}          from '../../constants.js';
import {MaharaBaseComponent} from '../base.js';

class NavBar extends MaharaBaseComponent {
  static defaultProps = {
    menuItems: [
      {menuType: MENU_ITEMS.User,    stringId:'menu_user'},
      {menuType: MENU_ITEMS.Add,     stringId:'menu_add'},
      {menuType: MENU_ITEMS.Pending, stringId:'menu_pending'},
      {menuType: MENU_ITEMS.Sync,    stringId:'menu_sync'},
    ]
  }
  render() {
    var that = this;
    return <nav>
        <ul>
          {this.props.menuItems.map(function(item, index){
            return <li key={item.menuType} className={item.menuType === that.props.menu ? "active": ""}>
              <a href={"#" + item.menuType}>
                {that.gettext(item.stringId)}
                <span className="sr-only">({that.gettext('menu_active')})</span>
              </a>
            </li>
          })}
        </ul>
    </nav>;
  }
}

export default NavBar;
