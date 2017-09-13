import React               from 'react';
import MaharaBaseComponent from '../base.js';

class LogoBar extends MaharaBaseComponent {
  render() {
    return <div className="LogoBar">
      <h1>
        <img src="image/logo-big.svg" alt={this.gettext('app_name')}/>
      </h1>
    </div>;
  }
}

export default LogoBar;
