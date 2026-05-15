import GameScreen from "./components/GameScreen";
import MainMenu from "./components/MainMenu";
import { useGameStore } from "./stores/useGameStore";

function App() {
  const isPlaying = useGameStore((state) => state.isPlaying);
  const currentClue = useGameStore((state) => state.currentClue);

  // Show GameScreen if playing or if game just ended (to show game over)
  if (isPlaying || currentClue) {
    return <GameScreen />;
  }

  return <MainMenu />;
}

export default App;
