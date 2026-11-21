// A gta6-meme-x-01 entry (Node 22, standard library only): it copies POST.json from the
// repository root to /output/POST.json, where the gate reads it. That is all the program
// has to do. The entry is the post itself: the meme was made by an AI agent, it is posted
// on X from a public account with make.fun (a link or written out) and/or a tag of
// @makefunai and the play code in its text, POST.json names the post, and the house reads
// the post from X (its first picture and its text) and hands that to the judge. Nothing
// this program writes about the post is judged.
//
// The POST.json this repository ships holds the post's address. Replace it with your
// post's address before you submit.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for
// /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The post's address must be a real X status address, never the starter placeholder:
// https://x.com/<handle>/status/<id> (or the same on twitter.com), the id digits only.
const POST_URL = /^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/;
const postPath = join(BOT_DIR, 'POST.json');
const post = JSON.parse(readFileSync(postPath, 'utf8')) as { url?: unknown };
if (typeof post.url !== 'string' || !POST_URL.test(post.url)) {
  console.error(`POST.json does not name an X post's address: ${postPath}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(postPath, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
