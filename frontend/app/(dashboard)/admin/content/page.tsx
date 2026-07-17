'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Layout, Image as ImageIcon, MessageSquare, HelpCircle, FileText, Plus, Trash2, Save, Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'gallery' | 'testimonials' | 'faqs' | 'public'>('home');
  const [loading, setLoading] = useState(false);

  // 1. Homepage Content State
  const [homeContent, setHomeContent] = useState<any>({
    heroTitle: '',
    heroSubtitle: '',
    badgeText: '',
    statsAum: '',
    statsInvestors: '',
    statsGrowth: '',
  });

  // 2. Gallery Content State
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [newGalleryItem, setNewGalleryItem] = useState({ title: '', category: 'Land', type: 'image' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      toast.error('Could not access camera. Please allow permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(blob));
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 3. Testimonials State
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', rating: 5, text: '', location: '', investment: '' });

  // 4. FAQs State
  const [faqList, setFaqList] = useState<any[]>([]);
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });

  // 5. Public Sections State
  const [publicContent, setPublicContent] = useState<any>({
    aboutStory: '',
    locationAdvantages: '',
    companyVision: '',
    companyMission: '',
  });

  const fetchData = async () => {
    try {
      const [homeRes, publicRes, testimonialsRes, faqsRes, galleryRes] = await Promise.all([
        api.get('/content/home').catch(() => null),
        api.get('/content/public').catch(() => null),
        api.get('/testimonials').catch(() => null),
        api.get('/faqs').catch(() => null),
        api.get('/gallery').catch(() => null)
      ]);
      
      if (homeRes?.data?.data) setHomeContent(homeRes.data.data);
      if (publicRes?.data?.data) setPublicContent(publicRes.data.data);
      if (testimonialsRes?.data?.data) setTestimonialsList(testimonialsRes.data.data);
      
      // Map FAQ data to fit existing component keys
      if (faqsRes?.data?.data) {
        setFaqList(faqsRes.data.data.map((f: any) => ({ ...f, q: f.question, a: f.answer })));
      }
      if (galleryRes?.data?.data) setGalleryList(galleryRes.data.data);

    } catch (error) {
      console.error('Failed to load content', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveHomeContent = async () => {
    setLoading(true);
    try {
      await api.post('/content', { section: 'home', content: homeContent });
      toast.success('Homepage settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePublicContent = async () => {
    setLoading(true);
    try {
      await api.post('/content', { section: 'public', content: publicContent });
      toast.success('Public website sections updated');
    } catch (error) {
      toast.error('Failed to update public sections');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGallery = async () => {
    if (!newGalleryItem.title) {
      toast.error('Please enter a title for the media');
      return;
    }
    setUploadingGallery(true);
    try {
      let imageUrl = '';
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        imageUrl = uploadRes.data.data.url;
      }

      const payload = {
        ...newGalleryItem,
        image_url: imageUrl || undefined
      };

      const res = await api.post('/gallery', payload);
      setGalleryList([res.data.data, ...galleryList]);
      setNewGalleryItem({ title: '', category: 'Land', type: 'image' });
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast.success('Media item added to gallery');
    } catch (error) {
      toast.error('Failed to add media item');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleDeleteGallery = async (id: number | string) => {
    try {
      await api.delete(`/gallery/${id}`);
      setGalleryList(galleryList.filter(item => item.id !== id));
      toast.success('Media item removed');
    } catch (error) {
      toast.error('Failed to remove media item');
    }
  };

  const handleAddTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.text) {
      toast.error('Please enter both name and testimonial text');
      return;
    }
    try {
      const res = await api.post('/testimonials', newTestimonial);
      setTestimonialsList([res.data.data, ...testimonialsList]);
      setNewTestimonial({ name: '', rating: 5, text: '', location: '', investment: '' });
      toast.success('Testimonial added');
    } catch (error) {
      toast.error('Failed to add testimonial');
    }
  };

  const handleDeleteTestimonial = async (id: number | string) => {
    try {
      await api.delete(`/testimonials/${id}`);
      setTestimonialsList(testimonialsList.filter(t => t.id !== id));
      toast.success('Testimonial removed');
    } catch (error) {
      toast.error('Failed to remove testimonial');
    }
  };

  const handleAddFaq = async () => {
    if (!newFaq.q || !newFaq.a) {
      toast.error('Please fill in both Question and Answer');
      return;
    }
    try {
      const res = await api.post('/faqs', { question: newFaq.q, answer: newFaq.a });
      const created = { ...res.data.data, q: res.data.data.question, a: res.data.data.answer };
      setFaqList([created, ...faqList]);
      setNewFaq({ q: '', a: '' });
      toast.success('FAQ added');
    } catch (error) {
      toast.error('Failed to add FAQ');
    }
  };

  const handleDeleteFaq = async (id: number | string) => {
    try {
      await api.delete(`/faqs/${id}`);
      setFaqList(faqList.filter(f => f.id !== id));
      toast.success('FAQ removed');
    } catch (error) {
      toast.error('Failed to remove FAQ');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-[2rem] font-bold text-[#F8F5EE] tracking-tight">Content Management</h1>
        <p className="text-[#A8B5AA] text-[15px] mt-1.5 font-medium">Edit titles, galleries, FAQs, and static sections for the public website.</p>
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b border-[#C49A5A]/30 gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'home', label: 'Homepage Content', icon: Layout },
          { id: 'gallery', label: 'Manage Gallery', icon: ImageIcon },
          { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
          { id: 'faqs', label: 'FAQ Board', icon: HelpCircle },
          { id: 'public', label: 'Static Sections', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all border-b-2 ${
                active 
                  ? 'border-[#C49A5A] text-[#C49A5A] bg-[#C49A5A]/10 font-semibold' 
                  : 'border-transparent text-[#A8B5AA] hover:text-[#F8F5EE] hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-[#101A13] border border-[#C49A5A]/30 rounded-[2rem] p-6 md:p-8 shadow-lg">
        
        {/* Tab 1: Homepage Content */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Homepage Branding</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-[#A8B5AA] text-xs font-semibold mb-1 block">Hero Badge Text</Label>
                <Input 
                  value={homeContent.badgeText} 
                  onChange={(e) => setHomeContent({ ...homeContent, badgeText: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-[#C49A5A] rounded-xl h-11"
                />
              </div>

              <div>
                <Label className="text-[#A8B5AA] text-xs font-semibold mb-1 block">Hero Main Title</Label>
                <Input 
                  value={homeContent.heroTitle} 
                  onChange={(e) => setHomeContent({ ...homeContent, heroTitle: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-[#C49A5A] rounded-xl h-11 font-serif text-sm"
                />
              </div>

              <div>
                <Label className="text-[#A8B5AA] text-xs font-semibold mb-1 block">Hero Subtitle</Label>
                <Textarea 
                  value={homeContent.heroSubtitle} 
                  onChange={(e) => setHomeContent({ ...homeContent, heroSubtitle: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-[#C49A5A] rounded-xl"
                  rows={3}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-[#A8B5AA] text-xs font-semibold mb-1 block">Land Acre Stat</Label>
                  <Input 
                    value={homeContent.statsAum} 
                    onChange={(e) => setHomeContent({ ...homeContent, statsAum: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#C49A5A] rounded-xl h-11"
                  />
                </div>
                <div>
                  <Label className="text-[#A8B5AA] text-xs font-semibold mb-1 block">Investors Stat</Label>
                  <Input 
                    value={homeContent.statsInvestors} 
                    onChange={(e) => setHomeContent({ ...homeContent, statsInvestors: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#C49A5A] rounded-xl h-11"
                  />
                </div>
                <div>
                  <Label className="text-[#A8B5AA] text-xs font-semibold mb-1 block">Growth Cycle Stat</Label>
                  <Input 
                    value={homeContent.statsGrowth} 
                    onChange={(e) => setHomeContent({ ...homeContent, statsGrowth: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#C49A5A] rounded-xl h-11"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#C49A5A]/10">
              <Button onClick={handleSaveHomeContent} disabled={loading} className="bg-[#C49A5A] hover:bg-[#8B5E3C] text-[#101A13] hover:text-white font-bold text-xs uppercase tracking-wider rounded-full px-8 py-5 flex items-center gap-2">
                <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: Manage Gallery */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Active Gallery Items</h3>
            
            {/* New Item Form */}
            <div className="bg-[#0B1510] border border-[#C49A5A]/20 p-5 rounded-2xl space-y-4 mb-6">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                <span>Add New Media Link</span>
                <div className="flex gap-2">
                  <Button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white/10 hover:bg-white/20 text-white text-[10px] h-7 px-3 rounded-full flex items-center gap-1">
                    <Upload className="w-3 h-3" /> Upload Device
                  </Button>
                  <Button type="button" onClick={isCameraActive ? stopCamera : startCamera} className="bg-[#C49A5A] hover:bg-[#8B5E3C] text-black text-[10px] h-7 px-3 rounded-full flex items-center gap-1">
                    {isCameraActive ? <X className="w-3 h-3" /> : <Camera className="w-3 h-3" />} {isCameraActive ? 'Cancel' : 'Camera'}
                  </Button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                </div>
              </h4>
              
              {/* Camera / Preview Area */}
              {(isCameraActive || previewUrl) && (
                <div className="w-full bg-black/50 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 border border-[#C49A5A]/20 relative">
                  {isCameraActive && !previewUrl && (
                    <>
                      <video ref={videoRef} autoPlay playsInline className="w-full max-w-md rounded-lg shadow-lg" />
                      <Button onClick={capturePhoto} className="absolute bottom-6 bg-[#C49A5A] hover:bg-[#8B5E3C] text-black rounded-full shadow-xl">
                        Capture Photo
                      </Button>
                    </>
                  )}
                  {previewUrl && (
                    <div className="relative inline-block">
                      <img src={previewUrl} alt="Preview" className="max-h-64 object-contain rounded-lg" />
                      <button onClick={() => { setPreviewUrl(null); setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <canvas ref={canvasRef} width="640" height="480" className="hidden" />
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-4 items-end">
                <div>
                  <Label className="text-[#A8B5AA] text-[11px] font-semibold mb-1 block">Title</Label>
                  <Input 
                    placeholder="e.g. Nursery Plants" 
                    value={newGalleryItem.title}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#C49A5A] rounded-xl h-10 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-[#A8B5AA] text-[11px] font-semibold mb-1 block">Category</Label>
                  <select 
                    value={newGalleryItem.category}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                    className="w-full h-10 rounded-xl border border-white/10 bg-white/5 text-xs text-white focus:outline-none px-2"
                  >
                    <option value="Land" className="bg-[#101A13]">Land</option>
                    <option value="Plantation" className="bg-[#101A13]">Plantation</option>
                    <option value="Saplings" className="bg-[#101A13]">Saplings</option>
                    <option value="Sandalwood Trees" className="bg-[#101A13]">Sandalwood Trees</option>
                    <option value="Videos" className="bg-[#101A13]">Videos</option>
                    <option value="Documents" className="bg-[#101A13]">Documents</option>
                  </select>
                </div>
                <div>
                  <Button onClick={handleAddGallery} disabled={uploadingGallery} className="w-full bg-[#C49A5A] hover:bg-[#8B5E3C] text-[#101A13] hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl h-10 flex items-center justify-center gap-1.5">
                    {uploadingGallery ? 'Uploading...' : <><Plus className="w-4 h-4" /> Add Item</>}
                  </Button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.01]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-4 text-[#A8B5AA] font-bold uppercase tracking-wider">Title</th>
                    <th className="p-4 text-[#A8B5AA] font-bold uppercase tracking-wider">Category</th>
                    <th className="p-4 text-[#A8B5AA] font-bold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/95">
                  {galleryList.map(item => (
                    <tr key={item.id} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-semibold flex items-center gap-3">
                        {item.image_url && <img src={item.image_url} alt="Thumbnail" className="w-8 h-8 object-cover rounded-md border border-white/20" />}
                        {item.title}
                      </td>
                      <td className="p-4"><span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-wider text-[9px] font-bold">{item.category}</span></td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDeleteGallery(item.id)} className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Testimonials */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Manage Testimonials</h3>
            
            {/* New Testimonial Form */}
            <div className="bg-[#0B1510] border border-[#C49A5A]/20 p-5 rounded-2xl space-y-4 mb-6">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Add Testimonial Card</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#A8B5AA] text-[11px] font-semibold mb-1 block">Customer Name</Label>
                  <Input 
                    placeholder="e.g. Rajesh Patel" 
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#C49A5A] rounded-xl h-10 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-[#A8B5AA] text-[11px] font-semibold mb-1 block">Rating</Label>
                  <select 
                    value={newTestimonial.rating}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })}
                    className="w-full h-10 rounded-xl border border-white/10 bg-white/5 text-xs text-white focus:outline-none px-2"
                  >
                    <option value={5} className="bg-[#101A13]">5 Stars</option>
                    <option value={4} className="bg-[#101A13]">4 Stars</option>
                    <option value={3} className="bg-[#101A13]">3 Stars</option>
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#A8B5AA] text-[11px] font-semibold mb-1 block">Location</Label>
                  <Input 
                    placeholder="e.g. Pune, Maharashtra" 
                    value={newTestimonial.location}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, location: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#C49A5A] rounded-xl h-10 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-[#A8B5AA] text-[11px] font-semibold mb-1 block">Investment Tag</Label>
                  <Input 
                    placeholder="e.g. 0.5 Acre Plot" 
                    value={newTestimonial.investment}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, investment: e.target.value })}
                    className="bg-white/5 border-white/10 text-white focus-visible:ring-[#C49A5A] rounded-xl h-10 text-xs"
                  />
                </div>
              </div>
              <div>
                <Label className="text-[#A8B5AA] text-[11px] font-semibold mb-1 block">Testimonial Text</Label>
                <Textarea 
                  placeholder="Paste customer quote here..." 
                  value={newTestimonial.text}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-[#C49A5A] rounded-xl text-xs"
                  rows={3}
                />
              </div>
              <div>
                <Button onClick={handleAddTestimonial} className="bg-[#C49A5A] hover:bg-[#8B5E3C] text-[#101A13] hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl h-10 px-6 flex items-center justify-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add Review
                </Button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              {testimonialsList.map(t => (
                <div key={t.id} className="p-5 border border-white/10 rounded-2xl bg-white/[0.01] flex justify-between items-start gap-4">
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[...Array(t.rating)].map((_, j) => (
                        <span key={j} className="text-[#C49A5A] text-xs">★</span>
                      ))}
                    </div>
                    <p className="text-white/80 text-xs leading-relaxed italic mb-3">"{t.text}"</p>
                    <div className="text-[#A8B5AA] text-[10px] font-bold uppercase tracking-wider">
                      {t.name} · {t.location} · {t.investment}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteTestimonial(t.id)} className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-500/10 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: FAQs */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>FAQ Management</h3>
            
            {/* New FAQ Form */}
            <div className="bg-[#0B1510] border border-[#C49A5A]/20 p-5 rounded-2xl space-y-4 mb-6">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Add New Q&A</h4>
              <div>
                <Label className="text-[#A8B5AA] text-[11px] font-semibold mb-1 block">Question</Label>
                <Input 
                  placeholder="e.g. What is the harvest timeline?" 
                  value={newFaq.q}
                  onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-[#C49A5A] rounded-xl h-10 text-xs"
                />
              </div>
              <div>
                <Label className="text-[#A8B5AA] text-[11px] font-semibold mb-1 block">Answer</Label>
                <Textarea 
                  placeholder="Type answer details..." 
                  value={newFaq.a}
                  onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-[#C49A5A] rounded-xl text-xs"
                  rows={3}
                />
              </div>
              <div>
                <Button onClick={handleAddFaq} className="bg-[#C49A5A] hover:bg-[#8B5E3C] text-[#101A13] hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl h-10 px-6 flex items-center justify-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add FAQ
                </Button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              {faqList.map(faq => (
                <div key={faq.id} className="p-5 border border-white/10 rounded-2xl bg-white/[0.01] flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-white font-bold text-xs uppercase tracking-wide mb-1.5">{faq.q}</h4>
                    <p className="text-white/70 text-xs leading-relaxed">{faq.a}</p>
                  </div>
                  <button onClick={() => handleDeleteFaq(faq.id)} className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-500/10 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Static Sections */}
        {activeTab === 'public' && (
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Static Content Management</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-[#A8B5AA] text-xs font-semibold mb-1 block">Company About Story</Label>
                <Textarea 
                  value={publicContent.aboutStory} 
                  onChange={(e) => setPublicContent({ ...publicContent, aboutStory: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-[#C49A5A] rounded-xl"
                  rows={4}
                />
              </div>

              <div>
                <Label className="text-[#A8B5AA] text-xs font-semibold mb-1 block">Dornala Location Advantages</Label>
                <Textarea 
                  value={publicContent.locationAdvantages} 
                  onChange={(e) => setPublicContent({ ...publicContent, locationAdvantages: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-[#C49A5A] rounded-xl"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-[#A8B5AA] text-xs font-semibold mb-1 block">Our Vision</Label>
                <Textarea 
                  value={publicContent.companyVision} 
                  onChange={(e) => setPublicContent({ ...publicContent, companyVision: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-[#C49A5A] rounded-xl"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-[#A8B5AA] text-xs font-semibold mb-1 block">Our Mission</Label>
                <Textarea 
                  value={publicContent.companyMission || ''} 
                  onChange={(e) => setPublicContent({ ...publicContent, companyMission: e.target.value })}
                  className="bg-white/5 border-white/10 text-white focus-visible:ring-[#C49A5A] rounded-xl"
                  rows={3}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#C49A5A]/10">
              <Button onClick={handleSavePublicContent} disabled={loading} className="bg-[#C49A5A] hover:bg-[#8B5E3C] text-[#101A13] hover:text-white font-bold text-xs uppercase tracking-wider rounded-full px-8 py-5 flex items-center gap-2">
                <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Public Content'}
              </Button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
