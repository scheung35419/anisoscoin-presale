import React from 'react';
import ReactDOM from 'react-dom';
import Presale from './Presale';
import { WalletProvider } from '@solana/wallet-adapter-react';

const App = () => {
  return (
    <WalletProvider>
      <Presale />
    </WalletProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));