const { exec } = require('child_process');
const fs = require('fs');

const processedMessages = new Set();

async function instagramCommand(sock, chatId, message) {
    try {
        if (processedMessages.has(message.key.id)) return;
        
        processedMessages.add(message.key.id);
        setTimeout(() => processedMessages.delete(message.key.id), 5 * 60 * 1000);

        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        if (!text) return;

        const match = text.match(/https?:\/\/(?:www\.)?instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/);
        if (!match) return;

        const cleanUrl = match[0];
        await sock.sendMessage(chatId, { react: { text: '🔄', key: message.key } });

        const fileName = `./temp_${Date.now()}.mp4`;
        const cmd = `yt-dlp -o "${fileName}" -f "b[ext=mp4]/b" "${cleanUrl}"`;

        exec(cmd, async (error, stdout, stderr) => {
            if (error || !fs.existsSync(fileName)) {
                console.error("yt-dlp error:", error || stderr);
                await sock.sendMessage(chatId, { 
                    text: '❌ ഡൗൺലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല! (പ്രൈവറ്റ് അക്കൗണ്ട് അല്ലെങ്കിൽ ലിങ്ക് തകരാറിലാകാം).' 
                }, { quoted: message });
                await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
                return;
            }

            await sock.sendMessage(chatId, { 
                video: fs.readFileSync(fileName), 
                mimetype: "video/mp4",
                caption: '✅ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗗 𝗕𝗬 𝗞𝗡𝗜𝗚Hardware-BOT' 
            }, { quoted: message });

            await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });

            // Delete temporary file
            if (fs.existsSync(fileName)) {
                fs.unlinkSync(fileName);
            }
        });

    } catch (error) {
        console.error('Downloader Error:', error);
    }
}

module.exports = instagramCommand;
