import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import AdminLayout from "../../layouts/admin";
import { AuthContext } from "../../context/AuthProvider";
import Home from "../../components/Admin/Home";

const Index = () => {
  const authInfo = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    let body = document.querySelector("body");
    body.classList.add("bg-gr");
    body.classList.remove("d3-dark");
  }, []);
  // if (authInfo.user === "user")
  //   return (
  //     <MainLayout footerClass="bg-gray">
  //       <Signin />
  //     </MainLayout>
  //   );
  return (
    <AdminLayout>
      <Home />
    </AdminLayout>
  );
};

export default Index;
