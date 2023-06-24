import db from "../../config/fire-config";
import { collection, addDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import Link from "next/link";

const Signup = () => {
  const [errMessage, setErrMessage] = useState(null);
  const [notification, setNotification] = useState();

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const validateForm = (formValues) => {
    if (!formValues.name || !formValues.email || !formValues.password) {
      setErrMessage("Please fill in all fields");
      return false;
    }
    if (formValues.name.length < 3) {
      setErrMessage("Name must be at least 3 characters");
      return false;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)) {
      setErrMessage("Email is invalid");
      return false;
    }
    if (formValues.password.length < 7) {
      setErrMessage("Message must be at least 7 characters");
      return false;
    }
    return true;
  };

  const createBlog = async ({ name, email, password }) => {
    const userCollection = collection(db, "users");
    const res = await addDoc(userCollection, {
      name,
      email,
      password,
    });
    setNotification("Account created successfully");
    setTimeout(() => {
      setNotification("");
    }, 2000);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (validateForm(values)) {
      console.log(JSON.stringify(values));
      setErrMessage(null);
      setSubmitting(false);
      createBlog(values);
    }
  };
  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="cont">
            <div className="login border-secondary bg-gray mx-auto p-4">
              <h4 className="text-center text-xl">Sign up</h4>
              <div className="">
                <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                  <Form>
                    {errMessage && <div className="messages">{errMessage}</div>}

                    <div className="controls blog-form">
                      <div className="form-group d-flex flex-column">
                        <label htmlFor="Title">Name</label>
                        <Field
                          id="form_title"
                          type="text"
                          name="name"
                          placeholder="Blog Title"
                          required="required"
                          className="input"
                        />
                      </div>

                      <div className="form-group d-flex flex-column">
                        <label htmlFor="Tag">Email</label>
                        <Field
                          id="form_tag"
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          required="required"
                          className="input"
                        />
                      </div>

                      <div className="form-group d-flex flex-column">
                        <label htmlFor="Tag">Password</label>
                        <Field
                          id="form_tag"
                          type="password"
                          name="password"
                          placeholder="*********"
                          required="required"
                          className="input"
                        />
                      </div>

                      <button type="submit" className="log-btn w-full">
                        <span>Sign up</span>
                      </button>
                      <div className=" text-center text-secondary">
                        <Link href="/auth/signin">
                          <a className="link-to">
                            <span>Aready a user?</span> Sign in
                          </a>
                        </Link>
                      </div>
                    </div>
                  </Form>
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;