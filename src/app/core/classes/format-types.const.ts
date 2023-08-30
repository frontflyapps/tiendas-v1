export const FORMAT_TYPES: any[] = [
  // { id: 'audio', name: 'Audio', icon: 'audiotrack' },
  // { id: 'video', name: 'Video', icon: 'play_circle' },
  { id: 'image', name: 'Imagen', icon: 'image' },
  // { id: 'pdf', name: 'Pdf/eBook', icon: 'picture_as_pdf' },
  // { id: 'file', name: 'Otro tipo de Archivo', icon: 'file_copy' },
];

export const FORMAT_ACCEPTED = {
  // audio: 'audio/*',
  // video: 'video/*',
  image: 'image/*',
  // pdf: '.pdf, .ebook, .epub,.pub, .doc, .docx, .xls, .xlsx',
  // file: '*/*',
};

export type DOCUMENTS_REGISTRATION = 'ci' | 'onat' | 'tcp' | 'bank';
export const ACCEPTED_FORMAT = '.jpg, .jpeg, .png';
