import './css/Chat.css'
import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
const socket = io('http://localhost:8080');


function Chat() {

  const [token,setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [userSet, setUserSet] = useState(false);
  const [username, setUsername] = useState("");



  useEffect(() => {

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          socket.emit("logout", username);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUsername("");
          alert("Your Session is expired please login again!!");
          navigate('/login');
        }

      } catch (error) {
        console.log(error)
      }

    }
    else {
      alert("Your Session is expired please login again!!");
      navigate('/login');
    }


    if(localStorage.getItem("user"))
    {
      setUserSet(true);
      setUsername(localStorage.getItem("user"))
    }

    if(messages.length >= 5){
      const scrollMessages = document.getElementById("chats");
      scrollMessages.scrollTop = scrollMessages.scrollHeight;
    }

    socket.on("activeUsers", (users) => {
      setActiveUsers(users)
    });

    socket.on("receivedMessage", (messData) => {
      setMessages([...messages, messData]);
    })

    socket.on("loggedOut", (users) => {
      setActiveUsers(users)
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate('/login')
    })


  }, [token, messages, activeUsers]);


  const handleSendMessage = (e) => {
    e.preventDefault();
    const messageData = {
      msg: message,
      user: username,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
    }
    socket.emit("sendMessage", messageData);
    setMessage("")
  }

  const handleStartChat = (e) => {
    e.preventDefault();
    console.log(activeUsers)
    setUserSet(true);
    socket.emit("login", username);
    localStorage.setItem("user",username);
  }

  const handleLogOut = () => {
    socket.emit("logout", username);
  }

  return (
    <>

    {

    }

      {!userSet ?
        <div id="getUserName" className='bg-secondary w-100'>
          <center><h1 className='text-dark fw-bold fs-1 mx-3'>Welcome to ChatApp :-)</h1></center>
          <form onSubmit={handleStartChat}>
            <input type="text" required onChange={(e) => setUsername(e.target.value)} placeholder="user123"/>
            <button className="btn btn-dark ms-2 fs-5" type='submit'>Start Chat</button>
          </form>
        </div>
        :
        <>
          <button onClick={() => handleLogOut()} className='btn btn-danger mt-2 ms-5'>Log Out</button>
          <div id='chatting'>

            <div id="active-users" className='scrollbar'>
              <p>Active Chatters</p>
              
                {
                  activeUsers.map((user, i) => {
                    return (
                      <div className='border-top p-2' key={i}>{user}  <span className='text-success'>{message && "typing..."}</span></div>
                    )
                  })
                }
              
            </div>

            <div id="active-chatting">
              <div id="chats" className='scrollbar'>
                {

                  messages.map((m, i) => {
                    return (

                      <div key={i} className={`chat-container ${username === m.user?"float-end":"float-start"}`}>
                        <div className="message">
                          <span className="username">{m.user}:</span>
                          <span>{m.msg}</span>
                          <div className="timestamp">{m.time}</div>
                        </div>
                      </div>

                    )

                  })

                }
              </div>
              <form onSubmit={handleSendMessage} id='send-messages'>
                <input type="text" value={message} id="input-message" required onChange={(e) => setMessage(e.target.value)} placeholder='Enter your message' />
                <button className="send-buttons" type='submit'>Send</button>
              </form>
            </div>
          </div>
        </>
      }

    </>

  )
}

export default Chat