import Fastify from 'fastify'
import * as cheerio from 'cheerio'
import { writeFileSync } from 'node:fs'

const fastify = Fastify({
  logger: true
})

const facultiesToNumber = {
  fh: 1,
  fp: 2,
  feb: 3,
  ft: 4,
  fisib: 5,
  fkis: 6,
  fkip: 7,
}

fastify.get('/faculty/:faculty', async function handler (request, reply) {
  const faculty = request.params.faculty
  if (!facultiesToNumber.hasOwnProperty(faculty)) {
    reply
      .code(404)
      .send({ message: 'facutly not found'})

    return
  }

  const $ = await cheerio.fromURL(`https://pta.trunojoyo.ac.id/c_search/byfac/${facultiesToNumber[faculty]}`)


  const listItems = $('ul.items').children('li')

  let results = []
  listItems.each((index, item) => {
    const authors = $(item).find('div > span').map((i, el) => {
      return $(el).text().split(/\s*:\s*/)[1]
    }).toArray()
    console.log(authors)

    results.push({
      judul: $(item).find('a.title').text(),
      penulis: authors[0],
      pembimbing1: authors[1],
      pembimbing2: authors[2],
      detailLink: $(item).find('a.button').prop('href'),
    })
  })
  console.log(results)

  return results
})

// Run the server!
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}