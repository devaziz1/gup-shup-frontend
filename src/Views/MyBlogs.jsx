import {
  Button,
  ConfigProvider,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Pagination,
  Card,
  Select,
  Skeleton,
  Space,
  Table,
  Typography,
  Divider,
} from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import {
  CloseCircleIcon,
  ImageIcon,
  EyeOpenIcon,
  UserIcon,
} from "../assets/Icons/Icons";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { validationRules } from "../utils/Validation";
import { DeleteIcon, EditIcon, MenuDotsIcon } from "../assets/Icons/Icons";
import moment from "moment";
import { truncateDescription } from "../utils/truncate";
import HtmlRender from "../utils/HtmlRender";
const { confirm } = Modal;
const MyBlogs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTableDataLoading, setIsTableDataLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [IsButtonLoading, setIsButtonLoading] = useState(false);
  const [form] = Form.useForm();
  const [BlogsCount, setBlogsCount] = useState();
  const [page, setPage] = useState(1);
  const [blogData, setBlogData] = useState({
    blogs: [],
    totalBlogs: 0,
    totalPages: 0,
    currentPage: 1,
  });

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [blog, setBlog] = useState();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [selectedBlogID, setSelectedBlogID] = useState("");
  const [sort, setSort] = useState("latest");
  const [searchValue, setSearchValue] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [image, setImage] = useState();
  const fileInputRef = useRef(null);

  // ---- Success popup -----------
  const [api, contextHolder] = message.useMessage();

  const editorRef = useRef(null);

  const openNotification = (m) => {
    api.open({
      type: "success",
      content: m,
    });
  };

  const getBlogCount = async () => {
    const config = {
      url: `${
        import.meta.env.VITE_BACKEND_ENDPOINT
      }/Blog/getTotalCounts/${localStorage.getItem("ID")}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      const response = await axios(config);
      console.log(response.data);
      setBlogsCount(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      console.log("Inside finally");
    }
  };

  const getBlogById = async () => {
    const config = {
      url: `${
        import.meta.env.VITE_BACKEND_ENDPOINT
      }/Blog/getBlogById/${selectedBlogID}`,
      method: "GET",
    };

    try {
      const response = await axios(config);

      console.log("Get blog by id");
      console.log(response.data);
      setBlog(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      console.log("Inside finally");
    }
  };

  const getBlogByUser = async () => {
    const config = {
      url: `${
        import.meta.env.VITE_BACKEND_ENDPOINT
      }/Blog/getBlogsByUserId/${localStorage.getItem(
        "ID"
      )}?sort=${sort}&page=${page}&limit=10`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      const response = await axios(config);
      console.log("Blogs by user ID...");
      console.log(response.data);

      const transformedBlogs = response.data.blogs.map((blog) => ({
        id: blog._id,
        title: blog.title,
        tags: blog.tags.join(", "),
        description: blog.content,
        CreatedAt: blog.createdAt,
      }));

      setBlogData({
        blogs: transformedBlogs,
        totalBlogs: response.data.totalBlogs,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
      });
      setIsTableDataLoading(false);
    } catch (error) {
      setIsTableDataLoading(false);

      console.error("Error submitting form:", error);
    } finally {
      console.log("Inside finally");
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
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
    } catch (error) {
      console.error("Error :", error);
    } finally {
      setIsViewModalOpen(false);
      getBlogCount();
      getBlogByUser();
      console.log("Inside finally");
    }
  };

  // ------- search ------------
  const SearchBar = async (title) => {
    const config = {
      url: `${
        import.meta.env.VITE_BACKEND_ENDPOINT
      }/Blog/search/${title}?id=${localStorage.getItem("id")}`,
      method: "GET",
    };

    try {
      const response = await axios(config);
      console.log("search reasults for user");
      console.log(response.data);
      const transformedBlogs = response.data.map((blog) => ({
        id: blog._id,
        title: blog.title,
        description: blog.content,
        Status: blog.hide ? "hide" : "unhide",
        CreatedAt: blog.createdAt,
      }));

      setBlogData({
        blogs: transformedBlogs,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      console.log("Inside finally");
    }
  };

  //-------- Create Blog Functions --------------

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    setIsButtonLoading(true);

    const formData = new FormData();
    formData.append("userId", localStorage.getItem("ID"));
    formData.append("title", title);
    formData.append("tags", tags);
    formData.append("content", editorContent);
    formData.append("category", category);
    formData.append("username", localStorage.getItem("name"));
    if (image) {
      formData.append("image", image);
    }

    const config = {
      url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/Blog/createBlog`,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };

    try {
      const response = await axios(config);
      console.log("Blog submitted successfully!");
      console.log(response.data);
      form.setFieldValue("title", "");
      form.setFieldValue("content", "");
      form.setFieldValue("Category", "");
      getBlogCount();
      getBlogByUser();
      openNotification("Blog created successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsModalOpen(false);
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // ------- Edit Blog Functions --------------

  const setSelectedID = (id) => {
    console.log("Inside First function");
    console.log(id);
    setSelectedBlogID(id);
  };

  const showEditModal = () => {
    console.log("current tags");
    console.log(tags);
    console.log("Selected blog:", selectedBlogID);
    const blog = blogData.blogs.find((blog) => blog.id === selectedBlogID);
    console.log("Blog found");
    console.log(blog);
    setTitle(blog.title);
    setTags(blog.tags);
    setContent(blog.description);
    setCategory(blog.category);
    form.setFieldValue("Etitle", blog.title);
    form.setFieldValue("Econtent", blog.description);
    form.setFieldsValue("tags", blog.tags);
    setIsEditModalOpen(true);
  };

  const handleEditBlogSubmit = async () => {
    setIsButtonLoading(true);

    const config = {
      url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/Blog/`,
      method: "PATCH",
      data: {
        blogId: selectedBlogID,
        title,
        content: editorContent,
        tags,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      const response = await axios(config);
      console.log(response.data);
      setTitle("");
      setTags("");
      setContent("");
      setCategory("");
      form.setFieldValue("Etitle", "");
      form.setFieldsValue("Econtent", "");
      form.setFieldsValue("Ecategory", "");
      getBlogByUser();
      openNotification("Blog updated successfully!");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsEditModalOpen(false);
    } finally {
      setIsButtonLoading(false);
    }
  };

  const CancelEditModal = () => {
    setIsEditModalOpen(false);
  };

  // ------ View Blog  -------

  const CancelViewModal = () => {
    setIsViewModalOpen(false);
  };

  const showViewModal = () => {
    getBlogById();
    setIsViewModalOpen(true);
  };

  // ------ Delete Blog  -------

  const handleDeleteBlog = async () => {
    const config = {
      url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/Blog/${selectedBlogID}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      const response = await axios(config);

      console.log(response.data);
      getBlogByUser();
      getBlogCount();
      openNotification("Blog deleted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsButtonLoading(false);
    }
  };

  // ------ Table Functions -------------

  const ActionsColumn = () => {
    const showDeleteBlogMessage = () => {
      confirm({
        title: `Are you sure to delete this Blog?`,
        icon: <DeleteIcon />,
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          setIsButtonLoading(true);
          await handleDeleteBlog();
          setIsButtonLoading(false);
        },
      });
    };

    const items = [
      {
        label: (
          <div onClick={showViewModal} className="ms-2">
            View
          </div>
        ),
        key: "0",
        icon: <EyeOpenIcon />,
      },
      {
        type: "divider",
      },
      {
        label: (
          <div onClick={showEditModal} className="ms-2">
            Edit
          </div>
        ),
        key: "1",
        icon: <EditIcon />,
      },
      {
        type: "divider",
      },
      {
        label: (
          <div onClick={showDeleteBlogMessage} className="ms-2">
            Delete
          </div>
        ),
        key: "2",
        icon: <DeleteIcon />,
      },
    ];

    return (
      <div className="flex justify-end">
        <Dropdown
          overlay={<Menu items={items} />}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button shape="circle" type="text" icon={<MenuDotsIcon />}></Button>
        </Dropdown>
      </div>
    );
  };

  const COLUMNS = [
    {
      title: "Title",
      key: "title",
      render: (_, { title }) => (
        <Space>
          <Typography.Text>{title}</Typography.Text>
        </Space>
      ),
    },
    {
      title: "Description",
      key: "description",
      dataIndex: "description",
      render: (description) => (
        <Typography.Text type="secondary">
          <HtmlRender htmlContent={truncateDescription(description)} />
        </Typography.Text>
      ),
    },
    {
      title: "Created At",
      dataIndex: "appliedDate",
      key: "applied-date",
      render: (value) => {
        return moment(value).format("DD MMM YYYY");
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: () => <ActionsColumn />,
    },
  ];

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearch(searchValue);
    }
  };

  const onSearch = (value) => {
    console.log(value);
    SearchBar(value);
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const resetImage = () => {
    setImage(null);
  };

  useEffect(() => {
    getBlogCount();
  }, []);

  useEffect(() => {
    getBlogCount();
    getBlogByUser();
  }, [page, sort]);

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        {contextHolder}
        <div className="flex justify-between mx-5 col-span-12 mt-2">
          <h3 className="text-2xl font-semibold">My Blogs</h3>
          <Button onClick={showModal}>Create New Blog</Button>
        </div>
        <div className="col-span-12 sm:col-span-4 bg-teal-100  p-5  rounded-md shadow-md">
          <h1 className="text-xl font-semibold">Total Blogs</h1>
          <div className="text-3xl">
            {(BlogsCount && BlogsCount.totalPosts) || 0}
          </div>
        </div>
        <div className="col-span-12 sm:col-span-4 bg-[#E8F5E9] p-5 rounded-md shadow-md">
          <h1 className="text-xl font-semibold">Total Likes</h1>
          <div className="text-3xl">
            {(BlogsCount && BlogsCount.totalLikes) || 0}
          </div>
        </div>
        <div className="col-span-12 sm:col-span-4 bg-[#FFFDE7] p-5 rounded-md shadow-md">
          <h1 className="text-xl font-semibold">Total Comments</h1>
          <div className="text-3xl">
            {(BlogsCount && BlogsCount.totalComments) || 0}
          </div>
        </div>
        <div className="flex gap-2 items-center col-span-12">
          <Input
            variant="borderless"
            placeholder="Search by title"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <Select
            style={{ minWidth: 150 }}
            placeholder="Sort By"
            onChange={handleSortChange}
            options={[
              { value: "latest", label: "latest" },
              { value: "Oldest", label: "Oldest" },
            ]}
          />
        </div>

        <div className="col-span-12 shadow-lg rounded-md">
          {isTableDataLoading ? (
            <ConfigProvider
              theme={{
                token: {
                  controlHeight: 590,
                },
              }}
            >
              <Skeleton.Button active={true} size="small" block />
            </ConfigProvider>
          ) : (
            <div className="grid grid-cols-12 h-screen">
              {blogData.blogs.length > 0 ? (
                <>
                  <Table
                    className="col-span-12"
                    rowKey={(record) => record.id}
                    onRow={(record) => {
                      return {
                        onClick: () => {
                          setSelectedID(record.id);
                        },
                      };
                    }}
                    columns={COLUMNS}
                    dataSource={blogData.blogs}
                    pagination={false}
                    scroll={{
                      x: "max-content",
                    }}
                  />
                  <Pagination
                    className="mb-5 mt-5 col-start-4 md:col-start-6 col-span-6 flex items-end "
                    current={page}
                    total={blogData.totalBlogs}
                    onChange={handlePageChange}
                  />
                </>
              ) : (
                <p className="col-span-12 p-3">No Blogs Posted Yet</p>
              )}
            </div>
          )}
        </div>
        <Modal
          open={isModalOpen}
          onCancel={handleCancel}
          closeIcon={false}
          footer={false}
          width={800}
          centered
        >
          <Form form={form} onFinish={handleSubmit}>
            <div className="grid grid-cols-12 justify-center gap-3">
              <div className="col-span-12 flex justify-between  w-full mb-5">
                <div></div>
                <h3 className="text-xl font-semibold">Create Blog</h3>
                <div onClick={handleCancel} className="cursor-pointer">
                  <CloseCircleIcon />
                </div>
              </div>

              <Form.Item
                className="col-span-12"
                name="image"
                rules={[
                  {
                    validator: (_, value) =>
                      image
                        ? Promise.resolve()
                        : Promise.reject(new Error("Cover Image is required")),
                  },
                ]}
              >
                {image ? (
                  <div className="col-span-12 w-full">
                    <div
                      onClick={resetImage}
                      className="flex justify-end mb-1 cursor-pointer"
                    >
                      <CloseCircleIcon />
                    </div>
                    <img
                      className="w-full h-[400px] object-contain"
                      src={URL.createObjectURL(image)}
                      alt="Uploaded"
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      border: "1px dashed black",
                    }}
                    onClick={handleButtonClick}
                    className="cursor-pointer rounded-md h-[100px] opacity-40 text-center text-xs flex flex-col justify-center items-center gap-3"
                  >
                    <ImageIcon />
                    Tap To Add <br />
                    Image max. 2mb
                    <input
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                )}
              </Form.Item>

              <div className="grid grid-cols-12 col-span-12 ">
                <div className="col-span-12 flex flex-col gap-3 md:px-16 lg:px-24 mt-4">
                  <div className="col-span-12 md:col-span-7 ">
                    <label className=" text-sm ml-1 font-semibold">
                      Blog Title
                    </label>
                    <Form.Item name="title" rules={validationRules.title}>
                      <Input
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Blog Title"
                        allowClear
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-12 md:col-span-7 ">
                    <label className=" text-sm ml-1 font-semibold">
                      Please enter tags separate by ,
                    </label>
                    <Form.Item name="tags">
                      <Input
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Blog Tags"
                        allowClear
                      />
                    </Form.Item>
                  </div>

                  <div className="col-span-7">
                    <label className="text-sm ml-1 font-semibold">
                      Enter Blog
                    </label>

                    <Editor
                      apiKey="2e93k9pcsd46l2bwuh2241llbj8mjr0b5c8c39w9nga6upav"
                      onInit={(_evt, editor) => (editorRef.current = editor)}
                      initialValue=""
                      placeholder="Enter Blog Content Here..."
                      onEditorChange={(newContent) =>
                        setEditorContent(newContent)
                      }
                      init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "image",
                          "charmap",
                          "preview",
                          "anchor",
                          "searchreplace",
                          "visualblocks",
                          "code",
                          "fullscreen",
                          "insertdatetime",
                          "media",
                          "table",
                          "code",
                          "help",
                          "wordcount",
                        ],
                        toolbar:
                          "undo redo | blocks | " +
                          "bold italic forecolor | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | " +
                          "removeformat | help",
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                      }}
                    />
                  </div>

                  <div className="flex gap-2 mt-5 col-span-12 justify-center">
                    <Button
                      style={{
                        fontWeight: 600,
                      }}
                      type="primary"
                      className="rounded-full"
                      onClick={handleCancel}
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
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </Modal>
        <Modal
          open={isEditModalOpen}
          onCancel={CancelEditModal}
          closeIcon={false}
          footer={false}
          width={800}
          centered
        >
          <Form form={form} onFinish={handleEditBlogSubmit}>
            <div className="grid grid-cols-12 justify-center gap-3">
              <div className="col-span-12 flex justify-between  w-full mb-5">
                <div></div>
                <h3 className="text-xl font-semibold">Edit Blog</h3>
                <div onClick={CancelEditModal} className="cursor-pointer">
                  <CloseCircleIcon />
                </div>
              </div>

              <div className="grid grid-cols-12 col-span-12 ">
                <div className="col-span-12 flex flex-col gap-3 md:px-16 lg:px-24 mt-4">
                  <div className="col-span-12 md:col-span-7 ">
                    <label className=" text-sm ml-1 font-semibold">
                      Blog Title
                    </label>
                    <Form.Item
                      initialValue={title}
                      name="Etitle"
                      rules={validationRules.title}
                    >
                      <Input
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Blog Title"
                        allowClear
                      />
                    </Form.Item>
                  </div>

                  <div className="col-span-12 md:col-span-7 ">
                    <label className=" text-sm ml-1 font-semibold">
                      Blog Tags
                    </label>
                    <Form.Item initialValue={tags} name="tags">
                      <Input
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Blog Tags"
                        allowClear
                      />
                    </Form.Item>
                  </div>

                  <Editor
                    apiKey="2e93k9pcsd46l2bwuh2241llbj8mjr0b5c8c39w9nga6upav"
                    onInit={(_evt, editor) => (editorRef.current = editor)}
                    initialValue={content}
                    placeholder="Enter Blog Content Here..."
                    onEditorChange={(newContent) =>
                      setEditorContent(newContent)
                    }
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "code",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />

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
        <Modal
          open={isViewModalOpen}
          onCancel={CancelViewModal}
          closeIcon={false}
          footer={false}
          width={800}
          centered
        >
          <>
            {blog && (
              <>
                <Card
                  key={blog._id}
                  style={{
                    border: "1px solid #0096FF",
                  }}
                  className="mt-10 cursor-pointer col-span-12 md:col-start-4 md:col-span-7 lg:col-start-4 lg:col-span-6 shadow-md mb-5 mx-5 md:mx-0"
                >
                  <div className="flex justify-between">
                    <div className="flex gap-1">
                      <UserIcon />
                      <h1 className="text-lg font-bold ">
                        {blog.user.name ? blog.user.name : blog.username}
                      </h1>
                    </div>

                    <div className="mt-1 ml-1 flex gap-1 items-center">
                      <svg
                        viewBox="0 0 1024 1024"
                        fill="currentColor"
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => likeBlog(blog._id)}
                      >
                        <path d="M923 283.6a260.04 260.04 0 00-56.9-82.8 264.4 264.4 0 00-84-55.5A265.34 265.34 0 00679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 00-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z" />
                      </svg>
                      <div>{blog.likeCount}</div>
                    </div>
                  </div>
                  {blog.image && (
                    <img
                      className="w-full h-[200px] object-contain "
                      src={blog.image}
                      alt={blog.title}
                    />
                  )}
                  <div className="mt-2 ml-1 text-base font-medium">
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
                  <div className="mt-2 ml-1 text-base ">
                    <HtmlRender htmlContent={blog.content} />
                  </div>
                  <Divider />
                  <h4 className="flex justify-center font-medium">Comments</h4>

                  {blog.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="flex justify-between items-center space-x-2 mb-2"
                    >
                      <span>
                        <strong>{comment.name}</strong>: {comment.content}
                      </span>

                      <button
                        onClick={() => deleteComment(comment._id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete comment"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  ))}
                </Card>
              </>
            )}
          </>
        </Modal>
      </div>
    </>
  );
};

export default MyBlogs;
