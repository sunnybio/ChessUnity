"use client";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.ts";
import { useEffect, useState } from "react";
const GameRoom = (): JSX.Element => {
  const [position, setPostion] = useState("start");
  const [msgList, setmsgList] = useState(["hello", "world"]);
  console.log("position", position);
  useEffect(() => {
    const game = new Chess();
    let move = game.moves()[3];
    game.move(move);
    const timer = setTimeout(() => {
      setPostion(game.fen());
    }, 1000);
  }, []);
  if (typeof window !== "undefined") {
    return (
      <div className="grid grid-cols-4 h-screen w-full bg-black">
        <div className="col-span-1 bg-red-50">
          <div className="block">{msgList}</div>
        </div>
        <div className="col-span-3 mx-auto">
          <Chessboard position={position} />
        </div>
      </div>
    );
  }
};

export default GameRoom;
