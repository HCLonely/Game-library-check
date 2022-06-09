const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const epicJs = fs.readFileSync('./raw/Epic-Game-Library-Check.user.js', 'utf8');
babel.transform(epicJs, {}, (err, result) => {
  if (err) {
    return console.error('babel转换失败: ', err);
  }
  const userJsText = result.code;
  fs.writeFile('./Epic-Game-Library-Check.user.js', `/* eslint-disable no-void,no-func-assign,no-fallthrough,no-unsafe-finally,no-mixed-operators */\n${result.code}`, (error) => { // eslint-disable-line
    if (error) {
      return console.error('Epic-Game-Library-Check.user.js文件写入失败: ', error);
    }
    console.log('Epic-Game-Library-Check.user.js文件写入成功');
  });
  let userAllText = [...userJsText.matchAll(/\/\/ @require[\s]+?(https.+)/g)].map((e) => {
    const [fileName] = e[1].split('/').at(-1)
      .split('?');
    if (!fs.existsSync(path.join('resource', fileName))) {
      console.log('缺少文件', fileName);
      return '';
    }
    return fs.readFileSync(path.join('resource', fileName)).toString()
      .trim();
  }).join('\n') + userJsText;
  userAllText = userAllText.replace(/\/\/ @require[\s]+?(https.+)\n/g, '');
  [...userJsText.matchAll(/\/\/ @resource[\s]+?(.+?)[\s]+?(https.+)/g)].map((e) => {
    const [fileName] = e[2].split('/').at(-1)
      .split('?');
    if (!fs.existsSync(path.join('resource', fileName))) {
      console.log('缺少文件', fileName);
      return '';
    }
    userAllText = userAllText.replace(`GM_getResourceText('${e[1]}')`, `\`${fs.readFileSync(path.join('resource', fileName)).toString()
      .trim()}\``).replace(`${e[0]}\n`, '');
    return null;
  });
  fs.writeFile('./Epic-Game-Library-Check.all.user.js', userAllText, (error) => { // eslint-disable-line
    if (error) {
      return console.error('Epic-Game-Library-Check.all.user.js文件写入失败: ', error);
    }
    console.log('Epic-Game-Library-Check.all.user.js文件写入成功');
  });
});
