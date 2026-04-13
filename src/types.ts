export interface Testimonial {
  id: string;
  client_name: string;
  client_title: string;
  review_text: string;
  rating: number;
  video_url: string | null;
  thumbnail_url: string | null;
  is_featured: boolean;
  section: string;
  created_at: string;
}

export interface Settings {
  id: number;
  site_name: string;
  logo_url: string | null;
  phone: string;
  email: string;
  whatsapp: string;
  facebook: string;
  youtube: string;
  address: string;
}
