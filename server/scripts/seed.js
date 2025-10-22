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
  'Dariusz',
  'Mariusz',
  'Jakub',
  'Wojciech',
  'Robert',
  'Rafał',
  'Jacek',
  'Janusz',
  'Mirosław',
  'Maciej',
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
  'Nowakowski',
  'Pawłowski',
  'Michalski',
  'Nowicki',
  'Adamczyk',
  'Dudek',
  'Zając',
  'Wieczorek',
  'Jabłoński',
  'Król',
  'Majewski',
  'Olszewski',
  'Jaworski',
  'Wróbel',
  'Malinowski',
  'Pawlak',
  'Witkowski',
  'Walczak',
  'Sikora',
  'Baran',
  'Rutkowski',
  'Michalak',
  'Szewczyk',
  'Ostrowski',
  'Tomaszewski',
  'Pietrzak',
  'Marciniak',
  'Wróblewski',
  'Zalewski',
  'Jakubowski',
];

const miasta = [
  'Warszawa',
  'Kraków',
  'Łódź',
  'Wrocław',
  'Poznań',
  'Gdańsk',
  'Szczecin',
  'Bydgoszcz',
  'Lublin',
  'Katowice',
  'Białystok',
  'Gdynia',
  'Częstochowa',
  'Radom',
  'Sosnowiec',
  'Toruń',
  'Kielce',
  'Gliwice',
  'Zabrze',
  'Bytom',
];

const zainteresowania = [
  'Fotografia',
  'Gotowanie',
  'Podróże',
  'Muzyka',
  'Sport',
  'Książki',
  'Filmy',
  'Gry komputerowe',
  'Ogrodnictwo',
  'Malarstwo',
  'Taniec',
  'Jogging',
  'Siłownia',
  'Pływanie',
  'Rowery',
  'Wspinaczka',
  'Joga',
  'Programowanie',
  'Rękodzieło',
  'Astronomia',
];

const szkoly = [
  'Uniwersytet Warszawski',
  'AGH Kraków',
  'Politechnika Warszawska',
  'Uniwersytet Jagielloński',
  'Politechnika Wrocławska',
  'Uniwersytet Mikołaja Kopernika',
  'Uniwersytet Gdański',
  'SGGW Warszawa',
];

const prace = [
  'Programista',
  'Nauczyciel',
  'Lekarz',
  'Inżynier',
  'Księgowy',
  'Sprzedawca',
  'Manager',
  'Grafik',
  'Mechanik',
  'Pielęgniarka',
  'Prawnik',
  'Architekt',
  'Psycholog',
  'Dziennikarz',
  'Fotograf',
  'Tłumacz',
];

// Przykładowe treści postów
const przykladoweTresciPostow = [
  'Piękny dzień na spacer po parku! 🌞',
  'Właśnie skończyłem/am czytać świetną książkę. Polecam wszystkim! 📚',
  'Ktoś ma ochotę na kawę? ☕',
  'Weekendowe plany - pizza i film 🍕🎬',
  'Nowy dzień, nowe możliwości! 💪',
  'Czy tylko mi się wydaje, że czas leci coraz szybciej? ⏰',
  'Dziś gotowałem/am coś nowego. Wyszło całkiem nieźle! 👨‍🍳',
  'Słońce świeci, ptaki śpiewają - idealna pogoda na rower! 🚴‍♂️',
  'Weekend to czas na relaks i odpoczynek 😌',
  'Właśnie wróciłem/am z super koncertu! 🎵',
  'Kawa rano to podstawa dobrego dnia ☕',
  'Dziś maraton filmowy z przyjaciółmi 🍿',
  'Nowa fryzura, nowe ja! ✂️',
  'Zakupy zrobione, można odpocząć 🛍️',
  'Wieczorna przechadzka po mieście 🌃',
  'Domowe ciasto zawsze smakuje najlepiej 🍰',
  'Sport to zdrowie! Kto idzie ze mną na siłownię? 💪',
  'Deszczowy dzień = dobra pogoda na książkę 📖☔',
  'Właśnie odkryłem/am nową restaurację. Rewelacja! 🍽️',
  'Nic nie bije domowego obiadu u babci 👵❤️',
  'Planuję wakacje... Gdzie byście polecili? ✈️',
  'Nowy serial już dziś wieczorem! Kto oglądał? 📺',
  'Praca w ogrodzie to moja medytacja 🌱',
  'Czasem warto się zatrzymać i docenić to, co mamy 🙏',
  'Nowa aplikacja na telefonie - całkiem przydatna! 📱',
  'Wieczór z przyjaciółmi to zawsze dobry pomysł 👫',
  'Robię porządki... Ile rzeczy się zbiera! 🧹',
  'Słucham ulubionej płyty i wspominam stare czasy 🎶',
  'Dziś dzień pełen wyzwań, ale dam radę! 💪',
  'Słodkie chwile z rodziną są bezcenne ❤️',
];

// Przykładowe komentarze
const przykladoweKomentarze = [
  'Super! 👍',
  'Świetne zdjęcie!',
  'Pozdrawiam serdecznie! 😊',
  'Zgadzam się w 100%',
  'Brawo!',
  'Też tak uważam',
  'Pięknie napisane',
  'Dzięki za posta!',
  'Masz rację!',
  'Fajnie! 😄',
  'Dokładnie tak!',
  'Świetny pomysł',
  'Popieram!',
  'To prawda',
  'Miłego dnia! ☀️',
  'Powodzenia!',
  'Gratulacje!',
  'Też chciałbym/chciałabym',
  'Inspirujące!',
  'Uwielbiam to!',
  'Ciekawe',
  'Muszę to spróbować',
  'Gdzie to było?',
  'Ile to kosztowało?',
  'Ja też tak robię',
  'Nigdy nie myślałem/am o tym tak',
  'Dobra rada!',
  'Dzięki za info',
];

// Funkcje pomocnicze
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function generateRandomPassword() {
  return 'password123'; // Prosty hash dla testów
}

async function createUsers() {
  console.log('Tworzenie użytkowników...');
  const users = [];

  for (let i = 0; i < 50; i++) {
    const imie = getRandomElement(polskieImiona);
    const nazwisko = getRandomElement(polskieNazwiska);
    const login = `${imie.toLowerCase()}${nazwisko.toLowerCase()}${Math.floor(Math.random() * 1000)}`;
    const email = `${login}@example.com`;

    const user = await prisma.user.create({
      data: {
        email,
        login,
        hashedPassword: generateRandomPassword(),
        name: imie,
        lastname: nazwisko,
        dateOfBirth: `${Math.floor(Math.random() * 28) + 1}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 30) + 1970}`,
        bio: `Cześć! Jestem ${imie} i mieszkam w Polsce. Lubię ${getRandomElement(zainteresowania).toLowerCase()}.`,
        userData: {
          create: {
            sex: Math.random() > 0.5 ? 'MALE' : 'FEMALE',
            city: getRandomElement(miasta),
            country: 'Polska',
            phoneNumber: `+48${Math.floor(Math.random() * 900000000) + 100000000}`,
            primaryLanguage: 'Polski',
            otherLanguages: getRandomElements(
              ['Angielski', 'Niemiecki', 'Francuski', 'Hiszpański'],
              Math.floor(Math.random() * 3),
            ).join(', '),
            schools: getRandomElement(szkoly),
            jobs: getRandomElement(prace),
            hobbies: getRandomElements(
              zainteresowania,
              Math.floor(Math.random() * 5) + 1,
            ).join(', '),
          },
        },
      },
    });

    users.push(user);
    console.log(
      `Utworzono użytkownika: ${user.name} ${user.lastname} (${user.login})`,
    );
  }

  return users;
}

async function createFriendships(users) {
  console.log('Tworzenie znajomości...');

  for (let i = 0; i < users.length; i++) {
    const currentUser = users[i];
    const numberOfFriends = Math.floor(Math.random() * 15) + 5; // 5-20 znajomych

    const potentialFriends = users.filter((u) => u.id !== currentUser.id);
    const selectedFriends = getRandomElements(
      potentialFriends,
      numberOfFriends,
    );

    for (const friend of selectedFriends) {
      try {
        // Sprawdź czy już nie są znajomymi
        const existingRelation = await prisma.friendRelation.findFirst({
          where: {
            OR: [
              { userId1: currentUser.id, userId2: friend.id },
              { userId1: friend.id, userId2: currentUser.id },
            ],
          },
        });

        if (!existingRelation) {
          await prisma.friendRelation.create({
            data: {
              userId1: currentUser.id,
              userId2: friend.id,
              createdAt: getRandomDate(new Date(2024, 0, 1), new Date()),
            },
          });
          console.log(
            `${currentUser.name} i ${friend.name} są teraz znajomymi`,
          );
        }
      } catch (error) {
        // Ignoruj duplikaty
      }
    }
  }
}

async function createFollowers(users) {
  console.log('Tworzenie obserwacji...');

  for (let i = 0; i < users.length; i++) {
    const currentUser = users[i];
    const numberOfFollowers = Math.floor(Math.random() * 20) + 5; // 5-25 obserwujących

    const potentialFollowers = users.filter((u) => u.id !== currentUser.id);
    const selectedFollowers = getRandomElements(
      potentialFollowers,
      numberOfFollowers,
    );

    for (const follower of selectedFollowers) {
      try {
        await prisma.followedUser.create({
          data: {
            followerId: follower.id,
            followedId: currentUser.id,
            createdAt: getRandomDate(new Date(2024, 0, 1), new Date()),
          },
        });
        console.log(`${follower.name} obserwuje ${currentUser.name}`);
      } catch (error) {
        // Ignoruj duplikaty
      }
    }
  }
}

async function createPosts(users) {
  console.log('Tworzenie postów...');
  const posts = [];

  for (const user of users) {
    const numberOfPosts = Math.floor(Math.random() * 8) + 2; // 2-10 postów na użytkownika

    for (let i = 0; i < numberOfPosts; i++) {
      const post = await prisma.post.create({
        data: {
          content: getRandomElement(przykladoweTresciPostow),
          authorId: user.id,
          createdAt: getRandomDate(new Date(2024, 0, 1), new Date()),
        },
      });

      posts.push(post);
      console.log(
        `Utworzono post dla użytkownika ${user.name}: "${post.content.substring(0, 30)}..."`,
      );
    }
  }

  return posts;
}

async function createLikes(users, posts) {
  console.log('Dodawanie polubień do postów...');

  for (const post of posts) {
    const numberOfLikes = Math.floor(Math.random() * 15); // 0-15 polubień na post
    const potentialLikers = users.filter((u) => u.id !== post.authorId);
    const selectedLikers = getRandomElements(potentialLikers, numberOfLikes);

    for (const liker of selectedLikers) {
      try {
        await prisma.like.create({
          data: {
            userId: liker.id,
            postId: post.id,
            createdAt: getRandomDate(new Date(post.createdAt), new Date()),
          },
        });
      } catch (error) {
        // Ignoruj duplikaty
      }
    }
  }

  console.log('Polubienia dodane!');
}

async function createComments(users, posts) {
  console.log('Tworzenie komentarzy...');
  const comments = [];

  for (const post of posts) {
    const numberOfComments = Math.floor(Math.random() * 8); // 0-8 komentarzy na post

    for (let i = 0; i < numberOfComments; i++) {
      const commenter = getRandomElement(users);

      const comment = await prisma.comment.create({
        data: {
          content: getRandomElement(przykladoweKomentarze),
          authorId: commenter.id,
          postId: post.id,
          createdAt: getRandomDate(new Date(post.createdAt), new Date()),
        },
      });

      comments.push(comment);
      console.log(`Komentarz od ${commenter.name}: "${comment.content}"`);
    }
  }

  // Tworzenie odpowiedzi na komentarze
  console.log('Tworzenie odpowiedzi na komentarze...');
  for (const comment of comments) {
    if (Math.random() > 0.7) {
      // 30% szans na odpowiedź
      const replier = getRandomElement(users);

      await prisma.comment.create({
        data: {
          content: getRandomElement(przykladoweKomentarze),
          authorId: replier.id,
          postId: comment.postId,
          parentCommentId: comment.id,
          createdAt: getRandomDate(new Date(comment.createdAt), new Date()),
        },
      });

      console.log(`Odpowiedź od ${replier.name} na komentarz`);
    }
  }

  return comments;
}

async function createCommentLikes(users, comments) {
  console.log('Dodawanie polubień do komentarzy...');

  for (const comment of comments) {
    const numberOfLikes = Math.floor(Math.random() * 5); // 0-5 polubień na komentarz
    const potentialLikers = users.filter((u) => u.id !== comment.authorId);
    const selectedLikers = getRandomElements(potentialLikers, numberOfLikes);

    for (const liker of selectedLikers) {
      try {
        await prisma.commentLike.create({
          data: {
            userId: liker.id,
            commentId: comment.id,
            createdAt: getRandomDate(new Date(comment.createdAt), new Date()),
          },
        });
      } catch (error) {
        // Ignoruj duplikaty
      }
    }
  }

  console.log('Polubienia komentarzy dodane!');
}

async function createSharedPosts(users, posts) {
  console.log('Tworzenie udostępnień postów...');

  for (let i = 0; i < 30; i++) {
    // 30 losowych udostępnień
    const user = getRandomElement(users);
    const post = getRandomElement(posts.filter((p) => p.authorId !== user.id));

    try {
      await prisma.sharedPost.create({
        data: {
          userId: user.id,
          postId: post.id,
          createdAt: getRandomDate(new Date(post.createdAt), new Date()),
        },
      });

      console.log(`${user.name} udostępnił post`);
    } catch (error) {
      // Ignoruj duplikaty
    }
  }
}

async function main() {
  console.log('🌱 Rozpoczynanie seedowania bazy danych...');

  try {
    // Czyść istniejące dane (opcjonalnie)
    console.log('Czyszczenie istniejących danych...');
    await prisma.commentLike.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.like.deleteMany();
    await prisma.sharedPost.deleteMany();
    await prisma.post.deleteMany();
    await prisma.followedUser.deleteMany();
    await prisma.friendRelation.deleteMany();
    await prisma.friendRequest.deleteMany();
    await prisma.userData.deleteMany();
    await prisma.user.deleteMany();

    // Twórz nowe dane
    const users = await createUsers();
    await createFriendships(users);
    await createFollowers(users);
    const posts = await createPosts(users);
    await createLikes(users, posts);
    const comments = await createComments(users, posts);
    await createCommentLikes(users, comments);
    await createSharedPosts(users, posts);

    console.log('✅ Seedowanie zakończone pomyślnie!');
    console.log(`📊 Utworzono:`);
    console.log(`   👥 ${users.length} użytkowników`);
    console.log(`   📝 ${posts.length} postów`);
    console.log(`   💬 Komentarze i odpowiedzi`);
    console.log(`   ❤️  Polubienia postów i komentarzy`);
    console.log(`   👫 Znajomości i obserwacje`);
    console.log(`   🔄 Udostępnienia postów`);
  } catch (error) {
    console.error('❌ Błąd podczas seedowania:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
