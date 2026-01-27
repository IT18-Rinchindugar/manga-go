import heroImage from '@assets/generated_images/cyberpunk_manga_hero_banner.png';
import actionCover from '@assets/generated_images/action_manga_cover.png';
import fantasyCover from '@assets/generated_images/fantasy_manga_cover.png';
import romanceCover from '@assets/generated_images/romance_manga_cover.png';
import mangaPage from '@assets/generated_images/manga_page_interior.png';

const SOLO_LEVELING_PAGES = Array.from({ length: 72 }, (_, i) => 
  `/manga/solo-leveling/chapter-1/page-${String(i + 1).padStart(2, '0')}.jpg`
);

export interface Manga {
  id: string;
  title: string;
  altTitle?: string;
  cover: string;
  rating: number;
  reviews: number;
  genre: string[];
  status: 'Ongoing' | 'Completed' | 'Hiatus';
  author: string;
  artist?: string;
  releaseYear: number;
  synopsis: string;
  chapters: number;
  pricePerChapter: number;
  isPopular?: boolean;
  isNew?: boolean;
  lastUpdated: string;
}

export interface Chapter {
  id: string;
  mangaId: string;
  number: number;
  title: string;
  pages: string[];
  isLocked: boolean;
  price: number;
  releaseDate: string;
}

export interface UserProfile {
  username: string;
  email: string;
  avatar: string;
  coins: number;
  favorites: string[]; // Manga IDs
  history: { mangaId: string; chapterId: string; lastRead: string }[];
}

export const MOCK_MANGA: Manga[] = [
  {
    id: 'solo-leveling',
    title: 'Solo Leveling',
    altTitle: '나 혼자만 레벨업',
    cover: '/manga/solo-leveling/cover.jpg',
    rating: 4.9,
    reviews: 15420,
    genre: ['Action', 'Fantasy', 'Adventure', 'Supernatural'],
    status: 'Completed',
    author: 'Chugong',
    artist: 'DUBU (REDICE Studio)',
    releaseYear: 2018,
    synopsis: 'In a world where hunters — humans who possess magical abilities — must battle deadly monsters to protect mankind from total annihilation, a notoriously weak hunter named Sung Jinwoo finds himself in a seemingly endless struggle for survival. One day, after narrowly surviving an overwhelmingly powerful double dungeon that nearly wipes out his entire party, a mysterious program called the System chooses him as its sole player and gives him the extremely rare ability to level up in strength, breaking all previously known limits.',
    chapters: 1,
    pricePerChapter: 50,
    isPopular: true,
    isNew: true,
    lastUpdated: '2024-01-20'
  },
  {
    id: '1',
    title: 'Neon Ronin: Cyber City',
    altTitle: 'ネオン浪人',
    cover: actionCover,
    rating: 4.8,
    reviews: 1250,
    genre: ['Action', 'Sci-Fi', 'Cyberpunk'],
    status: 'Ongoing',
    author: 'Hiroshi Tanaka',
    artist: 'Akira S.',
    releaseYear: 2023,
    synopsis: 'In a world where steel meets soul, a lone warrior navigates the neon-drenched streets of Neo-Tokyo to find the truth about his past.',
    chapters: 45,
    pricePerChapter: 5,
    isPopular: true,
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    title: 'Dragon\'s Oath',
    altTitle: 'Ryuu no Chikai',
    cover: fantasyCover,
    rating: 4.9,
    reviews: 890,
    genre: ['Fantasy', 'Adventure', 'Magic'],
    status: 'Ongoing',
    author: 'Elara Moon',
    artist: 'Studio Draco',
    releaseYear: 2022,
    synopsis: 'The last dragon has awakened, and only a sworn knight can tame the beast before the kingdom falls to ash.',
    chapters: 120,
    pricePerChapter: 5,
    isPopular: true,
    lastUpdated: '2024-01-10'
  },
  {
    id: '3',
    title: 'Cherry Blossom Promise',
    altTitle: 'Sakura no Yakusoku',
    cover: romanceCover,
    rating: 4.6,
    reviews: 450,
    genre: ['Romance', 'School Life', 'Drama', 'Slice of Life'],
    status: 'Completed',
    author: 'Sakura Mochi',
    releaseYear: 2021,
    synopsis: 'A promise made under the cherry blossom tree ten years ago brings two childhood friends back together in high school.',
    chapters: 24,
    pricePerChapter: 3,
    isNew: true,
    lastUpdated: '2023-12-01'
  },
  {
    id: '4',
    title: 'Cyber Blade',
    cover: heroImage,
    rating: 4.5,
    reviews: 200,
    genre: ['Action', 'Mecha', 'Sci-Fi'],
    status: 'Ongoing',
    author: 'Kenji Sato',
    releaseYear: 2024,
    synopsis: 'Giant robots and high school drama collide in this epic saga.',
    chapters: 12,
    pricePerChapter: 4,
    isNew: true,
    lastUpdated: '2024-01-14'
  },
  {
    id: '5',
    title: 'Silent Voice of the Forest',
    cover: fantasyCover,
    rating: 4.2,
    reviews: 120,
    genre: ['Fantasy', 'Mystery', 'Supernatural'],
    status: 'Hiatus',
    author: 'Forest Spirit',
    releaseYear: 2020,
    synopsis: 'Whispers from the ancient woods reveal secrets that were meant to stay buried.',
    chapters: 15,
    pricePerChapter: 3,
    lastUpdated: '2023-08-15'
  },
  {
    id: '6',
    title: 'Office Romance Strategy',
    cover: romanceCover,
    rating: 4.7,
    reviews: 670,
    genre: ['Romance', 'Comedy', 'Josei'],
    status: 'Ongoing',
    author: 'Love Guru',
    releaseYear: 2023,
    synopsis: 'Navigating corporate politics and matters of the heart.',
    chapters: 35,
    pricePerChapter: 4,
    isPopular: true,
    lastUpdated: '2024-01-12'
  }
];

export const MOCK_CHAPTERS: Chapter[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `c${i+1}`,
  mangaId: '1',
  number: i + 1,
  title: `Chapter ${i+1}`,
  pages: [mangaPage, mangaPage, mangaPage], 
  isLocked: i > 2, 
  price: 5,
  releaseDate: new Date(Date.now() - (45 - i) * 86400000).toISOString().split('T')[0]
}));

export const MOCK_USER: UserProfile = {
  username: "OtakuReader99",
  email: "reader@example.com",
  avatar: "https://github.com/shadcn.png",
  coins: 150,
  favorites: ['1', '3'],
  history: [
    { mangaId: '1', chapterId: 'c5', lastRead: '2024-01-15' },
    { mangaId: '2', chapterId: 'c10', lastRead: '2024-01-14' }
  ]
};

export const HERO_IMAGE = heroImage;
