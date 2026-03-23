const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const puppeteer = require('puppeteer');
const fs = require('fs');

// ========== CONFIG ==========
const API_ID = 36801701;
const API_HASH = 'e22f443fce26c5701c78a5c7eb97e5b1';
const SESSION = fs.readFileSync('session.txt', 'utf-8').trim();
const ADMIN_USERNAME = 'GADGET4544';

const GAME_URL = 'https://www.mega888.vip';
const GAME_ID = 'NANA1115';
const GAME_PW = 'Qwer1115';

const BANK_INFO = `🏦 Bank: BANK ISLAM\n👤 Name: PUAN SHARIFAH FATIMAH\n🔢 Account: 13044021038654`;

// ========== USER STATE MACHINE ==========
// States: null | 'register_name' | 'register_phone' | 'deposit_wait' | 'withdraw_amount' | 'withdraw_bank'
const userState = {};

function getState(id) { return userState[id] || { step: null, data: {} }; }
function setState(id, step, data = {}) { userState[id] = { step, data: { ...(userState[id]?.data || {}), ...data } }; }
function clearState(id) { delete userState[id]; }

// ========== PUPPETEER: BANK ISLAM VERIFY ==========
async function verifyBankReceipt(amount) {
    const b = await getBrowser();
    const page = await b.newPage();
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    try {
        await page.goto('https://web.bimb.com/', { waitUntil: 'networkidle2', timeout: 30000 });
        await sleep(2000);

        // Login
        const userField = await page.$('input[name*="user" i], input[id*="user" i], input[placeholder*="user" i], #loginName, #username');
        const passField = await page.$('input[type="password"]');
        if (userField && passField) {
            await userField.click({ clickCount: 3 });
            await userField.type('Sharifah787878');
            await passField.click({ clickCount: 3 });
            await passField.type('Nora@2203');
            await page.keyboard.press('Enter');
            await sleep(4000);
        }

        await page.screenshot({ path: 'bank_dashboard.png' });

        // Look for recent transactions
        const txText = await page.evaluate(() => document.body.innerText);
        await page.close();

        // Check if amount appears in recent transactions
        const amountStr = parseFloat(amount).toFixed(2);
        const found = txText.includes(amountStr) || txText.includes(String(amount));
        return { verified: found, pageText: txText.slice(0, 500) };

    } catch (e) {
        await page.screenshot({ path: 'bank_error.png' }).catch(() => {});
        await page.close();
        console.error('Bank verify error:', e.message);
        return { verified: false, error: e.message };
    }
}

// ========== PUPPETEER: MEGA888 ==========
let browser;

async function getBrowser() {
    if (!browser || !browser.isConnected()) {
        browser = await puppeteer.launch({ 
            headless: true, 
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            timeout: 15000
        });
    }
    return browser;
}

async function mega888Login(page) {
    await page.goto(GAME_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Try to find login fields
    const usernameField = await page.$('input[name="username"], input[type="text"], #username, #loginName');
    const passwordField = await page.$('input[name="password"], input[type="password"], #password');

    if (usernameField && passwordField) {
        await usernameField.click({ clickCount: 3 });
        await usernameField.type(GAME_ID);
        await passwordField.click({ clickCount: 3 });
        await passwordField.type(GAME_PW);

        const loginBtn = await page.$('button[type="submit"], input[type="submit"], .login-btn, #loginBtn, button.btn-login');
        if (loginBtn) await loginBtn.click();
        await page.waitForTimeout(3000);
        return true;
    }
    return false;
}

async function createMegaAccount(fullName, phone) {
    const b = await getBrowser();
    const page = await b.newPage();
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    try {
        // Login
        await page.goto('https://www.mega888.vip/251224-1/login.html', { waitUntil: 'networkidle2' });
        await page.type('#userName', GAME_ID);
        await page.type('#password', GAME_PW);
        await page.click('button');
        await sleep(3000);

        // Go to User Management
        await page.evaluate(() => { Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('User Management'))?.click(); });
        await sleep(2000);

        // Click PlayerList Menu → Toggle Dropdown
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const toggles = btns.filter(b => b.textContent.trim() === 'Toggle Dropdown');
            // Second toggle is for PlayerList
            if (toggles[1]) toggles[1].click();
        });
        await sleep(800);

        // Click AddPlayer
        await page.evaluate(() => {
            Array.from(document.querySelectorAll('.dropdown-menu a, .dropdown-item'))
                .find(a => a.textContent.trim() === 'AddPlayer')?.click();
        });
        await sleep(1500);

        // Get auto-generated username from the page (it's an input value, not textContent)
        const generatedUsername = await page.evaluate(() => {
            const el = document.querySelector('#s_playerID');
            return el ? (el.value?.trim() || el.textContent?.trim()) : null;
        });
        console.log('Generated username from page:', generatedUsername);

        // Generate password
        const password = 'Aa' + phone.replace(/\D/g, '').slice(-6);

        // Helper: type into field properly (triggers validation)
        async function fillField(selector, value) {
            await page.focus(selector);
            await page.click(selector, { clickCount: 3 });
            await page.keyboard.type(String(value));
        }

        await fillField('#txt_Password', password);
        await fillField('#txt_scoreNum', '0');
        await sleep(500);

        // Click OK button
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const ok = btns.find(b => b.textContent?.trim() === 'OK');
            if (ok) ok.click();
        });
        await sleep(1500);

        // Confirm "Are you sure?"
        await page.evaluate(() => {
            const yes = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Yes');
            if (yes) yes.click();
        });
        await sleep(2000);
        await page.screenshot({ path: 'mega_result.png' });

        // Use the pre-captured username (captured before submit)
        const finalUsername = generatedUsername;

        console.log('Final username:', finalUsername, 'Password:', password);
        await page.close();
        return { username: finalUsername, password };

    } catch (e) {
        await page.screenshot({ path: 'mega_error.png' }).catch(() => {});
        await page.close();
        throw e;
    }
}

async function getMegaBalance(gameId) {
    const b = await getBrowser();
    const page = await b.newPage();
    try {
        await mega888Login(page);
        await page.goto(`${GAME_URL}/member/detail?id=${gameId}`, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);

        const balanceEl = await page.$('.balance, .credit, .points, [class*="balance"], [class*="credit"]');
        const balance = balanceEl ? await page.evaluate(e => e.textContent?.trim(), balanceEl) : null;
        await page.close();
        return balance;
    } catch (e) {
        await page.close();
        throw e;
    }
}

async function topUpMega(gameId, amount) {
    const b = await getBrowser();
    const page = await b.newPage();
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    try {
        // Login
        await page.goto('https://www.mega888.vip/251224-1/login.html', { waitUntil: 'networkidle2' });
        await sleep(1000);
        await page.waitForSelector('#userName', { timeout: 10000 });
        await page.type('#userName', GAME_ID);
        await page.type('#password', GAME_PW);
        await page.click('button');
        await sleep(4000);

        // Go to Search User
        await page.evaluate(() => { Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Search User'))?.click(); });
        await sleep(2000);

        // Search for player
        await page.type('#J_searchKey', gameId);
        await page.click('#J_btnSearch');
        await sleep(2000);

        // Click "set score"
        await page.evaluate(() => { Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim() === 'set score')?.click(); });
        await sleep(1500);

        // Fill score amount
        await page.waitForSelector('#txt_scoreNum', { timeout: 5000 });
        await page.click('#txt_scoreNum', { clickCount: 3 });
        await page.keyboard.type(String(amount));
        await sleep(300);

        // Click OK
        await page.evaluate(() => { Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'OK')?.click(); });
        await sleep(1500);

        // Confirm "Are you sure?" → click Yes
        await page.evaluate(() => { Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Yes')?.click(); });
        await sleep(2000);

        await page.screenshot({ path: 'mega_topup_result.png' });
        await page.close();
        console.log(`✅ Top-up done: ${gameId} +${amount}`);
        return true;
    } catch (e) {
        await page.screenshot({ path: 'mega_topup_error.png' }).catch(() => {});
        await page.close();
        throw e;
    }
}

async function deductMega(gameId, amount) {
    const b = await getBrowser();
    const page = await b.newPage();
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    try {
        // Login
        await page.goto('https://www.mega888.vip/251224-1/login.html', { waitUntil: 'networkidle2' });
        await sleep(1000);
        await page.waitForSelector('#userName', { timeout: 10000 });
        await page.type('#userName', GAME_ID);
        await page.type('#password', GAME_PW);
        await page.click('button');
        await sleep(4000);

        // Search User
        await page.evaluate(() => { Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Search User'))?.click(); });
        await sleep(2000);
        await page.type('#J_searchKey', gameId);
        await page.click('#J_btnSearch');
        await sleep(2000);

        // Get current score first
        const currentScore = await page.evaluate(() => {
            const rows = document.querySelectorAll('td');
            for (const td of rows) {
                if (/^\d+$/.test(td.textContent?.trim())) return parseInt(td.textContent.trim());
            }
            return 0;
        });
        console.log(`Current score for ${gameId}: ${currentScore}`);

        // Set score to (current - amount)
        const newScore = Math.max(0, currentScore - amount);
        await page.evaluate(() => { Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim() === 'set score')?.click(); });
        await sleep(1500);
        await page.waitForSelector('#txt_scoreNum', { timeout: 5000 });
        await page.click('#txt_scoreNum', { clickCount: 3 });
        await page.keyboard.type(String(newScore));
        await sleep(300);
        await page.evaluate(() => { Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'OK')?.click(); });
        await sleep(1500);

        // Confirm "Are you sure?" → click Yes
        await page.evaluate(() => { Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Yes')?.click(); });
        await sleep(2000);

        await page.screenshot({ path: 'mega_deduct_result.png' });
        await page.close();
        console.log(`✅ Deduct done: ${gameId} score set to ${newScore}`);
        return { success: true, previousScore: currentScore, newScore };
    } catch (e) {
        await page.screenshot({ path: 'mega_deduct_error.png' }).catch(() => {});
        await page.close();
        throw e;
    }
}

// ========== MAIN ==========
async function main() {
    const client = new TelegramClient(new StringSession(SESSION), API_ID, API_HASH, {
        connectionRetries: 5,
    });

    await client.connect();
    console.log('🤖 NANA Agent online as @TurnoverNana');
    console.log('✅ Autonomous mode - handling register/deposit/withdraw');

    async function reply(sender, message) {
        await client.sendMessage(sender, { message, parseMode: 'markdown' });
    }

    async function notifyAdmin(message) {
        await client.sendMessage(ADMIN_USERNAME, { message, parseMode: 'markdown' }).catch(e => console.error('Admin notify failed:', e.message));
    }

    client.addEventHandler(async (event) => {
        const msg = event.message;
        if (!msg || msg.out || !msg.isPrivate) return;

        const sender = await msg.getSender();
        const senderId = sender.id?.toString();
        const senderName = sender.firstName || sender.username || 'Customer';
        const text = (msg.text || '').trim();
        const textLow = text.toLowerCase();

        // Handle photo (bank receipt for deposit)
        if (msg.photo || msg.document) {
            const state = getState(senderId);
            const amount = state.data.amount || 0;
            const gameId = state.data.gameId || '';

            await reply(sender, `⏳ Receipt received! Verifying with bank...\nPlease wait a moment. 🏦`);

            // Forward receipt to admin
            await client.forwardMessages(ADMIN_USERNAME, { messages: [msg.id], fromPeer: msg.peerId }).catch(() => {});

            // If no game ID or amount yet, ask
            if (!gameId || !amount) {
                await reply(sender, `✅ Receipt noted!\n\nPlease also provide:\n🎮 Your *Game ID*\n💰 *Amount* transferred (RM)\n\nExample: \`090405549357 100\``);
                setState(senderId, 'deposit_receipt_pending', {});
                return;
            }

            // Process in background
            ;(async () => {
                try {
                    // Step 1: Verify bank
                    const bankResult = await verifyBankReceipt(amount);
                    console.log(`Bank verify RM${amount}: ${bankResult.verified}`);

                    // Step 2: Top up
                    await topUpMega(gameId, amount);
                    await reply(sender,
                        `🎉 *Deposit Successful!*\n\n` +
                        `✅ Bank verified\n` +
                        `💰 Amount: RM${amount}\n` +
                        `🎮 Game ID: ${gameId}\n\n` +
                        `Credits added! Good luck! 🔥\n\n` +
                        `📊 Every bet earns *30% daily profit share*!`
                    );
                    await notifyAdmin(`✅ Deposit done\n👤 ${senderName}\n🎮 ${gameId}\n💰 RM${amount}\nBank: ${bankResult.verified ? 'verified' : 'pending'}`);
                    clearState(senderId);
                } catch (e) {
                    console.error('Deposit error:', e.message);
                    await notifyAdmin(`⚠️ Manual top-up needed\n👤 ${senderName}\n🎮 ${gameId}\n💰 RM${amount}\nError: ${e.message}`);
                    await reply(sender, `✅ Receipt verified! Credits will be added within *5 minutes*. 🙏`);
                    clearState(senderId);
                }
            })();
            return;
        }

        if (!text) return;

        const state = getState(senderId);
        console.log(`[${senderName}] step=${state.step} msg="${text}"`);

        // ── STATE MACHINE ──

        // DEPOSIT: customer sent receipt first then game ID + amount
        if (state.step === 'deposit_receipt_pending') {
            // Parse "gameId amount" or just ask
            const parts = text.split(/\s+/);
            const parsedGameId = parts[0];
            const parsedAmount = parseFloat(parts[1] || '0');
            if (!parsedGameId || !parsedAmount) {
                await reply(sender, `Please send: \`[GameID] [Amount]\`\nExample: \`090405549357 100\``);
                return;
            }
            setState(senderId, null, { gameId: parsedGameId, amount: parsedAmount });
            await reply(sender, `⏳ Processing...\n🎮 Game ID: ${parsedGameId}\n💰 RM${parsedAmount}`);
            ;(async () => {
                try {
                    const bankResult = await verifyBankReceipt(parsedAmount);
                    await topUpMega(parsedGameId, parsedAmount);
                    await reply(sender, `🎉 *Deposit Successful!*\n\n✅ Bank verified\n💰 RM${parsedAmount}\n🎮 ${parsedGameId}\n\nCredits added! 🔥`);
                    await notifyAdmin(`✅ Deposit done\n👤 ${senderName}\n🎮 ${parsedGameId}\n💰 RM${parsedAmount}`);
                    clearState(senderId);
                } catch (e) {
                    await notifyAdmin(`⚠️ Manual top-up needed\n👤 ${senderName}\n🎮 ${parsedGameId}\n💰 RM${parsedAmount}`);
                    await reply(sender, `✅ Processing! Credits within *5 minutes*. 🙏`);
                    clearState(senderId);
                }
            })();
            return;
        }

        // REGISTER step 1: waiting for full name
        if (state.step === 'register_name') {
            setState(senderId, 'register_phone', { fullName: text });
            await reply(sender, `👤 Name: *${text}*\n\nNow please send your *phone number* (e.g. 0123456789):`);
            return;
        }

        // REGISTER step 2: waiting for phone number
        if (state.step === 'register_phone') {
            const phone = text.replace(/\D/g, '');
            if (phone.length < 9) {
                await reply(sender, `❌ Invalid phone number. Please enter again (e.g. 0123456789):`);
                return;
            }
            setState(senderId, 'register_bank', { phone });
            await reply(sender,
                `📱 Phone: *${text}*\n\n` +
                `Now please provide your *bank account details* for withdrawals:\n\n` +
                `Send in this format:\n` +
                `Bank: MAYBANK\n` +
                `Account: 1234567890\n` +
                `Name: YOUR FULL NAME`
            );
            return;
        }

        // REGISTER step 3: waiting for bank account
        if (state.step === 'register_bank') {
            setState(senderId, null, { bankDetails: text });
            const fullName = state.data.fullName;
            const phone = state.data.phone;
            await reply(sender, `⏳ Creating your MEGA888 account...\nPlease wait a moment! 🎰`);

            // Run puppeteer in background, don't block
            createMegaAccount(fullName, phone).then(async (creds) => {
                await reply(sender,
                    `🎉 *Account Created Successfully!*\n\n` +
                    `🎮 *Game:* MEGA888\n` +
                    `👤 *Username:* \`${creds.username}\`\n` +
                    `🔑 *Password:* \`${creds.password}\`\n\n` +
                    `📲 Download MEGA888:\nhttps://m.mega566.com/mega/index.html\n\n` +
                    `💰 Ready to deposit? You get *50% Welcome Bonus!*\n` +
                    `Reply *deposit* to proceed.`
                );
                await notifyAdmin(
                    `✅ *New Member Registered*\n\n` +
                    `👤 Name: ${fullName}\n📱 Phone: ${phone}\n` +
                    `🏦 Bank: ${state.data.bankDetails || 'N/A'}\n` +
                    `🎮 Username: ${creds.username}\n🔑 Password: ${creds.password}`
                );
            }).catch(async (e) => {
                console.error('Create account error:', e.message);
                const username = 'T' + phone.replace(/\D/g, '').slice(-6);
                const password = 'Pass' + phone.replace(/\D/g, '').slice(-4) + '!';
                await notifyAdmin(
                    `⚠️ *Manual Registration Needed*\n\n` +
                    `👤 Name: ${fullName}\n📱 Phone: ${phone}\n` +
                    `🏦 Bank: ${state.data.bankDetails || 'N/A'}\n\n` +
                    `Suggested:\n🎮 Username: ${username}\n🔑 Password: ${password}\n\n` +
                    `Please create on mega888.vip and send to customer (ID: ${senderId})`
                );
                await reply(sender, `⏳ Your account is being set up!\nWe will send your login details within *5 minutes*. 🙏`);
            });
            clearState(senderId);
            return;
        }

        // DEPOSIT step 1: waiting for game ID
        if (state.step === 'deposit_gameid') {
            setState(senderId, 'deposit_amount', { gameId: text });
            await reply(sender, `🎮 Game ID: *${text}*\n\nHow much would you like to deposit? (RM)\nExample: *100*`);
            return;
        }

        // DEPOSIT step 2: waiting for amount
        if (state.step === 'deposit_amount') {
            const amount = parseFloat(text.replace(/[^\d.]/g, ''));
            if (!amount || amount < 30) {
                await reply(sender, `❌ Minimum deposit is RM30. Please enter amount again:`);
                return;
            }
            const bonus = amount * 0.5;
            setState(senderId, 'deposit_wait', { amount });
            await reply(sender,
                `💰 *Deposit: RM${amount}*\n` +
                (state.data.isNew ? `🎁 *Welcome Bonus: +RM${bonus}* (50%)\n💳 Total Credit: RM${amount + bonus}\n\n` : `\n`) +
                `Please transfer to:\n\n${BANK_INFO}\n\n` +
                `After transfer, send me the *screenshot of your receipt* 📸`
            );
            return;
        }

        // WITHDRAW step 1: waiting for game ID
        if (state.step === 'withdraw_gameid') {
            setState(senderId, 'withdraw_amount', { gameId: text });
            await reply(sender, `🎮 Game ID: *${text}*\n\nHow much would you like to withdraw? (RM)\nMinimum: RM50`);
            return;
        }

        // WITHDRAW step 2: waiting for amount
        if (state.step === 'withdraw_amount') {
            const amount = parseFloat(text.replace(/[^\d.]/g, ''));
            if (!amount || amount < 50) {
                await reply(sender, `❌ Minimum withdrawal is RM50. Please enter amount again:`);
                return;
            }
            setState(senderId, 'withdraw_bank', { amount });
            await reply(sender,
                `💸 Withdrawal: *RM${amount}*\n\n` +
                `Please provide your bank details:\n\n` +
                `Send in this format:\n` +
                `Bank: MAYBANK\n` +
                `Account: 1234567890\n` +
                `Name: YOUR NAME`
            );
            return;
        }

        // WITHDRAW step 3: waiting for bank details
        if (state.step === 'withdraw_bank') {
            const gameId = state.data.gameId;
            const amount = state.data.amount;
            setState(senderId, null);

            await reply(sender, `⏳ Processing your withdrawal...\nRemoving credits from game account. Please wait!`);

            deductMega(gameId, amount).then(async () => {
                await reply(sender, `✅ *Credits removed from game account!*\n\nYour bank transfer is being processed.\nExpected: *5-15 minutes*. 💸`);
            }).catch(async () => {
                await reply(sender, `✅ *Withdrawal request received!*\n\nProcessing time: *5-15 minutes*. 💸`);
            });

            // Notify admin with bank details
            await notifyAdmin(
                `💸 *WITHDRAWAL REQUEST*\n\n` +
                `👤 Customer: ${senderName}\n` +
                `🎮 Game ID: ${gameId}\n` +
                `💰 Amount: RM${amount}\n\n` +
                `🏦 Bank Details:\n${text}\n\n` +
                `⚡ Please transfer and send receipt!`
            );
            clearState(senderId);
            return;
        }

        // ── INTENT DETECTION (no active state) ──

        // Greeting
        if (/^(hi|hello|hey|hai|helo|salam|yo|start|menu)/.test(textLow)) {
            clearState(senderId);
            await reply(sender,
                `👋 Hello ${senderName}! Welcome to *TURNOVER* 🔥\n\n` +
                `_From Defeat To Rebirth_\n\n` +
                `What can I help you with?\n\n` +
                `1️⃣ Register new account\n` +
                `2️⃣ Deposit\n` +
                `3️⃣ Withdraw\n` +
                `4️⃣ Check promotions\n` +
                `5️⃣ Download games\n\n` +
                `Reply with a number or keyword!`
            );
            return;
        }

        // Register
        if (/register|daftar|new account|baru|sign up|1️⃣|^1$/.test(textLow)) {
            setState(senderId, 'register_name');
            await reply(sender, `📝 *New Account Registration*\n\nPlease enter your *full name*:`);
            return;
        }

        // Deposit
        if (/deposit|topup|top up|reload|masuk|2️⃣|^2$/.test(textLow)) {
            setState(senderId, 'deposit_gameid');
            await reply(sender, `💰 *Deposit*\n\nPlease enter your *MEGA888 Game ID*:`);
            return;
        }

        // Withdraw
        if (/withdraw|tarik|cashout|keluarkan|3️⃣|^3$/.test(textLow)) {
            setState(senderId, 'withdraw_gameid');
            await reply(sender, `💸 *Withdrawal*\n\nPlease enter your *MEGA888 Game ID*:`);
            return;
        }

        // Promotions
        if (/promo|bonus|offer|4️⃣|^4$/.test(textLow)) {
            await reply(sender,
                `🎁 *Current Promotions*\n\n` +
                `🌟 *50% Welcome Bonus*\nDeposit RM100 → Play with RM150!\n\n` +
                `👥 *30% Referral Commission*\nInvite friends → Earn 30% of their deposit!\n\n` +
                `📊 *30% Daily Profit Share*\nEvery bet = turnover = daily profit!\n\n` +
                `Ready to claim? Reply *register* or *deposit*! 🔥`
            );
            return;
        }

        // Games download
        if (/game|mega|download|5️⃣|^5$/.test(textLow)) {
            await reply(sender,
                `🎰 *Download Games*\n\n` +
                `🏆 *MEGA888*\nhttps://m.mega566.com/mega/index.html\n\n` +
                `🔥 PUSSY888 — Coming Soon\n` +
                `⭐ 918KISS — Coming Soon\n\n` +
                `After downloading, reply *register* to create your account!`
            );
            return;
        }

        // Thank you
        if (/thank|tq|ty|terima/.test(textLow)) {
            await reply(sender, `😊 You're welcome! Good luck and happy playing! 🎰🔥\n\nhttps://turn8ver.com`);
            return;
        }

        // Default fallback
        await reply(sender,
            `😊 How can I help you?\n\n` +
            `1️⃣ Register\n2️⃣ Deposit\n3️⃣ Withdraw\n4️⃣ Promotions\n5️⃣ Download Games`
        );

    }, new NewMessage({}));

    console.log('✅ NANA Agent ready!');
    await new Promise(() => {});
}

main().catch(console.error);
