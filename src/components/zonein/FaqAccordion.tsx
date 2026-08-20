import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FaqItem {
  q: string;
  a: string;
}

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q} className="border-b border-zonein-border py-5 cursor-pointer" onClick={() => setOpenIndex(open ? null : i)}>
            <div className="flex justify-between items-center gap-4">
              <span className="text-[15px] font-medium text-zonein-ink">{item.q}</span>
              <span className="text-lg text-zonein-gray">{open ? '−' : '+'}</span>
            </div>
            <AnimatePresence initial={false}>
              {open && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="text-sm leading-relaxed text-zonein-gray overflow-hidden mt-0"
                >
                  <span className="block pt-3">{item.a}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default FaqAccordion;
