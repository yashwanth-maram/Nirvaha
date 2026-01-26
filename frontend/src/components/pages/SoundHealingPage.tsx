import { motion } from "motion/react";
import { Volume2, Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Bookmark, BookmarkCheck, Share2, Download, ChevronLeft, ChevronRight, Music, Library, Search } from "lucide-react";
import { useState, useEffect } from "react";

export function SoundHealingPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);
  const [savedSongs, setSavedSongs] = useState<number[]>([0, 2, 4]);
  const [lastPlayed, setLastPlayed] = useState<number | null>(() => {
    // Get last played from localStorage or default to first song
    const saved = localStorage.getItem('soundHealingLastPlayed');
    return saved ? parseInt(saved) : 0;
  });
  const [nowPlaying, setNowPlaying] = useState<number | null>(lastPlayed);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [selectedPlaylistSongs, setSelectedPlaylistSongs] = useState<number[] | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<number[]>(() => {
    const saved = localStorage.getItem('soundHealingRecentlyPlayed');
    return saved ? JSON.parse(saved) : [];
  });
  const [recentlySearched, setRecentlySearched] = useState<number[]>([]);
  
  // Create playlists structure
  const playlists = [
    { id: 'liked', name: 'My Playlist', songs: savedSongs, icon: BookmarkCheck },
    { id: 'meditation', name: 'Meditation Collection', songs: [0, 1, 2], icon: Music },
    { id: 'nature', name: 'Nature Sounds', songs: [1, 4], icon: Music },
    { id: 'healing', name: 'Healing Frequencies', songs: [2, 3, 5], icon: Music },
  ];
  
  // Playlists for NIRVAHA Library (exclude 'liked')
  const nirvahaLibraryPlaylists = playlists.filter(p => p.id !== 'liked');
  
  // Helper function to handle save/unsave
  const handleSaveToggle = (songIndex: number) => {
    if (savedSongs.includes(songIndex)) {
      setSavedSongs(savedSongs.filter(idx => idx !== songIndex));
    } else {
      setSavedSongs([...savedSongs, songIndex]);
    }
  };
  
  // Update last played when a song is selected
  useEffect(() => {
    if (nowPlaying !== null) {
      setLastPlayed(nowPlaying);
      localStorage.setItem('soundHealingLastPlayed', nowPlaying.toString());
      
      // Add to recently played
      setRecentlyPlayed((prev) => {
        const updated = [nowPlaying, ...prev.filter(id => id !== nowPlaying)].slice(0, 10);
        localStorage.setItem('soundHealingRecentlyPlayed', JSON.stringify(updated));
        return updated;
      });
    }
  }, [nowPlaying]);
  
  // Handle playlist selection
  const handlePlaylistClick = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
      if (selectedPlaylist === playlistId) {
        // If already selected, deselect to show now playing
        setSelectedPlaylist(null);
        setSelectedPlaylistSongs(null);
      } else {
        setSelectedPlaylist(playlistId);
        setSelectedPlaylistSongs(playlist.songs);
      }
    }
  };
  
  // Handle song click from playlist
  const handleSongClick = (songIndex: number) => {
    setNowPlaying(songIndex);
    setIsPlaying(true);
  };

  const soundLibrary = [
    {
      title: "Tibetan Singing Bowls",
      artist: "Sacred Sounds Collective",
      frequency: "432 Hz",
      duration: "15:30",
      category: "Bowl Therapy",
      color: "from-purple-400 to-pink-500",
      description: "Ancient healing vibrations from the Himalayas",
    },
    {
      title: "Ocean Waves & Rain",
      artist: "Nature Symphony",
      frequency: "528 Hz",
      duration: "20:00",
      category: "Nature Sounds",
      color: "from-blue-400 to-cyan-500",
      description: "Soothing water elements for deep relaxation",
    },
    {
      title: "Theta Binaural Beats",
      artist: "NeuroSound Lab",
      frequency: "639 Hz",
      duration: "30:00",
      category: "Binaural",
      color: "from-indigo-400 to-purple-500",
      description: "Deep meditation and subconscious healing",
    },
    {
      title: "Crystal Bowl Meditation",
      artist: "Quantum Healing",
      frequency: "741 Hz",
      duration: "18:45",
      category: "Crystal Therapy",
      color: "from-emerald-400 to-teal-500",
      description: "Purifying frequencies for cellular healing",
    },
    {
      title: "Forest Ambience",
      artist: "Earth Sounds",
      frequency: "396 Hz",
      duration: "25:00",
      category: "Nature Sounds",
      color: "from-green-400 to-emerald-500",
      description: "Grounding energy from ancient forests",
    },
    {
      title: "Chakra Tuning",
      artist: "Energy Masters",
      frequency: "852 Hz",
      duration: "22:30",
      category: "Chakra Healing",
      color: "from-violet-400 to-purple-500",
      description: "Balance all seven energy centers",
    },
  ];

  // Map tracks to images
  const trackImages = [
    '/sound/2aa87f5f6dfbdc3f7f47a5e8493273be.jpg',
    '/sound/2a2b99a3b073d688ce92925c1d9b7c07.jpg',
    '/sound/45bc8587c06c2d0caa11dc3573575502.jpg',
    '/sound/f87f8b57d4fabe5dcaece8ce2f1b7da7.jpg',
    '/sound/4972ed67c28c08971ac322192e87a6e1.jpg',
    '/sound/download.png',
  ];

  // Ensure nowPlaying is set to last played on mount
  useEffect(() => {
    if (nowPlaying === null) {
      setNowPlaying(lastPlayed !== null ? lastPlayed : 0);
    }
  }, [lastPlayed]);
  
  // Get currently playing track
  const currentPlayingIndex = nowPlaying !== null ? nowPlaying : (lastPlayed !== null ? lastPlayed : 0);
  const currentPlayingTrack = soundLibrary[currentPlayingIndex] || soundLibrary[0];

  // Update play progress when playing
  useEffect(() => {
    if (isPlaying && currentPlayingIndex !== null) {
      const interval = setInterval(() => {
        setPlayProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentPlayingIndex]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white pt-20">
      {/* Wave Background - Extends behind content */}
      <div className="fixed inset-0 top-20 pointer-events-none z-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative w-full h-full"
        >
          {/* Wave bars extending down */}
          <div className="absolute inset-0 flex items-start justify-center gap-2 px-8 pt-0">
            {Array.from({ length: 60 }).map((_, i) => {
              const height = Math.sin(i * 0.2) * 40 + 60;
              return (
                <motion.div
                  key={i}
                  className="flex-1 bg-gradient-to-b from-lime-400/30 via-emerald-400/20 to-transparent rounded-full"
                  style={{ minWidth: "4px" }}
                  animate={{
                    height: [
                      `${height * 0.8}px`,
                      `${height * 0.4}px`,
                      `${height * 1.2}px`,
                      `${height * 0.8}px`,
                    ],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.05,
                  }}
                />
              );
            })}
          </div>

          {/* Sound Rings - Subtle background effect */}
          <motion.div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [0.8, 2], opacity: [0.3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
          >
            <div className="w-64 h-64 rounded-full border border-lime-400/20" />
          </motion.div>

          <motion.div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [0.8, 2.5], opacity: [0.2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeOut", delay: 1 }}
          >
            <div className="w-64 h-64 rounded-full border border-emerald-400/15" />
          </motion.div>
        </motion.div>
      </div>

      {/* Main Layout: Left Sidebar, Center, Right Panel */}
      <div className="relative z-10 flex min-h-[calc(100vh-20rem)] pt-2">
        {/* Left Sidebar - My Library */}
        <motion.div
          initial={{ x: isLibraryOpen ? 0 : -300 }}
          animate={{ x: isLibraryOpen ? 0 : -300 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`relative ${isLibraryOpen ? 'w-64' : 'w-0'} bg-gray-900 border-r border-gray-700 overflow-hidden transition-all duration-300`}
        >
          <div className="h-full flex flex-col">
            {/* Library Header */}
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Library className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-lg font-bold">Your Library</h2>
                </div>
                <button
                  onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                  className="p-1 hover:bg-gray-800 rounded"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
              
              {/* Search in Library */}
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in Your Library"
                  className="w-full pl-7 pr-2 py-1.5 bg-gray-800 rounded-md text-xs text-white placeholder-gray-400 border border-emerald-500/30 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Library Content */}
            <div className="flex-1 overflow-y-auto p-3">
              {/* My Playlist Section */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">My Playlist</h3>
                <div className="space-y-1">
                  {playlists.filter(p => p.id === 'liked').map((playlist) => {
                    const Icon = playlist.icon;
                    return (
                      <motion.div
                        key={playlist.id}
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                        onClick={() => handlePlaylistClick(playlist.id)}
                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer group ${
                          selectedPlaylist === playlist.id ? 'bg-emerald-500/20 border border-emerald-500/30' : ''
                        }`}
                      >
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{playlist.name}</p>
                          <p className="text-xs text-gray-400">{playlist.songs.length} songs</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Recently Played */}
              {recentlyPlayed.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Recently Played</h3>
                  <div className="space-y-1">
                    {recentlyPlayed.slice(0, 5).map((trackIdx) => {
                      const track = soundLibrary[trackIdx];
                      if (!track) return null;
                      return (
                        <motion.div
                          key={trackIdx}
                          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                          onClick={() => handleSongClick(trackIdx)}
                          className="flex items-center gap-2 p-1.5 rounded-md cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded flex-shrink-0 overflow-hidden">
                            <img 
                              src={trackImages[trackIdx % trackImages.length]} 
                              alt={track.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="%2310b981"/></svg>`)}`;
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{track.title}</p>
                            <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recently Searched */}
              {recentlySearched.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Recently Searched</h3>
                  <div className="space-y-1">
                    {recentlySearched.slice(0, 5).map((trackIdx) => {
                      const track = soundLibrary[trackIdx];
                      if (!track) return null;
                      return (
                        <motion.div
                          key={trackIdx}
                          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                          onClick={() => handleSongClick(trackIdx)}
                          className="flex items-center gap-2 p-1.5 rounded-md cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded flex-shrink-0 overflow-hidden">
                            <img 
                              src={trackImages[trackIdx % trackImages.length]} 
                              alt={track.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="%23a855f7"/></svg>`)}`;
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{track.title}</p>
                            <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Toggle Button when closed - Edge button */}
          {!isLibraryOpen && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsLibraryOpen(true)}
              className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-emerald-500 hover:bg-emerald-600 p-2.5 rounded-r-lg shadow-lg transition-all border-r-2 border-emerald-600"
              style={{ marginTop: '4rem' }}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </motion.button>
          )}
        </motion.div>

        {/* Center Content - Playlist Songs or Now Playing Song */}
        <div className={`flex-1 overflow-y-auto bg-transparent px-6 py-4 flex flex-col relative ${
          selectedPlaylistSongs ? 'items-start justify-start' : 'items-center justify-center'
        }`}>
          {/* Open Sidebar Button - Top Left */}
          {!isLibraryOpen && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsLibraryOpen(true)}
              className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-lg transition-all group"
            >
              <ChevronRight className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">My Library</span>
            </motion.button>
          )}
          
          {/* Show Playlist Songs or Now Playing */}
          {selectedPlaylistSongs ? (
            <div className="w-full max-w-4xl mt-2">
              <div className="mb-6 pt-12">
                <h2 className="text-2xl font-bold mb-4">
                  {playlists.find(p => p.id === selectedPlaylist)?.name || 'Playlist'}
                </h2>
                <div className="space-y-2">
                  {selectedPlaylistSongs.map((songIdx, index) => {
                    const track = soundLibrary[songIdx];
                    if (!track) return null;
                    return (
                      <motion.div
                        key={songIdx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                        onClick={() => handleSongClick(songIdx)}
                        className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                          currentPlayingIndex === songIdx ? 'bg-emerald-500/20 border border-emerald-500/30' : ''
                        }`}
                      >
                        <div className="w-12 h-12 rounded flex-shrink-0 overflow-hidden">
                          <img 
                            src={trackImages[songIdx % trackImages.length]} 
                            alt={track.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="%2310b981"/></svg>`)}`;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${currentPlayingIndex === songIdx ? 'text-emerald-400' : 'text-white'}`}>
                            {track.title}
                          </p>
                          <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400">{track.duration}</span>
                          {currentPlayingIndex === songIdx && isPlaying ? (
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-1 bg-emerald-400 rounded-full"
                                  animate={{
                                    height: [4, 12, 4],
                                    opacity: [0.5, 1, 0.5],
                                  }}
                                  transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                  }}
                                />
                              ))}
                            </div>
                          ) : (
                            <Play className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl">
              {/* Song Image */}
              <div className="w-full aspect-square max-w-md mx-auto mb-6 rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src={trackImages[currentPlayingIndex % trackImages.length]} 
                  alt={currentPlayingTrack.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="%2310b981"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="32">${currentPlayingTrack.title}</text></svg>`)}`;
                  }}
                />
              </div>

              {/* Song Info */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">{currentPlayingTrack.title}</h2>
                <p className="text-lg text-gray-400 mb-4">{currentPlayingTrack.artist}</p>
                <div className="flex gap-2 justify-center mb-6">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-semibold">
                    {currentPlayingTrack.category}
                  </span>
                  <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm font-semibold">
                    {currentPlayingTrack.frequency}
                  </span>
                </div>
              </div>

              {/* Wave Animation around Play Controls */}
              <div className="relative mb-6 h-32 flex items-center justify-center">
                {/* Wave Background */}
                <div className="absolute inset-0 flex items-center justify-center gap-1">
                  {Array.from({ length: 50 }).map((_, i) => {
                    const baseHeight = 25;
                    return (
                      <motion.div
                        key={i}
                        className="w-1 bg-emerald-400/50 rounded-full"
                        animate={{
                          height: [
                            `${baseHeight + Math.sin(i * 0.25) * 20}px`,
                            `${baseHeight + Math.sin(i * 0.25 + Math.PI) * 20}px`,
                            `${baseHeight + Math.sin(i * 0.25) * 20}px`,
                          ],
                          opacity: [0.4, 0.8, 0.4],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.04,
                        }}
                      />
                    );
                  })}
                </div>

                {/* Play Controls */}
                <div className="relative z-10 flex items-center justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-sm"
                  >
                    <SkipBack className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-20 h-20 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center shadow-xl"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 ml-1 text-white" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-sm"
                  >
                    <SkipForward className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden mb-2">
                  <motion.div
                    className="h-full bg-emerald-500"
                    initial={{ width: "0%" }}
                    animate={{ width: isPlaying ? `${playProgress}%` : `${playProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>0:00</span>
                  <span>{currentPlayingTrack.duration}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSaveToggle(currentPlayingIndex)}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                    savedSongs.includes(currentPlayingIndex) 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {savedSongs.includes(currentPlayingIndex) ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                  <span className="text-sm font-semibold">
                    {savedSongs.includes(currentPlayingIndex) ? 'Saved' : 'Save'}
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 flex items-center justify-center"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 flex items-center justify-center"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Additional Controls */}
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 text-gray-400 hover:text-white"
                >
                  <Shuffle className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 text-gray-400 hover:text-white"
                >
                  <Repeat className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Description */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400 leading-relaxed max-w-lg mx-auto">{currentPlayingTrack.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - NIRVAHA Library */}
        <div className="w-80 bg-gray-900 border-l border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Library className="w-5 h-5 text-emerald-400" />
              NIRVAHA Library
            </h2>
            
            {/* All Playlists */}
            <div className="space-y-2 mb-6">
              {nirvahaLibraryPlaylists.map((playlist) => {
                const Icon = playlist.icon;
                const isSelected = selectedPlaylist === playlist.id;
                return (
                  <motion.div
                    key={playlist.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                    onClick={() => handlePlaylistClick(playlist.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      isSelected ? 'bg-emerald-500/20 border border-emerald-500/30' : 'hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                          {playlist.name}
                        </p>
                        <p className="text-xs text-gray-400">{playlist.songs.length} songs</p>
                      </div>
                    </div>
                    
                    {/* Show songs if this playlist is selected */}
                    {isSelected && (
                      <div className="mt-3 space-y-1.5 pl-12">
                        {playlist.songs.map((songIdx) => {
                          const track = soundLibrary[songIdx];
                          if (!track) return null;
                          return (
                            <motion.div
                              key={songIdx}
                              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSongClick(songIdx);
                              }}
                              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                                currentPlayingIndex === songIdx ? 'bg-emerald-500/20' : ''
                              }`}
                            >
                              <div className="w-8 h-8 rounded flex-shrink-0 overflow-hidden">
                                <img 
                                  src={trackImages[songIdx % trackImages.length]} 
                                  alt={track.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="%2310b981"/></svg>`)}`;
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-medium truncate ${currentPlayingIndex === songIdx ? 'text-emerald-400' : 'text-gray-300'}`}>
                                  {track.title}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                              </div>
                              {currentPlayingIndex === songIdx && isPlaying && (
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: 3 }).map((_, i) => (
                                    <motion.div
                                      key={i}
                                      className="w-0.5 bg-emerald-400 rounded-full"
                                      animate={{
                                        height: [3, 8, 3],
                                        opacity: [0.5, 1, 0.5],
                                      }}
                                      transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Player Bar - Only shows when playing */}
      {isPlaying && nowPlaying !== null && currentPlayingTrack && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          onClick={() => {
            setSelectedPlaylist(null);
            setSelectedPlaylistSongs(null);
          }}
          className="fixed bottom-0 left-0 right-0 h-20 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 z-50 flex items-center px-4 cursor-pointer hover:bg-gray-900 transition-colors"
        >
          <div className="flex items-center gap-4 flex-1 max-w-7xl mx-auto">
            {/* Current Track Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-14 h-14 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img 
                  src={trackImages[currentPlayingIndex % trackImages.length]} 
                  alt={currentPlayingTrack.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><rect width="56" height="56" fill="%2310b981"/></svg>`)}`;
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{currentPlayingTrack.title}</p>
                <p className="text-xs text-gray-400 truncate">{currentPlayingTrack.artist}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveToggle(currentPlayingIndex);
                }}
                className={`p-2 rounded-full ${
                  savedSongs.includes(currentPlayingIndex) 
                    ? 'text-emerald-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {savedSongs.includes(currentPlayingIndex) ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </motion.button>
            </div>

            {/* Play Controls */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="p-2 text-gray-400 hover:text-white"
              >
                <Shuffle className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="p-2 text-gray-400 hover:text-white"
              >
                <SkipBack className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(!isPlaying);
                }}
                className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center hover:scale-110 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="p-2 text-gray-400 hover:text-white"
              >
                <SkipForward className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="p-2 text-gray-400 hover:text-white"
              >
                <Repeat className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Progress and Volume */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
                <span className="text-xs text-gray-400 w-10 text-right">0:00</span>
                <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${playProgress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-10">{currentPlayingTrack.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-gray-400" />
                <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
