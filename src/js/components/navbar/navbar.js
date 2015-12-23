/*jshint esnext: true */
import React                 from 'react';
import {PAGES}               from '../../constants.js';
import {MaharaBaseComponent} from '../base.js';

class NavBar extends MaharaBaseComponent {
  static defaultProps = {
    menuItems: [
      {menuType: PAGES.USER,    stringId:'menu_user'},
      {menuType: PAGES.ADD,     stringId:'menu_add'},
      {menuType: PAGES.PENDING, stringId:'menu_pending'},
      {menuType: PAGES.SYNC,    stringId:'menu_sync'},
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
