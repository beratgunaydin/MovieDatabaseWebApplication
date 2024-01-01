import "../styles/MovieAdd.css";


const MovieAdd = ({movie}) => {
    return (
        <div className="movie-ac">
            <img className="movie-image" src={movie.Poster} alt="Movie Poster"/>
            <div className="movie-content">
                <p className="movie-add-title">{movie.Title}</p>
                <p className="movie-add-year">{movie.Year}</p>
                <p className="movie-add-type">{movie.Type}</p>
            </div>
        </div>
    );
}

export default MovieAdd;