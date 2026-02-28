import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, message, projectType } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
        }

        // For production, integrate with Resend or Nodemailer:
        // import { Resend } from 'resend';
        // const resend = new Resend(process.env.RESEND_API_KEY);
        // await resend.emails.send({
        //   from: 'portfolio@anjanasuresh.com',
        //   to: process.env.ADMIN_EMAIL,
        //   subject: `New inquiry from ${name}`,
        //   text: `Name: ${name}\nEmail: ${email}\nProject Type: ${projectType || 'N/A'}\n\n${message}`,
        // });

        console.log('Contact form submission:', { name, email, message, projectType });

        return NextResponse.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
