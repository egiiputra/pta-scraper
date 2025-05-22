import Fastify from 'fastify'
import * as cheerio from 'cheerio'

const fastify = Fastify({
  logger: true
})
await fastify.register(import('@fastify/swagger'), {
  mode: 'static',
  specification: {
    path: './docs/openapi.json'
  },
  exposeRoute: true
})

await fastify.register(import('@fastify/swagger-ui'), {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
  transformSpecificationClone: true
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

const prodToNumber = {
  'ilmu-hukum': 1,
  'magister-ilmu-hukum': 24,
  'teknologi-industri-pertanian': 2,
  'agribisnis': 3,
  'agroteknologi': 4,
  'ilmu-kelautan': 5,
  'manajemen-sumberdaya-perairan': 35,
  'magister-pengelolaan-sda': 37,
  'ekonomi-pembangunan': 6,
  'manajemen': 7,
  'akuntansi': 8,
  'd3-akuntansi': 21,
  'magister-manajemen': 22,
  'magister-akuntansi': 25,
  'd3-enterpreneurship': 26,
  'magister-ilmu-ekonomi': 36,
  'teknik-industri': 9,
  'teknik-informatika': 10,
  'manajemen-informatika': 11,
  'teknik-multimedia-dan-jaringan': 19,
  'mekatronika': 20,
  'teknik-elektro': 23,
  'teknik-mekatronika': 33,
  'sosiologi': 12,
  'ilmu-komunikasi': 13,
  'psikologi': 14,
  'sastra-inggris': 15,
  'ekonomi-syariah':16,
  'hukum-bisnis-syariah': 17,
  'pgsd': 18,
  'pendidikan-bahasa-indonesia': 27,
  'pendidikan-informatika': 28,
  'pendidikan-ipa': 29,
  'pgpaud': 30,
}

fastify.get('/journals/:path', async function handler (request, reply) {
  const path = request.params.path
  let searchBy, code
  if (facultiesToNumber.hasOwnProperty(path)) {
    searchBy = 'byfac'
    code = facultiesToNumber[path]
  } else if (prodToNumber.hasOwnProperty(path)) {
    searchBy = 'byprod'
    code = prodToNumber[path]
  } else {
    reply
      .code(404)
      .send({ message: 'faculty or prodi not found'})

    return
  }

  const startPage = request.query.startPage ?? 1
  const endPage = request.query.endPage ?? startPage
  const includeAbstract = request.query.includeAbstract === 'true'

  let results = []
  for (let i = startPage; i <= endPage; i++) {
    console.log('page', i)
    const $ = await cheerio.fromURL(`https://pta.trunojoyo.ac.id/c_search/${searchBy}/${code}/${i}`)

    const listItems = $('ul.items').children('li')

    for (let j = 0; j < listItems.length; j++) {
      const authors = $(listItems[j]).find('div > span').map((i, el) => {
        return $(el).text().split(/\s*:\s*/)[1]
      }).toArray()

      let data = {
        judul: $(listItems[j]).find('a.title').text(),
        penulis: authors[0],
        pembimbing1: authors[1],
        pembimbing2: authors[2],
        detailLink: $(listItems[j]).find('a.button').prop('href'),
      }

      if (includeAbstract) {
        const $ = await cheerio.fromURL(data.detailLink)
        const paragraphs = $('p[align=justify]').contents()

        data.abstraksi = paragraphs[0].data
        data.abstract = paragraphs[1].data
        results.push(data)
      } else {
        results.push(data)
      }
    }
  }

  return results
})

// Run the server!
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}