# Localization Converter

A web application to convert Excel translation files to JSON format. Supports both App UI translations (separate files per language) and Backend translations (single file with both languages).

## Features

- 🎯 **Two conversion modes**:
  - **App UI**: Creates separate JSON files for each language (Turkish and English)
  - **Backend**: Creates a single JSON file containing both languages
- 📤 **Drag & Drop** file upload
- ⚡ **Instant conversion** and download
- 🎨 **Modern UI** with dark mode support
- 🚀 **Fast processing** with Next.js

## Usage

1. Visit the deployed application
2. Select conversion type (App UI or Backend)
3. Upload your Excel file:
   - For App UI: Use `General-App-UI-Translations.xlsx`
   - For Backend: Use `backendlocalization.xlsx`
4. Download the converted JSON file(s)

## Excel File Format

### App UI Format
Columns: `Key`, `HAS_LINKS`, `tr_TR`, `en_INT`, `tr_TR_Link_Text`, `tr_TR_Link_URL`, `en_INT_Link_Text`, `en_INT_Link_URL`

### Backend Format
Columns: `Key`, `en`, `tr`

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kkihtir/localization-tkpay)

Or manually:

```bash
npx vercel
```

## Tech Stack

- [Next.js 15](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [xlsx](https://www.npmjs.com/package/xlsx) for Excel processing

## License

MIT
