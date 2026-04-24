import { d3, strings, arrays } from '../helpers/index.mjs';

export const main = function (data, kwargs) {
  const { page, path } = kwargs || {};
  const main = d3.select('main');
  /*
  Highlight the appropriate navigation tab and add the breadcrumbs
  */
  d3.selectAll('header menu li a')
  .classed('active', function () {
    return path.includes(this.textContent.trim().toLowerCase());
  });

  /* 
  Add the page title
  */
  const title_section = main.addElems('section', 'title-section', [[null, page]])
    .addElems('div', 'two-col');
  title_section.addElems('div', null, d => d)
    .addElems('h1', null, d => d ? [d] : [])
    .html(d => strings.capitalize.call(d));

  const content_sections = main.addElems('section', 'content-section', data);
  content_sections.addElems('div', 'two-col', d => [[
    { type: 'key', data: [d.key] }, 
    { type: 'values', data: d.values }
  ]]).addElems('div', null, d => d)
  .each(function (d) {
    const { type, data } = d || {};
    const sel = d3.select(this)

    if (type === 'key' && data) {
      sel.addElems('h2', 'category', data?.filter(d => d).length ? data : [])
        .html(d => d);
    } else if (type === 'values') {
      /* 
      This is where the main content pages are populated
      */
      const types = [...new Set((data || []).map(c => c.type))];
      if (types.length) sel.classed(`${types[0]}s`, true);

      const entries = sel.addElems('div', null, data)
      .each(function (c) {
        const _sel = d3.select(this);
        _sel.classed(c.type, true)
      })
      // .addElems('a')
        // .attr('href', c => c.title ? `./${strings.makeSafe.call(c.title)}` : null);
      entries.addElems('label', 'year', c => c.year ? [c.year] : [])
      .html(c => {
        if (Array.isArray(c)) return `${c[0]} - ${arrays.last.call(c)}`;
        else return c;
      });
      entries.addElems('div', 'img-container', c => c.vignette?.length ? [c.vignette] : [])
      .addElems('img')
        .attr('src', c => c);
      entries.addElems('p', 'title', c => c.title?.length ? [c.title] : [])
        .html(c => c);
      entries.addElems('p', 'description', c => c.description?.length ? [{ description: c.description, type: c.type }] : [])
        .classed('lead', c => c.type === 'paragraph')
        .html(c => c.description);
      const tags = entries.addElems('div', 'tags');
      const organizations = tags.addElems('div', 'organizations', c => c.organizations?.length ? [c.organizations] : []);
      organizations.addElems('label')
        .html(c => `Organization${c.length > 1 ? 's' : ''}:`);
      organizations.addElems('div', 'chip', c => c)
        .attr('title', c => strings.capitalize.call(c))
        .html(c => {
          return c.length < 18 ? strings.capitalize.call(c) : `${strings.capitalize.call(c.slice(0, 18))}…`
        });
      const contributions = tags.addElems('div', 'contributions', c => c.contributions?.length ? [c.contributions] : []);
      contributions.addElems('label')
        .html('Roles and contributions:');
      contributions.addElems('div', 'chip', c => c)
        .html(c => strings.capitalize.call(c));
      const skills = tags.addElems('div', 'skills', c => c.skills?.length ? [c.skills] : []);
      skills.addElems('label')
        .html('Skills:')
      skills.addElems('div', 'chip', c => c)
        .html(c => strings.capitalize.call(c))
    }
  });
}