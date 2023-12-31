import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../config/fire-config";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import PreviewImage from "../../PreviewImage";
import Compressor from "compressorjs";

const BlogForm = () => {
  const [errMessage, setErrMessage] = useState(null);
  const [notification, setNotification] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    Array(postContent?.length).fill(null)
  );
  const [postContent, setPostContent] = useState([
    { heading: "", paragraphs: "", paragraphsImg: "" },
  ]);

  const router = useRouter();
  const initialValues = {
    img: "",
    title: "",
    tags: "",
    posterAvatar: "",
    posterName: "",
    postDescriptions: "",
    postMeta: "",
  };

  const validateForm = (formValues) => {
    if (!formValues.title || !formValues.postDescriptions) {
      setErrMessage("Please fill in all fields");
      return false;
    }
    if (formValues.title.length < 5) {
      setErrMessage("Title must be at least 5 characters");
      return false;
    }
    if (formValues.tags.length < 2) {
      setErrMessage("Tags must be atleast two characters");
      return false;
    }
    if (formValues.postDescriptions.length < 10) {
      setErrMessage("Message must be at least 10 characters");
      return false;
    }

    if (!formValues.img) {
      setErrMessage("Please select an image file");
      return false;
    }
    if (!formValues.img.type.startsWith("image/")) {
      setErrMessage("Please select an image");
      return false;
    }
    return true;
  };

  const clearNotification = () => {
    setTimeout(() => {
      setNotification("");
    }, 2000);
  };

  const handlePostContentChange = (index, field, value) => {
    let postData = [...postContent];
    postData[index][field] = value;
    setPostContent(postData);
  };

  const handleImageUpload = async (index, event) => {
    const file = event.target.files[0];

    const compressedFile = await new Promise((resolve) => {
      new Compressor(file, {
        maxWidth: 1500,
        quality: 0.8,
        success(result) {
          resolve(result);
        },
        error(err) {
          console.error("Image compression error:", err);
          resolve(file);
        },
      });
    });

    const storageRef = ref(storage, `blogImages/${compressedFile.name}`);
    await uploadBytes(storageRef, compressedFile);
    const imageUrl = await getDownloadURL(storageRef);
    handlePostContentChange(index, "paragraphsImg", imageUrl);
  };

  const addPostContent = () => {
    const newPostContent = { heading: "", paragraphs: "", paragraphsImg: "" };

    setPostContent([...postContent, newPostContent]);
    console.log(postContent);
  };

  const publishBlog = async (values, postContent) => {
    try {
      let compressedImg = values.img;
      let storageRef;

      if (values.img) {
        compressedImg = await new Promise((resolve) => {
          new Compressor(values.img, {
            maxWidth: 1500,
            quality: 0.8,
            success(result) {
              resolve(result);
            },
            error(err) {
              console.error("Image compression error:", err);
              resolve(values.img);
            },
          });
        });

        storageRef = ref(storage, `blogImages/${compressedImg.name}`);
        await uploadBytes(storageRef, compressedImg);
      }

      const image = compressedImg ? await getDownloadURL(storageRef) : null;

      const response = await fetch("/api/Blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
          image,
          postContent,
          isPublished,
        }),
      });

      const { message, error } = await response.json();
      !error ? setNotification(message) : setNotification(error);
      clearNotification();
    } catch (error) {
      console.error("Error publishing blog:", error);
      setNotification("Error publishing blog");
      clearNotification();
    }
  };

  const saveBlog = async (values, postContent) => {
    try {
      let image = "";

      if (values.img) {
        const compressedImg = await new Promise((resolve) => {
          new Compressor(values.img, {
            maxWidth: 1500,
            quality: 0.8,
            success(result) {
              resolve(result);
            },
            error(err) {
              console.error("Image compression error:", err);
              resolve(values.img);
            },
          });
        });

        const storageRef = ref(storage, `blogImages/${compressedImg.name}`);
        await uploadBytes(storageRef, compressedImg);
        image = await getDownloadURL(storageRef);
      }

      const response = await fetch("/api/Blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
          image,
          postContent,
          isPublished,
        }),
      });

      const { message, error } = await response.json();
      if (error) {
        setNotification(error);
      } else {
        setNotification(message);
      }
      clearNotification();
    } catch (error) {
      console.error("Error saving blog:", error);
      setNotification("Error saving blog");
      clearNotification();
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (validateForm(values)) {
        setErrMessage(null);
        setSubmitting(false);
        if (isPublished) {
          await publishBlog(values, postContent);
          setNotification("Blog published");
        } else {
          await saveBlog(values, postContent);
          setNotification("Blog saved as draft");
        }

        resetForm();
        setTimeout(() => {
          router.push("/admin/blog");
          setNotification("");
        }, 2000);
      }
    } catch (error) {
      setNotification(error);
      clearNotification();
    }
  };

  const isButtonDisabled = !postContent;
  return (
    <>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, isSubmitting, setFieldValue, submitForm }) => (
          <Form>
            <div className="d-flex justify-content-between fix-top">
              <div className="text-dark pb-2 blg-head">Create Blog</div>
              <div>
                <button
                  type="button"
                  className="btn-blog mr-3"
                  onClick={() => {
                    setIsPublished(false);
                    submitForm();
                  }}
                >
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  className="btn-blog"
                  onClick={() => {
                    setIsPublished(true);
                    submitForm();
                  }}
                >
                  <span>Publish</span>
                </button>
              </div>
            </div>
            <div className="container mt-2 mb-4">
              {notification && (
                <div className="notification">{notification}</div>
              )}

              <div className="row mb-4 blg__form--pad">
                <div className="col-lg-7 col-md-7">
                  <div className="blog-box p-4">
                    {errMessage && (
                      <div className="form_Messages text-danger">
                        {errMessage}
                      </div>
                    )}

                    <div className="controls blog-form">
                      <div className="form-group">
                        <label htmlFor="Title">Title</label>
                        <Field
                          id="form_title"
                          type="text"
                          name="title"
                          placeholder="Blog Title"
                          required="required"
                          className="border border-secondary"
                        />
                      </div>

                      <div className="form-group d-flex flex-column">
                        <div>
                          <label htmlFor="postDescriptions">Intro</label>
                          <Field
                            required="required"
                            as="textarea"
                            type="text"
                            id="postDescriptions"
                            name="postDescriptions"
                            placeholder="Blog Intro"
                          />
                        </div>
                      </div>

                      <div className="form-group d-flex flex-column">
                        <h4 className="text-dark">Post Content</h4>
                        {postContent.map((post, index) => {
                          return (
                            <div key={index} className="controls blog-form">
                              <div className="form-group d-flex flex-column">
                                <label htmlFor="heading">
                                  Heading {index + 1}
                                </label>
                                <input
                                  id="heading"
                                  type="text"
                                  value={post.heading}
                                  onChange={(event) =>
                                    handlePostContentChange(
                                      index,
                                      "heading",
                                      event.target.value
                                    )
                                  }
                                  placeholder="Post Heading"
                                  className="border border-secondary"
                                />
                              </div>

                              <div className="form-group d-flex flex-column">
                                <label htmlFor="paragraphs">
                                  Paragraphs {index + 1}
                                </label>
                                <textarea
                                  id="paragraphs"
                                  value={post.paragraphs}
                                  onChange={(event) =>
                                    handlePostContentChange(
                                      index,
                                      "paragraphs",
                                      event.target.value
                                    )
                                  }
                                  placeholder="Post Paragraphs"
                                  className="border border-secondary post_para"
                                />
                              </div>
                              <div className="form-group d-flex flex-column">
                                {(imagePreview[index] && (
                                  <PreviewImage imgUrl={imagePreview[index]} />
                                )) ||
                                  (post.paragraphsImg && (
                                    <PreviewImage imgUrl={post.paragraphsImg} />
                                  ))}
                                <label htmlFor="Tag">
                                  Add Paragrapgh Image
                                </label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(event) => {
                                    const file = event.target.files[0];
                                    const imageUrl = URL.createObjectURL(file);

                                    // Update the imagePreviews state for the current index
                                    const newImagePreview = [...imagePreview];
                                    newImagePreview[index] = imageUrl;
                                    setImagePreview(newImagePreview);

                                    handleImageUpload(index, event);
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                        <button
                          onClick={addPostContent}
                          type="button"
                          className="btn_post-content"
                          disabled={isButtonDisabled}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* <div className="row">
                    <div className="blog-box p-4 w-100 mb-3">
                      <div className="controls blog-form">
                        <div className="form-group d-flex flex-column">
                          <label htmlFor="Title">Title</label>
                          <Field
                            id="form_title"
                            type="text"
                            name="title"
                            placeholder="Blog Title"
                            required="required"
                            className="border border-secondary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="blog-box p-4 w-100 mb-3">
                      <div className="controls blog-form">
                        <div className="form-group d-flex flex-column">
                          <label htmlFor="postDescriptions">Intro</label>
                          <Field
                            required="required"
                            as="textarea"
                            type="text"
                            id="postDescriptions"
                            name="postDescriptions"
                            placeholder="Blog Intro"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="blog-box p-4 w-100 mb-3">
                      <div className="controls blog-form">
                        <div className="section border">
                          <div className="d-flex section__title">
                            <div
                              className="text-black mr-1 p-1"
                              htmlFor="Section-Title"
                            >
                              Section Title:
                            </div>
                            <input
                              type="text"
                              id="Section-Title"
                              className="w-75"
                              placeholder="Enter Title Here"
                            />
                          </div>
                          <div className="row">
                            <div className="col-lg-8 mt-2">
                              <div className="border">
                                <div className="d-flex paragraph__title align-items-center ">
                                  <div
                                    className="text-black p-1"
                                    htmlFor="Paragraph-Title"
                                  >
                                    Paragraph Title:
                                  </div>
                                  <div className="flex-grow-1">
                                    <input
                                      type="text"
                                      id="Paragraph-Title"
                                      className="w-100 p-1"
                                      placeholder="Enter Paragraph Title Here"
                                    />
                                  </div>
                                </div>
                                <textarea
                                  id="paragraphs"
                                  placeholder="Post Paragraphs"
                                  className="border border-secondary post_para w-100"
                                />
                              </div>
                            </div>
                            <div className="col-lg-4 mt-2">
                              <div className="border-dashed w-100 h-75"></div>

                              <input
                                type="file"
                                accept="image/*"
                                className="mt-2"
                                onChange={(event) => {
                                  const file = event.target.files[0];
                                  const imageUrl = URL.createObjectURL(file);

                                  const newImagePreview = [...imagePreview];
                                  newImagePreview[index] = imageUrl;
                                  setImagePreview(newImagePreview);

                                  handleImageUpload(index, event);
                                }}
                              />
                            </div>
                          </div>
                          <button className="btn-blog m-1">ADD &#43;</button>
                        </div>
                      </div>
                    </div>
                    <button className="btn-blog ml-2 mt-1 mb-3">
                      ADD SECTION
                    </button>
                  </div> */}
                </div>
                <div className="col-lg-5 col-md-4">
                  <div className="row">
                    <div className="blog-box p-4 w-100 mb-3">
                      {errMessage && (
                        <div className="messages">{errMessage}</div>
                      )}

                      <div className="controls blog-form">
                        <div className="form-group d-flex flex-column">
                          <label htmlFor="Tag">Tags</label>
                          <Field
                            type="text"
                            id="tags"
                            placeholder="Tags"
                            name="tags"
                          />
                        </div>
                        <div className="form-group d-flex flex-column">
                          {values.img && <PreviewImage file={values.img} />}
                          {!values.img ? (
                            <label htmlFor="Tag">Add Image</label>
                          ) : (
                            <p>Post Image</p>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              setFieldValue("img", event.target.files[0]);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="blog-box p-4 w-100 mb-3">
                      {errMessage && (
                        <div className="messages">{errMessage}</div>
                      )}

                      <div className="controls blog-form">
                        <div className="form-group d-flex flex-column">
                          <label htmlFor="posterName">Author Name</label>
                          <Field
                            id="posterName"
                            type="text"
                            name="posterName"
                            placeholder="Poster Name"
                            className="border border-secondary"
                          />
                        </div>
                        <div className="form-group d-flex flex-column">
                          {values.posterAvatar && (
                            <PreviewImage file={values.posterAvatar} />
                          )}
                          {!values.posterAvatar ? (
                            <label htmlFor="Tag">Add Avatar</label>
                          ) : (
                            <p></p>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              setFieldValue(
                                "posterAvatar",
                                event.target.files[0]
                              );
                            }}
                          />
                        </div>
                        <div className="form-group d-flex flex-column">
                          <label htmlFor="postMeta">Post Meta</label>

                          <Field
                            id="postMeta"
                            type="text"
                            name="postMeta"
                            placeholder="Post Meta"
                            className="border border-secondary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default BlogForm;
