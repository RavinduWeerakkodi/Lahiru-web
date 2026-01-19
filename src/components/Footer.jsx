import React from 'react';
import { Phone, Mail, MapPin, Facebook } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const Footer = () => {
  const { settings, loading } = useSettings();

  if (loading) return null; // Or a simple skeleton

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8"> {/* Adjusted grid layout for 4 columns */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B0000] to-[#660000] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">LE</span>
              </div>
              <div>
                <h3 className="font-poppins font-bold text-xl">Lahiru Enterprises</h3>
              </div>
            </div>
            <p className="text-gray-400">
              Your trusted partner for high-quality murukku industry machinery and food processing equipment.
            </p>
          </div>

          <div>
            <h4 className="font-poppins font-bold text-lg mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#8B0000] mt-1" />
                <div>
                  <p>{settings.contactPhone1}</p>
                  {settings.contactPhone2 && <p>{settings.contactPhone2}</p>}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#8B0000] mt-1" />
                <p>{settings.contactEmail}</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#8B0000] mt-1" />
                <p className="whitespace-pre-line">{settings.contactAddress}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-poppins font-bold text-lg mb-4">Business Hours</h4>
            <div className="space-y-2 text-gray-400">
              <p><span className="text-white">Monday - Friday:</span> 8:00 AM - 6:00 PM</p>
              <p><span className="text-white">Saturday:</span> 8:00 AM - 4:00 PM</p>
              <p><span className="text-white">Sunday:</span> Closed</p>
            </div>
          </div>

          <div>
            <h4 className="font-poppins font-bold text-lg mb-4">Social Media</h4>
            <div className="flex items-center gap-3">
              {settings.social.facebook && (
                <a
                  href={settings.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#8B0000] transition-colors"
                  aria-label="Visit us on Facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Lahiru Enterprises. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;