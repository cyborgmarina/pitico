import React from "react";
import { Icon } from "antd";

export default ({ onClick }) => {
  return (
    <div style={{ cursor: "Pointer" }} onClick={onClick}>
      <Icon type="dollar" /> Pay Dividends
    </div>
  );
};
