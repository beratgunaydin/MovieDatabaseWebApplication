import "../styles/MovieInfo.css";

const MovieInfo = ({movie, property}) => {


    return (
        <>
            {
                property !== "N/A" ? (
                    <div className="content-div">
                        <h3 className="property-movie">{Object.keys(movie).find(key => movie[key] === property)}</h3>
                        <h3 className="value-movie">{property}</h3>
                    </div>
                ) : (
                    console.log("no property")
                )
            }
        </>
    );
}

export default MovieInfo;