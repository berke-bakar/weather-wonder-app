import { Layout } from '@/components/dom/Layout'
import '@/global.css'
import Head from './head'

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='antialiased'>
      <head>
        <Head />
      </head>
      <body>
        {/* To avoid FOUT with styled-components wrap Layout with StyledComponentsRegistry https://beta.nextjs.org/docs/styling/css-in-js#styled-components */}
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
