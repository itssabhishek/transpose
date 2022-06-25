require('dotenv').config()
const express = require('express');
const { google, customsearch_v1 } = require('googleapis');

//This will create express router instance
const router = express.Router();
const customsearch = google.customsearch('v1');

/*
www.our-domain.com/search
    ?q=QueryString&
    start=ResultPageFromWhichYouWantToTakeResults&
    num=NumberOfResults(Cannot Exceed 10)
*/
router.get('/search', (req, res, next) => {
    const { q, start, num } = req.query;
    // console.log(q, start, num);
    // customsearch_v1.Resource$Cse$Siterestrict
    customsearch.cse.siterestrict.list({
        auth: process.env.GOOGLE_API_KEY,
        cx: process.env.SEARCH_ENGINE_ID,
        q, start, num,
    }).then(result => result.data)
    .then((result) => {
            const { queries, items, searchInformation } = result;

            const page = (queries.request || [])[0] || {};
            const previousPage = (queries.previousPage || [])[0] || {};
            const nextPage = (queries.nextPage || [])[0] || {};

             const data = {
                q,
                totalResults: page.totalResults,
                count: page.count,
                startIndex: page.startIndex,
                nextPage: nextPage.startIndex,
                previousPage: previousPage.startIndex,
                time: searchInformation.searchTime,
                items: items.map(o => ({
                    link: o.link,
                    title: o.title,
                    snippet: o.snippet
                }))
            }
            // res.status(200).send(result);
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });


})

module.exports = router;
