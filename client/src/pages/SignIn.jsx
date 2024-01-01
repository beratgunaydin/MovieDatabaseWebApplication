import { useState } from 'react';
import '../styles/SignIn.css';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [newUser, setNewUser] = useState({username: '', password: ''});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleSignInFormSubmit = async (event) => {
        event.preventDefault();
        

        const response = await fetch ('http://localhost:5038/registerUser', {
            method:'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        });
        console.log(newUser);

        const data = await response.json();

        if (response.ok) {
            if(data.success) {
                setIsLoggedIn(true);
                alert(data.message);
                navigate("/homePage", {state: newUser});
            }
            else {
                alert(data.message);
                setNewUser({
                    username: '',
                    password: ''
                });
            }
        }
    };

    const handleOnChange = (event) => {
        const {name, value} = event.target;
        setNewUser({...newUser, [name]: value});
    };

    return (
        <div className="sign-in">
            <form className="sign-in-form" onSubmit={handleSignInFormSubmit}>
                <h1>Sign In</h1>
                <input type='text' name='username' placeholder="Username" onChange={handleOnChange} value={newUser.username} required/>
                <input type='password' name='password' placeholder="Password" onChange={handleOnChange} value={newUser.password} required/>
                <button type='submit' className='button-sign-in'>Sign In</button>
            </form>
        </div>
    );
}

export default SignIn;