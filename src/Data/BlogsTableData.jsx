import { DeleteIcon, EditIcon, MenuDotsIcon, } from "../assets/Icons/Icons";
import { Button, Dropdown, Menu, Space, Tag, Typography } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { truncateDescription } from "../utils/truncate";

const ActionsColumn = () => {
  const navigate = useNavigate();



  const items = [
    {
      label: (
        <div onClick={() => navigate(``)} className="ms-2">
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
      label: <div className="ms-2">Delete</div>,
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

export const COLUMNS = [
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
        {truncateDescription(description)}
      </Typography.Text>
    ),
  },
  {
    title: "Status",
    key: "Status",
    render: (_, { Status }) => {
      let color;

      if (Status === "unhide") {
        color = "blue";
        Status = "un-hide";
      } else if (Status === "hide") {
        Status = "hide";
        color = "orange";
      } else {
        color = "error";
      }
      return (
        <Tag color={color} className="capitalize">
          {Status}
        </Tag>
      );
    },
  },
  {
    title: "CreatedAt",
    dataIndex: "CreatedAt",
    key: "CreatedAt",
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

