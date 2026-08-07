/**
 * podcast-player.js —— 播客播放器组件
 *
 * 功能:
 * - 显示双人对白(茉莉/苏打),当前播放句高亮
 * - 播放/暂停/倍速控制
 * - 点击任意对白跳转
 * - 音频可选:有音频文件时同步播放,无音频时模拟逐句推进
 * - 自动滚动跟随当前对白
 *
 * 数据源:podcast/scripts/<slug>.json(dialogue 格式)
 */

import { escapeHtml } from '../utils/escape.js';

export class PodcastPlayer {
  constructor(container, dialogue, options = {}) {
    this.container = container;
    this.dialogue = dialogue;
    this.audioUrl = options.audioUrl || dialogue.audio_url || null;
    // 视频版(优先于音频):视频已含音频轨,体验更好
    this.videoUrl = options.videoUrl || dialogue.video_url || null;
    this.currentIndex = 0;
    this.isPlaying = false;
    this.audio = null;
    this.video = null;
    this.timings = []; // 每句的开始/结束时间(秒)
    // dialogue 可能是数组(旧格式)或对象(含 dialogue 数组 + timings)
    this.dialogueLines = Array.isArray(this.dialogue) ? this.dialogue : this.dialogue.dialogue;

    this.computeTimings();
    this.render();
    this.bindEvents();
  }

  /**
   * 计算时间轴:优先用 dialogue.timings(真实 TTS 时长),否则模拟估算
   */
  computeTimings() {
    // 优先用真实时长(来自 TTS manifest)
    const data = Array.isArray(this.dialogue) ? {} : this.dialogue;
    if (data.timings && data.timings.length === this.dialogueLines.length) {
      this.timings = data.timings.map((t, i) => ({
        start: t.start,
        end: t.end,
        index: i,
      }));
      this.totalDuration = data.total_duration || this.timings[this.timings.length - 1]?.end || 60;
      return;
    }

    // 模拟估算:每字 0.15 秒,最少 2 秒
    let elapsed = 0;
    this.timings = this.dialogueLines.map((line, i) => {
      const charCount = line.text.length;
      const duration = Math.max(2, charCount * 0.15);
      const start = elapsed;
      elapsed += duration;
      return { start, end: elapsed, index: i };
    });
    this.totalDuration = elapsed;
  }

  render() {
    const speakerColors = {
      '苏打': { bg: 'var(--surface)', accent: 'var(--accent)', label: '主讲' },
      '茉莉': { bg: 'var(--accent-soft)', accent: 'var(--accent)', label: '提问' },
    };

    this.container.innerHTML = `
      <div class="podcast-player">
        ${this.videoUrl ? `
          <div class="podcast-video-wrap">
            <video
              id="podcast-video"
              class="podcast-video"
              src="${this.videoUrl}"
              preload="metadata"
              playsinline
              controls
            ></video>
          </div>
        ` : ''}
        <div class="podcast-controls">
          <button class="podcast-play-btn" id="podcast-play">▶</button>
          <div class="podcast-time">
            <span id="podcast-current">0:00</span> / <span id="podcast-total">${formatTime(this.totalDuration)}</span>
          </div>
          <div class="podcast-speed">
            <button data-speed="1" class="active">1x</button>
            <button data-speed="1.5">1.5x</button>
            <button data-speed="2">2x</button>
          </div>
        </div>
        <div class="podcast-progress">
          <div class="podcast-progress-bar" id="podcast-progress-bar"></div>
        </div>
        <div class="podcast-transcript" id="podcast-transcript">
          ${this.dialogueLines.map((line, i) => {
            const sc = speakerColors[line.speaker] || speakerColors['苏打'];
            return `
              <div class="podcast-line" data-index="${i}" style="--speaker-bg: ${sc.bg}; --speaker-accent: ${sc.accent}">
                <div class="podcast-speaker">
                  <span class="podcast-speaker-name">${escapeHtml(line.speaker)}</span>
                  <span class="podcast-speaker-role">${sc.label}</span>
                </div>
                <div class="podcast-text">${escapeHtml(line.text)}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    this.lines = this.container.querySelectorAll('.podcast-line');
    this.playBtn = this.container.querySelector('#podcast-play');
    this.progressBar = this.container.querySelector('#podcast-progress-bar');
    this.currentTimeEl = this.container.querySelector('#podcast-current');
    this.transcriptEl = this.container.querySelector('#podcast-transcript');
    this.videoEl = this.container.querySelector('#podcast-video');
  }

  bindEvents() {
    this.playBtn.addEventListener('click', () => this.toggle());

    // 倍速
    this.container.querySelectorAll('[data-speed]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.speed = parseFloat(btn.dataset.speed);
        this.container.querySelectorAll('[data-speed]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.video) this.video.playbackRate = this.speed;
        if (this.audio) this.audio.playbackRate = this.speed;
      });
    });
    this.speed = 1;

    // video 元素自带的 play/pause 事件同步 controls 按钮状态
    if (this.videoEl) {
      this.videoEl.addEventListener('play', () => {
        if (!this.isPlaying) {
          this.isPlaying = true;
          this.playBtn.textContent = '⏸';
          this.highlightLine(this.currentIndex);
        }
      });
      this.videoEl.addEventListener('pause', () => {
        if (this.isPlaying && this.videoEl.paused) {
          this.isPlaying = false;
          this.playBtn.textContent = '▶';
          if (this.simTimer) clearInterval(this.simTimer);
        }
      });
    }

    // 点击对白跳转
    this.lines.forEach((line, i) => {
      line.addEventListener('click', () => this.seekTo(i));
    });
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.isPlaying = true;
    this.playBtn.textContent = '⏸';

    // 确保当前句有高亮(首次播放时第一句不会被 updateProgress 触发)
    this.highlightLine(this.currentIndex);

    // 优先视频
    if (this.videoEl && !this.video) {
      this.video = this.videoEl;
      this.video.playbackRate = this.speed;
      this.video.addEventListener('timeupdate', () => {
        if (this.isPlaying) this.updateFromVideo();
      });
      this.video.addEventListener('ended', () => this.pause());
      this.video.play().catch(() => {
        // 视频播放失败(404/解码失败):降级到音频或模拟。
        // videoEl 一并置空,防再次进入视频分支形成无限重试递归。
        this.video = null;
        this.videoEl = null;
        this.play();
      });
    } else if (this.video) {
      this.video.play();
    } else if (this.audioUrl && !this.audio) {
      this.audio = new Audio(this.audioUrl);
      this.audio.playbackRate = this.speed;
      this.audio.addEventListener('timeupdate', () => {
        if (this.isPlaying) this.updateFromAudio();
      });
      this.audio.addEventListener('ended', () => this.pause());
      this.audio.play().catch(() => {
        // 音频加载失败,回退到模拟模式
        this.audio = null;
        this.startSimulated();
      });
    } else if (this.audio) {
      this.audio.play();
    } else {
      this.startSimulated();
    }
  }

  pause() {
    this.isPlaying = false;
    this.playBtn.textContent = '▶';
    if (this.video) this.video.pause();
    if (this.audio) this.audio.pause();
    if (this.simTimer) clearInterval(this.simTimer);
  }

  startSimulated() {
    this.simStart = performance.now();
    this.simBaseIndex = this.currentIndex;
    this.simBaseOffset = this.timings[this.currentIndex]?.start || 0;

    this.simTimer = setInterval(() => {
      if (!this.isPlaying) return;
      const elapsed = (performance.now() - this.simStart) / 1000 * this.speed;
      const current = this.simBaseOffset + elapsed;
      this.updateProgress(current);
    }, 100);
  }

  updateFromAudio() {
    this.updateProgress(this.audio.currentTime);
  }

  updateFromVideo() {
    if (this.video) this.updateProgress(this.video.currentTime);
  }

  updateProgress(time) {
    // 更新进度条
    const pct = (time / this.totalDuration) * 100;
    this.progressBar.style.width = pct + '%';
    this.currentTimeEl.textContent = formatTime(time);

    // 找当前句
    let idx = 0;
    for (let i = 0; i < this.timings.length; i++) {
      if (time >= this.timings[i].start) idx = i;
      if (time < this.timings[i].end) break;
    }

    if (idx !== this.currentIndex) {
      this.highlightLine(idx);
    }

    // 播完
    if (time >= this.totalDuration) {
      this.pause();
    }
  }

  highlightLine(index) {
    this.currentIndex = index;
    this.lines.forEach((line, i) => {
      line.classList.toggle('active', i === index);
    });

    // 自动滚动到当前句
    const activeLine = this.lines[index];
    if (activeLine) {
      const containerRect = this.transcriptEl.getBoundingClientRect();
      const lineRect = activeLine.getBoundingClientRect();
      if (lineRect.top < containerRect.top || lineRect.bottom > containerRect.bottom) {
        activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  seekTo(index) {
    this.currentIndex = index;
    const time = this.timings[index]?.start || 0;
    if (this.video) this.video.currentTime = time;
    if (this.audio) this.audio.currentTime = time;
    this.highlightLine(index);
    this.progressBar.style.width = (time / this.totalDuration * 100) + '%';
    this.currentTimeEl.textContent = formatTime(time);

    // 模拟模式下重置时钟,否则下一个 tick 按旧时间轴算,进度跳回原位置
    if (this.simTimer) {
      clearInterval(this.simTimer);
      this.simTimer = null;
      if (this.isPlaying) this.startSimulated();
    }
  }

  /**
   * 销毁:路由切换时由 page-lifecycle 统一调用。
   * 停播放、清定时器、释放媒体引用——否则视频被移除 DOM 后仍在后台出声,
   * 模拟定时器也会永久驻留操作已分离的 DOM。
   */
  destroy() {
    this.pause();
    if (this.video) {
      this.video.removeAttribute('src');
      this.video.load();
    }
    if (this.audio) {
      this.audio.removeAttribute('src');
    }
    this.video = null;
    this.audio = null;
    this.videoEl = null;
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
