'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { Upload, Image as ImageIcon, FileText, Video, Trash2, ExternalLink, Search, Filter, SortDesc, CheckSquare, Edit, X, Download, HardDrive, File as FileIcon, Calendar, Eye, Settings, ShieldAlert, Users, MapPin, Maximize2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/confirm-modal';

type Visibility = 'Specific Investor' | 'All Investors';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'video';
  sizeBytes: number;
  url: string;
  category: string;
  date: string;
  visibility: Visibility;
  assignedTo?: string;
  showInDashboard: boolean;
  uploadedBy: string;
}



const CATEGORIES = [
  'Plantation Photos', 'Plantation Reports', 'Plot Images', 'Plot Boundary Maps', 
  'Investor Documents', 'Agreements', 'Sale Deeds', 'Payment Receipts', 
  'KYC Documents', 'Marketing Materials', 'Videos', 'General'
];

const VISIBILITY_OPTIONS: Visibility[] = ['Specific Investor', 'All Investors'];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [investors, setInvestors] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest First');
  
  // Upload State
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingUploads, setPendingUploads] = useState<File[]>([]);
  const [uploadCategory, setUploadCategory] = useState<string>('General');
  const [uploadVisibility, setUploadVisibility] = useState<Visibility>('Specific Investor');
  const [uploadAssignedTo, setUploadAssignedTo] = useState('');
  const [uploadShowInDashboard, setUploadShowInDashboard] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<'category' | 'visibility'>('category');

  // Preview Modal
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  // Stats calculation
  const totalFiles = media.length;
  const totalImages = media.filter(m => m.type === 'image').length;
  const totalPDFs = media.filter(m => m.type === 'pdf').length;
  const totalVideos = media.filter(m => m.type === 'video').length;
  const totalBytes = media.reduce((acc, curr) => acc + curr.sizeBytes, 0);
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  const uploadedThisMonth = media.filter(m => m.date.startsWith(currentMonth)).length;

  const filteredMedia = useMemo(() => {
    let result = [...media];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(s) || 
        m.category.toLowerCase().includes(s) ||
        (m.assignedTo && m.assignedTo.toLowerCase().includes(s))
      );
    }

    if (typeFilter !== 'All') {
      const typeMap: Record<string, string> = { 'Images': 'image', 'PDFs': 'pdf', 'Videos': 'video' };
      result = result.filter(m => m.type === typeMap[typeFilter]);
    }

    if (categoryFilter !== 'All') {
      result = result.filter(m => m.category === categoryFilter || m.category.includes(categoryFilter));
    }

    result.sort((a, b) => {
      if (sortBy === 'Newest First') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'Oldest First') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'Name A-Z') return a.name.localeCompare(b.name);
      if (sortBy === 'Name Z-A') return b.name.localeCompare(a.name);
      if (sortBy === 'File Size') return b.sizeBytes - a.sizeBytes;
      return 0;
    });

    return result;
  }, [media, search, typeFilter, categoryFilter, sortBy]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPendingUploads(Array.from(e.target.files));
      setShowUploadModal(true);
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setPendingUploads(Array.from(e.dataTransfer.files));
      setShowUploadModal(true);
    }
  };

  
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const [resMedia, resInv] = await Promise.all([
          fetch(`${API_URL}/media`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/investors`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const dataMedia = await resMedia.json();
        const dataInv = await resInv.json();
        
        if (dataMedia.success) {
          const mapped = dataMedia.data.map((m: any) => {
            const ext = m.file_url.split('.').pop()?.toLowerCase();
            const type = ext === 'pdf' ? 'pdf' : ['mp4', 'mov', 'avi'].includes(ext || '') ? 'video' : 'image';
            return {
              id: m.id,
              name: m.title,
              type,
              sizeBytes: 1024 * 1024,
              url: m.file_url,
              category: m.category,
              date: new Date(m.created_at).toISOString().split('T')[0],
              visibility: 'Specific Investor' as Visibility,
              assignedTo: m.investor?.full_name || 'Unknown',
              showInDashboard: true,
              uploadedBy: 'Admin'
            };
          });
          setMedia(mapped);
        }
        if (dataInv.success) setInvestors(dataInv.data);
      } catch (err) {
        console.error('Failed to load media:', err);
      }
    };
    load();
  }, []);

  const executeUpload = async () => {
    if (uploadVisibility === 'Specific Investor' && !uploadAssignedTo) {
      toast.error('Please select an investor');
      return;
    }
    
    const targetInvestorId = uploadVisibility === 'All Investors' ? 'ALL' : uploadAssignedTo;
    
    setIsUploading(true);
    setUploadProgress(10);
    const token = localStorage.getItem('token');
    
    try {
      const newItems: MediaItem[] = [];
      const totalFiles = pendingUploads.length;
      let completed = 0;

      for (const file of pendingUploads) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', uploadCategory);
        formData.append('investorId', targetInvestorId);
        formData.append('title', file.name);

        const res = await fetch(`${API_URL}/media`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          if (data.data) {
            const m = data.data;
            const ext = m.file_url.split('.').pop()?.toLowerCase();
            const type = ext === 'pdf' ? 'pdf' : ['mp4', 'mov', 'avi'].includes(ext || '') ? 'video' : 'image';
            
            newItems.push({
              id: m.id,
              name: m.title,
              type,
              sizeBytes: file.size,
              url: m.file_url,
              category: m.category,
              date: new Date(m.created_at).toISOString().split('T')[0],
              visibility: uploadVisibility,
              assignedTo: uploadVisibility === 'All Investors' ? 'All Investors' : (investors.find(i => i.id === uploadAssignedTo)?.full_name || 'Unknown'),
              showInDashboard: true,
              uploadedBy: 'Admin'
            });
          }
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
        completed++;
        setUploadProgress(Math.floor((completed / totalFiles) * 100));
      }
      
      if (newItems.length > 0) {
        setMedia(prev => [...newItems, ...prev]);
        toast.success(`${newItems.length} files uploaded successfully!`);
      } else if (targetInvestorId === 'ALL' && completed > 0) {
        toast.success(`Files uploaded and assigned to all investors!`);
        // Refresh the page to load all the newly created media items
        window.location.reload();
      }
    } catch(err) {
      console.error(err);
      toast.error('Upload failed due to network error');
    } finally {
      setIsUploading(false);
      setShowUploadModal(false);
      setPendingUploads([]);
      setUploadProgress(0);
    }
  };


  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredMedia.length && filteredMedia.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMedia.map(m => m.id)));
    }
  };

  const executeBulkDelete = () => {
    setMedia(prev => prev.filter(m => !selectedIds.has(m.id)));
    setSelectedIds(new Set());
    toast.success('Selected files deleted.');
    setConfirmBulkDelete(false);
  };

  const handleBulkUpdate = (val: string) => {
    setMedia(prev => prev.map(m => {
      if (selectedIds.has(m.id)) {
        return { ...m, [bulkActionType === 'category' ? 'category' : 'visibility']: val };
      }
      return m;
    }));
    setShowBulkActionModal(false);
    setSelectedIds(new Set());
    toast.success(`Updated ${selectedIds.size} files successfully.`);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/media/${confirmDeleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMedia(prev => prev.filter(m => m.id !== confirmDeleteId));
        toast.success('File deleted.');
      }
    } catch (err) {
      toast.error('Failed to delete file');
    } finally {
      setConfirmDeleteId(null);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">Media Library</h1>
          <p className="text-white/50 text-sm mt-1">Asset management and document storage</p>
        </div>
        <Button onClick={() => fileRef.current?.click()} className="bg-[#c8851e] hover:bg-[#a96618] text-white gap-2 font-medium">
          <Upload className="w-4 h-4" /> Upload Assets
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Files', value: totalFiles, icon: FileIcon, color: 'text-white/80' },
          { label: 'Images', value: totalImages, icon: ImageIcon, color: 'text-emerald-400' },
          { label: 'PDFs', value: totalPDFs, icon: FileText, color: 'text-red-400' },
          { label: 'Videos', value: totalVideos, icon: Video, color: 'text-blue-400' },
          { label: 'Storage Used', value: formatBytes(totalBytes), icon: HardDrive, color: 'text-[#c8851e]' },
          { label: 'Uploaded This Month', value: uploadedThisMonth, icon: Calendar, color: 'text-white/80' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#141410] border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg hover:border-white/20 transition-colors">
            <stat.icon className={`w-6 h-6 mb-2 ${stat.color} opacity-80`} />
            <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
            <div className="text-xs text-white/50 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-[#141410] border border-white/10 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search by file name, category, or assigned investor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#c8851e]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-white/40 hidden sm:block" />
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-white/5 border border-white/10 text-white text-sm rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-[#c8851e] cursor-pointer"
            >
              <option value="All" className="bg-[#141410] text-white">All Types</option>
              <option value="Images" className="bg-[#141410] text-white">Images</option>
              <option value="PDFs" className="bg-[#141410] text-white">PDFs</option>
              <option value="Videos" className="bg-[#141410] text-white">Videos</option>
            </select>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white/5 border border-white/10 text-white text-sm rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-[#c8851e] cursor-pointer"
            >
              <option value="All" className="bg-[#141410] text-white">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#141410] text-white">{c}</option>)}
            </select>
            <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block"></div>
            <SortDesc className="w-4 h-4 text-white/40 hidden sm:block" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 text-white text-sm rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-[#c8851e] cursor-pointer"
            >
              <option className="bg-[#141410] text-white">Newest First</option>
              <option className="bg-[#141410] text-white">Oldest First</option>
              <option className="bg-[#141410] text-white">Name A-Z</option>
              <option className="bg-[#141410] text-white">Name Z-A</option>
              <option className="bg-[#141410] text-white">File Size</option>
            </select>
          </div>
        </div>

        {/* Upload Zone */}
        <div 
          onClick={() => fileRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-[#c8851e]/40 hover:bg-[#c8851e]/5 transition-all cursor-pointer group"
        >
          <Upload className="w-8 h-8 text-white/20 group-hover:text-[#c8851e] mx-auto mb-2 transition-colors" />
          <p className="text-white/60 text-sm font-medium">Drag & Drop files here or click to browse</p>
          <p className="text-white/30 text-xs mt-1">Upload images, PDFs, and MP4 videos securely to the platform.</p>
        </div>
        <input type="file" multiple className="hidden" ref={fileRef} onChange={handleFileSelect} accept="image/*,video/mp4,application/pdf" />
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-[#c8851e]/10 border border-[#c8851e]/30 rounded-xl p-3 flex items-center justify-between animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3 text-[#e9be55] text-sm font-medium">
            <CheckSquare className="w-5 h-5" />
            {selectedIds.size} file(s) selected
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => { setBulkActionType('category'); setShowBulkActionModal(true); }} className="bg-white/10 hover:bg-white/20 text-white text-xs h-8">
              Change Category
            </Button>
            <Button size="sm" onClick={() => { setBulkActionType('visibility'); setShowBulkActionModal(true); }} className="bg-white/10 hover:bg-white/20 text-white text-xs h-8">
              Change Visibility
            </Button>
            <Button size="sm" onClick={() => setConfirmBulkDelete(true)} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs h-8">
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        <div 
          onClick={toggleSelectAll}
          className="col-span-full mb-1 flex items-center gap-2 cursor-pointer text-white/50 hover:text-white/80 w-max text-sm font-medium transition-colors"
        >
          <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedIds.size === filteredMedia.length && filteredMedia.length > 0 ? 'bg-[#c8851e] border-[#c8851e]' : 'border-white/30'}`}>
            {selectedIds.size === filteredMedia.length && filteredMedia.length > 0 && <CheckSquare className="w-3 h-3 text-white" />}
          </div>
          Select All
        </div>
        
        {filteredMedia.length === 0 ? (
          <div className="col-span-full py-20 text-center text-white/40">No files found matching your criteria.</div>
        ) : (
          filteredMedia.map((item) => (
            <div 
              key={item.id} 
              className={`bg-[#141410] border rounded-xl overflow-hidden group relative transition-all ${
                selectedIds.has(item.id) ? 'border-[#c8851e] shadow-[0_0_0_1px_rgba(200,133,30,1)]' : 'border-white/10 hover:border-white/30'
              }`}
            >
              {/* Checkbox */}
              <div 
                onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }}
                className="absolute top-3 left-3 z-10 cursor-pointer"
              >
                <div className={`w-5 h-5 rounded border bg-[#141410]/80 backdrop-blur flex items-center justify-center transition-all ${
                  selectedIds.has(item.id) ? 'bg-[#c8851e] border-[#c8851e]' : 'border-white/40 opacity-0 group-hover:opacity-100'
                }`}>
                  {selectedIds.has(item.id) && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>

              {/* Thumbnail */}
              <div 
                onClick={() => setPreviewItem(item)}
                className="h-36 bg-[#0a0a0a] relative flex items-center justify-center overflow-hidden cursor-pointer group-hover:opacity-90 transition-opacity border-b border-white/5"
              >
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : item.type === 'pdf' ? (
                  <FileText className="w-12 h-12 text-red-400/40" />
                ) : (
                  <div className="relative">
                    <Video className="w-12 h-12 text-blue-400/40" />
                    <div className="absolute inset-0 flex items-center justify-center"><div className="w-4 h-4 bg-white/20 rounded-full" /></div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-medium flex items-center gap-1"><Eye className="w-3 h-3" /> View Preview</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-2.5">
                <div className="text-white text-sm font-semibold truncate" title={item.name}>{item.name}</div>
                
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1e2f27] text-emerald-400 border border-emerald-400/20">{item.category}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/60 border border-white/10">{formatBytes(item.sizeBytes)}</span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2 text-white/50 text-[10px]">
                    <ShieldAlert className="w-3 h-3 text-[#c8851e]/70" />
                    <span className="truncate">{item.visibility}</span>
                  </div>
                  {item.assignedTo && (
                    <div className="flex items-center gap-2 text-white/50 text-[10px]">
                      <Users className="w-3 h-3 text-blue-400/70" />
                      <span className="truncate">{item.assignedTo}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-white/40 text-[10px]">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date} by {item.uploadedBy}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <a href={item.url} download onClick={e => e.stopPropagation()} className="w-7 h-7 rounded-full bg-black/60 backdrop-blur text-white flex items-center justify-center hover:bg-[#c8851e] transition-colors border border-white/10 hover:border-[#c8851e]" title="Download">
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <button onClick={(e) => handleDeleteClick(item.id, e)} className="w-7 h-7 rounded-full bg-black/60 backdrop-blur text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors border border-white/10 hover:border-red-500" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#141410] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
              <h3 className="text-lg font-semibold text-white">Upload {pendingUploads.length} File(s)</h3>
              <button onClick={() => !isUploading && setShowUploadModal(false)} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              
              <div className="max-h-32 overflow-y-auto space-y-2 hide-scrollbar">
                {pendingUploads.map((file, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                    <div className="text-white/80 truncate max-w-[250px]">{file.name}</div>
                    <div className="text-white/40 text-xs">{formatBytes(file.size)}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div>
                  <label className="text-xs text-white/60 font-medium mb-1.5 block">Assign Category *</label>
                  <select 
                    value={uploadCategory} 
                    onChange={e => setUploadCategory(e.target.value)}
                    disabled={isUploading}
                    className="w-full bg-black/40 border border-white/10 text-white rounded-lg px-3 py-2.5 outline-none focus:border-[#c8851e] focus:ring-1 focus:ring-[#c8851e]"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#141410] text-white">{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/60 font-medium mb-1.5 block">Visibility Control</label>
                  <select 
                    value={uploadVisibility} 
                    onChange={e => setUploadVisibility(e.target.value as Visibility)}
                    disabled={isUploading}
                    className="w-full bg-black/40 border border-white/10 text-white rounded-lg px-3 py-2.5 outline-none focus:border-[#c8851e] focus:ring-1 focus:ring-[#c8851e]"
                  >
                    {VISIBILITY_OPTIONS.map(c => <option key={c} value={c} className="bg-[#141410] text-white">{c}</option>)}
                  </select>
                </div>

                {uploadVisibility === 'Specific Investor' && (
                  <div className="animate-in slide-in-from-top-2">
                    <label className="text-xs text-white/60 font-medium mb-1.5 block">
                      Assign to Investor *
                    </label>
                    <select
                      value={uploadAssignedTo}
                      onChange={e => setUploadAssignedTo(e.target.value)}
                      disabled={isUploading}
                      className="w-full bg-black/40 border border-white/10 text-white rounded-lg px-3 py-2.5 outline-none focus:border-[#c8851e] focus:ring-1 focus:ring-[#c8851e]"
                    >
                      <option value="">-- Select Investor --</option>
                      {investors.map(inv => (
                        <option key={inv.id} value={inv.id} className="bg-[#141410] text-white">
                          {inv.full_name} ({inv.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={uploadShowInDashboard}
                    onChange={e => setUploadShowInDashboard(e.target.checked)}
                    disabled={isUploading}
                    className="w-4 h-4 rounded border-white/20 text-[#c8851e] focus:ring-[#c8851e] bg-black/40"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Show in Investor Dashboard</div>
                    <div className="text-xs text-white/40">File will appear in assigned investor's Document Portal.</div>
                  </div>
                </label>
              </div>

              {isUploading && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#c8851e]">Uploading files...</span>
                    <span className="text-white/80">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#c8851e] to-[#f4d17f] transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-white/10 bg-[#0a0a08] flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowUploadModal(false)} disabled={isUploading} className="text-white/60 hover:text-white">Cancel</Button>
              <Button onClick={executeUpload} disabled={isUploading || (uploadVisibility === 'Specific Investor' && !uploadAssignedTo)} className="bg-[#c8851e] hover:bg-[#a96618] text-white">
                {isUploading ? 'Processing...' : 'Upload & Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Modal */}
      {showBulkActionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#141410] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Bulk Change {bulkActionType === 'category' ? 'Category' : 'Visibility'}</h3>
              <p className="text-xs text-white/50 mt-1">Applying to {selectedIds.size} file(s)</p>
            </div>
            <div className="p-5">
              <select 
                id="bulkVal"
                className="w-full bg-black/40 border border-white/10 text-white rounded-lg px-3 py-2.5 outline-none focus:border-[#c8851e] focus:ring-1 focus:ring-[#c8851e]"
              >
                {bulkActionType === 'category' 
                  ? CATEGORIES.map(c => <option key={c} value={c} className="bg-[#141410] text-white">{c}</option>)
                  : VISIBILITY_OPTIONS.map(c => <option key={c} value={c} className="bg-[#141410] text-white">{c}</option>)
                }
              </select>
            </div>
            <div className="p-4 border-t border-white/10 bg-[#0a0a08] flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowBulkActionModal(false)} className="text-white/60 hover:text-white h-8 text-xs">Cancel</Button>
              <Button onClick={() => handleBulkUpdate((document.getElementById('bulkVal') as HTMLSelectElement).value)} className="bg-[#c8851e] hover:bg-[#a96618] text-white h-8 text-xs">
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col animate-in fade-in">
          <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div>
              <div className="text-white font-medium text-lg">{previewItem.name}</div>
              <div className="text-white/50 text-xs flex gap-3 mt-1">
                <span>{previewItem.category}</span>
                <span>{formatBytes(previewItem.sizeBytes)}</span>
                <span>{previewItem.visibility}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href={previewItem.url} download className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors border border-white/10">
                <Download className="w-4 h-4" /> Download
              </a>
              <button onClick={() => setPreviewItem(null)} className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
            {previewItem.type === 'image' && (
              <img src={previewItem.url} alt={previewItem.name} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
            )}
            {previewItem.type === 'pdf' && (
              <iframe src={previewItem.url} className="w-full max-w-5xl h-full rounded-xl bg-white shadow-2xl" />
            )}
            {previewItem.type === 'video' && (
              <video src={previewItem.url} controls autoPlay className="max-w-full max-h-full rounded-xl shadow-2xl border border-white/10 bg-black" />
            )}
          </div>
        </div>
      )}

      {/* Delete Single Confirmation */}
      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={executeDelete}
        title="Delete File"
        description="Are you sure you want to delete this file? This action cannot be undone."
        confirmText="Delete"
      />

      {/* Delete Bulk Confirmation */}
      <ConfirmModal
        isOpen={confirmBulkDelete}
        onClose={() => setConfirmBulkDelete(false)}
        onConfirm={executeBulkDelete}
        title="Delete Selected Files"
        description={`Are you sure you want to delete ${selectedIds.size} selected files? This action cannot be undone.`}
        confirmText="Delete Selected"
      />
    </div>
  );
}
