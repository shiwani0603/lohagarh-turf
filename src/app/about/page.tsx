'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Lohagarh Turf</h1>
          <p className="text-xl text-green-50">Your premier destination for premium sports turf</p>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Lohagarh Turf is a premier sports facility located beside Keoladeo National Park in Bharatpur, 
              Rajasthan. We provide high-quality, professionally maintained sports turf for cricket, football, 
              and various other sports activities.
            </p>

            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Our mission is to provide accessible, affordable, and high-quality sports facilities to our community. 
              We believe in promoting active lifestyles and fostering a love for sports among all age groups.
            </p>

            <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="text-2xl">✓</span>
                <div>
                  <h3 className="font-bold mb-1">Professional Maintenance</h3>
                  <p className="text-gray-600">Our expert team maintains the turf to international standards daily.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-2xl">✓</span>
                <div>
                  <h3 className="font-bold mb-1">Modern Facilities</h3>
                  <p className="text-gray-600">Well-equipped with changing rooms, parking, and spectator areas.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-2xl">✓</span>
                <div>
                  <h3 className="font-bold mb-1">Prime Location</h3>
                  <p className="text-gray-600">Located in a beautiful setting beside Keoladeo National Park.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-2xl">✓</span>
                <div>
                  <h3 className="font-bold mb-1">Affordable Pricing</h3>
                  <p className="text-gray-600">Competitive rates with flexible booking options and discounts.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
