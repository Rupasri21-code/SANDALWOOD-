'use client';

import { useState } from 'react';
import { Upload, Image, FileText, Video, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sampleMedia = [
  { id: '1', name: 'hassan-plot-aerial.jpg', type: 'image', size: '2.4 MB', url: 'https://images.pexels.com/photos/32849312/pexels-photo-32849312.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Land', date: '2024-03-15' },
  { id: '2', name: 'nursery-saplings-2024.jpg', type: 'image', size: '1.8 MB', url: 'https://images.pexels.com/photos/11669262/pexels-photo-11669262.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Nursery', date: '2024-02-20' },
  { id: '3', name: 'investment-contract-template.pdf', type: 'pdf', size: '340 KB', url: '', category: 'Documents', date: '2024-01-10' },
  { id: '4', name: 'plantation-progress-q1.jpg', type: 'image', size: '3.1 MB', url: 'https://images.pexels.com/photos/15124451/pexels-photo-15124451.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Plantation', date: '2024-04-01' },
  { id: '5', name: 'growth-report-2024.pdf', type: 'pdf', size: '1.2 MB', url: '', category: 'Reports', date: '2024-04-05' },
  { id: '6', name: 'sandalwood-grove-1.jpg', type: 'image', size: '2.9 MB', url: 'https://images.pexels.com/photos/1563604/pexels-photo-1563604.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Plantation', date: '2024-04-10' },
];

export default function MediaPage() {
  const [filter, setFilter] = useState('all');
  const [media, setMedia] = useState(sampleMedia);

  const filtered = filter === 'all' ? media : media.filter((m) => m.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">Media Library</h1>
          <p className="text-white/50 text-sm mt-1">{media.length} files</p>
        </div>
        <Button className="bg-[#c8851e] hover:bg-[#a96618] text-white gap-2">
          <Upload className="w-4 h-4" /> Upload Files
        </Button>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-[#c8851e]/30 transition-all cursor-pointer group">
        <Upload className="w-10 h-10 text-white/20 group-hover:text-[#c8851e]/50 mx-auto mb-3 transition-colors" />
        <p className="text-white/40 text-sm">Drag and drop files here, or click to browse</p>
        <p className="text-white/20 text-xs mt-1">Supports: JPG, PNG, PDF, MP4</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'image', 'pdf', 'video'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === f ? 'bg-[#c8851e] text-white' : 'bg-white/5 text-white/60 border border-white/10 hover:border-[#c8851e]/30'
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white/3 border border-white/8 rounded-xl overflow-hidden hover:border-[#c8851e]/20 transition-all group">
            <div className="h-32 bg-white/3 flex items-center justify-center overflow-hidden">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : item.type === 'pdf' ? (
                <FileText className="w-10 h-10 text-red-400/50" />
              ) : (
                <Video className="w-10 h-10 text-blue-400/50" />
              )}
            </div>
            <div className="p-3">
              <div className="text-white/80 text-xs font-medium truncate mb-1">{item.name}</div>
              <div className="flex items-center justify-between text-white/30 text-[10px]">
                <span>{item.size}</span>
                <span>{item.category}</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] text-white/50 hover:text-white hover:bg-white/5 transition-all border border-white/8">
                    <ExternalLink className="w-3 h-3" /> View
                  </a>
                )}
                <button onClick={() => setMedia((prev) => prev.filter((m) => m.id !== item.id))}
                  className="p-1 rounded text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
