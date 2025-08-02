/**
 * Root Layout
 * 
 * This is the root layout component that wraps all pages in the application.
 * It defines the HTML structure, metadata, and global styles.
 * 
 * Related files:
 * - /app/(root)/layout.tsx: Main application layout with navigation
 * - /app/(auth)/layout.tsx: Authentication pages layout
 * - /app/globals.css: Global styles and CSS variables
 */

// Import necessary types and components
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// Initialize Mona Sans font with specific configuration
const monaSans = Mona_Sans({
  variable: "--font-mona-sans",  // CSS variable name for the font
  subsets: ["latin"],            // Character subsets to optimize loading
});

// Define metadata for the application
// This is used for SEO and browser tab information
export const metadata: Metadata = {
  title: "Intervia",
  description: "An AI-powered platform for preparing for mock interviews.",
};

/**
 * RootLayout Component
 * 
 * @param children - Child components to be rendered within the layout
 * @returns The root layout component with HTML structure and global providers
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // HTML document with dark mode enabled by default
    <html lang="en" className="dark">
      <body className={`${monaSans.variable} font-sans`}>
        {/* Main content */}
        {children}
        
        {/* Toast notifications provider */}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
