import React from "react";

const SubmitForm = () => {
  return (
    <main>
      <div className="hero py-5 bg-light">
        <div className="container text-center">
          <h2 className="mb-3">Biodata - Web Tech Members</h2>
          <div className="text-muted">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </div>
        </div>
      </div>

      <div className="py-5">
        <div className="container">
          <div className="row justify-content-center ">
            <div className="col-lg-5 col-md-6">
              <div className="text-muted">
                <span className="text-primary">budi@webtech.id</span>{" "}
                <small>
                  <i>(shared)</i>
                </small>
              </div>

              <form>
                <div className="form-item card card-default my-4">
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="name" className="mb-1 text-muted">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Your answer"
                        className="form-control"
                        name="name"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-item card card-default my-4">
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="address" className="mb-1 text-muted">
                        Address
                      </label>
                      <textarea
                        id="address"
                        rows="4"
                        placeholder="Your answer"
                        className="form-control"
                        name="address"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="form-item card card-default my-4">
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="" className="mb-1 text-muted">
                        Sex <span className="text-danger">*</span>
                      </label>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          value="Male"
                          id="sex-male"
                          name="sex"
                        />
                        <label className="form-check-label" htmlFor="sex-male">
                          Male
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          value="Female"
                          id="sex-female"
                          name="sex"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="sex-female"
                        >
                          Female
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          value="Others"
                          id="sex-others"
                          name="sex"
                        />
                        <label className="form-check-label" htmlFor="sex-others">
                          Others
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-item card card-default my-4">
                  <div className="card-body">
                    <div className="form-group">
                      <label
                        htmlFor="born-date"
                        className="mb-1 text-muted"
                      >
                        Born Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        placeholder="Your answer"
                        className="form-control"
                        id="born-date"
                        name="born_date"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-item card card-default my-4">
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="" className="mb-1 text-muted">
                        Hobbies
                      </label>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value="Football"
                          id="hobbies-football"
                          name="hobbies[]"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="hobbies-football"
                        >
                          Football
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value="Guitar"
                          id="hobbies-guitar"
                          name="hobbies[]"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="hobbies-guitar"
                        >
                          Guitar
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value="Coding"
                          id="hobbies-coding"
                          name="hobbies[]"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="hobbies-coding"
                        >
                          Coding
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value="Watching"
                          id="hobbies-watching"
                          name="hobbies[]"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="hobbies-watching"
                        >
                          Watching
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value="Traveling"
                          id="hobbies-traveling"
                          name="hobbies[]"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="hobbies-traveling"
                        >
                          Traveling
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button className="btn btn-primary">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SubmitForm;
