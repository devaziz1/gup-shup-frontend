import { Card } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState();
  const getProfile = async () => {
    const config = {
      url: `http://localhost:3000/api/users/${localStorage.getItem("ID")}`,
      method: "GET",
    };

    try {
      const response = await axios(config);
      console.log("User Profile Data");
      console.log(response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      console.log("Inside finally");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <>
      <div className="grid grid-cols-12 h-screen">
        <div className="col-span-12 md:col-start-4 md:col-span-7 lg:col-start-4 lg:col-span-6 flex justify-center items-center">
          <Card className="pt-10 pb-10 pl-5 pr-5 shadow-lg w-full">
            <h1 className="text-xl flex justify-center font-semibold">
              MY Profile
            </h1>
            <h1>Name: {user && user.name}</h1>
            <h3>Email: {user && user.email}</h3>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Profile;
