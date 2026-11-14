const fs = require('fs');

const directoryName = '_recipes';

const dir = fs.opendirSync(directoryName);
let file;
while ((dirent = dir.readSync()) !== null) {
   const filePath = `${directoryName}/${dirent.name}`;
   let data = fs.readFileSync(filePath);
   const fd = fs.openSync(filePath, 'w+')

   const h1Finder = /^#(?!#)(.*)/gm;
   const h1s = h1Finder.exec(data);
   let title = "Title";
   if (h1s !== null) {
      title = h1s[0].slice(2);

      let dataStr = data.toString();
      dataStr = dataStr.replace(h1Finder, '');
      data = Buffer.from(dataStr);
   }

   const insert = Buffer.from(`---\nlayout: recipe\ntitle: ${title}\n---\n`);

   fs.writeSync(fd, insert, 0, insert.length, 0)
   fs.writeSync(fd, data, 0, data.length, insert.length)

   fs.close(fd, (err) => {
      if (err) throw err;
   });
}
dir.closeSync();
