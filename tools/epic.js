const fs = require('fs');
const babel = require('@babel/core');

const epicJs = fs.readFileSync('./raw/Epic-Game-Library-Check.user.js', 'utf8');
babel.transform(epicJs, {}, (err, result) => {
  if (err) {
    return console.error('babel转换失败: ', err);
  }
  fs.writeFile('./Epic-Game-Library-Check.user.js', `/* eslint-disable no-void,no-func-assign,no-fallthrough,no-unsafe-finally,no-mixed-operators */\n${result.code}`, (error) => { // eslint-disable-line
    if (error) {
      return console.error('Epic-Game-Library-Check.user.js文件写入失败: ', error);
    }
    console.log('Epic-Game-Library-Check.user.js文件写入成功');
  });
});
