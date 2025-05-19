'use client';

export function DevBanner() {
  if (process.env.NODE_ENV === 'production') return null;
  
  return (
    <div className="bg-yellow-100 text-yellow-800 text-center p-2 text-sm font-medium">
      🚧 Development Environment - {process.env.NEXT_PUBLIC_ENV?.toUpperCase()}
    </div>
  );
}
