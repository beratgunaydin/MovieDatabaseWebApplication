import { useState, useEffect } from "react";
import "../styles/HomePageLoggedIn.css";
import { useLocation} from "react-router-dom";
import MovieAdd from "../components/MovieAdd.jsx";
import MovieCard from "../components/MovieCard.jsx";

const API_URL = "http://www.omdbapi.com/?apikey=<YOUR_API_KEY>";

const HomePageLoggedIn = () => {
    const location = useLocation();
    //const movieLists = location.state.movieLists;
    const user_id = location.state.id;

    const [movieLists, setMovieLists] = useState([]); 
    const [movieIdList, setMovieIdList] = useState([]);
    const [movieList, setMovieList] = useState([]);

    const [searchTerm, setSearchTerm] = useState("Superman");
    const [searchedMovies, setSearchedMovies] = useState([]);

    const [moviesOfCreatedList, setMoviesOfCreatedList] = useState([]);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const [openCreateListModal, setOpenCreateListModal] = useState(false);
    const [openUpdateListModal, setOpenUpdateListModal] = useState(false);

    const [moviesOfUpdatedList, setMoviesOfUpdatedList] = useState([]);
    const [currentUList, setCurrentUList] = useState([]);

    useEffect(() => {
        const fetchListMovies = async () => {
            try {
                const fetchedMovies = await Promise.all(
                    movieIdList?.map(async (movieeId) => {
                        const response = await fetch(`${API_URL}&i=${movieeId}`);
                        const data = await response.json();
                        return data;
                    })
                );
                setMovieList(fetchedMovies);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }

        if (movieIdList.length > 0) {
            fetchListMovies();
        }
    }, [movieIdList]);

    useEffect(() => {
        const fetcMoviesLists = async () => {
            const response = await fetch(`http://localhost:5038/movieLists/${user_id}`, {
                method: 'get'
            });
            const data = await response.json();
            setMovieLists(data);
        }
        fetcMoviesLists();
    }, [movieLists]);

    useEffect(() => {
        const searchMovies = async () => {
            if (searchTerm === "") {
                setSearchTerm("Superman");
            }
    
            const response = await fetch(`${API_URL}&s=${searchTerm}`);
            const data = await response.json();
            setSearchedMovies(data.Search);
        };

        searchMovies();
    }, [searchTerm]);

    const handleGetMovieList = (movieeListt) => {
        setMovieIdList(movieeListt.list_movies);
        setCurrentUList(movieeListt);
    }
    
    const openModal = () => {
      setModalIsOpen(true);
    };
  
    const closeModal = () => {
      setModalIsOpen(false);
    };

    const closeCreateList = () => {
        setOpenCreateListModal(false);
    }

    const closeUpdateList = () => {
        setOpenUpdateListModal(false);
    }
  
    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };
  
    const handleFormSubmit = (e) => {
      e.preventDefault();
      setOpenCreateListModal(true);
      closeModal();
    };

    const handleCreateListOnChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleUpdateMovieListOnClick = (moviee) => {
        if(moviesOfUpdatedList.includes(moviee)) {
            const updatedList = moviesOfUpdatedList.filter(mv => mv !== moviee);
            setMoviesOfUpdatedList(updatedList);
        }
        else {
            setMoviesOfUpdatedList(prevList => [...prevList, moviee]);
        }
    }

    const handleResetButtonOnClick = () => {
        setMoviesOfCreatedList([]);
    }

    const handleUpdateResetButtonOnClick = () => {
        setMoviesOfUpdatedList([]);
    }

    const handleCreateMovieListOnClick = (moviee) => {
        if(moviesOfCreatedList.includes(moviee)) {
            const updatedList = moviesOfCreatedList.filter(mv => mv !== moviee);
            setMoviesOfCreatedList(updatedList);
        }
        else {
            setMoviesOfCreatedList(prevList => [...prevList, moviee]);
        }
    }

    const handleCreateButtonOnClick = async () => {
        setOpenCreateListModal(false);
        const moviesIdOfCreatedList = moviesOfCreatedList.map(movieIdOfCurrentMovie => movieIdOfCurrentMovie.imdbID);
        movieLists.push({list_id: movieLists.length + 1, list_name: inputValue, list_movies: moviesIdOfCreatedList});

        if (moviesOfCreatedList.length === 0) {
            setOpenCreateListModal(true);
            alert(`Add movies to ${inputValue} list, please.`);
        }
        else {
            const tempList = {id: user_id, list_name: inputValue, list_movies: moviesIdOfCreatedList};

            const response = await fetch('http://localhost:5038/createList', {
                method:'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(tempList)
            })

            const data = await response.json();
            setOpenCreateListModal(false);
        }
    }
    

    const handleDeleteListButtonOnClick = async (currentMovieList) => {
        const new_arr = movieLists.filter(movieee => movieee !== currentMovieList);
        setMovieLists(new_arr);

        const response = await fetch(`http://localhost:5038/deleteMovieList/${user_id}/${currentMovieList.list_id}`, {
            method:'delete'
        });
    }

    const fetchMoviesListFromIDs = async (movieIDs) => {
        try {
            const fetchedMovies = await Promise.all(
                movieIDs?.map(async (movieeId) => {
                    const response = await fetch(`${API_URL}&i=${movieeId}`);
                    const data = await response.json();
                    return data;
                })
            );
            setMoviesOfUpdatedList(fetchedMovies);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    const handleUpdateListButtonOnClick = (currentMovieList) => {
        fetchMoviesListFromIDs(currentMovieList.list_movies);
        setCurrentUList(currentMovieList);
        setOpenUpdateListModal(true);
    }

    const handleUpdateButtonOnClick = async () => {
        setOpenUpdateListModal(false);

        if (moviesOfUpdatedList.length === 0) {
            alert(`Add movie to ${moviesOfUpdatedList.list_name}, please`);
            setOpenUpdateListModal(true);
        }
        else {
            const userID = user_id;
            const listID = currentUList.list_id;
            const moviesIdsOfUpdatedList = moviesOfUpdatedList.map(currentUpdatedMovieList => currentUpdatedMovieList.imdbID);

            const userAndMovieList = {userID, listID, moviesIdsOfUpdatedList};

            const response = await fetch('http://localhost:5038/updateList', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userAndMovieList)
            })
        }
    }

    return (
        <div className="home-page-logged-in">
            <div className="nav-hpli">
                <div className="nav-title">
                    <div className="title-create-button">
                        <h2>Movie Lists</h2>
                        <button className="btn btn-header" onClick={openModal}>Create List</button>
                    </div>
                    {modalIsOpen && (
                        <div className="modal-background">
                          <div className="modal-content">
                            <div className="modal-header">
                                <span className="close" onClick={closeModal}>&times;</span>
                                <h3>Movie List Title</h3>
                            </div>
                            <form className="modal-form" onSubmit={handleFormSubmit}>
                              <input
                                className="title-input"
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                placeholder="Enter movie list title"
                                required
                              />
                              <button type="submit" className="btn btn-header">Create</button>
                            </form>
                          </div>
                        </div>
                    )}
                    {openCreateListModal && (
                        <div className="modal-background">
                            <div className="modal-content content-create-list">
                                <div className="modal-header">
                                    <span className="close" onClick={closeCreateList}>&times;</span>
                                    <h3>Choose movies for your list</h3>
                                    <input 
                                        type="search" 
                                        id="modal-search-movie-input"
                                        placeholder="Enter movie name"
                                        onChange={handleCreateListOnChange}
                                    />
                                </div>
                                <div id="modal-movie-list">
                                    {searchedMovies?.map((moviee) => (
                                        <div onClick={() => handleCreateMovieListOnClick(moviee)}>
                                            <MovieAdd movie={moviee}/>
                                        </div>   
                                    ))}
                                </div>
                                <div className="selected-movies-container">
                                    {moviesOfCreatedList?.map((moviee) => (
                                        <div className="selected-movie">
                                            <p>{moviee.Title}</p>
                                        </div>
                                    ))}
                                    <div>
                                        <button className="btn btn-header" onClick={handleResetButtonOnClick}>Reset</button>
                                        <button className="btn btn-header" onClick={handleCreateButtonOnClick}>Create</button>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    )}

                    {openUpdateListModal && (
                        <div className="modal-background">
                            <div className="modal-content content-create-list">
                                <div className="modal-header">
                                    <span className="close" onClick={closeUpdateList}>&times;</span>
                                    <h3>Update your list</h3>
                                    <input 
                                        type="search" 
                                        id="modal-search-movie-input"
                                        placeholder="Enter movie name"
                                        onChange={handleCreateListOnChange}
                                    />
                                </div>
                                <div id="modal-movie-list">
                                    {searchedMovies?.map((moviee) => (
                                        <div onClick={() => handleUpdateMovieListOnClick(moviee)}>
                                            <MovieAdd movie={moviee}/>
                                        </div>   
                                    ))}
                                </div>
                                <div className="selected-movies-container">
                                    {moviesOfUpdatedList?.map((moviee) => (
                                        <div className="selected-movie">
                                            <p>{moviee.Title}</p>
                                        </div>
                                    ))}
                                    <div>
                                        <button className="btn btn-header" onClick={handleUpdateResetButtonOnClick}>Reset</button>
                                        <button className="btn btn-header" onClick={handleUpdateButtonOnClick}>Update</button>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <ul>
                    {movieLists?.map ((movieeListt) => (
                        <div className= "horizontal-vertical-center height-14rem flex-row">
                            <li onClick={() => handleGetMovieList(movieeListt)}>{movieeListt.list_name}</li>
                            <div className="flex-column column-center height-full">
                                <button onClick={() => handleDeleteListButtonOnClick(movieeListt)} className="btn btn-header btn-red margin-zero">Delete List</button>
                                <button onClick={() => handleUpdateListButtonOnClick(movieeListt)} className="btn btn-header btn-green margin-zero">Update List</button>
                            </div>
                        </div>           
                    ))}
                </ul>
            </div>
            <div className="movie-container">
                { movieList?.map((moviee) => (
                    <div className="movie" key={moviee.imdbID}>
                        <MovieCard movie={moviee}/>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePageLoggedIn;