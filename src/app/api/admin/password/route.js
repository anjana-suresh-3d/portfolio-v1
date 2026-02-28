import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function PUT(request) {
    try {
        const { currentPassword, newPassword, email } = await request.json();

        if (!currentPassword || !newPassword || !email) {
            return NextResponse.json({ error: 'All fields required' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await prisma.adminUser.update({
            where: { email },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }
}
