import React from "react";
import firebase from "../../firebase";
import PostsView from '../../components/Posts/Posts'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home(props) {

  function Logout() {
    firebase.auth().signOut();
    toast.success('Has cerrado sesión !', {
      position: toast.POSITION.TOP_RIGHT
  });
  }
  

  return (
    <div className="App">
      <ToastContainer />
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">App</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#">Home</a>
              </li>
            </ul>
            {
              props.name ?
                <ul className="navbar-nav justify-content-end">
                  <li className="nav-item">
                    <a href="#" className="nav-link">Hi {props.name}!</a>
                  </li>
                  <li className="nav-item">
                    <a onClick={Logout} className="nav-link">Logout</a>
                  </li>
                </ul>
                :
                <ul className="navbar-nav justify-content-end">
                  <li className="nav-item">
                    <a href="/Login" className="nav-link">Log In</a>
                  </li>
                  <li className="nav-item">
                    <a href="/Signup" className="nav-link">Sign Up</a>
                  </li>
                </ul>
            }
          </div>
        </div>
      </nav>
      <PostsView name={props} />
    </div>
  )
}

export default Home