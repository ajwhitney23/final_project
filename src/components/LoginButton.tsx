import * as React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const LoginButton = (props: { initPrefs: () => void }): JSX.Element => {
  const [loggedin, setLoggedIn] = React.useState<boolean>(false);
  const [text, setText] = React.useState<string>("");

  const fetchlogin = () => {
    fetch("/id", {
      method: "GET",
    })
      .then(function (res) {
        return res.text();
      })
      .then(function (id) {
        if (id !== "") {
          setLoggedIn(true);
          setText("Logout");
          props.initPrefs();
        } else {
          setLoggedIn(false);
          setText("Log In With Github");
        }
      });
  };

  const handleUser = () => {
    if (loggedin) {
      logout();
      window.location.href = "/";
    } else {
      userlogin();
    }
  };

  const logout = () => {
    fetch("/logout", {
      method: "GET",
    }).then(() => {
      setLoggedIn(false);
    });
  };

  const userlogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=a93f32b8cd47d1dedbff`;
  };

  React.useEffect(() => {
    fetchlogin();
  }, [loggedin]);

  return (
    <button style={{float: "right"}} onClick={handleUser}>
      <FontAwesomeIcon icon={faGithub} />
      {text}
    </button>
  );
};

export default LoginButton;
