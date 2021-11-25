import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Box from "@material-ui/core/Box";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import AccountCircle from "@material-ui/icons/AccountCircle";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";

import Button from "@material-ui/core/Button";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { connect } from "react-redux";
import { loggedIn, loggedOut } from "../auth-action";
import { loading } from "../../common/common-action";
import { login, logout } from "../services/auth-service";

import { AuthUser } from "../models/auth-user";
//import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import { useRouter } from "next/router";
import styles from "../../styles/Aaa.module.scss";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import { LocalDining } from "@material-ui/icons";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formInput: {
    marginBottom: "1em",
  },
  box: {
    maxWidth: "300px",
  },
}));

function LoginForm(props) {
  const [values, setValues] = React.useState({
    username: "",
    password: "",
    showPassword: false,
  });

  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  const { loggedIn, loggedOut, auth } = props;

  const classes = useStyles();

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleLogin();
    }
  };

  const handleBack = () => {
    const { backUrl } = router.query;
    router.push(backUrl);
  };

  const handleLogin = async () => {
    if (auth.isLoggedIn) {
      setLoading(true);

      logout(auth)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
          loggedOut();
        });
    } else {
      setLoading(true);

      fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setLoading(false);

          console.log(data);

          const authUser = new AuthUser(data);
          loggedIn(authUser);

          if (router.query && router.query.backUrl) {
            const { backUrl } = router.query;

            router.push(backUrl);
          } else {
            router.push("/");
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          toast("Unable to login. Please check your username and password.");
        });
    }
  };

  return (
    <div>
      <form noValidate autoComplete="off">
        <Box display="flex" flexDirection="column" className={classes.box}>
          {auth.isLoggedIn ? (
            <div>{auth.username}</div>
          ) : (
            <TextField
              id="username"
              label="Username"
              onChange={handleChange("username")}
              className={classes.formInput}
            />
          )}
          {!auth.isLoggedIn && (
            <TextField
              id="password"
              label="Password"
              type="password"
              onChange={handleChange("password")}
              className={classes.formInput}
            />
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" flexGrow="1">
              <ClipLoader color={"#315c8b"} loading={true} size={50} />
            </Box>
          ) : (
            <React.Fragment>
              {auth.isLoggedIn && (
                <Button
                  variant="contained"
                  onClick={handleBack}
                  className={classes.formInput}
                >
                  Go to Lab Report
                </Button>
              )}

              <Button
                variant="contained"
                onClick={handleLogin}
                className={classes.formInput}
              >
                {auth.isLoggedIn ? "Logout" : "Login"}
              </Button>
            </React.Fragment>
          )}
        </Box>
      </form>
      <ToastContainer />
    </div>
  );
}

export default connect(null, {
  loggedIn,
  loggedOut,
})(LoginForm);
