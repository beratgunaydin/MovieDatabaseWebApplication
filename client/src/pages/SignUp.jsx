import '../styles/SignUp.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const SignUp = () => {
    const [user, setUser] = useState({username: '', password: ''});
    const [isLoginSuccesfull, setIsLoginSuccesfull] = useState(false); 
    const navigate = useNavigate();

    const handleSignInFormSubmit = async (event) => {
        event.preventDefault();
        

        const response = await fetch ('http://localhost:5038/loginUser', {
            method:'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        const data = await response.json();
        if(response.ok) {
            if(data.success) {
                setIsLoginSuccesfull(true);
                setUser(user);
                console.log(data.user);
                navigate('/homePage', {state: data.user})
                /*alert(data.message);*/
            } else {
                setUser({
                    username: '',
                    password: ''
                });
                alert(data.message);
            }
        }
    };

    const handleOnChange = (event) => {
        const {name, value} = event.target;
        setUser({...user, [name]: value});
    };

    return (
        <div className="sign-up">
            <form className="sign-up-form" onSubmit={handleSignInFormSubmit}>
                <h1>Sign Up</h1>
                <input type='text' name='username' placeholder="Username" onChange={handleOnChange} value={user.username} required/>
                <input type='password' name='password' placeholder="Password" onChange={handleOnChange} value={user.password} required/>
                <button type='submit' className='button-sign-up'>Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;