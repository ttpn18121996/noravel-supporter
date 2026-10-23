const { describe } = require('node:test');

const MarkdownService = require('../dist/native/MarkdownService').default;

const md = `
# Title

This is for **testing**

List:
- item 1
- item 2
`;

describe('it can convert the Markdown text to HTML', () => {
  const expectedWithoutMinify = `<h1>Title</h1>
<p>This is for <strong>testing</strong></p>
<p>List:</p>
<ul>
<li>item 1</li>
<li>item 2</li>
</ul>
`;

  const expectedWithMinify =
    '<h1>Title</h1> ' +
    '<p>This is for <strong>testing</strong></p> ' +
    '<p>List:</p> ' +
    '<ul> ' +
    '<li>item 1</li> ' +
    '<li>item 2</li> ' +
    '</ul> ';

  test('by syncMdToHtml', () => {
    const html = MarkdownService.syncMdToHtml(md);
    const htmlMinify = MarkdownService.syncMdToHtml(md, true);
    expect(html).toEqual(expectedWithoutMinify);
    expect(htmlMinify).toEqual(expectedWithMinify);
  });
  test('by mdToHtml', async () => {
    const html = await MarkdownService.mdToHtml(md);
    const htmlMinify = await MarkdownService.mdToHtml(md, true);
    expect(html).toEqual(expectedWithoutMinify);
    expect(htmlMinify).toEqual(expectedWithMinify);
  });
});
