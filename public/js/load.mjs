import { d3, arrays } from './helpers/index.mjs';
import * as render from './render/index.mjs';

async function onLoad () {
  /*
  Determine which page to load
  */
  const url = new URL(window.location);
  const { pathname, searchParams } = url;
  const path = pathname.split('/').filter(d => d !== '');
  let page = arrays.last.call(path);
  if (!page) page = 'about';
  let sort_by = searchParams.get('sort_by');
  if (!sort_by) sort_by = 'category';
  /*
  Get the data
  */
  const data = await d3.json(`/public/data/${page}.json`)
  .then(json => {
    return arrays.nest.call(json, { key: sort_by });
  }).catch(err => console.log(err));

  render.page(data, { path, page });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    onLoad();
  });
} else {
  (async () => {
    await onLoad();
  })();
}