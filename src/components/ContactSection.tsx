import { Mail, Phone, MapPin, Facebook, Youtube, MessageSquare } from "lucide-react";
import { Settings } from "@/types";

interface ContactSectionProps {
  settings: Settings | null;
}

export function ContactSection({ settings }: ContactSectionProps) {
  if (!settings) return null;

  const contactItems = [
    { icon: Phone, label: "ফোন", value: settings.phone, href: `tel:${settings.phone}` },
    { icon: Mail, label: "ইমেল", value: settings.email, href: `mailto:${settings.email}` },
    { icon: MessageSquare, label: "হোয়াটসঅ্যাপ", value: settings.whatsapp, href: `https://wa.me/${settings.whatsapp}` },
    { icon: Facebook, label: "ফেসবুক", value: "ফেসবুক পেজ ভিজিট করুন", href: settings.facebook },
    { icon: Youtube, label: "ইউটিউব", value: "ইউটিউব চ্যানেল দেখুন", href: settings.youtube },
    { icon: MapPin, label: "ঠিকানা", value: settings.address, href: null },
  ].filter(item => item.href || item.value);

  return (
    <section id="contact" className="py-24 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">যোগাযোগ করুন</h2>
          <p className="text-white/80 text-lg">আপনার কোনো প্রশ্ন থাকলে বা সাহায্যের দরকার হলে আমাদের সাথে যোগাযোগ করতে পারেন।</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contactItems.map((item, index) => (
            <div key={index} className="flex items-start gap-4 p-6 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 shadow-lg shadow-secondary/20">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1">{item.label}</p>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-white hover:text-secondary transition-colors break-all">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-lg font-semibold text-white">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
