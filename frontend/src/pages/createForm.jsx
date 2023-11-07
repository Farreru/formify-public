import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CreateForm = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!localStorage.getItem("api_token")) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "You need to login first!",
            });
            navigate(`../`);
        }
    });

    const alertSuccess = (message) => {
        Swal.fire({
            icon: "success",
            title: "Success!",
            text: message,
        });
    };

    const alertFailed = (message) => {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: message,
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("api_token");
        localStorage.removeItem("user_email");
        window.location.href = "/";
    };

    document.title = "Formify - " + "Create Form";

    const [formData, setFormData] = React.useState({
        name: "",
        slug: "",
        description: "",
        allowed_domains: "",
        limit_one_response: false,
    });

    const handleSubmit = (event) => {
        var allow_domain = formData.allowed_domains.split(",");
        formData.allowed_domains = allow_domain;

        event.preventDefault();
        // Here you can perform actions with the form data, such as sending it to a server
        // console.log('Form data submitted:', formData);
        // Reset the form data
        setFormData({
            name: "",
            slug: "",
            description: "",
            allowed_domains: "",
            limit_one_response: false,
        });
        // console.log((formData));

        const apiToken = localStorage.getItem("api_token");

        fetch("http://localhost:8000/api/v1/forms", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiToken}`,
                // Add your authorization header if needed
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log('Response from server:', data);
                if (data.message === "Create form success") {
                    alertSuccess(data.message);
                    navigate(`../detail-form/${formData.slug}`);
                } else {
                    alertFailed(data.message);
                }
                // Handle success or any other logic here
            })
            .catch((error) => {
                // console.error('Error sending form data:', error);
                console.log(error);
                // Handle error or show a notification
            });
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        // For other input fields, handle changes as usual
        const newValue = type === "checkbox" ? checked : value;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: newValue,
        }));
    };

    return (
        <div>
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

            <main>
                <div className="hero py-5 bg-light">
                    <div className="container">
                        <h2>Create Form</h2>
                    </div>
                </div>

                <div className="py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 col-lg-4">
                                <form onSubmit={handleSubmit}>
                                    {/* Form Name */}
                                    <div className="form-group mb-3">
                                        <label
                                            htmlFor="name"
                                            className="mb-1 text-muted"
                                        >
                                            Form Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            className="form-control"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            autoFocus
                                        />
                                    </div>

                                    {/* Form Slug */}
                                    <div className="form-group my-3">
                                        <label
                                            htmlFor="slug"
                                            className="mb-1 text-muted"
                                        >
                                            Form Slug
                                        </label>
                                        <input
                                            type="text"
                                            id="slug"
                                            name="slug"
                                            className="form-control"
                                            value={formData.slug}
                                            required
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="form-group my-3">
                                        <label
                                            htmlFor="description"
                                            className="mb-1 text-muted"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows="4"
                                            className="form-control"
                                            value={formData.description}
                                            required
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                    {/* Allowed Domains */}
                                    <div className="form-group my-3">
                                        <label
                                            htmlFor="allowed-domains"
                                            className="mb-1 text-muted"
                                        >
                                            Allowed Domains
                                        </label>
                                        <input
                                            type="text"
                                            id="allowed-domains"
                                            name="allowed_domains"
                                            className="form-control"
                                            value={formData.allowed_domains}
                                            onChange={handleChange}
                                        />
                                        <div className="form-text">
                                            Separate domains using comma ",".
                                            Ignore for public access.
                                        </div>
                                    </div>

                                    {/* Limit to 1 response */}
                                    <div
                                        className="form-check form-switch"
                                        aria-colspan="my-3"
                                    >
                                        <input
                                            type="checkbox"
                                            id="limit_one_response"
                                            name="limit_one_response"
                                            className="form-check-input"
                                            role="switch"
                                            checked={
                                                formData.limit_one_response
                                            }
                                            onChange={handleChange}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="limit_one_response"
                                        >
                                            Limit to 1 response
                                        </label>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateForm;
