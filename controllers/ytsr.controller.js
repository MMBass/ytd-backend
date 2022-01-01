const ytsr = require('ytsr');

const { customCutString } = require('../utils');

const search = async function (req, res) {
    try {
        req.query.type = req.query.type[0].toUpperCase() + req.query.type.substring(1) //ytsr type must be fLCapital
        let resultType = req.query.type || 'Video';
        const filters1 = await ytsr.getFilters(req.query.term);
        const filter1 = filters1.get('Type').get(resultType);
        const searchResults = await ytsr(filter1.url);
        const items = [];

        for (i of searchResults.items) {
            if(i.type !== 'video') console.log(i.type)
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