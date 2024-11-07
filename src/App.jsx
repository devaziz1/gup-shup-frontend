import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./Views/Home";
import SignUp from "./Views/SignUp";
import Login from "./Views/Login";
import DashBoard from "./Views/DashBoard";

import PropTypes from "prop-types";

import "./index.css";
import Profile from "./Views/Profile";
import MyBlogs from "./Views/MyBlogs";
import Blog from "./Views/Blog";

const PrivateRoute = ({ element }) => {
  const authenticated = localStorage.getItem("auth");

  return authenticated ? element : <Navigate to="/login" replace />;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/blog/:id" element={<Blog />} />
        <Route
          exact
          path="/dashboard"
          element={<PrivateRoute element={<DashBoard />} />}
        >
          <Route path="profile" element={<Profile />} />
          <Route path="blogs" element={<MyBlogs />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
