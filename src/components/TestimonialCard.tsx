import { useState } from "react";
import { Play, Quote } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { RatingStars } from "./RatingStars";
import { VideoModal } from "./VideoModal";
import { Testimonial } from "@/types";
import { motion } from "motion/react";

interface TestimonialCardProps {
  testimonial: Testimonial;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function TestimonialCard({ testimonial, isExpanded: controlledExpanded, onToggle }: TestimonialCardProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [localExpanded, setLocalExpanded] = useState(false);

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : localExpanded;
  const toggleExpanded = () => {
    if (onToggle) {
      onToggle();
    } else {
      setLocalExpanded(!localExpanded);
    }
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = testimonial.video_url ? getYoutubeId(testimonial.video_url) : null;
  const thumbnailUrl = testimonial.thumbnail_url || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : "https://picsum.photos/seed/video/800/450");

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 border-neutral-200">
          {testimonial.thumbnail_url && (
            <div 
              className={`relative aspect-video overflow-hidden ${testimonial.video_url ? 'cursor-pointer group' : ''}`}
              onClick={() => testimonial.video_url && setIsVideoOpen(true)}
            >
              <img
                src={testimonial.thumbnail_url}
                alt={testimonial.client_name}
                className={`w-full h-full object-cover transition-transform duration-500 ${testimonial.video_url ? 'group-hover:scale-105' : ''}`}
                referrerPolicy="no-referrer"
              />
              {testimonial.video_url && (
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-secondary fill-secondary ml-1" />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!testimonial.thumbnail_url && testimonial.video_url && (
            <div 
              className="relative aspect-video cursor-pointer group overflow-hidden"
              onClick={() => setIsVideoOpen(true)}
            >
              <img
                src={thumbnailUrl}
                alt={testimonial.client_name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-secondary fill-secondary ml-1" />
                </div>
              </div>
            </div>
          )}
          
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <RatingStars rating={testimonial.rating} />
              <Quote className="w-8 h-8 text-secondary/20 fill-secondary/20" />
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow">
            {testimonial.review_text && (
              <div className="relative">
                <p className={`text-foreground/90 italic leading-relaxed font-medium transition-all duration-300 ${!isExpanded ? 'line-clamp-2' : ''}`}>
                  "{testimonial.review_text}"
                </p>
                {testimonial.review_text.length > 80 && (
                  <button 
                    onClick={toggleExpanded}
                    className="text-secondary text-sm font-bold mt-2 hover:text-secondary/80 transition-colors focus:outline-none"
                  >
                    {isExpanded ? "See less" : "See more"}
                  </button>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="pt-4 border-t border-border/50 bg-muted/30">
            <div>
              {testimonial.client_name && (
                <p className="font-bold text-primary dark:text-white">{testimonial.client_name}</p>
              )}
              {testimonial.client_title && (
                <p className="text-sm text-muted-foreground font-medium">{testimonial.client_title}</p>
              )}
              {!testimonial.client_name && !testimonial.client_title && (
                <p className="text-sm text-muted-foreground font-medium italic">Anonymous</p>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {testimonial.video_url && (
        <VideoModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          videoUrl={testimonial.video_url}
          title={`${testimonial.client_name}-এর ভিডিও প্রশংসাপত্র`}
        />
      )}
    </>
  );
}
