import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styles from './signup.module.css'
import firebase from '../../firebase';
import InputControl from '../InputControl/InputControl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    lastname: "",
    email: "",
    password: ""
  });

  function clearForm() {
    const inputsArray = Object.entries(values);
    const clearInputsArray = inputsArray.map(([key]) => [key, '']);
    const inputsJson = Object.fromEntries(clearInputsArray);

    setValues(inputsJson);
  }

  const handleSubmission = async (e) => {
    e.preventDefault();
    if (!values.name || !values.lastname || !values.email || !values.password) {
      toast.error('Debes de llenar los campos !', {
        position: toast.POSITION.TOP_RIGHT
    });
      return;
    }

    try {
      console.log(values);
      firebase.auth().createUserWithEmailAndPassword(values.email, values.password)

        .then((docRef) => {
          firebase.firestore().collection("Users").doc(docRef.user.uid).set({
            idUser: docRef.user.uid,
            name: values.name,
            lastname: values.lastname,
            email: values.email,
            password: values.password
          })
          firebase.auth().createUserWithEmailAndPassword(values.email, values.password);
          clearForm();
          toast.success('Te has registrado exitosamente !', {
            position: toast.POSITION.TOP_RIGHT
        });
        setTimeout(() => {
          navigate("/");
        }, 3000)
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
      <ToastContainer />
      <div className={styles.container}>
        <div className={styles.innerBox}>
        <div className="d-flex justify-content-start">
              <div className="p-2"><h1 className={styles.heading}>Regístrate</h1></div>
          </div>
          <InputControl label="Nombre" placeholder="Introduce tu nombre"
            onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
          />
          <InputControl label="Apellido" placeholder="Introduce tu apellido"
            onChange={(event) => setValues((prev) => ({ ...prev, lastname: event.target.value }))}
          />
          <InputControl label="Correo electrónico" placeholder="Introduce tu correo electrónico"
            onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
          />
          <InputControl label="Contraseña" placeholder="Introduce tu contraseña" type="password"
            onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
          />

          <div className={styles.footer}>
            <button className={styles.btnComponents} onClick={handleSubmission}>Registrarse</button>
            <p>
              Tienes una cuenta?{" "}
              <span>
                <Link to="/Login">Inicia sesión</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup