import './App.css';
import Register from './components/Register';
import Chat from './components/Chat';
import Login from './components/Login';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Register/>}></Route>
        <Route exact path='/login' element={<Login/>}></Route>
        <Route exact path='/chat' element={<Chat/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
