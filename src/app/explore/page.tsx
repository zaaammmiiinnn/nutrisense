'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { DEMO_RESTAURANTS } from '@/lib/demo-data';
import { NearbyRestaurant } from '@/lib/firestore-schema';
import { MapPin, Star, Navigation, Clock, Filter, Search, Utensils } from 'lucide-react';
import HealthScoreBadge from '@/components/HealthScoreBadge';

const dietaryFilters = ['All', 'Vegan', 'Vegetarian', 'Gluten Free', 'Keto', 'Halal', 'Low Sodium'];

export default function ExplorePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [restaurants, setRestaurants] = useState<NearbyRestaurant[]>(DEMO_RESTAURANTS);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!user) router.push('/'); }, [user, router]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/nearby-food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat: 12.9716, lng: 77.5946, dietary: filter !== 'All' ? [filter.toLowerCase().replace(' ', '_')] : [] }),
    }).then(r => r.json()).then(d => {
      if (d.data) setRestaurants(d.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [filter]);

  if (!user) return null;

  const filtered = restaurants.filter(r =>
    (searchQuery === '' || r.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filter === 'All' || r.dietaryOptions.some(d => d.toLowerCase().includes(filter.toLowerCase().replace(' ', '_'))))
  );

  return (
    <div className="page-container">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="main-content" style={{ marginLeft: collapsed ? 72 : undefined }}>
        <Navbar />
        <div className="page-header">
          <h1>Explore Healthy Food 📍</h1>
          <p>Find healthy restaurants and grocery stores near you · Powered by Google Maps</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input" placeholder="Search restaurants..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 36 }} />
          </div>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          {dietaryFilters.map(f => (
            <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        {/* Map Placeholder + Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Map */}
          <div className="glass-card" style={{ minHeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(59,130,246,0.05) 100%)' }} />
            <MapPin size={48} style={{ color: 'var(--color-accent)', marginBottom: 16 }} />
            <h3 style={{ marginBottom: 8 }}>Google Maps View</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', maxWidth: 300 }}>
              Interactive map with restaurant markers. Add your Google Maps API key to enable the live map view.
            </p>
            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {filtered.slice(0, 5).map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', border: '1px solid var(--border-glass)' }}>
                  <MapPin size={10} style={{ color: 'var(--color-accent)' }} /> {r.name}
                </div>
              ))}
            </div>
            <span className="badge badge-info" style={{ marginTop: 16, fontSize: '0.7rem' }}>Google Maps Places API</span>
          </div>

          {/* Restaurant List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 600, overflowY: 'auto' }}>
            {filtered.map((r, i) => (
              <div key={i} className="glass-card animate-fade-in" style={{ padding: 16, animationDelay: `${i * 0.05}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Utensils size={16} style={{ color: 'var(--color-accent)' }} />
                      <h4 style={{ fontSize: '0.95rem' }}>{r.name}</h4>
                      {r.isOpen ? <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>Open</span> : <span className="badge badge-danger" style={{ fontSize: '0.6rem' }}>Closed</span>}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>{r.address}</p>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: '0.75rem', marginBottom: 8 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={12} style={{ color: '#f59e0b' }} /> {r.rating}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Navigation size={12} /> {r.distance} km</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {r.cuisineType}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {r.dietaryOptions.map(d => (
                        <span key={d} className="badge badge-info" style={{ fontSize: '0.6rem' }}>{d.replace('_', ' ')}</span>
                      ))}
                    </div>
                  </div>
                  <HealthScoreBadge score={r.healthScore} size="sm" />
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                No restaurants match your filters. Try adjusting your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
