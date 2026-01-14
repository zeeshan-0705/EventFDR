import { Event } from '@/types';

// Mock Events Data
export const mockEvents: Event[] = [
  {
    id: 'evt-001',
    title: 'TechConf 2026 - Future of AI',
    shortDescription: 'The largest tech conference featuring AI, ML, and Cloud innovations.',
    description: 'Join us for the largest technology conference in South Asia. Explore cutting-edge innovations in AI, Machine Learning, Cloud Computing, and more. Network with industry leaders and discover the technologies shaping tomorrow.',
    category: 'Technology',
    date: '2026-02-15',
    time: '09:00',
    endDate: '2026-02-17',
    endTime: '18:00',
    venue: 'Bangalore International Exhibition Centre',
    address: 'BIEC, Tumakuru Road',
    city: 'Bangalore',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    price: 2499,
    currency: 'INR',
    capacity: 5000,
    registered: 3847,
    organizer: {
      name: 'TechEvents India',
      email: 'events@techconf.in',
      verified: true
    },
    tags: ['AI', 'Machine Learning', 'Cloud', 'Tech Conference'],
    featured: true,
    status: 'upcoming',
    highlights: [
      '50+ Expert Speakers',
      'Hands-on Workshops',
      'Networking Sessions',
      'Job Fair',
      'Startup Pitch Competition'
    ],
    schedule: [
      { day: 'Day 1', title: 'AI & Machine Learning Track', time: '9:00 AM - 6:00 PM' },
      { day: 'Day 2', title: 'Cloud & DevOps Track', time: '9:00 AM - 6:00 PM' },
      { day: 'Day 3', title: 'Future Tech & Networking', time: '9:00 AM - 4:00 PM' }
    ]
  },
  {
    id: 'evt-002',
    title: 'Music Festival: Sounds of India',
    shortDescription: 'A celebration of Indian classical and contemporary music.',
    description: 'Experience the magic of Indian music at this grand festival featuring renowned artists from across the country. From classical ragas to modern fusion, immerse yourself in a musical journey like no other.',
    category: 'Music',
    date: '2026-03-20',
    time: '17:00',
    endDate: '2026-03-22',
    endTime: '23:00',
    venue: 'Mahalaxmi Race Course',
    address: 'Mahalaxmi, Mumbai',
    city: 'Mumbai',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop',
    price: 1499,
    currency: 'INR',
    capacity: 15000,
    registered: 8932,
    organizer: {
      name: 'Musical Nights Entertainment',
      email: 'contact@musicalnights.com',
      verified: true
    },
    tags: ['Music', 'Festival', 'Live Concert', 'Classical', 'Contemporary'],
    featured: true,
    status: 'upcoming',
    highlights: [
      '30+ Artists',
      'Multiple Stages',
      'Food Bazaar',
      'Art Installations',
      'Late Night After Party'
    ],
    schedule: [
      { day: 'Day 1', title: 'Classical Evening', time: '5:00 PM - 11:00 PM' },
      { day: 'Day 2', title: 'Fusion Night', time: '5:00 PM - 11:00 PM' },
      { day: 'Day 3', title: 'Contemporary Finale', time: '5:00 PM - 11:00 PM' }
    ]
  },
  {
    id: 'evt-003',
    title: 'Photography Workshop: Street & Portrait',
    shortDescription: 'Hands-on photography workshop covering street and portrait techniques.',
    description: 'Master the art of street and portrait photography with our expert instructors. This intensive workshop covers composition, lighting, editing, and storytelling through your lens.',
    category: 'Arts & Culture',
    date: '2026-02-22',
    time: '10:00',
    endDate: '2026-02-23',
    endTime: '17:00',
    venue: 'India Habitat Centre',
    address: 'Lodhi Estate',
    city: 'New Delhi',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=400&fit=crop',
    price: 3999,
    currency: 'INR',
    capacity: 50,
    registered: 42,
    organizer: {
      name: 'Lens Masters Academy',
      email: 'workshops@lensmasters.in',
      verified: true
    },
    tags: ['Photography', 'Workshop', 'Portrait', 'Street Photography'],
    featured: false,
    status: 'upcoming',
    highlights: [
      'Small Batch Size',
      'Equipment Provided',
      'City Photo Walk',
      'Portfolio Review',
      'Certification'
    ],
    schedule: [
      { day: 'Day 1', title: 'Theory & Indoor Sessions', time: '10:00 AM - 5:00 PM' },
      { day: 'Day 2', title: 'Outdoor Photo Walk & Review', time: '10:00 AM - 5:00 PM' }
    ]
  },
  {
    id: 'evt-004',
    title: 'Startup Summit 2026',
    shortDescription: 'Connect with investors, mentors, and fellow entrepreneurs.',
    description: 'The premier startup event bringing together entrepreneurs, investors, and industry experts. Pitch your ideas, learn from success stories, and find potential partners for your venture.',
    category: 'Business',
    date: '2026-03-10',
    time: '08:30',
    endDate: '2026-03-11',
    endTime: '18:30',
    venue: 'Hitex Exhibition Center',
    address: 'Madhapur',
    city: 'Hyderabad',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
    price: 999,
    currency: 'INR',
    capacity: 2000,
    registered: 1567,
    organizer: {
      name: 'Startup India Foundation',
      email: 'summit@startupindia.org',
      verified: true
    },
    tags: ['Startup', 'Business', 'Networking', 'Investment'],
    featured: true,
    status: 'upcoming',
    highlights: [
      'Pitch Competition',
      'Investor Meetings',
      'Mentorship Sessions',
      'Funding Opportunities',
      'Exhibition Booths'
    ],
    schedule: [
      { day: 'Day 1', title: 'Keynotes & Panels', time: '8:30 AM - 6:30 PM' },
      { day: 'Day 2', title: 'Pitch Day & Networking', time: '9:00 AM - 6:00 PM' }
    ]
  },
  {
    id: 'evt-005',
    title: 'Yoga & Wellness Retreat',
    shortDescription: 'A transformative weekend of yoga, meditation, and holistic healing.',
    description: 'Escape the city chaos and rejuvenate your mind, body, and soul. This retreat offers daily yoga sessions, guided meditation, Ayurvedic meals, and holistic wellness practices.',
    category: 'Health & Wellness',
    date: '2026-02-28',
    time: '06:00',
    endDate: '2026-03-01',
    endTime: '18:00',
    venue: 'Ananda Resort',
    address: 'Rishikesh',
    city: 'Rishikesh',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=400&fit=crop',
    price: 8999,
    currency: 'INR',
    capacity: 40,
    registered: 35,
    organizer: {
      name: 'Wellness Way',
      email: 'retreats@wellnessway.in',
      verified: true
    },
    tags: ['Yoga', 'Meditation', 'Wellness', 'Retreat', 'Ayurveda'],
    featured: false,
    status: 'upcoming',
    highlights: [
      'Riverside Yoga',
      'Guided Meditation',
      'Ayurvedic Meals',
      'Nature Walks',
      'Spiritual Healing Sessions'
    ],
    schedule: [
      { day: 'Day 1', title: 'Arrival & Evening Yoga', time: '4:00 PM - 8:00 PM' },
      { day: 'Day 2', title: 'Full Day Wellness', time: '5:00 AM - 9:00 PM' },
      { day: 'Day 3', title: 'Morning Session & Departure', time: '5:00 AM - 12:00 PM' }
    ]
  },
  {
    id: 'evt-006',
    title: 'Culinary Masterclass: South Indian Cuisine',
    shortDescription: 'Learn authentic South Indian recipes from master chefs.',
    description: 'Discover the secrets of South Indian cuisine in this hands-on cooking masterclass. From making the perfect dosa to traditional curries, learn techniques passed down through generations.',
    category: 'Food & Drink',
    date: '2026-02-18',
    time: '10:00',
    endDate: '2026-02-18',
    endTime: '16:00',
    venue: 'Culinary Institute of Chennai',
    address: 'Nungambakkam',
    city: 'Chennai',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop',
    price: 2499,
    currency: 'INR',
    capacity: 20,
    registered: 18,
    organizer: {
      name: 'Chef Academy',
      email: 'classes@chefacademy.in',
      verified: true
    },
    tags: ['Cooking', 'South Indian', 'Masterclass', 'Food'],
    featured: false,
    status: 'upcoming',
    highlights: [
      'Hands-on Cooking',
      'Take-home Recipes',
      'Ingredients Included',
      'Lunch Provided',
      'Certificate of Completion'
    ],
    schedule: [
      { day: 'Day 1', title: 'South Indian Breakfast & Lunch', time: '10:00 AM - 4:00 PM' }
    ]
  },
  {
    id: 'evt-007',
    title: 'Stand-up Comedy Night',
    shortDescription: 'An evening of laughter with India\'s top comedians.',
    description: 'Get ready for a night of non-stop laughter featuring some of India\'s most popular stand-up comedians. From observational humor to witty social commentary, this show has it all.',
    category: 'Entertainment',
    date: '2026-02-25',
    time: '20:00',
    endDate: '2026-02-25',
    endTime: '23:00',
    venue: 'Canvas Laugh Club',
    address: 'Cyberhub, DLF Cyber City',
    city: 'Gurgaon',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=400&fit=crop',
    price: 799,
    currency: 'INR',
    capacity: 200,
    registered: 175,
    organizer: {
      name: 'Laugh Out Loud Productions',
      email: 'bookings@lolproductions.com',
      verified: true
    },
    tags: ['Comedy', 'Stand-up', 'Entertainment', 'Night Out'],
    featured: false,
    status: 'upcoming',
    highlights: [
      '5 Top Comedians',
      'Fresh Material',
      'Meet & Greet',
      'Bar Service Available'
    ],
    schedule: [
      { day: 'Day 1', title: 'Comedy Night', time: '8:00 PM - 11:00 PM' }
    ]
  },
  {
    id: 'evt-008',
    title: 'Marathon: Run for Green',
    shortDescription: 'A marathon promoting environmental awareness and fitness.',
    description: 'Join thousands of runners in this eco-friendly marathon. With categories for all fitness levels, this event combines love for running with environmental consciousness.',
    category: 'Sports',
    date: '2026-03-15',
    time: '05:30',
    endDate: '2026-03-15',
    endTime: '11:00',
    venue: 'Cubbon Park',
    address: 'Kasturba Road',
    city: 'Bangalore',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800&h=400&fit=crop',
    price: 599,
    currency: 'INR',
    capacity: 10000,
    registered: 6543,
    organizer: {
      name: 'Green Earth Foundation',
      email: 'marathon@greenearth.org',
      verified: true
    },
    tags: ['Marathon', 'Running', 'Sports', 'Fitness', 'Environment'],
    featured: true,
    status: 'upcoming',
    highlights: [
      'Multiple Categories (5K, 10K, 21K, 42K)',
      'Tree Plantation Drive',
      'Eco-friendly Medals',
      'Finisher Certificates',
      'Free Health Checkup'
    ],
    schedule: [
      { day: 'Day 1', title: 'Marathon Day', time: '5:30 AM - 11:00 AM' }
    ]
  },
  {
    id: 'evt-009',
    title: 'Art Exhibition: Modern India',
    shortDescription: 'Contemporary art showcasing India\'s modern identity.',
    description: 'A curated exhibition featuring works from 50+ contemporary Indian artists exploring themes of modernity, tradition, and identity. Experience art that challenges and inspires.',
    category: 'Arts & Culture',
    date: '2026-02-01',
    time: '10:00',
    endDate: '2026-02-28',
    endTime: '19:00',
    venue: 'National Gallery of Modern Art',
    address: 'Jaipur House, India Gate',
    city: 'New Delhi',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=800&h=400&fit=crop',
    price: 0,
    currency: 'INR',
    capacity: 500,
    registered: 234,
    organizer: {
      name: 'NGMA Delhi',
      email: 'exhibitions@ngmaindia.gov.in',
      verified: true
    },
    tags: ['Art', 'Exhibition', 'Contemporary', 'Culture'],
    featured: false,
    status: 'upcoming',
    highlights: [
      '50+ Artists',
      'Guided Tours Available',
      'Artists\' Talk Sessions',
      'Interactive Installations',
      'Free Entry'
    ],
    schedule: [
      { day: 'Daily', title: 'Exhibition Open', time: '10:00 AM - 7:00 PM' },
      { day: 'Weekends', title: 'Guided Tours', time: '11:00 AM & 3:00 PM' }
    ]
  },
  {
    id: 'evt-010',
    title: 'Blockchain & Web3 Summit',
    shortDescription: 'Explore the future of decentralized technologies.',
    description: 'The most comprehensive blockchain event in India. Learn about DeFi, NFTs, DAOs, and the future of Web3 from industry pioneers and thought leaders.',
    category: 'Technology',
    date: '2026-04-05',
    time: '09:00',
    endDate: '2026-04-06',
    endTime: '18:00',
    venue: 'JW Marriott',
    address: 'Aerocity',
    city: 'New Delhi',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    price: 4999,
    currency: 'INR',
    capacity: 1000,
    registered: 423,
    organizer: {
      name: 'Web3 India',
      email: 'summit@web3india.com',
      verified: true
    },
    tags: ['Blockchain', 'Web3', 'Crypto', 'DeFi', 'NFT'],
    featured: false,
    status: 'upcoming',
    highlights: [
      'Expert Panels',
      'Hackathon',
      'Startup Showcase',
      'Networking Dinner',
      'Exclusive NFT Drops'
    ],
    schedule: [
      { day: 'Day 1', title: 'Keynotes & Workshops', time: '9:00 AM - 6:00 PM' },
      { day: 'Day 2', title: 'Hackathon & Demo Day', time: '9:00 AM - 6:00 PM' }
    ]
  }
];

// Event Categories
export const eventCategories = [
  'All Events',
  'Technology',
  'Business',
  'Music',
  'Arts & Culture',
  'Sports',
  'Health & Wellness',
  'Food & Drink',
  'Entertainment',
  'Education'
];

// Cities for filters
export const cities = [
  'All Cities',
  'Mumbai',
  'Bangalore',
  'New Delhi',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Gurgaon',
  'Rishikesh'
];

// Price ranges for filters
export const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Free', min: 0, max: 0 },
  { label: 'Under ₹1,000', min: 1, max: 999 },
  { label: '₹1,000 - ₹3,000', min: 1000, max: 3000 },
  { label: '₹3,000 - ₹5,000', min: 3000, max: 5000 },
  { label: 'Above ₹5,000', min: 5000, max: Infinity }
];
