'use client';
import React, { useCallback, useState } from 'react';
import { Upload, Camera, X, Loader } from 'lucide-react';

interface Props {
  onUpload: (base64: string) => void;
  loading?: boolean;
}

export default function FoodImageUpload({ onUpload, loading = false }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      const base64 = result.split(',')[1];
      onUpload(base64);
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
      {preview ? (
        <div style={{ position: 'relative' }}>
          <img src={preview} alt="Food" style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }} />
          {loading && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <Loader size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-accent)' }} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Analyzing with Vision AI + Gemini...</span>
              <div style={{ display: 'flex', gap: 8, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                <span className="badge badge-info">🔍 Cloud Vision</span>
                <span className="badge badge-success">🤖 Gemini 1.5 Pro</span>
                <span className="badge badge-warning">☁️ Cloud Storage</span>
              </div>
            </div>
          )}
          {!loading && (
            <button onClick={() => setPreview(null)} style={{
              position: 'absolute', top: 12, right: 12, width: 32, height: 32,
              borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 16, padding: '60px 24px', cursor: 'pointer',
            border: `2px dashed ${dragOver ? 'var(--color-accent)' : 'var(--border-glass)'}`,
            borderRadius: 'var(--radius-lg)', margin: 16,
            background: dragOver ? 'rgba(16,185,129,0.05)' : 'transparent',
            transition: 'all 0.3s',
          }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: 'var(--radius-lg)',
            background: 'var(--gradient-accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Camera size={28} color="#fff" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>Upload a food photo</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Drag & drop or click to browse
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge badge-info"><Upload size={12} /> Upload</span>
            <span className="badge badge-success"><Camera size={12} /> Camera</span>
          </div>
          <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </label>
      )}
    </div>
  );
}
