"use client";

import Chessboard from "chessboardjsx";

export function Board(): JSX.Element {
  return (
    <div className="bg-amber-400 align-middle w-max-">
      <Chessboard position="start" />
    </div>
  );
}

