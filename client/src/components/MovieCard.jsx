import React from "react";
import "../styles/MovieCard.css";
import { useState, useEffect } from "react";

const MovieCard = ({movie}) => {
    return (
        <div className="movie">
            <div className="movie-card" style={{backgroundImage: `url(${movie.Poster})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
                <div className="movie-year">
                    <p>{movie.Year}</p>
                </div>
                <div className="movie-title">
                    <h3>{movie.Title}</h3>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;