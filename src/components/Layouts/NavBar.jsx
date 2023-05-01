import React, { Fragment } from "react";
import { GoSignOut } from "react-icons/go";
import classes from "./NavBar.module.css";
import { useAuth } from "../../firebaseConfig/auth";

const NavBar = ({ signout }) => {
  return (
    <Fragment>
      <div className={classes.logoutBtn} onClick={signout}>
        <GoSignOut className={classes.logoutDesign} />
        <span>Logout</span>
      </div>
    </Fragment>
  );
};

export default NavBar;
