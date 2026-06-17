const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    const { file } = req.query;
    if (!file) {
        return res.status(400).send('ファイル名が指定されていません');
    }

    // セキュリティ: パストラバーサル対策
    const safeName = path.basename(file);
    const filePath = path.join(process.cwd(), 'public', 'dl', safeName);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('ファイルが見つかりません');
    }

    const stat = fs.statSync(filePath);
    res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(safeName)}"`,
        'Content-Length': stat.size,
    });
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
};
