import React from "react";
import LogoutIcon from '@mui/icons-material/Logout';

function Header(props) {

  return (
    <header>
      <h1>JobConnect</h1>
      { props.UserName &&
      <div className="dropdown">
        <h3 className="dropdown-text"> Hello ! &nbsp;{props.UserName}</h3>
        <div className="dropdown-content">
          <a onClick={props.UserLogoutFunc}>Logout &nbsp; <LogoutIcon /></a>
          {/* Add other optionsin future */}
        </div>
      </div>
      }
    </header>
  );
}

export default Header;
