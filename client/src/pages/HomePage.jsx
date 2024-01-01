import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/HomePage.css';
import '../components/MovieCard.jsx';
import MovieCard from  '../components/MovieCard.jsx';

const API_URL = "http://www.omdbapi.com/?apikey=<YOUR_API_KEY>";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();


  const fetchMovies = async (title) => {
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();

    setMovies(data.Search);
  }

    useEffect(() => {
        fetchMovies("Spider");
    }, []);

    const handleSearchButton = (title) => {
      console.log(title);
      fetchMovies(title)
    };

    const handleFocus = () => {
      setIsFocused(true);
    }

    const handleBlur = () => {
      setIsFocused(false);
    }

    const handleMovieCardClick = (moviee) => {
      navigate("/movieDetailed", {state: moviee.imdbID});
    }

  return (
    <div className="App">
      <div className="headd">
        <div className='search-box'>
          <div className='search-input'>
              <input type='search' 
                  placeholder='Search Movie' 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
              />
              <button type='submit' 
                  className='btn btn-search' 
                  id='searchButton' 
                  style={isFocused ? {transform: 'scale(1.1)'}: {transform: 'scale(1)'}}
                  onClick={() => {searchTerm === "" ? handleSearchButton("Spider"): handleSearchButton(searchTerm)}}>
                    Search
              </button>
          </div>
        </div>
      </div>
      <div className='container'>
        {
          movies?.length > 0 ? (
          movies.map((moviee) => (
            <div className="movie" onClick={() => {handleMovieCardClick(moviee)}}><MovieCard movie = {moviee}/></div>
          ))) : (
          <div className="no-movie">
            <h1>No movies found</h1>
            <div className="no-movies-animation">...</div> 
          </div>)
        }
      </div>
    </div>
  );
}

export default HomePage;