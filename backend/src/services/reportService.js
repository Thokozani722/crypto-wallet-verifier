const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

const generateCsvReport = (wallet, txs) => {
  const parser = new Parser({
    fields: ['hash', 'direction', 'amount', 'currency', 'counterparty', 'status', 'timestamp'],
  });
  const csv = parser.parse(txs);
  return {
    filename: `${wallet.label}-report.csv`,
    mime: 'text/csv',
    buffer: Buffer.from(csv, 'utf-8'),
  };
};

const generatePdfReport = (wallet, txs) => {
  const doc = new PDFDocument({ margin: 40 });
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));

  doc.fontSize(18).text('CryptoGuard Wallet Report', { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(`Wallet: ${wallet.label}`);
  doc.text(`Address: ${wallet.address}`);
  doc.text(`Generated: ${new Date().toISOString()}`);
  doc.moveDown();

  txs.forEach((tx) => {
    doc.text(`Txn ${tx.hash}`);
    doc.text(`  Direction: ${tx.direction.toUpperCase()}  Amount: ${tx.amount} ${tx.currency}`);
    doc.text(`  Counterparty: ${tx.counterparty}`);
    doc.text(`  Status: ${tx.status}  Timestamp: ${tx.timestamp}`);
    doc.moveDown(0.5);
  });

  doc.end();
  const buffer = Buffer.concat(chunks);
  return {
    filename: `${wallet.label}-report.pdf`,
    mime: 'application/pdf',
    buffer,
  };
};

const generateReport = (wallet, txs, format = 'csv') => {
  if (format === 'pdf') {
    return generatePdfReport(wallet, txs);
  }
  return generateCsvReport(wallet, txs);
};

module.exports = {
  generateReport,
};
