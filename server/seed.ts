import { storage } from "./storage";
import { hashPassword } from "./auth";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create admin user
    const adminPassword = await hashPassword("admin123");
    const admin = await storage.createUser({
      username: "admin",
      email: "admin@inkflow.com",
      password: adminPassword,
      role: 'ADMIN',
      coins: 10000
    });
    console.log("✓ Created admin user (username: admin, password: admin123)");

    // Create regular user
    const userPassword = await hashPassword("user123");
    const user = await storage.createUser({
      username: "demo",
      email: "demo@inkflow.com",
      password: userPassword,
      role: 'USER',
      coins: 500
    });
    console.log("✓ Created demo user (username: demo, password: user123)");

    // Create sample manga
    const manga1 = await storage.createManga({
      title: "Shadow Chronicles",
      altTitle: "影之编年史",
      author: "Akira Tanaka",
      artist: "Akira Tanaka",
      coverUrl: "/placeholder-manga-1.jpg",
      synopsis: "In a world where shadows come to life at night, a young warrior discovers they have the power to control darkness itself. As ancient evils awaken, they must master their abilities to save humanity from being consumed by eternal night.",
      genres: ["Action", "Fantasy", "Supernatural"],
      status: "Ongoing",
      releaseYear: 2023,
    });
    console.log(`✓ Created manga: ${manga1.title}`);

    // Create chapters for Shadow Chronicles
    const chapterTitles1 = [
      "The Awakening",
      "First Shadow",
      "Dark Powers",
      "Night Training",
      "Shadow Warriors",
      "Ancient Evil",
      "Battle in Darkness",
      "The Prophecy",
    ];

    for (let i = 0; i < chapterTitles1.length; i++) {
      await storage.createChapter({
        mangaId: manga1.id,
        number: i + 1,
        title: chapterTitles1[i],
        pageUrls: Array.from({ length: 20 }, (_, j) => `/placeholder-page-${j + 1}.jpg`),
        price: i < 3 ? 0 : 50,
        isFree: i < 3,
        releaseDate: new Date(2023, 0, (i + 1) * 7)
      });
    }
    console.log(`✓ Created ${chapterTitles1.length} chapters for Shadow Chronicles`);

    // Create more sample manga
    const manga2 = await storage.createManga({
      title: "Mystic Academy",
      altTitle: "神秘学院",
      author: "Luna Park",
      artist: "Luna Park",
      coverUrl: "/placeholder-manga-2.jpg",
      synopsis: "A prestigious academy for magic users hides dark secrets. When a transfer student arrives with mysterious powers, they uncover a conspiracy that threatens the entire magical world. Friendship, betrayal, and epic battles await.",
      genres: ["Fantasy", "School Life", "Mystery"],
      status: "Ongoing",
      releaseYear: 2024,
    });
    console.log(`✓ Created manga: ${manga2.title}`);

    const chapterTitles2 = [
      "New Beginnings",
      "First Day",
      "Hidden Powers",
      "The Test",
      "Secret Society",
      "Forbidden Magic",
    ];

    for (let i = 0; i < chapterTitles2.length; i++) {
      await storage.createChapter({
        mangaId: manga2.id,
        number: i + 1,
        title: chapterTitles2[i],
        pageUrls: Array.from({ length: 18 }, (_, j) => `/placeholder-page-${j + 1}.jpg`),
        price: i < 3 ? 0 : 50,
        isFree: i < 3,
        releaseDate: new Date(2024, 0, (i + 1) * 7)
      });
    }
    console.log(`✓ Created ${chapterTitles2.length} chapters for Mystic Academy`);

    const manga3 = await storage.createManga({
      title: "Cyber Ronin",
      altTitle: "サイバー浪人",
      author: "Kenji Yamamoto",
      artist: "Kenji Yamamoto",
      coverUrl: "/placeholder-manga-3.jpg",
      synopsis: "In the neon-lit streets of Neo Tokyo, a cybernetically enhanced samurai fights against corporate tyranny. With a blade that cuts through code and steel alike, they battle to restore honor in a world ruled by greed.",
      genres: ["Sci-Fi", "Action", "Cyberpunk"],
      status: "Ongoing",
      releaseYear: 2024,
    });
    console.log(`✓ Created manga: ${manga3.title}`);

    const chapterTitles3 = [
      "Digital Blade",
      "Neon Streets",
      "Corporate Wars",
      "Code Samurai",
      "System Override",
    ];

    for (let i = 0; i < chapterTitles3.length; i++) {
      await storage.createChapter({
        mangaId: manga3.id,
        number: i + 1,
        title: chapterTitles3[i],
        pageUrls: Array.from({ length: 22 }, (_, j) => `/placeholder-page-${j + 1}.jpg`),
        price: i < 3 ? 0 : 50,
        isFree: i < 3,
        releaseDate: new Date(2024, 2, (i + 1) * 7)
      });
    }
    console.log(`✓ Created ${chapterTitles3.length} chapters for Cyber Ronin`);

    const manga4 = await storage.createManga({
      title: "Love in Bloom",
      altTitle: "恋の花",
      author: "Sakura Matsuda",
      artist: "Sakura Matsuda",
      coverUrl: "/placeholder-manga-4.jpg",
      synopsis: "A heartwarming tale of two high school students who discover love through their shared passion for gardening. As they nurture plants together, their feelings blossom into something beautiful.",
      genres: ["Romance", "School Life", "Slice of Life"],
      status: "Completed",
      releaseYear: 2023,
    });
    console.log(`✓ Created manga: ${manga4.title}`);

    const chapterTitles4 = [
      "First Encounter",
      "Seeds of Friendship",
      "Growing Feelings",
      "Confession",
      "Together Forever",
    ];

    for (let i = 0; i < chapterTitles4.length; i++) {
      await storage.createChapter({
        mangaId: manga4.id,
        number: i + 1,
        title: chapterTitles4[i],
        pageUrls: Array.from({ length: 16 }, (_, j) => `/placeholder-page-${j + 1}.jpg`),
        price: i < 3 ? 0 : 50,
        isFree: i < 3,
        releaseDate: new Date(2023, 5, (i + 1) * 7)
      });
    }
    console.log(`✓ Created ${chapterTitles4.length} chapters for Love in Bloom`);

    // Add some favorites and reading history for demo user
    await storage.addFavorite({
      userId: user.id,
      mangaId: manga1.id
    });
    await storage.addFavorite({
      userId: user.id,
      mangaId: manga3.id
    });
    console.log("✓ Added favorites for demo user");

    // Add reading history
    const manga1Chapters = await storage.getChaptersByMangaId(manga1.id);
    await storage.updateReadingHistory({
      userId: user.id,
      mangaId: manga1.id,
      chapterId: manga1Chapters[0].id,
      lastRead: new Date()
    });
    console.log("✓ Added reading history for demo user");

    console.log("\n✅ Database seeded successfully!");
    console.log("\n📝 Login credentials:");
    console.log("   Admin - username: admin, password: admin123");
    console.log("   User  - username: demo, password: user123");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
