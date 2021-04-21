const path = require("path");

module.exports = {
  reactScriptsVersion: "react-scripts" /* (default value) */,
  webpack: {
    alias: {
        "@": path.resolve(__dirname, "src/"),
        "@models": path.resolve(__dirname, "src/models/"),
        "@helpers": path.resolve(__dirname, "src/helpers/"),
        "@hooks": path.resolve(__dirname, "src/hooks/"),
        "@assets": path.resolve(__dirname, "src/assets/"),
        "@styles": path.resolve(__dirname, "src/styles/"),
        "@atoms": path.resolve(__dirname, "src/components/atoms/"),
        "@blocks": path.resolve(__dirname, "src/components/blocks/"),
        "@views": path.resolve(__dirname, "src/components/views/"),
        "@skeletons": path.resolve(__dirname, "src/components/skeletons/"),
    }
  }
};