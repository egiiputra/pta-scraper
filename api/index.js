import * as cheerio from 'cheerio'


const facultiesToNumber = {
fh: 1,
fp: 2,
feb: 3,
ft: 4,
fisib: 5,
fkis: 6,
fkip: 7,
}

const faculty = 'fh'
const $ = await cheerio.fromURL(`https://pta.trunojoyo.ac.id/c_search/byfac/${facultiesToNumber[faculty]}`);

// console.log($)
// exit()
const listItems = $('ul.items').children('li')

listItems.each((index, item) => {
    if (index == 0) {
        console.log($(item).find('a.title').text())
        const authors = $(item).find('div > span').map((i, el) => {
            return $(el).text().split(/\s*:\s*/)[1]
        }).toArray()
        console.log(authors[0])
        console.log(typeof authors)
        console.log($(item).find('a.button').prop('href'))
    }
})