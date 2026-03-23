const TOKEN = '8605378805:AAF6mtYC2C3rTT3gOpjO70DjXnEDfyu_gbM';
const API = `https://api.telegram.org/bot${TOKEN}`;

// ========== CONFIG ==========
const ADMIN_CHAT_ID = 7767296227; // @GADGET4544 - receives withdrawal & deposit notifications

// ========== STATE ==========
const userState = {}; // track user language preference

// ========== TRANSLATIONS ==========
const T = {
    en: {
        welcome: `🔥 *Welcome to TURNOVER!*\n\n_From Defeat To Rebirth_\n\nMalaysia's #1 Profit Sharing Slot Platform.\n\n✅ 30% Daily Profit Sharing\n✅ 50% Welcome Bonus\n✅ 30% Referral Commission\n\nHow can I help you today?`,
        menu: `📋 *Main Menu*\n\nChoose an option below:`,
        btn_account: '👤 Register / Deposit / Withdraw',
        btn_rewards: '💎 Bonus / Profit Sharing / Referral',
        btn_register: '📝 Register Account',
        btn_deposit: '💰 Deposit',
        btn_withdraw: '💸 Withdrawal',
        btn_bonus: '🎁 Bonuses & Promotions',
        btn_games: '🎰 Games',
        btn_profit: '📊 Profit Sharing',
        btn_referral: '👥 Referral Program',
        btn_back: '◀️ Back to Menu',
        register: `📝 *How To Register*\n\n1. Click the Live Support button below\n2. Our agent will create your account\n3. Make your first deposit\n4. Start playing & earning!\n\n⚡ Registration is FREE and takes less than 5 minutes.`,
        deposit: `💰 *How To Deposit*\n\n*Step 1:* Transfer to our bank account below 👇\n\n🏦 *Bank:* BANK ISLAM\n👤 *Name:* PUAN SHARIFAH FATIMAH\n🔢 *Account:* 13044021038654\n\n*Step 2:* Screenshot your transfer receipt\n\n*Step 3:* Send receipt + your Game ID to our agent\n\n⚡ Credits added within 5 minutes after verification!\n\n✅ Min deposit: RM30\n✅ New members get 50% Welcome Bonus!`,
        withdraw: `💸 *How To Withdraw*\n\nPlease provide the following details:\n\n1️⃣ Your Game ID (MEGA888)\n2️⃣ Withdrawal amount (RM)\n3️⃣ Your bank name\n4️⃣ Your bank account number\n5️⃣ Account holder name\n\nReply with all details and we will process within 5-15 minutes!\n\n✅ No withdrawal fees\n✅ Min withdrawal: RM50`,
        bonus: `🎁 *Bonuses & Promotions*\n\n🌟 *50% Welcome Bonus*\nDeposit RM100 → Get RM150!\nFirst deposit only. New members.\n\n👥 *30% Referral Commission*\nInvite friends, earn 30% of their first deposit. Unlimited referrals!\n\n📅 *Daily Reload Bonus*\nBonus on every reload. Ask support for details.\n\n💡 Contact Live Support to claim any bonus!`,
        games: `🎰 *Available Games*\n\n🏆 *MEGA888*\nMalaysia's most popular slot platform. Hundreds of slot, table & arcade games.\n\n🔥 *PUSSY888*\nHigh-payout slots with stunning graphics.\n\n⭐ *918KISS*\nThe legendary classic trusted by millions.\n\n🎯 All games generate *turnover* towards your daily profit share!\n\nContact support to download any game.`,
        profit: `📊 *Profit Sharing System*\n\n💡 *How It Works:*\nEvery bet you place = Turnover\nYour turnover % = Your profit share\n\n📈 *Example:*\nPlatform earns RM10,000 today\n30% = RM3,000 distributed\nYou contributed 5% of total turnover\nYou receive: RM150!\n\n✅ Distributed DAILY\n✅ Transparent calculation\n✅ No minimum turnover\n\nThe more you play, the more you earn!`,
        referral: `👥 *Referral Program*\n\n💰 Earn *30% commission* on every friend's first deposit!\n\n📋 *How To Refer:*\n1. Contact Live Support\n2. Get your unique referral link\n3. Share with friends\n4. Earn when they deposit!\n\n♾️ *No limit* on referrals\n✅ Instant commission payout\n\nStart referring today!`,
        livechat: `💬 *Live Support*\n\nOur support team is available *24/7*!\n\n🌐 Website: https://turn8ver.com\n\n📞 Our agents speak:\n• English\n• Bahasa Melayu\n• 中文 (Mandarin)\n\n⚡ Average response time: Under 2 minutes\n\nClick the button below to chat with us on our website:`,
        livechat_btn: '🌐 Open Website Chat',
        unknown: `❓ I didn't understand that. Please use the menu below.`,
    },
    ms: {
        welcome: `🔥 *Selamat Datang ke TURNOVER!*\n\n_Dari Kalah Kepada Kebangkitan_\n\nPlatform Slot Kongsi Keuntungan #1 Malaysia.\n\n✅ 30% Kongsi Keuntungan Harian\n✅ 50% Bonus Selamat Datang\n✅ 30% Komisen Rujukan\n\nBoleh saya bantu anda?`,
        menu: `📋 *Menu Utama*\n\nPilih pilihan di bawah:`,
        btn_account: '👤 Daftar / Deposit / Pengeluaran',
        btn_rewards: '💎 Bonus / Kongsi Untung / Rujukan',
        btn_register: '📝 Daftar Akaun',
        btn_deposit: '💰 Deposit',
        btn_withdraw: '💸 Pengeluaran',
        btn_bonus: '🎁 Bonus & Promosi',
        btn_games: '🎰 Permainan',
        btn_profit: '📊 Kongsi Keuntungan',
        btn_referral: '👥 Program Rujukan',
        btn_back: '◀️ Kembali ke Menu',
        register: `📝 *Cara Mendaftar*\n\n1. Klik butang Sokongan Langsung di bawah\n2. Ejen kami akan cipta akaun anda\n3. Buat deposit pertama anda\n4. Mula bermain & menjana pendapatan!\n\n⚡ Pendaftaran adalah PERCUMA dan mengambil masa kurang dari 5 minit.`,
        deposit: `💰 *Cara Deposit*\n\n*Langkah 1:* Pindah ke akaun bank kami 👇\n\n🏦 *Bank:* BANK ISLAM\n👤 *Nama:* PUAN SHARIFAH FATIMAH\n🔢 *Akaun:* 13044021038654\n\n*Langkah 2:* Tangkap skrin resit pindahan anda\n\n*Langkah 3:* Hantar resit + ID Permainan anda kepada ejen kami\n\n⚡ Kredit ditambah dalam 5 minit selepas pengesahan!\n\n✅ Deposit minimum: RM30\n✅ Ahli baru dapat 50% Bonus Selamat Datang!`,
        withdraw: `💸 *Cara Pengeluaran*\n\nSila berikan maklumat berikut:\n\n1️⃣ ID Permainan anda (MEGA888)\n2️⃣ Jumlah pengeluaran (RM)\n3️⃣ Nama bank anda\n4️⃣ Nombor akaun bank anda\n5️⃣ Nama pemegang akaun\n\nBalas dengan semua maklumat dan kami akan proses dalam 5-15 minit!\n\n✅ Tiada caj pengeluaran\n✅ Min pengeluaran: RM50`,
        bonus: `🎁 *Bonus & Promosi*\n\n🌟 *50% Bonus Selamat Datang*\nDeposit RM100 → Dapat RM150!\nDeposit pertama sahaja. Ahli baru.\n\n👥 *30% Komisen Rujukan*\nJemput rakan, dapat 30% dari deposit pertama mereka!\n\n📅 *Bonus Reload Harian*\nBonus pada setiap reload. Tanya sokongan untuk maklumat lanjut.\n\n💡 Hubungi Sokongan Langsung untuk tuntut sebarang bonus!`,
        games: `🎰 *Permainan Tersedia*\n\n🏆 *MEGA888*\nPlatform slot paling popular di Malaysia. Ratusan permainan slot, meja & arked.\n\n🔥 *PUSSY888*\nSlot pembayaran tinggi dengan grafik memukau.\n\n⭐ *918KISS*\nKlasik lagenda yang dipercayai jutaan pemain.\n\n🎯 Semua permainan menjana *turnover* untuk bahagian keuntungan harian anda!\n\nHubungi sokongan untuk muat turun mana-mana permainan.`,
        profit: `📊 *Sistem Kongsi Keuntungan*\n\n💡 *Cara Ia Berfungsi:*\nSetiap pertaruhan = Turnover\n% turnover anda = Bahagian keuntungan anda\n\n📈 *Contoh:*\nPlatform jana RM10,000 hari ini\n30% = RM3,000 diagihkan\nAnda menyumbang 5% jumlah turnover\nAnda terima: RM150!\n\n✅ Diagihkan SETIAP HARI\n✅ Pengiraan telus\n✅ Tiada minimum turnover`,
        referral: `👥 *Program Rujukan*\n\n💰 Jana *30% komisen* dari deposit pertama setiap rakan!\n\n📋 *Cara Merujuk:*\n1. Hubungi Sokongan Langsung\n2. Dapatkan pautan rujukan unik anda\n3. Kongsikan dengan rakan\n4. Jana apabila mereka deposit!\n\n♾️ *Tiada had* rujukan\n✅ Pembayaran komisen serta-merta`,
        livechat: `💬 *Sokongan Langsung*\n\nPassukan sokongan kami sedia *24/7*!\n\n🌐 Laman web: https://turn8ver.com\n\n📞 Ejen kami berbicara:\n• English\n• Bahasa Melayu\n• 中文 (Mandarin)\n\n⚡ Masa respons purata: Kurang dari 2 minit`,
        livechat_btn: '🌐 Buka Sembang Laman Web',
        unknown: `❓ Saya tidak faham itu. Sila gunakan menu di bawah.`,
    }
};

// ========== HELPERS ==========
function getLang(chatId) {
    return userState[chatId]?.lang || 'en';
}

function t(chatId, key) {
    const lang = getLang(chatId);
    return T[lang][key] || T['en'][key] || key;
}

async function sendPhoto(chatId, photoUrl, caption = '') {
  const body = { chat_id: chatId, photo: photoUrl, caption, parse_mode: 'Markdown' };
  const res = await fetch(`${API}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function sendMessage(chatId, text, keyboard = null) {
    const body = {
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true
    };
    if (keyboard) body.reply_markup = keyboard;

    const res = await fetch(`${API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return res.json();
}

function mainMenuKeyboard(chatId) {
    return {
        inline_keyboard: [
            [{ text: t(chatId, 'btn_account'), callback_data: 'account' }],
            [{ text: t(chatId, 'btn_rewards'), callback_data: 'rewards' }],
            [{ text: t(chatId, 'btn_games'), callback_data: 'games' }],
            [{ text: '📢 Join Our Channel', url: 'https://t.me/turn8ver' }]
        ]
    };
}

function backKeyboard(chatId) {
    return {
        inline_keyboard: [
            [{ text: t(chatId, 'btn_back'), callback_data: 'menu' }]
        ]
    };
}

function accountKeyboard(chatId) {
    return {
        inline_keyboard: [
            [{ text: t(chatId, 'btn_register'), callback_data: 'register' }],
            [{ text: t(chatId, 'btn_deposit'), callback_data: 'deposit' }],
            [{ text: t(chatId, 'btn_withdraw'), callback_data: 'withdraw' }],
            [{ text: t(chatId, 'btn_back'), callback_data: 'menu' }]
        ]
    };
}

function rewardsKeyboard(chatId) {
    return {
        inline_keyboard: [
            [{ text: t(chatId, 'btn_bonus'), callback_data: 'bonus' }],
            [{ text: t(chatId, 'btn_profit'), callback_data: 'profit' }],
            [{ text: t(chatId, 'btn_referral'), callback_data: 'referral' }],
            [{ text: t(chatId, 'btn_back'), callback_data: 'menu' }]
        ]
    };
}

function gamesKeyboard(chatId) {
    return {
        inline_keyboard: [
            [{ text: '🏆 MEGA888 — Download', url: 'https://m.mega566.com/mega/index.html' }],
            [{ text: '🔥 PUSSY888 — Coming Soon', callback_data: 'coming_soon' }],
            [{ text: '⭐ 918KISS — Coming Soon', callback_data: 'coming_soon' }],
            [{ text: t(chatId, 'btn_back'), callback_data: 'menu' }]
        ]
    };
}

// ========== HANDLERS ==========
async function handleStart(chatId, firstName) {
    if (!userState[chatId]) userState[chatId] = {};
    const name = firstName ? `, ${firstName}` : '';
    const welcomeText = t(chatId, 'welcome').replace('Welcome to', `Welcome${name} to`);
    await sendMessage(chatId, welcomeText, mainMenuKeyboard(chatId));
}

async function handleCallback(chatId, callbackData, messageId, firstName) {
    const answerUrl = `${API}/answerCallbackQuery`;

    if (callbackData === 'menu') {
        await sendMessage(chatId, t(chatId, 'menu'), mainMenuKeyboard(chatId));
    } else if (callbackData === 'account') {
        await sendMessage(chatId, '👤 *Account Services*\n\nWhat do you need help with?', accountKeyboard(chatId));
    } else if (callbackData === 'rewards') {
        await sendMessage(chatId, '💎 *Rewards & Earnings*\n\nExplore our reward programs:', rewardsKeyboard(chatId));
    } else if (callbackData === 'register') {
        await sendMessage(chatId, t(chatId, 'register'), backKeyboard(chatId));
    } else if (callbackData === 'deposit') {
        await sendMessage(chatId, t(chatId, 'deposit'), backKeyboard(chatId));
        // Send QR code
        await sendPhoto(chatId, 'https://raw.githubusercontent.com/jayhyq93/turnover-bot/master/qr.png',
            '📱 *DuitNow QR* — Scan to pay instantly!')
            .catch(() => {}); // Silently fail if QR not available
    } else if (callbackData === 'withdraw') {
        await sendMessage(chatId, t(chatId, 'withdraw'), backKeyboard(chatId));
    } else if (callbackData === 'bonus') {
        await sendMessage(chatId, t(chatId, 'bonus'), backKeyboard(chatId));
    } else if (callbackData === 'games') {
        await sendMessage(chatId, t(chatId, 'games'), gamesKeyboard(chatId));
    } else if (callbackData === 'profit') {
        await sendMessage(chatId, t(chatId, 'profit'), backKeyboard(chatId));
    } else if (callbackData === 'referral') {
        await sendMessage(chatId, t(chatId, 'referral'), backKeyboard(chatId));
    } else if (callbackData === 'coming_soon') {
        await sendMessage(chatId, '⏳ *Coming Soon!*\n\nThis game will be available shortly. Stay tuned! 🔥', backKeyboard(chatId));
    }
}

// ========== POLLING ==========
let offset = 0;

async function poll() {
    try {
        const res = await fetch(`${API}/getUpdates?offset=${offset}&timeout=30`);
        const data = await res.json();

        if (!data.ok) {
            console.error('API error:', data);
            return;
        }

        for (const update of data.result) {
            offset = update.update_id + 1;

            if (update.message) {
                const msg = update.message;
                const chatId = msg.chat.id;
                const text = msg.text || '';
                const firstName = msg.from?.first_name || '';

                // Handle photo (bank receipt)
                if (msg.photo && ADMIN_CHAT_ID && chatId !== ADMIN_CHAT_ID) {
                    const caption = msg.caption || '(no caption)';
                    const fwdCaption = `🧾 *Receipt from customer*\n👤 Name: ${firstName}\n🆔 Chat ID: \`${chatId}\`\n📝 Caption: ${caption}`;
                    // Forward photo to admin
                    const fileId = msg.photo[msg.photo.length - 1].file_id;
                    await fetch(`${API}/sendPhoto`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, photo: fileId, caption: fwdCaption, parse_mode: 'Markdown' })
                    });
                    await sendMessage(chatId, `✅ *Receipt received!*\n\nOur agent is verifying your payment. Credits will be added within 5 minutes.\n\n_Thank you for your patience!_ 🙏`, backKeyboard(chatId));
                    continue;
                }

                console.log(`[MSG] ${chatId} (${firstName}): ${text}`);

                if (text === '/start' || text === '/menu') {
                    await handleStart(chatId, firstName);
                } else if (text === '/help') {
                    await sendMessage(chatId, t(chatId, 'menu'), mainMenuKeyboard(chatId));
                } else {
                    // Forward message to admin
                    if (ADMIN_CHAT_ID && chatId !== ADMIN_CHAT_ID) {
                        const fwdText = `📨 *Message from customer*\n👤 Name: ${firstName}\n🆔 Chat ID: \`${chatId}\`\n\n💬 *Message:*\n${text}`;
                        await sendMessage(ADMIN_CHAT_ID, fwdText);
                    }
                    // Auto reply to customer
                    await sendMessage(chatId, `✅ Message received! Our agent will respond shortly.\n\n_Please allow 1-5 minutes for response._`, backKeyboard(chatId));
                }
            }

            if (update.callback_query) {
                const cb = update.callback_query;
                const chatId = cb.message.chat.id;
                const firstName = cb.from?.first_name || '';

                console.log(`[BTN] ${chatId} (${firstName}): ${cb.data}`);

                // Answer callback to remove loading state
                await fetch(`${API}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ callback_query_id: cb.id })
                });

                await handleCallback(chatId, cb.data, cb.message.message_id, firstName);
            }
        }
    } catch (err) {
        console.error('Poll error:', err.message);
    }

    // Poll again
    setTimeout(poll, 1000);
}

// ========== START ==========
console.log('🤖 TURNOVER Support Bot starting...');
console.log('📱 Bot: @turn8ver_support_bot');
console.log('🌐 Website: https://turn8ver.com');

// Set bot commands
fetch(`${API}/setMyCommands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        commands: [
            { command: 'start', description: 'Start / Main Menu' },
            { command: 'menu', description: 'Show main menu' },
            { command: 'help', description: 'Help & Support' }
        ]
    })
}).then(() => console.log('✅ Commands set'));

poll();
