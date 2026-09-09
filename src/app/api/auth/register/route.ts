import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, role = 'attendee' } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = fullName ? String(fullName).trim() : cleanEmail.split('@')[0];

    const supabaseAdmin = createAdminClient();

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    
    let targetUserId: string | null = null;
    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === cleanEmail
    );

    if (existingUser) {
      targetUserId = existingUser.id;
      // Auto-confirm existing user and update password so they can log in seamlessly
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
        email_confirm: true,
        password: password,
        user_metadata: {
          full_name: cleanName,
          role: role,
        },
      });

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message || 'Failed to update existing account.' },
          { status: 400 }
        );
      }
    } else {
      // Create confirmed user directly via Admin API (bypasses email rate limit!)
      const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: cleanName,
          role: role,
        },
      });

      if (createError) {
        return NextResponse.json(
          { error: createError.message || 'Failed to create user account.' },
          { status: 400 }
        );
      }

      targetUserId = created.user?.id || null;
    }

    // Sync to public.users table
    if (targetUserId) {
      try {
        await (supabaseAdmin.from('users') as any).upsert({
          id: targetUserId,
          email: cleanEmail,
          full_name: cleanName,
          role: role,
          updated_at: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.warn('public.users upsert non-fatal error:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'User registered and confirmed successfully.',
      userId: targetUserId,
    });
  } catch (err: any) {
    console.error('Registration API error:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}
