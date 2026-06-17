const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    // Vercel では public ディレクトリは process.cwd() + '/public' に存在
    const dlDir = path.join(process.cwd(), 'public', 'dl');

    try {
        // ディレクトリが存在しない場合は空配列を返す
        if (!fs.existsSync(dlDir)) {
            return res.status(200).json([]);
        }

        const files = fs.readdirSync(dlDir);
        const fileInfos = files.map(name => {
            const filePath = path.join(dlDir, name);
            const stats = fs.statSync(filePath);
            // ファイルのみ（ディレクトリは除外）
            if (!stats.isFile()) return null;
            return {
                name: name,
                size: stats.size,
                modified: stats.mtimeMs,
            };
        }).filter(Boolean);

        // 名前順にソート
        fileInfos.sort((a, b) => a.name.localeCompare(b.name));
        res.status(200).json(fileInfos);
    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
