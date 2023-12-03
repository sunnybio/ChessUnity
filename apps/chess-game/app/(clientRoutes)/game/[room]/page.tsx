"use client";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.ts";
import { useEffect, useState } from "react";
const GameRoom = (): JSX.Element => {
  const [position, setPostion] = useState("start");
  console.log("position", position);
  useEffect(() => {
    const game = new Chess();
    let move = game.moves()[3];
    game.move(move);
    console.log("move", move);
    console.log("new position", game.fen().toString());
    const timer = setTimeout(() => {
      setPostion(`${game.fen()}`);
    }, 5000);
  }, []);
  if (typeof window !== "undefined") {
    return (
      <div className="flex rounded justify-center items-center bg-black h-full">
        <Chessboard position={position} />
      </div>
    );
  }
};

export default GameRoom;
