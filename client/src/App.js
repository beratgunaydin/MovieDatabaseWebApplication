import { BrowserRouter, Routes, Route, Router, useLocation } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import './styles/App.css';

const API_URL = "http://www.omdbapi.com/?apikey=<YOUR_API_KEY>";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showHomePage, setShowHomePage] = useState(true);
  const [showSignUp, setShowSignUp] = useState(true);
  const [showSignIn, setShowSignIn] = useState(true);
  const [showLogOut, setShowLogOut] = useState(false);

  const location = useLocation();

  const fetchMovies = async (title) => {
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();

    setMovies(data.Search);
  }

  const updateHeader = () => {
    switch (location.pathname) {
      case "/":
        setShowHomePage(false);
        setShowSignIn(true);
        setShowSignUp(true);
        setShowLogOut(false);
        break;
      case "/signIn":
        setShowHomePage(true);
        setShowSignIn(false);
        setShowSignUp(true);
        setShowLogOut(false);
        break;
      case "/signUp":
        setShowHomePage(true);
        setShowSignIn(true);
        setShowSignUp(false);
        setShowLogOut(false);
        break;
      case "/homePage":
        setShowHomePage(false);
        setShowSignIn(false);
        setShowSignUp(false);
        setShowLogOut(true);
        break;
      case "/movieDetailed":
        setShowHomePage(true);
        setShowSignIn(true);
        setShowSignUp(true);
        break;
      default:
        break;
    }
  } 


  useEffect(() => {
      fetchMovies("Spider");
  }, []);

  useEffect(() => {
    updateHeader();
  }, [location.pathname]);

  const handleSearchButton = (title) => {
    console.log(title);
    fetchMovies(title)
  };

    /*const handleHomePageButton = () => {
      setShowHomePage(false);
      setShowSignIn(true);
      setShowSignUp(true);
    }

    const handleSignInButton = () => {
      setShowHomePage(true);
      setShowSignIn(false);
      setShowSignUp(true);
    }

    const handleSignUpButton = () => {
      setShowHomePage(true);
      setShowSignIn(true);
      setShowSignUp(false);
    }*/

  return (
    <div className="App">
      <div className='headd'>
        <div className="header">
          <h1>Logo</h1>
          <h1 id='app-title'></h1>
          <div id="mainPageButtons">
            { showHomePage && (
              <span><Link to='/' className="btn btn-header">Home Page</Link></span>
            )}
            { showSignIn && (
              <span><Link to='signIn' className="btn btn-header">Sign In</Link></span>
            )}
            { showSignUp && (
              <span><Link to='signUp' className="btn btn-header">Sign Up</Link></span>
            )}
            { showLogOut && (
              <span><Link to='/' className="btn btn-header">Log Out</Link></span>
            )}
            { (location.state != null) && (
              <h3>{location.state.name}</h3>
            )}
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default App;
