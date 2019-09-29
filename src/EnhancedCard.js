import React from 'react';
import styled from 'styled-components';
import { Card, Modal } from 'antd';
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    .ant-modal-mask {
        background-color: transparent;
    }

    .ant-modal-content {
        background-color: transparent !important;
    }

    .ant-modal-body {
        padding: 0;
        background-color: transparent;
    }

    .ant-modal-close {
        top: 40px !important;
        right: -100px !important;
    }
`;

const StyledWrapper = styled.div`

`;

const StyledEnhancedCard = styled(Card)`
    cursor: pointer;
    will-change: width, height, box-shadow;
    transition: all 300ms ease-in-out;
    display: flex;
    flex-direction: column;
    height: 150px;

    .ant-card-body {
        height: 100%;
    }

    &:hover {
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.35);
    }
`;

export const StyledModal = styled(Modal)`
    ${StyledEnhancedCard} {
        ${props => props.visible ? `
            width: 600px !important;
            max-width: 100vw !important;
            height: 600px !important;
        `: ''}
    }

    @media only screen and (max-width: 800px) {
        & {
            position: fixed !important;
            top: 0 !important;
            left: 0;
            margin-top: 0 !important;

            .ant-modal-close {
                right: -50px !important;
                top: 10px !important;
            }

            .ant-modal-body {
                padding: 0 !important;
            }

            ${StyledEnhancedCard} {
                margin-top: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
            }
        }
    }
`;

export const StyledExpandedWrapper = styled.div`
    .ant-card-head, .ant-card-body {
        padding: 0;
    }

    .ant-card-body {
        overflow: auto;
        max-height: 400px;
    }
`;

export const EnhancedCard = ({ expand, renderExpanded = () => null, onClick, onClose, children, ...otherProps }) => {
    return (
        <StyledWrapper>
            <GlobalStyle />
            <StyledEnhancedCard onClick={onClick} {...otherProps}>
                {children}
            </StyledEnhancedCard>
            <StyledModal visible={expand} centered footer={null} onCancel={onClose}>
                <StyledEnhancedCard {...otherProps}>
                    {children}
                    <StyledExpandedWrapper>
                        {renderExpanded()}
                    </StyledExpandedWrapper>
                </StyledEnhancedCard>
            </StyledModal>
        </StyledWrapper>
    );
};
