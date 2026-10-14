# TwitchAutoReward

Automatic clicker to redeem channel points rewards on twitch.tv. Built for Tampermonkey.

## What the script does

### 1. Automatically claims specified channel points rewards

The script automatically clicks on the rewards you specify, which the streamer has set up for channel points. You
configure a list of the rewards you want in advance, and the script will redeem them as soon as you have enough points.

**Example**: automatically subscribing to Lunites in Wuthering Waves from streamers who have set this up as a channel
points reward.

### 2. Automatically queues a playlist through channel points rewards

The script automatically queues your playlist through the streamer's channel points reward (usually "Song Request" / "
Play this playlist").

You load a list of track links, and the script submits them one by one through the reward whenever you have enough
points.

#### Support next export playlists for YouTube

* [playlistlengthcalc.com](https://www.playlistlengthcalc.com/youtube-playlist-link-extractor) - only `txt` (or
  `copy all`)
* [scriptmind.co](https://scriptmind.co/youtube-playlist-exporter) - only `json` format

> Both tools only work with public playlists. Private, deleted, or region-locked videos may be skipped.

_Also support if you paste URLs split by ","_

## Installation

1. Install a userscript manager for your browser:
	* [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Edge, Firefox, Safari, Opera)
	* [Violentmonkey](https://violentmonkey.github.io/) (alternative)
2. Open the Tampermonkey dashboard and go to the Utilities tab.
3. Either:
	* Install the script from a URL (e.g. from GitHub Raw / Greasy Fork), or
	* Create a new script and paste the script code manually, then save (Ctrl+S).
4. Make sure the script is enabled in the Tampermonkey dashboard.
5. Open [twitch.tv](https://twitch.tv/) and go to any channel you want to automate.
6. The script's control panel should appear on the page in the bottom chat.

> Note: If the panel does not appear, refresh the page. Twitch is a single-page app, so after navigating between
> channels
> you may need to reload once for the script to re-inject.
