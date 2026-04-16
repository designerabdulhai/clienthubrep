export interface Testimonial {
  id: string;
  client_name: string;
  client_title: string;
  review_text: string | null;
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
  website: string;
  website_2: string;
  website_3: string;
  address: string;
}
