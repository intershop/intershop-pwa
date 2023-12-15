export class File {
  title: string;
  description: string;
  file: FileContent;
}

class FileContent {
  contentType: string;
  fileName: string;
  url: string;
}
