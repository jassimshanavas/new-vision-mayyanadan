import React, { useEffect, useRef } from 'react';
import { FaFacebook, FaExternalLinkAlt } from 'react-icons/fa';

const FacebookSection = () => {
  const initializedRef = useRef(false);

  useEffect(() => {
    // Function to parse Facebook XFBML content
    const parseFB = () => {
      if (window.FB && !initializedRef.current) {
        window.FB.XFBML.parse();
        initializedRef.current = true;
      }
    };

    // Check if SDK is already loaded
    if (window.FB) {
      parseFB();
    } else {
      // Set up initialization callback if SDK hasn't loaded yet
      const existingCallback = window.fbAsyncInit;
      window.fbAsyncInit = function() {
        if (existingCallback) existingCallback();
        parseFB();
      };

      // Also check periodically in case the script loaded before our callback was set
      const checkInterval = setInterval(() => {
        if (window.FB) {
          parseFB();
          clearInterval(checkInterval);
        }
      }, 100);

      // Cleanup
      return () => {
        clearInterval(checkInterval);
      };
    }
  }, []);

  return (
    <section id="facebook" className="py-20 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-3 sm:mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
            Facebook Updates
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto">Stay connected with us on Facebook for the latest updates and community news</p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="card p-6 sm:p-8 md:p-10">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 pb-6 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
                  <FaFacebook className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-gray-900">New Vision Mayyanadan</h3>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">Follow us for daily updates and community news</p>
                </div>
              </div>
              <a
                href="https://www.facebook.com/profile.php?id=61577465543293"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 text-sm sm:text-base"
              >
                <span>Visit Facebook Page</span>
                <FaExternalLinkAlt className="w-4 h-4" />
              </a>
            </div>

            {/* Facebook Page Plugin Embed */}
            <div className="mt-6 sm:mt-8 overflow-hidden rounded-xl bg-white border border-gray-100 p-2 sm:p-4">
              <div 
                className="fb-page" 
                data-href="https://www.facebook.com/profile.php?id=61577465543293"
                data-tabs="timeline"
                data-width="500"
                data-height="600"
                data-small-header="true"
                data-adapt-container-width="true"
                data-hide-cover="false"
                data-show-facepile="true"
              >
                <blockquote 
                  cite="https://www.facebook.com/profile.php?id=61577465543293" 
                  className="fb-xfbml-parse-ignore"
                >
                  <a href="https://www.facebook.com/profile.php?id=61577465543293" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                    New Vision Mayyanadan
                  </a>
                </blockquote>
              </div>
            </div>

            {/* Fallback link if Facebook embed doesn't work */}
            <div className="mt-6 sm:mt-8 text-center pt-6 border-t border-gray-100">
              <a
                href="https://www.facebook.com/profile.php?id=61577465543293"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base transition-colors"
              >
                <span>Can't see the Facebook feed? Click here to visit our page</span>
                <FaExternalLinkAlt className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-8 sm:mt-10 text-center">
            <a
              href="https://www.facebook.com/profile.php?id=61577465543293"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
            >
              <FaFacebook className="w-5 h-5" />
              <span>Follow us on Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacebookSection;

