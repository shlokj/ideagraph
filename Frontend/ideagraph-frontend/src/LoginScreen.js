import { Grid, Typography } from "@mui/material";
import "./LoginScreen.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  splitScreen: {
    display: "flex",
    flexDirection: "row",
  },
  topPane: {
    marginLeft: "-8px",
    marginTop: "-8px", // i have no idea why it's making me do this
    width: "50%",
    height: "100vh",
    backgroundColor: "#f6f6f6",
  },
  bottomPane: {
    width: "50%",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6f6f6",
  },
  whiteText: {
    textColor: "white",
  },
  typoSpaced: {
    marginTop: "100px",
    marginLeft: "150px",
  },
  typoSpaced0: {
    marginTop: "-40px",
    marginLeft: "150px",
  },
  typoSpaced1: {
    marginTop: "24px",
    marginLeft: "150px",
  },
  typoSpacedG: {
    marginTop: "40px",
    marginLeft: "144px",
  },
  imgPad: {
    marginLeft: "40px",
    marginTop: "-24px",
  },
};

function LoginScreen() {
  const navigate = useNavigate();
  function decodeJwtResponse(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  }
  function handleCallbackResponse(response) {
    console.log(decodeJwtResponse(response.credential));
    navigate("/app");
    localStorage.setItem("loggedIn", true);
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "294413887319-kvn405igs680u0b3kiclo1p7q2cd6pic.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "filled_black",
      size: "large",
      shape: "pill",
      width: 250,
    });
  }, []);

  return (
    <div className="App" style={styles.splitScreen}>
      <div style={styles.topPane}>
        {/* <h1 style={styles.whiteText}>Welcome to IdeaGraph.</h1> */}
        <Typography
          style={styles.typoSpaced}
          sx={{ fontSize: "6rem", color: "#727272", fontWeight: "bold" }}
        >
          Welcome
        </Typography>
        <Grid container>
          <Typography
            style={styles.typoSpaced0}
            sx={{ fontSize: "6rem", color: "#727272", fontWeight: "bold" }}
          >
            to
          </Typography>
          <img src="connection_symbol.svg" style={styles.imgPad}></img>
        </Grid>

        <Typography
          style={styles.typoSpaced0}
          sx={{ fontSize: "6rem", color: "#727272", fontWeight: "bold" }}
        >
          IdeaGraph.
        </Typography>

        <Typography
          style={styles.typoSpaced1}
          sx={{ fontSize: "2rem", color: "#727272" }}
        >
          An AI-powered assistant for your consciousness.
        </Typography>
        <div id="signInDiv" style={styles.typoSpacedG}></div>
      </div>
      <div style={styles.bottomPane}>
        {/* <div id="signInDiv"></div> */}
        <img
          src="landing_bg_right.svg"
          style={{ width: "70%", height: "70%" }}
          alt="right side background"
        ></img>
      </div>
    </div>
  );
}

export default LoginScreen;
