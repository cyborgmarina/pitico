/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import Paragraph from "antd/lib/typography/Paragraph";
import { notification } from "antd";
import Big from "big.js";
import * as slpjs from "slp-sdk/node_modules/slpjs";
import { getWallet, createWallet } from "./createWallet";
import usePrevious from "./usePrevious";
import withSLP from "./withSLP";
import getTokenInfo from "./getTokenInfo";

const normalizeSlpBalancesAndUtxo = (SLP, slpBalancesAndUtxo, wallet) => {
  slpBalancesAndUtxo.forEach(balanceAndUtxo => {
    const derivatedAccount = wallet.Accounts.find(
      account => account.slpAddress === balanceAndUtxo.address
    );
    balanceAndUtxo.account = derivatedAccount;
  });

  return slpBalancesAndUtxo.sort((a, b) =>
    a.result.satoshis_available_bch > b.result.satoshis_available_bch ? -1 : 1
  );
};

const normalizeUtxos = (SLP, slpBalancesAndUtxo) =>
  slpBalancesAndUtxo.reduce(
    (previousBalanceAndUtxo, balanceAndUtxo) => [
      ...previousBalanceAndUtxo,
      ...balanceAndUtxo.result.nonSlpUtxos.map(utxo => ({
        ...utxo,
        wif: balanceAndUtxo.account.fundingWif
      }))
    ],
    []
  );

const normalizeBalance = (SLP, slpBalancesAndUtxo) => {
  const totalBalanceInSatohis = slpBalancesAndUtxo.reduce(
    (previousBalance, balance) => previousBalance + balance.result.satoshis_available_bch,
    0
  );
  return {
    totalBalanceInSatohis,
    totalBalance: SLP.BitcoinCash.toBitcoinCash(totalBalanceInSatohis)
  };
};

const normalizeTokens = async (SLP, slpBalancesAndUtxo, wallet) => {
  const tokensMap = {};
  slpBalancesAndUtxo.forEach(balanceAndUtxo => {
    Object.entries(balanceAndUtxo.result.slpTokenBalances).forEach(tokenBalanceEntry => {
      const tokenId = tokenBalanceEntry[0];
      let token = tokensMap[tokenId]
        ? tokensMap[tokenId]
        : {
            tokenId,
            satoshisBalance: 0,
            info: null
          };
      token.satoshisBalance += Number(tokenBalanceEntry[1]);
      tokensMap[tokenId] = token;
    });
  });

  const tokens = Object.values(tokensMap).sort((a, b) => (a.tokenId > b.tokenId ? 1 : -1));

  try {
    const infos = await getTokenInfo(wallet.slpAddresses, tokens.map(token => token.tokenId));
    tokens.forEach(token => {
      token.info = infos.find(i => i.tokenIdHex === token.tokenId);
      token.balance = new Big(token.satoshisBalance).div(
        new Big(Math.pow(10, token.info.decimals))
      );
    });
  } catch (error) {}

  return tokens;
};

const update = withSLP(
  async (SLP, { wallet, setBalances, setTokens, setSlpBalancesAndUtxo, setUtxos }) => {
    try {
      if (!wallet) {
        return;
      }
      const bitboxNetwork = new slpjs.BitboxNetwork(SLP);
      const slpBalancesAndUtxo = await bitboxNetwork.getAllSlpBalancesAndUtxos(wallet.slpAddresses);
      setSlpBalancesAndUtxo(normalizeSlpBalancesAndUtxo(SLP, slpBalancesAndUtxo, wallet));

      setUtxos(normalizeUtxos(SLP, slpBalancesAndUtxo, wallet));

      setBalances(normalizeBalance(SLP, slpBalancesAndUtxo));
      setTokens(await normalizeTokens(SLP, slpBalancesAndUtxo, wallet));
    } catch (error) {}
  }
);

export const useWallet = () => {
  const [wallet, setWallet] = useState(getWallet());
  const [balances, setBalances] = useState({});
  const [tokens, setTokens] = useState([]);
  const [slpBalancesAndUtxo, setSlpBalancesAndUtxo] = useState([]);
  const [utxos, setUtxos] = useState([]);
  const [loading, setLoading] = useState(true);

  const previousBalances = usePrevious(balances);

  if (
    previousBalances &&
    balances &&
    "totalBalance" in previousBalances &&
    "totalBalance" in balances &&
    new Big(balances.totalBalance).minus(previousBalances.totalBalance).gt(0)
  ) {
    notification.success({
      message: "BCH",
      description: (
        <Paragraph>
          You received {Number(balances.totalBalance - previousBalances.totalBalance).toFixed(8)}{" "}
          BCH!
        </Paragraph>
      ),
      duration: 2
    });
  }

  useEffect(() => {
    const updateRoutine = () => {
      update({
        wallet: getWallet(),
        tokens,
        setBalances,
        setTokens,
        setSlpBalancesAndUtxo,
        setUtxos,
        setLoading
      }).finally(() => {
        setLoading(false);
        setTimeout(updateRoutine, 10000);
      });
    };

    updateRoutine();
  }, []);

  return {
    wallet,
    slpBalancesAndUtxo,
    utxos,
    balances,
    tokens,
    loading,
    update: () =>
      update({ wallet, setBalances, setTokens, setLoading, setSlpBalancesAndUtxo, setUtxos }),
    createWallet: importMnemonic => {
      const newWallet = createWallet(importMnemonic);
      setWallet(newWallet);
      setLoading(true);
      update({ wallet: newWallet, setBalances, setTokens, setLoading }).finally(() =>
        setLoading(false)
      );
    }
  };
};
