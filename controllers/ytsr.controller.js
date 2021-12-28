const ytsr = require('ytsr');

const { customCutString } = require('../utils');

const search = async function (req, res) {
    try {
        let resultType = 'Video' || req.query.type;
        const filters1 = await ytsr.getFilters(req.query.term);
        const filter1 = filters1.get('Type').get(resultType);
        const searchResults = await ytsr(filter1.url);
        const items = [];

        for (i of searchResults.items) {
            i = {
                id: i.id,
                thumbnail: i.bestThumbnail.url,
                channelName: i.author.name,
                title: customCutString(i.title, 65, '...'), // cut the title if too long
                longTitle: i.title,
            }
            items.push(i);
        }

        res.send(items);

    } catch (e) {
        console.log(e);
    }
}

module.exports = { search };