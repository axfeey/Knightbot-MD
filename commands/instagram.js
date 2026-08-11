const axios = require("axios");

async function instagramCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        if (!text) return;

        // ലിങ്ക് മാത്രം വേർതിരിച്ചെടുക്കുന്നു
        const match = text.match(/https?:\/\/(?:www\.)?instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/);
        if (!match) return; // ലിങ്ക് ഇല്ലെങ്കിൽ ഒന്നും ചെയ്യണ്ട

        const cleanUrl = match[0];
        await sock.sendMessage(chatId, { react: { text: '🔄', key: message.key } });

        // Cobalt API ആണ് ഇപ്പോൾ ഏറ്റവും ബെസ്റ്റ് (ഇത് വല്ലാതെ ബ്ലോക്ക് ആകില്ല)
        const res = await axios.post('https://cobalt.tools/api/json', {
            url: cleanUrl,
            vQuality: '720'
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (res.data && res.data.url) {
            await sock.sendMessage(chatId, {
                video: { url: res.data.url },
                mimetype: "video/mp4",
                caption: "✅ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗗 𝗕𝗬 𝗞𝗡𝗜𝗚𝗛𝗧-𝗕𝗢𝗧"
            }, { quoted: message });
            await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });
        } else {
            throw new Error("API Returned no data");
        }

    } catch (error) {
        console.error('Downloader Error:', error);
        await sock.sendMessage(chatId, { 
            text: "❌ ഡൗൺലോഡ് പരാജയപ്പെട്ടു. ഇൻസ്റ്റാഗ്രാം ലോഗിൻ ആവശ്യമുള്ള പോസ്റ്റോ അല്ലെങ്കിൽ പ്രൈവറ്റ് അക്കൗണ്ടോ ആയിരിക്കാം ഇത്." 
        });
        await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
    }
}

module.exports = instagramCommand;


