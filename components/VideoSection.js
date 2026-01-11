import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { FaPlay, FaYoutube } from 'react-icons/fa';
import { format } from 'date-fns';

const VideoSection = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState(videos.length > 0 ? videos[0] : null);

  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 0,
      rel: 0,
    },
  };

  if (videos.length === 0) {
    return (
      <section id="videos" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Featured Videos</h2>
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <FaYoutube className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No videos available yet.</p>
            <a
              href="https://www.youtube.com/@newvisionmayyanadan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 mt-4 inline-block"
            >
              Visit our YouTube channel →
            </a>
          </div>
        </div>
      </section>
    );
  }

  const mobileOpts = {
    height: '250',
    width: '100%',
    playerVars: {
      autoplay: 0,
      rel: 0,
    },
  };

  return (
    <section id="videos" className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 sm:mb-4 text-gray-800">Featured Videos</h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 text-sm sm:text-base">Watch our latest videos from YouTube</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden shadow-xl">
              {selectedVideo ? (
                <>
                  <div className="hidden sm:block">
                    <YouTube videoId={selectedVideo.videoId} opts={opts} className="w-full" />
                  </div>
                  <div className="sm:hidden">
                    <YouTube videoId={selectedVideo.videoId} opts={mobileOpts} className="w-full" />
                  </div>
                </>
              ) : (
                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                  <FaPlay className="w-12 h-12 sm:w-20 sm:h-20 text-white opacity-50" />
                </div>
              )}
            </div>
            {selectedVideo && (
              <div className="mt-3 sm:mt-4">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">{selectedVideo.title}</h3>
                {selectedVideo.description && (
                  <p className="text-sm sm:text-base text-gray-600 line-clamp-2 sm:line-clamp-none">{selectedVideo.description}</p>
                )}
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  Added on {format(new Date(selectedVideo.addedAt), 'MMM dd, yyyy')}
                </p>
              </div>
            )}
          </div>

          {/* Video List */}
          <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">More Videos</h3>
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className={`card cursor-pointer transition-all p-2 sm:p-4 ${
                  selectedVideo?.id === video.id ? 'ring-2 ring-blue-600' : ''
                }`}
              >
                <div className="flex space-x-2 sm:space-x-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded"
                      onError={(e) => {
                        // Try hqdefault first, then mqdefault as fallback
                        if (e.target.src.includes('maxresdefault')) {
                          e.target.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                        } else if (e.target.src.includes('hqdefault')) {
                          e.target.src = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;
                        } else {
                          e.target.src = `https://via.placeholder.com/320x180?text=Video+Thumbnail`;
                        }
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-600 rounded-full p-1 sm:p-2 opacity-90">
                        <FaPlay className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2 text-sm sm:text-base">{video.title}</h4>
                    <p className="text-xs text-gray-500">
                      {format(new Date(video.addedAt), 'MMM dd, yyyy')}
                    </p>
                    {video.featured && (
                      <span className="inline-block mt-1 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <a
            href="https://www.youtube.com/@newvisionmayyanadan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
          >
            <FaYoutube className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Subscribe on YouTube</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;

