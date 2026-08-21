import { useState } from 'react';
import { FloatingShapes } from '../components/zonein/FloatingShapes';
import FadeIn from '../components/zonein/FadeIn';
import { api } from '../utils/api';

function InterestPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await api.submitInterest(name.trim(), email.trim());
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="relative overflow-hidden max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24 text-center min-h-screen">
      <title>Interested in ZoneIn Hub?</title>
      <meta name="robots" content="noindex, nofollow" />
      <FloatingShapes variant="cream" />
      <FadeIn className="relative max-w-xl mx-auto">
        <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-zonein-green-dark mb-4">Coming soon</p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-zonein-ink mb-5">Interested in ZoneIn Hub?</h1>
        <p className="text-base leading-relaxed text-zonein-gray mb-9">
          We're getting things ready in Alagbado, Lagos, a quiet, reliable coworking space. Leave your name and email and we'll let you know when we're open.
        </p>

        {!submitted ? (
          <>
            <div className="flex flex-col gap-3 max-w-md mx-auto mb-3">
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="px-4 py-3.5 border border-zonein-border rounded-lg text-[15px] outline-none focus:border-zonein-green transition-colors"
              />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="px-4 py-3.5 border border-zonein-border rounded-lg text-[15px] outline-none focus:border-zonein-green transition-colors"
              />
              <button
                onClick={handleSubmit}
                disabled={!name.trim() || !email.trim() || submitting}
                className="bg-zonein-green hover:bg-zonein-green-dark disabled:bg-zonein-green-light disabled:cursor-not-allowed text-zonein-cream font-display font-semibold rounded-lg px-6 py-3.5 transition-colors"
              >
                {submitting ? 'Sending…' : 'Notify me'}
              </button>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </>
        ) : (
          <p className="text-[15px] font-medium text-zonein-green-dark">Thanks, {name.split(' ')[0]}. You're on the list, we'll be in touch.</p>
        )}
      </FadeIn>
    </div>
  );
}

export default InterestPage;
