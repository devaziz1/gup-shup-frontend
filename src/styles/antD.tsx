import { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    colorPrimary: "#103B58",
    fontFamily: "Inter , sans-serif",
    fontSizeHeading1: 18,
    fontSizeHeading2: 16,
    fontSizeHeading3: 14,
    fontSizeHeading4: 12,
    fontSizeHeading5: 10,
    blue1: "#ECF9FF",
    blue2: "#C7EDFF",
    blue3: "#0049FC",
    blue4: "#F4F5FF",
    yellow1: "#FFF9EB",
  },
  components: {
    Layout: {
      siderBg: "#103B58",
      bodyBg: "#F6F6F6",
      headerBg: "#fff",
    },
    Button: {
      primaryShadow: "0px",
    },
    Menu: {
      itemBg: "#103B58",
      colorText: "#96A9B6",
      itemActiveBg: "#18415D",
      controlItemBgActive: "#18415D",
      itemSelectedColor: "#fff",
      popupBg: "#103B58",
      iconSize: 20,
    },
    Card: {
      borderRadiusLG: 16,
      padding: 0,
      paddingLG: 0,
    },
    Typography: {
      titleMarginBottom: 0,
      titleMarginTop: 0,
    },
  },
};

export default theme;
