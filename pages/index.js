import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
// import { getSortedPostsData } from '../lib/posts'
import { getBookData } from '../lib/books'
import { useState } from 'react'
import { useRouter } from 'next/router'

// SSG（静的サイトジェネレーション）とSSR（サーバーサイドレンダリング）は
// 同一ページで両方使うことはできない

// export async function getStaticProps() {
//   const allPostsData = getSortedPostsData()
//   return {
//     props: {
//       allPostsData
//     }
//   }

// //   const allPostsData = await getBookData()
// //   return {
// //     props: {
// //       allPostsData
// //     }
// //   }
// }

export async function getServerSideProps(context) {
  //検索キーワード
  const text = context.query.text;
  const allBooksData = await getBookData(text)
  return {
    props: {
      allBooksData
    }
  }
}

export default function Home ({ allBooksData }) {
  const [text, setText] = useState('')
  const [csrResult, setCsrResult] = useState([])
  const [swrResult, setSwrResult] = useState([])
  const router = useRouter();  
  const clickSSRButton = () => {
    //未入力の時
    if (!text) {
      return;
    }

    router.push({
        pathname:"/",       //URL
        query: {text :text} //検索クエリ
      });
  }

  const clickCSRButton = async () => {
    //未入力の時
    if (!text) {
      return;
    }
    const result = await getBookData(text)
    setCsrResult(result)
  }
  // const clickSWRButton =  () => {
  //   const { data, error } = useSWR(
  //     encodeURI('https://www.googleapis.com/books/v1/volumes?q=岡本太郎'),
  //     fetch,
  //   )
  //   if (error) return <div>failed to load</div>
  //   if (!data) return <div>loading...</div>
  //   return <div>hello {data[0].id}!</div>
  // }

// export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>I'm Hiroyuki. I like Reni-chan in Momoiro Clover Z</p>
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      {/* <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, title, date}) => (
            <li className={utilStyles.listItem} key={id}>
              {title}
              <br />
              {id}
              <br />
              {date}
            </li>
          ))}
        </ul>
      </section> */}
      {/* <div>{swrResult}</div> */}
      <input type="text" value={text} onChange={event => setText(event.target.value)}></input>
      {/* <input type="button" value="SWR search" onClick={clickSWRButton}></input> */}
      <input type="button" value="SSR search" onClick={clickSSRButton}></input>
      <input type="button" value="CSR search" onClick={clickCSRButton}></input>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>CSR result</h2>
        <ul className={utilStyles.list}>
          {csrResult ?
             csrResult.map(({ id, volumeInfo}) => (
              <li className={utilStyles.listItem} key={id}>
                {volumeInfo.title}
                <br />
                {id}
                <br />
                {volumeInfo.publishedDate}
              </li>
            )): ''}
            {/* {test !== null ? 'not null' : 'null'} */}
            {/* {() => {return test}} */}
        </ul>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>SSR result</h2>
        <ul className={utilStyles.list}>
          {allBooksData.map(({ id, volumeInfo}) => (
            <li className={utilStyles.listItem} key={id}>
              {volumeInfo.title}
              <br />
              {id}
              <br />
              {volumeInfo.publishedDate}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}