import { Injectable } from '@angular/core';
import { ToolCategory } from '../models/tool-category';
import { Tool } from '../models/tool';

@Injectable({
  providedIn: 'root'
})
export class ToolConfigService {

  // Separate categories list
  private readonly categories: ToolCategory[] = [
    { name: 'Trading Tools', order: 1 },
    { name: 'Career Tools', order: 2 },
    { name: 'PDF Tools', order: 3 },
    { name: 'Image Tools', order: 4 },
    { name: 'Calculator Tools', order: 5 },
    { name: 'Developer Tools', order: 6 },
    { name: 'Utility Tools', order: 7 },
    { name: 'Other Tools', order: 8 },
  ];

  // Flat list of all tools
  private readonly tools: Tool[] = [


    { 
      id: 'gann-hexagonal-sr-calculator',
      name: 'GANN Hexagonal Support & Resistance Calculator',
      description: 'Calculate dynamic support and resistance levels using GANN\'s mathematical ratios.',
      longDescription: 'Use GANN\'s mathematical ratios to identify potential support and resistance levels for your trading strategy.',
      buttonText: 'Calculate Levels',
      route: '/gann-hexagonal-support-resistance-calculator',
      category: 'Trading Tools',
      seo: {
        title: 'Free GANN Hexagonal Support & Resistance Calculator | GANN Calculator | ToolTrove',
        metaDescription: 'Calculate dynamic support and resistance levels using GANN\'s mathematical ratios.',
        keywords: ['GANN calculator', 'support level', 'resistance level', 'trading tools', 'technical analysis', 'GANN hexagonal calculator', 'GANN support resistance', 'free GANN calculator', 'GANN levels calculator', 'GANN price levels'],
        h1: 'GANN Hexagonal Support & Resistance Calculator',
        h2: 'Calculate Dynamic Support and Resistance Levels',
        faqs: [
          { question: 'How to use the GANN Calculator?', answer: 'Enter the current market price and click "Calculate Levels" to see the dynamic support and resistance levels.' },
          { question: 'What are GANN levels?', answer: 'GANN levels are dynamic support and resistance levels calculated using W.D. GANN\'s mathematical ratios.' }
        ]
      }
    },
    // // Career Tools
    { 
      id: 'resume',
      name: 'Resume Builder',
      description: 'Create professional resumes',
      longDescription: 'Build ATS-friendly resumes with customizable layouts, live preview, and export options to stand out to recruiters.',
      buttonText: 'Build Resume',
      route: '/resume-builder',
      icon: 'resume-builder.png',
      iconAlt: 'Resume Builder',
      category: 'Career Tools',
      seo: {
        title: 'Free Resume Builder Online | Create ATS-Friendly Resumes | ToolTrove',
        metaDescription: 'Create professional resumes online for free with our AI-powered resume builder. Choose from ATS-friendly templates, customize layouts, and download in PDF. Perfect for job seekers and career changers.',
        keywords: ['resume builder', 'free resume maker', 'create resume online', 'ATS friendly resume', 'professional resume template', 'job resume builder', 'CV maker free', 'resume generator', 'online resume creator', 'career resume builder', 'job application resume', 'hire resume builder'],
        h1: 'Free Online Resume Builder',
        h2: 'Create ATS-Friendly Resumes That Get Noticed',
        faqs: [
          { question: 'How to create a professional resume for free?', answer: 'Simply fill in your personal information, work experience, education, and skills. Our resume builder automatically formats your resume professionally and generates an ATS-friendly PDF that you can download instantly.' },
          { question: 'Are the resumes ATS-friendly?', answer: 'Yes! Our resume templates are specifically designed to pass Applicant Tracking Systems (ATS). We use standard formatting, proper heading structure, and clean layouts that ATS software can easily parse and read.' },
          { question: 'Can I download my resume in PDF format?', answer: 'Absolutely! You can download your completed resume as a high-quality PDF file at any time. The PDF maintains all formatting and is ready to send to employers or upload to job portals.' },
          { question: 'Do I need registration to use the resume builder?', answer: 'No registration is required. Our resume builder is completely free to use with no hidden charges. Your data stays private and is processed entirely in your browser.' },
          { question: 'What resume templates are available?', answer: 'We offer multiple professional templates including Modern designs for creative industries and ATS-Optimized formats for traditional corporate applications. You can switch templates anytime.' }
        ]
      }
    },
    // { 
    //   id: 'cover-letter',
    //   name: 'Cover Letter Generator',
    //   description: 'Generate cover letters',
    //   longDescription: 'Create personalized and impactful cover letters tailored to job roles in seconds.',
    //   buttonText: 'Generate Letter',
    //   route: '/cover-letter',
    //   category: 'Career Tools',
    //   seo: {
    //     title: 'Free Cover Letter Generator | Create Professional Cover Letters | ToolTrove',
    //     metaDescription: 'Generate professional cover letters online for free. Create personalized cover letters tailored to job applications. No registration required. Instant download.',
    //     keywords: ['cover letter generator', 'free cover letter maker', 'create cover letter online', 'professional cover letter', 'job application letter', 'cover letter templates', 'cover letter creator', 'application letter generator'],
    //     h1: 'Free Online Cover Letter Generator',
    //     h2: 'Create Professional Cover Letters Instantly',
    //     faqs: [
    //       { question: 'How to create a cover letter for free?', answer: 'Simply enter your personal details, the job information, and our generator will create a professional cover letter tailored to your application.' },
    //       { question: 'Are cover letters really free?', answer: 'Yes! Our cover letter generator is completely free to use with no registration required.' },
    //       { question: 'Can I edit my cover letter after generating?', answer: 'Yes! You can edit and customize your cover letter before downloading it in PDF or Word format.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'ats-checker',
    //   name: 'ATS Resume Checker',
    //   description: 'Check ATS compatibility',
    //   longDescription: 'Analyze your resume for ATS compatibility and improve keyword optimization and formatting.',
    //   buttonText: 'Check Resume',
    //   route: '/ats-checker',
    //   category: 'Career Tools',
    //   seo: {
    //     title: 'Free ATS Resume Checker | Test Resume for Applicant Tracking Systems | ToolTrove',
    //     metaDescription: 'Check your resume for ATS compatibility. Analyze keyword optimization, formatting, and get tips to improve your resume for applicant tracking systems. Free online tool.',
    //     keywords: ['ATS resume checker', 'resume ATS test', 'applicant tracking system checker', 'resume keyword analyzer', 'ATS compatible resume', 'resume screening tool', 'ATS resume test'],
    //     h1: 'Free ATS Resume Checker',
    //     h2: 'Test Your Resume for Applicant Tracking Systems',
    //     faqs: [
    //       { question: 'What is an ATS resume checker?', answer: 'An ATS checker analyzes your resume to ensure it can be read and parsed properly by applicant tracking systems used by employers.' },
    //       { question: 'How does the ATS checker work?', answer: 'Our tool scans your resume for formatting issues, keyword density, and structure that may affect how ATS software reads your document.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'job-description',
    //   name: 'Job Description Generator',
    //   description: 'Create job descriptions',
    //   longDescription: 'Generate clear, structured, and professional job descriptions for hiring or understanding roles.',
    //   buttonText: 'Create JD',
    //   route: '/job-description',
    //   category: 'Career Tools',
    //   seo: {
    //     title: 'Free Job Description Generator | Create Professional Job Postings | ToolTrove',
    //     metaDescription: 'Generate professional job descriptions online for free. Create clear and structured job postings for hiring. No registration required.',
    //     keywords: ['job description generator', 'create job description', 'job posting generator', 'professional job description', 'HR job description', 'hiring description template'],
    //     h1: 'Free Job Description Generator',
    //     h2: 'Create Professional Job Postings',
    //     faqs: [
    //       { question: 'How to create a job description?', answer: 'Enter the job title, responsibilities, requirements, and our generator will create a professional job description for you.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'portfolio-builder',
    //   name: 'Portfolio Builder',
    //   description: 'Create personal portfolio',
    //   longDescription: 'Build a modern personal portfolio website to showcase your projects and achievements.',
    //   buttonText: 'Build Portfolio',
    //   route: '/portfolio-builder',
    //   category: 'Career Tools',
    //   seo: {
    //     title: 'Free Portfolio Builder | Create Personal Portfolio Website | ToolTrove',
    //     metaDescription: 'Build a professional portfolio website to showcase your work. Create a stunning personal portfolio with our free online builder.',
    //     keywords: ['portfolio builder', 'create portfolio website', 'personal portfolio generator', 'free portfolio maker', 'artist portfolio', 'photographer portfolio', 'designer portfolio'],
    //     h1: 'Free Portfolio Builder',
    //     h2: 'Create Your Personal Portfolio Website',
    //     faqs: [
    //       { question: 'How to create a portfolio website?', answer: 'Add your projects, images, and descriptions. Our builder will generate a beautiful portfolio website you can share.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'salary-calculator',
    //   name: 'Salary Calculator',
    //   description: 'Estimate salary breakdown',
    //   longDescription: 'Calculate salary breakdown including taxes, deductions, and net income instantly.',
    //   buttonText: 'Calculate Salary',
    //   route: '/salary-calculator',
    //   category: 'Career Tools',
    //   seo: {
    //     title: 'Free Salary Calculator | Calculate Net Salary & Take Home Pay | ToolTrove',
    //     metaDescription: 'Calculate your salary breakdown including taxes, deductions, and net income. Free online salary calculator with detailed breakdown.',
    //     keywords: ['salary calculator', 'net salary calculator', 'take home pay calculator', 'salary breakdown calculator', 'after tax calculator', 'income tax calculator'],
    //     h1: 'Free Salary Calculator',
    //     h2: 'Calculate Your Net Salary & Deductions',
    //     faqs: [
    //       { question: 'How to calculate net salary?', answer: 'Enter your gross salary, and our calculator will estimate taxes, deductions, and your take-home pay.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'interview-questions',
    //   name: 'Interview Questions',
    //   description: 'Generate interview questions',
    //   longDescription: 'Prepare for interviews with curated and AI-generated questions across domains.',
    //   buttonText: 'Practice Now',
    //   route: '/interview-questions',
    //   category: 'Career Tools',
    //   seo: {
    //     title: 'Free Interview Questions Generator | Prepare for Job Interviews | ToolTrove',
    //     metaDescription: 'Generate interview questions to prepare for job interviews. Practice with common and behavioral interview questions for any position.',
    //     keywords: ['interview questions generator', 'job interview questions', 'behavioral interview questions', 'common interview questions', 'interview preparation', 'practice interview questions'],
    //     h1: 'Free Interview Questions Generator',
    //     h2: 'Prepare for Your Job Interview',
    //     faqs: [
    //       { question: 'How to use the interview questions generator?', answer: 'Select the job type or industry, and get curated interview questions to practice.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'skill-analyzer',
    //   name: 'Skill Analyzer',
    //   description: 'Analyze your skills',
    //   longDescription: 'Evaluate your skills and identify strengths and improvement areas for career growth.',
    //   buttonText: 'Analyze Skills',
    //   route: '/skill-analyzer',
    //   category: 'Career Tools',
    //   seo: {
    //     title: 'Free Skill Analyzer | Evaluate Your Skills for Career Growth | ToolTrove',
    //     metaDescription: 'Analyze your professional skills and get insights on strengths and areas for improvement. Free online skill assessment tool.',
    //     keywords: ['skill analyzer', 'skills assessment tool', 'career skill evaluation', 'strengths and weaknesses analysis', 'skill test', 'professional skills assessment'],
    //     h1: 'Free Skill Analyzer',
    //     h2: 'Evaluate Your Skills & Career Potential',
    //     faqs: [
    //       { question: 'How does skill analyzer work?', answer: 'Answer questions about your skills and experience to get a comprehensive analysis of your strengths and areas for improvement.' }
    //     ]
    //   }
    // },

    // // PDF Tools
    { 
      id: 'merge-pdf',
      name: 'Merge PDF',
      description: 'Combine multiple PDFs',
      longDescription: 'Merge multiple PDF files into one document quickly and securely.',
      buttonText: 'Merge Now',
      route: '/merge-pdf',
      icon: 'merge-pdf.png',
      iconAlt: 'Merge PDF',
      category: 'PDF Tools',
      seo: {
        title: 'Free PDF Merger Online | Combine PDF Files | ToolTrove',
        metaDescription: 'Merge multiple PDF files into one document instantly with our free online PDF merger. Drag & drop to combine PDFs, reorder pages, and download your merged file. No registration required.',
        keywords: ['merge PDF', 'combine PDF files', 'join PDFs', 'PDF merger free', 'online PDF merge', 'concatenate PDFs', 'free PDF joiner', 'merge PDF documents', 'combine PDF online', 'PDF combine tool', 'join PDF files', 'merge PDF pages'],
        h1: 'Free Online PDF Merger',
        h2: 'Combine PDF Files Instantly & Securely',
        faqs: [
          { question: 'How to merge PDF files online for free?', answer: 'Simply drag and drop your PDF files into our merge tool, arrange them in your desired order by dragging, and click merge. Your combined PDF will be ready to download in seconds.' },
          { question: 'Is it safe to merge PDFs online?', answer: 'Yes! Our PDF merger processes everything in your browser. Your files never leave your device, ensuring complete privacy and security. No data is uploaded to any server.' },
          { question: 'How many PDF files can I merge at once?', answer: 'You can merge unlimited PDF files in a single session. Simply add as many files as you need and arrange them in the order you want them combined.' },
          { question: 'Can I select specific pages to merge?', answer: 'Yes! Our advanced page selection feature lets you choose exactly which pages from each PDF you want to include in your merged document.' },
          { question: 'Do I need to install any software?', answer: 'No software installation required. Our PDF merger works entirely in your web browser. Just open the tool, add your files, and merge them online instantly.' }
        ]
      }
    },
    // { 
    //   id: 'pdf-split',
    //   name: 'Split PDF',
    //   description: 'Split PDF into files',
    //   longDescription: 'Split large PDFs into smaller files or extract selected pages easily.',
    //   buttonText: 'Split PDF',
    //   route: '/pdf-split',
    //   icon: 'split-pdf.png',
    //   iconAlt: 'Split PDF',
    //   category: 'PDF Tools',
    //   seo: {
    //     title: 'Free PDF Splitter Online | Split PDF Pages | ToolTrove',
    //     metaDescription: 'Split PDF files into separate documents or extract specific pages. Free online PDF splitter tool. No registration required.',
    //     keywords: ['split PDF', 'PDF splitter', 'extract PDF pages', 'separate PDF', 'PDF page extractor', 'split PDF online', 'divide PDF'],
    //     h1: 'Free Online PDF Splitter',
    //     h2: 'Split PDF Files or Extract Pages',
    //     faqs: [
    //       { question: 'How to split a PDF file?', answer: 'Upload your PDF, select the pages you want to extract, and download them as separate files.' },
    //       { question: 'Is PDF splitting secure?', answer: 'Yes! All processing happens in your browser. Your files are never uploaded to any server.' }
    //     ]
    //   }
    // },
    { 
      id: 'compress-pdf',
      name: 'Compress PDF',
      description: 'Reduce PDF size',
      longDescription: 'Compress PDF files without losing quality for faster sharing.',
      buttonText: 'Compress Now',
      route: '/compress-pdf',
      icon: 'compress-pdf.png',
      iconAlt: 'Compress PDF',
      category: 'PDF Tools',
      seo: {
        title: 'Free PDF Compressor | Reduce PDF File Size | ToolTrove',
        metaDescription: 'Compress PDF files to reduce file size without losing quality. Free online PDF compressor. No registration required.',
        keywords: ['compress PDF', 'PDF compressor', 'reduce PDF size', 'smaller PDF', 'PDF compression', 'optimize PDF', 'shrink PDF'],
        h1: 'Free Online PDF Compressor',
        h2: 'Reduce PDF File Size Without Quality Loss',
        faqs: [
          { question: 'How to compress a PDF?', answer: 'Upload your PDF file, choose compression level, and download the compressed version.' },
          { question: 'Does compression reduce quality?', answer: 'Our smart compression maintains the best possible quality while reducing file size.' }
        ]
      }
    },
    // { 
    //   id: 'pdf-to-word',
    //   name: 'PDF to Word',
    //   description: 'Convert PDF to Word',
    //   longDescription: 'Convert PDF documents into editable Word files with high accuracy.',
    //   buttonText: 'Convert Now',
    //   route: '/pdf-to-word',
    //   icon: 'pdf-to-word.png',
    //   iconAlt: 'PDF to Word',
    //   category: 'PDF Tools',
    //   seo: {
    //     title: 'Free PDF to Word Converter | Convert PDF to DOCX | ToolTrove',
    //     metaDescription: 'Convert PDF documents to editable Word files with high accuracy using OCR. Free online PDF to Word converter with no registration required.',
    //     keywords: ['PDF to Word', 'convert PDF to Word', 'PDF to DOCX', 'extract PDF to Word', 'PDF to Microsoft Word', 'free PDF converter', 'OCR PDF', 'scanned PDF to Word'],
    //     h1: 'Free PDF to Word Converter',
    //     h2: 'Convert PDF to Editable Word Document',
    //     faqs: [
    //       { question: 'How to convert PDF to Word?', answer: 'Upload your PDF file, optionally enable OCR for scanned documents, and download the converted Word document instantly.' },
    //       { question: 'Is the conversion accurate?', answer: 'Our converter uses advanced text extraction and OCR technology to maintain formatting and layout as accurately as possible.' },
    //       { question: 'Does this tool support scanned PDFs?', answer: 'Yes! Our converter includes OCR (Optical Character Recognition) that can extract text from scanned documents and images within PDFs.' },
    //       { question: 'Is my data secure?', answer: 'Yes, all conversion happens in your browser. Your files are never uploaded to our servers.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'word-to-pdf',
    //   name: 'Word to PDF',
    //   description: 'Convert Word to PDF',
    //   longDescription: 'Convert Word documents into high-quality PDF files instantly with formatting preserved.',
    //   buttonText: 'Convert Now',
    //   route: '/word-to-pdf',
    //   icon: 'word-to-pdf.png',
    //   iconAlt: 'Word to PDF',
    //   category: 'PDF Tools',
    //   seo: {
    //     title: 'Free Word to PDF Converter | Convert DOCX to PDF | ToolTrove',
    //     metaDescription: 'Convert Word documents to PDF format instantly. Free online Word to PDF converter with formatting preservation. No registration required.',
    //     keywords: ['Word to PDF', 'convert Word to PDF', 'DOCX to PDF', 'Microsoft Word to PDF', 'Word document to PDF', 'free converter', 'DOC to PDF'],
    //     h1: 'Free Word to PDF Converter',
    //     h2: 'Convert Word Documents to PDF',
    //     faqs: [
    //       { question: 'How to convert Word to PDF?', answer: 'Upload your Word document (.docx), and download it as a PDF file instantly. Your formatting will be preserved.' },
    //       { question: 'Will my formatting be preserved?', answer: 'Yes! Word to PDF conversion typically preserves formatting very well, including text styles, fonts, paragraphs, and basic layouts.' },
    //       { question: 'Is my data secure?', answer: 'Yes, all conversion happens in your browser. Your files are never uploaded to our servers.' },
    //       { question: 'What formats are supported?', answer: 'Our converter supports .docx files (Word 2007 and later). Legacy .doc files are not supported.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'pdf-to-image',
    //   name: 'PDF to Image',
    //   description: 'Convert PDF to images',
    //   longDescription: 'Convert PDF pages into high-quality images (JPG/PNG).',
    //   buttonText: 'Convert Now',
    //   route: '/pdf-to-image',
    //   category: 'PDF Tools',
    //   seo: {
    //     title: 'Free PDF to Image Converter | Convert PDF to JPG PNG | ToolTrove',
    //     metaDescription: 'Convert PDF pages to images in JPG or PNG format. Free online PDF to image converter.',
    //     keywords: ['PDF to image', 'PDF to JPG', 'PDF to PNG', 'convert PDF to image', 'PDF to JPEG', 'extract PDF as image'],
    //     h1: 'Free PDF to Image Converter',
    //     h2: 'Convert PDF Pages to Images',
    //     faqs: [
    //       { question: 'How to convert PDF to image?', answer: 'Upload your PDF and choose the output format (JPG or PNG). Download your images.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'image-to-pdf',
    //   name: 'Image to PDF',
    //   description: 'Convert images to PDF',
    //   longDescription: 'Combine multiple images into a single PDF document.',
    //   buttonText: 'Create PDF',
    //   route: '/image-to-pdf',
    //   category: 'PDF Tools',
    //   seo: {
    //     title: 'Free Image to PDF Converter | Convert Images to PDF | ToolTrove',
    //     metaDescription: 'Convert images to PDF or combine multiple images into one PDF. Free online image to PDF converter.',
    //     keywords: ['image to PDF', 'convert image to PDF', 'JPG to PDF', 'PNG to PDF', 'images to PDF', 'combine images to PDF'],
    //     h1: 'Free Image to PDF Converter',
    //     h2: 'Convert Images to PDF Documents',
    //     faqs: [
    //       { question: 'How to convert images to PDF?', answer: 'Upload multiple images, arrange them, and download as a single PDF document.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'pdf-to-excel',
    //   name: 'PDF to Excel',
    //   description: 'Convert PDF to Excel',
    //   longDescription: 'Convert PDF tables to editable Excel files with accuracy.',
    //   buttonText: 'Convert Now',
    //   route: '/pdf-to-excel',
    //   icon: 'pdf-to-excel.png',
    //   iconAlt: 'PDF to Excel',
    //   category: 'PDF Tools',
    //   seo: {
    //     title: 'Free PDF to Excel Converter | Extract PDF Tables | ToolTrove',
    //     metaDescription: 'Convert PDF tables to editable Excel files. Free online PDF to Excel converter with table extraction.',
    //     keywords: ['PDF to Excel', 'convert PDF to Excel', 'extract PDF to Excel', 'PDF table to Excel', 'PDF to spreadsheet'],
    //     h1: 'Free PDF to Excel Converter',
    //     h2: 'Extract PDF Tables to Excel',
    //     faqs: [
    //       { question: 'How to convert PDF to Excel?', answer: 'Upload your PDF and download the Excel file with extracted tables and data.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'excel-to-pdf',
    //   name: 'Excel to PDF',
    //   description: 'Convert Excel to PDF',
    //   longDescription: 'Convert Excel spreadsheets to PDF format instantly.',
    //   buttonText: 'Convert Now',
    //   route: '/excel-to-pdf',
    //   icon: 'excel-to-pdf.png',
    //   iconAlt: 'Excel to PDF',
    //   category: 'PDF Tools',
    //   seo: {
    //     title: 'Free Excel to PDF Converter | Convert XLSX to PDF | ToolTrove',
    //     metaDescription: 'Convert Excel spreadsheets to PDF format instantly. Free online Excel to PDF converter.',
    //     keywords: ['Excel to PDF', 'convert Excel to PDF', 'XLSX to PDF', 'spreadsheet to PDF', 'convert Excel file to PDF'],
    //     h1: 'Free Excel to PDF Converter',
    //     h2: 'Convert Excel Spreadsheets to PDF',
    //     faqs: [
    //       { question: 'How to convert Excel to PDF?', answer: 'Upload your Excel file and download it as a PDF document.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'pdf-to-ppt',
    //   name: 'PDF to PowerPoint',
    //   description: 'Convert PDF to PPT',
    //   longDescription: 'Convert PDF presentations to editable PowerPoint slides.',
    //   buttonText: 'Convert Now',
    //   route: '/pdf-to-ppt',
    //   icon: 'pdf-to-ppt.png',
    //   iconAlt: 'PDF to PowerPoint',
    //   category: 'PDF Tools',
    //   seo: {
    //     title: 'Free PDF to PowerPoint Converter | Convert PDF to PPT | ToolTrove',
    //     metaDescription: 'Convert PDF presentations to editable PowerPoint slides. Free online PDF to PPT converter.',
    //     keywords: ['PDF to PowerPoint', 'PDF to PPT', 'convert PDF to PowerPoint', 'PDF to presentation', 'PDF slides to PPT'],
    //     h1: 'Free PDF to PowerPoint Converter',
    //     h2: 'Convert PDF to Editable PowerPoint',
    //     faqs: [
    //       { question: 'How to convert PDF to PowerPoint?', answer: 'Upload your PDF and download the editable PowerPoint presentation.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'ppt-to-pdf',
    //   name: 'PowerPoint to PDF',
    //   description: 'Convert PPT to PDF',
    //   longDescription: 'Convert PowerPoint presentations to PDF quickly.',
    //   buttonText: 'Convert Now',
    //   route: '/ppt-to-pdf',
    //   icon: 'ppt-to-pdf.png',
    //   iconAlt: 'PowerPoint to PDF',
    //   category: 'PDF Tools',
    //   seo: {
    //     title: 'Free PowerPoint to PDF Converter | Convert PPT to PDF | ToolTrove',
    //     metaDescription: 'Convert PowerPoint presentations to PDF quickly. Free online PPT to PDF converter.',
    //     keywords: ['PowerPoint to PDF', 'PPT to PDF', 'convert PPT to PDF', 'presentation to PDF', 'convert presentation to PDF'],
    //     h1: 'Free PowerPoint to PDF Converter',
    //     h2: 'Convert PowerPoint Presentations to PDF',
    //     faqs: [
    //       { question: 'How to convert PowerPoint to PDF?', answer: 'Upload your PowerPoint file and download it as a PDF document.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'pdf-rotate',
    //   name: 'Rotate PDF',
    //   description: 'Rotate PDF pages',
    //   longDescription: 'Rotate PDF pages to correct orientation easily.',
    //   buttonText: 'Rotate Now',
    //   route: '/pdf-rotate',
    //   category: 'PDF Tools',
    //   seo: {
    //     title: 'Free PDF Rotate Tool | Rotate PDF Pages Online | ToolTrove',
    //     metaDescription: 'Rotate PDF pages to fix orientation. Free online PDF rotation tool. No registration required.',
    //     keywords: ['rotate PDF', 'rotate PDF pages', 'rotate PDF online', 'PDF page rotation', 'fix PDF orientation'],
    //     h1: 'Free PDF Rotate Tool',
    //     h2: 'Rotate PDF Pages Online',
    //     faqs: [
    //       { question: 'How to rotate PDF pages?', answer: 'Upload your PDF, select pages to rotate, choose rotation angle, and download.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'pdf-delete-pages',
    //   name: 'Delete PDF Pages',
    //   description: 'Remove pages from PDF',
    //   longDescription: 'Delete unwanted pages from your PDF files quickly.',
    //   buttonText: 'Delete Pages',
    //   route: '/pdf-delete-pages',
    //   category: 'PDF Tools',
    //   seo: {
    //     title: 'Free PDF Page Deleter | Remove Pages from PDF | ToolTrove',
    //     metaDescription: 'Delete unwanted pages from PDF files. Free online PDF page remover tool.',
    //     keywords: ['delete PDF pages', 'remove PDF pages', 'remove pages from PDF', 'delete pages from PDF', 'PDF page remover'],
    //     h1: 'Free PDF Page Deleter',
    //     h2: 'Remove Pages from PDF',
    //     faqs: [
    //       { question: 'How to delete pages from PDF?', answer: 'Select the pages you want to remove and download the cleaned PDF.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'pdf-extract-pages',
    //   name: 'Extract Pages',
    //   description: 'Extract pages from PDF',
    //   longDescription: 'Extract selected pages from a PDF into a new file.',
    //   buttonText: 'Extract Now',
    //   route: '/pdf-extract-pages',
    //   category: 'PDF Tools',
    //   seo: {
    //     title: 'Free PDF Page Extractor | Extract Pages from PDF | ToolTrove',
    //     metaDescription: 'Extract specific pages from PDF into a new file. Free online PDF page extractor.',
    //     keywords: ['extract PDF pages', 'extract pages from PDF', 'PDF page extractor', 'get pages from PDF', 'PDF extraction'],
    //     h1: 'Free PDF Page Extractor',
    //     h2: 'Extract Pages from PDF',
    //     faqs: [
    //       { question: 'How to extract pages from PDF?', answer: 'Select the pages you want to extract and download them as a new PDF file.' }
    //     ]
    //   }
    // },

    // // Image Tools
    { 
      id: 'image-compress',
      name: 'Compress Image',
      description: 'Reduce image size',
      longDescription: 'Compress images to reduce file size while maintaining quality.',
      buttonText: 'Compress Now',
      route: '/image-compress',
      category: 'Image Tools',
      seo: {
        title: 'Free Image Compressor | Compress Images Online | ToolTrove',
        metaDescription: 'Compress images to reduce file size while maintaining quality. Free online image compressor. Supports JPG, PNG, and more.',
        keywords: ['compress image', 'image compressor', 'reduce image size', 'compress JPG', 'compress PNG', 'image optimization', 'shrink image'],
        h1: 'Free Image Compressor',
        h2: 'Reduce Image File Size Online',
        faqs: [
          { question: 'How to compress an image?', answer: 'Upload your image, choose compression level, and download the optimized image.' },
          { question: 'Does compression lose quality?', answer: 'Our smart compression maintains the best balance between file size and image quality.' }
        ]
      }
    },
    // { 
    //   id: 'image-resize',
    //   name: 'Resize Image',
    //   description: 'Resize image dimensions',
    //   longDescription: 'Resize images to custom dimensions without losing quality.',
    //   buttonText: 'Resize Image',
    //   route: '/image-resize',
    //   category: 'Image Tools',
    //   seo: {
    //     title: 'Free Image Resizer | Resize Images Online | ToolTrove',
    //     metaDescription: 'Resize images to custom dimensions. Free online image resizer tool. Maintain aspect ratio option available.',
    //     keywords: ['resize image', 'image resizer', 'resize photo', 'change image size', 'image dimensions', 'resize picture'],
    //     h1: 'Free Image Resizer',
    //     h2: 'Resize Images to Custom Dimensions',
    //     faqs: [
    //       { question: 'How to resize an image?', answer: 'Upload your image, enter new dimensions, and download the resized image.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'jpg-to-png',
    //   name: 'JPG to PNG',
    //   description: 'Convert JPG to PNG',
    //   longDescription: 'Convert JPG images to PNG format instantly.',
    //   buttonText: 'Convert Now',
    //   route: '/jpg-to-png',
    //   category: 'Image Tools',
    //   seo: {
    //     title: 'Free JPG to PNG Converter | Convert JPG to PNG | ToolTrove',
    //     metaDescription: 'Convert JPG images to PNG format instantly. Free online JPG to PNG converter.',
    //     keywords: ['JPG to PNG', 'convert JPG to PNG', 'JPEG to PNG', 'image converter', 'change image format'],
    //     h1: 'Free JPG to PNG Converter',
    //     h2: 'Convert JPG Images to PNG',
    //     faqs: [
    //       { question: 'How to convert JPG to PNG?', answer: 'Upload your JPG image and download it as a PNG file.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'png-to-jpg',
    //   name: 'PNG to JPG',
    //   description: 'Convert PNG to JPG',
    //   longDescription: 'Convert PNG images to JPG format easily.',
    //   buttonText: 'Convert Now',
    //   route: '/png-to-jpg',
    //   category: 'Image Tools',
    //   seo: {
    //     title: 'Free PNG to JPG Converter | Convert PNG to JPG | ToolTrove',
    //     metaDescription: 'Convert PNG images to JPG format easily. Free online PNG to JPG converter.',
    //     keywords: ['PNG to JPG', 'convert PNG to JPG', 'PNG to JPEG', 'image converter', 'change image format'],
    //     h1: 'Free PNG to JPG Converter',
    //     h2: 'Convert PNG Images to JPG',
    //     faqs: [
    //       { question: 'How to convert PNG to JPG?', answer: 'Upload your PNG image and download it as a JPG file.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'image-crop',
    //   name: 'Crop Image',
    //   description: 'Crop images easily',
    //   longDescription: 'Crop images to desired dimensions with precision.',
    //   buttonText: 'Crop Image',
    //   route: '/image-crop',
    //   category: 'Image Tools',
    //   seo: {
    //     title: 'Free Image Cropper | Crop Images Online | ToolTrove',
    //     metaDescription: 'Crop images to desired dimensions with precision. Free online image cropper tool.',
    //     keywords: ['crop image', 'image cropper', 'crop photo', 'crop picture', 'image trimming'],
    //     h1: 'Free Image Cropper',
    //     h2: 'Crop Images to Exact Dimensions',
    //     faqs: [
    //       { question: 'How to crop an image?', answer: 'Upload your image, select the crop area, and download the cropped image.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'image-rotate',
    //   name: 'Rotate Image',
    //   description: 'Rotate images',
    //   longDescription: 'Rotate images to any angle with ease.',
    //   buttonText: 'Rotate Image',
    //   route: '/image-rotate',
    //   category: 'Image Tools',
    //   seo: {
    //     title: 'Free Image Rotator | Rotate Images Online | ToolTrove',
    //     metaDescription: 'Rotate images to any angle. Free online image rotation tool.',
    //     keywords: ['rotate image', 'image rotator', 'rotate photo', 'rotate picture', 'image rotation'],
    //     h1: 'Free Image Rotator',
    //     h2: 'Rotate Images to Any Angle',
    //     faqs: [
    //       { question: 'How to rotate an image?', answer: 'Upload your image, choose rotation angle, and download the rotated image.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'image-flip',
    //   name: 'Flip Image',
    //   description: 'Flip images',
    //   longDescription: 'Flip images horizontally or vertically instantly.',
    //   buttonText: 'Flip Image',
    //   route: '/image-flip',
    //   category: 'Image Tools',
    //   seo: {
    //     title: 'Free Image Flipper | Flip Images Online | ToolTrove',
    //     metaDescription: 'Flip images horizontally or vertically. Free online image flipper tool.',
    //     keywords: ['flip image', 'flip horizontally', 'flip vertically', 'mirror image', 'reflect image'],
    //     h1: 'Free Image Flipper',
    //     h2: 'Flip Images Horizontally or Vertically',
    //     faqs: [
    //       { question: 'How to flip an image?', answer: 'Upload your image, choose flip direction, and download the flipped image.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'grayscale',
    //   name: 'Grayscale Image',
    //   description: 'Convert image to grayscale',
    //   longDescription: 'Convert colored images into grayscale format.',
    //   buttonText: 'Convert Now',
    //   route: '/grayscale',
    //   category: 'Image Tools',
    //   seo: {
    //     title: 'Free Grayscale Converter | Convert Image to Black & White | ToolTrove',
    //     metaDescription: 'Convert colored images to grayscale. Free online grayscale converter.',
    //     keywords: ['grayscale converter', 'image to grayscale', 'convert to black and white', 'grayscale photo', 'desaturate image'],
    //     h1: 'Free Grayscale Converter',
    //     h2: 'Convert Images to Grayscale',
    //     faqs: [
    //       { question: 'How to convert image to grayscale?', answer: 'Upload your colored image and download the grayscale version.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'image-base64',
    //   name: 'Image to Base64',
    //   description: 'Convert image to Base64',
    //   longDescription: 'Encode images into Base64 format for web use.',
    //   buttonText: 'Encode Now',
    //   route: '/image-base64',
    //   category: 'Image Tools',
    //   seo: {
    //     title: 'Free Image to Base64 Encoder | Encode Image to Base64 | ToolTrove',
    //     metaDescription: 'Encode images to Base64 string for web use. Free online image to Base64 converter.',
    //     keywords: ['image to base64', 'encode image base64', 'base64 image encoder', 'image to data URI', 'convert image to base64'],
    //     h1: 'Free Image to Base64 Encoder',
    //     h2: 'Encode Images to Base64 String',
    //     faqs: [
    //       { question: 'How to encode image to Base64?', answer: 'Upload your image and get the Base64 encoded string to use in HTML or CSS.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'base64-image',
    //   name: 'Base64 to Image',
    //   description: 'Convert Base64 to image',
    //   longDescription: 'Decode Base64 strings into image files.',
    //   buttonText: 'Decode Now',
    //   route: '/base64-image',
    //   category: 'Image Tools',
    //   seo: {
    //     title: 'Free Base64 to Image Decoder | Decode Base64 to Image | ToolTrove',
    //     metaDescription: 'Decode Base64 strings back to image files. Free online Base64 to image converter.',
    //     keywords: ['base64 to image', 'decode base64 image', 'base64 to png', 'base64 to jpg', 'decode base64'],
    //     h1: 'Free Base64 to Image Decoder',
    //     h2: 'Decode Base64 to Image Files',
    //     faqs: [
    //       { question: 'How to decode Base64 to image?', answer: 'Paste your Base64 string and download the decoded image file.' }
    //     ]
    //   }
    // },

    // // Calculator Tools
    // { 
    //   id: 'percentage',
    //   name: 'Percentage Calculator',
    //   description: 'Calculate percentages',
    //   longDescription: 'Easily calculate percentages, increases, and decreases.',
    //   buttonText: 'Calculate Now',
    //   route: '/percentage',
    //   category: 'Calculator Tools',
    //   seo: {
    //     title: 'Free Percentage Calculator | Calculate Percentages Online | ToolTrove',
    //     metaDescription: 'Calculate percentages easily with our free online calculator. Find percentage increase, decrease, and more.',
    //     keywords: ['percentage calculator', 'calculate percentage', 'percent calculator', 'percentage increase calculator', 'percentage decrease', 'find percentage'],
    //     h1: 'Free Percentage Calculator',
    //     h2: 'Calculate Percentages Easily',
    //     faqs: [
    //       { question: 'How to calculate percentage?', answer: 'Enter the values and our calculator will compute the percentage for you.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'emi',
    //   name: 'EMI Calculator',
    //   description: 'Calculate loan EMI',
    //   longDescription: 'Calculate monthly EMI for loans based on interest and tenure.',
    //   buttonText: 'Calculate EMI',
    //   route: '/emi',
    //   category: 'Calculator Tools',
    //   seo: {
    //     title: 'Free EMI Calculator | Calculate Loan EMI Online | ToolTrove',
    //     metaDescription: 'Calculate monthly EMI for loans. Free online EMI calculator with detailed payment breakdown.',
    //     keywords: ['EMI calculator', 'loan EMI calculator', 'calculate EMI', 'monthly payment calculator', 'loan calculator', 'mortgage calculator'],
    //     h1: 'Free EMI Calculator',
    //     h2: 'Calculate Monthly Loan EMI',
    //     faqs: [
    //       { question: 'How to calculate EMI?', answer: 'Enter loan amount, interest rate, and tenure. Our calculator will compute your monthly EMI.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'age',
    //   name: 'Age Calculator',
    //   description: 'Calculate age',
    //   longDescription: 'Find your exact age in years, months, and days.',
    //   buttonText: 'Calculate Age',
    //   route: '/age',
    //   category: 'Calculator Tools',
    //   seo: {
    //     title: 'Free Age Calculator | Calculate Age Online | ToolTrove',
    //     metaDescription: 'Calculate your exact age in years, months, and days. Free online age calculator.',
    //     keywords: ['age calculator', 'calculate age', 'age finder', 'how old am I', 'age in years months days'],
    //     h1: 'Free Age Calculator',
    //     h2: 'Calculate Your Exact Age',
    //     faqs: [
    //       { question: 'How to calculate age?', answer: 'Enter your birth date and our calculator will show your exact age.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'bmi',
    //   name: 'BMI Calculator',
    //   description: 'Calculate BMI',
    //   longDescription: 'Calculate Body Mass Index and check health status.',
    //   buttonText: 'Check BMI',
    //   route: '/bmi',
    //   category: 'Calculator Tools',
    //   seo: {
    //     title: 'Free BMI Calculator | Calculate Body Mass Index | ToolTrove',
    //     metaDescription: 'Calculate your Body Mass Index (BMI) and check your health status. Free online BMI calculator.',
    //     keywords: ['BMI calculator', 'calculate BMI', 'body mass index', 'BMI check', 'healthy weight calculator'],
    //     h1: 'Free BMI Calculator',
    //     h2: 'Calculate Your Body Mass Index',
    //     faqs: [
    //       { question: 'How to calculate BMI?', answer: 'Enter your height and weight, and our calculator will compute your BMI.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'discount',
    //   name: 'Discount Calculator',
    //   description: 'Calculate discounts',
    //   longDescription: 'Calculate final price after discounts quickly.',
    //   buttonText: 'Calculate Discount',
    //   route: '/discount',
    //   category: 'Calculator Tools',
    //   seo: {
    //     title: 'Free Discount Calculator | Calculate Discount Online | ToolTrove',
    //     metaDescription: 'Calculate final price after discounts. Free online discount calculator.',
    //     keywords: ['discount calculator', 'calculate discount', 'sale price calculator', 'discount percentage', 'price after discount'],
    //     h1: 'Free Discount Calculator',
    //     h2: 'Calculate Final Price After Discount',
    //     faqs: [
    //       { question: 'How to calculate discount?', answer: 'Enter the original price and discount percentage to calculate the final price.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'gst',
    //   name: 'GST Calculator',
    //   description: 'Calculate GST',
    //   longDescription: 'Calculate GST amount and final price instantly.',
    //   buttonText: 'Calculate GST',
    //   route: '/gst',
    //   category: 'Calculator Tools',
    //   seo: {
    //     title: 'Free GST Calculator | Calculate GST Online | ToolTrove',
    //     metaDescription: 'Calculate GST amount and final price. Free online GST calculator for India and other countries.',
    //     keywords: ['GST calculator', 'calculate GST', 'GST amount calculator', 'add GST', 'GST tax calculator'],
    //     h1: 'Free GST Calculator',
    //     h2: 'Calculate GST Amount & Final Price',
    //     faqs: [
    //       { question: 'How to calculate GST?', answer: 'Enter the base amount and GST rate to calculate the GST and final price.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'time-diff',
    //   name: 'Time Difference',
    //   description: 'Calculate time difference',
    //   longDescription: 'Calculate time difference between two dates or times.',
    //   buttonText: 'Calculate Time',
    //   route: '/time-diff',
    //   category: 'Calculator Tools',
    //   seo: {
    //     title: 'Free Time Difference Calculator | Calculate Time Between Dates | ToolTrove',
    //     metaDescription: 'Calculate time difference between two dates or times. Free online time difference calculator.',
    //     keywords: ['time difference calculator', 'calculate time between dates', 'date time calculator', 'time duration calculator'],
    //     h1: 'Free Time Difference Calculator',
    //     h2: 'Calculate Time Between Two Dates',
    //     faqs: [
    //       { question: 'How to calculate time difference?', answer: 'Enter two dates or times and our calculator will show the difference.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'unit-converter',
    //   name: 'Unit Converter',
    //   description: 'Convert units',
    //   longDescription: 'Convert units across categories like length, weight, and temperature.',
    //   buttonText: 'Convert Now',
    //   route: '/unit-converter',
    //   category: 'Calculator Tools',
    //   seo: {
    //     title: 'Free Unit Converter | Convert Units Online | ToolTrove',
    //     metaDescription: 'Convert units across categories like length, weight, temperature, and more. Free online unit converter.',
    //     keywords: ['unit converter', 'convert units', 'unit conversion', 'length converter', 'weight converter', 'temperature converter', 'metric converter'],
    //     h1: 'Free Unit Converter',
    //     h2: 'Convert Units Across All Categories',
    //     faqs: [
    //       { question: 'How to convert units?', answer: 'Select the category, enter the value, and choose the units to convert between.' }
    //     ]
    //   }
    // },

    // // Developer Tools
    // { 
    //   id: 'json-formatter',
    //   name: 'JSON Formatter',
    //   description: 'Format JSON data',
    //   longDescription: 'Format and beautify JSON for better readability.',
    //   buttonText: 'Format JSON',
    //   route: '/json-formatter',
    //   category: 'Developer Tools',
    //   seo: {
    //     title: 'Free JSON Formatter | Format & Beautify JSON Online | ToolTrove',
    //     metaDescription: 'Format and beautify JSON data for better readability. Free online JSON formatter with syntax highlighting.',
    //     keywords: ['JSON formatter', 'format JSON', 'beautify JSON', 'JSON pretty print', 'JSON formatter online', 'indent JSON'],
    //     h1: 'Free JSON Formatter',
    //     h2: 'Format & Beautify JSON Data',
    //     faqs: [
    //       { question: 'How to format JSON?', answer: 'Paste your JSON data and our formatter will beautify it with proper indentation.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'json-validator',
    //   name: 'JSON Validator',
    //   description: 'Validate JSON',
    //   longDescription: 'Validate JSON structure and detect errors instantly.',
    //   buttonText: 'Validate JSON',
    //   route: '/json-validator',
    //   category: 'Developer Tools',
    //   seo: {
    //     title: 'Free JSON Validator | Validate JSON Online | ToolTrove',
    //     metaDescription: 'Validate JSON structure and detect errors instantly. Free online JSON validator.',
    //     keywords: ['JSON validator', 'validate JSON', 'JSON checker', 'JSON syntax validator', 'is valid JSON'],
    //     h1: 'Free JSON Validator',
    //     h2: 'Validate JSON Structure & Syntax',
    //     faqs: [
    //       { question: 'How to validate JSON?', answer: 'Paste your JSON and our validator will check for syntax errors and structural issues.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'base64-encode',
    //   name: 'Base64 Encode',
    //   description: 'Encode text',
    //   longDescription: 'Convert text into Base64 encoding format.',
    //   buttonText: 'Encode Now',
    //   route: '/base64-encode',
    //   category: 'Developer Tools',
    //   seo: {
    //     title: 'Free Base64 Encoder | Encode Text to Base64 | ToolTrove',
    //     metaDescription: 'Encode text to Base64 string. Free online Base64 encoder tool.',
    //     keywords: ['base64 encode', 'encode base64', 'text to base64', 'string to base64', 'base64 encoder'],
    //     h1: 'Free Base64 Encoder',
    //     h2: 'Encode Text to Base64',
    //     faqs: [
    //       { question: 'How to encode to Base64?', answer: 'Enter your text and our encoder will generate the Base64 encoded string.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'base64-decode',
    //   name: 'Base64 Decode',
    //   description: 'Decode Base64',
    //   longDescription: 'Decode Base64 strings into readable text.',
    //   buttonText: 'Decode Now',
    //   route: '/base64-decode',
    //   category: 'Developer Tools',
    //   seo: {
    //     title: 'Free Base64 Decoder | Decode Base64 to Text | ToolTrove',
    //     metaDescription: 'Decode Base64 strings back to readable text. Free online Base64 decoder.',
    //     keywords: ['base64 decode', 'decode base64', 'base64 to text', 'base64 decoder', 'decode base64 string'],
    //     h1: 'Free Base64 Decoder',
    //     h2: 'Decode Base64 to Text',
    //     faqs: [
    //       { question: 'How to decode Base64?', answer: 'Paste your Base64 string and our decoder will show the decoded text.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'url-encode',
    //   name: 'URL Encoder',
    //   description: 'Encode URLs',
    //   longDescription: 'Encode URLs for safe transmission.',
    //   buttonText: 'Encode URL',
    //   route: '/url-encode',
    //   category: 'Developer Tools',
    //   seo: {
    //     title: 'Free URL Encoder | Encode URL Online | ToolTrove',
    //     metaDescription: 'Encode URLs for safe transmission. Free online URL encoder tool.',
    //     keywords: ['URL encode', 'encode URL', 'URL encoder', 'encode special characters', 'URL encoding online'],
    //     h1: 'Free URL Encoder',
    //     h2: 'Encode URLs for Safe Transmission',
    //     faqs: [
    //       { question: 'How to encode a URL?', answer: 'Enter your URL and our encoder will encode special characters for safe transmission.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'url-decode',
    //   name: 'URL Decoder',
    //   description: 'Decode URLs',
    //   longDescription: 'Decode encoded URLs back to normal format.',
    //   buttonText: 'Decode URL',
    //   route: '/url-decode',
    //   category: 'Developer Tools',
    //   seo: {
    //     title: 'Free URL Decoder | Decode URL Online | ToolTrove',
    //     metaDescription: 'Decode encoded URLs back to normal format. Free online URL decoder.',
    //     keywords: ['URL decode', 'decode URL', 'URL decoder', 'decode encoded URL', 'URL decoding online'],
    //     h1: 'Free URL Decoder',
    //     h2: 'Decode URLs to Normal Format',
    //     faqs: [
    //       { question: 'How to decode a URL?', answer: 'Paste your encoded URL and our decoder will show the decoded version.' }
    //     ]
    //   }
    // },

    // // Utility Tools
    // { 
    //   id: 'qr-generator',
    //   name: 'QR Code Generator',
    //   description: 'Generate QR codes',
    //   longDescription: 'Generate QR codes for URLs, text, or contact details.',
    //   buttonText: 'Generate QR',
    //   route: '/qr-generator',
    //   category: 'Utility Tools',
    //   seo: {
    //     title: 'Free QR Code Generator | Generate QR Codes Online | ToolTrove',
    //     metaDescription: 'Generate QR codes for URLs, text, or contact details. Free online QR code generator.',
    //     keywords: ['QR code generator', 'generate QR code', 'QR code maker', 'create QR code', 'free QR generator', 'QR code creator'],
    //     h1: 'Free QR Code Generator',
    //     h2: 'Generate QR Codes for Any Purpose',
    //     faqs: [
    //       { question: 'How to generate a QR code?', answer: 'Enter your content (URL, text, or contact) and download your QR code.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'qr-scanner',
    //   name: 'QR Code Scanner',
    //   description: 'Scan QR codes',
    //   longDescription: 'Scan QR codes using your device camera instantly.',
    //   buttonText: 'Scan Now',
    //   route: '/qr-scanner',
    //   category: 'Utility Tools',
    //   seo: {
    //     title: 'Free QR Code Scanner | Scan QR Codes Online | ToolTrove',
    //     metaDescription: 'Scan QR codes using your device camera. Free online QR code scanner.',
    //     keywords: ['QR scanner', 'QR code scanner', 'scan QR code', 'read QR code', 'QR code reader', 'QR code decoder'],
    //     h1: 'Free QR Code Scanner',
    //     h2: 'Scan QR Codes Instantly',
    //     faqs: [
    //       { question: 'How to scan a QR code?', answer: 'Use your camera to scan a QR code and get its content instantly.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'password-generator',
    //   name: 'Password Generator',
    //   description: 'Generate strong passwords',
    //   longDescription: 'Generate secure and strong passwords instantly.',
    //   buttonText: 'Generate Password',
    //   route: '/password-generator',
    //   category: 'Utility Tools',
    //   seo: {
    //     title: 'Free Password Generator | Generate Strong Passwords | ToolTrove',
    //     metaDescription: 'Generate secure and strong passwords instantly. Free online password generator with customization options.',
    //     keywords: ['password generator', 'generate password', 'strong password generator', 'random password generator', 'secure password maker'],
    //     h1: 'Free Password Generator',
    //     h2: 'Generate Strong Secure Passwords',
    //     faqs: [
    //       { question: 'How to generate a strong password?', answer: 'Choose password length and complexity, and our generator will create a secure password.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'text-case',
    //   name: 'Text Case Converter',
    //   description: 'Convert text case',
    //   longDescription: 'Convert text between uppercase, lowercase, and more.',
    //   buttonText: 'Convert Text',
    //   route: '/text-case',
    //   category: 'Utility Tools',
    //   seo: {
    //     title: 'Free Text Case Converter | Change Text Case Online | ToolTrove',
    //     metaDescription: 'Convert text between uppercase, lowercase, title case, and more. Free online text case converter.',
    //     keywords: ['text case converter', 'change case', 'uppercase lowercase', 'convert text case', 'title case converter', 'sentence case'],
    //     h1: 'Free Text Case Converter',
    //     h2: 'Convert Text Between Cases',
    //     faqs: [
    //       { question: 'How to convert text case?', answer: 'Enter your text and choose the case conversion you need.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'word-counter',
    //   name: 'Word Counter',
    //   description: 'Count words',
    //   longDescription: 'Count words, characters, and sentences instantly.',
    //   buttonText: 'Count Now',
    //   route: '/word-counter',
    //   category: 'Utility Tools',
    //   seo: {
    //     title: 'Free Word Counter | Count Words Characters Online | ToolTrove',
    //     metaDescription: 'Count words, characters, and sentences instantly. Free online word counter tool.',
    //     keywords: ['word counter', 'count words', 'character counter', 'count characters', 'word count tool', 'letter counter'],
    //     h1: 'Free Word Counter',
    //     h2: 'Count Words Characters & Sentences',
    //     faqs: [
    //       { question: 'How to count words?', answer: 'Enter your text and our counter will show word, character, and sentence counts.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'random-generator',
    //   name: 'Random Generator',
    //   description: 'Generate random values',
    //   longDescription: 'Generate random numbers, strings, or values easily.',
    //   buttonText: 'Generate Now',
    //   route: '/random-generator',
    //   category: 'Utility Tools',
    //   seo: {
    //     title: 'Free Random Generator | Generate Random Numbers & Strings | ToolTrove',
    //     metaDescription: 'Generate random numbers, strings, or values. Free online random generator tool.',
    //     keywords: ['random generator', 'random number generator', 'generate random', 'random string generator', 'random picker'],
    //     h1: 'Free Random Generator',
    //     h2: 'Generate Random Numbers & Strings',
    //     faqs: [
    //       { question: 'How to generate random values?', answer: 'Set your parameters and our generator will create random values for you.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'color-picker',
    //   name: 'Color Picker',
    //   description: 'Pick colors',
    //   longDescription: 'Pick colors and get HEX/RGB values instantly.',
    //   buttonText: 'Pick Color',
    //   route: '/color-picker',
    //   category: 'Utility Tools',
    //   seo: {
    //     title: 'Free Color Picker | Pick Colors Get HEX RGB | ToolTrove',
    //     metaDescription: 'Pick colors and get HEX, RGB, and HSL values instantly. Free online color picker.',
    //     keywords: ['color picker', 'pick color', 'hex color', 'RGB color', 'color code picker', 'color from image'],
    //     h1: 'Free Color Picker',
    //     h2: 'Pick Colors & Get Color Codes',
    //     faqs: [
    //       { question: 'How to pick a color?', answer: 'Click on the color picker to select a color and get its HEX, RGB, and HSL values.' }
    //     ]
    //   }
    // },
    // { 
    //   id: 'uuid-generator',
    //   name: 'UUID Generator',
    //   description: 'Generate unique IDs',
    //   longDescription: 'Generate UUIDs for development and testing purposes.',
    //   buttonText: 'Generate UUID',
    //   route: '/uuid-generator',
    //   category: 'Utility Tools',
    //   seo: {
    //     title: 'Free UUID Generator | Generate UUIDs Online | ToolTrove',
    //     metaDescription: 'Generate UUIDs for development and testing. Free online UUID generator.',
    //     keywords: ['UUID generator', 'generate UUID', 'unique ID generator', 'GUID generator', 'UUID maker'],
    //     h1: 'Free UUID Generator',
    //     h2: 'Generate Unique UUIDs',
    //     faqs: [
    //       { question: 'How to generate a UUID?', answer: 'Click generate to create a new unique UUID for your applications.' }
    //     ]
    //   }
    // }
  ];

  // Get all categories
  getCategories(): ToolCategory[] {
    return this.categories.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  // Get all tools as flat list
  getAllTools(): Tool[] {
    return [...this.tools];
  }

  // Get tools by category
  getToolsByCategory(categoryName: string): Tool[] {
    return this.tools.filter(tool => tool.category === categoryName);
  }

  // Get tool categories (for backward compatibility)
  getToolCategories(): ToolCategory[] {
    return this.categories
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(category => ({
        ...category,
        tools: this.tools.filter(tool => tool.category === category.name)
      }));
  }
}
