import React, { useEffect, useState } from "react";
import Client from "./Client/Client";
import ConfirmModal from "../Modals/ConfirmModal";
import BlogTable from "../BlogTable";

const Home = () => {
  const [notification, setNotification] = useState("");
  const [blogData, setBlogData] = useState([]);
  const [publishedBlog, setPublishedBlog] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [clientData, setClientData] = useState([]);
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
    setFilteredData(data?.filter((d) => d.isPublished === false));
    setPublishedBlog(data?.filter((d) => d.isPublished === true));
    data ? setBlogData(data) : setNotification(error);
    clearNotification();
  };

  const getClientData = async () => {
    try {
      const response = await fetch("/api/client/client", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data, error } = await response.json();
      if (data) {
        setClientData(data);
      } else {
        setNotification(error);
        clearNotification();
      }
    } catch (error) {
      console.log("Error occured : ", error);
    }
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
    getClientData();
  }, []);

  useEffect(() => {
    getBlogData();
  }, []);
  const sendMailToClients = async () => {
    console.log("Clicked");
    try {
      const response = await fetch("http://localhost:3005/api/send-emails", {
        method: "POST",
      });
      const { message } = response.json();
      console.log(message);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
      <div className="container mt-4">
        {/* <button className="btn btn-primary" onClick={sendMailToClients}>
          Send
        </button> */}
        {notification && <div className="notification">{notification}</div>}
        {/* {filteredData && filteredData[0]?.isPublished === false && (
         
        )} */}
        <Client data={clientData} getClientsData={getClientData} />
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

export default Home;
