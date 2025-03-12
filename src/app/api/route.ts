import { NextResponse } from 'next/server';

export async function GET(request: Request) {
   const { searchParams } = new URL(request.url);
   const token = searchParams.get('token');

   if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
   }

   if (token !== 'validToken') {
    return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
   }

   try {
    const storyData = {
        story: 'Lily tiptoed through the dark forest, her flashlight flickering. The wind whispered through the trees, sending shivers down her spine. Suddenly, she spotted a small, glowing stone on the ground. As she picked it up, the forest lit up around her, revealing a hidden path. Was it magic? She took a deep breath and stepped forward, ready for adventure.',
        gradeLevel: 6,
    };
    return NextResponse.json(storyData);
   } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
   }
}