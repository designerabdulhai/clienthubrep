import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Settings } from "@/types";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings as SettingsIcon, 
  LogOut, 
  User,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./ThemeToggle";

export default function AdminLayout() {
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/admin/login");
        setLoading(false);
        return;
      }
      
      setUser(user);

      try {
        const { data: settingsData } = await supabase.from("settings").select("*").single();
        if (settingsData) {
          setSettings(settingsData);
          if (settingsData.site_name) {
            document.title = `${settingsData.site_name} - অ্যাডমিন`;
          }
          if (settingsData.logo_url) {
            const favicon = document.getElementById("favicon") as HTMLLinkElement;
            if (favicon) {
              favicon.href = settingsData.logo_url;
            }
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
      
      setLoading(false);
    }
    init();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "ড্যাশবোর্ড", path: "/admin" },
    { icon: MessageSquare, label: "রিভিউ", path: "/admin/testimonials" },
    { icon: SettingsIcon, label: "সেটিংস", path: "/admin/settings" },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center">একটু অপেক্ষা করুন...</div>;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-primary border-r border-white/10 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_name} className="h-8 w-auto object-contain" />
              ) : (
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {settings?.site_name?.charAt(0) || "T"}
                </div>
              )}
              <span className="text-lg font-bold tracking-tight text-white truncate">
                {settings?.site_name || "অ্যাডমিন প্যানেল"}
              </span>
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <nav className="flex-grow p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  location.pathname === item.path 
                    ? "bg-secondary text-white shadow-lg shadow-secondary/20" 
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <User className="w-4 h-4 text-white/60" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-white/80 truncate">{user?.email}</p>
                <p className="text-[10px] text-white/70 uppercase tracking-wider">অ্যাডমিন</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-300 hover:text-red-400 hover:bg-white/5 rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              লগ আউট
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </Button>
            <div className="lg:hidden flex items-center gap-2 min-w-0">
              {settings?.logo_url && (
                <img src={settings.logo_url} alt={settings.site_name} className="h-6 w-auto object-contain flex-shrink-0" />
              )}
              <span className="font-bold text-primary">
                {settings?.site_name || "অ্যাডমিন প্যানেল"}
              </span>
            </div>
          </div>
          <ThemeToggle />
        </header>
        
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
