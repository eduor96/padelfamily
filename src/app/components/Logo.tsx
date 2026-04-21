interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-96 h-96',
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      {/* Fondo difuminado con blobs de color */}
      <div className="absolute inset-0 -z-10 scale-150">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/30 rounded-full mix-blend-multiply filter blur-2xl" />
        <div className="absolute top-1/4 right-0 w-3/4 h-3/4 bg-secondary/20 rounded-full mix-blend-multiply filter blur-2xl" />
        <div className="absolute bottom-0 left-1/4 w-3/4 h-3/4 bg-accent/20 rounded-full mix-blend-multiply filter blur-2xl" />
      </div>
      <img
        src="/logo-padel-family.png"
        alt="Padel Family"
        className="w-full h-full object-contain relative z-10"
      />
    </div>
  );
}
