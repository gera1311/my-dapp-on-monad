"use client";

// import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useBalance } from "wagmi";

// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address, chain, isConnected } = useAccount();
  const result = useBalance({
    address: address,
  });

  return (
    <>
      <div className="grid grid-cols-12 gap-x-4 mx-5 my-5">
        <div className="col-span-6">Walllet Connection Status</div>
        <div className="col-span-6">Network</div>
        <div className="col-span-6">
          <input
            type="text"
            placeholder={isConnected ? "Connected" : "Not Connected"}
            className={`input ${isConnected ? "!input-success" : "!input-error"} rounded-md w-full`}
            disabled
          />
        </div>
        <div className="col-span-6">
          <input
            type="text"
            placeholder={isConnected ? chain?.name || "Unknow" : "No Network"}
            className={`input ${isConnected ? "!input-success" : "!input-error"} rounded-md w-full`}
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-4 mx-5 my-5">
        <div className="col-span-4">Wallet Address</div>
        <div className="col-span-4">Monad Name Service</div>
        <div className="col-span-4">Wallet Balance</div>
        <div className="col-span-4">
          <input
            type="text"
            placeholder={isConnected ? address : "Not Connected"}
            className={`input ${isConnected ? "!input-success" : "!input-error"} rounded-md w-full`}
            disabled
          />
        </div>
        <div className="col-span-4">
          <input type="text" placeholder="xxxxx.nad" className="input !input-error rounded-md w-full" disabled />
        </div>
        <div className="col-span-4">
          <input
            type="text"
            placeholder={
              result.isLoading
                ? "Loading..."
                : result.data
                  ? `${result.data.formatted} ${result.data.symbol}`
                  : "Not Connected"
            }
            className={`input ${isConnected ? "!input-success" : "!input-error"} rounded-md w-full`}
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-8 gap-x-4 mx-5 my-5">
        <div className="col-span-4">Wallet NFT count</div>
        <div className="col-span-4">
          <button className="btn">Add Monad Network</button>
        </div>
        <div className="col-span-4">
          <input type="text" placeholder="0 NFT" className="input !input-error rounded-md w-100" disabled />
        </div>
      </div>
    </>
  );
};

export default Home;
