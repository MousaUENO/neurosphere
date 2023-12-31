import React, { useEffect, useState } from "react";
import Link from "next/link";

const WorkList = () => {
  const [notification, setNotification] = useState("");
  const [workData, setWorkData] = useState([]);

  const clearNotification = () => {
    setTimeout(() => {
      setNotification("");
    }, 2000);
  };

  const getWorkData = async () => {
    const response = await fetch("/api/work", {
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const { data, error } = await response.json();
    data ? setWorkData(data) : setNotification(error);
    clearNotification();
  };

  const handleDelete = async (id) => {
    const response = await fetch("/api/work", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const { message, error } = await response.json();
    error ? setNotification(error) : setNotification(message);
    clearNotification();
    getWorkData();
  };

  useEffect(() => {
    getWorkData();
  }, []);

  return (
    <div className="container mt-4 head__padding">
      <div className="row text-dark justify-content-center">
        <div className="col-lg-10 col-md-8 admin-home">
          <div className="d-flex justify-content-between py-3">
            <h5>Recently Added Works</h5>
            <Link href="/admin/works/addWork">
              <div>
                <button type="button" className="btn-blog">
                  <span>Add Work</span>
                </button>
              </div>
            </Link>
          </div>
          <div>
            <table className="table__style">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Title</th>
                  {/* <th>Date</th> */}
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workData?.map((work, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{work.title}</td>
                      {/* <td>{work.date.toDate().toLocaleDateString("en-GB")}</td> */}
                      <td>
                        {work.published === true
                          ? "Published"
                          : "Not Published"}
                      </td>
                      <td>
                        <Link href={`/admin/works/${work.id}`}>
                          <a>
                            <button className="control_btn fas edit fa-edit mr-2"></button>
                          </a>
                        </Link>
                        <button
                          className="control_btn delete fas fa-trash-alt"
                          onClick={() => handleDelete(work.id)}
                        ></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkList;
