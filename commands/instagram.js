const axios = require("axios");

const processedMessages = new Set();

async function instagramCommand(sock, chatId, message) {
    try {
        if (processedMessages.has(message.key.id)) return;
        
        processedMessages.add(message.key.id);
        setTimeout(() => processedMessages.delete(message.key.id), 5 * 60 * 1000);

        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        
        if (!text) {
            return await sock.sendMessage(chatId, { 
                text: "Please provide an Instagram link."
            });
        }

        const match = text.match(/https?:\/\/(?:www\.)?instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/);
        if (!match) {
            return await sock.sendMessage(chatId, { 
                text: "That is not a valid Instagram link."
            });
        }

        const cleanUrl = match[0];

        await sock.sendMessage(chatId, { react: { text: '🔄', key: message.key } });

        // Reliable Direct Scraper API
        let res = await axios.get(`https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(cleanUrl)}`);
        
        if (res.data && res.data.data && res.data.data.length > 0) {
            let mediaList = res.data.data;
            
            for (let item of mediaList) {
                let mediaUrl = item.url;
                await sock.sendMessage(chatId, {
                    video: { url: mediaUrl },
                    mimetype: "video/mp4",
                    caption: "𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗗 𝗕𝗬 INATO-MD"
                }, { quoted: message });
            }
        } else {
            await sock.sendMessage(chatId, { 
                text: "❌ Could not fetch media. Make sure the post is public."
            });
        }

    } catch (error) {
        console.error('Error in Instagram command:', error);
        await sock.sendMessage(chatId, { 
            text: "❌ Server error occurred. Please try again."
        });
    }
}

module.exports = instagramCommand;

