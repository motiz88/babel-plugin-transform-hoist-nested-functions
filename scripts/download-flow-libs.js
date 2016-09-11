import request from 'request';
import path from 'path';
import fs from 'fs-promise';
import pkgBabelTypes from 'babel-types/package.json';

const {version} = pkgBabelTypes;

const files = [{
  url: `https://raw.githubusercontent.com/babel/babel/v${version}/lib/types.js`,
  file: path.resolve(__dirname, `../decls/babel/v${version}/types.js`)
}];

(async function() {
  for (const {url, file} of files) {
    if (!await fs.exists(file)) {
      process.stdout.write(`${url} --> ${path.relative(process.cwd(), file)}`);
      await fs.ensureDir(path.dirname(file));
      await new Promise((resolve, reject) => request(url)
        .pipe(fs.createWriteStream(file))
        .on('error', e => reject(e))
        .on('finish', () => {
          resolve();
        })
      );
    }
    process.stdout.write('\n');
  }
  process.stdout.write('\n');
})()
.catch(e => {
  throw e;
});
