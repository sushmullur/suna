import './globals.css'
import { Inter } from 'next/font/google'
import Head from 'next/head'; // Import the Head component

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Suna',
  description: 'Your physical therapy companion',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/* Add the favicon link here */}
        <link rel="icon" href="/icon.ico" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
