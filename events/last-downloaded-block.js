"use strict";

const fs = require("fs");

const enumerable = require("linq");

const Parameters = require("../parameters").get();

const { promisify } = require("util");
const readdirAsync = promisify(fs.readdir);
const folderExistsAsync = promisify(fs.exists);

module.exports.get = async contractAddress => {
  const downloadFolder = Parameters.eventsDownloadFolder.replace("{token}", contractAddress);

  if (!(await folderExistsAsync(downloadFolder))) {
    return 0;
  }
  const files = await readdirAsync(downloadFolder);
  if (files.length == 0)
    return 0;

  return enumerable
    .from(files)
    .select(x => {
      return parseInt(x.replace(".json", "")) || 0;
    })
    .max(x => x);
};
