import React, { useState } from "react";
import { Popover } from "antd";

export default ({ children, hoverContent, clickContent }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const hide = () => {
    setHovered(false);
    setClicked(false);
  };

  const handleHoverChange = visible => {
    setHovered(visible);
    setClicked(false);
  };

  const handleClickChange = visible => {
    setHovered(visible);
    setClicked(visible);
  };

  return (
    <Popover
      style={{ width: 100 }}
      content={hoverContent}
      title=""
      trigger="hover"
      visible={hovered}
      onVisibleChange={handleHoverChange}
    >
      <Popover
        content={
          <div>
            {clickContent}
            <a href="." onClick={hide}>
              Close
            </a>
          </div>
        }
        trigger="click"
        visible={clicked}
        onVisibleChange={handleClickChange}
      >
        {children}
      </Popover>
    </Popover>
  );
};
