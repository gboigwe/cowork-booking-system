function ImageSlot({ label, className = '', rounded = true }: { label: string; className?: string; rounded?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center border border-dashed border-zonein-border bg-zonein-cream-alt text-zonein-gray text-sm text-center px-4 ${rounded ? 'rounded-2xl' : ''} ${className}`}
    >
      {label}
    </div>
  );
}

export default ImageSlot;
