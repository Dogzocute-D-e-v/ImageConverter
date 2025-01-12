import ImageConverter from '@/components/image-converter';

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 mb-4">
            Pawsukis Image Converter
          </h1>
          <p className="text-lg text-gray-300">
            Convert your images between formats with just a few clicks
          </p>
        </div>
        <ImageConverter />
      </div>
    </main>
  );
}