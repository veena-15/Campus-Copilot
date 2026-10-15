'use client';

import { ArrowRight, BookOpenCheck, BrainCircuit, CheckCircle2, GraduationCap, LockKeyhole, Mail, Sparkles } from 'lucide-react';

type Props = {
  email: string; password: string; message: string; busy: boolean; mode: 'signin' | 'signup'; configured: boolean;
  onEmail: (value: string) => void; onPassword: (value: string) => void; onMessage: (value: string) => void;
  onSubmit: () => void; onReset: () => void; onMode: (mode: 'signin' | 'signup') => void;
};

export function AuthScreen(props: Props) {
  const { email, password, message, busy, mode, configured, onEmail, onPassword, onMessage, onSubmit, onReset, onMode } = props;
  return <main className="auth-shell">
    <section className="auth-story">
      <div className="auth-brand"><span className="auth-brandmark"><GraduationCap size={21}/></span><span>Campus Copilot</span></div>
      <div className="auth-story-copy">
        <span className="auth-kicker"><Sparkles size={14}/> YOUR PERSONAL STUDENT WORKSPACE</span>
        <h1>Make progress<br/>feel manageable.</h1>
        <p>Keep your academic life organized, understand where to focus, and get thoughtful support when you need it.</p>
        <div className="auth-benefits">
          <div><span><BookOpenCheck size={17}/></span><div><b>Your progress, in one place</b><small>Attendance, assessments and assignments</small></div></div>
          <div><span><BrainCircuit size={17}/></span><div><b>Support that knows your context</b><small>AI study help grounded in your materials</small></div></div>
          <div><span><LockKeyhole size={17}/></span><div><b>A private workspace</b><small>Your account keeps your records personal</small></div></div>
        </div>
      </div>
      <div className="auth-story-foot">A calmer way to stay on top of your studies.</div>
    </section>
    <section className="auth-panel">
      <div className="auth-card">
        <div className="auth-mobile-brand"><span className="auth-brandmark"><GraduationCap size={20}/></span> Campus Copilot</div>
        <div className="auth-heading"><span className="auth-kicker">WELCOME TO YOUR WORKSPACE</span><h2>{mode === 'signin' ? 'Sign in to continue' : 'Create your account'}</h2><p>{mode === 'signin' ? 'Your learning space is ready when you are.' : 'A few details and you can get started.'}</p></div>
        <div className="auth-tabs"><button className={mode === 'signin' ? 'selected' : ''} onClick={() => { onMode('signin'); onMessage(''); }}>Sign in</button><button className={mode === 'signup' ? 'selected' : ''} onClick={() => { onMode('signup'); onMessage(''); }}>Create account</button></div>
        <form onSubmit={event => { event.preventDefault(); onSubmit(); }} className="auth-form">
          <label>Email address<span className="auth-field"><Mail size={16}/><input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e => onEmail(e.target.value)} required={configured}/></span></label>
          <label>Password<span className="auth-field"><LockKeyhole size={16}/><input type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} placeholder={mode === 'signin' ? 'Your password' : 'At least 8 characters'} minLength={configured ? 8 : undefined} value={password} onChange={e => onPassword(e.target.value)} required={configured}/></span></label>
          {mode === 'signin' && <button type="button" className="auth-forgot" onClick={onReset}>Forgot password?</button>}
          {!configured && <div className="auth-setup" role="status"><b>Connect Supabase to enable sign in</b><p>Add these values to the existing root <code>.env.local</code> file:</p><pre>NEXT_PUBLIC_SUPABASE_URL=...<br/>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...</pre><p>Use your own Supabase project values. Apply <code>supabase/schema.sql</code> in the Supabase SQL Editor, then restart Next.js.</p></div>}
          {message && <div className="auth-message" role="status"><CheckCircle2 size={16}/><span>{message}</span></div>}
          <button className="auth-submit" type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'signin' ? <>Sign in <ArrowRight size={17}/></> : <>Create account <ArrowRight size={17}/></>}</button>
        </form>
        <p className="auth-switch">{mode === 'signin' ? 'New to Campus Copilot?' : 'Already have an account?'} <button onClick={() => { onMode(mode === 'signin' ? 'signup' : 'signin'); onMessage(''); }}>{mode === 'signin' ? 'Create an account' : 'Sign in'}</button></p>
        <div className="auth-private"><LockKeyhole size={13}/> Your workspace is private to your account</div>
      </div>
    </section>
  </main>;
}

export function AuthLoading() { return <main className="auth-loading"><div className="auth-brandmark"><GraduationCap size={22}/></div><b>Campus Copilot</b><p>Checking your secure workspace…</p></main>; }
