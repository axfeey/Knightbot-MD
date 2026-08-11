const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
╔═════════════════════════╗
   🤖 *${settings.botName || 'INATO MD'}*
   ✨ *Version:* ${settings.version || '3.0.0'}
   👑 *Owner:* ${settings.botOwner || 'axfeey'}
   🎥 *YT:* ${global.ytch}
╚═════════════════════════╝

┌───〔 🌐 *GENERAL COMMANDS* 〕───
│ ❯ .help | .menu
│ ❯ .ping | .alive
│ ❯ .tts <text> | .owner
│ ❯ .joke | .quote | .fact
│ ❯ .weather <city> | .news
│ ❯ .attp <text> | .lyrics <song>
│ ❯ .8ball <question>
│ ❯ .groupinfo | .staff | .admins
│ ❯ .vv | .trt <text> <lang>
│ ❯ .ss <link> | .jid | .url
└─────────────────────────

┌───〔 👮‍♂️ *ADMIN COMMANDS* 〕───
│ ❯ .ban @user | .kick @user
│ ❯ .warn @user | .warnings @user
│ ❯ .promote @user | .demote @user
│ ❯ .mute <mins> | .unmute
│ ❯ .delete or .del | .clear
│ ❯ .antilink | .antibadword
│ ❯ .antitag <on/off>
│ ❯ .welcome <on/off> | .goodbye <on/off>
│ ❯ .tag <msg> | .tagall | .hidetag <msg>
│ ❯ .tagnotadmin | .chatbot | .resetlink
│ ❯ .setgdesc <text> | .setgname <text>
│ ❯ .setgpp (reply image)
└─────────────────────────

┌───〔 🔒 *OWNER COMMANDS* 〕───
│ ❯ .mode <public/private>
│ ❯ .clearsession | .antidelete
│ ❯ .cleartmp | .update | .settings
│ ❯ .setpp (reply image)
│ ❯ .autoreact <on/off> | .autostatus <on/off>
│ ❯ .autostatus react <on/off>
│ ❯ .autotyping <on/off> | .autoread <on/off>
│ ❯ .anticall <on/off>
│ ❯ .pmblocker <on/off/status>
│ ❯ .pmblocker setmsg <text>
│ ❯ .setmention <reply msg> | .mention <on/off>
└─────────────────────────

┌───〔 🎨 *MEDIA & STICKER* 〕───
│ ❯ .blur <image> | .crop <reply image>
│ ❯ .simage <reply sticker> | .removebg
│ ❯ .sticker <reply image> | .remini
│ ❯ .tgsticker <link> | .meme
│ ❯ .take <packname> | .emojimix <e1>+<e2>
│ ❯ .igs <insta link> | .igsc <insta link>
└─────────────────────────

┌───〔 🖼️ *PIES COMMANDS* 〕───
│ ❯ .pies <country> | .china
│ ❯ .indonesia | .japan | .korea | .hijab
└─────────────────────────

┌───〔 🎮 *GAME COMMANDS* 〕───
│ ❯ .tictactoe @user | .hangman
│ ❯ .guess <letter> | .trivia
│ ❯ .answer <answer> | .truth | .dare
└─────────────────────────

┌───〔 🤖 *AI COMMANDS* 〕───
│ ❯ .gpt <question> | .gemini <question>
│ ❯ .imagine <prompt> | .flux <prompt>
│ ❯ .sora <prompt>
└─────────────────────────

┌───〔 🎯 *FUN COMMANDS* 〕───
│ ❯ .compliment @user | .insult @user
│ ❯ .flirt | .shayari | .goodnight | .roseday
│ ❯ .character @user | .wasted @user
│ ❯ .ship @user | .simp @user
│ ❯ .stupid @user [text]
└─────────────────────────

┌───〔 🔤 *TEXTMAKER* 〕───
│ ❯ .metallic | .ice | .snow | .impressive
│ ❯ .matrix | .light | .neon | .devil
│ ❯ .purple | .thunder | .leaves | .1917
│ ❯ .arena | .hacker | .sand | .blackpink
│ ❯ .glitch | .fire
└─────────────────────────

┌───〔 📥 *DOWNLOADER* 〕───
│ ❯ .play <song_name> | .song <song_name>
│ ❯ .spotify <query> | .instagram <link>
│ ❯ .facebook <link> | .tiktok <link>
│ ❯ .video <song_name> | .ytmp4 <link>
└─────────────────────────

┌───〔 🧩 *MISC & FUN* 〕───
│ ❯ .heart | .horny | .circle | .lgbt
│ ❯ .lolice | .its-so-stupid | .namecard
│ ❯ .oogway | .tweet | .ytcomment
│ ❯ .comrade | .gay | .glass | .jail
│ ❯ .passed | .triggered
└─────────────────────────

┌───〔 🖼️ *ANIME* 〕───
│ ❯ .nom | .poke | .cry | .kiss | .pat
│ ❯ .hug | .wink | .facepalm
└─────────────────────────

┌───〔 💻 *GITHUB COMMANDS* 〕───
│ ❯ .git | .github | .sc | .script | .repo
└─────────────────────────

📢 *Join our channel for updates:*
https://whatsapp.com/channel/0029VaWUivQJENxtAGSOJv2N`;

    try {
        await sock.sendMessage(chatId, {
            image: { url: 'https://n.uguu.se/EYHDWsSa.jpg' },
            caption: helpMessage,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363321557930811@newsletter',
                    newsletterName: 'INATO MD',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
