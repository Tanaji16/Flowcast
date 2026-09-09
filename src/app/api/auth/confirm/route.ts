'use strict';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { userId, email, fullName } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey || serviceRoleKey.includes('placeholder')) {
      return NextResponse.json({ ok: true, note: 'Skipped admin auto-confirm' });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    await supabaseAdmin.auth.admin.updateUserById(userId, {
      email_confirm: true,
    });

    try {
      await supabaseAdmin.from('users').upsert({
        id: userId,
        email: email || '',
        full_name: fullName || '',
        role: 'attendee',
        updated_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn('public.users upsert non-blocking error:', dbErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Confirm error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
