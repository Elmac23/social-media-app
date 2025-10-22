const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

async function addFriendsToUser() {
  console.log('🔍 Szukanie użytkownika z mailem "a@wp.pl"...');

  try {
    // Znajdź użytkownika z mailem a@wp.pl
    const targetUser = await prisma.user.findUnique({
      where: {
        email: 'a@wp.pl',
      },
    });

    if (!targetUser) {
      console.log('❌ Nie znaleziono użytkownika z mailem "a@wp.pl"');
      console.log('💡 Czy chcesz najpierw utworzyć tego użytkownika?');
      return;
    }

    console.log(
      `✅ Znaleziono użytkownika: ${targetUser.name} ${targetUser.lastname || ''} (${targetUser.login})`,
    );

    // Pobierz wszystkich użytkowników oprócz docelowego
    const allUsers = await prisma.user.findMany({
      where: {
        id: {
          not: targetUser.id,
        },
      },
    });

    if (allUsers.length === 0) {
      console.log('❌ Brak innych użytkowników w bazie danych');
      return;
    }

    console.log(`🎯 Znaleziono ${allUsers.length} potencjalnych znajomych`);

    // Sprawdź istniejące znajomości
    const existingFriendships = await prisma.friendRelation.findMany({
      where: {
        OR: [{ userId1: targetUser.id }, { userId2: targetUser.id }],
      },
    });

    const existingFriendIds = existingFriendships.map((friendship) =>
      friendship.userId1 === targetUser.id
        ? friendship.userId2
        : friendship.userId1,
    );

    console.log(`👥 Użytkownik ma już ${existingFriendIds.length} znajomych`);

    // Filtruj użytkowników, którzy nie są jeszcze znajomymi
    const potentialFriends = allUsers.filter(
      (user) => !existingFriendIds.includes(user.id),
    );

    if (potentialFriends.length === 0) {
      console.log('✅ Użytkownik już ma wszystkich możliwych znajomych!');
      return;
    }

    console.log(`🆕 Dostępnych nowych znajomych: ${potentialFriends.length}`);

    // Ile znajomych dodać? (maksymalnie 20, ale nie więcej niż dostępnych)
    const numberOfFriendsToAdd = Math.min(20, potentialFriends.length);

    // Losowo wybierz znajomych
    const shuffledFriends = [...potentialFriends].sort(
      () => 0.5 - Math.random(),
    );
    const selectedFriends = shuffledFriends.slice(0, numberOfFriendsToAdd);

    console.log(`➕ Dodawanie ${selectedFriends.length} nowych znajomych...`);

    let addedCount = 0;

    for (const friend of selectedFriends) {
      try {
        await prisma.friendRelation.create({
          data: {
            userId1: targetUser.id,
            userId2: friend.id,
            createdAt: new Date(),
          },
        });

        console.log(
          `✅ Dodano znajomego: ${friend.name} ${friend.lastname || ''} (${friend.login})`,
        );
        addedCount++;
      } catch (error) {
        console.log(
          `⚠️  Nie udało się dodać znajomego: ${friend.name} ${friend.lastname || ''}`,
        );
      }
    }

    console.log(
      `\n🎉 Zakończono! Dodano ${addedCount} nowych znajomych dla użytkownika ${targetUser.name}`,
    );

    // Pokaż podsumowanie
    const finalFriendships = await prisma.friendRelation.findMany({
      where: {
        OR: [{ userId1: targetUser.id }, { userId2: targetUser.id }],
      },
      include: {
        user1: true,
        user2: true,
      },
    });

    console.log(
      `📊 Aktualnie użytkownik ma ${finalFriendships.length} znajomych:`,
    );
    finalFriendships.forEach((friendship) => {
      const friend =
        friendship.userId1 === targetUser.id
          ? friendship.user2
          : friendship.user1;
      console.log(
        `   - ${friend.name} ${friend.lastname || ''} (${friend.login})`,
      );
    });
  } catch (error) {
    console.error('❌ Błąd podczas dodawania znajomych:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Funkcja do tworzenia użytkownika a@wp.pl jeśli nie istnieje
async function createTargetUserIfNotExists() {
  console.log('🔧 Sprawdzanie czy użytkownik a@wp.pl istnieje...');

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: 'a@wp.pl' },
    });

    if (existingUser) {
      console.log('✅ Użytkownik już istnieje!');
      return existingUser;
    }

    console.log('➕ Tworzenie użytkownika a@wp.pl...');

    const newUser = await prisma.user.create({
      data: {
        email: 'a@wp.pl',
        login: 'testuser',
        hashedPassword: 'password123',
        name: 'Test',
        lastname: 'User',
        dateOfBirth: '15-05-1990',
        bio: 'Użytkownik testowy utworzony automatycznie',
        userData: {
          create: {
            sex: 'MALE',
            city: 'Warszawa',
            country: 'Polska',
            primaryLanguage: 'Polski',
          },
        },
      },
    });

    console.log(
      `✅ Utworzono użytkownika: ${newUser.name} ${newUser.lastname} (${newUser.login})`,
    );
    return newUser;
  } catch (error) {
    console.error('❌ Błąd podczas tworzenia użytkownika:', error);
    return null;
  }
}

async function main() {
  console.log('🚀 Uruchamianie skryptu dodawania znajomych...\n');

  // Sprawdź argumenty linii poleceń
  const args = process.argv.slice(2);

  if (args.includes('--create-user')) {
    await createTargetUserIfNotExists();
    console.log('\n');
  }

  await addFriendsToUser();

  console.log('\n🏁 Skrypt zakończony!');
}

main();
