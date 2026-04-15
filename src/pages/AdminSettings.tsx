import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Settings } from "@/types";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const formSchema = z.object({
  site_name: z.string().min(2, "Site name must be at least 2 characters"),
  logo_url: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  whatsapp: z.string().optional(),
  facebook: z.string().url("Invalid URL").or(z.literal("")).optional(),
  youtube: z.string().url("Invalid URL").or(z.literal("")).optional(),
  website: z.string().url("Invalid URL").or(z.literal("")).optional(),
  website_2: z.string().url("Invalid URL").or(z.literal("")).optional(),
  website_3: z.string().url("Invalid URL").or(z.literal("")).optional(),
  address: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      site_name: "",
      logo_url: "",
      phone: "",
      email: "",
      whatsapp: "",
      facebook: "",
      youtube: "",
      website: "",
      website_2: "",
      website_3: "",
      address: "",
    },
  });

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase.from("settings").select("*").single();
      if (data) {
        form.reset({
          site_name: data.site_name || "",
          logo_url: data.logo_url || "",
          phone: data.phone || "",
          email: data.email || "",
          whatsapp: data.whatsapp || "",
          facebook: data.facebook || "",
          youtube: data.youtube || "",
          website: data.website || "",
          website_2: data.website_2 || "",
          website_3: data.website_3 || "",
          address: data.address || "",
        });
      }
      setLoading(false);
    }
    fetchSettings();
  }, [form]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Math.random()}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      const bucketName = 'testimonials';

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.includes('bucket_not_found') || uploadError.message.includes('Bucket not found')) {
          throw new Error("সুপাবেস 'Storage' বিভাগে 'testimonials' নামে কোনো বাকেট পাওয়া যায়নি। দয়া করে Storage মেনু থেকে একটি পাবলিক বাকেট তৈরি করুন।");
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      form.setValue('logo_url', publicUrl);
      toast.success("লোগো সফলভাবে আপলোড করা হয়েছে");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("settings")
        .upsert({ id: 1, ...values });
      
      if (error) throw error;
      toast.success("সেটিংস সফলভাবে আপডেট করা হয়েছে।");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20">লোড হচ্ছে...</div>;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">সেটিংস</h1>
        <p className="text-muted-foreground">আপনার কন্টাক্ট ইনফো এবং সোশ্যাল লিঙ্কগুলো এখানে আপডেট করুন।</p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>সাইটের নাম ও লোগো</CardTitle>
          <CardDescription>আপনার সাইটের নাম এবং লোগো এখানে দিন।</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="site_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>সাইটের নাম</FormLabel>
                      <FormControl>
                        <Input placeholder="রিভিউ হাব" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <FormLabel>সাইটের লোগো</FormLabel>
                  <div className="flex items-center gap-4">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoUpload}
                      disabled={uploading}
                    />
                    {uploading && <Loader2 className="animate-spin" />}
                  </div>
                  {form.watch('logo_url') && (
                    <div className="mt-2 p-2 border rounded-lg bg-muted/50 inline-block">
                      <img src={form.watch('logo_url')} alt="Logo Preview" className="h-12 object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-primary">যোগাযোগের তথ্য</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ইমেল</FormLabel>
                        <FormControl>
                          <Input placeholder="hello@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ফোন নম্বর</FormLabel>
                        <FormControl>
                          <Input placeholder="+৮৮০ ১৭১২-৩৪৫৬৭৮" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>হোয়াটসঅ্যাপ</FormLabel>
                      <FormControl>
                        <Input placeholder="৮৮০১৭১২৩৪৫৬৭৮" {...field} />
                      </FormControl>
                      <FormDescription>কান্ট্রি কোডসহ দিন।</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ঠিকানা</FormLabel>
                      <FormControl>
                        <Input placeholder="ঢাকা, বাংলাদেশ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6 pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-primary">সোশ্যাল লিঙ্ক</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ফেসবুক ইউআরএল</FormLabel>
                        <FormControl>
                          <Input placeholder="https://facebook.com/yourprofile" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ইউটিউব ইউআরএল</FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtube.com/@yourchannel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ওয়েবসাইট ইউআরএল ১</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourwebsite.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website_2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ওয়েবসাইট ইউআরএল ২</FormLabel>
                        <FormControl>
                          <Input placeholder="https://anotherwebsite.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website_3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ওয়েবসাইট ইউআরএল ৩</FormLabel>
                        <FormControl>
                          <Input placeholder="https://thirdwebsite.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving || uploading} className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  সেভ করুন
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
