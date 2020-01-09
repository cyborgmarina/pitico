import * as React from "react";
import { Tooltip, Icon, Modal, message } from "antd";
import styled from "styled-components";
import QrReader from "react-qr-reader";

const StyledScanQRCode = styled.span`
  display: block;
`;

const StyledModal = styled(Modal)`
  width: 400px !important;
  height: 400px !important;

  .ant-modal-close {
    top: 0 !important;
    right: 0 !important;
  }
`;

const StyledQrReader = styled(QrReader)`
  width: 100%;
  height: 100%;

  img {
    background: black;
  }
`;

export const ScanQRCode = ({ width, onScan = () => null, ...otherProps }) => {
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState(false);
  const ref = React.useRef();

  React.useEffect(() => {
    if (!visible) {
      setError(false);
    }
  }, [visible]);

  return (
    <>
      <Tooltip title="Scan QR code">
        <StyledScanQRCode {...otherProps} onClick={() => setVisible(!visible)}>
          <Icon type="qrcode" />
        </StyledScanQRCode>
      </Tooltip>
      <StyledModal
        title="Scan QR code"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Tooltip
          title={
            <div onClick={() => (ref.current ? ref.current.openImageDialog() : null)}>
              You need to allow camera access to use this feature, otherwise click here to manually
              choose a picture.
            </div>
          }
          visible={visible && error}
          placement="bottom"
        >
          {visible ? (
            <div onClick={() => (error && ref.current ? ref.current.openImageDialog() : null)}>
              <StyledQrReader
                ref={ref}
                delay={300}
                resolution={800}
                onError={() => {
                  setTimeout(() => setError(true), 500);
                }}
                legacyMode={!!error}
                onScan={result => {
                  if (result) {
                    setVisible(false);
                    onScan(result);
                  } else if (error) {
                    message.error("No QR Code found, please try another image.");
                  }
                }}
              />
            </div>
          ) : null}
        </Tooltip>
      </StyledModal>
    </>
  );
};
