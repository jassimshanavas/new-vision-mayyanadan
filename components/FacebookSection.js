import React, { useEffect } from 'react';
import { FaFacebook, FaExternalLinkAlt } from 'react-icons/fa';

const FacebookSection = () => {
  useEffect(() => {
    // Initialize Facebook SDK if it's loaded
    if (window.FB) {
      window.FB.XFBML.parse();
    } else {
      // Wait for SDK to load
      window.fbAsyncInit = function() {
        window.FB.init({
          xfbml: true,
          version: 'v18.0'
        });
      };
    }
  }, []);

  return (
    <section id="facebook" className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 sm:mb-4 text-gray-800">Facebook Updates</h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 text-sm sm:text-base">Stay connected with us on Facebook</p>

        <div className="max-w-4xl mx-auto">
          <div className="card p-4 sm:p-6 md:p-8 bg-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="bg-blue-600 p-2 sm:p-3 rounded-full flex-shrink-0">
                  <FaFacebook className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">New Vision Mayyanadan</h3>
                  <p className="text-sm sm:text-base text-gray-600">Follow us for daily updates</p>
                </div>
              </div>
              <a
                href="https://www.facebook.com/profile.php?id=61577465543293"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base w-full sm:w-auto"
              >
                <span>Visit Facebook Page</span>
                <FaExternalLinkAlt className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            </div>

            {/* Facebook Page Plugin Embed */}
            <div className="mt-4 sm:mt-6 overflow-hidden">
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
                  <a href="https://www.facebook.com/profile.php?id=61577465543293" className="text-blue-600 hover:underline">
                    New Vision Mayyanadan
                  </a>
                </blockquote>
              </div>
            </div>

            {/* Fallback link if Facebook embed doesn't work */}
            <div className="mt-4 sm:mt-6 text-center">
              <a
                href="https://www.facebook.com/profile.php?id=61577465543293"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-semibold"
              >
                Can't see the Facebook feed? Click here to visit our page →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacebookSection;

