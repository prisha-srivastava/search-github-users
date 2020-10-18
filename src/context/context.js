import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

//Provider,Consumer - GithubContext.Provider

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  //request loading
  const [requests, setRequests] = useState(0);

  const [isloading, setisLoading] = useState(false);
  //error
  const [error, setError] = useState({ show: false, msg: "" });
  //search
  const searchGithubUser = async (user) => {
    toggeleError();
    //setloadingtrue
    setisLoading(true);

    //getting searched github user from api
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    console.log(response);
    if (response) {
      setGithubUser(response.data);

      const { login } = response.data;

      //loading till we get all the results and displaying at the same time
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${rootUrl}/users/${login}/followers`),
      ])
        .then((results) => {
          const [repos, followers] = results;
          const status = "fulfilled";
          if (repos.status === status) {
            setRepos(repos.value.data);
          }
          if (followers.status === status) {
            setFollowers(followers.value.data);
          }
        })
        .catch((err) => console.log());
      //getting repos from api
      // axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((response) =>
      //   setRepos(response.data)
      // );

      //getting followers from api
      // axios(`${rootUrl}/users/${login}/followers`).then((response) =>
      //   setFollowers(response.data)
      // );
    } else {
      toggeleError(true, "there is no user with that username");
    }
    checkRequests();
    setisLoading(false);
  };
  //check request rate limit
  const checkRequests = () => {
    axios
      .get(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;

        setRequests(remaining);
        if (remaining === 0) {
          //throw an error
          toggeleError(true, "You have exceeded the hourly rate limit.");
        }
      })
      .catch((err) => console.log(err));
  };
  function toggeleError(show = false, msg = "") {
    //default values of show=false and message="" when function is called

    setError({ show, msg });
  }
  //error
  useEffect(checkRequests, []);
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isloading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
