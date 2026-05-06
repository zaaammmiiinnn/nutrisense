'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Leaf, Camera, Brain, MapPin, Calendar, BarChart3, Globe, Shield, Sparkles, ArrowRight, ChevronRight } from 'lucide-react';

const features = [
  { icon: Camera, title: 'Smart Food Scanner', desc: 'Snap a photo and get instant nutritional analysis powered by Cloud Vision + Gemini AI', color: '#10b981' },
  { icon: Brain, title: 'AI Health Coach', desc: 'Get personalized advice from your AI nutritionist powered by Gemini 1.5 Pro', color: '#3b82f6' },
  { icon: MapPin, title: 'Healthy Near You', desc: 'Find healthy restaurants and grocery stores nearby with Google Maps', color: '#f59e0b' },
  { icon: Calendar, title: 'Smart Reminders', desc: 'Meal prep, hydration, and grocery reminders synced to Google Calendar', color: '#8b5cf6' },
  { icon: BarChart3, title: 'Progress Analytics', desc: 'Track your nutrition trends with Google Sheets & Looker Studio dashboards', color: '#ec4899' },
  { icon: Globe, title: 'Multi-Language', desc: 'Meal plans translated to your language via Google Translate API', color: '#06b6d4' },
];

const googleAPIs = [
  'Gemini 1.5 Pro', 'Cloud Vision API', 'Firebase Auth', 'Firestore',
  'Cloud Storage', 'Google Maps', 'Calendar API', 'Translate API',
  'Sheets API', 'Looker Studio',
];

export default function LandingPage() {
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();

  const handleGetStarted = async () => {
    if (user) { router.push('/dashboard'); return; }
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (e: any) {
      alert(`Sign In Failed: ${e.message || "Please ensure this domain is added to Firebase Authorized Domains."}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Animated background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', animation: 'float 10s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', width: '30vw', height: '30vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', animation: 'float 12s ease-in-out infinite' }} />
      </div>

      {/* Header */}
      <header style={{ position: 'relative', zIndex: 10, padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={22} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NutriSense</span>
        </div>
        <button onClick={handleGetStarted} className="btn btn-primary">
          {user ? 'Go to Dashboard' : 'Get Started'} <ArrowRight size={16} />
        </button>
      </header>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 40px 60px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <div className="animate-fade-in">
          <span className="badge badge-success" style={{ marginBottom: 20, display: 'inline-flex' }}>
            <Sparkles size={12} /> Powered by 10 Google APIs
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: 20, lineHeight: 1.1 }}>
            Your AI-Powered{' '}
            <span style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Nutrition Partner
            </span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Snap food photos for instant analysis, get personalized meal plans, and build healthier habits — all powered by Google Gemini and cutting-edge AI.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleGetStarted} className="btn btn-primary btn-lg" style={{ fontSize: '1rem' }}>
              <Shield size={18} /> Sign in with Google <ChevronRight size={16} />
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => { signInWithGoogle().then(() => router.push('/dashboard')); }}>
              Try Demo Mode
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 60, flexWrap: 'wrap' }}>
          {[
            { value: '10+', label: 'Google APIs' },
            { value: 'AI', label: 'Powered Analysis' },
            { value: '24/7', label: 'Health Coach' },
            { value: '100%', label: 'Personalized' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 10, padding: '40px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 40, fontSize: '2rem' }}>
          Everything You Need for <span style={{ color: 'var(--color-accent)' }}>Better Health</span>
        </h2>
        <div className="grid-3" style={{ gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: `${f.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <f.icon size={24} style={{ color: f.color }} />
              </div>
              <h3 style={{ marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API Showcase */}
      <section style={{ position: 'relative', zIndex: 10, padding: '60px 40px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 12 }}>Powered by Google Cloud</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '0.9rem' }}>Seamlessly integrated Google services for a complete health experience</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          {googleAPIs.map(api => (
            <span key={api} className="glass-card" style={{ padding: '10px 20px', fontSize: '0.8rem', fontWeight: 600, cursor: 'default' }}>
              {api}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 10, padding: '40px', textAlign: 'center', borderTop: '1px solid var(--border-glass)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          © 2026 NutriSense — Built for AMD Ideathon • Powered by Google Cloud & Gemini AI
        </p>
      </footer>
    </div>
  );
}
