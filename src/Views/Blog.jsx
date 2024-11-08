import { Card, Divider, Form, Input, Modal, Skeleton, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  SendIcon,
  UserIcon,
  DeleteIcon,
  EditIcon,
  CloseCircleIcon,
} from "../assets/Icons/Icons";
import { useEffect, useState } from "react";
import axios from "axios";
import HtmlRender from "../utils/HtmlRender";
import { validationRules } from "../utils/Validation";

const Blog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blogData, setBlogData] = useState();
  const [comments, setComments] = useState({});
  const [updatedComment, setUpdatedComment] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = localStorage.getItem("ID");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [IsButtonLoading, setIsButtonLoading] = useState(false);
  const [form] = Form.useForm();

  const getBlogbyID = async () => {
    const config = {
      url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/Blog/getBlogById/${id}`,
      method: "GET",
    };

    try {
      const response = await axios(config);
      console.log("Blog by id results");
      console.log(response.data);
      setBlogData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      console.log("Inside finally");
    }
  };

  const deleteComment = async (id) => {
    const config = {
      url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/blog/deleteComment`,
      method: "Delete",
      data: {
        commentId: id,
      },
    };

    try {
      const response = await axios(config);
      console.log(response.data);

      getBlogbyID();
    } catch (error) {
      console.error("Error :", error);
    } finally {
      console.log("Inside finally");
    }
  };

  const editComment = (id, content) => {
    console.log("Inside editComment");

    setUpdatedComment({ id, content });
    form.setFieldValue("comment", content);
    setIsEditModalOpen(true);
  };

  const CancelEditModal = () => {
    setIsEditModalOpen(false);
    form.setFieldValue("comment", "");
  };

  const handleEditCommentSubmit = async () => {
    setIsButtonLoading(true);
    console.log("Inside update Comment On Blog API Call");
    const config = {
      url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/Blog/editComment`,
      method: "Patch",
      data: {
        commentId: updatedComment.id,
        content: updatedComment.content,
      },
    };

    try {
      const response = await axios(config);
      console.log(response.data);
      getBlogbyID();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsButtonLoading(false);
      setIsEditModalOpen(false);
      console.log("Inside finally");
    }
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

      getBlogbyID();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      console.log("Inside finally");
    }
  };

  const CommentOnBlog = async (blogId, content) => {
    console.log("Inside Comment On Blog API Call");
    console.log(blogId, content);
    const config = {
      url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/Blog/addComment`,
      method: "POST",
      data: {
        name: localStorage.getItem("name")
          ? localStorage.getItem("name")
          : "Unknown",
        blogId,
        content,
      },
    };

    try {
      const response = await axios(config);
      console.log(response.data);
      getBlogbyID();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      console.log("Inside finally");
    }
  };

  useEffect(() => {
    getBlogbyID();
  }, [id]);

  const handleCommentChange = (blogId, content) => {
    setComments({
      ...comments,
      [blogId]: content,
    });
  };

  const handleKeyDown = (e, blogId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      CommentOnBlog(blogId, comments[blogId]);
      setComments({
        ...comments,
        [blogId]: "",
      });
    }
  };

  return (
    <>
      <header>
        <nav
          onClick={() => navigate("/")}
          className="flex justify-between items-center p-3 cursor-pointer"
        >
          <div className="flex gap-2 items-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path d="M3.5 19A1.5 1.5 0 015 20.5 1.5 1.5 0 013.5 22 1.5 1.5 0 012 20.5 1.5 1.5 0 013.5 19m5-3a2.5 2.5 0 012.5 2.5A2.5 2.5 0 018.5 21 2.5 2.5 0 016 18.5 2.5 2.5 0 018.5 16m6-1c-1.19 0-2.27-.5-3-1.35-.73.85-1.81 1.35-3 1.35-1.96 0-3.59-1.41-3.93-3.26A4.02 4.02 0 012 8a4 4 0 014-4l.77.07C7.5 3.41 8.45 3 9.5 3c1.19 0 2.27.5 3 1.35.73-.85 1.81-1.35 3-1.35 1.96 0 3.59 1.41 3.93 3.26A4.02 4.02 0 0122 10a4 4 0 01-4 4l-.77-.07c-.73.66-1.68 1.07-2.73 1.07M6 6a2 2 0 00-2 2 2 2 0 002 2c.33 0 .64-.08.92-.22A2 2 0 006.5 11a2 2 0 002 2c.6 0 1.14-.27 1.5-.69l1.47-1.68L13 12.34c.38.4.91.66 1.5.66 1 0 1.83-.74 2-1.7.34.43.89.7 1.5.7a2 2 0 002-2 2 2 0 00-2-2c-.33 0-.64.08-.92.22A2 2 0 0017.5 7a2 2 0 00-2-2c-.59 0-1.12.26-1.5.66l-1.53 1.71L11 5.69c-.36-.42-.9-.69-1.5-.69-1 0-1.83.74-2 1.7C7.16 6.27 6.61 6 6 6m2.5 11.5a1 1 0 00-1 1 1 1 0 001 1 1 1 0 001-1 1 1 0 00-1-1z" />
            </svg>
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 flex justify-center font-bold text-2xl">
              Gup Shup
            </h3>
          </div>
          <div></div>
          <div></div>
        </nav>
      </header>

      <main className="grid grid-cols-12">
        {isLoading ? (
          <>
            <Card
              style={{
                border: "1px solid #0096FF",
              }}
              className="mt-10 col-span-12 md:col-start-4 md:col-span-7 lg:col-start-4 lg:col-span-6 shadow-md mb-5"
            >
              <Skeleton />
            </Card>
          </>
        ) : (
          <>
            {blogData && (
              <>
                <Card
                  key={blogData._id}
                  style={{
                    border: "1px solid #0096FF",
                  }}
                  className="mt-10 cursor-pointer col-span-12 md:col-start-4 md:col-span-7 lg:col-start-4 lg:col-span-6 shadow-md mb-5 mx-5 md:mx-0"
                >
                  <div className="flex justify-between">
                    <div className="flex gap-1">
                      <UserIcon />
                      <h1 className="text-lg font-bold ">
                        {blogData.user.name
                          ? blogData.user.name
                          : blogData.username}
                      </h1>
                    </div>

                    <div className="mt-1 ml-1 flex gap-1 items-center">
                      <svg
                        viewBox="0 0 1024 1024"
                        fill={
                          isBlogLiked(blogData._id) ? "red" : "currentColor"
                        }
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => likeBlog(blogData._id)}
                      >
                        <path d="M923 283.6a260.04 260.04 0 00-56.9-82.8 264.4 264.4 0 00-84-55.5A265.34 265.34 0 00679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 00-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z" />
                      </svg>
                      <div>{blogData.likeCount}</div>
                    </div>
                  </div>
                  {blogData.image && (
                    <img
                      className="w-full h-[200px] object-contain "
                      src={blogData.image}
                      alt={blogData.title}
                    />
                  )}
                  <div className="mt-2 ml-1 text-base font-medium">
                    {blogData.title}
                  </div>
                  {blogData.tags && blogData.tags.length > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {blogData.tags.map((tag, index) => (
                        <span key={index} style={{ color: "#1E90FF" }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 ml-1 text-base ">
                    <HtmlRender htmlContent={blogData.content} />
                  </div>
                  <Divider />
                  <h4 className="flex justify-center font-medium">Comments</h4>

                  {blogData.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="flex justify-between items-center space-x-2 mb-2"
                    >
                      <span>
                        <strong>{comment.name}</strong>: {comment.content}
                      </span>

                      {blogData.user._id === currentUser && (
                        <div className="">
                          <button
                            onClick={() =>
                              editComment(comment._id, comment.content)
                            }
                            className="text-blue-500 hover:text-blue-700 mr-1"
                            aria-label="Edit comment"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => deleteComment(comment._id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Delete comment"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex justify-between items-center gap-2">
                    <Input
                      variant="borderless"
                      value={comments[blogData._id] || ""}
                      onKeyDown={(e) => handleKeyDown(e, blogData._id)}
                      onChange={(e) =>
                        handleCommentChange(blogData._id, e.target.value)
                      }
                      className="w-full rounded-md mt-2 bg-slate-100"
                      placeholder="Add comment"
                    />
                    <div
                      className="mt-2 cursor-pointer"
                      onClick={() => {
                        if (comments[blogData._id]) {
                          CommentOnBlog(blogData._id, comments[blogData._id]);
                          setComments({
                            ...comments,
                            [blogData._id]: "",
                          });
                        }
                      }}
                    >
                      <SendIcon />
                    </div>
                  </div>
                </Card>
              </>
            )}
          </>
        )}
      </main>
      <Modal
        open={isEditModalOpen}
        onCancel={CancelEditModal}
        closeIcon={false}
        footer={false}
        width={800}
        centered
      >
        <Form form={form} onFinish={handleEditCommentSubmit}>
          <div className="grid grid-cols-12 justify-center gap-3">
            <div className="col-span-12 flex justify-between  w-full mb-5">
              <div></div>
              <h3 className="text-xl font-semibold">Edit Comment</h3>
              <div onClick={CancelEditModal} className="cursor-pointer">
                <CloseCircleIcon />
              </div>
            </div>

            <div className="grid grid-cols-12 col-span-12 ">
              <div className="col-span-12 flex flex-col gap-3 md:px-16 lg:px-24 mt-4">
                <div className="col-span-12 md:col-span-7 ">
                  <Form.Item
                    initialValue={updatedComment.content}
                    name="comment"
                    rules={validationRules.comment}
                  >
                    <Input
                      value={updatedComment.content}
                      onChange={(e) =>
                        setUpdatedComment({
                          ...updatedComment,
                          content: e.target.value,
                        })
                      }
                      placeholder="Enter Comment"
                      allowClear
                    />
                  </Form.Item>
                </div>

                <div className="flex gap-2 mt-5 col-span-12 justify-center">
                  <Button
                    style={{
                      fontWeight: 600,
                    }}
                    type="primary"
                    className="rounded-full"
                    onClick={CancelEditModal}
                    ghost
                  >
                    Cancel
                  </Button>

                  <Button
                    style={{
                      fontWeight: 600,
                    }}
                    htmlType="submit"
                    type="primary"
                    className="rounded-full "
                    loading={IsButtonLoading}
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default Blog;
