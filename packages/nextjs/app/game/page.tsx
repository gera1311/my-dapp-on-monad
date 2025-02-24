"use client";

// import Link from "next/link";
import type { NextPage } from "next";
import TetrisGame from "~~/components/TetrisGame";

// import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-base-300">
      <div className="border-4 border-primary rounded-xl p-6 bg-base-100 shadow-neon">
        <h1 className="text-4xl font-bold text-center mb-6 text-primary neon-text">
          Welcome to Tetris on Scaffold-ETH 2!
        </h1>
        <TetrisGame />
      </div>
    </div>
  );
};

export default Home;
