import pdfParse from 'pdf-parse';

export const pdfParserService = {
  async extractText(buffer) {
    const pageTexts = [];

    const options = {
      pagerender: (pageData) => {
        return pageData.getTextContent().then((textContent) => {
          let lastY, text = '';
          for (const item of textContent.items) {
            if (lastY === item.transform[5] || !lastY) {
              text += item.str + ' ';
            } else {
              text += '\n' + item.str + ' ';
            }
            lastY = item.transform[5];
          }
          pageTexts.push({
            pageNumber: pageData.pageIndex + 1,
            text: text.trim()
          });
          return text;
        });
      }
    };

    const data = await pdfParse(buffer, options);

    return {
      text: data.text,
      pageCount: data.numpages || pageTexts.length || 1,
      pages: pageTexts.length ? pageTexts : [{ pageNumber: 1, text: data.text }]
    };
  }
};
