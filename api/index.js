import * as cheerio from 'cheerio'

const $ = await cheerio.fromURL(`https://pta.trunojoyo.ac.id/c_search/byprod/10/1`)

const listItems = $('ul.items').children('li')

for (let j = 0; j < listItems.length; j++) {
    console.log(listItems[j])
}