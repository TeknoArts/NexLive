export const VIDEO_CONFIG = {
  live: {
    default: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  },
  vod: {
    bigBuckBunny: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    sintel: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    tearsOfSteel: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    elephantsDream: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
}

export const VOD_VIDEOS = [
  {
    id: 1,
    title: "Big Buck Bunny",
    description: "A large and lovable rabbit deals with three tiny bullies.",
    url: VIDEO_CONFIG.vod.bigBuckBunny,
    thumbnail: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg",
    duration: 596,
    category: "Animation",
  },
  {
    id: 2,
    title: "Sintel",
    description: "A lonely young woman searches for a baby dragon.",
    url: VIDEO_CONFIG.vod.sintel,
    thumbnail: "https://durian.blender.org/wp-content/uploads/2010/07/sintel_poster.jpg",
    duration: 888,
    category: "Fantasy",
  },
  {
    id: 3,
    title: "Tears of Steel",
    description: "In an apocalyptic world, a group of soldiers and scientists try to save humanity.",
    url: VIDEO_CONFIG.vod.tearsOfSteel,
    thumbnail: "https://mango.blender.org/wp-content/uploads/2013/05/tears_of_steel_poster.jpg",
    duration: 734,
    category: "Sci-Fi",
  },
  {
    id: 4,
    title: "Elephants Dream",
    description: "Two strange characters explore a surreal mechanical world.",
    url: VIDEO_CONFIG.vod.elephantsDream,
    thumbnail: "https://orange.blender.org/wp-content/uploads/2015/10/elephants_dream_poster.jpg",
    duration: 653,
    category: "Animation",
  },
]
