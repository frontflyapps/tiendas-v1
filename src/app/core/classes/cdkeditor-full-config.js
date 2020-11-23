let fullConfig = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'imageUpload',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      'undo',
      'redo',
      'alignment',
      'fontFamily',
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      'horizontalLine',
      'removeFormat',
      'underline',
      'highlight',
      'exportWord',
      'exportPdf',
      'codeBlock',
      'code'
    ]
  },
  language: 'es',
  image: {
    toolbar: [
      'imageStyle:full',
      'imageStyle:side',
      'imageStyle:alignLeft',
      'imageStyle:alignCenter',
      'imageStyle:alignRight',
      '|',
      'imageResize',
      '|',
      'imageTextAlternative'
    ],
    styles: [
      'full',
      'side',
      'alignLeft',
      'alignCenter',
      'alignRight'
    ],
    upload: {
      panel: {
        items: ['insertImageViaUrl']
      }
    },
    resizeOptions: [{
        name: 'imageResize:original',
        label: 'Original',
        value: null
      },
      {
        name: 'imageResize:50',
        label: '50%',
        value: '50'
      },
      {
        name: 'imageResize:75',
        label: '75%',
        value: '75'
      }
    ],
  },
  fontSize: {
    options: [
      9,
      10,
      11,
      12,
      13,
      'default',
      15,
      17,
      19,
      21,
      24,
      32
    ]
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellProperties',
      'tableProperties'
    ]
  },
  licenseKey: '',
}

let mediumConfig = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'imageUpload',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      'undo',
      'redo',
      'alignment',
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      'horizontalLine',
      'removeFormat',
    ]
  },
  language: 'es',
  image: {
    toolbar: [
      'imageTextAlternative',
      'imageStyle:full',
      'imageStyle:side'
    ]
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellProperties',
      'tableProperties'
    ]
  },
  licenseKey: '',
}
let basicConfig = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'imageUpload',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      'undo',
      'redo',
      'alignment',
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      'horizontalLine',
      'removeFormat',
    ]
  },
  language: 'es',
  image: {
    toolbar: [
      'imageStyle:full',
      'imageStyle:side',
      'imageStyle:alignLeft',
      'imageStyle:alignCenter',
      'imageStyle:alignRight',
      '|',
      'imageResize',
      '|',
      'imageTextAlternative'
    ],
    styles: [
      'full',
      'side',
      'alignLeft',
      'alignCenter',
      'alignRight'
    ],
    upload: {
      panel: {
        items: ['insertImageViaUrl']
      }
    },
    resizeOptions: [{
        name: 'imageResize:original',
        label: 'Original',
        value: null
      },
      {
        name: 'imageResize:50',
        label: '50%',
        value: '50'
      },
      {
        name: 'imageResize:75',
        label: '75%',
        value: '75'
      }
    ],
  },
  fontSize: {
    options: [
      9,
      10,
      11,
      12,
      13,
      'default',
      15,
      17,
      19,
      21,
      24,
      32
    ]
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellProperties',
      'tableProperties'
    ]
  },
  licenseKey: '',
}

module.exports = {
  cdkEditorFullConfig: fullConfig,
  cdkEditorMediumConfig: mediumConfig,
  cdkEditorBasicConfig: basicConfig
};
