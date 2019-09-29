import React, { useState } from 'react';
import styled from 'styled-components';
import RawQRCode from 'qrcode.react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Popover } from 'antd';

export const StyledRawQRCode = styled(RawQRCode)`
    cursor: pointer;
`;

export const QRCode = ({ address, size = 125, onClick = () => null, ...otherProps}) => {
    const [visible, setVisible] = useState(false);

    const handleOnClick = (evt) => {
        setVisible(true);
        setTimeout(() => setVisible(false), 3000);
        onClick(evt);
    }

    return (
        <Popover content="copied!" visible={visible}>
            <CopyToClipboard text={address}>
                <RawQRCode onClick={handleOnClick} value={address || ''} size={size} {...otherProps} />
            </CopyToClipboard>
        </Popover>
    )
};
