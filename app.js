var http = require('http')
  , exec = require('exec')
  , email = require('./emailUtil')
  , date = require('./date')

const PORT = 9988
  , PATH = '../html'

function fnExec(commands){
  return new Promise((resolve, reject) => {
    exec(commands, function (err, out, code){
      if (err instanceof Error || code) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
var deployServer = http.createServer(function(request, response) {
  const url = request.url.replace('/?url=', '')
  switch (url) {
    case 'up-build':
      response.writeHead(200)
      response.end('Success')
      var commands = [
        'cd /bookdata/guoyj/Up-h5',
        'git stash',
        'git checkout develop',
        'git pull'
      ].join(' && ')
      fnExec(commands).then(() => {
        let startTime = Date.now()
        fnExec('cd /bookdata/guoyj/Up-h5 && npm run build').then(() => {
          let endTime = Date.now() - startTime + ' ms'
          email.sendEmail('Up [release] ' + date.format(Date.now(), 'yyyy-MM-dd HH:mm:ss'), '打包成功，用时：' + endTime).then(data => {
          }, err => {
          })
        }, err => {

          email.sendEmail('Up [release] ' + date.format(Date.now(), 'yyyy-MM-dd HH:mm:ss'), '打包失败，错误信息：' + err).then(data => {
          }, err => {
          })
        })
      }, err => {

        email.sendEmail('Up [release] ' + date.format(Date.now(), 'yyyy-MM-dd HH:mm:ss'), '打包失败，错误信息：' + err).then(data => {
        }, err => {
        })
      })
      // exec(commands, function(err, out, code) {
      //   var endTime = Date.now() - startTime + ' ms'
      //   if (err instanceof Error || code) {
      //     var endTime = Date.now() - startTime + ' ms'
      //     email.sendEmail('Up [release] ' + date.format(Date.now(), 'yyyy-MM-dd HH:mm:ss'), '打包失败，用时：' + endTime + '，错误信息：' + err).then(data => {
      //     }, err => {
      //     })
      //   } else {
      //     exec('npm run build', function (){

      //     })
      //     var endTime = Date.now() - startTime + ' ms'

      //     email.sendEmail('Up [release] ' + date.format(Date.now(), 'yyyy-MM-dd HH:mm:ss'), '打包成功，用时：' + endTime).then(data => {
      //     }, err => {
      //     })
      //   }
      // })


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