const retext = require('retext')
const contractions = require('./retext-plugins/retext-contractions')
const simplify = require('./retext-plugins/retext-simplify')
const diacritics = require('./retext-plugins/retext-diacritics')
const equality = require('./retext-plugins/retext-equality')
const indefiniteArticle = require('./retext-plugins/retext-indefinite-article')
const passive = require('./retext-plugins/retext-passive')
const profanities = require('./retext-plugins/retext-profanities')
const redundantAcronyms = require('./retext-plugins/retext-redundant-acronyms')
const repeatedWords = require('./retext-plugins/retext-repeated-words')
const overuse = require('./retext-plugins/retext-overuse')
const usage = require('./retext-plugins/retext-usage')
const readability = require('./retext-plugins/retext-readability')
const spell = require('./retext-plugins/retext-spell')
const dictionary = require('dictionary-en-gb')
const { send, json } = require('micro')

const microCors = require('micro-cors')

const proofRead = ( theString, callback ) => {
  let output

  return retext()
    .use( retext )
    .use( contractions )
    .use( simplify )
    .use( diacritics )
    .use( equality )
    .use( indefiniteArticle )
    .use( passive )
    .use( profanities )
    .use( redundantAcronyms )
    .use( repeatedWords )
    .use( overuse )
    .use( usage )
    .use( readability )
    .use( spell, dictionary )
    .process( theString, function ( err, file ) {

      const result = file.messages.map( message => {
        let messageContents = {}

        messageContents.offending = message.offending
        messageContents.suggestion = message.suggestion
        messageContents.source = message.source

        return messageContents
      })

      callback( result )
    })

}

const proofReadService = ( request, response ) => {
  console.log(request)

   return async function() {
  //   console.log(Object.keys(request))
    //console.log('request:', request.url, request.method)
    const data = await json(request)
    console.log("DATA", data);
    send( response, 200, 'hello world 👏')
  }
}

const bigString = 'You can aggregate a shorter word. You does\'nt know me! Beyonce. His network was set up with a master and slave. He should, a 8-year old boy, should have arrived a hour. That movie was amazing. He was withheld while we were being fed. He’s pretty set on beating your butt for sheriff. Where can I find an ATM machine? Well, it it doesn\'t have to to be. The constellation also contains an isolated neutron star—Calvera—and H1504+65 the hottest white dwarf yet discovered, with a surface temperature of 200,000 kelvin. This is majorly inappropriate.  Triangulate as less as possible. That movie was amazing. The acting was amazing. The story was amazing.'

proofRead(bigString, ( result ) => {
  // console.log('send this to the people:', result)
})


setTimeout(() => {
  console.time('how_long?')
  proofRead(bigString, ( result ) => {
    // console.log('send this to the people:', result)
  })
  console.timeEnd('how_long?')
}, 3000)

const cors = microCors({ allowMethods: ['PUT', 'POST'] })
module.exports = cors(proofReadService)
