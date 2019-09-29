import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card } from 'antd';

const StyledEnhancedCard = styled(Card)`
    cursor: pointer;
    will-change: width, height, box-shadow;
    transition: all 300ms ease-in-out;
    display: flex;
    flex-direction: column;
    height: 140px;
    
    .ant-card-body {
        height: 100%;
    }

    &:hover {
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.35);
    }

    ${props => props.expand ? `
        & {
            position: absolute;
            left: 0;
            top: 0;
            width: 600px !important;
            height: 600px !important;
            z-index: 2;
        }
    `: ''}
`;

export const EnhancedCard = ({ expand, children, ...otherProps }) => {
    // const [expand, setExpand] = useState(false);


    return (
        <StyledEnhancedCard expand={expand} {...otherProps}>
            {children}
        </StyledEnhancedCard>
    );
};
