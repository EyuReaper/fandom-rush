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
      <div className="animate-pulse bg-white/5 rounded-full w-10 h-10 border border-white/10" />
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden md:block text-right">
          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Logged in as</p>
          <p className="text-[10px] font-bold text-white italic">{session.user.name}</p>
        </div>
        <div className="group relative">
            <button
            onClick={handleSignOut}
            className="w-10 h-10 rounded-full border border-white/10 overflow-hidden hover:border-red-500/50 transition-colors"
            >
            {session.user.image ? (
                <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
            ) : (
                <User className="w-full h-full p-2 text-gray-400" />
            )}
            <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <LogOut className="w-4 h-4 text-white" />
            </div>
            </button>
        </div>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSignIn}
      className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
    >
      <LogIn className="w-4 h-4 text-cyan-400" />
      <span className="text-[10px] font-black uppercase tracking-widest">Sign In</span>
    </motion.button>
  );
}
