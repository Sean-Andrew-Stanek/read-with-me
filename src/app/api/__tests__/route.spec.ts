import { POST } from '../route';
import { NextResponse } from 'next/server';

describe('POST API Route', () => {
  it('should return 400 if token is missing', async () => {
    const request = {
      json: async () => ({}),
    } as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'Missing token' });
  });

  it('should return 401 if token is invalid', async () => {
    const request = {
      json: async () => ({ token: 'invalidToken' }),
    } as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ error: 'Invalid Token' });
  });

  it('should return story data if token is valid', async () => {
    const request = {
      json: async () => ({ token: 'validToken' }),
    } as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      story:
        'Lily tiptoed through the dark forest, her flashlight flickering. The wind whispered through the trees, sending shivers down her spine. Suddenly, she spotted a small, glowing stone on the ground. As she picked it up, the forest lit up around her, revealing a hidden path. Was it magic? She took a deep breath and stepped forward, ready for adventure.',
      gradeLevel: 6,
    });
  });

  it('should return 500 if an error occurs', async () => {
    const request = {
        json: async () => {
            throw new Error('Test error');
        },
    } as unknown as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Server error' });
  });
});