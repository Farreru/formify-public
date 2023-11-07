import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const DetailForm = () => {
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

    const handleLogout = () => {
        localStorage.removeItem("api_token");
        localStorage.removeItem("user_email");
        window.location.href = "/";
    };

    const navigate = useNavigate();
    const { formSlug } = useParams();
    const [formData, setFormData] = useState(null);

    document.title = "Formify - " + formSlug;

    const fetch_data = () => {
        const apiToken = localStorage.getItem("api_token");
        const headers = {
            Authorization: `Bearer ${apiToken}`,
        };

        fetch(`http://localhost:8000/api/v1/forms/${formSlug}`, { headers })
            .then((response) => {
                if (response.status === 403) {
                    throw new Error("Forbidden Access");
                }
                return response.json();
            })
            .then((data) => {
                // console.log(data);
                setFormData(data.form);
            })
            .catch((error) => {
                if (error.message === "Forbidden Access") {
                    window.location = "/forbidden";
                } else {
                    console.error("Error fetching form details:", error);
                }
            });
    };

    const [choiceType, setChoiceType] = useState("");

    const [newQuestion, setNewQuestion] = useState({
        name: "",
        choice_type: "",
        choices: choiceType,
        is_required: false,
    });

    const handleChoiceTypeChange = (event) => {
        const selectedChoiceType = event.target.value;
        setChoiceType(selectedChoiceType);

        // Update the choice_type field in newQuestion
        setNewQuestion((prevQuestion) => ({
            ...prevQuestion,
            choice_type: selectedChoiceType,
        }));
    };

    const handleSubmitRemoveQuestion = (questionId) => {
        const apiToken = localStorage.getItem("api_token");

        fetch(
            `http://localhost:8000/api/v1/forms/${formSlug}/questions/${questionId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiToken}`,
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "Remove question success") {
                    alertSuccess(data.message, () => fetch_data());
                } else {
                    alertFailed(data.message, () => fetch_data());
                }
            })
            .catch((error) => {
                console.log(data.message, error);
                // console.error('Error sending form data:', error);
                // Handle error or show a notification
            });
    };

    const handleSubmitNewQuestion = (event) => {
        event.preventDefault();

        const name = event.target.name.value;
        const required = event.target.required.checked;

        let newQuestionData = {
            name: name,
            choice_type: choiceType,
            is_required: required,
        };

        // Only include choices for specific choice types
        if (
            choiceType === "multiple choice" ||
            choiceType === "dropdown" ||
            choiceType === "checkboxes"
        ) {
            const choices = event.target.choices.value;
            newQuestionData.choices = choices
                .split(",")
                .map((choice) => choice.trim());
        } else {
            newQuestionData.choices = "";
        }

        // Rest of your code to send the request
        const apiToken = localStorage.getItem("api_token");

        console.log(newQuestion);
        console.log(newQuestionData);

        fetch(`http://localhost:8000/api/v1/forms/${formSlug}/questions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiToken}`,
            },
            body: JSON.stringify(newQuestionData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "Add question success") {
                    alertSuccess(data.message, () => fetch_data());
                } else {
                    alertFailed(data.message, () => fetch_data());
                }
            })
            .catch((error) => {
                // Handle error or show a notification
                console.log(error);
            });

        // Reset the form fields
        setNewQuestion({
            name: "",
            choice_type: "short answer",
            choices: "",
            is_required: false,
        });
        setChoiceType("short answer");
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        // For other input fields, handle changes as usual
        const newValue = type === "checkbox" ? checked : value;
        setNewQuestion((prevFormData) => ({
            ...prevFormData,
            [name]: newValue,
        }));
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

        setChoiceType("short answer");
        fetch_data(); // Call the fetch_data function here
    }, [formSlug]);

    // console.log(formData);
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
                        <h2 className="mb-2">{formData.name}</h2>
                        <div className="text-muted mb-4">
                            {formData.description}
                        </div>
                        <div>
                            <div>
                                <small>For user domains</small>
                            </div>
                            <small>
                                <span className="text-primary">
                                    {formData.allowed_domains
                                        .map((domain) => domain.domain)
                                        .join(", ")}
                                </span>
                            </small>
                        </div>
                    </div>
                </div>

                <div className="py-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-5 col-md-6">
                                <div className="input-group mb-5">
                                    <input
                                        type="text"
                                        className="form-control form-link"
                                        readOnly
                                        value={`http://localhost:5173/forms/${formData.slug}`}
                                    />
                                    <a
                                        target="_blank"
                                        href={`../${formData.slug}`}
                                        className="btn btn-primary"
                                    >
                                        Copy
                                    </a>
                                </div>

                                <ul className="nav nav-tabs mb-2 justify-content-center">
                                    <li className="nav-item">
                                        <a
                                            className="nav-link active"
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
                                            className="nav-link"
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

                                {formData.questions.map((question) => (
                                    <div
                                        key={question.id}
                                        className="question-item card card-default my-4"
                                    >
                                        <div className="card-body">
                                            <form>
                                                <div className="form-group my-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Question"
                                                        className="form-control"
                                                        name="name"
                                                        defaultValue={
                                                            question.name
                                                        }
                                                        readOnly
                                                        disabled
                                                    />
                                                </div>

                                                <div className="form-group my-3">
                                                    <select
                                                        name="choice_type"
                                                        className="form-select"
                                                        defaultValue={
                                                            question.choice_type
                                                        }
                                                        disabled
                                                    >
                                                        <option>
                                                            Choice Type
                                                        </option>
                                                        <option value="short answer">
                                                            Short Answer
                                                        </option>
                                                        <option value="paragraph">
                                                            Paragraph
                                                        </option>
                                                        <option value="date">
                                                            Date
                                                        </option>
                                                        <option value="multiple choice">
                                                            Multiple Choice
                                                        </option>
                                                        <option value="dropdown">
                                                            Dropdown
                                                        </option>
                                                        <option value="checkboxes">
                                                            Checkboxes
                                                        </option>
                                                    </select>
                                                </div>

                                                {/* Render choices based on question type */}
                                                {question.choice_type ===
                                                    "multiple choice" ||
                                                question.choice_type ===
                                                    "dropdown" ||
                                                question.choice_type ===
                                                    "checkboxes" ? (
                                                    <div className="form-group my-3">
                                                        <textarea
                                                            placeholder="Choices"
                                                            className="form-control"
                                                            name="choices"
                                                            rows="4"
                                                            defaultValue={
                                                                question.choices
                                                            }
                                                            disabled
                                                        />
                                                        <div className="form-text">
                                                            Separate choices
                                                            using comma ",".
                                                        </div>
                                                    </div>
                                                ) : null}

                                                <div
                                                    className="form-check form-switch"
                                                    aria-colspan="my-3"
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        role="switch"
                                                        disabled
                                                        id={`required-${question.id}`}
                                                        defaultChecked={
                                                            question.is_required ===
                                                            1
                                                        }
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor={`required-${question.id}`}
                                                    >
                                                        Required
                                                    </label>
                                                </div>
                                            </form>
                                            <div className="mt-3">
                                                <button
                                                    onClick={() =>
                                                        handleSubmitRemoveQuestion(
                                                            question.id
                                                        )
                                                    }
                                                    className="btn btn-outline-danger"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="question-item card card-default my-4">
                                    <div className="card-body">
                                        <form
                                            onSubmit={handleSubmitNewQuestion}
                                        >
                                            <div className="form-group my-3">
                                                <input
                                                    type="text"
                                                    placeholder="Question"
                                                    className="form-control"
                                                    name="name"
                                                    onChange={handleChange}
                                                    value={newQuestion.name}
                                                />
                                            </div>

                                            <div className="form-group my-3">
                                                <select
                                                    name="choice_type"
                                                    className="form-select"
                                                    defaultValue={
                                                        newQuestion.choice_type
                                                    }
                                                    onChange={
                                                        handleChoiceTypeChange
                                                    }
                                                >
                                                    <option value="short answer">
                                                        Short Answer
                                                    </option>
                                                    <option value="paragraph">
                                                        Paragraph
                                                    </option>
                                                    <option value="date">
                                                        Date
                                                    </option>
                                                    <option value="multiple choice">
                                                        Multiple Choice
                                                    </option>
                                                    <option value="dropdown">
                                                        Dropdown
                                                    </option>
                                                    <option value="checkboxes">
                                                        Checkboxes
                                                    </option>
                                                </select>
                                            </div>

                                            {(choiceType ===
                                                "multiple choice" ||
                                                choiceType === "dropdown" ||
                                                choiceType ===
                                                    "checkboxes") && (
                                                <div className="form-group my-3">
                                                    <textarea
                                                        placeholder="Choices"
                                                        className="form-control"
                                                        name="choices"
                                                        value={
                                                            newQuestion.choices
                                                        }
                                                        onChange={handleChange}
                                                        rows="4"
                                                    />
                                                    <div className="form-text">
                                                        Separate choices using
                                                        comma ",".
                                                    </div>
                                                </div>
                                            )}

                                            <div
                                                className="form-check form-switch"
                                                aria-colspan="my-3"
                                            >
                                                <input
                                                    className="form-check-input"
                                                    name="is_required"
                                                    type="checkbox"
                                                    role="switch"
                                                    checked={
                                                        newQuestion.required
                                                    }
                                                    onChange={handleChange}
                                                    id="required"
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="required"
                                                >
                                                    Required
                                                </label>
                                            </div>
                                            <div className="mt-3">
                                                <button
                                                    type="submit"
                                                    className="btn btn-outline-primary"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DetailForm;
