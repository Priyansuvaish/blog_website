export default function HeroSection() {
  return (
    <section className="bg-blue-50 py-16 flex flex-col items-center text-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">Stay informed with the latest real estate trends</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">Discover valuable insights with our user-friendly platform.</p>
      <div className="mb-8">
        <div className="w-64 h-40 rounded-lg flex items-center justify-center overflow-hidden">
          <img 
            src="/building.png" 
            alt="Building Illustration" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <a href="#" className="bg-custom-blue text-white px-8 py-3 rounded shadow hover:bg-opacity-90 transition">Get Started</a>
    </section>
  )
} 