import webpush from 'web-push';

// Generate VAPID keys for push notifications
const keys = webpush.generateVAPIDKeys();

console.log('Generated VAPID Keys:');
console.log('Public Key:', keys.publicKey);
console.log('Private Key:', keys.privateKey);
console.log('\nAdd these to your .env file:');
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log(`VAPID_EMAIL=mailto:admin@barbearia.com`);