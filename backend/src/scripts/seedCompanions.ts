import mongoose from 'mongoose';
import Companion from '../models/Companion.model';

const companions = [
  {
    name: 'Dr. Anjali Sharma',
    title: 'Mindfulness & Meditation Expert',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    coverImage: 'https://images.unsplash.com/photo-1676747484510-755c231ae83e?w=800',
    rating: 4.9,
    reviews: 342,
    sessions: 1247,
    location: 'Mumbai, India',
    languages: ['English', 'Hindi', 'Marathi'],
    specialties: ['Breath Work', 'Chakra Healing', 'Stress Management'],
    bio: '20+ years of experience in mindfulness meditation and holistic wellness. Certified yoga instructor and spiritual guide.',
    hourlyRate: 60,
    callRate: 25,
    availability: true,
    responseTime: '2 hours',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    name: 'Master Li Wei',
    title: 'Energy Healing & Qi Gong Master',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    coverImage: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800',
    rating: 5.0,
    reviews: 218,
    sessions: 892,
    location: 'Singapore',
    languages: ['English', 'Mandarin', 'Cantonese'],
    specialties: ['Qi Gong', 'Energy Healing', 'Traditional Chinese Medicine'],
    bio: 'Master practitioner with 30+ years experience in Eastern healing arts. Trained in Shaolin Temple traditions.',
    hourlyRate: 90,
    callRate: 40,
    availability: true,
    responseTime: '1 hour',
    color: 'from-purple-400 to-indigo-500',
  },
  {
    name: 'Elena Costa',
    title: 'Sound Healing Therapist',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    coverImage: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800',
    rating: 4.8,
    reviews: 567,
    sessions: 2103,
    location: 'Barcelona, Spain',
    languages: ['English', 'Spanish', 'Catalan'],
    specialties: ['Sound Bowls', 'Frequency Therapy', 'Vibrational Healing'],
    bio: 'Certified sound healing therapist and musician. Specializing in Tibetan singing bowls and crystal bowl therapy.',
    hourlyRate: 75,
    callRate: 35,
    availability: false,
    responseTime: '4 hours',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    name: 'Yogi Ravi Kumar',
    title: 'Pranayama & Breathwork Specialist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    rating: 4.9,
    reviews: 891,
    sessions: 3421,
    location: 'Rishikesh, India',
    languages: ['English', 'Hindi', 'Sanskrit'],
    specialties: ['Pranayama', 'Kundalini', 'Hatha Yoga'],
    bio: 'Traditional yogi trained in the Himalayas. Expert in ancient breathing techniques and energy cultivation.',
    hourlyRate: 55,
    callRate: 20,
    availability: true,
    responseTime: '3 hours',
    color: 'from-orange-400 to-red-500',
  },
  {
    name: 'Sarah Mitchell',
    title: 'Spiritual Life Coach',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    coverImage: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800',
    rating: 4.7,
    reviews: 423,
    sessions: 1567,
    location: 'Los Angeles, USA',
    languages: ['English', 'French'],
    specialties: ['Life Coaching', 'Manifestation', 'Inner Child Work'],
    bio: 'Transformational coach helping clients unlock their spiritual potential and manifest their dreams.',
    hourlyRate: 85,
    callRate: 45,
    availability: true,
    responseTime: '1 hour',
    color: 'from-lime-400 to-emerald-500',
  },
  {
    name: 'Alex Rivera',
    title: 'Spiritual Awakening Guide',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    coverImage: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=800',
    rating: 5.0,
    reviews: 734,
    sessions: 2891,
    location: 'Sedona, USA',
    languages: ['English', 'Spanish'],
    specialties: ['Spiritual Awakening', 'Shadow Work', 'Consciousness Expansion'],
    bio: 'Guide for those experiencing spiritual awakening. Specializing in navigating consciousness shifts and integration.',
    hourlyRate: 95,
    callRate: 50,
    availability: true,
    responseTime: '2 hours',
    color: 'from-pink-400 to-rose-500',
  },
];

const seedCompanions = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nirvaha';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing companions
    await Companion.deleteMany({});
    console.log('Cleared existing companions');

    // Insert seed data
    await Companion.insertMany(companions);
    console.log(`Seeded ${companions.length} companions`);

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding companions:', error);
    process.exit(1);
  }
};

seedCompanions();

