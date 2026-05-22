import { useEffect } from "react";
import GameScreen from "./components/GameScreen";
import MainMenu from "./components/MainMenu";
import { useGameStore } from "./stores/useGameStore";
import { audioManager } from "./lib/audioManager";

function App() {
  const isPlaying = useGameStore((state) => state.isPlaying);
  const currentClue = useGameStore((state) => state.currentClue);

  useEffect(() => {
    // Pre-initialize audio objects
    audioManager.init();
  }, []);

  // Show GameScreen if playing or if game just ended (to show game over)
  if (isPlaying || currentClue) {
    return <GameScreen />;
  }

  return <MainMenu />;
}

export default App;
