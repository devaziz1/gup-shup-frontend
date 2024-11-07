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
  Select,
  Skeleton,
  Space,
  Table,
  Typography,
} from "antd";

import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import { CloseCircleIcon, ImageIcon } from "../assets/Icons/Icons";
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

  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [selectedBlogID, setSelectedBlogID] = useState("");
  const [sort, setSort] = useState("latest");
  const [searchValue, setSearchValue] = useState("");
  const [editorContent, setEditorContent] = useState(
    "<p>This is the initial content of the editor.</p>"
  );
  const [image, setImage] = useState();
  const fileInputRef = useRef(null);

  // ---- Success popup -----------
  const [api, contextHolder] = message.useMessage();

  const editorRef = useRef(null);
  // const log = () => {
  //   if (editorRef.current) {
  //     console.log(editorRef.current.getContent());
  //   }
  // };

  const openNotification = (m) => {
    api.open({
      type: "success",
      content: m,
    });
  };

  const getBlogCount = async () => {
    const config = {
      url: `http://localhost:3000/api/Blog/getTotalCounts/${localStorage.getItem(
        "ID"
      )}`,
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

  const getBlogByUser = async () => {
    const config = {
      url: `http://localhost:3000/api/Blog/getBlogsByUserId/${localStorage.getItem(
        "ID"
      )}?sort=${sort}&page=${page}&limit=10`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      const response = await axios(config);
      console.log("Blogs by user ID");
      console.log(response.data);

      const transformedBlogs = response.data.blogs.map((blog) => ({
        id: blog._id,
        title: blog.title,
        category: blog.category,
        description: blog.content,
        Status: blog.hide ? "hide" : "unhide",
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

  // ------- search ------------
  const SearchBar = async (title) => {
    const config = {
      url: `http://localhost:3000/api/Blog/search/${title}?id=${localStorage.getItem(
        "id"
      )}`,
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
      url: "http://localhost:3000/api/Blog/createBlog",
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
    console.log("Inside Second function");
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
    form.setFieldsValue("Ecategory", blog.category);
    setIsEditModalOpen(true);
  };

  const handleEditBlogSubmit = async () => {
    setIsButtonLoading(true);

    const config = {
      url: "http://localhost:3000/api/Blog/",
      method: "PATCH",
      data: {
        blogId: selectedBlogID,
        title,
        content,
        category,
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

  // ------ Delete Blog  -------

  const handleDeleteBlog = async () => {
    const config = {
      url: `http://localhost:3000/api/Blog/${selectedBlogID}`,
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
          <div onClick={showEditModal} className="ms-2">
            Edit
          </div>
        ),
        key: "0",
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
        key: "3",
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

              {image ? (
                <div className=" col-span-12   w-full">
                  <div
                    onClick={resetImage}
                    className="  flex justify-end mb-1 cursor-pointer"
                  >
                    <CloseCircleIcon />
                  </div>
                  <img
                    className="w-full h-[400px] object-contain  "
                    src={URL.createObjectURL(image)}
                    alt="Uploaded"
                  />
                </div>
              ) : (
                <Form.Item
                  className="col-span-12"
                  name="image"
                  rules={validationRules.Image}
                >
                  <div
                    style={{
                      border: "1px dashed black",
                    }}
                    onClick={handleButtonClick}
                    className=" cursor-pointer  rounded-md  h-[100px]  opacity-40 text-center text-xs flex flex-col justify-center items-center  gap-3"
                  >
                    <ImageIcon />
                    Tap To Add <br />
                    Image max. 2mb
                    <input
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      className="ml-2"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </Form.Item>
              )}

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
                      initialValue="<p>Blog Content.</p>"
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

                  <div className="col-span-7">
                    <label className="text-sm ml-1 font-semibold">
                      Enter Blog
                    </label>
                    <Form.Item
                      initialValue={content}
                      name="Econtent"
                      rules={validationRules.descrption}
                    >
                      <TextArea
                        rows={4}
                        placeholder="Enter Blog"
                        onChange={(e) => setContent(e.target.value)}
                        autoSize={{ minRows: 3, maxRows: 5 }}
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
      </div>
    </>
  );
};

export default MyBlogs;
