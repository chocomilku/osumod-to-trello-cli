# osumod-to-trello-cli

tool to scrape cards from osumod to a trello board list

## why

- why not

- for archiving mod requests purposes

- able to provide more options than the options found at osumod

- able to add self pick maps

## todo

- [x] enter self pick maps using osu api

- [ ] gui web app version

- [ ] cooler command line

- [ ] implement oauth trello **automatically using express**

- [ ] implement selecting trello board, list, and labels

- [x] create the scraper first dumbass

- [ ] display what is going on **beautifully**

- [x] use cheerio to navigate around the scraped html

- [x] send the cards to the trello board

- [x] filter out ~~non-pending~~ a certain card with a specific status maps

- [x] add options to scraper

- [x] add `M4M` label for M4M mod type

- [x] add config file instead of relying on .env file

- [ ] add startup file to fill up the config file

## .env configuration

```
KEY=TRELLOAPIKEY
TOKEN=TRELLOAPITOKEN
IDLIST=IDLIST
OSU_CLIENTID=CLIENTID
OSU_CLIENTSECRET=CLIENTSECRET
```

`KEY` is your Trello api key

`TOKEN` is your token. basically your authorization.

`IDLIST` is the id of the list that the cards are going to

`OSU_CLIENTID` your client id from osu oauth application

`OSU_CLIENTSECRET` your client secret from osu oauth application

## config.json configuration

```json
{
	"username": "chocomilku-",
	"trello": {
		"request": "requestlabel",
		"m4m": "m4mlabel",
		"self_pick": "selfpicklabel"
	}
}
```

`username` your username on osu and osumod

`request` id of the label for the "request" request from your trello board

`m4m` id of the label for the "M4M" request from your trello board

`self_pick` id of the label for the "Self Pick" request from your trello board

&copy; 2022 chocomilku
