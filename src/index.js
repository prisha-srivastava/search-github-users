import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { GithubProvider } from "./context/context";
import { Auth0Provider } from "@auth0/auth0-react";
// dev-lk-4kqch.us.auth0.com
// qUtFSz66rGN3JuciRkK5UhEVqN8E9L5I
ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-lk-4kqch.us.auth0.com"
      clientId="qUtFSz66rGN3JuciRkK5UhEVqN8E9L5I"
      redirectUri={window.location.origin}
      cacheLocation="localstorage"
    >
      <GithubProvider>
        <App />
      </GithubProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
