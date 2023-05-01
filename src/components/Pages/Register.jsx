import React, { Fragment, useEffect, useState } from "react";
import classes from "./css/Register.module.css";
import { FcGoogle } from "react-icons/fc";
import background from "../../assets/login-banner.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebaseConfig/config";
import { useAuth } from "../../firebaseConfig/auth";
import Loader from "../Layouts/Loader";

const Register = () => {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const { authUser, setAuthUser, isLoading } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && authUser) {
      navigate("/");
    }
  }, [isLoading, authUser]);

  const provider = new GoogleAuthProvider();

  const signupHandler = async () => {
    if (!username || !email || !password) return;

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(auth.currentUser, { displayName: username });

      setAuthUser({
        uid: user.uid,
        email: user.email,
        username: user.displayName,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const signupGoogleHandler = async () => {
    const googleUser = await signInWithPopup(auth, provider);
    console.log(googleUser);
  };

  return isLoading || (!isLoading && authUser) ? (
    <Loader />
  ) : (
    <Fragment>
      <main className={classes.register}>
        <div className={classes.registerSection}>
          <h1 className={classes.heading}>Sign Up</h1>
          <p className={classes.headingDesc}>
            Already have an account ?{" "}
            <NavLink to="/login" className={classes.loginLink}>
              Login
            </NavLink>
          </p>

          <div className={classes.loginBtn} onClick={signupGoogleHandler}>
            <FcGoogle className={classes.googleLogo} />
            <span className={classes.googleLoginBtn}>Login with Google</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className={classes.form}>
              <label>Name</label>
              <input
                type="text"
                className={classes.inputLogin}
                required
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
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
            <button className={classes.signupBtn} onClick={signupHandler}>
              Sign Up
            </button>
          </form>
        </div>
        <div className={classes.imgSection}>
          <img src={background} alt="backgroundPic" className={classes.img} />
        </div>
      </main>
    </Fragment>
  );
};

export default Register;
