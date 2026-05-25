import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { logout } from "../../features/auth/services/auth.service";

export default function Navbar() {
  const nav = useNavigate();
  const { user, setUser } = useAuth();

  return (
    <div className="h-16 lg:flex w-full border-b border-gray-200 dark:border-gray-800 hidden px-10">
      <div className="flex h-full text-gray-600 dark:text-gray-400">
        <span className="cursor-default h-full border-b-2 border-blue-500 text-blue-500 dark:text-white dark:border-white inline-flex items-center mr-8 font-medium text-sm">
          ReclamaCRM
        </span>
      </div>
      <div className="ml-auto flex items-center space-x-7">
        <button onClick={() => logout(setUser, nav)} className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors">
          <span className="relative flex-shrink-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
              {user?.nom?.charAt(0)}{user?.prenom?.charAt(0)}
            </div>
            <span className="absolute right-0 -mb-0.5 bottom-0 w-2 h-2 rounded-full bg-green-500 border border-white dark:border-gray-900"></span>
          </span>
          <span className="ml-2 text-sm">{user?.nom} {user?.prenom}</span>
          <LogOut size={14} className="ml-3 text-gray-400" />
        </button>
      </div>
    </div>
  );
}