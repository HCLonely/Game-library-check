const fs = require('fs')
const babel = require('@babel/core')

const itchJs = fs.readFileSync('./raw/Itch-Game-Library-Check.user.js', 'utf8')
babel.transform(itchJs, {}, function (err, result) {
  if (err) {
    return console.error('babel转换失败: ', err)
  }
  fs.writeFile('./Itch-Game-Library-Check.user.js', '/* eslint-disable no-void,no-func-assign,no-fallthrough,no-unsafe-finally,no-mixed-operators */\n' + result.code, function (error) {
    if (error) {
      return console.error('Itch-Game-Library-Check.user.js文件写入失败: ', error)
    }
    console.log('Itch-Game-Library-Check.user.js文件写入成功')
  })
})
