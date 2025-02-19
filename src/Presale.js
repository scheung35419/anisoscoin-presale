import { useState, useEffect } from "react";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Presale() {
  const wallet = useWallet();
  const [amount, setAmount] = useState(1);
  const [balance, setBalance] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [fundsRaised, setFundsRaised] = useState(0);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(1.0);
  const connection = new Connection("https://api.mainnet-beta.solana.com");

  const SELLER_WALLET = new PublicKey("26nBagBn2v2UgEFQFEj5sXqKEaNk389YRu4WSVqdxsaF");
  const HARD_CAP = 100000000;

  const getPricePerToken = (totalSold) => {
    if (totalSold < 1000000) return 0.30;
    if (totalSold < 3000000) return 0.40;
    if (totalSold < 5000000) return 0.50;
    if (totalSold < 7000000) return 0.60;
    if (totalSold < 10000000) return 0.75;
    if (totalSold < 30000000) return 0.80;
    if (totalSold < 60000000) return 1.00;
    if (totalSold < 80000000) return 1.50;
    if (totalSold < 90000000) return 2.00;
    return 2.50;
  };

  useEffect(() => {
    if (wallet.publicKey) {
      connection.getBalance(wallet.publicKey).then((lamports) => {
        setBalance(lamports / 1_000_000_000);
      });
    }
    if (fundsRaised >= HARD_CAP) {
      setIsSoldOut(true);
    }
    setCurrentPrice(getPricePerToken(fundsRaised));
  }, [wallet.publicKey, fundsRaised]);

  const buyTokens = async () => {
    if (!wallet.publicKey) {
      alert("Connect your wallet first");
      return;
    }
    if (fundsRaised >= HARD_CAP) {
      setIsSoldOut(true);
      alert("Presale is Sold Out!");
      return;
    }
    try {
      setTransactionStatus("Pending...");
      const numericAmount = Number(amount);
      // Note: currentPrice is in USD. Make sure you convert this to the correct lamport amount for SOL if needed.
      const totalCost = numericAmount * currentPrice * 1_000_000_000;
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: SELLER_WALLET,
          lamports: totalCost,
        })
      );

      transaction.feePayer = wallet.publicKey;
      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;

      // Use wallet.sendTransaction as recommended by the latest docs
      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      });

      setTransactionStatus(`Transaction successful: ${signature}`);

      const updatedBalance = await connection.getBalance(wallet.publicKey);
      setBalance(updatedBalance / 1_000_000_000);
      setFundsRaised((prev) => prev + numericAmount);
      setCurrentPrice(getPricePerToken(fundsRaised + numericAmount));

      if (fundsRaised + numericAmount >= HARD_CAP) {
        setIsSoldOut(true);
      }
    } catch (error) {
      console.error(error);
      setTransactionStatus("Transaction failed");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <h1 className="text-2xl font-bold">Buy AnisosCoin</h1>
      <p>Current Price: ${currentPrice.toFixed(2)} per AnisosCoin</p>
      <p>Hard Cap: ${HARD_CAP.toLocaleString()} USD</p>
      <p>Funds Raised: ${fundsRaised.toLocaleString()} USD</p>
      {isSoldOut && <p className="text-red-500 font-bold">SOLD OUT!</p>}
      {wallet.publicKey && <p>Your Balance: {balance.toFixed(4)} SOL</p>}
      {transactionStatus && <p className="text-sm text-gray-500">{transactionStatus}</p>}
      <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min="1" disabled={isSoldOut} />
      <button onClick={buyTokens} disabled={isSoldOut}>
        {isSoldOut ? "Sold Out" : "Buy Tokens"}
      </button>
    </div>
  );
}
