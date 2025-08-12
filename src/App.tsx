// this is the file where you can first "see" what you code

import Board from "./components/game";

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col gap-8 items-center overflow-y-auto justify-center bg-background">
      <Board />
    </div>
  );
}
