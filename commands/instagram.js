
const { igdl } = require("ruhend-scraper");
const axios = require("axios");

// Store processed message IDs to prevent duplicates
const processedMessages = new Set();

function extractUniqueMedia(mediaData) {
    const uniqueMedia = [];
    const seenUrls = new Set();
    
    for (const media of mediaData) {
        if (!media.url) continue;
        if (!seenUrls.has(media.url)) {
            seenUrls.add(media.url);
            uniqueMedia.push(media);
        }
    }
    return uniqueMedia;
}

async function instagramCommand(sock, chatId, message) {
    try {
        if (processedMessages.has(message.key.id)) return;
        
        processedMessages.add(message.key.id);
        setTimeout(() => processedMessages.delete(message.key.id), 5 * 60 * 1000);

        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        
        if (!text) {
            return await sock.sendMessage(chatId, { 
                text: "Please provide an Instagram link for the video."
            });
        }

        const instagramPatterns = [
            /https?:\/\/(?:www\.)?instagram\.com\//,
            /https?:\/\/(?:www\.)?instagr\.am\//
        ];

        const isValidUrl = instagramPatterns.some(pattern => pattern.test(text));
        
        if (!isValidUrl) {
            return await sock.sendMessage(chatId, { 
                text: "That is not a valid Instagram link. Please provide a valid Instagram post, reel, or video link."
            });
        }

        await sock.sendMessage(chatId, { react: { text: '🔄', key: message.key } });

        // Extract clean URL (Remove tracking parameters like ?igsh=...)
        const cleanUrl = text.match(/https?:\/\/(?:www\.)?instagram\.com\/[^\s\?]+/)?.[0] || text;

        let mediaData = [];

        // 1. Try ruhend-scraper first
        try {
            const downloadData = await igdl(cleanUrl);
            if (downloadData && downloadData.data && downloadData.data.length > 0) {
                mediaData = downloadData.data;
            }
        } catch (e) {
            console.log("Ruhend-scraper failed, trying fallback API...");
        }

        // 2. Fallback API if ruhend-scraper fails
        if (mediaData.length === 0) {
            try {
                const apiRes = await axios.get(`https://api.vreden.web.id/api/igdownload?url=${encodeURIComponent(cleanUrl)}`);
                if (apiRes.data && apiRes.data.result) {
                    const result = apiRes.data.result;
                    if (Array.isArray(result)) {
                        mediaData = result.map(item => ({ url: item.url || item, type: 'video' }));
                    } else if (result.url) {
                        mediaData = [{ url: result.url, type: 'video' }];
                    }
                }
            } catch (apiErr) {
                console.error("API Fallback failed:", apiErr.message);
            }
        }

        const uniqueMedia = extractUniqueMedia(mediaData);
        const mediaToDownload = uniqueMedia.slice(0, 20);
        
        if (mediaToDownload.length === 0) {
            return await sock.sendMessage(chatId, { 
                text: "❌ No media found at the provided link. The post might be private or the link is invalid."
            });
        }

        for (let i = 0; i < mediaToDownload.length; i++) {
            try {
                const media = mediaToDownload[i];
                const mediaUrl = media.url;

                const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(mediaUrl) || 
                              media.type === 'video' || 
                              cleanUrl.includes('/reel/') || 
                              cleanUrl.includes('/tv/');

                if (isVideo) {
                    await sock.sendMessage(chatId, {
                        video: { url: mediaUrl },
                        mimetype: "video/mp4",
                        caption: "𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗗 𝗕𝗬 𝗞𝗡𝗜𝗚𝗛𝗧-𝗕𝗢𝗧"
                    }, { quoted: message });
                } else {
                    await sock.sendMessage(chatId, {
                        image: { url: mediaUrl },
                        caption: "𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗗 𝗕𝗬 𝗞𝗡𝗜𝗚𝗛𝗧-𝗕𝗢𝗧"
                    }, { quoted: message });
                }
                
                if (i < mediaToDownload.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (mediaError) {
                console.error(`Error downloading media ${i + 1}:`, mediaError);
            }
        }

    } catch (error) {
        console.error('Error in Instagram command:', error);
        await sock.sendMessage(chatId, { 
            text: "❌ An error occurred while processing the Instagram request. Please try again."
        });
    }
}

module.exports = instagramCommand;
