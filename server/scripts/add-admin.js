const { PrismaClient } = require('../generated/prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function addAdmin() {
  console.log('🔧 Tworzenie konta administratora...');

  try {
    // Konfiguracja konta admina
    const adminData = {
      email: 'admin@app.com',
      login: 'admin',
      password: 'admin', // Możesz zmienić na 'zaq1@WSX'
      name: 'Admin',
      lastname: 'Administrator',
    };

    console.log(`📧 Email: ${adminData.email}`);
    console.log(`👤 Login: ${adminData.login}`);
    console.log(`🔑 Hasło: ${adminData.password}`);

    // Sprawdź czy użytkownik już istnieje
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: adminData.email }, { login: adminData.login }],
      },
    });

    if (existingUser) {
      console.log('❌ Użytkownik z takim emailem lub loginem już istnieje!');
      console.log(`   ID: ${existingUser.id}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Login: ${existingUser.login}`);
      console.log(`   Rola: ${existingUser.role}`);
      return;
    }

    // Hashowanie hasła
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Utworzenie użytkownika z rolą ADMIN
    const admin = await prisma.user.create({
      data: {
        email: adminData.email,
        login: adminData.login,
        hashedPassword: hashedPassword,
        role: 'ADMIN',
        name: adminData.name,
        lastname: adminData.lastname,
        userData: {
          create: {},
        },
        privacy: {
          create: {},
        },
      },
    });

    console.log('\n✅ Administrator został utworzony pomyślnie!');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Login: ${admin.login}`);
    console.log(`   Rola: ${admin.role}`);
    console.log(`   Imię: ${admin.name} ${admin.lastname || ''}`);

    console.log('\n💡 Możesz się zalogować używając:');
    console.log(`   Login: ${adminData.login}`);
    console.log(`   Hasło: ${adminData.password}`);
  } catch (error) {
    console.error('❌ Błąd podczas tworzenia administratora:', error.message);
    if (error.code === 'P2002') {
      console.error('   Użytkownik z tymi danymi już istnieje w bazie!');
    }
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Rozłączono z bazą danych');
  }
}

// Uruchom funkcję
addAdmin().catch((error) => {
  console.error('💥 Wystąpił krytyczny błąd:', error);
  process.exit(1);
});
