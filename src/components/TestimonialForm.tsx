import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Testimonial } from "@/types";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

const formSchema = z.object({
  client_name: z.string().optional(),
  client_title: z.string().optional(),
  review_text: z.string().optional(),
  rating: z.number().min(1).max(5),
  is_featured: z.boolean().default(false),
  section: z.string().default("client_feedback"),
  video_url: z.string().optional(),
  thumbnail_url: z.string().optional(),
});

interface TestimonialFormProps {
  initialData?: Testimonial;
  onSuccess: () => void;
}

type TestimonialFormValues = z.infer<typeof formSchema>;

export function TestimonialForm({ initialData, onSuccess }: TestimonialFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      client_name: initialData.client_name,
      client_title: initialData.client_title,
      review_text: initialData.review_text,
      rating: initialData.rating,
      is_featured: initialData.is_featured,
      section: initialData.section || "client_feedback",
      video_url: initialData.video_url || "",
      thumbnail_url: initialData.thumbnail_url || "",
    } : {
      client_name: "",
      client_title: "",
      review_text: "",
      rating: 5,
      is_featured: false,
      section: "client_feedback",
      video_url: "",
      thumbnail_url: "",
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'thumbnail') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;
      const bucketName = 'testimonials';

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.includes('bucket_not_found') || uploadError.message.includes('Bucket not found')) {
          throw new Error("সুপাবেস 'Storage' বিভাগে 'testimonials' নামে কোনো বাকেট পাওয়া যায়নি। মনে রাখবেন, ডাটাবেজ টেবিল এবং স্টোরেজ বাকেট আলাদা। দয়া করে Storage মেনু থেকে একটি পাবলিক বাকেট তৈরি করুন।");
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (type === 'video') {
        form.setValue('video_url', publicUrl);
      } else {
        form.setValue('thumbnail_url', publicUrl);
      }
      
      toast.success(`${type === 'video' ? 'ভিডিও' : 'থাম্বনেইল'} সফলভাবে আপলোড করা হয়েছে`);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      if (initialData) {
        const { error } = await supabase
          .from("testimonials")
          .update(values)
          .eq("id", initialData.id);
        if (error) throw error;
        toast.success("রিভিউ আপডেট করা হয়েছে।");
      } else {
        const { error } = await supabase
          .from("testimonials")
          .insert([values]);
        if (error) throw error;
        toast.success("নতুন রিভিউ যোগ করা হয়েছে।");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="client_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ক্লাইন্টের নাম (ঐচ্ছিক)</FormLabel>
                <FormControl>
                  <Input placeholder="জন ডো" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="client_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>পদবি/পরিচয় (ঐচ্ছিক)</FormLabel>
                <FormControl>
                  <Input placeholder="সিইও, টেককর্প" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="review_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>রিভিউ (ঐচ্ছিক)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="ক্লাইন্ট কী বলেছেন তা এখানে লিখুন (যদি থাকে)..." 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>রেটিং (১-৫)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="5" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="section"
            render={({ field }) => (
              <FormItem>
                <FormLabel>সেকশন সিলেক্ট করুন</FormLabel>
                <FormControl>
                  <select 
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="client_feedback">Client Feedback</option>
                    <option value="site_visit">Site Visit and Supervision</option>
                    <option value="completed_house">আমাদের ডিজাইনে কমপ্লিট করা বাড়ি</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>সেরা (উপরে দেখাবে)</FormLabel>
                  <FormDescription>
                    এটি ল্যান্ডিং পেজের একদম উপরে দেখাবে।
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

        <div className="space-y-4 border rounded-lg p-4 bg-neutral-50/50">
          <FormLabel className="text-base text-primary">ভিডিও</FormLabel>
          
          <FormField
            control={form.control}
            name="video_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ভিডিও লিঙ্ক (ইউটিউব বা অন্য লিঙ্ক)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  ইউটিউব লিঙ্ক বা ভিডিওর সরাসরি লিঙ্ক এখানে দিন।
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-neutral-50 px-2 text-neutral-500">অথবা ফাইল আপলোড করুন</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <FormLabel>ভিডিও ফাইল আপলোড করুন</FormLabel>
              <div className="flex items-center gap-4">
                <Input 
                  type="file" 
                  accept="video/*" 
                  onChange={(e) => handleFileUpload(e, 'video')}
                  disabled={uploading}
                />
                {uploading && <Loader2 className="animate-spin" />}
              </div>
            </div>
            <div className="space-y-2">
              <FormLabel>থাম্বনেইল ছবি আপলোড করুন</FormLabel>
              <div className="flex items-center gap-4">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileUpload(e, 'thumbnail')}
                  disabled={uploading}
                />
                {uploading && <Loader2 className="animate-spin" />}
              </div>
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="thumbnail_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>থাম্বনেইল ইউআরএল (ঐচ্ছিক)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com/thumbnail.jpg" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-full h-12" disabled={loading || uploading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (initialData ? "আপডেট করুন" : "যোগ করুন")}
        </Button>
      </form>
    </Form>
  );
}
