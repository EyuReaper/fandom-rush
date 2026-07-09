import { authClient } from "../lib/auth-client";
import { LogIn, LogOut, User } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginButton() {
  const { data: session, isPending } = authClient.useSession();

  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.origin,
    });
  };

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  if (isPending) {
    return (
      <div className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl animate-pulse shadow-2xl">
        <div className="w-7 h-7 rounded-full bg-white/10" />
      </div>
    );
  }

  if (session) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-4 p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-colors shadow-2xl"
      >
        <div className="hidden md:block text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PLAYER</p>
          <p className="text-sm font-bold text-white italic leading-tight">{session.user.name}</p>
        </div>
        <div className="group relative">
          <button
            onClick={handleSignOut}
            className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden hover:border-red-500/50 transition-colors"
          >
            {session.user.image ? (
              <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-full h-full p-2.5 text-gray-400" />
            )}
            <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
              <LogOut className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSignIn}
      className="flex items-center gap-3 p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-colors shadow-2xl"
    >
      <LogIn className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
      <span className="text-xs font-black uppercase tracking-widest">Sign In</span>
    </motion.button>
  );
}
