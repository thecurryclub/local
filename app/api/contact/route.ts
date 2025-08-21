import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request){
  try {
    const body = await req.json()
    if ((body.company ?? '').toString().trim() !== '') {
      return NextResponse.json({ ok: true })
    }
    const name = (body.name ?? '').toString().trim()
    const email = (body.email ?? '').toString().trim()
    const phone = (body.phone ?? '').toString().trim()
    const venue = (body.venue ?? '').toString().trim()
    const message = (body.message ?? '').toString().trim()
    if (!name || !email || !message) {
      return NextResponse.json({ ok:false, error:'Missing required fields' }, { status: 400 })
    }
    const host = process.env.SMTP_HOST as string
    const port = Number(process.env.SMTP_PORT || 587)
    const user = process.env.SMTP_USER as string
    const pass = process.env.SMTP_PASS as string
    const to   = process.env.CONTACT_TO as string
    if (!host || !user || !pass || !to){
      return NextResponse.json({ ok:false, error:'Server not configured' }, { status: 500 })
    }
    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } })
    const html = `
      <h2>New Curry Club enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Venue:</strong> ${venue}</p>
      <p><strong>Message:</strong><br/>${message.replace(/</g, '&lt;')}</p>
    `
    await transporter.sendMail({ from: { name: 'The Curry Club Website', address: user }, to, replyTo: email || undefined, subject: `New enquiry from ${name} (${venue || 'Venue'})`, html })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok:false, error:'Unexpected error' }, { status: 500 })
  }
}
