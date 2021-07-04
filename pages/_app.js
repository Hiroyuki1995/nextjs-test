// グローバルCSSを読み込みたい場合は、必ずここから呼び出す
import '../styles/global.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}