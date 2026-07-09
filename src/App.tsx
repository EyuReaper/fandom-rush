import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GameScreen from "./components/GameScreen";
import MainMenu from "./components/MainMenu";
import { useGameStore } from "./stores/useGameStore";
import { audioManager } from "./lib/audioManager";

function App() {
  const isPlaying = useGameStore((state) => state.isPlaying);
  const currentClue = useGameStore((state) => state.currentClue);

  useEffect(() => {
    audioManager.init();
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isPlaying || currentClue ? (
        <motion.div
          key="game"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.25 }}
          className="w-full h-full"
        >
          <GameScreen />
        </motion.div>
      ) : (
        <motion.div
          key="menu"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="w-full h-full"
        >
          <MainMenu />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
