'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send,
  CheckCircle
} from 'lucide-react';

export default function ContactPage() {
  const phoneNumbers = ['9481252271', '6361033361', '9008157128'];
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission delays
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  const whatsappInquiryUrl = () => {
    const phoneNumber = '916361033361';
    const msg = 'Hello Lakshmi Agency, I am visiting your contact page and would like to coordinate a delivery/material quote.';
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-xs sm:text-sm text-muted-text mb-6">
          <span className="hover:text-foreground"><Link href="/">Home</Link></span>
          <span className="mx-2">/</span>
          <span className="text-foreground font-bold">Contact</span>
        </nav>

        {/* Title */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-blue-400">Get In Touch</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mt-2 mb-6">
            Contact Lakshmi Agency
          </h1>
          <p className="text-base sm:text-lg text-muted-text leading-relaxed">
            Need pricing estimates for a project in Hoskote or Bangalore Rural? Have questions about cement bulk loads, paint tinting options or waterproof sealants? Reach out to our front desk via phone, WhatsApp or visit our storefront in Sulibele.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Address Card */}
            <div className="bg-card-bg border border-card-border p-6 rounded-2xl shadow-sm flex gap-4 transition-theme">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Store Address</h3>
                <p className="text-xs sm:text-sm text-muted-text leading-relaxed">
                  College Main Road, Sulibele,<br />
                  Hoskote Taluk, Bangalore Rural,<br />
                  Karnataka - 562129
                </p>
              </div>
            </div>

            {/* Phones Card */}
            <div className="bg-card-bg border border-card-border p-6 rounded-2xl shadow-sm flex gap-4 transition-theme">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Phone Numbers</h3>
                <p className="text-xs text-muted-text mb-2">Click to call directly from mobile:</p>
                <div className="flex flex-col gap-1.5 text-sm font-bold text-primary dark:text-blue-400">
                  {phoneNumbers.map((num) => (
                    <a key={num} href={`tel:${num}`} className="hover:underline flex items-center gap-1">
                      {num}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-card-bg border border-card-border p-6 rounded-2xl shadow-sm flex gap-4 transition-theme">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Store Hours</h3>
                <ul className="text-xs sm:text-sm text-muted-text space-y-1 mt-1">
                  <li className="flex justify-between gap-4">
                    <span>Monday - Saturday:</span>
                    <span className="font-semibold text-foreground">8:30 AM - 8:30 PM</span>
                  </li>
                  <li className="flex justify-between gap-4 text-red-500">
                    <span>Sunday:</span>
                    <span className="font-semibold">Closed</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2 bg-card-bg border border-card-border p-6 sm:p-8 rounded-2xl shadow-sm transition-theme">
            <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
              Send a Message
            </h2>
            <p className="text-xs sm:text-sm text-muted-text mb-6">
              Fill out this form for general supply inquiries. Our team will get back to you during work hours.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 p-6 rounded-2xl text-center">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-1">Message Sent Successfully!</h3>
                <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 mb-4">
                  Thank you for reaching out. We will review your query and call you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="py-2 px-4 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-text mb-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-text mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-text mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-text mb-1">Your Message / Material Query</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="E.g., I would like a quote for 100 bags of JK Super Strong Cement delivered to Hoskote."
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <a
                    href={whatsappInquiryUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-accent text-white font-bold hover:bg-accent-hover text-xs transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    Chat on WhatsApp Instead
                  </a>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-2.5 px-6 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover text-xs transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Full-width Map Card */}
        <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden shadow-sm transition-theme">
          <div className="p-4 sm:p-5 border-b border-card-border flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground">Find Us on Google Maps</h3>
              <p className="text-xs text-muted-text">College Main Road, Sulibele</p>
            </div>
            <a
              href="https://maps.google.com/?q=College+Main+Road,+Sulibele,+Karnataka+562129"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-primary dark:text-blue-400 hover:underline"
            >
              Open in Google Maps App →
            </a>
          </div>
          <div className="h-[350px] bg-slate-100">
            <iframe
              title="Lakshmi Agency Google Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.503714578135!2d77.8931102!3d13.1306059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16ff2aaaaaab%3A0xe54df6373b9e4a5e!2sCollege%20Main%20Road%2C%20Sulibele%2C%20Karnataka%20562129!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
