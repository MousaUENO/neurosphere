import React, { useEffect, useState } from "react";
import BlogTable from "../../BlogTable";
import ConfirmModal from "../../Modals/ConfirmModal";

const BlogsList = () => {
  const [notification, setNotification] = useState("");
  const [blogData, setBlogData] = useState([]);
  const [publishedBlog, setPublishedBlog] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const clearNotification = () => {
    setTimeout(() => {
      setNotification("");
    }, 2000);
  };

  const getBlogData = async () => {
    const response = await fetch("/api/Blog", {
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const { data, error } = await response.json();
    console.log(data);
    // setFilteredData(data?.filter((d) => d.isPublished === false));
    setPublishedBlog(data?.filter((d) => d.isPublished === true));
    data ? setBlogData(data) : setNotification(error);
    clearNotification();
  };

  const handleOnDeleteConfirm = async () => {
    const response = await fetch("/api/Blog", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ id: deleteId }),
    });
    const { message, error } = await response.json();
    error ? setNotification(error) : setNotification(message);
    clearNotification();
    setShowConfirmBox(false);
    getBlogData();
  };

  const handleOnCancel = () => {
    setShowConfirmBox(false);
  };

  const handleDelete = (id) => {
    setShowConfirmBox(true);
    setDeleteId(id);
  };

  useEffect(() => {
    getBlogData();
  }, []);

  return (
    <>
      <div className="container mt-4 head__padding">
        {notification && <div className="notification">{notification}</div>}
        <BlogTable
          heading="Published Blogs"
          publishedBlog={publishedBlog}
          onDeleteClick={handleDelete}
        />
      </div>
      {showConfirmBox && (
        <ConfirmModal
          onCancel={handleOnCancel}
          onConfirm={handleOnDeleteConfirm}
        />
      )}
    </>
  );
};

export default BlogsList;
