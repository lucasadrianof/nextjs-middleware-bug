import { NextProxy, NextResponse, ProxyConfig} from "next/server";

export const proxy: NextProxy = async (request) => {
  if (request.method === 'POST') {
    const body = await request.json()

    console.log('Proxy - body length: %d bytes', new TextEncoder().encode(JSON.stringify(body)).length)
  }

  return NextResponse.next();
};

export const config: ProxyConfig = {
  matcher: '/'
}
