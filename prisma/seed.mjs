import pg from 'pg';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const defaultContent = {
    'nav.brand': 'Anjana Suresh',
    'hero.label': 'Interior Design Studio',
    'hero.title': 'Designing Spaces That Tell',
    'hero.titleAccent': 'Your Story',
    'hero.subtitle': 'Crafting bespoke interiors that blend beauty, function, and soul.',
    'hero.cta': 'View Projects',
    'about.label': 'About Me',
    'about.heading': 'Where Creativity Meets Purpose',
    'about.description': "With an eye for detail and a passion for transforming spaces, I create interiors that are as functional as they are beautiful. Every project begins with listening — understanding your lifestyle, your aspirations, and the way you inhabit your space.",
    'about.stat1.number': '5+',
    'about.stat1.label': 'Years Experience',
    'about.stat2.number': '40+',
    'about.stat2.label': 'Projects Completed',
    'about.stat3.number': '100%',
    'about.stat3.label': 'Client Satisfaction',
    'about.quote': '"Design is not just what it looks like — design is how it works."',
    'aboutPage.heading': 'Designing spaces that reflect who you are.',
    'aboutPage.story': "I'm Anjana Suresh, an interior designer based in India. With over 5 years of experience, I've had the privilege of transforming homes, offices, and commercial spaces into environments that inspire and delight.",
    'aboutPage.story2': 'My approach begins with listening. Every space has a story waiting to be told, and every client has a vision waiting to be realized. I blend modern aesthetics with functional design to create interiors that are not just beautiful, but deeply personal.',
    'aboutPage.philosophy': 'Good design is invisible. It should feel natural, effortless, and deeply connected to the people who inhabit the space. I believe in the power of light, texture, and proportion to transform how we feel in our everyday environments.',
    'aboutPage.tools': 'SketchUp & AutoCAD for spatial planning|D5 Render & V-Ray for photorealistic visualization|Material sourcing and vendor coordination|On-site project management',
    'services.label': 'Services',
    'services.heading': 'What I Offer',
    'services.1.title': 'Residential Design',
    'services.1.desc': 'Complete home interiors — from concept to completion. Living rooms, bedrooms, kitchens, and more.',
    'services.2.title': 'Commercial Spaces',
    'services.2.desc': 'Office interiors, retail spaces, and co-working environments designed for productivity and brand identity.',
    'services.3.title': '3D Visualization',
    'services.3.desc': 'Photorealistic renders and 3D walkthroughs so you can experience your space before construction begins.',
    'services.4.title': 'Consultation',
    'services.4.desc': 'Expert guidance on layout, materials, lighting, and color schemes for your project.',
    'contact.label': 'Get In Touch',
    'contact.heading': "Let's bring your vision to life.",
    'contact.description': "Whether you're planning a renovation, building from scratch, or simply looking for design guidance — I'd love to hear about your project.",
    'contact.email': 'hello@anjanasuresh.com',
    'contact.location': 'India',
    'contact.cta': "Let's Work Together",
    'footer.copyright': '© 2025 Anjana Suresh. All rights reserved.',
    'footer.tagline': 'Designing spaces that inspire.',
    'social.instagram': 'https://instagram.com',
    'social.linkedin': 'https://linkedin.com',
    'social.pinterest': 'https://pinterest.com',
};

async function main() {
    const client = await pool.connect();
    console.log('Seeding database...');

    // Admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await client.query(
        `INSERT INTO "AdminUser" (id, name, email, password, "createdAt")
     VALUES (gen_random_uuid(), $1, $2, $3, now())
     ON CONFLICT (email) DO NOTHING`,
        ['Anjana Suresh', 'anjana@admin.in', hashedPassword]
    );
    console.log('Admin user created');

    // Site content
    for (const [key, value] of Object.entries(defaultContent)) {
        await client.query(
            `INSERT INTO "SiteContent" (id, key, value)
       VALUES ($1, $1, $2)
       ON CONFLICT (key) DO NOTHING`,
            [key, value]
        );
    }
    console.log('Site content seeded (' + Object.keys(defaultContent).length + ' entries)');

    client.release();
    await pool.end();
    console.log('Done!');
}

main().catch(console.error);
