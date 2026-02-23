import { Actor } from 'apify';

await Actor.init();

const input = await Actor.getInput();

if (!input?.query) throw new Error('Input field "query" is required.');

const query = input.query;
const year = input.year || null;
const ncbiApiKey = input.ncbiApiKey || '';

const searchUrl = new URL('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi');
searchUrl.searchParams.set('db', 'pmc');
const term = year ? `${query} AND ${year}[pdat]` : query;
searchUrl.searchParams.set('term', term);
searchUrl.searchParams.set('retmax', '1000');
searchUrl.searchParams.set('retmode', 'json');
if (ncbiApiKey) searchUrl.searchParams.set('api_key', ncbiApiKey);

const searchRes = await fetch(searchUrl);
const searchData = await searchRes.json();
const ids = searchData.esearchresult.idlist;

console.log(`Found ${ids.length} papers`);

const dataset = await Actor.openDataset();
const batchSize = 100;

for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize).join(',');
    const summaryUrl = new URL('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi');
    summaryUrl.searchParams.set('db', 'pmc');
    summaryUrl.searchParams.set('id', batch);
    summaryUrl.searchParams.set('retmode', 'json');
    if (ncbiApiKey) summaryUrl.searchParams.set('api_key', ncbiApiKey);

    const summaryRes = await fetch(summaryUrl);
    const summaryData = await summaryRes.json();

    for (const [uid, doc] of Object.entries(summaryData.result)) {
        if (uid === 'uids') continue;
        await dataset.pushData({
            title: doc.title,
            authors: doc.authors?.map(a => a.name).join(', '),
            journal: doc.fulljournalname,
            pubDate: doc.pubdate,
            pmcId: uid,
            url: `https://www.ncbi.nlm.nih.gov/pmc/articles/PMC${uid}/`,
        });
    }
}

await Actor.exit();