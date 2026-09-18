import { d3, strings, arrays, interaction } from '../helpers/index.mjs';

export const main = function (data, kwargs) {
  const { page, path } = kwargs || {};
  const main = d3.select('main');
  /*
  Highlight the appropriate navigation tab and add the breadcrumbs
  */
  d3.selectAll('header menu li a')
  .classed('active', function () {
    const content = this.textContent.trim().toLowerCase();
    return path.includes(content);
  });
  if (!d3.selectAll('header menu li a.active').size()) {
    /*
    If on the homepage, default to the first tab as active
    */
    d3.select('header menu li a').classed('active', true);
  }

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
      }).addElems('a')
        .attr('target', c => c.link ? '_blank' : null)
        .attr('href', c => {
          if (c.link) return c.link;
          else return null;
          // c.title ? `./${strings.makeSafe.call(c.title)}` : null
        });
      entries.addElems('label', 'year', c => c.year ? [{ year: c.year, type: c.type }] : [])
      .each(function (c) {
        const { type } = c || {};
        if (type === 'vignette') d3.select(this).classed('overlay', true)
      }).html(c => {
        const { year } = c || {};
        if (Array.isArray(year)) return `${year[0]} - ${arrays.last.call(year)}`;
        else return year;
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
        .html('Skills:');
      skills.addElems('div', 'chip', c => c)
        .html(c => strings.capitalize.call(c));
      const authors = tags.addElems('div', 'authors', c => c.authors?.length ? [c.authors] : []);
      authors.addElems('label')
        .html(c => `Author${c.length > 1 ? 's' : ''}:`);
      authors.addElems('div', 'chip', c => c)
        .attr('title', c => strings.capitalize.call(c))
        .html(c => c);
      const publisher = tags.addElems('div', 'publisher', c => c.publisher ? [c.publisher] : []);
      publisher.addElems('label')
        .html('Publisher:');
      publisher.addElems('div', 'chip')
        .attr('title', c => strings.capitalize.call(c))
        .html(c => c);
    }
  });

  interaction.setScrollAnimations(d3.selectAll('h2.category').nodes())
  interaction.setScrollAnimations(d3.selectAll('div.vignette').nodes())
}