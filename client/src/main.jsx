import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './index.css';
import axios from 'axios';
import { UserProvider } from './context/UserContext.jsx';
axios.defaults.withCredentials = true;
import ProtectedRoute from './components/ProtectedRoute.jsx'
import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import Home from './pages/Home.jsx';
import MyPost from './pages/MyPost.jsx'
import AllPost from './pages/AllPost.jsx'
import CreateBlog from './pages/CreateBlog.jsx';
import Login from './pages/Login.jsx';
import GetStarted from './pages/GetStarted.jsx';
import Error from './pages/Error.jsx'
import EditBlog from './pages/EditBlog.jsx'
import BlogPage from './pages/BlogPage.jsx'
import MyProfile from './pages/MyProfile.jsx'
import Settings from './pages/Settings.jsx'
import EditProfile from './pages/EditProfile.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<MainLayout/>}>
        <Route path='/' element={<Home/>}/>
        <Route path='my-posts' element={
          <ProtectedRoute>
            <MyPost/>
          </ProtectedRoute>}/>
        <Route path='all-posts' element={
          <ProtectedRoute>
            <AllPost/>
          </ProtectedRoute>}/>
        <Route path='create' element={
          <ProtectedRoute>
            <CreateBlog/>
          </ProtectedRoute>}/>
        <Route path='edit' element={
          <ProtectedRoute>
            <EditBlog/>
          </ProtectedRoute>}/>
        <Route path='edit/:id' element={
          <ProtectedRoute>
            <CreateBlog/>
          </ProtectedRoute>}/>
        <Route path='blog/:id' element={
          <ProtectedRoute>
            <BlogPage/>
          </ProtectedRoute>}/>
        <Route path='/my-profile' element={
          <ProtectedRoute>
            <MyProfile/>
          </ProtectedRoute>}/>
        <Route path='/settings' element={
          <ProtectedRoute>
            <Settings/>
          </ProtectedRoute>}/>
        <Route path='/edit-profile' element={
          <ProtectedRoute>
            <EditProfile/>
          </ProtectedRoute>}/>
      </Route>

      <Route element={<AuthLayout/>}>
        <Route path='/get-started' element={<GetStarted/>} />
        <Route path='login' element={<Login/>}/>
      </Route>

      <Route path='*' element={<Error/>}/>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router}/>
    </UserProvider>
  </React.StrictMode>
);
