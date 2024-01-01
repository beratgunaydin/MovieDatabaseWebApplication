import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import SignIn from './pages/SignIn';
import HomePage from './pages/HomePage';
import SignUp from './pages/SignUp';
import HomePageLoggedIn from './pages/HomePageLoggedIn';
import MovieInfoDetailed from './pages/MovieInfoDetailed';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route path="signIn" element={<SignIn />} />
            <Route path='signUp' element={<SignUp />}/>
            <Route path='homePage' element={<HomePageLoggedIn />}/>
            <Route path='movieDetailed' element={<MovieInfoDetailed />}/>
          </Route>
        </Routes>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
