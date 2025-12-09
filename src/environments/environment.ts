import * as CryptoJS from 'crypto-js';
export const environment = {
  production: false,
  environmentName: 'Localhost',
  CMSUrl: 'https://localhost:7242/CMS', 
  WebUrl: 'https://localhost:7242/Web', 
};


export const encryptionKey = CryptoJS.enc.Utf8.parse('4090909090909020');
export const encryptionIv = CryptoJS.enc.Utf8.parse('4090909090909020');


export const ExportExcelLogoCellMerge: string = "A1:A3";