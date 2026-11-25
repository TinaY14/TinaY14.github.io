# Gallery photos

Store photos in `image/YYYY/MM/`, for example `image/2026/01/2026-01-23.jpg`.
For several photos taken on the same day, use `2026-01-23-01.jpg`,
`2026-01-23-02.jpg`, and so on. Dates represent the day of the meal.

Run `node scripts/generate-timeline.js` from the repository root after adding photos.
It adds new photos to `data.json` and preserves existing captions, locations,
date ranges and reflections. Edit those details in `data.json`.
The existing GitHub Actions workflow also runs this command when photos change.

The gallery shows two full-width film strips moving in opposite directions.
Use Year and Month to filter the photos. Each image keeps its original aspect
ratio and opens a notebook with its existing reflections. Pause, speed, drag,
and scroll controls are implemented in `film-gallery.js`.

Each photo in `data.json` has `collection: "diary"` for eating out or
`collection: "kitchen"` for homemade food. Existing classifications and
reflections are preserved by the generator. New photos default to Kitchen;
set their collection to Diary when they document eating out.
