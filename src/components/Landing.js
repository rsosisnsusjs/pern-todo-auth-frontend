import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className='jumbotron mt-5'>
            <h1>Welcome to Todo List</h1>
            <p>Sign In and Building Your Todo List</p>
            <Link to='/login' className='btn btn-dark'>Login</Link>
            <Link to='/Register' className='btn btn-secondary ml-3'>Register</Link>
        </div>
    )
}

export default Landing;