import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const ManageForms = () => {
    document.title = "Formify - Manage Forms";

    const navigate = useNavigate();
    const [forms, setForms] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem("api_token");
        localStorage.removeItem("user_email");
        window.location.href = "/";
    };

    useEffect(() => {
        if (!localStorage.getItem("api_token")) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "You need to login first!",
            });
            navigate(`../`);
        }

        // Fetch forms using Authorization header and bearer token
        const apiToken = localStorage.getItem("api_token");
        const headers = {
            Authorization: `Bearer ${apiToken}`,
        };

        fetch("http://localhost:8000/api/v1/forms/admin", { headers })
            .then((response) => response.json())
            .then((data) => {
                setForms(data.forms);
            })
            .catch((error) => {
                console.error("Error fetching forms:", error);
            });
    }, []);

    // console.log(formData);
    if (!forms) {
        return (
            <div>
                <div className="d-flex align-items-center justify-content-center vh-100">
                    <div
                        className="spinner-grow text-primary me-3"
                        role="status"
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div
                        className="spinner-grow text-primary me-3"
                        role="status"
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div
                        className="spinner-grow text-primary me-3"
                        role="status"
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        ); // Display loading indicator while fetching data
    }

    return (
        <main>
            <nav className="navbar navbar-expand-lg sticky-top bg-primary navbar-dark">
                <div className="container">
                    <a
                        className="navbar-brand"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("../dashboard")}
                    >
                        Formify
                    </a>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a
                                className="nav-link active"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate("../manage-forms")}
                            >
                                Administrator
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                onClick={handleLogout}
                                className="btn bg-white text-primary ms-4"
                            >
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="hero py-5 bg-light">
                <div className="container">
                    <a
                        onClick={() => navigate("../create-form")}
                        className="btn btn-primary"
                    >
                        Create Form
                    </a>
                </div>
            </div>

            <div className="list-form py-5">
                <div className="container">
                    <h6 className="mb-3">List Form</h6>

                    {forms.map((form) => (
                        <a
                            key={form.id}
                            // href={`detail-form/${form.slug}`}
                            className="card card-default mb-3"
                            onClick={() =>
                                navigate(`../detail-form/${form.slug}`)
                            }
                        >
                            <div className="card-body">
                                <h5
                                    className="mb-1"
                                    style={{ cursor: "pointer" }}
                                >
                                    {form.name}
                                </h5>
                                <small className="text-muted">
                                    @{form.slug} (limit for{" "}
                                    {form.limit_one_response} response)
                                </small>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default ManageForms;
