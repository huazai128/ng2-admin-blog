
const devApi = 'http://localhost:8080';
const prodApi = 'http://localhost:8080';
const staticApi = 'http://localhost:8080';

let exportApi;

if ('production' === ENV) {
  exportApi = prodApi;
} else {
  exportApi = devApi;
}

export const API_ROOT = exportApi;
export const STATIC_URL = staticApi;
