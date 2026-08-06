/**
 * podcast.js —— 播客播放页
 *
 * 加载 podcast/scripts/<slug>.json,用 PodcastPlayer 组件渲染
 */

import manifest from '../data/manifest.json';
import { PodcastPlayer } from '../components/podcast-player.js';

export async function renderPodcast(container, slug) {
  const meta = manifest.find((a) => a.slug === slug);
  if (!meta) {
    container.innerHTML = `<div class="error-state"><h2>文章不存在</h2></div>`;
    return;
  }

  container.innerHTML = `
    <div class="podcast-page">
      <div class="podcast-header">
        <a href="#/article/${slug}" class="quiz-back">← 返回阅读</a>
        <h1>${meta.title}</h1>
        <span class="podcast-subtitle">💬 双人播客 · 苏打 × 茉莉</span>
      </div>
      <div id="podcast-mount">
        <div class="loading-state">加载播客脚本...</div>
      </div>
    </div>
  `;

  const mount = container.querySelector('#podcast-mount');

  try {
    // 尝试加载播客脚本(检查 content-type 防 SPA fallback 误判)
    const resp = await fetch(`/podcast/scripts/${slug}.json`);
    if (!resp.ok) throw new Error('no script');
    const ct = resp.headers.get('content-type') || '';
    if (!ct.includes('application/json')) throw new Error('not json');
    const dialogue = await resp.json();

    // 优先探测视频(视频版已包含音频轨,体验更好)
    let videoUrl = null;
    try {
      const videoResp = await fetch(`/podcast/video/${slug}.mp4`, { method: 'HEAD' });
      const vct = videoResp.headers.get('content-type') || '';
      if (videoResp.ok && (vct.includes('video') || vct.includes('octet-stream'))) {
        videoUrl = `/podcast/video/${slug}.mp4`;
      }
    } catch {}

    // audio_url 可能在 dialogue 对象里,也可能需要单独探测
    let audioUrl = dialogue.audio_url || null;
    if (!audioUrl && !videoUrl) {
      try {
        const audioResp = await fetch(`/podcast/audio/${slug}.mp3`, { method: 'HEAD' });
        const ct = audioResp.headers.get('content-type') || '';
        if (audioResp.ok && (ct.includes('audio') || ct.includes('octet-stream'))) {
          audioUrl = `/podcast/audio/${slug}.mp3`;
        }
      } catch {}
    }

    new PodcastPlayer(mount, dialogue, { audioUrl, videoUrl });
  } catch (err) {
    mount.innerHTML = `
      <div class="quiz-empty">
        <p>本篇暂无播客脚本。</p>
        <p>播客正在逐步制作中,先去读文章吧。</p>
        <a href="#/article/${slug}" class="quiz-btn">去阅读</a>
      </div>
    `;
  }
}
