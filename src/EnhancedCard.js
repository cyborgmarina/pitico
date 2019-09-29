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

    .ant-modal-close-x {
        display: none !important;
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
            height: 600px !important;
            z-index: 2;
        `: ''}
    }
`;

export const EnhancedCard = ({ expand, onClick, onClose, children, ...otherProps }) => {
    return (
        <StyledWrapper>
            <GlobalStyle />
            <StyledEnhancedCard onClick={onClick} {...otherProps}>
                {children}
            </StyledEnhancedCard>
            <StyledModal visible={expand} centered footer={null} onCancel={onClose}>
                <StyledEnhancedCard {...otherProps}>
                    {children}
                </StyledEnhancedCard>
            </StyledModal>
        </StyledWrapper>
    );
};
