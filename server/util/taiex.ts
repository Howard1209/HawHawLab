import axios from 'axios';
import { load } from 'cheerio';
import pool from '../models/databasePool.js';

const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
const insertDate = [20230701];
// [20211101, 20220101, 20220201, 20220301, 20220401, 20220501, 20220601, 20220701, 20220801, 20220901,
// 20221001, 20221101, 20221201, 20230101, 20230201, 20230301, 20230401, 20230501, 20230601, 20230701];

function insertData(url: string) {
  axios.get(url)
  .then(async response => {
    const html = response.data;
    const $ = load(html);
    const tbody = $('tbody');
    const data: (string | number)[][] = [];

    tbody.find('tr').each((index, element) => {
      const tdElements = $(element).find('td');
      const date = $(tdElements[0]).text().split('/');
      const formattedDate = `${parseInt(date[0], 10) + 1911}-${date[1]}-${date[2]}`;
      const open = parseInt($(tdElements[1]).text().replace(',', ''), 10);
      const high = parseInt($(tdElements[2]).text().replace(',', ''), 10);
      const low = parseInt($(tdElements[3]).text().replace(',', ''), 10);
      const close = parseInt($(tdElements[4]).text().replace(',', ''), 10);

      data.push([formattedDate, open, high, low, close]);
    });

    await pool.query(`INSERT INTO taiex (date, open, high, low, close) VALUES ?`,[data]);

    console.log('done');
  })
  .catch(error => {
    console.log(error);
  });
}

for (const date of insertDate) {
  const url = `https://www.twse.com.tw/rwd/zh/TAIEX/MI_5MINS_HIST?date=${date}&response=html`;
  insertData(url);
}
