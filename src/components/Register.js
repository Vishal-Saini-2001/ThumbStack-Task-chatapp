import React, { useState } from 'react';
import './css/Register.css'
import { useNavigate } from 'react-router-dom'

function Register() {
    const navigate = useNavigate();
    const [loader,setLoader] = useState(false);

    const [passwordError, setPasswordError] = useState(true);
    const [data, setData] = useState({
        email: "",
        password: ""
    })




    const handleFormChange = (e) => {
        if (e.target.name === "password") {
            if (e.target.value.length < 8) {
                setPasswordError(false)
            }
            else {
                setPasswordError(true)
            }
        }

        setData({
            ...data,
            [e.target.name]: e.target.value
        })


    }

    const handleFormSubmit = async (e) => {
        setLoader(true)
        e.preventDefault();
        if (data.email && data.password) {
            const response = await fetch("https://chatapp-lx3p.onrender.com/savedata", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const message = await response.json();
            alert(message.msg);
            setLoader(false)
            if (message.code) {
                navigate('/login')
            }
            else {
                setLoader(false)
                return null
            }
        }
        else {
            setLoader(false)
            alert("Fill all details first");
        }
    }
    return (
        <>
            <div id="form">
                <div className="d-flex justify-content-center align-items-center">
                    <h1 className='m-4'>SignUp</h1>
                    <form onSubmit={handleFormSubmit}>
                        <label className='me-5' htmlFor="email">Email:</label>
                        <input onChange={handleFormChange} type="email" name="email" id="email" required placeholder='example@gmail.com' />
                        <br />
                        <label className='me-4 mt-3' htmlFor="password">Password:</label>
                        <input onChange={handleFormChange} type="password" name="password" id="password" required />
                        <span hidden={passwordError} className='text-danger fs-6'>!Minimum length: 8</span>
                        <br />
                        <button type='submit' className='btn btn-info fw-bold mt-4 fs-4'>SignUp</button>
                        {loader && <div className="loader"></div>}
                        <br />
                        <br />
                    </form>
                </div>
                <p className='fs-5'>Already have an account?</p>
                <button onClick={()=>navigate('/login')} className='btn btn-primary w-100 fs-3 p-1'>Login</button>
            </div>

        </>
    )
}

export default Register
