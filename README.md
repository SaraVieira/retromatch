# Retro Match

<p align="center"><img src="https://github.com/SaraVieira/retromatch/assets/1051509/472f0abf-4745-42f8-99ea-37441ae0ecd1"></p>

## What is this?

Retro match is an native app to keep your roms in check.
You can add folders/SD cards and it will scrape your folders for roms and goes on the internet to find out what that rom is.

<details>
<summary>Want some images?</summary>
<br>
<img src="https://github.com/SaraVieira/retromatch/assets/1051509/472f0abf-4745-42f8-99ea-37441ae0ecd1" />
<img src="https://github.com/SaraVieira/retromatch/assets/1051509/1381bc4d-e518-4ef6-ae73-20aa1acdec7f" />
<img src="https://github.com/SaraVieira/retromatch/assets/1051509/01e6b97c-55a7-4dc4-9e40-655c5876f99f">
<img src="https://github.com/SaraVieira/retromatch/assets/1051509/5fe67c51-205f-4e14-ba7e-775e55cebe47">
</details>


## Development

To run this locally you need to first install dependencies and then run the dev mode with:

```sh
yarn && yarn dev
```

There are some environment variables you would need:

```
SS_USERNAME= # Your username in https://www.screenscraper.fr/
SS_PASSWORD= # screenscraper api key
RA_API_KEY= # https://retroachievements.org/ api key
```

### How to get a screenscraper API key?

You need to request it in: https://www.screenscraper.fr/forumsujets.php?frub=12&numpage=0
