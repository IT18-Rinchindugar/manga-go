import heroImage from '@assets/generated_images/cyberpunk_manga_hero_banner.png';
import actionCover from '@assets/generated_images/action_manga_cover.png';
import fantasyCover from '@assets/generated_images/fantasy_manga_cover.png';
import romanceCover from '@assets/generated_images/romance_manga_cover.png';
import mangaPage from '@assets/generated_images/manga_page_interior.png';

export interface Manga {
  id: string;
  title: string;
  cover: string;
  rating: number;
  genre: string[];
  status: 'Ongoing' | 'Completed';
  author: string;
  synopsis: string;
  chapters: number;
  pricePerChapter: number;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface Chapter {
  id: string;
  mangaId: string;
  number: number;
  title: string;
  pages: string[];
  isLocked: boolean;
  price: number;
}

export const MOCK_MANGA: Manga[] = [
  {
    id: '1',
    title: 'Neon Ronin: Cyber City',
    cover: actionCover,
    rating: 4.8,
    genre: ['Action', 'Sci-Fi', 'Cyberpunk'],
    status: 'Ongoing',
    author: 'Hiroshi Tanaka',
    synopsis: 'In a world where steel meets soul, a lone warrior navigates the neon-drenched streets of Neo-Tokyo to find the truth about his past.',
    chapters: 45,
    pricePerChapter: 5,
    isPopular: true
  },
  {
    id: '2',
    title: 'Dragon\'s Oath',
    cover: fantasyCover,
    rating: 4.9,
    genre: ['Fantasy', 'Adventure', 'Magic'],
    status: 'Ongoing',
    author: 'Elara Moon',
    synopsis: 'The last dragon has awakened, and only a sworn knight can tame the beast before the kingdom falls to ash.',
    chapters: 120,
    pricePerChapter: 5,
    isPopular: true
  },
  {
    id: '3',
    title: 'Cherry Blossom Promise',
    cover: romanceCover,
    rating: 4.6,
    genre: ['Romance', 'School Life', 'Drama'],
    status: 'Completed',
    author: 'Sakura Mochi',
    synopsis: 'A promise made under the cherry blossom tree ten years ago brings two childhood friends back together in high school.',
    chapters: 24,
    pricePerChapter: 3,
    isNew: true
  },
  {
    id: '4',
    title: 'Cyber Blade',
    cover: heroImage,
    rating: 4.5,
    genre: ['Action', 'Mecha'],
    status: 'Ongoing',
    author: 'Kenji Sato',
    synopsis: 'Giant robots and high school drama collide in this epic saga.',
    chapters: 12,
    pricePerChapter: 4
  }
];

export const MOCK_CHAPTERS: Chapter[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `c${i+1}`,
  mangaId: '1',
  number: i + 1,
  title: `Chapter ${i+1}: The Beginning`,
  pages: [mangaPage, mangaPage, mangaPage], // Repeating the generated page for mockup
  isLocked: i > 2, // First 3 chapters free
  price: 5
}));

export const HERO_IMAGE = heroImage;
