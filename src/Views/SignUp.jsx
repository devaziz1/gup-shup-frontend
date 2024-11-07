import { Button, Card, Form, Input, message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { validationRules } from "../utils/Validation";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [IsButtonLoading, setIsButtonLoading] = useState(false);
  const [api, contextHolder] = message.useMessage();
  const openNotificationError = (m) => {
    api.open({
      type: "error",
      content: m,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsButtonLoading(true);

    const config = {
      url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/users/`,
      method: "POST",
      data: {
        name,
        email,
        password,
      },
    };

    try {
      const response = await axios(config);
      localStorage.setItem("auth", "true");
      console.log(response.data);
      console.log("Form submitted successfully!");
      localStorage.setItem("auth", "true");
      localStorage.setItem("ID", response.data.user._id);
      localStorage.setItem("name", response.data.user.name);
      localStorage.setItem("token", response.data.token);

      setEmail("");
      setName("");
      setPassword("");
      navigate("/dashboard/blogs");
    } catch (error) {
      console.error("Error submitting form:", error);
      openNotificationError(error.response.data.message);
    } finally {
      setIsButtonLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 p-5 bg-slate-100 h-screen">
        {contextHolder}

        <div className="col-span-12 md:col-start-4 md:col-span-7 lg:col-start-4 lg:col-span-6 flex justify-center items-center">
          <Card className="pt-10 pb-10 pl-5 pr-5 shadow-lg w-full">
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 flex justify-center mt-10 font-bold text-2xl">
              Welcome To Gup Shup
            </h3>
            <Form layout="vertical" onFinish={handleSubmit}>
              <label className="font-semibold text-black flex ml-1">
                Enter Name
              </label>

              <Form.Item name="name" rules={validationRules.name}>
                <Input
                  type="text"
                  placeholder="Name"
                  allowClear
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Item>
              <label className="font-semibold text-black flex ml-1">
                Enter Email
              </label>

              <Form.Item name="email" rules={validationRules.email}>
                <Input
                  type="email"
                  placeholder="Email"
                  allowClear
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
              <label className="font-semibold text-black flex ml-1">
                Enter Password
              </label>

              <Form.Item name="password" rules={validationRules.password}>
                <Input.Password
                  type="Password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Button
                htmlType="submit"
                type="primary"
                className="mt-5 w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold "
                loading={IsButtonLoading}
              >
                Create Account
              </Button>
            </Form>
            <p className="text-md flex justify-center mt-10 items-center">
              Already have an account?
              <Button
                onClick={() => navigate("/login")}
                style={{
                  padding: 0,
                }}
                type="text"
                className="font-semibold text-sm ml-1"
              >
                Login
              </Button>
            </p>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SignUp;
