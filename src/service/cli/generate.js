'use strict';

const fs = require(`fs`);
const {getRandomInt, shuffle} = require(`../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const MAX_COUNT = 1000;
const MAX_DAY_CREATE = 90;

const {TITLES, DESCRIPTIONS, CATEGORIES} = require(`./testData.js`);

const getRandomDate = () => {
  const day = 24 * 3600 * 1000;
  const today = Date.now();
  const dateCreate = day * getRandomInt(0, MAX_DAY_CREATE);

  return new Date(today - dateCreate);
};

const createRandomOffer = () => {
  const offer = {
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    createdDate: getRandomDate(),
    announce: shuffle(DESCRIPTIONS).slice(0, getRandomInt(1, 5)).join(` `),
    fullText: shuffle(DESCRIPTIONS).slice(0, getRandomInt(1, DESCRIPTIONS.length - 1)).join(` `),
    сategory: Array(getRandomInt(1, 3)).fill(``)
    .map(() => CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)])
    .reduce((acc, it) => !acc.includes(it) ? [...acc, it] : acc, []),
  };
  return offer;
};

const generateOffers = (amount) => Array(amount).fill({}).map(() => createRandomOffer());

module.exports = {
  name: `--generate`,
  run(args) {
    const amount = args;
    const offerCount = Number.parseInt(amount, 10) || DEFAULT_COUNT;

    if (offerCount > MAX_COUNT) {
      console.log(`Не больше 1000 объявлений`);
      return;
    }
    const content = JSON.stringify(generateOffers(offerCount));

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        return console.error(`Can't write data to file...`);
      }
      return console.log(`Operation success. File created.`);
    });
  },
};
