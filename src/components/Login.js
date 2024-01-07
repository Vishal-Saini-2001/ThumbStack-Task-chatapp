import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';

function Login() {

    const navigate = useNavigate();
    const [loader,setLoader] = useState(false);

    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {

        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken) {
                if (decodedToken.exp * 1000 < Date.now()) {
                    localStorage.removeItem("token")
                }
                else {
                    navigate('/chat')
                }
            }
            else {
                localStorage.removeItem("token")
            }
        }

    }, [token]);

    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const handleFormChange = (e) => {

        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }


    const handleFormSubmit = async (e) => {
        setLoader(true)
        e.preventDefault();
        if (data.email && data.password) {
            const response = await fetch("http://localhost:8080/login", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const message = await response.json();
            alert(message.msg);
            setLoader(false);
            if (message.code === 1) {
                localStorage.setItem("token", message.token);
                navigate('/chat')
            }
            else {
                setLoader(false);
                return null
            }
        }
        else {
            setLoader(false);
            alert("Fill all details first");
        }
    }

    return (
        <>


            <div id="form">
                <div className="d-flex justify-content-center align-items-center">
                    <h1 className='m-4'>Login</h1>
                    <form onSubmit={handleFormSubmit}>
                        <label className='me-5' htmlFor="email">Email:</label>
                        <input onChange={handleFormChange} type="email" name="email" id="email" required placeholder='example@gmail.com' />
                        <br />
                        <label className='me-4 mt-3' htmlFor="password">Password:</label>
                        <input onChange={handleFormChange} type="password" name="password" id="password" required />
                        <br />
                        <button type='submit' className='btn btn-info fw-bold mt-4 fs-3'>Login</button>
                        {loader && <div className='loader'></div>}
                        <br />
                        <br />
                    </form>
                </div>
                <p className='fs-4'>Don't have an account?</p>
                <button onClick={() => navigate('/')} className='btn btn-primary w-75 p-1 fs-4'>SignUp first</button>
            </div>


        </>
    )
}

export default Login