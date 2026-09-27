import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';

/**
 * Converts HTML content from the editor into a real DOCX file and triggers download
 */
export async function exportToDocx(htmlContent: string, fileName = 'Document.docx') {
  // Parse HTML into a temporary DOM element
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const body = doc.body;

  const docxChildren: any[] = [];

  // Helper to extract text runs from an element with bold/italic styles
  function processInlineNodes(node: Node): TextRun[] {
    const runs: TextRun[] = [];
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent || '';
        if (text) {
          runs.push(new TextRun({ text }));
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        const tag = el.tagName.toLowerCase();
        const text = el.textContent || '';
        if (!text) return;

        const isBold = tag === 'strong' || tag === 'b' || el.style.fontWeight === 'bold';
        const isItalic = tag === 'em' || tag === 'i' || el.style.fontStyle === 'italic';
        const isUnderline = tag === 'u' || el.style.textDecoration?.includes('underline');
        const isStrike = tag === 's' || tag === 'strike' || tag === 'del';

        runs.push(
          new TextRun({
            text,
            bold: isBold,
            italics: isItalic,
            underline: isUnderline ? {} : undefined,
            strike: isStrike,
          })
        );
      }
    });
    return runs.length > 0 ? runs : [new TextRun({ text: node.textContent || '' })];
  }

  // Iterate top-level DOM nodes
  Array.from(body.children).forEach((el) => {
    const tag = el.tagName.toLowerCase();

    if (tag === 'h1') {
      docxChildren.push(
        new Paragraph({
          text: el.textContent || '',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 },
        })
      );
    } else if (tag === 'h2') {
      docxChildren.push(
        new Paragraph({
          text: el.textContent || '',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );
    } else if (tag === 'h3') {
      docxChildren.push(
        new Paragraph({
          text: el.textContent || '',
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 160, after: 80 },
        })
      );
    } else if (tag === 'ul' || tag === 'ol') {
      Array.from(el.children).forEach((li) => {
        docxChildren.push(
          new Paragraph({
            children: processInlineNodes(li),
            bullet: { level: 0 },
            spacing: { after: 80 },
          })
        );
      });
    } else if (tag === 'blockquote') {
      docxChildren.push(
        new Paragraph({
          children: processInlineNodes(el),
          indent: { left: 720 },
          spacing: { before: 120, after: 120 },
        })
      );
    } else if (tag === 'table') {
      const rows: TableRow[] = [];
      const trElements = Array.from(el.querySelectorAll('tr'));
      trElements.forEach((tr) => {
        const cells: TableCell[] = [];
        const tdThElements = Array.from(tr.children);
        tdThElements.forEach((cell) => {
          cells.push(
            new TableCell({
              children: [
                new Paragraph({
                  children: processInlineNodes(cell),
                }),
              ],
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: 'cbd5e1' },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: 'cbd5e1' },
                left: { style: BorderStyle.SINGLE, size: 1, color: 'cbd5e1' },
                right: { style: BorderStyle.SINGLE, size: 1, color: 'cbd5e1' },
              },
            })
          );
        });
        if (cells.length > 0) {
          rows.push(new TableRow({ children: cells }));
        }
      });

      if (rows.length > 0) {
        docxChildren.push(
          new Table({
            rows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          })
        );
      }
    } else {
      // Standard paragraph
      docxChildren.push(
        new Paragraph({
          children: processInlineNodes(el),
          spacing: { after: 120 },
        })
      );
    }
  });

  if (docxChildren.length === 0) {
    docxChildren.push(new Paragraph({ text: body.textContent || 'Empty Document' }));
  }

  const docxDoc = new Document({
    sections: [
      {
        properties: {},
        children: docxChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(docxDoc);
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = fileName.endsWith('.docx') ? fileName : `${fileName}.docx`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}

/**
 * Converts editor HTML to standard Markdown format
 */
export function exportToMarkdown(htmlContent: string, fileName = 'Document.md') {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const body = doc.body;

  let markdown = '';

  function nodeToMd(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const inner = Array.from(el.childNodes).map(nodeToMd).join('');

      switch (tag) {
        case 'h1':
          return `# ${inner}\n\n`;
        case 'h2':
          return `## ${inner}\n\n`;
        case 'h3':
          return `### ${inner}\n\n`;
        case 'strong':
        case 'b':
          return `**${inner}**`;
        case 'em':
        case 'i':
          return `*${inner}*`;
        case 'u':
          return `<u>${inner}</u>`;
        case 's':
        case 'strike':
          return `~~${inner}~~`;
        case 'p':
          return `${inner}\n\n`;
        case 'blockquote':
          return `> ${inner.trim()}\n\n`;
        case 'ul':
          return Array.from(el.children)
            .map((li) => `- ${Array.from(li.childNodes).map(nodeToMd).join('')}`)
            .join('\n') + '\n\n';
        case 'ol':
          return Array.from(el.children)
            .map((li, idx) => `${idx + 1}. ${Array.from(li.childNodes).map(nodeToMd).join('')}`)
            .join('\n') + '\n\n';
        case 'a':
          return `[${inner}](${el.getAttribute('href') || '#'})`;
        case 'code':
          return `\`${inner}\``;
        case 'pre':
          return `\`\`\`\n${inner}\n\`\`\`\n\n`;
        case 'hr':
          return `---\n\n`;
        case 'br':
          return `\n`;
        case 'table':
          const rows = Array.from(el.querySelectorAll('tr'));
          if (rows.length === 0) return '';
          let tableMd = '';
          rows.forEach((tr, rowIdx) => {
            const cells = Array.from(tr.children).map((c) =>
              c.textContent?.trim().replace(/\|/g, '\\|') || ''
            );
            tableMd += `| ${cells.join(' | ')} |\n`;
            if (rowIdx === 0) {
              tableMd += `| ${cells.map(() => '---').join(' | ')} |\n`;
            }
          });
          return tableMd + '\n';
        default:
          return inner;
      }
    }
    return '';
  }

  Array.from(body.childNodes).forEach((child) => {
    markdown += nodeToMd(child);
  });

  const blob = new Blob([markdown.trim()], { type: 'text/markdown;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = fileName.endsWith('.md') ? fileName : `${fileName}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

/**
 * Triggers native high-resolution vector PDF export via Print
 */
export function exportToPDF() {
  window.print();
}

/**
 * Exports HTML directly
 */
export function exportToHTML(htmlContent: string, fileName = 'Document.html') {
  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${fileName}</title>
  <style>
    body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; color: #1e293b; }
    h1 { font-size: 2rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
    h2 { font-size: 1.5rem; margin-top: 24px; }
    blockquote { border-left: 4px solid #3b82f6; padding-left: 16px; font-style: italic; color: #475569; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f8fafc; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.html') ? fileName : `${fileName}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export as Plain text (.txt)
 */
export function exportToPlainText(htmlContent: string, fileName = 'Document.txt') {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const text = doc.body.textContent || '';
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Reads an uploaded file and converts to HTML string
 */
export async function importFileToHTML(file: File): Promise<{ title: string; html: string }> {
  const fileName = file.name;
  const extension = fileName.split('.').pop()?.toLowerCase();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;

      if (extension === 'html' || extension === 'htm') {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        resolve({
          title: fileName,
          html: doc.body.innerHTML || content,
        });
      } else if (extension === 'md' || extension === 'markdown') {
        // Simple Markdown to HTML parser
        const lines = content.split('\n');
        let html = '';
        let inList = false;

        lines.forEach((line) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('# ')) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<h1>${trimmed.slice(2)}</h1>`;
          } else if (trimmed.startsWith('## ')) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<h2>${trimmed.slice(3)}</h2>`;
          } else if (trimmed.startsWith('### ')) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<h3>${trimmed.slice(4)}</h3>`;
          } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            if (!inList) { html += '<ul>'; inList = true; }
            html += `<li>${trimmed.slice(2)}</li>`;
          } else if (trimmed.startsWith('> ')) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<blockquote>${trimmed.slice(2)}</blockquote>`;
          } else if (trimmed.length > 0) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<p>${trimmed}</p>`;
          }
        });
        if (inList) html += '</ul>';

        resolve({ title: fileName, html: html || `<p>${content}</p>` });
      } else {
        // Plain text
        const paragraphs = content
          .split(/\n\s*\n/)
          .filter(Boolean)
          .map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`)
          .join('');
        resolve({
          title: fileName,
          html: paragraphs || `<p>${content}</p>`,
        });
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));

    reader.readAsText(file);
  });
}
