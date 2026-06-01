const fs = require('fs');
// const path = require('path');
const babel = require('@babel/core');

const mergedJs = fs.readFileSync('./raw/Game-Library-Check.user.js', 'utf8');
babel.transform(mergedJs, {}, (err, result) => {
  if (err) {
    return console.error('babel转换失败: ', err);
  }
  const userJsText = result.code;
  fs.writeFile('./Game-Library-Check.user.js', userJsText, (error) => { // eslint-disable-line
    if (error) {
      return console.error('Game-Library-Check.user.js文件写入失败: ', error);
    }
    console.log('Game-Library-Check.user.js文件写入成功');
  });
});
