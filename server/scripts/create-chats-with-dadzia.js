const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

// Polskie imiona i nazwiska
const polskieImiona = [
  'Anna',
  'Katarzyna',
  'Małgorzata',
  'Agnieszka',
  'Krystyna',
  'Barbara',
  'Ewa',
  'Elżbieta',
  'Zofia',
  'Janina',
  'Maria',
  'Danuta',
  'Irena',
  'Teresa',
  'Jadwiga',
  'Halina',
  'Helena',
  'Beata',
  'Aleksandra',
  'Dorota',
  'Magdalena',
  'Joanna',
  'Monika',
  'Grażyna',
  'Renata',
  'Marta',
  'Iwona',
  'Sylwia',
  'Agata',
  'Karolina',
  'Andrzej',
  'Jan',
  'Piotr',
  'Krzysztof',
  'Stanisław',
  'Tomasz',
  'Paweł',
  'Józef',
  'Marcin',
  'Marek',
  'Michał',
  'Grzegorz',
  'Jerzy',
  'Tadeusz',
  'Adam',
  'Łukasz',
  'Zbigniew',
  'Ryszard',
  'Kazimierz',
  'Mateusz',
];

const polskieNazwiska = [
  'Nowak',
  'Kowalski',
  'Wiśniewski',
  'Wójcik',
  'Kowalczyk',
  'Kamiński',
  'Lewandowski',
  'Zieliński',
  'Szymański',
  'Woźniak',
  'Dąbrowski',
  'Kozłowski',
  'Jankowski',
  'Mazur',
  'Wojciechowski',
  'Kwiatkowski',
  'Krawczyk',
  'Kaczmarek',
  'Piotrowski',
  'Grabowski',
];

// Przykładowe wiadomości
const przykladoweWiadomosci = [
  'Cześć! Jak się masz?',
  'Co u Ciebie słychać?',
  'Jak tam vida?',
  'Wszystko w porządku?',
  'Miłego dnia! ☀️',
  'Do zobaczenia wkrótce!',
  'Dziękuję za wiadomość',
  'Zgadnie się jutro?',
  'Fajnie się gadało 😊',
  'Dzięki za pomoc!',
  'Polecam ten film 🎬',
  'Byłem wczoraj w tym miejscu',
  'Super sprawa! 👍',
  'Nie wiedziałem/am o tym',
  'To prawda',
  'Dokładnie tak',
  'Całkowicie się zgadzam',
  'To interesujące',
  'Będę tam',
  'Czemu nie!',
  'Świetny pomysł!',
  'Może innym razem',
  'Mam nadzieję że będzie fajnie',
  'Nie mogę się doczekać',
  'To będzie épico!',
  'Haha, to zabawne 😂',
  'Naprawdę?',
  'Ciekawe',
  'Muszę to spróbować',
  'Warto wiedzieć',
];

// Nazwy chat dla grup
const nazywaChaty = [
  'Zespół projektowy',
  'Przyjaciele ze studiów',
  'Rodzina',
  'Kolegowie z pracy',
  'Hobby',
  'Gry online',
  'Podróże',
  'Kino',
  'Sport',
  'Muzyka',
  'Książki',
  'Kawiarenka',
  'Rezydencja',
  'Balkon',
  'Imprezy',
  'Spotkania',
  'Wyjazdy',
  'Fitness',
  'Kuchnia',
  'DIY',
  'Technologia',
  'Sztuka',
  'Film',
  'Serialary',
  'Gamers',
  'Motocykl',
  'Samochód',
  'Wakacje',
  'Sylwester',
  'Urodziny',
  'Noworoczne',
  'Walentynki',
  'Paski',
  'Komedia',
  'Drama',
  'Thriller',
  'Fantastyka',
  'Natura',
  'Zwierzęta',
  'Zwierzątka',
  'Ogrody',
  'Kwiaty',
  'Psy',
  'Koty',
  'Ptaki',
  'Ryby',
  'Zwierzęta domowe',
  'Weterynaria',
  'Zdrowie',
  'Fitness',
  'Dieta',
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

async function createUsersWithDadziaZyla() {
  console.log('🔍 Szukanie użytkownika "dadzia zyla"...');

  let dadziaZyla = await prisma.user.findFirst({
    where: {
      name: 'dadzia',
      lastname: 'zyla',
    },
  });

  if (!dadziaZyla) {
    console.log('❌ Nie znaleziono użytkownika "dadzia zyla"');
    console.log('➕ Tworzenie użytkownika "dadzia zyla"...');

    dadziaZyla = await prisma.user.create({
      data: {
        email: 'dadzia@zyla.pl',
        login: 'dadzia_zyla',
        hashedPassword: 'password123',
        name: 'dadzia',
        lastname: 'zyla',
        bio: 'Babcia zawsze obecna 👵',
        userData: {
          create: {
            city: 'Warszawa',
            country: 'Polska',
          },
        },
      },
    });

    console.log(
      `✅ Utworzono użytkownika: ${dadziaZyla.name} ${dadziaZyla.lastname}`,
    );
  } else {
    console.log(
      `✅ Znaleziono użytkownika: ${dadziaZyla.name} ${dadziaZyla.lastname}`,
    );
  }

  // Tworzenie 50 nowych użytkowników
  console.log('\n👥 Tworzenie 50 nowych użytkowników...');
  const newUsers = [];

  for (let i = 0; i < 50; i++) {
    const imie = getRandomElement(polskieImiona);
    const nazwisko = getRandomElement(polskieNazwiska);
    const login = `user_${i}_${Date.now()}`;
    const email = `user${i}@example.com`;

    try {
      const user = await prisma.user.create({
        data: {
          email,
          login,
          hashedPassword: 'password123',
          name: imie,
          lastname: nazwisko,
          bio: `Jestem ${imie}`,
          userData: {
            create: {
              city: 'Warszawa',
              country: 'Polska',
            },
          },
        },
      });

      newUsers.push(user);
      console.log(`✅ [${i + 1}/50] Utworzono: ${imie} ${nazwisko}`);
    } catch (error) {
      console.log(`⚠️  Błąd przy tworzeniu użytkownika ${i + 1}`);
    }
  }

  return { dadziaZyla, newUsers };
}

async function addFriendships(dadziaZyla, users) {
  console.log('\n👫 Dodawanie użytkowników do znajomych "dadzia zyla"...');

  let addedCount = 0;
  for (const user of users) {
    try {
      await prisma.friendRelation.create({
        data: {
          userId1: dadziaZyla.id,
          userId2: user.id,
          createdAt: getRandomDate(new Date(2024, 0, 1), new Date()),
        },
      });

      addedCount++;
    } catch (error) {
      // Ignoruj duplikaty
    }
  }

  console.log(`✅ Dodano ${addedCount} użytkowników do znajomych`);
}

async function createGroupChats(dadziaZyla, users) {
  console.log('\n💬 Tworzenie 50 chatów grupowych...');

  const createdChats = [];

  for (let i = 0; i < 50; i++) {
    try {
      // Losowo wybierz 2-5 członków (oprócz dadzia zyla)
      const numberOfMembers = Math.floor(Math.random() * 4) + 2; // 2-5 członków
      const selectedUsers = [];

      for (let j = 0; j < numberOfMembers; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (!selectedUsers.find((u) => u.id === randomUser.id)) {
          selectedUsers.push(randomUser);
        }
      }

      // Zawsze dodaj dadzia zyla
      selectedUsers.push(dadziaZyla);

      const chatName = getRandomElement(nazywaChaty);
      const uniqueChatName = `${chatName} #${i + 1}`;

      const groupChat = await prisma.groupChat.create({
        data: {
          name: uniqueChatName,
          type: 'GROUP',
          description: `Czat z ${selectedUsers.length} osobami`,
          usersInGroupChat: {
            createMany: {
              data: selectedUsers.map((user) => ({
                userId: user.id,
              })),
            },
          },
        },
      });

      createdChats.push(groupChat);
      console.log(
        `✅ [${i + 1}/50] Utworzono chat: "${uniqueChatName}" z ${selectedUsers.length} członkami`,
      );
    } catch (error) {
      console.log(`⚠️  Błąd przy tworzeniu chatu ${i + 1}`);
    }
  }

  return createdChats;
}

async function addMessagesToChats(users, chats, dadziaZyla) {
  console.log('\n💬 Dodawanie wiadomości do chatów...');

  let messageCount = 0;

  for (const chat of chats) {
    // Losowa liczba wiadomości (5-20 na chat)
    const numberOfMessages = Math.floor(Math.random() * 16) + 5;

    for (let i = 0; i < numberOfMessages; i++) {
      try {
        // Losowo wybierz nadawcę z użytkowników w chacie
        const randomUser =
          Math.random() > 0.3 ? dadziaZyla : getRandomElement(users);

        const message = await prisma.message.create({
          data: {
            groupChatId: chat.id,
            senderId: randomUser.id,
            content: getRandomElement(przykladoweWiadomosci),
            createdAt: getRandomDate(new Date(chat.createdAt), new Date()),
          },
        });

        messageCount++;
      } catch (error) {
        // Ignoruj błędy
      }
    }

    console.log(`✅ Dodano wiadomości do chatu: "${chat.name}"`);
  }

  console.log(`📊 Łącznie dodano ${messageCount} wiadomości`);
}

async function main() {
  console.log('🚀 Uruchamianie skryptu tworzenia chatów z "dadzia zyla"\n');
  console.log('⚠️  UWAGA: Skrypt nie usuwa istniejących danych!\n');

  try {
    // Krok 1: Utwórz użytkowników
    const { dadziaZyla, newUsers } = await createUsersWithDadziaZyla();

    if (newUsers.length === 0) {
      console.log('❌ Nie udało się utworzyć nowych użytkowników');
      return;
    }

    // Krok 2: Dodaj do znajomych
    await addFriendships(dadziaZyla, newUsers);

    // Krok 3: Utwórz chaty
    const chats = await createGroupChats(dadziaZyla, newUsers);

    // Krok 4: Dodaj wiadomości
    await addMessagesToChats(newUsers, chats, dadziaZyla);

    // Podsumowanie
    console.log('\n✅ Skrypt zakończony pomyślnie!');
    console.log(`\n📊 Podsumowanie:`);
    console.log(
      `   👤 Użytkownik główny: ${dadziaZyla.name} ${dadziaZyla.lastname}`,
    );
    console.log(`   👥 Utworzono nowych użytkowników: ${newUsers.length}`);
    console.log(`   👫 Dodano do znajomych: ${newUsers.length}`);
    console.log(`   💬 Utworzono chatów: ${chats.length}`);
    console.log(`   📨 Dodano wiadomości do chatów`);
    console.log(`\n🎉 Gotowe do testów!`);
  } catch (error) {
    console.error('❌ Błąd podczas wykonywania skryptu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
