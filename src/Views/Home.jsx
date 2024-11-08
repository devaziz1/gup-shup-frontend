import { Card, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { UserIcon } from "../assets/Icons/Icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pagination } from "antd";
import HtmlRender from "../utils/HtmlRender";

const Home = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [blogData, setBlogData] = useState({
    blogs: [],
    totalBlogs: 0,
    totalPages: 0,
    currentPage: 1,
  });

  const getBlogsData = async () => {
    setIsLoading(true); // Set loading state to true
    const config = {
      url: `${
        import.meta.env.VITE_BACKEND_ENDPOINT
      }/Blog/getAllBlogs?page=${page}`, // Pass the page number
      method: "GET",
    };

    try {
      const response = await axios(config);
      console.log("all blogs", response.data);

      setBlogData({
        blogs: response.data.blogs,
        totalBlogs: response.data.totalBlogs,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
      });

      setIsLoading(false); // Set loading state to false
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setIsLoading(false); // Ensure loading state is turned off on error
    }
  };

  const handlePageChange = (pageNum) => {
    setPage(pageNum);
  };

  const isBlogLiked = (blogID) => {
    const likes = JSON.parse(localStorage.getItem("likes")) || [];
    return likes.includes(blogID);
  };

  const likeBlog = async (blogID) => {
    const likes = JSON.parse(localStorage.getItem("likes")) || [];

    if (likes.includes(blogID)) {
      console.log("Blog already liked");
      return;
    }

    const config = {
      url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/Blog/like/${blogID}`,
      method: "PATCH",
    };

    try {
      const response = await axios(config);
      console.log(response.data);

      likes.push(blogID);
      localStorage.setItem("likes", JSON.stringify(likes));

      getBlogsData();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      console.log("Inside finally");
    }
  };

  useEffect(() => {
    getBlogsData();
  }, [page]);

  return (
    <>
      <header>
        <nav className="flex justify-between items-center p-3">
          <div className="flex gap-2 items-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path d="M3.5 19A1.5 1.5 0 015 20.5 1.5 1.5 0 013.5 22 1.5 1.5 0 012 20.5 1.5 1.5 0 013.5 19m5-3a2.5 2.5 0 012.5 2.5A2.5 2.5 0 018.5 21 2.5 2.5 0 016 18.5 2.5 2.5 0 018.5 16m6-1c-1.19 0-2.27-.5-3-1.35-.73.85-1.81 1.35-3 1.35-1.96 0-3.59-1.41-3.93-3.26A4.02 4.02 0 012 8a4 4 0 014-4l.77.07C7.5 3.41 8.45 3 9.5 3c1.19 0 2.27.5 3 1.35.73-.85 1.81-1.35 3-1.35 1.96 0 3.59 1.41 3.93 3.26A4.02 4.02 0 0122 10a4 4 0 01-4 4l-.77-.07c-.73.66-1.68 1.07-2.73 1.07M6 6a2 2 0 00-2 2 2 2 0 002 2c.33 0 .64-.08.92-.22A2 2 0 006.5 11a2 2 0 002 2c.6 0 1.14-.27 1.5-.69l1.47-1.68L13 12.34c.38.4.91.66 1.5.66 1 0 1.83-.74 2-1.7.34.43.89.7 1.5.7a2 2 0 002-2 2 2 0 00-2-2c-.33 0-.64.08-.92.22A2 2 0 0017.5 7a2 2 0 00-2-2c-.59 0-1.12.26-1.5.66l-1.53 1.71L11 5.69c-.36-.42-.9-.69-1.5-.69-1 0-1.83.74-2 1.7C7.16 6.27 6.61 6 6 6m2.5 11.5a1 1 0 00-1 1 1 1 0 001 1 1 1 0 001-1 1 1 0 00-1-1z" />
            </svg>
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 flex justify-center font-bold text-2xl">
              Gup Shup
            </h3>
          </div>

          {localStorage.getItem("auth") === "true" ? (
            <button
              type="button"
              onClick={() => navigate("/dashboard/blogs")}
              className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-md px-2 font-semibold"
            >
              Dashboard
            </button>
          ) : (
            <div className="flex gap-3 items-center">
              <button
                onClick={() => navigate("/login")}
                className="font-semibold"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-md px-2 font-semibold"
              >
                Get Started
              </button>
            </div>
          )}
        </nav>
      </header>

      <main className="grid grid-cols-12">
        <h3 className="col-span-12 md:col-start-4 md:col-span-7 lg:col-start-4 lg:col-span-6 flex items-center justify-center font-semibold text-3xl mb-2 mt-2">
          Explore Our Latest Blog
        </h3>
        {isLoading ? (
          <>
            <Card
              style={{
                border: "1px solid #0096FF",
              }}
              className="col-span-12 md:col-start-4 md:col-span-7 lg:col-start-4 lg:col-span-6 shadow-md mb-5"
            >
              <Skeleton />
            </Card>

            <Card
              style={{
                border: "1px solid #0096FF",
              }}
              className="col-span-12 md:col-start-4 md:col-span-7 lg:col-start-4 lg:col-span-6 shadow-md mb-5"
            >
              <Skeleton />
            </Card>

            <Card
              style={{
                border: "1px solid #0096FF",
              }}
              className="col-span-12 md:col-start-4 md:col-span-7 lg:col-start-4 lg:col-span-6 shadow-md mb-5"
            >
              <Skeleton />
            </Card>

            <Card
              style={{
                border: "1px solid #0096FF",
              }}
              className="col-span-12 md:col-start-4 md:col-span-7 lg:col-start-4 lg:col-span-6 shadow-md mb-5"
            >
              <Skeleton />
            </Card>
          </>
        ) : (
          <>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                {blogData.blogs.length > 0 ? (
                  <>
                    {blogData.blogs.map((blog) => (
                      <Card
                        key={blog._id}
                        style={{
                          border: "1px solid #0096FF",
                        }}
                        className=" col-span-12 md:col-start-4 md:col-span-7 lg:col-start-4 lg:col-span-6 shadow-md mb-5 mx-5 md:mx-0"
                      >
                        {blog.image && (
                          <img
                            className="w-full h-[200px] relative object-cover flex-shrink-0 rounded-md"
                            src={blog.image}
                            alt={blog.title}
                          />
                        )}
                        <div className="flex justify-between mt-3">
                          <div className="flex gap-1">
                            <UserIcon />
                            <h1 className="text-lg font-bold">
                              {blog.user.name ? blog.user.name : blog.username}
                            </h1>
                          </div>

                          <div className="mt-1 ml-1 flex gap-1 items-center">
                            <svg
                              viewBox="0 0 1024 1024"
                              fill={
                                isBlogLiked(blog._id) ? "red" : "currentColor"
                              }
                              className="w-5 h-5 cursor-pointer"
                              onClick={() => likeBlog(blog._id)}
                            >
                              <path d="M923 283.6a260.04 260.04 0 00-56.9-82.8 264.4 264.4 0 00-84-55.5A265.34 265.34 0 00679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 00-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z" />
                            </svg>
                            <div>{blog.likeCount}</div>
                          </div>
                        </div>

                        <div
                          onClick={() => navigate(`/blog/${blog._id}`)}
                          className="mt-2 ml-1 text-base font-medium cursor-pointer hover:underline"
                        >
                          {blog.title}
                        </div>
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="mt-2 flex gap-2 flex-wrap">
                            {blog.tags.map((tag, index) => (
                              <span key={index} style={{ color: "#1E90FF" }}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <HtmlRender htmlContent={blog.content} />
                      </Card>
                    ))}
                  </>
                ) : (
                  <p className="col-span-12 flex justify-center">
                    No Blogs yet
                  </p>
                )}

                {blogData.blogs.length > 0 && (
                  <Pagination
                    className="mb-5 mt-5 col-start-4 md:col-start-6 col-span-6 flex items-end"
                    current={page}
                    total={blogData.totalBlogs}
                    onChange={handlePageChange}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default Home;
