import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'data', 'dashboard.json');

export async function GET() {
  try {
    const file = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(file);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to read dashboard' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const newItem = await req.json();
    const file = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(file);

    data.push(newItem);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save dashboard item' }), { status: 500 });
  }
}
