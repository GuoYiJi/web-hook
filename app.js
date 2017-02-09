var http = require('http')
  , exec = require('exec')

const PORT = 9988
  , PATH = '../html'

var deployServer = http.createServer(function(request, response) {
  const url = request.url.replace('/?url=', '')
  switch (url) {
    case 'test-demo':
      var commands = [
        'cd /bookdata/guoyj/test-demo',
        'git pull origin master'
      ].join(' && ')

      exec(commands, function(err, out, code) {
        if (err instanceof Error) {
          response.writeHead(500)
          response.end('Server Internal Error.')
          throw err
        }
        process.stderr.write(err)
        process.stdout.write(out)
        response.writeHead(200)
        response.end('Build Done.')
      })
      break
    default:
      response.writeHead(404)
      response.end('Not Found.')
  }
  // if (request.url.search(/deploy\/?$/i) > 0) {

  //   var commands = [
  //     'cd ' + PATH,
  //     'git pull'
  //   ].join(' && ')

  //   exec(commands, function(err, out, code) {
  //     if (err instanceof Error) {
  //       response.writeHead(500)
  //       response.end('Server Internal Error.')
  //       throw err
  //     }
  //     process.stderr.write(err)
  //     process.stdout.write(out)
  //     response.writeHead(200)
  //     response.end('Deploy Done.')

  //   })

  // } else {

  // }
})

deployServer.listen(PORT)