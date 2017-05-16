
const devApi = 'http://localhost:8000';
const prodApi = 'localhost:3000';
const staticApi = 'https://';

let exportApi;

if ('production' === ENV) {
  exportApi = prodApi;
} else {
  exportApi = devApi;
}

export const API_ROOT = exportApi;
export const STATIC_URL = staticApi;
