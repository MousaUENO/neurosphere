import { useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import AdminLayout from "../../../layouts/admin";
import { useRouter } from "next/router";

import BlogForm from "../../../components/Admin/Blog/BlogForm";
import BlogsList from "../../../components/Admin/Blog/BlogsList";

const Index = () => {
  const { roleInfo } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    let body = document.querySelector("body");
    body.classList.add("bg-gr");
    body.classList.remove("d3-dark");
    if (roleInfo === "user") router.push("/");
  }, []);
  if (roleInfo === "") return null;

  return (
    <AdminLayout>
      {/* <BlogForm /> */}
      <BlogsList />
    </AdminLayout>
  );
};

export default Index;
