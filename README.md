# osumod-to-trello-cli

tool to scrape cards from osumod to a trello board list

## why

- why not

- for archiving cards purposes

- able to provide more options than the 3 options found at osumod

- able to add self pick maps (wip)

## todo

- [ ] enter self pick maps using osu api

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

- [ ] add `M4M` label for M4M mod type

- [ ] release a npm package of the scraper + data processing thing only with GNU license

- [ ] implement user input

## .env configuration

```
KEY=TRELLOAPIKEY
TOKEN=TRELLOAPITOKEN
IDLIST=IDLIST
IDLABEL=IDLABEL
```

`KEY` is your Trello api key

`TOKEN` is your token. basically your authorization.

`IDLIST` is the id of the list that the cards are going to

`IDLABEL` is the id of the label to be attached to the cards

tutorial wip

&copy; 2022 chocomilku
