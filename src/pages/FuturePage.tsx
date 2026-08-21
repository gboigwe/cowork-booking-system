import { useState } from 'react';
import { FloatingShapes } from '../components/zonein/FloatingShapes';
import FadeIn from '../components/zonein/FadeIn';
import SEO from '../components/zonein/SEO';

function FuturePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="relative overflow-hidden max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24 text-center">
      <SEO path="/future" />
      <FloatingShapes variant="cream" />
      <FadeIn className="relative max-w-xl mx-auto">
        <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-zonein-green-dark mb-4">Coming soon</p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-zonein-ink mb-5">Private offices &amp; a meeting room</h1>
        <p className="text-base leading-relaxed text-zonein-gray mb-9">
          As ZoneIn Hub grows, we're planning enclosed private offices for small teams and a proper meeting room for calls and interviews. Nothing bookable yet. Leave your email and we'll let you know when it's ready.
        </p>

        {!submitted ? (
          <div className="flex gap-3 max-w-md mx-auto flex-wrap justify-center">
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 min-w-[220px] px-4 py-3.5 border border-zonein-border rounded-lg text-[15px] outline-none focus:border-zonein-green transition-colors"
            />
            <button
              onClick={handleSubmit}
              className="bg-zonein-green hover:bg-zonein-green-dark text-zonein-cream font-display font-semibold rounded-lg px-6 py-3.5 transition-colors"
            >
              Notify me
            </button>
          </div>
        ) : (
          <p className="text-[15px] font-medium text-zonein-green-dark">You're on the list. We'll be in touch.</p>
        )}
      </FadeIn>
    </div>
  );
}

export default FuturePage;
