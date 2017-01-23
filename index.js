const retext = require('retext')
const contractions = require('retext-contractions')
const simplify = require('retext-simplify')
const diacritics = require('retext-diacritics')
const equality = require('retext-equality')
const indefiniteArticle = require('retext-indefinite-article')
const passive = require('retext-passive')
const profanities = require('retext-profanities')
const redundantAcronyms = require('retext-redundant-acronyms')
const repeatedWords = require('retext-repeated-words')
const overuse = require('retext-overuse')
const usage = require('retext-usage')
const readability = require('retext-readability')
const spell = require('retext-spell')
const dictionary = require('dictionary-en-gb')
const { send, json } = require('micro')

const microCors = require('micro-cors')
const cors = microCors({ allowMethods: ['PUT', 'POST'] })

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
        messageContents.location = message.location
        messageContents.fatal = message.fatal
        messageContents.source = message.source

        return messageContents
      })

      callback( result )
    })
}

const proofReadService = async ( request, response ) => {
    const data = await json(request)

    proofRead( data.content, ( result ) => {
      send( response, 200, JSON.stringify(result))
    })
}

module.exports = cors(proofReadService)
