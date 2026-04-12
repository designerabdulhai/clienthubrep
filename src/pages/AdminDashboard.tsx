import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Testimonial } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Star, Video, TrendingUp } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    video: 0,
    featured: 0,
    avgRating: 0
  });
  const [ratingData, setRatingData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      const { data } = await supabase.from("testimonials").select("*");
      if (data) {
        const total = data.length;
        const video = data.filter(t => t.video_url).length;
        const featured = data.filter(t => t.is_featured).length;
        const avgRating = total > 0 ? data.reduce((acc, t) => acc + t.rating, 0) / total : 0;
        
        setStats({ total, video, featured, avgRating });

        // Prepare rating distribution data
        const distribution = [1, 2, 3, 4, 5].map(star => ({
          name: `${star} স্টার`,
          count: data.filter(t => t.rating === star).length,
          star
        }));
        setRatingData(distribution);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { title: "মোট রিভিউ", value: stats.total, icon: MessageSquare, color: "text-primary" },
    { title: "ভিডিও রিভিউ", value: stats.video, icon: Video, color: "text-secondary" },
    { title: "সেরা রিভিউ", value: stats.featured, icon: TrendingUp, color: "text-primary" },
    { title: "গড় রেটিং", value: stats.avgRating.toFixed(1), icon: Star, color: "text-secondary" },
  ];

  const COLORS = ['#fee2e2', '#fef3c7', '#d1fae5', '#dbeafe', '#f3e8ff'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">এক নজরে ড্যাশবোর্ড</h1>
        <p className="text-neutral-500">স্বাগতম! আপনার সাইটের বর্তমান অবস্থা দেখে নিন।</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-neutral-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-500">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-neutral-200 shadow-sm">
          <CardHeader>
            <CardTitle>রেটিং চার্ট</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip 
                  cursor={{ fill: '#f9f9f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {ratingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.star === 5 ? '#f05a25' : '#042952'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 shadow-sm">
          <CardHeader>
            <CardTitle>কিছু দরকারি টিপস</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
              <p className="text-sm font-medium text-primary mb-1">ভিডিও রিভিউ বেশি কার্যকর</p>
              <p className="text-xs text-neutral-500 leading-relaxed">ভিডিও রিভিউগুলো সাধারণ টেক্সটের চেয়ে অনেক বেশি কাজে দেয়। তাই ক্লাইন্টের কাছ থেকে ভিডিও ফিডব্যাক নেওয়ার চেষ্টা করুন।</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
              <p className="text-sm font-medium text-primary mb-1">সেরা রিভিউগুলো উপরে রাখুন</p>
              <p className="text-xs text-neutral-500 leading-relaxed">সবচেয়ে ভালো রিভিউগুলো 'সেরা' হিসেবে মার্ক করুন, এগুলো ল্যান্ডিং পেজের একদম উপরে দেখাবে।</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
              <p className="text-sm font-medium text-primary mb-1">নিয়মিত নতুন রিভিউ যোগ করুন</p>
              <p className="text-xs text-neutral-500 leading-relaxed">নিয়মিত নতুন রিভিউ যোগ করলে ক্লাইন্টের বিশ্বাস বাড়ে।</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
