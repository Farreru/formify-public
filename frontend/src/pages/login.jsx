import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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

        fetch("http://localhost:8000/api/v1/auth/login", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (
                    data.message === "Login success" &&
                    data.user &&
                    data.user.accessToken
                ) {
                    // Save the token to localStorage
                    localStorage.setItem("api_token", data.user.accessToken);
                    localStorage.setItem("user_email", data.user.email);
                    // Redirect to /manage-forms
                    window.location.href = "/dashboard";
                } else {
                    // Handle login error if token is missing or message is not "Login success"
                    alert("Password or username is incorrect!");
                    console.error("Invalid response data:", data);
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
                                    <h3 className="mb-3">Login</h3>

                                    <form onSubmit={handleSubmit}>
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
                                                Login
                                            </button>
                                        </div>

                                        <div className="mt-2">
                                            <a href="../register"> Sign Up</a>
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

export default Login;
