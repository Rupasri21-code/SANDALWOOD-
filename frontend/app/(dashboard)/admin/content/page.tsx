'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Layout, Image as ImageIcon, MessageSquare, HelpCircle, FileText, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'gallery' | 'testimonials' | 'faqs' | 'public'>('home');
  const [loading, setLoading] = useState(false);

  // 1. Homepage Content State
  const [homeContent, setHomeContent] = useState({
    heroTitle: 'ROOTED IN NATURE. GROWING WEALTH.',
    heroSubtitle: 'Premium Sandalwood Plots Near Dornala. Legacy land. Long-term value.',
    badgeText: 'PREMIUM SANDALWOOD PLOTS NEAR DORNALA',
    statsAum: '100 Acres',
    statsInvestors: '1000+',
    statsGrowth: '12+ Years',
  });

  // 2. Gallery Content State
  const [galleryList, setGalleryList] = useState([
    { id: 1, title: '50-Acre Dornala Estate Boundary', category: 'Land', type: 'image' },
    { id: 2, title: 'Developed Plantation Overview', category: 'Plantation', type: 'image' },
    { id: 3, title: 'Certified Sandalwood Saplings', category: 'Saplings', type: 'image' },
  ]);
  const [newGalleryItem, setNewGalleryItem] = useState({ title: '', category: 'Land', type: 'image' });

  // 3. Testimonials State
  const [testimonialsList, setTestimonialsList] = useState([
    { id: 1, name: 'Rajesh Patel', rating: 5, text: 'I was highly skeptical about managed farm models, but Chandan Nilayam\'s compliance won me over.', location: 'Ahmedabad', investment: '0.5 Acre Plot' },
    { id: 2, name: 'Priya Krishnamurthy', rating: 5, text: 'The portal experience is fantastic. I get quarterly soil analyses and sapling growth measurements.', location: 'Bengaluru', investment: '1.25 Acre Plot' },
  ]);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', rating: 5, text: '', location: '', investment: '' });

  // 4. FAQs State
  const [faqList, setFaqList] = useState([
    { id: 1, q: 'Can I visit the plantation in Dornala?', a: 'Yes, we arrange guided site visits for prospective investors every Saturday. We provide transportation.' },
    { id: 2, q: 'How is the land ownership registered?', a: 'Each plot is individually surveyed and registered directly under the investor\'s name at the local sub-registrar office.' },
  ]);
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });

  // 5. Public Sections State
  const [publicContent, setPublicContent] = useState({
    aboutStory: 'Chandan Nilayam Investments owns and manages 50 acres of premium, high-fertility land near Dornala, Andhra Pradesh...',
    locationAdvantages: 'Dornala soil features perfect drainage, high gravel content, laterite chemistry, and semi-arid conditions ideal for oil deposition.',
    companyVision: 'To become India\'s most trusted managed farmland platform, connecting investors with high-value organic forestry.',
  });

  const handleSaveHomeContent = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Homepage settings saved successfully');
    }, 800);
  };

  const handleSavePublicContent = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Public website sections updated');
    }, 800);
  };

  const handleAddGallery = () => {
    if (!newGalleryItem.title) {
      toast.error('Please enter a title for the media');
      return;
    }
    setGalleryList([
      ...galleryList,
      { id: Date.now(), title: newGalleryItem.title, category: newGalleryItem.category, type: newGalleryItem.type }
    ]);
    setNewGalleryItem({ title: '', category: 'Land', type: 'image' });
    toast.success('Media item added to gallery');
  };

  const handleDeleteGallery = (id: number) => {
    setGalleryList(galleryList.filter(item => item.id !== id));
    toast.success('Media item removed');
  };

  const handleAddTestimonial = () => {
    if (!newTestimonial.name || !newTestimonial.text) {
      toast.error('Please enter both name and testimonial text');
      return;
    }
    setTestimonialsList([
      ...testimonialsList,
      { id: Date.now(), ...newTestimonial }
    ]);
    setNewTestimonial({ name: '', rating: 5, text: '', location: '', investment: '' });
    toast.success('Testimonial added');
  };

  const handleDeleteTestimonial = (id: number) => {
    setTestimonialsList(testimonialsList.filter(t => t.id !== id));
    toast.success('Testimonial removed');
  };

  const handleAddFaq = () => {
    if (!newFaq.q || !newFaq.a) {
      toast.error('Please fill in both Question and Answer');
      return;
    }
    setFaqList([
      ...faqList,
      { id: Date.now(), ...newFaq }
    ]);
    setNewFaq({ q: '', a: '' });
    toast.success('FAQ added');
  };

  const handleDeleteFaq = (id: number) => {
    setFaqList(faqList.filter(f => f.id !== id));
    toast.success('FAQ removed');
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
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Add New Media Link</h4>
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
                  <Button onClick={handleAddGallery} className="w-full bg-[#C49A5A] hover:bg-[#8B5E3C] text-[#101A13] hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl h-10 flex items-center justify-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add Item
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
                      <td className="p-4 font-semibold">{item.title}</td>
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
                <Label className="text-[#A8B5AA] text-xs font-semibold mb-1 block">Company Vision & Mission Statement</Label>
                <Textarea 
                  value={publicContent.companyVision} 
                  onChange={(e) => setPublicContent({ ...publicContent, companyVision: e.target.value })}
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
