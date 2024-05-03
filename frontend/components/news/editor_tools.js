
import Checklist from "@editorjs/checklist";
import Paragraph from "@editorjs/paragraph";
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";
import Header from "@editorjs/header"
import editorjsNestedChecklist from '@calumk/editorjs-nested-checklist';
import Underline from '@editorjs/underline';
import Strikethrough from '@sotaproject/strikethrough';
import Marker from '@editorjs/marker';
import ImageTool from '@editorjs/image';
import fileUpload from "@/lib/fileUpload";
import AttachesTool from '@editorjs/attaches';
import Table from '@editorjs/table'
import { types } from "util";

const AlignmentTuneTool = require('editorjs-text-alignment-blocktune');

export const EDITOR_TOOLS = {
  header: {
    class: Header,
    config: {
      placeholder: 'Enter a header',
      levels: [2, 3, 4],
      defaultLevel: 2
    },
    inlineToolbar: true,
    tunes: ['anyTuneName'],
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
  nestedchecklist: {
    class: editorjsNestedChecklist,
    inlineToolbar: true,
  },
  underline: Underline,
  strikethrough: Strikethrough,
  Marker: {
    class: Marker,
    shortcut: 'CMD+SHIFT+M',
  },
  embed: {
    class: Embed,
    config: {
      services: {
        youtube: true,
        facebook: true,
        instagram: true,
      }
    },
    inlineToolbar: true,
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: 'Enter a quote',
      captionPlaceholder: 'Quote\'s author',
    },
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    tunes: ['anyTuneName'],
  },
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
    },
  },
  anyTuneName: {
    class: AlignmentTuneTool,
  },
  image: {
    class: ImageTool,
    config: {
      types: "image/png, image/jpg, image/jpeg, image/gif, image/svg",
      uploader: {
        async uploadByFile(file) {
          const formData = new FormData()
          formData.append("file", file)

          const fileRes = await fileUpload(formData)

          if (!(
            fileRes.hasOwnProperty("response") &&
            fileRes.response.hasOwnProperty("data") &&
            fileRes.response.data.hasOwnProperty("message") &&
            fileRes.response.data.hasOwnProperty("status")
          ) && !(fileRes.hasOwnProperty("code") && fileRes.code.includes("ERR"))) {
            return {
              success: 1,
              file: {
                url: fileRes.file
              }
            };
          }
        }
      }
    }
  },
  attaches: {
    class: AttachesTool,
    config: {
      types: "application/pdf, application/doc, application/docx, application/csv, application/xls, application/xlsx",
      uploader: {
        async uploadByFile(file) {
          const formData = new FormData()
          formData.append("file", file)

          const fileRes = await fileUpload(formData)

          console.log(fileRes)

          if (!(
            fileRes.hasOwnProperty("response") &&
            fileRes.response.hasOwnProperty("data") &&
            fileRes.response.data.hasOwnProperty("message") &&
            fileRes.response.data.hasOwnProperty("status")
          ) && !(fileRes.hasOwnProperty("code") && fileRes.code.includes("ERR"))) {
            console.log(file.name)
            return {
              success: 1,
              file: {
                url: fileRes.file,
                extension: getFileExtension(fileRes.file),
                name: file.name,
                size: file.size
              }
            };
          } else {
            return {
              success: 0,
              file: {
                url: ""
              }
            };
          }
        }
      }
    },
  }
};

function getFileExtension(url) {
  const queryStartIndex = url.indexOf('?alt=media');

  if (queryStartIndex === -1) {
    return null;
  }

  const lastDotIndex = url.lastIndexOf('.', queryStartIndex);

  if (lastDotIndex === -1) {
    return null;
  }

  return url.substring(lastDotIndex + 1, queryStartIndex);
}