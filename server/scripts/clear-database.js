const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

// WARNING: this script will permanently delete data. It requires a --force flag or
// the environment variable CONFIRM_CLEAR=1 to actually perform deletions.

async function counts() {
  return {
    CommentLike: await prisma.commentLike.count(),
    Comment: await prisma.comment.count(),
    Like: await prisma.like.count(),
    SharedPost: await prisma.sharedPost.count(),
    Message: await prisma.message.count(),
    UserInGroupChat: await prisma.userInGroupChat.count(),
    GroupChat: await prisma.groupChat.count(),
    FollowedUser: await prisma.followedUser.count(),
    FriendRequest: await prisma.friendRequest.count(),
    FriendRelation: await prisma.friendRelation.count(),
    Notification: await prisma.notification.count(),
    LoginSession: await prisma.loginSession.count(),
    UserPrivacy: await prisma.userPrivacy.count(),
    UserData: await prisma.userData.count(),
    Post: await prisma.post.count(),
    User: await prisma.user.count(),
  };
}

async function clearAll() {
  // Order matters because of foreign keys. We delete child tables first.
  const operations = [
    prisma.commentLike.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.like.deleteMany(),
    prisma.sharedPost.deleteMany(),
    prisma.message.deleteMany(),
    prisma.userInGroupChat.deleteMany(),
    prisma.groupChat.deleteMany(),
    prisma.followedUser.deleteMany(),
    prisma.friendRequest.deleteMany(),
    prisma.friendRelation.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.loginSession.deleteMany(),
    prisma.userPrivacy.deleteMany(),
    prisma.userData.deleteMany(),
    prisma.post.deleteMany(),
    prisma.user.deleteMany(),
  ];

  // Run in a transaction where possible
  try {
    await prisma.$transaction(operations);
  } catch (err) {
    // Some providers or large deletes might fail inside a transaction; fall back to sequential
    console.warn(
      'Transaction failed, falling back to sequential deletes:',
      err.message || err,
    );
    for (const op of operations) {
      try {
        await op;
      } catch (e) {
        console.error('Delete op failed:', e.message || e);
      }
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const force =
    args.includes('--force') ||
    process.env.CONFIRM_CLEAR === '1' ||
    process.env.CONFIRM_CLEAR === 'true';

  console.log(
    'This script WILL DELETE data from your database if run with --force or CONFIRM_CLEAR=1',
  );
  console.log('\nChecking current row counts...');

  try {
    const c = await counts();
    console.table(c);

    if (!force) {
      console.log('\nDry run: no data was deleted.');
      console.log('To actually clear the database run:');
      console.log('  CONFIRM_CLEAR=1 node scripts/clear-database.js');
      console.log('or');
      console.log('  node scripts/clear-database.js --force');
      return;
    }

    // Double-check interactive confirmation on supported terminals
    if (process.stdin.isTTY && !args.includes('--yes')) {
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      const answer = await new Promise((res) =>
        rl.question(
          'Are you absolutely sure you want to delete ALL data? (yes/NO) ',
          res,
        ),
      );
      rl.close();
      if (answer.trim().toLowerCase() !== 'yes') {
        console.log('Aborted by user. No changes made.');
        return;
      }
    }

    console.log('\nDeleting...');
    await clearAll();
    console.log('\nDone. New counts:');
    const after = await counts();
    console.table(after);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
