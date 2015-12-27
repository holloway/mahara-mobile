/*jshint esnext: true */
import React                 from 'react';
import {PAGE, PAGE_URL}      from '../../constants.js';
import {MaharaBaseComponent} from '../base.js';

var menuItems = [
  {menuType: PAGE.USER,    stringId:'menu_user'},
  {menuType: PAGE.ADD,     stringId:'menu_add'},
  {menuType: PAGE.PENDING, stringId:'menu_pending'},
  {menuType: PAGE.SYNC,    stringId:'menu_sync'},
];

class NavBar extends MaharaBaseComponent {
  render() {
    var that = this;
    var propsMenuBase = this.props.menu;
    if(propsMenuBase.indexOf("_") >= 0){ // Because top level menu item of ADD should also match
                                         // submenu of ADD_LIBRARY or ADD_JOURNAL_ENTRY etc
      propsMenuBase = propsMenuBase.substr(0, propsMenuBase.indexOf("_"));
    }
    return <nav>
        <ul>
          {menuItems.map(function(item, index){
            return <li key={item.menuType} className={item.menuType === propsMenuBase ? "active": ""}>
              <a href={"#" + PAGE_URL[item.menuType]}>
                {that.gettext(item.stringId)}
                {item.menuType === that.props.menu ? <span className="sr-only"> ({that.gettext('menu_active')})</span>: ""}
              </a>
            </li>;
          })}
        </ul>
    </nav>;
  }
}

export default NavBar;
