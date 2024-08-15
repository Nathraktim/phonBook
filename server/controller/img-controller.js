const path = require('path');

const img = async (req, res) => {
    const imgId = req.params.id;
    const imgPath = path.join(__dirname, `'../../../data/contactImg/${imgId}`);
    try {
    res.sendFile(imgPath);
    // res.send("done");
    } catch (err) {
        res.status(404).json({ message: 'Image not found' });
    }
}

module.exports = { img };