function ImageSlot({
  label, className = '', rounded = true, src, alt,
}: { label?: string; className?: string; rounded?: boolean; src?: string; alt?: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || label}
        loading="lazy"
        className={`object-cover ${rounded ? 'rounded-2xl' : ''} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center border border-dashed border-zonein-border bg-zonein-cream-alt text-zonein-gray text-sm text-center px-4 ${rounded ? 'rounded-2xl' : ''} ${className}`}
    >
      {label}
    </div>
  );
}

export default ImageSlot;
