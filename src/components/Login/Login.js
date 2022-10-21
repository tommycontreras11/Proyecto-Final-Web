import React, { useState } from 'react';
import firebase from '../../firebase'
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import InputControl from '../InputControl/InputControl';
import styles from './login.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: ""
  });

  const handleSubmission = async (e) => {
    e.preventDefault();

    if (!values.email || !values.password) {
      toast.error('Debes de llenar los campos !', {
        position: toast.POSITION.TOP_RIGHT
    });
      return
    }
    try {
      firebase.auth().signInWithEmailAndPassword(values.email, values.password)
      .then((res) => {

          toast.success('Has iniciado sesión !', {
            position: toast.POSITION.TOP_RIGHT
          });
          setTimeout(() => {
            navigate("/");
          }, 3000)
                    
        }).catch((e) => {
          toast.error('Usuario y/o password incorrectos !', {
            position: toast.POSITION.TOP_RIGHT
        });
        })
    } catch (error) {
      console.log("Ha ocurrido un error: " + error.message);
    }
  }

  return (
    <div className="App">
      <ToastContainer />
      <div className={styles.container}>
        <div className={styles.innerBox}>
          <div className="d-flex justify-content-start">
              <div className="p-2"><h1 className={styles.heading}>Inicia</h1></div>
              <div className="p-2"><h1 style={{color: "#9900ff"}}>Sesión</h1></div>
          </div>
          <InputControl label="Email" placeholder="Introduce tu correo electrónico"
            onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
          />
          <InputControl label="Contraseña" placeholder="Introduce tu contraseña" type="password"
            onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
          />

          <div className={styles.footer}>
            <button className={styles.btnComponents} onClick={handleSubmission}>Iniciar sesión</button>
            <p>
              No tienes una cuenta?{" "}
              <span>
                <Link to="/Signup">Regístrate</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login