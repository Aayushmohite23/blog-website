
import { Route, Routes } from 'react-router-dom';
import './App.css';

import Layout from './Layouts/Layout';

import Indexpage from './Pages/Indexpage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import CreatePost from './Pages/CreatePost';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/'element={<Layout/>}>
          <Route index element={<Indexpage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          
        </Route>
        <Route path='/create' element={<CreatePost/>}/>
      </Routes>
    </UserContextProvider>
    
    
  );
}

export default App;
