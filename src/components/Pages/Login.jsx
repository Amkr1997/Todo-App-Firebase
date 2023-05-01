import React, { Fragment, useEffect, useState } from "react";
import classes from "./css/Login.module.css";
import { FcGoogle } from "react-icons/fc";
import background from "../../assets/login-banner.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebaseConfig/config";
import { useAuth } from "../../firebaseConfig/auth";
import Loader from "../Layouts/Loader";

const Login = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const { authUser, isLoading } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && authUser) {
      navigate("/");
    }
  }, [isLoading, authUser]);

  const provider = new GoogleAuthProvider();

  const loginHandler = async () => {
    if (!email || !password) return;

    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      // console.log(user);
    } catch (error) {
      console.error(error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const googleLoginDetails = await signInWithPopup(auth, provider);
      console.log(googleLoginDetails);
    } catch (error) {
      console.error(error);
    }
  };

  return isLoading || (!isLoading && authUser) ? (
    <Loader />
  ) : (
    <Fragment>
      <main className={classes.login}>
        <div className={classes.loginSection}>
          <h1 className={classes.heading}>Login</h1>
          <p className={classes.headingDesc}>
            Don't have an account ?{" "}
            <NavLink to="/register" className={classes.registerLink}>
              Sign up
            </NavLink>
          </p>

          <div className={classes.loginBtn} onClick={loginWithGoogle}>
            <FcGoogle className={classes.googleLogo} />
            <span className={classes.googleLoginBtn}>Login with Google</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className={classes.form}>
              <label>Email</label>
              <input
                type="email"
                className={classes.inputLogin}
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className={classes.form}>
              <label>Password</label>
              <input
                type="password"
                className={classes.inputLogin}
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <button className={classes.signinBtn} onClick={loginHandler}>
              Sign in
            </button>
          </form>
        </div>
        <div className={classes.imageSection}>
          <img src={background} alt="backgroundPic" className={classes.img} />
        </div>
      </main>
    </Fragment>
  );
};

export default Login;
