import * as React from "react";
import { Tooltip, Icon, Modal } from "antd";
import styled from "styled-components";
import QrReader from "react-qr-reader";

const StyledScanQRCode = styled.span`
  width: ${props => props.width || "26px"};
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
`;

export const ScanQRCode = ({ width, onScan = () => null, ...otherProps }) => {
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState(false);

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
          title="You need to allow camera access to use this feature."
          visible={visible && error}
          placement="bottom"
        >
          {visible ? (
            <StyledQrReader
              delay={500}
              resolution={800}
              onError={() => {
                setTimeout(() => setError(true), 500);
              }}
              onScan={result => {
                if (result) {
                  setVisible(false);
                  onScan(result);
                }
              }}
            />
          ) : null}
        </Tooltip>
      </StyledModal>
    </>
  );
};
