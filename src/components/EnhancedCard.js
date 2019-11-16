import React from "react";
import styled from "styled-components";
import { Card, Modal } from "antd";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    .ant-modal-mask {
        background-color: transparent;
    }

    .ant-modal-content {
        background-color: transparent !important;
    }

    .ant-modal-body {
        padding: 0 !important;
        background-color: transparent;
    }

    .ant-modal-close {
        top: 20px !important;
        right: 20px !important;
    }

    .ant-alert {
      background-color: #FFFFFF !important;
      border: none !important;

      * {
        color: rgb(62, 63, 66) !important;
      }
    }
`;

const StyledWrapper = styled.div``;

const StyledEnhancedCard = styled(Card)`
  border-radius: 8px;

  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04);
  height: 173px;
  width: 321px;
  cursor: pointer;
  will-change: width, height, box-shadow;
  transition: all 300ms ease-in-out;
  display: flex;
  flex-direction: column;
  height: 150px;

  .ant-card-body {
    height: 100%;
  }

  .ant-card-actions {
    white-space: nowrap;
  }

  .ant-card-bordered {
    border: 1px solid rgb(234, 237, 243);
    border-radius: 8px;
  }

  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.35);

  &:hover {
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.35);
  }
`;

export const StyledModal = styled(Modal)`
  ${StyledEnhancedCard} {
    .ant-list-item-meta-description > :first-child {
      display: none;
    }

    ${props =>
      props.visible
        ? `
            .ant-card-body {
              &> * {
                overflow: auto;
                max-height: 85%;
              }
            }
        `
        : ""}
  }

  @media only screen and (max-width: 800px) {
    & {
      .ant-modal-body {
        padding: 0 !important;
      }

      ${StyledEnhancedCard} {
        margin-top: 0 !important;
        height: auto !important;
      }
    }
  }
`;

export const StyledExpandedWrapper = styled.div`
  .ant-card-head,
  .ant-card-body {
    padding: 0 !important;
  }
`;

export const EnhancedCard = ({
  expand,
  renderExpanded = () => null,
  onClick,
  onClose,
  children,
  style,
  ...otherProps
}) => {
  return (
    <StyledWrapper>
      <GlobalStyle />
      <StyledEnhancedCard style={style} onClick={onClick} {...otherProps}>
        {children}
      </StyledEnhancedCard>
      <StyledModal
        width={600}
        height={600}
        visible={expand}
        centered
        footer={null}
        onCancel={onClose}
      >
        <StyledEnhancedCard style={{ ...style, width: "100%", height: 600 }} {...otherProps}>
          {children}
          <StyledExpandedWrapper>{renderExpanded()}</StyledExpandedWrapper>
        </StyledEnhancedCard>
      </StyledModal>
    </StyledWrapper>
  );
};
