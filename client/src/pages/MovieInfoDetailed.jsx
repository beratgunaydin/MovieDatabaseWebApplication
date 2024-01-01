import { useEffect, useState } from "react";
import { Await, useLocation } from "react-router-dom";
import "../styles/MovieInfoDetailed.css";

import MovieInfo from "../components/MovieInfo";

const API_URL = "http://www.omdbapi.com/?apikey=<YOUR_API_KEY>";

const MovieInfoDetailed = () => {
    const location = useLocation();
    const [movie, setMovie] = useState({});

    const fetchMovie = async() => {
        const response = await fetch(`${API_URL}&i=${location.state}&plot=full`);
        const data = await response.json();
        
        setMovie(data);
        console.log(movie);
    }

    useEffect(() => {
        fetchMovie();
        console.log(movie);
    }, []);

    return (
        <div className="movie-info-detailed">
            <div id="movie-poster-and-main-info">
                <img src={movie.Poster} alt="Movie Poster"/>
                <div className="content-div" id="title-div">
                    <h1 className="property-movie">Title </h1>
                    <h1 className="value-movie">{movie.Title}</h1>
                </div>
            </div>
            <MovieInfo movie={movie} property={movie.Rated}/>
            <MovieInfo movie={movie} property={movie.Released}/>
            <MovieInfo movie={movie} property={movie.Runtime}/>
            <MovieInfo movie={movie} property={movie.Genre}/>
            <MovieInfo movie={movie} property={movie.Director}/>
            <MovieInfo movie={movie} property={movie.Writer}/>
            <MovieInfo movie={movie} property={movie.Actors}/>
            <MovieInfo movie={movie} property={movie.Language}/>
            <MovieInfo movie={movie} property={movie.Country}/>
            <MovieInfo movie={movie} property={movie.Awards}/>
            <MovieInfo movie={movie} property={movie.Metascore}/>
            <MovieInfo movie={movie} property={movie.imdbRating}/>
            <MovieInfo movie={movie} property={movie.imdbVotes}/>
            <MovieInfo movie={movie} property={movie.Type}/>
            <MovieInfo movie={movie} property={movie.DVD}/>
            <MovieInfo movie={movie} property={movie.BoxOffice}/>
            <MovieInfo movie={movie} property={movie.Production}/>
            <MovieInfo movie={movie} property={movie.Website}/>
        </div>
    );
}
// Rating kısmı eklenecek
/*plot eklenecek*/

export default MovieInfoDetailed;