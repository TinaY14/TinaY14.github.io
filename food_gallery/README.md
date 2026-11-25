# Gallery photos

Store photos in `image/YYYY/MM/`, for example `image/2026/01/2026-01-23.jpg`.
For several photos taken on the same day, use `2026-01-23-01.jpg`,
`2026-01-23-02.jpg`, and so on. Dates represent the day of the meal.

Run `node scripts/generate-timeline.js` from the repository root after adding photos.
It adds new photos to `data.json` and preserves existing captions, locations,
date ranges and reflections. Edit those details in `data.json`.
The existing GitHub Actions workflow also runs this command when photos change.

The gallery opens with years, then months, then the selected month's timeline.
Entries with a custom date range are filed under the month of their first photo.
