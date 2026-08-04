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
      <div class="quiz-q-body">${q.question}</div>
      ${q.type === 'fill' ? `
        <div class="quiz-answer-input">
          <input type="text" class="quiz-input" placeholder="填入答案..." data-answer="${q.answer}">
          <button class="quiz-check-btn">检查</button>
        </div>
      ` : ''}
      <div class="quiz-reveal" style="display:none;">
        <div class="quiz-answer-label">参考答案</div>
        <div class="quiz-answer-text">${q.answer}</div>
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
  let answered = 0;
  let correct = 0;

  // 填空题检查
  container.querySelectorAll('.quiz-check-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const q = e.target.closest('.quiz-question');
      const input = q.querySelector('.quiz-input');
      const userAns = input.value.trim();
      const correctAns = input.dataset.answer;

      if (!userAns) return;

      const isCorrect = userAns.includes(correctAns) || correctAns.includes(userAns);
      input.classList.add(isCorrect ? 'input-correct' : 'input-wrong');

      const reveal = q.querySelector('.quiz-reveal');
      reveal.style.display = 'block';
      e.target.style.display = 'none';

      // 显示正确/错误按钮
      q.querySelector('.quiz-reveal-btn').style.display = 'none';
      q.querySelector('.quiz-correct-btn').style.display = 'inline-block';
      q.querySelector('.quiz-wrong-btn').style.display = 'inline-block';

      // 自动标记
      if (isCorrect) correct++;
      answered++;
      updateProgress(container, answered, questions.length);
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
        q.querySelector('.quiz-correct-btn').style.display = 'inline-block';
        q.querySelector('.quiz-wrong-btn').style.display = 'inline-block';
      }
    });
  });

  // 正确/错误按钮
  container.querySelectorAll('.quiz-correct-btn, .quiz-wrong-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const q = e.target.closest('.quiz-question');
      if (q.dataset.graded) return;
      q.dataset.graded = '1';

      // 如果之前是填空题自动检查过的,不重复计数
      const wasFillAuto = q.querySelector('.quiz-input')?.classList.contains('input-correct') ||
                          q.querySelector('.quiz-input')?.classList.contains('input-wrong');
      if (!wasFillAuto) {
        answered++;
        if (e.target.dataset.correct === '1') correct++;
        updateProgress(container, answered, questions.length);
      }

      q.querySelector('.quiz-correct-btn').style.display = 'none';
      q.querySelector('.quiz-wrong-btn').style.display = 'none';
      q.classList.add(e.target.dataset.correct === '1' ? 'quiz-q-correct' : 'quiz-q-wrong');
    });
  });

  // 重做
  const retryBtn = container.querySelector('#quiz-retry');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      location.hash = `#/article/${slug}/quiz`;
      location.reload();
    });
  }

  function updateProgress(container, answered, total) {
    const fill = container.querySelector('#quiz-progress-fill');
    if (fill) fill.style.width = `${(answered / total) * 100}%`;

    if (answered >= total) {
      showResult();
    }
  }

  function showResult() {
    // 修正:填空题已自动计分,问答题需重新统计自评
    let finalCorrect = correct;
    container.querySelectorAll('.quiz-question').forEach((q) => {
      if (q.dataset.graded === '1' && !q.querySelector('.quiz-input')) {
        // 问答题自评
        if (q.classList.contains('quiz-q-correct')) finalCorrect++;
      }
    });
    // 去重(上面 correct 已包含部分)
    finalCorrect = Math.min(correct, questions.length);

    const result = container.querySelector('#quiz-result');
    const score = container.querySelector('#quiz-score');
    const feedback = container.querySelector('#quiz-feedback');
    const pct = Math.round((correct / questions.length) * 100);

    container.querySelector('#quiz-questions').style.display = 'none';
    result.style.display = 'block';
    score.textContent = `${correct} / ${questions.length} (${pct}%)`;

    if (pct >= 80) {
      feedback.textContent = '掌握得不错!可以进入下一篇了。';
    } else if (pct >= 50) {
      feedback.textContent = '基本掌握,建议回看错题对应的章节。';
    } else {
      feedback.textContent = '需要加强,建议重新通读全文后再来。';
    }
  }
}
