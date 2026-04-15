import React, { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Settings } from "@/types";
import { motion, AnimatePresence } from "motion/react";

export function WhatsAppButton() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data } = await supabase.from("settings").select("*").single();
        if (data) setSettings(data);
      } catch (error) {
        console.error("Error fetching settings for WhatsApp button:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  if (loading || !settings?.whatsapp) return null;

  const whatsappUrl = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`;

  return (
    <AnimatePresence>
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-[#20ba5a] transition-colors group p-3"
        aria-label="Contact on WhatsApp"
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
          alt="WhatsApp" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
        
        {/* Tooltip */}
        <span className="absolute right-full mr-4 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          আমাদের সাথে হোয়াটসঅ্যাপে কথা বলুন
        </span>
        
        {/* Ping Animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none"></span>
      </motion.a>
    </AnimatePresence>
  );
}
