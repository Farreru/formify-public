import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Forms = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const { formSlug } = useParams();
  const [selectedValues, setSelectedValues] = useState({});
  const [questionNames, setQuestionNames] = useState({});

  // For dropdown (select) elements
const handleSelectChange = (event) => {
  const questionId = event.target.id.split('-')[1];
  const questionName = questionNames[questionId];
  const selectedValue = event.target.value;
  // console.log(selectedValue);
  event.target.checked = true;
  setQuestionNames((prev) => ({
    ...prev,
    [questionName] : questionName
  }))

  setSelectedValues(prevValues => ({
    ...prevValues,
    [questionId]: selectedValue
  }));
};

// For radio buttons
const handleRadioChange = (event) => {
  const questionId = event.target.name.split('-')[1];
  const questionName = questionNames[questionId];
  const selectedValue = event.target.value;
  // console.log(selectedValue);
  event.target.checked = true;
  setQuestionNames((prev) => ({
    ...prev,
    [questionName] : questionName
  }))

  setSelectedValues(prevValues => ({
    ...prevValues,
    [questionId]: selectedValue
  }));
};

// For checkboxes
const handleCheckboxChange = (event) => {
  const questionId = event.target.name.split('-')[1];
  const questionName = questionNames[questionId];
  const selectedValue = event.target.value;
  // console.log(selectedValue);
  event.target.checked = true;
  setQuestionNames((prev) => ({
    ...prev,
    [questionName] : questionName
  }))

  setSelectedValues(prevValues => ({
    ...prevValues,
    [questionId]: {
      ...prevValues[questionId],
      [selectedValue]: event.target.checked
    }
  }));
};


  document.title = 'Formify (' + formSlug + ')';

  const fetch_data = () => {
    // Fetch the form data from your API
    const apiToken = localStorage.getItem('api_token');
    const headers = {
      Authorization: `Bearer ${apiToken}`,
    };

    fetch(`http://localhost:8000/api/v1/forms/${formSlug}`, { headers })
      .then((response) => {
        if(response.status === 403){
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Your not allowed to open this form!'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location = '../dashboard';
            }
          });
        }else{
          return response.json();
        }
        
      })
      .then((data) => {
        setForm(data.form);
        const namesById = {};
        data.form.questions.forEach(question => {
          namesById[question.id] = question.name;
        });
        setQuestionNames(namesById);
      })
      .catch((error) => {
        console.error('Error fetching form details:', error);
      });

  }
  useEffect(() => {

    if(!localStorage.getItem('api_token')){
   
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'You need to login first!'
        })
        navigate(`../`);     
      
    }

    fetch_data();
    // console.log(form.questions)
    // console.log(form.questions);
  }, [formSlug]);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    let hasError = false;
    const formData = {
      answers: []
    };
  
    form.questions.forEach((question) => {
      const inputElement = document.getElementById(`question-${question.id}`);
      
      if (inputElement) {
        let inputValue;
    
        if (inputElement.type === 'checkbox') {
          inputValue = inputElement.checked;
        } else if (inputElement.type === 'radio') {
          inputValue = inputElement.checked ? inputElement.value : null;
        } else {
          inputValue = inputElement.value;
        }
    
        // Handle select elements separately
        if (inputElement.tagName === 'SELECT') {
          inputValue = selectedValues[question.id] || '';
        }
    
    
        if (question.is_required && (
          (inputElement.type === 'checkbox' && !inputValue) ||
          (inputElement.type === 'radio' && inputValue === null) ||
          (inputElement.type !== 'checkbox' && inputElement.type !== 'radio' && inputValue.trim() === '')
        )) {
          hasError = true;
          inputElement.classList.add('is-invalid');
        } else {
          inputElement.classList.remove('is-invalid');
        }

        formData.answers.push({
          question_id: question.id,
          value: inputValue
        });
      }
    
      if (question.choice_type === 'multiple choice' || question.choice_type === 'checkboxes') {
        const selectedChoices = [];
      
        question.choices.split(',').forEach((choice, index) => {
          const choicesElement = document.getElementById(`question-${question.id}-choice-${index}`);
      
          if (choicesElement && choicesElement.checked === true) {
            selectedChoices.push(choice);
          }
        });
      
        const selectedChoicesString = selectedChoices.join(', '); // Join selected choices into a string
      
        formData.answers.push({
          question_id: question.id,
          value: selectedChoicesString
        });

      }
      
        

      
    });
    
  
    if (!hasError) {
      // If there are no validation errors, you can proceed with form submission
      // You can access the formData object that contains user inputs
      
      // console.log('Form data:', formData);
      // console.log('FormSlug : ', formSlug);
      // console.log(formData);
      const apiToken = localStorage.getItem('api_token');
      fetch(`http://localhost:8000/api/v1/forms/${formSlug}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
          // Add your authorization header if needed
        },
        body: JSON.stringify(formData),
      })
      .then((response)=> response.json())
      .then((data) => {
        if(data.message === "Submit response success"){
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: data.message
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.message
          });
        }
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields.'
      });
    }
  };
  
  
    
   
  

  if (!form) {
    return <div >
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-grow text-primary me-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-primary me-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="spinner-grow text-primary me-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>; // Display loading indicator while fetching data
  }

  return (
    <main>
        <>
          <div className="hero py-5 bg-light">
            <div className="container text-center">
              <h2 className="mb-3">{form.name}</h2>
              <div className="text-muted">{form.description}</div>
            </div>
          </div>

          <div className="py-5">
            <div className="container">
              <div className="row justify-content-center ">
                <div className="col-lg-5 col-md-6">
                <div className="text-muted">
                {localStorage.getItem('user_email') ? (
                  <span className="text-primary">{localStorage.getItem('user_email')}</span>
                ) : (
                  <span className="text-primary">{`{Name}`}</span>
                )}
                <small>
                  <i> (shared)</i>
                </small>
              </div>
                  {form.questions.map((question) => (
                    <div key={question.id} className="form-item card card-default my-4">
                      <div className="card-body">
                        <div className="form-group">
                          <label htmlFor={`question-${question.id}`} className="mb-1 text-muted">
                            {question.name} {question.is_required ? <span className="text-danger">*required</span> : ''}
                          </label>
                          {question.choice_type === 'short answer' && (
                            <input
                              id={`question-${question.id}`}
                              type="text"
                              placeholder="Your answer"
                              className="form-control"
                              name={`question-${question.id}`}
                            />
                          )}
                          {question.choice_type === 'date' && (
                            <input
                              id={`question-${question.id}`}
                              type="date"
                              className="form-control"
                              name={`question-${question.id}`}
                            />
                          )}
                          
                          {question.choice_type === 'paragraph' && (
                            <textarea
                              id={`question-${question.id}`}
                              rows="8"
                              placeholder="Your answer"
                              className="form-control"
                              name={`question-${question.id}`}
                            ></textarea>
                          )}

                          {question.choice_type === 'dropdown' && (
                            <select
                              id={`question-${question.id}`}
                              className="form-select"
                              name={`question-${question.id}`}
                              onChange={handleSelectChange}
                              value={selectedValues[question.id] || ''}
                              required={question.is_required}
                            >
                              <option value="" disabled>Select an option</option>
                              {question.choices.split(',').map((choice, index) => (
                                <option key={index} value={choice}>
                                  {choice}
                                </option>
                              ))}
                            </select>
                          )}

                          {question.choice_type === 'multiple choice' && (
                            <div>
                              {question.choices.split(',').map((choice, index) => (
                                <div className="form-check" key={index}>
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    value={choice}
                                    id={`question-${question.id}-choice-${index}`}
                                    name={`question-${question.id}`}
                                    onChange={handleRadioChange}
                                    checked={selectedValues[question.id] === choice}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`question-${question.id}-choice-${index}`}
                                  >
                                    {choice}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}

                          {question.choice_type === 'checkboxes' && (
                            <div>
                              {question.choices.split(',').map((choice, index) => (
                                <div className="form-check" key={index}>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={choice}
                                    id={`question-${question.id}-choice-${index}`}
                                    name={`question-${question.id}`}
                                    onChange={handleCheckboxChange}
                                    checked={selectedValues[question.id]?.[choice] || false}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`question-${question.id}-choice-${index}`}
                                  >
                                    {choice}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4">
                        <button onClick={handleSubmit} className="btn btn-primary">Submit</button>
                </div>
                </div>
              </div>
            </div>
          </div>
        </>
    </main>
  );
};

export default Forms;
