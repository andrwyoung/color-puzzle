// this is the file where you can first "see" what you code

import Board from "./components/board";

export default function App() {
  return (
    <div className="h-screen flex flex-col gap-8 items-center  justify-center bg-white">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-4xl font-header font-normal">Color Puzzle Game!</h1>
        <p className="font-body">hey there, this is a game game game</p>
      </div>

      <Board />
    </div>
  );
}
