import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Testimonial } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Star, 
  Video, 
  MoreVertical,
  Search
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { TestimonialForm } from "@/components/TestimonialForm";
import { toast } from "sonner";
import { RatingStars } from "@/components/RatingStars";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) toast.error(error.message);
    if (data) setTestimonials(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত যে আপনি এই রিভিউটি ডিলিট করতে চান?")) return;
    
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("রিভিউটি ডিলিট করা হয়েছে।");
      fetchTestimonials();
    }
  };

  const filteredTestimonials = testimonials.filter(t => 
    t.client_name.toLowerCase().includes(search.toLowerCase()) ||
    t.client_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">রিভিউ</h1>
          <p className="text-muted-foreground">ক্লাইন্টের রিভিউগুলো এখান থেকে ম্যানেজ করুন।</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" />}>
            <Plus className="w-4 h-4 mr-2" />
            নতুন রিভিউ
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>নতুন রিভিউ যোগ করুন</DialogTitle>
            </DialogHeader>
            <TestimonialForm onSuccess={() => {
              setIsAddOpen(false);
              fetchTestimonials();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <Input 
              placeholder="নাম বা পরিচয় দিয়ে খুঁজুন..." 
              className="pl-10 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ক্লাইন্ট</TableHead>
                <TableHead>রেটিং</TableHead>
                <TableHead>ধরন</TableHead>
                <TableHead>সেরা</TableHead>
                <TableHead>সেকশন</TableHead>
                <TableHead>তারিখ</TableHead>
                <TableHead className="text-right">কাজ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">অপেক্ষা করুন...</TableCell>
                </TableRow>
              ) : filteredTestimonials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">কোনো রিভিউ পাওয়া যায়নি।</TableCell>
                </TableRow>
              ) : (
                filteredTestimonials.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="font-medium text-primary">{t.client_name}</div>
                      <div className="text-xs text-muted-foreground">{t.client_title}</div>
                    </TableCell>
                    <TableCell>
                      <RatingStars rating={t.rating} />
                    </TableCell>
                    <TableCell>
                      {t.video_url ? (
                        <div className="flex items-center gap-1 text-secondary text-xs font-medium">
                          <Video className="w-3 h-3" /> ভিডিও
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-xs">শুধুমাত্র টেক্সট</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {t.is_featured ? (
                        <div className="inline-flex items-center px-2 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider">
                          সেরা
                        </div>
                      ) : (
                        <span className="text-muted-foreground/30">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium text-primary">
                        {t.section === 'site_visit' ? 'Site Visit' : t.section === 'completed_house' ? 'Completed House' : 'Client Feedback'}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(t.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" />}>
                            <Pencil className="w-4 h-4" />
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>রিভিউ এডিট করুন</DialogTitle>
                            </DialogHeader>
                            <TestimonialForm 
                              initialData={t} 
                              onSuccess={() => {
                                fetchTestimonials();
                              }} 
                            />
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground/60 hover:text-red-500"
                          onClick={() => handleDelete(t.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

// Helper Card component for the table
function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`bg-card rounded-2xl border ${className}`}>{children}</div>;
}
