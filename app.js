var http = require('http')
  , exec = require('exec')
  , email = require('./emailUtil')
  , date = require('./date')

const PORT = 9988
  , PATH = '../html'

var deployServer = http.createServer(function(request, response) {
  const url = request.url.replace('/?url=', '')
  switch (url) {
    case 'up-build':
      var startTime = Date.now()
      var commands = [
        'cd /bookdata/guoyj/Up-h5',
        'git stash',
        'git checkout develop',
        'git pull',
        'sudo npm run build'
      ].join(' && ')

      exec(commands, function(err, out, code) {
        if (err instanceof Error || code) {
          let endTime = Date.now() - startTime + ' ms'

          response.writeHead(500)
          response.end(JSON.stringify({
            code: code,
            msg: err,
            time: endTime
          }))
          
          email.sendEmail('Up [release] ' + date.format(Date.now(), 'yyyy-MM-dd HH:mm:ss'), '打包失败，用时：' + endTime + '，错误信息：' + err).then(data => {
          }, err => {
          })
        } else {
          // process.stderr.write(err)
          // process.stdout.write(out)
          let endTime = Date.now() - startTime + ' ms'

          response.writeHead(200)
          response.end(JSON.stringify({
            code: code,
            msg: 'success',
            time: endTime
          }))

          email.sendEmail('Up [release] ' + date.format(Date.now(), 'yyyy-MM-dd HH:mm:ss'), '打包成功，用时：' + endTime).then(data => {
          }, err => {
          })
        }
      })


      break
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