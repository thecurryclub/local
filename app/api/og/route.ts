import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'The Curry Club'
  const img = searchParams.get('img') || ''
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          color: '#0f172a',
          background: '#fff7ed',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '48px 64px',
        }}
      >
        <div style={{display:'flex',flexDirection:'column',gap:24,maxWidth:780}}>
          <div style={{fontSize: 28, color: '#db7f06'}}>THE CURRY CLUB</div>
          <div style={{fontWeight: 800, lineHeight: 1.1}}>{title}</div>
        </div>
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} width={420} height={420} alt="" style={{objectFit:'cover', borderRadius:24}} />
        ) : null}
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
