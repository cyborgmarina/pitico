import * as React from "react";
import { Icon } from "antd";

const hammer = () => (
  <svg viewBox="0 0 576 512" width="18" height="18">
    <path
      fill="currentColor"
      d="M571.31 193.94l-22.63-22.63c-6.25-6.25-16.38-6.25-22.63 0l-11.31 11.31-28.9-28.9c5.63-21.31.36-44.9-16.35-61.61l-45.25-45.25c-62.48-62.48-163.79-62.48-226.28 0l90.51 45.25v18.75c0 16.97 6.74 33.25 18.75 45.25l49.14 49.14c16.71 16.71 40.3 21.98 61.61 16.35l28.9 28.9-11.31 11.31c-6.25 6.25-6.25 16.38 0 22.63l22.63 22.63c6.25 6.25 16.38 6.25 22.63 0l90.51-90.51c6.23-6.24 6.23-16.37-.02-22.62zm-286.72-15.2c-3.7-3.7-6.84-7.79-9.85-11.95L19.64 404.96c-25.57 23.88-26.26 64.19-1.53 88.93s65.05 24.05 88.93-1.53l238.13-255.07c-3.96-2.91-7.9-5.87-11.44-9.41l-49.14-49.14z"
    ></path>
  </svg>
);

const plane = () => (
  <svg height="18" width="18" viewBox="0 0 691.2 650.24">
    <defs id="defs74">
      <style id="style72" type="text/css" />
      <clipPath id="clipPath89" clipPathUnits="userSpaceOnUse">
        <rect
          y="192"
          x="177.60765"
          height="638.46899"
          width="654.39233"
          id="rect91"
          fill="currentColor"
        />
      </clipPath>
      <clipPath id="clipPath93" clipPathUnits="userSpaceOnUse">
        <rect
          y="192"
          x="177.60765"
          height="638.46899"
          width="654.39233"
          id="rect95"
          fill="currentColor"
        />
      </clipPath>
    </defs>
    <g transform="translate(-176.38277,-186.3533)" id="g99">
      <path
        fill="currentColor"
        d="M 192,499.2 404,592.6 832,192 Z"
        p-id="9782"
        id="path76"
        clipPath="url(#clipPath93)"
      />
      <path
        fill="currentColor"
        d="M 832,192 435.8,623.4 539.6,832 Z"
        p-id="9783"
        id="path78"
        clipPath="url(#clipPath89)"
      />
    </g>
  </svg>
);

export const HammerIcon = props => <Icon component={hammer} {...props} />;

export const PlaneIcon = props => <Icon component={plane} {...props} />;
