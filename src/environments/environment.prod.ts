import * as CryptoJS from 'crypto-js';

export const environment = {
  production: true,
  environmentName: '100.82.237.11',
  CMSUrl: 'http://100.82.237.11:5000/CMS',
  WebUrl: 'http://100.82.237.11:5000',
};

export const encryptionKey = CryptoJS.enc.Utf8.parse('4090909090909020');
export const encryptionIv = CryptoJS.enc.Utf8.parse('4090909090909020');

export const ExportExcelLogoCellMerge: string = "A1:A3";