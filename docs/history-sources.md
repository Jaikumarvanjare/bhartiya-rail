# Indian Railway History Content

The **About** page (`/about`) presents educational content on the history of Indian Railways. It is separate from **My Trips** (`/dashboard`), which shows a user's booking history.

## Page

- Route: `/about` (legacy `/history` redirects here)
- Content: `client/src/data/railway-about.js`
- Styles: `client/src/styles/about.css`

## API note

`GET /api/v1/history` remains a short timeline for programmatic use. The About page uses curated static content for richer presentation.

## Sources

- Indian Railways overview: https://en.wikipedia.org/wiki/Indian_Railways
- Thane station and first passenger train: https://en.wikipedia.org/wiki/Thane_railway_station
- Great Indian Peninsula Railway: https://en.wikipedia.org/wiki/Great_Indian_Peninsula_Railway
- National Rail Museum: https://en.wikipedia.org/wiki/National_Rail_Museum,_New_Delhi

For production publishing, replace starter references with primary sources from Indian Railways, museum archives, and licensed historical material.
