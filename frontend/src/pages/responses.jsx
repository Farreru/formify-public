import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const Responses = () => {
    const alertSuccess = (message, onOK) => {
        Swal.fire({
            icon: "success",
            title: "Success!",
            text: message,
        }).then((result) => {
            if (result.isConfirmed && typeof onOK === "function") {
                onOK();
            }
        });
    };

    const alertFailed = (message, onOK) => {
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: message,
        }).then((result) => {
            if (result.isConfirmed && typeof onOK === "function") {
                onOK();
            }
        });
    };

    const navigate = useNavigate();
    const { formSlug } = useParams();

    const [formData, setFormData] = React.useState(null);

    React.useEffect(() => {
        if (!localStorage.getItem("api_token")) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "You need to login first!",
            });
            navigate(`../`);
        }

        fetch_data();
    }, [formSlug]);

    const handleLogout = () => {
        localStorage.removeItem("api_token");
        localStorage.removeItem("user_email");
        window.location.href = "/";
    };

    const [formInfo, setFormInfo] = React.useState({
        name: "",
        description: "",
    });

    const fetch_data = () => {
        const apiToken = localStorage.getItem("api_token");
        const headers = {
            Authorization: `Bearer ${apiToken}`,
        };

        fetch(`http://localhost:8000/api/v1/forms/${formSlug}`, { headers })
            .then((response) => response.json())
            .then((data) => {
                // setFormInfo(data.form)
                if (data.message === "Form not found") {
                    alertFailed(data.message, () =>
                        navigate("../manage-forms")
                    );
                } else {
                    setFormInfo({
                        name: data.form.name,
                        description: data.form.description,
                    });
                }
                // console.log(formInfo);
            });

        fetch(`http://localhost:8000/api/v1/forms/${formSlug}/responses`, {
            headers,
        })
            .then((response) => {
                if (response.status === 403) {
                    throw new Error("Forbidden Access");
                }
                return response.json();
            })
            .then((data) => setFormData(data.responses))
            .catch((error) => {
                if (error.message === "Forbidden Access") {
                    window.location = "/forbidden";
                } else {
                    console.error("Error fetching form details:", error);
                }
            });
    };

    if (!formData) {
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
                    <div className="container text-center">
                        {formInfo.name && formInfo.description ? (
                            <>
                                <h2 className="mb-2">{formInfo.name}</h2>
                                <div className="text-muted mb-4">
                                    {formInfo.description}
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="mb-2">{`{Name}`}</h2>
                                <div className="text-muted mb-4">
                                    {`{Description}`}
                                </div>
                            </>
                        )}
                        <div>
                            <div>
                                <small>For user domains</small>
                            </div>
                            <small>
                                <span className="text-primary"></span>
                            </small>
                        </div>
                    </div>
                </div>

                <div className="py-5">
                    <div className="container">
                        <div className="row justify-content-center ">
                            <div className="col-lg-5 col-md-6">
                                <div className="input-group mb-5">
                                    <input
                                        type="text"
                                        className="form-control form-link"
                                        readOnly
                                        value={`http://localhost:5173/forms/${formSlug}`}
                                    />
                                    <a
                                        target="_blank"
                                        href={`../${formSlug}`}
                                        className="btn btn-primary"
                                    >
                                        Copy
                                    </a>
                                </div>

                                <ul className="nav nav-tabs mb-2 justify-content-center">
                                    <li className="nav-item">
                                        <a
                                            className="nav-link"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                navigate(
                                                    `../detail-form/${formSlug}`
                                                )
                                            }
                                        >
                                            Questions
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className="nav-link active"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                navigate(
                                                    `../forms/${formSlug}/responses`
                                                )
                                            }
                                        >
                                            Responses
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-lg-10">
                                {formData && (
                                    <table className="table mt-3">
                                        <caption>
                                            Total Responses: {formData.length}
                                        </caption>
                                        <thead>
                                            <tr className="text-muted">
                                                <th>User</th>
                                                {formData.length > 0 &&
                                                    Object.keys(
                                                        formData[0].answers
                                                    ).map((key, index) => (
                                                        <th key={index}>
                                                            {key}
                                                        </th>
                                                    ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.map((response, index) => (
                                                <tr key={index}>
                                                    <td className="text-primary">
                                                        <span>
                                                            {
                                                                response.user
                                                                    .email
                                                            }
                                                        </span>
                                                    </td>
                                                    {Object.values(
                                                        response.answers
                                                    ).map((value, index) => (
                                                        <td key={index}>
                                                            {value}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Responses;
