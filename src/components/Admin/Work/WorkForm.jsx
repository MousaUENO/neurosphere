import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import db, { storage } from "../../../config/fire-config";

import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";

const WorkForm = () => {
  const [notification, setNotification] = useState("");
  const [errMessage, setErrMessage] = useState(null);
  const [services, setServices] = useState([]);
  const [outcomes, setOutcomes] = useState([]);

  const router = useRouter();

  const [newService, setNewService] = useState({
    serviceTitle: "",
    serviceDecription: "",
    serviceIconClass: "",
  });

  const [newOutcome, setNewOutcome] = useState({
    outcomeTitle: "",
    outcomeDescription: "",
    outcomeIconClass: "",
  });

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService({
      ...newService,
      [name]: value,
    });
  };

  const handleOutcomeChange = (e) => {
    const { name, value } = e.target;
    setNewOutcome({
      ...newOutcome,
      [name]: value,
    });
  };

  const handleAddService = () => {
    setServices([...services, newService]);
    setNewService({
      serviceTitle: "",
      serviceDecription: "",
      serviceIconClass: "",
    });
    console.log(JSON.stringify(services));
  };

  const handleAddOutcome = () => {
    setOutcomes([...outcomes, newOutcome]);
    setNewOutcome({
      outcomeTitle: "",
      outcomeDescription: "",
      outcomeIconClass: "",
    });
    console.log(JSON.stringify(outcomes));
  };

  const initialValues = {
    img: "",
    link: "",
    wideImg: "",
    title: "",
    description: "",
    tags: "",
    objective: "",
    servicesIntro: "",
    serviceImg: "",
    services: [],
    outcomeText: "",
    outcomeImg: "",
    outcomes: [],
    published: true,
  };

  const validateForm = (formValues) => {
    // Required field validation
    const requiredFields = [
      "title",
      "description",
      "objective",
      "servicesIntro",
      "outcomeText",
      "img",
      "wideImg",
    ];

    for (const field of requiredFields) {
      if (!formValues[field]) {
        setErrMessage("Please fill in all fields");
        return false;
      }
    }

    // Field length validation
    if (formValues.title.length < 5) {
      setErrMessage("Name must be at least 5 characters");
      return false;
    }

    if (formValues.description.length < 10) {
      setErrMessage("Description must be at least 10 characters");
      return false;
    }

    if (formValues.servicesIntro.length < 10) {
      setErrMessage("Services Intro must be at least 10 characters");
      return false;
    }

    if (formValues.outcomeText.length < 10) {
      setErrMessage("Outcome text must be at least 10 characters");
      return false;
    }

    // Services and Outcomes Length Validation
    if (formValues.services.length < 2) {
      setErrMessage("Services must have at least 2 items");
      return false;
    }

    if (formValues.outcomes.length < 2) {
      setErrMessage("Outcomes must have at least 2 items");
      return false;
    }

    // Image and wideImg validation
    if (!formValues.img || !formValues.img.type.startsWith("image/")) {
      setErrMessage("Please select an image");
      return false;
    }

    if (!formValues.wideImg || !formValues.wideImg.type.startsWith("image/")) {
      setErrMessage("Please select a wide image");
      return false;
    }

    return true;
  };

  const clearNotification = () => {
    setTimeout(() => {
      setNotification("");
    }, 2000);
  };
  const addWork = async (values) => {
    const ImgStorageRef = ref(
      storage,
      `workImages/img${values.img.name + values.img.size}`
    );
    const wideImgStorageRef = ref(
      storage,
      `workImages/wideImg${values.wideImg.name + values.wideImg.size}`
    );
    const testimonialImgStorageRef = ref(
      storage,
      `workImages/wideImg${
        values.testimonialImg.name + values.testimonialImg.size
      }`
    );
    const serviceImgStorageRef = ref(
      storage,
      `workImages/wideImg${values.serviceImg.name + values.serviceImg.size}`
    );
    const outcomeImgStorageRef = ref(
      storage,
      `workImages/wideImg${values.outcomeImg.name + values.outcomeImg.size}`
    );
    await uploadBytes(ImgStorageRef, values.img);
    await uploadBytes(wideImgStorageRef, values.wideImg);
    await uploadBytes(testimonialImgStorageRef, values.testimonialImg);
    await uploadBytes(serviceImgStorageRef, values.serviceImg);
    await uploadBytes(outcomeImgStorageRef, values.outcomeImg);
    const imageURL = await getDownloadURL(ImgStorageRef);
    const wideImageURL = await getDownloadURL(wideImgStorageRef);
    const serviceImgUrl = await getDownloadURL(serviceImgStorageRef);
    const testimonialImgUrl = await getDownloadURL(testimonialImgStorageRef);
    const outcomeImgUrl = await getDownloadURL(outcomeImgStorageRef);
    const response = await fetch("/api/work", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values,
        imageURL,
        wideImageURL,
        serviceImgUrl,
        testimonialImgUrl,
        outcomeImgUrl,
      }),
    });
    const { message, error } = await response.json();
    !error ? setNotification(message) : setNotification(error);
    clearNotification("");
    console.log("Form " + JSON.stringify(values));
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (validateForm) {
        console.log("Form validated");
        setErrMessage("");
        setSubmitting(false);
        values.services = services;
        values.outcomes = outcomes;
        await addWork(values);
        resetForm();
        setTimeout(() => {
          router.push("/admin/works");
          setNotification("");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setNotification(error);
      clearNotification();
    }
  };

  const handleSave = async (values) => {
    try {
      values.published = false;
      values.services = services;
      values.outcomes = outcomes;
      await addWork(values);

      setTimeout(() => {
        router.push("/admin/works");
        setNotification("");
      }, 2000);
    } catch (error) {
      setNotification(error);
      clearNotification();
    }
  };

  return (
    <>
      <div className="mt-2 container">
        {notification && <div className="notification">{notification}</div>}
        {errMessage && <div className="messages">{errMessage}</div>}
        <div className="d-flex justify-content-center flex-column">
          <div className="text-dark mb-3 blg-head mt-4 mb-4">Add New Work</div>
        </div>

        <Formik const initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values, setFieldValue }) => (
            <Form>
              <div className="mb-4">
                <div className="col-lg-12 col-md-12 mb-4">
                  <div className="blog-box p-4">
                    <div className="controls blog-form">
                      <div className="form-group d-flex flex-column">
                        <label htmlFor="Title">Title</label>
                        <Field
                          id="form_Title"
                          type="text"
                          name="title"
                          placeholder="Work Title"
                          required="required"
                          value={values.title}
                        />
                      </div>

                      <div className="form-group d-flex flex-column">
                        <label htmlFor="Tags">Tags</label>
                        <Field
                          type="text"
                          id="tags"
                          placeholder="Tags"
                          name="tags"
                        />
                      </div>

                      <div className="form-group d-flex flex-column">
                        <label htmlFor="Link">Link</label>
                        <Field
                          id="form_link"
                          type="text"
                          name="link"
                          placeholder="Link"
                          required="required"
                          value={values.link}
                        />
                      </div>

                      <div className="form-group d-flex flex-column">
                        <label htmlFor="objective">Objective</label>
                        <Field
                          as="textarea"
                          id="form_objective"
                          name="objective"
                          placeholder="Objective"
                          rows="4"
                          required="required"
                          value={values.objective}
                        />
                      </div>
                      <div className="form-group d-flex flex-column">
                        <label htmlFor="description">Description</label>
                        <Field
                          as="textarea"
                          id="form_description"
                          name="description"
                          placeholder="Description"
                          rows="4"
                          required="required"
                          value={values.description}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="row mb-4">
                    <div className="col-lg-12">
                      <div className="blog-box p-4">
                        <div className="controls blog-form">
                          <div className="form-group d-flex flex-column">
                            <label htmlFor="Tag">Add Image</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => {
                                setFieldValue("img", event.target.files[0]);
                              }}
                            />
                          </div>
                          <div className="form-group d-flex flex-column">
                            <label htmlFor="Tag">Add Wide Image</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => {
                                setFieldValue("wideImg", event.target.files[0]);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="col-lg-12 col-md-12 ">
                      <div className="blog-box p-4">
                        <div className="controls blog-form">
                          <div className="form-group d-flex flex-column">
                            <label htmlFor="heading">
                              Testimonials Content
                            </label>
                            <input
                              id="heading"
                              type="text"
                              // value={heading}
                              // onChange={handleHeadingChange}
                              placeholder="Post Heading"
                              className="border border-secondary"
                            />
                          </div>
                          <div className="form-group d-flex flex-column">
                            <label htmlFor="heading">Testimonials Name</label>
                            <input
                              id="heading"
                              type="text"
                              // value={heading}
                              // onChange={handleHeadingChange}
                              placeholder="Post Heading"
                              className="border border-secondary"
                            />
                          </div>
                          <div className="form-group d-flex flex-column">
                            <label htmlFor="servicesIntro">
                              Testimonials Details
                            </label>
                            <input
                              id="heading"
                              type="text"
                              // value={heading}
                              // onChange={handleHeadingChange}
                              placeholder="Post Heading"
                              className="border border-secondary"
                            />
                          </div>
                          <div className="form-group d-flex flex-column">
                            <label htmlFor="heading">Testimonials Image</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => {
                                setFieldValue(
                                  "testimonialImg",
                                  event.target.files[0]
                                );
                              }}
                            />
                          </div>
                          <button
                            // onClick={addPostContent}
                            type="button"
                            className="btn_post-content"
                            // disabled={isButtonDisabled}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="col-lg-12 col-md-12 mb-4">
                  <div className="controls blog-form">
                    <div className="blog-box p-4">
                      <div className="form-group d-flex flex-column">
                        <label htmlFor="servicesIntro">Service Intro</label>
                        <Field
                          as="textarea"
                          id="form_servicesIntro"
                          name="servicesIntro"
                          placeholder="ServicesIntro"
                          rows="4"
                          required="required"
                          value={values.servicesIntro}
                        />
                        <label htmlFor="Tag">Add Service Img</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            setFieldValue("serviceImg", event.target.files[0]);
                          }}
                        />
                      </div>
                      <div className="form-group d-flex flex-column">
                        <label htmlFor="heading">Service Title</label>
                        <input
                          id="heading"
                          type="text"
                          name="serviceTitle"
                          value={newService.serviceTitle}
                          // onChange={handleHeadingChange}
                          onChange={handleServiceChange}
                          placeholder="Post Heading"
                          className="border border-secondary"
                        />
                      </div>
                      <div className="form-group d-flex flex-column">
                        <label htmlFor="heading">Service Description</label>
                        <input
                          id="heading"
                          type="text"
                          name="serviceDecription"
                          value={newService.serviceDecription}
                          // onChange={handleHeadingChange}
                          onChange={handleServiceChange}
                          placeholder="Post Heading"
                          className="border border-secondary"
                        />
                      </div>
                      <div className="form-group d-flex flex-column">
                        <label htmlFor="heading">Service Icon Class</label>
                        <input
                          id="heading"
                          type="text"
                          name="serviceIconClass"
                          value={newService.serviceIconClass}
                          // onChange={handleHeadingChange}
                          onChange={handleServiceChange}
                          placeholder="Post Heading"
                          className="border border-secondary"
                        />
                      </div>
                      <button
                        // onClick={addPostContent}
                        onClick={handleAddService}
                        type="button"
                        className="btn_post-content"
                        // disabled={isButtonDisabled}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12 mb-4">
                  <div className="controls blog-form">
                    <div className="blog-box p-4">
                      <div className="form-group d-flex flex-column">
                        <label htmlFor="servicesIntro">Outcome Text</label>
                        <Field
                          as="textarea"
                          id="form_servicesIntro"
                          name="outcomeText"
                          placeholder="Outcome Text"
                          rows="4"
                          required="required"
                          value={values.outcomeText}
                        />
                        <label htmlFor="Tag">Add Outcome Img</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            setFieldValue("outcomeImg", event.target.files[0]);
                          }}
                        />
                      </div>
                      <div className="form-group d-flex flex-column">
                        <label htmlFor="heading">Outcome Title</label>
                        <input
                          id="heading"
                          type="text"
                          name="outcomeTitle"
                          value={newOutcome.outcomeTitle}
                          // onChange={handleHeadingChange}
                          onChange={handleOutcomeChange}
                          placeholder="Post Heading"
                          className="border border-secondary"
                        />
                      </div>
                      <div className="form-group d-flex flex-column">
                        <label htmlFor="heading">Outcome Description</label>
                        <input
                          id="heading"
                          type="text"
                          name="outcomeDescription"
                          value={newOutcome.outcomeDescription}
                          // onChange={handleHeadingChange}
                          onChange={handleOutcomeChange}
                          placeholder="Post Heading"
                          className="border border-secondary"
                        />
                      </div>
                      <div className="form-group d-flex flex-column">
                        <label htmlFor="heading">Outcome Icon Class</label>
                        <input
                          id="heading"
                          type="text"
                          name="outcomeIconClass"
                          value={newOutcome.outcomeIconClass}
                          // onChange={handleHeadingChange}
                          onChange={handleOutcomeChange}
                          placeholder="Post Heading"
                          className="border border-secondary"
                        />
                      </div>
                      <button
                        // onClick={addPostContent}
                        onClick={handleAddOutcome}
                        type="button"
                        className="btn_post-content"
                        // disabled={isButtonDisabled}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                {/* <div className="col-lg-6 col-md-6">
                  <div className="controls blog-form">
                    <div className="blog-box p-4">
                      <div className="form-group d-flex flex-column">
                        <label htmlFor="heading">Skill Title</label>
                        <input
                          id="heading"
                          type="text"
                          // value={heading}
                          // onChange={handleHeadingChange}
                          placeholder="Post Heading"
                          className="border border-secondary"
                        />
                      </div>
                      <div className="form-group d-flex flex-column">
                        <label htmlFor="heading">Skill Subtitle</label>
                        <input
                          id="heading"
                          type="text"
                          // value={heading}
                          // onChange={handleHeadingChange}
                          placeholder="Post Heading"
                          className="border border-secondary"
                        />
                      </div>
                      <div className="form-group d-flex flex-column">
                        <label htmlFor="heading">Skill Value</label>
                        <input
                          id="heading"
                          type="text"
                          // value={heading}
                          // onChange={handleHeadingChange}
                          placeholder="Post Heading"
                          className="border border-secondary"
                        />
                      </div>
                      <button
                        // onClick={addPostContent}
                        type="button"
                        className="btn_post-content"
                        // disabled={isButtonDisabled}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div> */}

                <div className="d-flex ml-3 mt-4">
                  <div>
                    <button
                      type="button"
                      onClick={() => handleSave(values)}
                      className="btn-blog mr-4"
                    >
                      <span>Save</span>
                    </button>
                  </div>
                  <div>
                    <button type="submit" className="btn-blog">
                      <span>Publish</span>
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
export default WorkForm;
