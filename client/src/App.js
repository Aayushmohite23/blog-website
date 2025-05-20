import { Route, Routes } from 'react-router-dom';
import './App.css';

import Layout from './Layouts/Layout';

import Indexpage from './Pages/Indexpage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import CreatePost from './Pages/CreatePost';
import PostPage from './Pages/PostPage';
import EditPost from './Pages/EditPost'

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/'element={<Layout/>}>
          <Route index element={<Indexpage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/post/:id' element={<PostPage/>}/>
          <Route path='/edit/:id' element={<EditPost/>}/>
        </Route>
        <Route path='/create' element={<CreatePost/>}/>
        
      </Routes>
    </UserContextProvider>
    
    
  );
}

export default App;
