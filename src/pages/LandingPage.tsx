import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Testimonial, Settings } from "@/types";
import { TestimonialCard as TestimonialCardComponent } from "@/components/TestimonialCard";
const TestimonialCard = TestimonialCardComponent as any;
import { ContactSection } from "@/components/ContactSection";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [testimonialsRes, settingsRes] = await Promise.all([
          supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
          supabase.from("settings").select("*").single(),
        ]);

        if (testimonialsRes.data) setTestimonials(testimonialsRes.data);
        if (settingsRes.data) setSettings(settingsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const featuredTestimonials = testimonials.filter(t => t.is_featured);
  const otherTestimonials = testimonials.filter(t => !t.is_featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={settings.site_name} className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                {settings?.site_name?.charAt(0) || "T"}
              </div>
            )}
            <span className="text-xl font-bold text-primary tracking-tight">
              {settings?.site_name || "রিভিউ হাব"}
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a href="#contact" className="hidden md:block px-6 py-2 bg-secondary text-white rounded-full text-sm font-medium hover:bg-secondary/90 transition-colors shadow-md shadow-secondary/10">
              যোগাযোগ করুন
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-6">
              ক্লাইন্টরা <span className="text-secondary">যা বলছেন</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-10 font-medium">
              সরাসরি ক্লাইন্টের কাছ থেকে শুনুন। আমি কীভাবে তাদের সাহায্য করেছি তা জেনে নিন।
            </p>
            <div className="flex justify-center gap-4">
              <a href="#testimonials" className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-colors shadow-lg shadow-primary/20">
                রিভিউগুলো দেখুন
              </a>
              <a href="#contact" className="px-8 py-4 border border-border text-primary rounded-full font-medium hover:bg-muted transition-colors">
                যোগাযোগ করুন
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-neutral-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neutral-300 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Featured Section */}
      {featuredTestimonials.length > 0 && (
        <section id="featured" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-primary uppercase tracking-widest mb-2">সেরা রিভিউ</h2>
              <div className="h-1.5 w-20 bg-secondary rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredTestimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t as Testimonial} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Testimonials Grid */}
      <section id="testimonials" className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Client Feedback</h2>
            <p className="text-muted-foreground">ক্লাইন্টের কাছ থেকে পাওয়া কিছু ভিডিও এবং টেক্সট রিভিউ।</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherTestimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t as Testimonial} />
              ))}
            </div>
          )}
          
          {!loading && testimonials.length === 0 && (
            <div className="text-center py-20 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200">
              <p className="text-neutral-400 text-lg">এখনো কোনো রিভিউ যোগ করা হয়নি।</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection settings={settings} />
      
      {/* Footer */}
      <footer className="py-12 border-t border-border text-center text-muted-foreground text-sm">
        <div className="container mx-auto px-4">
          <p className="mb-4">© {new Date().getFullYear()} {settings?.site_name || "রিভিউ হাব"}। সব অধিকার সংরক্ষিত।</p>
          <Link 
            to="/admin/login" 
            className="text-muted-foreground hover:text-primary dark:hover:text-secondary transition-colors inline-flex items-center gap-2 font-medium"
          >
            অ্যাডমিন লগইন
          </Link>
        </div>
      </footer>
    </div>
  );
}
