const dotenv = require('dotenv');
dotenv.config();

// ----------------------
// Search YouTube videos
// ----------------------
const searchYtSong = async (req, res) => {
    const { q } = req.query;
    console.log("Searching YouTube for:", q);

    const API_KEY = process.env.YOUTUBE_KEY2;
    if (!API_KEY) {
        console.error("API Key missing");
        return res.status(500).json({ error: 'API Key not configured' });
    }

    if (!q) {
        return res.status(400).json({ error: 'Missing search query' });
    }

    const maxResults = 20;
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&q=${encodeURIComponent(q)}&maxResults=${maxResults}&type=video`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();

        if (!response.ok) {
            console.error("YouTube API Error:", data);
            return res.status(response.status).json({ error: data.error || 'YouTube API error' });
        }

        // Make it frontend-friendly
        const videos = data.items.map(item => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            channel: item.snippet.channelTitle,
        }));

        res.json({ results: videos });
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ error: 'Failed to fetch from YouTube' });
    }
};

// ----------------------
// Download song by videoId
// ----------------------
const downloadSong = async (req, res) => {
    const { id } = req.query; // ✅ use query, not params
    console.log("Downloading YouTube video:", id);

    if (!id) {
        return res.status(400).json({ error: 'Missing video id' });
    }

    const url = `https://youtube-mp36.p.rapidapi.com/dl?id=${id}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_KEY,
                'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
            },
        });
        const data = await response.json();

        if (!response.ok) {
            console.error("Download API Error:", data);
            return res.status(response.status).json({ error: data.error || 'Download API error' });
        }

        res.json(data);
    } catch (err) {
        console.error("Download Error:", err);
        res.status(500).json({ error: 'Failed to fetch download link' });
    }
};

module.exports = { searchYtSong, downloadSong };
