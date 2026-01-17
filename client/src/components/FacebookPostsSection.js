import React, { useState, useEffect } from 'react';
import { FaFacebook, FaExternalLinkAlt, FaStar } from 'react-icons/fa';
import { format } from 'date-fns';

const FacebookPostsSection = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState(posts.length > 0 ? posts[0] : null);

  useEffect(() => {
    // Re-initialize Facebook SDK when posts change
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, [posts, selectedPost]);

  if (posts.length === 0) {
    return (
      <section id="facebook-posts" className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Facebook Updates</h2>
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft">
            <FaFacebook className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No Facebook posts available yet.</p>
            <a
              href="https://www.facebook.com/profile.php?id=61577465543293"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center space-x-2"
            >
              <span>Visit our Facebook page</span>
              <FaExternalLinkAlt />
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="facebook-posts" className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="section-title">Facebook Updates</h2>
          <p className="section-subtitle">Latest posts and updates from our Facebook page</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Post Embed */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              {selectedPost ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                        <FaFacebook className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">New Vision Mayyanadan</h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(selectedPost.addedAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    {selectedPost.featured && (
                      <span className="badge-warning bg-yellow-500 text-white flex items-center space-x-1">
                        <FaStar className="w-3 h-3" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>
                  
                  {selectedPost.title && (
                    <h4 className="text-xl font-bold text-gray-800 mb-3">{selectedPost.title}</h4>
                  )}
                  
                  {selectedPost.description && (
                    <p className="text-gray-600 mb-4">{selectedPost.description}</p>
                  )}

                  {/* Facebook Post Embed */}
                  <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                    <div 
                      className="fb-post" 
                      data-href={selectedPost.url}
                      data-width="500"
                      data-show-text="true"
                    >
                      <blockquote cite={selectedPost.url} className="fb-xfbml-parse-ignore">
                        <a href={selectedPost.url}>View on Facebook</a>
                      </blockquote>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <a
                      href={selectedPost.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      <span>View Original Post</span>
                      <FaExternalLinkAlt className="w-4 h-4" />
                    </a>
                  </div>
                </>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <FaFacebook className="w-20 h-20 text-blue-400 opacity-50" />
                </div>
              )}
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4 max-h-[700px] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 sticky top-0 bg-gradient-to-br from-blue-50 to-purple-50 py-2 z-10">
              More Posts
            </h3>
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className={`card cursor-pointer transition-all ${
                  selectedPost?.id === post.id ? 'ring-2 ring-blue-600 shadow-large' : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h4>
                      {post.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {post.description}
                        </p>
                      )}
                    </div>
                    {post.featured && (
                      <FaStar className="w-4 h-4 text-yellow-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{format(new Date(post.addedAt), 'MMM dd, yyyy')}</span>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <span>View</span>
                      <FaExternalLinkAlt className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://www.facebook.com/profile.php?id=61577465543293"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 hover:shadow-xl"
          >
            <FaFacebook className="w-5 h-5" />
            <span>Follow us on Facebook</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FacebookPostsSection;


