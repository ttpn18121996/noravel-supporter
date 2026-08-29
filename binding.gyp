{
  "targets": [
    {
      "target_name": "supporter_addon",
      "sources": [
        "native/addon.cc",
        "native/markdown_engine.cpp",
        "native/cmark/cmark.c",
        "native/cmark/node.c",
        "native/cmark/iterator.c",
        "native/cmark/blocks.c",
        "native/cmark/inlines.c",
        "native/cmark/scanners.c",
        "native/cmark/utf8.c",
        "native/cmark/buffer.c",
        "native/cmark/references.c",
        "native/cmark/render.c",
        "native/cmark/html.c",
        "native/cmark/commonmark.c",
        "native/cmark/latex.c",
        "native/cmark/man.c",
        "native/cmark/xml.c",
        "native/cmark/cmark_ctype.c",
        "native/cmark/houdini_href_e.c",
        "native/cmark/houdini_html_e.c",
        "native/cmark/houdini_html_u.c"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "./node_modules/node-addon-api",
        "native/cmark"
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
