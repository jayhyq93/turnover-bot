const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');
const fs = require('fs');

const API_ID = 36801701;
const API_HASH = 'e22f443fce26c5701c78a5c7eb97e5b1';

async function main() {
    const client = new TelegramClient(new StringSession(''), API_ID, API_HASH, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () => await input.text('Phone number (with country code, e.g. +601234567890): '),
        password: async () => await input.text('2FA password (if any, else press Enter): '),
        phoneCode: async () => await input.text('Verification code from Telegram: '),
        onError: (err) => console.log('Error:', err),
    });

    const session = client.session.save();
    fs.writeFileSync('session.txt', session);
    console.log('\n✅ Login successful!');
    console.log('Session saved to session.txt');
    await client.disconnect();
}

main();
