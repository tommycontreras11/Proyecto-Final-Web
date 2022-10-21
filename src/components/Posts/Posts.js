import { useEffect, useState } from "react";
import firebase from "../../firebase";
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTurnRight, faComment, faImage, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import styles from "./posts.module.css"
import { ref as sRef } from "firebase/storage";
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Posts() {
    const storage = getStorage();
    const [values, setValues] = useState({
        comentario: "",
        respuesta: ""
    });

    const [url, setUrl] = useState(null);
    const [image, setImage] = useState(null);
    const [posts, setPosts] = useState([]);
    const [reply, setReply] = useState([]);

    const archivoHandler = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const getData = async () => {
        const getPost = [];
        const db = firebase.firestore().collection("Posts").orderBy("createdAt", "asc")
            .onSnapshot((query) => {
                query.forEach((doc) => {
                    getPost.push({
                        ...doc.data(),
                        key: doc.idPosts,
                    });
                    setPosts(getPost);
                });
            });
        return () => db();
    };

    const getReply = async () => {
        const getReply = [];
        const db = firebase.firestore().collection("Reply").orderBy("createdAtReply", "asc")
            .onSnapshot((query) => {
                query.forEach((doc) => {
                    getReply.push({
                        ...doc.data(),
                        key: doc.idReply
                    });
                    setReply(getReply);
                });
            });
        return () => db();
    };

    function clearForm() {
        const inputsArray = Object.entries(values);
        const clearInputsArray = inputsArray.map(([key]) => [key, '']);
        const inputsJson = Object.fromEntries(clearInputsArray);

        setValues(inputsJson);

        setImage(null);
    }

    const handleSubmission = async (e) => {
        e.preventDefault();

        const user = firebase.auth().currentUser;

        if (user) {
            if (!values.comentario) {
                toast.error('Debes de llenar el campo de comentario !', {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {

                try {
                    let fullName = "";
                    await firebase.firestore().collection("Users").doc(user.uid).get()
                        .then((res) => {
                            fullName = res.data().name + " " + res.data().lastname;
                        })
                        .catch((error) => {
                            console.log(error);
                        })

                    let createdAt = moment().format("DD/MM/YYYY HH:mm:ss A");
                    if (image == null) {

                        const newCityRef = firebase.firestore().collection('Posts').doc();
                        newCityRef.set({
                            idPosts: newCityRef.id,
                            idUser: user.uid,
                            fullName: fullName,
                            image: "",
                            like: "0",
                            post: values.comentario,
                            createdAt: createdAt,
                        })
                            .then((docRef) => {
                                toast.success('La publicación ha sido guardada !', {
                                    position: toast.POSITION.TOP_RIGHT
                                });
                                clearForm();
                                getData();
                            })
                            .catch((error) => {
                                console.error("Error adding document: ", error);
                            });
                    } else {
                        const imageRef = sRef(storage, image.name);
                        uploadBytes(imageRef, image).then(() => {
                            getDownloadURL(imageRef)
                                .then((url) => {

                                    setUrl(url);
                                    const newCityRef = firebase.firestore().collection('Posts').doc();
                                    newCityRef.set({
                                        idPosts: newCityRef.id,
                                        idUser: user.uid,
                                        fullName: fullName,
                                        image: url,
                                        like: "0",
                                        post: values.comentario,
                                        createdAt: createdAt,
                                    })
                                        .then((docRef) => {
                                            toast.success('La publicación ha sido guardada !', {
                                                position: toast.POSITION.TOP_RIGHT
                                            });
                                            clearForm();
                                            getData();
                                        })
                                        .catch((error) => {
                                            console.error("Error adding document: ", error);
                                        });

                                }).catch((error) => {
                                    console.log(error.message, "error getting the image url");
                                })
                        }).catch((error) => {
                            console.log(error.message);
                        })
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            toast.error('Para poder publicar debes de tener una cuenta !', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const getByIdPost = async (idPost, idUser) => {
        const user = firebase.auth().currentUser;

        if (user) {
            if (!values.respuesta) {
                toast.error('Debes de llenar el campo de comentario !', {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                try {

                    let fullName = "";
                    await firebase.firestore().collection("Users").doc(user.uid).get()
                        .then((res) => {
                            fullName = res.data().name + " " + res.data().lastname;
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                    let fullNameReply = "";

                    let idUserReply = "";

                    await firebase.firestore().collection("Users").doc(idUser).get()
                        .then((res) => {
                            fullNameReply = res.data().name + " " + res.data().lastname;
                            idUserReply = res.data().idUser;
                        })
                        .catch((error) => {
                            console.log(error);
                        })

                    let createdAt = moment().format("DD/MM/YYYY HH:mm:ss A");
                    if (image == null) {

                        const newCityRef = firebase.firestore().collection('Reply').doc();
                        newCityRef.set({
                            idReply: newCityRef.id,
                            idPosts: idPost,
                            idUser: idUserReply,
                            fullName: fullName,
                            image: "",
                            like: "0",
                            idUserReply: user.uid,
                            fullNameReply: fullNameReply,
                            postReply: values.respuesta,
                            createdAtReply: createdAt,
                        })
                            .then((docRef) => {
                                toast.success('Comentario realizado satisfactoriamente !', {
                                    position: toast.POSITION.TOP_RIGHT
                                });
                                clearForm();
                                getReply();
                            })
                            .catch((error) => {
                                console.error("Error adding document: ", error);
                            });
                    } else {
                        const imageRef = sRef(storage, image.name);
                        uploadBytes(imageRef, image).then(() => {
                            getDownloadURL(imageRef)
                                .then((url) => {

                                    setUrl(url);
                                    const newCityRef = firebase.firestore().collection('Reply').doc();
                                    newCityRef.set({
                                        idReply: newCityRef.id,
                                        idPosts: idPost,
                                        idUser: idUserReply,
                                        fullName: fullName,
                                        image: url,
                                        like: "0",
                                        idUserReply: user.uid,
                                        fullNameReply: fullNameReply,
                                        postReply: values.respuesta,
                                        createdAtReply: createdAt,
                                    })
                                        .then((docRef) => {
                                            toast.success('Comentario realizado satisfactoriamente !', {
                                                position: toast.POSITION.TOP_RIGHT
                                            });
                                            clearForm();
                                            getReply();
                                        })
                                        .catch((error) => {
                                            console.error("Error adding document: ", error);
                                        });

                                }).catch((error) => {
                                    console.log(error.message, "error getting the image url");
                                })
                        }).catch((error) => {
                            console.log(error.message);
                        })
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            toast.error('Para poder comentar debes de tener una cuenta !', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    const getByIdPostLike = (async (id, tabla) => {
        const user = firebase.auth().currentUser;
        if (user) {
            try {

                if (tabla === "Posts") {
                    let like = 1;
                    await firebase.firestore().collection("Posts").doc(id).get()
                        .then((res) => {
                            like += parseInt(res.data().like);

                            firebase.firestore().collection("Posts").doc(id).update({
                                like: like
                            })
                                .then((res) => {
                                    toast.success('Le has dado me gusta a la publicación !', {
                                        position: toast.POSITION.TOP_RIGHT
                                    });
                                    getData();
                                })
                                .catch((error) => {
                                    console.log(error);
                                })
                        })
                        .catch((error) => {
                            alert(error);
                        })
                } else if (tabla === "Reply") {
                    let like = 1;
                    await firebase.firestore().collection("Reply").doc(id).get()
                        .then((res) => {
                            like += parseInt(res.data().like);

                            firebase.firestore().collection("Reply").doc(id).update({
                                like: like
                            })
                                .then((res) => {
                                    toast.success('Le has dado me gusta a la publicación !', {
                                        position: toast.POSITION.TOP_RIGHT
                                    });
                                    getReply();
                                })
                                .catch((error) => {
                                    console.log(error);
                                })
                        })
                        .catch((error) => {
                            alert(error);
                        })
                }

            } catch (error) {
                console.log(error);
            }

        } else {
            toast.error('Para poder dar like debes de tener una cuenta !', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    })

    useEffect(() => {
        getData();
        getReply();
    }, []);


    return (
        <div className="container" style={{marginTop: "15px"}}>
            <ToastContainer />
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card" style={{ backgroundColor: "#242526" }}>
                        <div className="card-header">
                            <div className="d-flex justify-content-start">
                                <label className={styles.file}>
                                    <input type="file" onChange={archivoHandler} style={{ display: "none" }} />
                                    <FontAwesomeIcon icon={faImage} style={{ color: "#58C472", marginRight: "6px" }} />
                                    Imagen
                                </label>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="col-md-12">
                                <textarea type="text" rows="4" onChange={(event) => setValues((prev) => ({ ...prev, comentario: event.target.value }))} value={values.comentario} className="form-control" style={{ backgroundColor: "#4E4F50", borderColor: "#242526", color: "#B8B3A6" }} id="exampleFormControlInput1" placeholder="name@example.com" />
                            </div>
                        </div>
                        <div className="card-footer text-muted">
                            <div className="d-grid gap-2 col-12 mx-auto">
                                <input type="button" onClick={handleSubmission} className="btn btn-primary" value="Publicar" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            {posts.length > 0 && (
                posts.map((post) =>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-6">
                                {post.image === "" ? (
                                    <div className="card" style={{ width: "18rem;", backgroundColor: "#242526" }}>
                                        <div className="card-header">
                                            <div className="row">
                                                <div className="d-flex justify-content-start">
                                                    <div className="p-2"><img src="img/person.png" className="card-img-top" width="50" height="50" alt="..." /></div>
                                                    <div className="p-2"><h5 className="card-title" style={{ color: "#E4E6EB", marginRight: "10px" }}>{post.fullName}</h5><label htmlFor="" style={{ color: "#B8B3A6" }}>{post.createdAt}</label></div>
                                                </div>
                                                <br />
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="col-md-12">
                                                <p className="card-text" style={{ color: "#E4E6EB" }}>{post.post}</p>
                                            </div>
                                        </div>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item" style={{ backgroundColor: "#242526" }}>
                                                <label htmlFor="" style={{ color: "white" }}><FontAwesomeIcon icon={faThumbsUp} /> {parseInt(post.like)}</label>
                                            </li>
                                            <li className="list-group-item" style={{ backgroundColor: "#242526" }}>
                                                <div className="d-flex justify-content-around">
                                                    <div className="p-2"><button className={styles.btnOpciones} onClick={() => getByIdPostLike(post.idPosts, "Posts")}><FontAwesomeIcon icon={faThumbsUp} /> Me gusta</button></div>
                                                    <div className="p-2">
                                                        <button className={styles.btnOpciones} data-bs-toggle="modal" data-bs-target={"#staticBackdrop" + post.idPosts}><FontAwesomeIcon icon={faComment} /> Comentar</button>
                                                        <div className="modal fade" id={"staticBackdrop" + post.idPosts} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                            <div className="modal-dialog modal-dialog-centered">
                                                                <div className="modal-content" style={{ backgroundColor: "#242526" }}>
                                                                    <div className="modal-header">
                                                                        <h1 className="modal-title fs-5" id="staticBackdropLabel" style={{ color: "white" }}>Realizar comentario</h1>
                                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" style={{ backgroundColor: "white" }} aria-label="Close"></button>
                                                                    </div>
                                                                    <div className="modal-body">
                                                                        <div className="d-flex justify-content-start">
                                                                            <label className={styles.file} style={{ marginBottom: "10px" }}>
                                                                                <input type="file" onChange={archivoHandler} style={{ display: "none" }} />
                                                                                <FontAwesomeIcon icon={faImage} style={{ color: "#58C472", marginRight: "6px" }} />
                                                                                Imagen
                                                                            </label>
                                                                        </div>
                                                                        <div className="col-md-12">
                                                                            <textarea type="text" rows="4" className="form-control" onChange={(event) => setValues((prev) => ({ ...prev, respuesta: event.target.value }))} id={"reply" + post.idPosts} style={{ backgroundColor: "#4E4F50", borderColor: "#242526", color: "#B8B3A6", height: "70px" }} placeholder="Escribe tu comentario" value={values.respuesta} />
                                                                        </div>
                                                                        <div className="d-grid gap-2 col-12 mx-auto">
                                                                            <button className="btn btn-primary" style={{ marginTop: "10px" }} onClick={() => getByIdPost(post.idPosts, post.idUser)}>Comentar</button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="modal-footer modal-dialog-scrollable">
                                                                        {reply.length > 0 && (
                                                                            reply.map((replys) =>
                                                                                replys.idPosts === post.idPosts &&
                                                                                <div className="col-md-12 d-flex justify-content-start">
                                                                                    <div className="col-md-12">
                                                                                        <div className="d-flex justify-content-start">
                                                                                            <div className="p-2"><img src="img/person.png" className="card-img-top" width="50" height="50" alt="..." /></div>
                                                                                            <div className="p-2"><h5 className="card-title" style={{ color: "#E4E6EB", marginRight: "10px" }}>{replys.fullName} <label htmlFor="" style={{ color: "#E4E6EB", marginLeft: "20px" }}><FontAwesomeIcon style={{ width: "15px", height: "15px" }} icon={faArrowTurnRight} /></label><label htmlFor="" style={{ color: "#E4E6EB", marginLeft: "20px" }}>{replys.fullNameReply}</label></h5><label htmlFor="" style={{ color: "#B8B3A6" }}>{replys.createdAtReply}</label></div>
                                                                                        </div>
                                                                                        {replys.image === "" ? (
                                                                                            <div className="col-md-12">
                                                                                                <textarea type="text" rows="4" className="form-control" id={"reply" + replys.idReply} style={{ backgroundColor: "#4E4F50", borderColor: "#242526", color: "#B8B3A6", height: "70px" }} value={replys.postReply} disabled />
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div className="col-md-12">
                                                                                                <textarea type="text" rows="4" className="form-control" id={"reply" + replys.idReply} style={{ backgroundColor: "#4E4F50", borderColor: "#242526", color: "#B8B3A6", height: "70px" }} value={replys.postReply} disabled />
                                                                                                <img src={replys.image} style={{ marginTop: "5px" }} className="card-img-top" alt="..." />
                                                                                            </div>
                                                                                        )}
                                                                                        <div className="col-md-12">
                                                                                            <div className="d-flex justify-content-between">
                                                                                                <div className="p-2"><button className={styles.btnlink} onClick={() => getByIdPostLike(replys.idReply, "Reply")}>Me gusta</button></div>
                                                                                                <label htmlFor="" style={{ color: "white", marginTop: "15px" }}><FontAwesomeIcon icon={faThumbsUp} /> {parseInt(replys.like)}</label>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="card" style={{ width: "18rem;", backgroundColor: "#242526" }}>
                                        <div className="card-header">
                                            <div className="row">
                                                <div className="d-flex justify-content-start">
                                                    <div className="p-2"><img src="img/person.png" className="card-img-top" width="50" height="50" alt="..." /></div>
                                                    <div className="p-2"><h5 className="card-title" style={{ color: "#E4E6EB", marginRight: "10px" }}>{post.fullName} </h5><label htmlFor="" style={{ color: "#B8B3A6" }}>{post.createdAt}</label></div>
                                                </div>
                                                <br />
                                                <p className="card-text" style={{ color: "#E4E6EB" }}>{post.post}</p>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="col-md-12">
                                                <img src={post.image} className="card-img-top" alt="..." />
                                            </div>
                                        </div>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item" style={{ backgroundColor: "#242526" }}>
                                                <label htmlFor="" style={{ color: "white" }}><FontAwesomeIcon icon={faThumbsUp} /> {parseInt(post.like)}</label>
                                            </li>
                                            <li className="list-group-item" style={{ backgroundColor: "#242526" }}>
                                                <div className="d-flex justify-content-around">
                                                    <div className="p-2"><button className={styles.btnOpciones} onClick={() => getByIdPostLike(post.idPosts, "Posts")}><FontAwesomeIcon icon={faThumbsUp} /> Me gusta</button></div>
                                                    <div className="p-2">
                                                        <button className={styles.btnOpciones} data-bs-toggle="modal" data-bs-target={"#staticBackdrop" + post.idPosts}><FontAwesomeIcon icon={faComment} /> Comentar</button>
                                                        <div className="modal fade" id={"staticBackdrop" + post.idPosts} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                            <div className="modal-dialog modal-dialog-centered">
                                                                <div className="modal-content" style={{ backgroundColor: "#242526" }}>
                                                                    <div className="modal-header">
                                                                        <h1 className="modal-title fs-5" id="staticBackdropLabel" style={{ color: "white" }}>Realizar comentario</h1>
                                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" style={{ backgroundColor: "white" }} aria-label="Close"></button>
                                                                    </div>
                                                                    <div className="modal-body">
                                                                        <div className="d-flex justify-content-start">
                                                                            <label className={styles.file} style={{ marginBottom: "10px" }}>
                                                                                <input type="file" onChange={archivoHandler} style={{ display: "none" }} />
                                                                                <FontAwesomeIcon icon={faImage} style={{ color: "#58C472", marginRight: "6px" }} />
                                                                                Imagen
                                                                            </label>
                                                                        </div>
                                                                        <div className="col-md-12">
                                                                            <textarea type="text" rows="4" className="form-control" onChange={(event) => setValues((prev) => ({ ...prev, respuesta: event.target.value }))} id={"reply" + post.idPosts} style={{ backgroundColor: "#4E4F50", borderColor: "#242526", color: "#B8B3A6", height: "70px" }} placeholder="Escribe tu comentario" value={values.respuesta} />
                                                                        </div>
                                                                        <div className="d-grid gap-2 col-12 mx-auto">
                                                                            <button className="btn btn-primary" style={{ marginTop: "10px" }} onClick={() => getByIdPost(post.idPosts, post.idUser)}>Comentar</button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="modal-footer modal-dialog-scrollable">
                                                                        {reply.length > 0 && (
                                                                            reply.map((replys) =>
                                                                                replys.idPosts === post.idPosts &&
                                                                                <div className="col-md-12 d-flex justify-content-start">
                                                                                    <div className="col-md-12">
                                                                                        <div className="d-flex justify-content-start">
                                                                                            <div className="p-2"><img src="img/person.png" className="card-img-top" width="50" height="50" alt="..." /></div>
                                                                                            <div className="p-2"><h5 className="card-title" style={{ color: "#E4E6EB", marginRight: "10px" }}>{replys.fullName} <label htmlFor="" style={{ color: "#E4E6EB", marginLeft: "20px" }}><FontAwesomeIcon style={{ width: "15px", height: "15px" }} icon={faArrowTurnRight} /></label><label htmlFor="" style={{ color: "#E4E6EB", marginLeft: "20px" }}>{replys.fullNameReply}</label></h5><label htmlFor="" style={{ color: "#B8B3A6" }}>{replys.createdAtReply}</label></div>
                                                                                        </div>
                                                                                        {replys.image === "" ? (
                                                                                            <div className="col-md-12">
                                                                                                <textarea type="text" rows="4" className="form-control" id={"reply" + replys.idReply} style={{ backgroundColor: "#4E4F50", borderColor: "#242526", color: "#B8B3A6", height: "70px" }} value={replys.postReply} disabled />
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div className="col-md-12">
                                                                                                <textarea type="text" rows="4" className="form-control" id={"reply" + replys.idReply} style={{ backgroundColor: "#4E4F50", borderColor: "#242526", color: "#B8B3A6", height: "70px" }} value={replys.postReply} disabled />
                                                                                                <img src={replys.image} style={{ marginTop: "5px" }} className="card-img-top" alt="..." />
                                                                                            </div>
                                                                                        )}
                                                                                        <div className="col-md-12">
                                                                                            <div className="d-flex justify-content-between">
                                                                                                <div className="p-2"><button className={styles.btnlink} onClick={() => getByIdPostLike(replys.idReply, "Reply")}>Me gusta</button></div>
                                                                                                <label htmlFor="" style={{ color: "white", marginTop: "15px" }}><FontAwesomeIcon icon={faThumbsUp} /> {parseInt(replys.like)}</label>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                )
                                }
                            </div>
                        </div><br />
                    </div>
                )
            )}
        </div>
    )

}


export default Posts