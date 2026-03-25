import { Injectable } from '@angular/core';
import { ToolCategory } from '../models/tool-category';
import { Tool } from '../models/tool';

@Injectable({
  providedIn: 'root'
})
export class ToolConfigService {

  // Separate categories list
  private readonly categories: ToolCategory[] = [
    { name: 'Career Tools', order: 1 },
    { name: 'PDF Tools', order: 2 },
    { name: 'Image Tools', order: 3 },
    { name: 'Calculator Tools', order: 4 },
    { name: 'Developer Tools', order: 5 },
    { name: 'Utility Tools', order: 6 }
  ];

  // Flat list of all tools
  private readonly tools: Tool[] = [
    // Career Tools
    // {
    //   id: 'resume',
    //   name: 'Resume Builder',
    //   description: 'Create professional resumes',
    //   longDescription: 'Build ATS-friendly resumes with customizable layouts, live preview, and export options to stand out to recruiters.',
    //   buttonText: 'Build Resume',
    //   route: '/resume',
    //   category: 'Career Tools'
    // },
    // {
    //   id: 'cover-letter',
    //   name: 'Cover Letter Generator',
    //   description: 'Generate cover letters',
    //   longDescription: 'Create personalized and impactful cover letters tailored to job roles in seconds.',
    //   buttonText: 'Generate Letter',
    //   route: '/cover-letter',
    //   category: 'Career Tools'
    // },
    // {
    //   id: 'ats-checker',
    //   name: 'ATS Resume Checker',
    //   description: 'Check ATS compatibility',
    //   longDescription: 'Analyze your resume for ATS compatibility and improve keyword optimization and formatting.',
    //   buttonText: 'Check Resume',
    //   route: '/ats-checker',
    //   category: 'Career Tools'
    // },
    // {
    //   id: 'job-description',
    //   name: 'Job Description Generator',
    //   description: 'Create job descriptions',
    //   longDescription: 'Generate clear, structured, and professional job descriptions for hiring or understanding roles.',
    //   buttonText: 'Create JD',
    //   route: '/job-description',
    //   category: 'Career Tools'
    // },
    // {
    //   id: 'portfolio-builder',
    //   name: 'Portfolio Builder',
    //   description: 'Create personal portfolio',
    //   longDescription: 'Build a modern personal portfolio website to showcase your projects and achievements.',
    //   buttonText: 'Build Portfolio',
    //   route: '/portfolio-builder',
    //   category: 'Career Tools'
    // },
    // {
    //   id: 'salary-calculator',
    //   name: 'Salary Calculator',
    //   description: 'Estimate salary breakdown',
    //   longDescription: 'Calculate salary breakdown including taxes, deductions, and net income instantly.',
    //   buttonText: 'Calculate Salary',
    //   route: '/salary-calculator',
    //   category: 'Career Tools'
    // },
    // {
    //   id: 'interview-questions',
    //   name: 'Interview Questions',
    //   description: 'Generate interview questions',
    //   longDescription: 'Prepare for interviews with curated and AI-generated questions across domains.',
    //   buttonText: 'Practice Now',
    //   route: '/interview-questions',
    //   category: 'Career Tools'
    // },
    // {
    //   id: 'skill-analyzer',
    //   name: 'Skill Analyzer',
    //   description: 'Analyze your skills',
    //   longDescription: 'Evaluate your skills and identify strengths and improvement areas for career growth.',
    //   buttonText: 'Analyze Skills',
    //   route: '/skill-analyzer',
    //   category: 'Career Tools'
    // },

    // PDF Tools
    {
      id: 'pdf-merge',
      name: 'Merge PDF',
      description: 'Combine multiple PDFs',
      longDescription: 'Merge multiple PDF files into one document quickly and securely.',
      buttonText: 'Merge Now',
      route: '/pdf-merge',
      category: 'PDF Tools'
    },
    // {
    //   id: 'pdf-split',
    //   name: 'Split PDF',
    //   description: 'Split PDF into files',
    //   longDescription: 'Split large PDFs into smaller files or extract selected pages easily.',
    //   buttonText: 'Split PDF',
    //   route: '/pdf-split',
    //   category: 'PDF Tools'
    // },
    // {
    //   id: 'pdf-compress',
    //   name: 'Compress PDF',
    //   description: 'Reduce PDF size',
    //   longDescription: 'Compress PDF files without losing quality for faster sharing.',
    //   buttonText: 'Compress Now',
    //   route: '/pdf-compress',
    //   category: 'PDF Tools'
    // },
    // {
    //   id: 'pdf-to-word',
    //   name: 'PDF to Word',
    //   description: 'Convert PDF to Word',
    //   longDescription: 'Convert PDF documents into editable Word files with high accuracy.',
    //   buttonText: 'Convert Now',
    //   route: '/pdf-to-word',
    //   category: 'PDF Tools'
    // },
    // {
    //   id: 'word-to-pdf',
    //   name: 'Word to PDF',
    //   description: 'Convert Word to PDF',
    //   longDescription: 'Convert Word documents into high-quality PDF files instantly.',
    //   buttonText: 'Convert Now',
    //   route: '/word-to-pdf',
    //   category: 'PDF Tools'
    // },
    // {
    //   id: 'pdf-to-image',
    //   name: 'PDF to Image',
    //   description: 'Convert PDF to images',
    //   longDescription: 'Convert PDF pages into high-quality images (JPG/PNG).',
    //   buttonText: 'Convert Now',
    //   route: '/pdf-to-image',
    //   category: 'PDF Tools'
    // },
    // {
    //   id: 'image-to-pdf',
    //   name: 'Image to PDF',
    //   description: 'Convert images to PDF',
    //   longDescription: 'Combine multiple images into a single PDF document.',
    //   buttonText: 'Create PDF',
    //   route: '/image-to-pdf',
    //   category: 'PDF Tools'
    // },
    // {
    //   id: 'pdf-rotate',
    //   name: 'Rotate PDF',
    //   description: 'Rotate PDF pages',
    //   longDescription: 'Rotate PDF pages to correct orientation easily.',
    //   buttonText: 'Rotate Now',
    //   route: '/pdf-rotate',
    //   category: 'PDF Tools'
    // },
    // {
    //   id: 'pdf-delete-pages',
    //   name: 'Delete PDF Pages',
    //   description: 'Remove pages from PDF',
    //   longDescription: 'Delete unwanted pages from your PDF files quickly.',
    //   buttonText: 'Delete Pages',
    //   route: '/pdf-delete-pages',
    //   category: 'PDF Tools'
    // },
    // {
    //   id: 'pdf-extract-pages',
    //   name: 'Extract Pages',
    //   description: 'Extract pages from PDF',
    //   longDescription: 'Extract selected pages from a PDF into a new file.',
    //   buttonText: 'Extract Now',
    //   route: '/pdf-extract-pages',
    //   category: 'PDF Tools'
    // },

    // Image Tools
    // {
    //   id: 'image-compress',
    //   name: 'Compress Image',
    //   description: 'Reduce image size',
    //   longDescription: 'Compress images to reduce file size while maintaining quality.',
    //   buttonText: 'Compress Now',
    //   route: '/image-compress',
    //   category: 'Image Tools'
    // },
    // {
    //   id: 'image-resize',
    //   name: 'Resize Image',
    //   description: 'Resize image dimensions',
    //   longDescription: 'Resize images to custom dimensions without losing quality.',
    //   buttonText: 'Resize Image',
    //   route: '/image-resize',
    //   category: 'Image Tools'
    // },
    // {
    //   id: 'jpg-to-png',
    //   name: 'JPG to PNG',
    //   description: 'Convert JPG to PNG',
    //   longDescription: 'Convert JPG images to PNG format instantly.',
    //   buttonText: 'Convert Now',
    //   route: '/jpg-to-png',
    //   category: 'Image Tools'
    // },
    // {
    //   id: 'png-to-jpg',
    //   name: 'PNG to JPG',
    //   description: 'Convert PNG to JPG',
    //   longDescription: 'Convert PNG images to JPG format easily.',
    //   buttonText: 'Convert Now',
    //   route: '/png-to-jpg',
    //   category: 'Image Tools'
    // },
    // {
    //   id: 'image-crop',
    //   name: 'Crop Image',
    //   description: 'Crop images easily',
    //   longDescription: 'Crop images to desired dimensions with precision.',
    //   buttonText: 'Crop Image',
    //   route: '/image-crop',
    //   category: 'Image Tools'
    // },
    // {
    //   id: 'image-rotate',
    //   name: 'Rotate Image',
    //   description: 'Rotate images',
    //   longDescription: 'Rotate images to any angle with ease.',
    //   buttonText: 'Rotate Image',
    //   route: '/image-rotate',
    //   category: 'Image Tools'
    // },
    // {
    //   id: 'image-flip',
    //   name: 'Flip Image',
    //   description: 'Flip images',
    //   longDescription: 'Flip images horizontally or vertically instantly.',
    //   buttonText: 'Flip Image',
    //   route: '/image-flip',
    //   category: 'Image Tools'
    // },
    // {
    //   id: 'grayscale',
    //   name: 'Grayscale Image',
    //   description: 'Convert image to grayscale',
    //   longDescription: 'Convert colored images into grayscale format.',
    //   buttonText: 'Convert Now',
    //   route: '/grayscale',
    //   category: 'Image Tools'
    // },
    // {
    //   id: 'image-base64',
    //   name: 'Image to Base64',
    //   description: 'Convert image to Base64',
    //   longDescription: 'Encode images into Base64 format for web use.',
    //   buttonText: 'Encode Now',
    //   route: '/image-base64',
    //   category: 'Image Tools'
    // },
    // {
    //   id: 'base64-image',
    //   name: 'Base64 to Image',
    //   description: 'Convert Base64 to image',
    //   longDescription: 'Decode Base64 strings into image files.',
    //   buttonText: 'Decode Now',
    //   route: '/base64-image',
    //   category: 'Image Tools'
    // },

    // Calculator Tools
    // {
    //   id: 'percentage',
    //   name: 'Percentage Calculator',
    //   description: 'Calculate percentages',
    //   longDescription: 'Easily calculate percentages, increases, and decreases.',
    //   buttonText: 'Calculate Now',
    //   route: '/percentage',
    //   category: 'Calculator Tools'
    // },
    // {
    //   id: 'emi',
    //   name: 'EMI Calculator',
    //   description: 'Calculate loan EMI',
    //   longDescription: 'Calculate monthly EMI for loans based on interest and tenure.',
    //   buttonText: 'Calculate EMI',
    //   route: '/emi',
    //   category: 'Calculator Tools'
    // },
    // {
    //   id: 'age',
    //   name: 'Age Calculator',
    //   description: 'Calculate age',
    //   longDescription: 'Find your exact age in years, months, and days.',
    //   buttonText: 'Calculate Age',
    //   route: '/age',
    //   category: 'Calculator Tools'
    // },
    // {
    //   id: 'bmi',
    //   name: 'BMI Calculator',
    //   description: 'Calculate BMI',
    //   longDescription: 'Calculate Body Mass Index and check health status.',
    //   buttonText: 'Check BMI',
    //   route: '/bmi',
    //   category: 'Calculator Tools'
    // },
    // {
    //   id: 'discount',
    //   name: 'Discount Calculator',
    //   description: 'Calculate discounts',
    //   longDescription: 'Calculate final price after discounts quickly.',
    //   buttonText: 'Calculate Discount',
    //   route: '/discount',
    //   category: 'Calculator Tools'
    // },
    // {
    //   id: 'gst',
    //   name: 'GST Calculator',
    //   description: 'Calculate GST',
    //   longDescription: 'Calculate GST amount and final price instantly.',
    //   buttonText: 'Calculate GST',
    //   route: '/gst',
    //   category: 'Calculator Tools'
    // },
    // {
    //   id: 'time-diff',
    //   name: 'Time Difference',
    //   description: 'Calculate time difference',
    //   longDescription: 'Calculate time difference between two dates or times.',
    //   buttonText: 'Calculate Time',
    //   route: '/time-diff',
    //   category: 'Calculator Tools'
    // },
    // {
    //   id: 'unit-converter',
    //   name: 'Unit Converter',
    //   description: 'Convert units',
    //   longDescription: 'Convert units across categories like length, weight, and temperature.',
    //   buttonText: 'Convert Now',
    //   route: '/unit-converter',
    //   category: 'Calculator Tools'
    // },

    // Developer Tools
    // {
    //   id: 'json-formatter',
    //   name: 'JSON Formatter',
    //   description: 'Format JSON data',
    //   longDescription: 'Format and beautify JSON for better readability.',
    //   buttonText: 'Format JSON',
    //   route: '/json-formatter',
    //   category: 'Developer Tools'
    // },
    // {
    //   id: 'json-validator',
    //   name: 'JSON Validator',
    //   description: 'Validate JSON',
    //   longDescription: 'Validate JSON structure and detect errors instantly.',
    //   buttonText: 'Validate JSON',
    //   route: '/json-validator',
    //   category: 'Developer Tools'
    // },
    // {
    //   id: 'base64-encode',
    //   name: 'Base64 Encode',
    //   description: 'Encode text',
    //   longDescription: 'Convert text into Base64 encoding format.',
    //   buttonText: 'Encode Now',
    //   route: '/base64-encode',
    //   category: 'Developer Tools'
    // },
    // {
    //   id: 'base64-decode',
    //   name: 'Base64 Decode',
    //   description: 'Decode Base64',
    //   longDescription: 'Decode Base64 strings into readable text.',
    //   buttonText: 'Decode Now',
    //   route: '/base64-decode',
    //   category: 'Developer Tools'
    // },
    // {
    //   id: 'url-encode',
    //   name: 'URL Encoder',
    //   description: 'Encode URLs',
    //   longDescription: 'Encode URLs for safe transmission.',
    //   buttonText: 'Encode URL',
    //   route: '/url-encode',
    //   category: 'Developer Tools'
    // },
    // {
    //   id: 'url-decode',
    //   name: 'URL Decoder',
    //   description: 'Decode URLs',
    //   longDescription: 'Decode encoded URLs back to normal format.',
    //   buttonText: 'Decode URL',
    //   route: '/url-decode',
    //   category: 'Developer Tools'
    // },

    // Utility Tools
    // {
    //   id: 'qr-generator',
    //   name: 'QR Code Generator',
    //   description: 'Generate QR codes',
    //   longDescription: 'Generate QR codes for URLs, text, or contact details.',
    //   buttonText: 'Generate QR',
    //   route: '/qr-generator',
    //   category: 'Utility Tools'
    // },
    // {
    //   id: 'qr-scanner',
    //   name: 'QR Code Scanner',
    //   description: 'Scan QR codes',
    //   longDescription: 'Scan QR codes using your device camera instantly.',
    //   buttonText: 'Scan Now',
    //   route: '/qr-scanner',
    //   category: 'Utility Tools'
    // },
    // {
    //   id: 'password-generator',
    //   name: 'Password Generator',
    //   description: 'Generate strong passwords',
    //   longDescription: 'Generate secure and strong passwords instantly.',
    //   buttonText: 'Generate Password',
    //   route: '/password-generator',
    //   category: 'Utility Tools'
    // },
    // {
    //   id: 'text-case',
    //   name: 'Text Case Converter',
    //   description: 'Convert text case',
    //   longDescription: 'Convert text between uppercase, lowercase, and more.',
    //   buttonText: 'Convert Text',
    //   route: '/text-case',
    //   category: 'Utility Tools'
    // },
    // {
    //   id: 'word-counter',
    //   name: 'Word Counter',
    //   description: 'Count words',
    //   longDescription: 'Count words, characters, and sentences instantly.',
    //   buttonText: 'Count Now',
    //   route: '/word-counter',
    //   category: 'Utility Tools'
    // },
    // {
    //   id: 'random-generator',
    //   name: 'Random Generator',
    //   description: 'Generate random values',
    //   longDescription: 'Generate random numbers, strings, or values easily.',
    //   buttonText: 'Generate Now',
    //   route: '/random-generator',
    //   category: 'Utility Tools'
    // },
    // {
    //   id: 'color-picker',
    //   name: 'Color Picker',
    //   description: 'Pick colors',
    //   longDescription: 'Pick colors and get HEX/RGB values instantly.',
    //   buttonText: 'Pick Color',
    //   route: '/color-picker',
    //   category: 'Utility Tools'
    // },
    // {
    //   id: 'uuid-generator',
    //   name: 'UUID Generator',
    //   description: 'Generate unique IDs',
    //   longDescription: 'Generate UUIDs for development and testing purposes.',
    //   buttonText: 'Generate UUID',
    //   route: '/uuid-generator',
    //   category: 'Utility Tools'
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
