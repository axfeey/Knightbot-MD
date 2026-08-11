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

        const cleanUrl = text.match(/https?:\/\/(?:www\.)?instagram\.com\/[^\s\?]+/)?.[0] || text;

        if (!cleanUrl.includes("instagram.com")) {
            return await sock.sendMessage(chatId, { 
                text: "That is not a valid Instagram link."
            });
        }

        await sock.sendMessage(chatId, { react: { text: '🔄', key: message.key } });

        // Working Working Reliable API
        let res = await axios.get(`https://api.fgmods.xyz/api/downloader/igdl?url=${encodeURIComponent(cleanUrl)}&apikey=fg-videos`);
        
        if (res.data && res.data.result && res.data.result.length > 0) {
            let mediaList = res.data.result;
            
            for (let item of mediaList) {
                let mediaUrl = item.url;
                await sock.sendMessage(chatId, {
                    video: { url: mediaUrl },
                    mimetype: "video/mp4",
                    caption: "𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗗 𝗕𝗬 𝗞𝗡𝗜𝗚𝗛𝗧-𝗕𝗢𝗧"
                }, { quoted: message });
            }
        } else {
            await sock.sendMessage(chatId, { 
                text: "❌ Could not fetch media. Make sure the account/post is public."
            });
        }

    } catch (error) {
        console.error('Error in Instagram command:', error);
        await sock.sendMessage(chatId, { 
            text: "❌ Server error occurred. Please try again after some time."
        });
    }
}

module.exports = instagramCommand;
