# PMC Paper Finder
An Apify actor that searches PubMed Central for scientific papers matching your query and returns their titles, authors, journals, publication dates, and free full-text links.
Needs an apify account. 

### What does it do?
You give it a search query (e.g. insomnia) and optionally a publication year. It returns a list of matching papers with everything regarding the found papers, and a direct link to read it for free.

### Input 
query: required, your search query. Supports full PubMed syntax.
publication year: optional, filter by publication year.
ncbiApiKey: optional, free API key from NCBI. Increases rate limits. Obtainable at ncbi.nlm.nih.gov/account 

### Output 
Each result contains title, year, authors, journal, publication date, pmcId, and the url. 
Results are saved to Apify's Dataset and can be exported from the Apify console.

### Regarding the Query 
Using a broad query, e.g. "insomnia" may give you papers slightly related, as the PubMed search bar
It is possible to use field restrictions for more precise results: 

[title] the word must appear in the title 
[title/abstract] word must appear in title or abstract 
[MeSH Terms] official medical subject headings

### Limits 
Maximum 1000 results per run (NCBI API limit per request) 
Only returns papers indexed in PubMed Central (PMC)
