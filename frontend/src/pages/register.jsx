import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    document.title = "Formify - Login";

    useEffect(() => {
        // Check if api_token exists in localStorage
        const apiToken = localStorage.getItem("api_token");
        if (apiToken) {
            // If api_token exists, redirect to /manage-forms
            window.location.href = "/manage-forms";
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("name", name);

        fetch("http://localhost:8000/api/v1/auth/register", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "Register success") {
                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: data.message,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location = "../";
                        }
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: data.message,
                    });
                }
            })

            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <main>
            <section className="login">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5 col-md-6">
                            <h1 className="text-center mb-4">Formify</h1>
                            <div className="card card-default">
                                <div className="card-body">
                                    <h3 className="mb-3">Sign Up</h3>

                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group my-3">
                                            <label
                                                htmlFor="name"
                                                className="mb-1 text-muted"
                                            >
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                className="form-control"
                                                autoFocus
                                            />
                                        </div>

                                        <div className="form-group my-3">
                                            <label
                                                htmlFor="email"
                                                className="mb-1 text-muted"
                                            >
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                className="form-control"
                                                autoFocus
                                            />
                                        </div>

                                        <div className="form-group my-3">
                                            <label
                                                htmlFor="password"
                                                className="mb-1 text-muted"
                                            >
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                            >
                                                Sign Up
                                            </button>
                                        </div>

                                        <div className="mt-2">
                                            <a href="../"> Sign in</a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Register;
