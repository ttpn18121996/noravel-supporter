import addon from './addon';

export default class MarkdownService {
  /**
   * Convert the Markdown text to HTML asynchronously.
   * @param md The markdown text
   * @param {boolean} minify default false
   * @returns {Promise<string>}
   */
  public static async mdToHtml(md: any, minify: boolean = false): Promise<string> {
    const input = new String(md);
    return addon.mdToHtml(input.toString(), minify);
  }

  /**
   * Convert the Markdown text to HTML.
   * @param md The markdown text
   * @param {boolean} minify default false
   * @returns {string}
   */
  public static syncMdToHtml(md: any, minify: boolean = false): string {
    const input = new String(md);
    return addon.syncMdToHtml(input.toString(), minify);
  }
}
