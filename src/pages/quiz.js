/**
 * quiz.js —— 章末测验页
 *
 * 从 frontmatter 的 keypoints 生成题:
 * - keypoints 里的问句(含?) → 直接作为问答题
 * - keypoints 里的陈述句 → 转成"填空/判断"题(关键词挖空)
 *
 * 交互:
 * - 每题可展开看答案(引用回原文位置)
 * - 做完后统计正确率
 * - 答案引用可点击跳回文章对应章节
 */

import manifest from '../data/manifest.json';
import { escapeHtml } from '../utils/escape.js';

export async function renderQuiz(container, slug) {
  const meta = manifest.find((a) => a.slug === slug);
  if (!meta) {
    container.innerHTML = `<div class="error-state"><h2>文章不存在</h2></div>`;
    return;
  }

  const questions = generateQuestions(meta);

  if (questions.length === 0) {
    container.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-header">
          <a href="#/article/${slug}" class="quiz-back">← 返回阅读</a>
          <h1>${meta.title} · 测验</h1>
        </div>
        <div class="quiz-empty">
          <p>本篇暂无结构化考点。</p>
          <p>建议通读全文后,自行总结核心知识点。</p>
          <a href="#/article/${slug}" class="quiz-btn">去阅读</a>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-header">
        <a href="#/article/${slug}" class="quiz-back">← 返回阅读</a>
        <h1>${meta.title} · 测验</h1>
        <span class="quiz-count">${questions.length} 题</span>
      </div>
      <div class="quiz-progress-strip">
        <div class="quiz-progress-fill" id="quiz-progress-fill"></div>
      </div>
      <div class="quiz-questions" id="quiz-questions">
        ${questions.map((q, i) => renderQuestion(q, i)).join('')}
      </div>
      <div class="quiz-result" id="quiz-result" style="display:none;">
        <h2 id="quiz-score"></h2>
        <p id="quiz-feedback"></p>
        <button class="quiz-btn" id="quiz-retry">再做一遍</button>
        <a href="#/article/${slug}" class="quiz-btn quiz-btn-secondary">回文章复习</a>
      </div>
    </div>
  `;

  setupQuizInteraction(container, questions);
}

/**
 * 从 keypoints 生成题目
 */
function generateQuestions(meta) {
  const questions = [];

  if (!meta.keypoints) return questions;

  for (const kp of meta.keypoints) {
    // 问句(含?)→ 直接作问答题
    if (kp.includes('?') || kp.includes('？')) {
      questions.push({
        type: 'open',
        question: kp,
        hint: '思考 30 秒后点击查看参考答案',
        answer: '参考文章对应章节的讲解。核心要点见原文考点 callout。',
      });
    } else {
      // 陈述句 → 关键词挖空成填空题
      const words = kp.match(/[\u4e00-\u9fa5]{3,6}|[A-Z][a-z]+(?:[A-Z][a-z]+)*/g);
      if (words && words.length > 0) {
        // 选最长的词挖空
        const target = words.sort((a, b) => b.length - a.length)[0];
        if (kp.includes(target) && target.length >= 3) {
          const blanked = kp.replace(target, '______');
          questions.push({
            type: 'fill',
            question: blanked,
            answer: target,
            fullKeypoint: kp,
          });
          continue;
        }
      }
      // 兜底:陈述句作判断题(关键词记忆)
      questions.push({
        type: 'recall',
        question: kp,
        hint: '回忆这个要点的关键细节',
        answer: '参考文章对应章节的讲解。',
      });
    }
  }

  return questions;
}

function renderQuestion(q, index) {
  const typeLabel = { open: '问答题', fill: '填空题', recall: '记忆点' }[q.type] || '题';
  return `
    <div class="quiz-question" data-index="${index}">
      <div class="quiz-q-header">
        <span class="quiz-q-num">${index + 1}</span>
        <span class="quiz-q-type">${typeLabel}</span>
      </div>
      <div class="quiz-q-body">${escapeHtml(q.question)}</div>
      ${q.type === 'fill' ? `
        <div class="quiz-answer-input">
          <input type="text" class="quiz-input" placeholder="填入答案..." data-answer="${escapeHtml(q.answer)}">
          <button class="quiz-check-btn">检查</button>
        </div>
      ` : ''}
      <div class="quiz-reveal" style="display:none;">
        <div class="quiz-answer-label">参考答案</div>
        <div class="quiz-answer-text">${escapeHtml(q.answer)}</div>
      </div>
      <div class="quiz-q-actions">
        <button class="quiz-reveal-btn">显示答案</button>
        <button class="quiz-correct-btn" style="display:none;" data-correct="1">答对了</button>
        <button class="quiz-wrong-btn" style="display:none;" data-correct="0">需要复习</button>
      </div>
    </div>
  `;
}

function setupQuizInteraction(container, questions) {
  // 分数唯一事实源:题目元素的 DOM 状态(data-graded + .quiz-q-correct),
  // 不再维护闭包计数器(原实现填空自评无法修正、showResult 里有死代码)
  const countAnswered = () => container.querySelectorAll('.quiz-question[data-graded]').length;
  const countCorrect = () => container.querySelectorAll('.quiz-question[data-graded].quiz-q-correct').length;

  // 规范化:忽略空白和大小写,判对只比"包含正确答案"这一个方向
  // (原实现双向 includes,用户只输 1 个字也算对)
  const normalize = (s) => String(s).replace(/\s/g, '').toLowerCase();

  function markQuestion(q, isCorrect) {
    q.dataset.graded = '1';
    q.classList.remove('quiz-q-correct', 'quiz-q-wrong');
    q.classList.add(isCorrect ? 'quiz-q-correct' : 'quiz-q-wrong');
    updateProgress();
  }

  function showSelfEval(q) {
    q.querySelector('.quiz-reveal-btn').style.display = 'none';
    q.querySelector('.quiz-correct-btn').style.display = 'inline-block';
    q.querySelector('.quiz-wrong-btn').style.display = 'inline-block';
  }

  // 填空题检查
  container.querySelectorAll('.quiz-check-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const q = e.target.closest('.quiz-question');
      const input = q.querySelector('.quiz-input');
      const userAns = input.value.trim();
      const correctAns = input.dataset.answer;

      if (!userAns) return;

      const isCorrect = normalize(userAns).includes(normalize(correctAns));
      input.classList.add(isCorrect ? 'input-correct' : 'input-wrong');

      q.querySelector('.quiz-reveal').style.display = 'block';
      e.target.style.display = 'none';
      showSelfEval(q);

      // 自动判定计入,但用户仍可用下方自评按钮修正误判
      markQuestion(q, isCorrect);
    });
  });

  // 显示答案(问答题/记忆点)
  container.querySelectorAll('.quiz-reveal-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const q = e.target.closest('.quiz-question');
      const reveal = q.querySelector('.quiz-reveal');
      const hasInput = q.querySelector('.quiz-input');

      if (!hasInput) {
        reveal.style.display = 'block';
        e.target.style.display = 'none';
        showSelfEval(q);
      }
    });
  });

  // 正确/错误自评按钮(填空题自动判定后也可用此修正)
  container.querySelectorAll('.quiz-correct-btn, .quiz-wrong-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const q = e.target.closest('.quiz-question');
      markQuestion(q, e.target.dataset.correct === '1');

      q.querySelector('.quiz-correct-btn').style.display = 'none';
      q.querySelector('.quiz-wrong-btn').style.display = 'none';
    });
  });

  // 重做:直接重新渲染,不整页刷新
  const retryBtn = container.querySelector('#quiz-retry');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      renderQuiz(container, slug);
    });
  }

  function updateProgress() {
    const answered = countAnswered();
    const fill = container.querySelector('#quiz-progress-fill');
    if (fill) fill.style.width = `${(answered / questions.length) * 100}%`;

    if (answered >= questions.length) {
      showResult();
    }
  }

  function showResult() {
    const finalCorrect = countCorrect();
    const total = questions.length;
    const pct = Math.round((finalCorrect / total) * 100);

    const result = container.querySelector('#quiz-result');
    container.querySelector('#quiz-questions').style.display = 'none';
    result.style.display = 'block';
    container.querySelector('#quiz-score').textContent = `${finalCorrect} / ${total} (${pct}%)`;

    const feedback = container.querySelector('#quiz-feedback');
    if (pct >= 80) {
      feedback.textContent = '掌握得不错!可以进入下一篇了。';
    } else if (pct >= 50) {
      feedback.textContent = '基本掌握,建议回看错题对应的章节。';
    } else {
      feedback.textContent = '需要加强,建议重新通读全文后再来。';
    }
  }
}
