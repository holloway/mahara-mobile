/*jshint esnext: true */
import React                 from 'react';
import {PAGE, PAGE_URL}      from '../../constants.js';
import {MaharaBaseComponent} from '../base.js';

var menuItems = [
  {menuType: PAGE.USER,    stringId:'menu_user',    uri:"User"},
  {menuType: PAGE.ADD,     stringId:'menu_add',     uri:"Add"},
  {menuType: PAGE.PENDING, stringId:'menu_pending', uri:"Pending"},
  {menuType: PAGE.SYNC,    stringId:'menu_sync',    uri:"Sync"},
];

class NavBar extends MaharaBaseComponent {
  render() {
    console.log("props", this.props);
    var that = this;
    return <nav>
        <ul>
          {menuItems.map(function(item, index){
            return <li key={item.menuType} className={item.menuType === that.props.menu ? "active": ""}>
              <a href={"#" + PAGE_URL[item.menuType]}>
                {that.gettext(item.stringId)}
                {item.menuType === that.props.menu ? <span className="sr-only">({that.gettext('menu_active')})</span>: ""}

              </a>
            </li>;
          })}
        </ul>
    </nav>;
  }
}

export default NavBar;
