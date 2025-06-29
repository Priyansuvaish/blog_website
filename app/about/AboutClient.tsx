'use client'

import { useState } from 'react'

export default function AboutClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      question: "What is Earthfields?",
      answer: "Earthfields brings to your desk a tech-driven solution that caters to the gap between demand and supply customers of land concerning precise information and beneficial networking. The platform facilitates expedited decision-making by offering mutual land listings, search functions, and leads. It is a one-stop destination for both businesses and private customers."
    },
    {
      question: "Which segment of LANDS Earthfields is focusing?",
      answer: "Earthfields currently engages with the land categories across residential, commercial, Industrial and agriculture provided they are available for joint developments, outright purchase, rental/lease and built to suit."
    },
    {
      question: "Is there any fee or pricing to use the Earthfields platform?",
      answer: "Yes, we have subscription pricing models which varies across different types of user profiles."
    },
    {
      question: "Is there any brokerage/transaction fee Earthfields charges for any types of land deals?",
      answer: "There is no success or brokerage charge associated with transactions completed through the Earthfields platform. In the event that the client willingly selects Earthfields representation, the agreed-upon brokerage charge must be paid. We aim to also bring a paradigm shift in the transaction process between stakeholders (for individuals big/small or corporations functioning in the sector) making it affordable and transparent."
    }
  ]

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-[#009FFF]/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-4xl mx-auto text-center">
            {/* Company Badge */}
            <div className="inline-flex items-center gap-2 bg-[#009FFF]/10 text-[#009FFF] px-6 py-3 rounded-full text-sm font-medium mb-8 hover:bg-[#009FFF]/20 transition-all duration-300">
              <div className="w-2 h-2 bg-[#009FFF] rounded-full"></div>
              About Earthfields
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 mb-6 sm:mb-8 leading-tight tracking-tight">
              Revolutionizing Land
              <span className="block bg-gradient-to-r from-[#009FFF] to-[#007ACC] bg-clip-text text-transparent">
                Transactions
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed font-light max-w-3xl mx-auto">
              We at Earthfields are creating an advanced solution for LANDS that combines technology and non-technology to empower organized demand and supply, as well as transactions.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#009FFF]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#007ACC]/10 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto space-y-20 sm:space-y-28">

          {/* Mission & Vision Section */}
          <section className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-12">
              {/* Mission */}
              <div className="bg-gradient-to-br from-white to-gray-50 p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#009FFF] to-[#007ACC] rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-light text-gray-900">Our Mission</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed font-light">
                  To make land transactions faster, more efficient and geographically dynamic.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-gradient-to-br from-[#009FFF]/5 to-[#007ACC]/5 p-8 sm:p-10 rounded-3xl border border-[#009FFF]/20 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#007ACC] to-[#009FFF] rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-light text-gray-900">Our Vision</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed font-light">
                  Helping our every customer succeed effortlessly with faster land transactions.
                </p>
              </div>
            </div>

            {/* Why Earthfields */}
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#009FFF]/10 to-transparent rounded-bl-full"></div>
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#009FFF] to-[#007ACC] rounded-2xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-light text-gray-900">W.H.Y. of Earthfields</h2>
                </div>
                
                <p className="text-lg text-gray-700 leading-relaxed font-light mb-6">
                  Our goal is to simplify land subject to the point where everyone aspires to own a land and build their dream project.
                </p>
                
                <div className="bg-gradient-to-r from-[#009FFF]/10 to-[#007ACC]/10 p-6 rounded-2xl border-l-4 border-[#009FFF]">
                  <p className="text-gray-700 italic font-light leading-relaxed">
                    "We envision a father in a village using Earthfields for his land over a cell phone to unlock its right value."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Land Categories Section */}
          <section>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6 tracking-tight">
                Land Categories We Focus On
              </h2>
              <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
                Comprehensive solutions across all land segments
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Residential', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: 'from-blue-500 to-blue-600' },
                { name: 'Commercial', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'from-emerald-500 to-emerald-600' },
                { name: 'Industrial', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4', color: 'from-orange-500 to-orange-600' },
                { name: 'Agriculture', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064', color: 'from-green-500 to-green-600' }
              ].map((category, index) => (
                <div 
                  key={category.name}
                  className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-[#009FFF]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#009FFF]/10 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={category.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600 font-light">
                    Available for joint developments, outright purchase, rental/lease and built to suit
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs Section */}
          <section>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
                Everything you need to know about Earthfields
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#009FFF]/30 transition-all duration-300">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 sm:px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-medium text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className={`flex-shrink-0 w-6 h-6 text-[#009FFF] transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-6 sm:px-8 pb-6">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-700 leading-relaxed font-light">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="relative overflow-hidden">
            <div className="bg-gradient-to-br from-[#009FFF] to-[#007ACC] rounded-3xl p-8 sm:p-12 text-center text-white relative">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 translate-y-16"></div>
              
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-light mb-6">
                  Ready to Transform Your Land Transactions?
                </h2>
                <p className="text-xl font-light mb-8 opacity-90 max-w-2xl mx-auto">
                  Join thousands of satisfied customers who have simplified their land dealings with Earthfields
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-[#009FFF] px-8 py-4 rounded-2xl font-medium hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg">
                    Get Started Today
                  </button>
                  <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-medium hover:bg-white/10 transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
} 