# Gallery photos

Store photos in `image/YYYY/MM/`, for example `image/2026/01/2026-01-23.jpg`.
For several photos taken on the same day, use `2026-01-23-01.jpg`,
`2026-01-23-02.jpg`, and so on. Dates represent the day of the meal.

Run `node scripts/generate-timeline.js` from the repository root after adding photos.
It adds new photos to `data.json` and preserves existing captions, locations,
date ranges and reflections. Edit those details in `data.json`.
The existing GitHub Actions workflow also runs this command when photos change.

Food Diary opens with years, then months, then a chronological timeline with
notes on the left and photos on the right. My Kitchen offers the same archive
at `kitchen/archive.html`, alongside its shuffled film view. Each photo can
open a notebook with its existing reflections. The film template is
`templates/film.html`, and its controls are in `film-gallery.js`.

Each photo in `data.json` has `collection: "diary"` for eating out or
`collection: "kitchen"` for homemade food. Existing classifications and
reflections are preserved by the generator. New photos default to Kitchen;
set their collection to Diary when they document eating out.
