import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import Presale from './Presale';

// Solana Wallet Adapter
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

const network = WalletAdapterNetwork.Mainnet;
const endpoint = clusterApiUrl(network);

const wallets = useMemo(
  () => [
    new PhantomWalletAdapter(),
  ],
  [network]
);

ReactDOM.render(
  <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets} autoConnect>
      <Presale />
    </WalletProvider>
  </ConnectionProvider>,
  document.getElementById('root')
);
