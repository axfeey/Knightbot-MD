const axios = require("axios");

const processedMessages = new Set();

async function instagramCommand(sock, chatId, message) {
    try {
        if (processedMessages.has(message.key.id)) return;
        
        processedMessages.add(message.key.id);
        setTimeout(() => processedMessages.delete(message.key.id), 5 * 60 * 1000);

        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        
        if (!text) {
            return await sock.sendMessage(chatId, { text: "Please provide an Instagram link." });
        }

        const match = text.match(/https?:\/\/(?:www\.)?instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/);
        if (!match) {
            return await sock.sendMessage(chatId, { text: "That is not a valid Instagram link." });
        }

        const cleanUrl = match[0];
        await sock.sendMessage(chatId, { react: { text: '🔄', key: message.key } });

        // Cobalt System API Instance
        const res = await axios.post('https://cobalt.tools/api/json', {
            url: cleanUrl
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
                caption: "𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗗 𝗕𝗬 𝗞𝗡𝗜𝗚𝗛𝗧-𝗕𝗢𝗧"
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: "❌ Unable to fetch video. The account might be private." });
        }

    } catch (error) {
        console.error('Instagram Downloader Error:', error);
        await sock.sendMessage(chatId, { text: "❌ Downloader service unavailable right now." });
    }
}

module.exports = instagramCommand;

