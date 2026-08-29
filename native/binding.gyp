{
  "targets": [
    {
      "target_name": "supporter_addon",
      "sources": [
        "addon.cc",
        "markdown_engine.cpp",
        "cmark/cmark.c",
        "cmark/node.c",
        "cmark/iterator.c",
        "cmark/blocks.c",
        "cmark/inlines.c",
        "cmark/scanners.c",
        "cmark/utf8.c",
        "cmark/buffer.c",
        "cmark/references.c",
        "cmark/render.c",
        "cmark/html.c",
        "cmark/commonmark.c",
        "cmark/latex.c",
        "cmark/man.c",
        "cmark/xml.c",
        "cmark/cmark_ctype.c",
        "cmark/houdini_href_e.c",
        "cmark/houdini_html_e.c",
        "cmark/houdini_html_u.c"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")>",
        "../node_modules/node-addon-api",
        "cmark"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "msvs_settings": {
        "VCCLCompilerTool": {
          "ExceptionHandling": 1,
          "AdditionalOptions": [ "-std:c++17" ]
        }
      },
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS",
        "CMARK_STATIC_DEFINE"
      ]
    }
  ]
}
