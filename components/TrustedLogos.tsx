export default function TrustedLogos() {
  const logos = [
    '/enterprise-associations/birla.png',
    '/enterprise-associations/casagrand.png',
    '/enterprise-associations/client-radiance-realty.png',
    '/enterprise-associations/kns_infrastructure_logo.jpeg',
    '/enterprise-associations/legacy.jpg',
    '/enterprise-associations/logo-godrej-properties.jpg',
    '/enterprise-associations/mahindralifespace.jpg',
    '/enterprise-associations/rohan.jpg',
    '/enterprise-associations/snn-builders.jpg'
  ];

  return (
    <section className="py-8 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-gray-700 font-semibold mb-4">Trusted and used by real estate professionals</div>
        <div className="relative">
          <div className="flex animate-scroll gap-8 items-center">
            {/* First set of logos */}
            {logos.map((logo, index) => (
              <div key={`first-${index}`} className="flex-shrink-0 w-32 h-20">
                <img
                  src={logo}
                  alt={`Partner logo ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {logos.map((logo, index) => (
              <div key={`second-${index}`} className="flex-shrink-0 w-32 h-20">
                <img
                  src={logo}
                  alt={`Partner logo ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 