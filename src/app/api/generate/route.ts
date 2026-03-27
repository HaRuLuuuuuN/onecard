import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  const { keyword } = await request.json();

  if (!keyword || typeof keyword !== 'string' || keyword.trim() === '') {
    return new Response(JSON.stringify({ error: 'キーワードを入力してください' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const prompt = `あなたはワンピースカードゲームの攻略サイト「ONECARD攻略」のコンテンツライターです。
以下のキーワードをもとに、以下の4つのコンテンツを日本語で作成してください。

キーワード: ${keyword.trim()}

以下の形式で、マーカーを使って出力してください（マーカーは必ずそのままの文字列で出力してください）：

===TITLE===
（魅力的な記事タイトルを1つ書いてください。読者が思わずクリックしたくなる、SEOを意識した35〜50文字程度のタイトル）

===STRUCTURE===
（記事の構成を番号付きリストで書いてください。各見出しには簡単な説明も加えてください。6〜8つの見出しを目安に）

===BODY===
（記事本文の下書きを書いてください。1500〜2500文字程度。各見出しに沿って肉付けし、具体的なカード名や戦術も交えてください）

===XPOST===
（X（旧Twitter）への投稿文を書いてください。140文字以内、ハッシュタグを2〜3個含め、記事へ誘導するような文章にしてください）

===END===`;

  const stream = client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}
