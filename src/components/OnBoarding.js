import React, { useState } from "react";
import { Button, Row, Col, Card } from "antd";
import { getAddress } from "bitcoin-wallet-api";
import { QRCode } from "./QRCode";

const SLP = "SLP";
const BCH = "BCH";

export const OnBoarding = ({ history }) => {
  const [error, setError] = useState();
  const [slpAddress, setSlpAddress] = useState();
  const [cashAddress, setCashAddress] = useState();
  const [selection, setSelection] = useState();

  const selectSlp = () => {
    if (!selection || selection === BCH) {
      setSelection(SLP);
    }

    getAddress({ protocol: SLP })
      .then(({ address }) => {
        setSlpAddress(address);
      })
      .catch(err => {
        setError("There was an error getting the address.");
      });
  };

  const selectBch = () => {
    if (!selection || selection === SLP) {
      setSelection(BCH);
    }

    getAddress({ protocol: BCH })
      .then(({ address }) => {
        setCashAddress(address);
      })
      .catch(err => {
        setError("There was an error getting the address.");
      });
  };

  console.log("nicktest", selection, slpAddress, cashAddress, error);
  const displayAddress = selection === SLP ? slpAddress : cashAddress;

  return (
    <Row gutter={8} justify="center" type="flex">
      <Col lg={8} span={24} style={{ marginTop: 8 }}>
        <Card title={<h2>Receive</h2>} style={{ height: "100%" }} bordered={false}>
          <div style={{}}>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <Button onClick={() => selectSlp()}>SLP</Button>
            <Button onClick={() => selectBch()}>BCH</Button>

            {selection && displayAddress && <QRCode id="borderedQRCode" address={displayAddress} />}
          </div>
        </Card>
      </Col>
    </Row>
  );
};
