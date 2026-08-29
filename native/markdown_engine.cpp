#include <string>
#include <algorithm>
#include "cmark.h"

// Hàm xử lý minify chuỗi HTML cơ bản
std::string minifyHtml(const std::string& html) {
    std::string result;
    result.reserve(html.size());
    bool in_space = false;

    for (char c : html) {
        if (c == '\n' || c == '\r' || c == '\t' || c == ' ') {
            if (!in_space) {
                result += ' ';
                in_space = true;
            }
        } else {
            result += c;
            in_space = false;
        }
    }
    return result;
}

// Cập nhật hàm render Markdown nhận thêm cờ minify
std::string RenderMarkdownToHtml(const std::string& markdown, bool minify = false) {
    char* html_c = cmark_markdown_to_html(markdown.c_str(), markdown.length(), CMARK_OPT_DEFAULT);
    std::string html(html_c);
    free(html_c);

    if (minify) {
        return minifyHtml(html);
    }
    return html;
}
