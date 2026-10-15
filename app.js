/**
 * SCARE-GUARD LAB
 * 偽クリーナー警告・手口解剖シミュレーター (Educational Script)
 */

document.addEventListener('DOMContentLoaded', () => {
  initSimulator();
  initSensoryEffects();
  initUrlChecker();
  initDefenseConsole();
});

/* ==========================================================================
   1. Simulator Engine
   ========================================================================== */
function initSimulator() {
  const btnXray = document.getElementById('btn-mode-xray');
  const btnRaw = document.getElementById('btn-mode-raw');
  const btnSceneWeb = document.getElementById('btn-scene-web');
  const btnSceneApp = document.getElementById('btn-scene-app');
  const topbarChrome = document.getElementById('topbar-chrome');
  const topbarApp = document.getElementById('topbar-app');
  const viewWebScare = document.getElementById('view-web-scare');
  const viewAppScare = document.getElementById('view-app-scare');
  const btnFakeClose = document.getElementById('btn-fake-close');
  const fakeAppCleanBtn = document.getElementById('fake-app-clean-btn');

  // Scenario Switching (Web Browser vs In-App Interstitial)
  let currentScene = 'web';

  const SCENE_PINS = {
    web: [
      { id: 'pin-1', top: '-30px', left: '60%', label: '怪しいドメイン', title: 'Googleとは無関係な不審ドメイン', desc: 'URLが「google.com」ではなく、取得したばかりの怪しい無関係なドメイン（.xyzなど）です。SSL暗号化（鍵マーク）があっても詐欺サイトは作れます。' },
      { id: 'pin-2', top: '25px', left: '20%', label: 'Googleロゴ無断偽装', title: 'Google・Androidロゴの無断盗用', desc: 'Android端末からのアクセス（User-Agent）をJavaScriptで判別し、Google公式ロゴを無断表示して信用させようとしています。' },
      { id: 'pin-3', top: '135px', right: '10%', label: '架空のバッテリー破損', title: 'Android特有「バッテリー破損」の嘘', desc: '「バッテリーが48.7%破損」「ウイルス4件」などの数字は、ただのランダムな作り話です。Webブラウザは端末内部のバッテリーやウイルスを検査する権限を持ちません。' },
      { id: 'pin-4', top: '280px', left: '15%', label: '心理誘導タイマー', title: '焦燥感を煽るカウントダウン', desc: '「残り2分以内に修復しないとSIMが無効化」などのタイマーは、冷静に考える時間を奪い焦ってクリックさせる心理的誘導（ダークパターン）です。' },
      { id: 'pin-5', top: 'auto', bottom: '40px', right: '15%', label: '高額課金アプリ誘導', title: '怪しいクリーナーアプリ誘導', desc: '「今すぐ修復」「クリーナーをインストール」をクリックすると、高額定期課金アプリ（週額数千円）や危険な野良アプリの画面へ転送されます。' }
    ],
    app: [
      { id: 'pin-1', top: '15px', left: '40%', label: '悪質広告枠', title: 'アプリ内広告（Malvertising）の悪用', desc: '無料ゲームや便利アプリに組み込まれた「広告配信システム」をすり抜けて、悪質な詐欺広告が全画面で表示されています。アプリ開発者自身ではなく悪質広告主の仕業です。' },
      { id: 'pin-2', top: '100px', left: '25%', label: 'システム偽装', title: 'Android公式システム風の偽装枠', desc: '「Androidシステムメンテナンス」と書かれていますが、単なる広告画面です。アプリ内の広告枠が端末のウイルスを検知することは技術的に不可能です。' },
      { id: 'pin-3', top: '185px', right: '12%', label: '架空のメモリ圧迫', title: '根拠のない「メモリ89%圧迫」の嘘', desc: 'ゲームの動作やCPUの損傷を騙って焦らせています。Androidのメモリ管理はOSが自動で行っており、外部クリーナーによる強制解放は不要です。' },
      { id: 'pin-4', top: '15px', right: '8%', left: 'auto', label: '極小の「×」罠', title: '誤タップを狙う極小「×」ボタン', desc: '閉じようとして指で押そうとすると、枠が小さすぎて広告本体を誤タップし、Playストアへ飛ばされるよう巧妙に設計されたダークパターンです。' },
      { id: 'pin-5', top: 'auto', bottom: '35px', right: '15%', label: '怪しいクリーナーへ誘導', title: '高額クリーナーアプリのインストール誘導', desc: '「メモリ解放とウイルス除去」を押すと、Google Playの高額定期購入アプリや、広告をさらに垂れ流す別のアドウェアを入れさせられます。' }
    ]
  };

  function updatePinsForScene(scene) {
    const pinConfigs = SCENE_PINS[scene];
    pinConfigs.forEach(cfg => {
      const pinEl = document.getElementById(cfg.id);
      const labelEl = document.getElementById(`${cfg.id}-label`);
      if (pinEl) {
        pinEl.style.top = cfg.top || 'auto';
        pinEl.style.bottom = cfg.bottom || 'auto';
        pinEl.style.left = cfg.left || 'auto';
        pinEl.style.right = cfg.right || 'auto';
        pinEl.setAttribute('data-title', cfg.title);
        pinEl.setAttribute('data-desc', cfg.desc);
        if (labelEl) labelEl.textContent = cfg.label;
      }
    });
  }

  btnSceneWeb.addEventListener('click', () => {
    currentScene = 'web';
    btnSceneWeb.classList.add('active');
    btnSceneApp.classList.remove('active');
    topbarChrome.classList.remove('hidden');
    topbarApp.classList.add('hidden');
    viewWebScare.classList.remove('hidden');
    viewAppScare.classList.add('hidden');
    updatePinsForScene('web');
    inspectorTitle.textContent = '💡 Webブラウザ閲覧時の手口解説';
    inspectorDesc.textContent = 'Webサイト閲覧中に突然全画面で表示されるスケアウェアの手口です。ピンをクリックして詳細を確認できます。';
  });

  btnSceneApp.addEventListener('click', () => {
    currentScene = 'app';
    btnSceneApp.classList.add('active');
    btnSceneWeb.classList.remove('active');
    topbarChrome.classList.add('hidden');
    topbarApp.classList.remove('hidden');
    viewWebScare.classList.add('hidden');
    viewAppScare.classList.remove('hidden');
    updatePinsForScene('app');
    inspectorTitle.textContent = '💡 無料アプリ利用中（アプリ内不正広告）の手口解説';
    inspectorDesc.textContent = '無料ゲーム等のプレイ中に突然割り込んでくる全画面広告（インタースティシャル広告）の手口です。ピンをクリックして詳細を確認できます。';
  });

  // Tiny fake close button handler
  if (btnFakeClose) {
    btnFakeClose.addEventListener('click', (e) => {
      e.stopPropagation();
      alert(
        "🎯【手口の解説：極小の「×」閉じるボタンの罠】\n\n" +
        "悪質な広告は「×」ボタンを意図的に小さくしたり、当たり判定を狭くすることで、" +
        "閉じようとした指を誤タップさせてGoogle Playのダウンロードページへ誘導しようとします。\n\n" +
        "安全に閉じるには、Androidのホームボタンやタスク一覧からアプリ自体を終了するのが確実です。"
      );
    });
  }

  // In-app fake clean button handler
  if (fakeAppCleanBtn) {
    fakeAppCleanBtn.addEventListener('click', () => {
      alert(
        "🛑【安全な教育用インターセプト（アプリ内広告型）】\n\n" +
        "このボタンを押すと、Google Playストアの怪しいクリーナーアプリ（週額1,000円〜数千円の自動継続課金）へ飛ばされます。\n\n" +
        "無料ゲームの開発者が悪意を持っているわけではなく、広告ネットワーク（アドネットワーク）の審査をすり抜けた不正広告（Malvertising）です。\n" +
        "対処法：端末のホームボタンを押してゲームを閉じ、あまりにも悪質な広告が出るアプリはアンインストールしましょう。"
      );
    });
  }

  // Inspection Pins Interaction
  const pins = document.querySelectorAll('.inspect-pin');
  pins.forEach(pin => {
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      pins.forEach(p => p.classList.remove('active'));
      pin.classList.add('active');

      const title = pin.getAttribute('data-title');
      const desc = pin.getAttribute('data-desc');

      inspectorTitle.textContent = `🔍 ${title}`;
      inspectorDesc.textContent = desc;

      inspectorPoint.innerHTML = `
        <strong>Androidユーザー向け見抜き方のコツ：</strong>
        <span>Google公式の保護機能（Google Play プロテクト）は端末内で静かに働き、Webサイト上で「バッテリーが破損」「ウイルス4件」と叫んでクリーナーを急かすことは絶対にありません。</span>
      `;
    });
  });

  // Fake Countdown Timer Logic
  let timeLeft = 119;
  const timerDisplay = document.getElementById('fake-timer');

  setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
    } else {
      timeLeft = 119; // Loop to demonstrate the bluff
    }
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }, 1000);

  // Fake Scan Re-run Animation
  function runFakeScan() {
    fakeProgressFill.style.width = '0%';
    scanStatusText.textContent = 'Android メモリとストレージを解析中...';
    setTimeout(() => {
      fakeProgressFill.style.width = '60%';
      scanStatusText.textContent = 'ウイルス（Trojan.AndroidOS）を検出中...';
    }, 400);
    setTimeout(() => {
      fakeProgressFill.style.width = '100%';
      scanStatusText.textContent = 'Android システムスキャン完了：重大な脅威あり';
    }, 1200);
  }

  btnResetSim.addEventListener('click', runFakeScan);

  // Educational Interception on Click (Android specific)
  fakeCleanBtn.addEventListener('click', () => {
    alert(
      "🛑【安全な教育用インターセプト（Android向け解説）】\n\n" +
      "このボタンを押すと、実際の詐欺サイトでは以下のような被害につながります：\n\n" +
      "1. Google Playの怪しいクリーナーアプリへ誘導（週額1,000円〜数千円の自動継続課金）\n" +
      "2. 野良APKファイル（マルウェア本体）を直接ダウンロードさせ、端末の完全乗っ取りを試みる\n" +
      "3. 「Google セキュリティ」を騙る偽のサポート窓口や詐欺広告の無限ループ\n\n" +
      "正解の対処法は「画面のボタンは触らず、Chromeのタブを右上のタブ数アイコンから閉じること」です。"
    );
  });
}

/* ==========================================================================
   2. Sensory Effects (Safe Web Audio & Vibration Simulation)
   ========================================================================== */
function initSensoryEffects() {
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  const audioBtnText = document.getElementById('audio-btn-text');
  const btnTestVibrate = document.getElementById('btn-test-vibrate');
  const mockWindow = document.getElementById('mock-window');

  let audioCtx = null;
  let isPlayingSound = false;
  let soundInterval = null;

  // Web Audio Alarm Synthesizer
  function startAlarmSound() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlayingSound = true;
    btnToggleSound.classList.add('active');
    audioBtnText.textContent = '🔇 音を停止（再生中）';

    let freqToggle = false;

    // Dual-tone emergency siren simulation
    function playBeep() {
      if (!isPlayingSound) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freqToggle ? 880 : 660, audioCtx.currentTime);
      freqToggle = !freqToggle;

      // Soft envelope to avoid harsh popping
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    }

    playBeep();
    soundInterval = setInterval(playBeep, 240);

    // Auto stop after 6 seconds to prevent annoying the user
    setTimeout(() => {
      if (isPlayingSound) {
        stopAlarmSound();
      }
    }, 6000);
  }

  function stopAlarmSound() {
    isPlayingSound = false;
    clearInterval(soundInterval);
    btnToggleSound.classList.remove('active');
    audioBtnText.textContent = '🔊 偽警告音をテスト（Web Audio）';
  }

  btnToggleSound.addEventListener('click', () => {
    if (isPlayingSound) {
      stopAlarmSound();
    } else {
      startAlarmSound();
    }
  });

  // Vibration & Screen Shake Simulation
  btnTestVibrate.addEventListener('click', () => {
    // 1. Mobile Vibration API
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 300]);
    }

    // 2. Visual Shake for desktop and feedback
    mockWindow.classList.add('device-shaking');
    setTimeout(() => {
      mockWindow.classList.remove('device-shaking');
    }, 1500);
  });
}

/* ==========================================================================
   3. Scam URL Pattern Checker Engine
   ========================================================================== */
function initUrlChecker() {
  const urlInput = document.getElementById('url-input');
  const btnAnalyze = document.getElementById('btn-analyze-url');
  const riskLevelBadge = document.getElementById('risk-level-badge');
  const riskScore = document.getElementById('risk-score');
  const domainExtracted = document.getElementById('domain-extracted');
  const breakdownList = document.getElementById('breakdown-list');
  const checkerAdvice = document.getElementById('checker-advice');
  const sampleChips = document.querySelectorAll('.sample-chip');

  const SUSPICIOUS_TLDS = [
    'xyz', 'top', 'click', 'live', 'loan', 'work', 'monster', 'fit', 
    'rest', 'buzz', 'club', 'online', 'site', 'support', 'space', 'cfd'
  ];

  const TRUSTED_DOMAINS = [
    'apple.com', 'microsoft.com', 'google.com', 'support.apple.com', 
    'support.microsoft.com', 'support.google.com', 'android.com'
  ];

  const BRAND_KEYWORDS = ['apple', 'microsoft', 'google', 'windows', 'ios', 'android', 'defender', 'safari'];
  const SCARE_KEYWORDS = ['security', 'cleaner', 'virus', 'alert', 'fix', 'repair', 'protect', 'scan', 'speedup', 'warning'];

  function analyzeUrl(rawUrl) {
    let urlString = rawUrl.trim();
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      urlString = 'https://' + urlString;
    }

    let parsed;
    try {
      parsed = new URL(urlString);
    } catch (e) {
      alert('有効なURL形式を入力してください（例: https://example.xyz）');
      return;
    }

    const hostname = parsed.hostname.toLowerCase();
    domainExtracted.innerHTML = `対象ホスト: <code>${hostname}</code>`;

    let score = 0; // Scam score out of 100
    const reasons = [];

    // Check trusted whitelist first
    const isWhitelisted = TRUSTED_DOMAINS.some(trusted => hostname === trusted || hostname.endsWith('.' + trusted));

    if (isWhitelisted) {
      riskLevelBadge.className = 'result-risk-level safe';
      riskLevelBadge.textContent = '安全性：公式・正規ドメイン (SAFE)';
      riskScore.textContent = '詐欺確率: 1%';
      breakdownList.innerHTML = `
        <li class="breakdown-item safe">
          <span>✅</span>
          <div><strong>正規の公式ドメインです：</strong> <code>${hostname}</code> は主要ベンダーの正規ドメインとして確認されています。</div>
        </li>
        <li class="breakdown-item safe">
          <span>✅</span>
          <div><strong>ブランド名の正当な使用：</strong> 第三者による偽装サブドメインではありません。</div>
        </li>
      `;
      checkerAdvice.innerHTML = `
        <strong>💡 安全確認：</strong> 本物の公式サポートページです。ただし公式ページであっても「残り○分で破損」などの焦燥感を煽る警告が出ることはありません。
      `;
      return;
    }

    // Heuristic 1: Suspicious TLD check
    const tld = hostname.split('.').pop();
    if (SUSPICIOUS_TLDS.includes(tld)) {
      score += 35;
      reasons.push({
        type: 'danger',
        text: `不審な無料・格安TLD（.${tld}）：スケアウェアやフィッシング詐欺で使い捨てられる頻度が極めて高いドメイン末尾です。`
      });
    }

    // Heuristic 2: Brand keyword spoofing
    const foundBrands = BRAND_KEYWORDS.filter(b => hostname.includes(b));
    const foundScares = SCARE_KEYWORDS.filter(s => hostname.includes(s));

    if (foundBrands.length > 0 && foundScares.length > 0) {
      score += 45;
      reasons.push({
        type: 'danger',
        text: `大手ブランド名と警告用語の複合偽装（${foundBrands.join(', ')} × ${foundScares.join(', ')}）：公式サイトを装ってユーザーを錯覚させる典型的なスケアウェアのネーミングです。`
      });
    } else if (foundScares.length >= 2) {
      score += 30;
      reasons.push({
        type: 'warning',
        text: `過度なセキュリティ・警告キーワードの羅列（${foundScares.join(', ')}）：不安を煽る目的のドメイン名です。`
      });
    }

    // Heuristic 3: Excessive hyphens in domain
    const hyphenCount = (hostname.match(/-/g) || []).length;
    if (hyphenCount >= 3) {
      score += 20;
      reasons.push({
        type: 'warning',
        text: `ドメイン内のハイフン過多（${hyphenCount}個）：正規サービスでは珍しく、詐欺サイト特有の長い複合文字列です。`
      });
    }

    // Heuristic 4: IP address or numbers in domain
    const hasIpLike = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(hostname);
    if (hasIpLike) {
      score += 40;
      reasons.push({
        type: 'danger',
        text: `IPアドレス形式の混入：正規企業は通常IPアドレスではなく正式な独自ドメインを使用します。`
      });
    } else if (/\d{2,}/.test(hostname)) {
      score += 10;
      reasons.push({
        type: 'warning',
        text: `ドメイン末尾のランダム数値：ドメインがBANされた際に番号を変えて量産する手口の特徴です。`
      });
    }

    // Normalize score
    score = Math.min(score, 99);
    if (score < 20) score = 25; // default suspicion for unknown domain

    // Render result
    if (score >= 70) {
      riskLevelBadge.className = 'result-risk-level danger';
      riskLevelBadge.textContent = '危険度：極めて高い (CRITICAL)';
    } else if (score >= 40) {
      riskLevelBadge.className = 'result-risk-level warning';
      riskLevelBadge.textContent = '危険度：要注意・不審 (WARNING)';
    } else {
      riskLevelBadge.className = 'result-risk-level safe';
      riskLevelBadge.textContent = '危険度：低 (LOW RISK)';
    }

    riskScore.textContent = `詐欺確率: ${score}%`;

    breakdownList.innerHTML = reasons.map(r => `
      <li class="breakdown-item ${r.type}">
        <span>${r.type === 'danger' ? '🔴' : '🟡'}</span>
        <div>${r.text}</div>
      </li>
    `).join('');

    checkerAdvice.innerHTML = `
      <strong>🛡️ 対処のアドバイス：</strong>
      このURLが表示された場合は<strong>絶対に画面内のリンクやボタンをクリックせず</strong>、タブをそのまま閉じてください。個人情報やアプリのダウンロードは厳禁です。
    `;
  }

  btnAnalyze.addEventListener('click', () => {
    analyzeUrl(urlInput.value);
  });

  sampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const url = chip.getAttribute('data-url');
      urlInput.value = url;
      analyzeUrl(url);
    });
  });

  // Run initial analysis on load
  analyzeUrl(urlInput.value);
}



/* ==========================================================================
   5. Interactive Defense Console (CleanerShield Demo)
   ========================================================================== */
function initDefenseConsole() {
  const btnVpnBlock = document.getElementById('btn-test-vpn-block');
  const btnNoticeBlock = document.getElementById('btn-test-notice-block');
  const btnAppScan = document.getElementById('btn-test-app-scan');

  const vpnCountEl = document.getElementById('demo-vpn-count');
  const noticeCountEl = document.getElementById('demo-notice-count');
  const appCountEl = document.getElementById('demo-app-count');
  const logBox = document.getElementById('console-log-box');

  let vpnCount = 14;
  let noticeCount = 3;
  let appCount = 1;

  function appendLog(type, text) {
    const time = new Date().toLocaleTimeString('ja-JP', { hour12: false });
    const line = document.createElement('div');
    line.className = `log-line ${type}`;
    line.textContent = `[${time}] ${text}`;
    logBox.insertBefore(line, logBox.firstChild);

    // Keep log limited to 8 items
    while (logBox.children.length > 8) {
      logBox.removeChild(logBox.lastChild);
    }
  }

  // 1. Test VPN Block
  btnVpnBlock.addEventListener('click', () => {
    vpnCount++;
    vpnCountEl.textContent = vpnCount;
    const sampleDomains = [
      'android-system-speedup-cleaner.xyz',
      'popup-virus-alert-cleaner.top',
      'device-optimize-warning.click',
      'malware-cleaner-instant.live'
    ];
    const picked = sampleDomains[Math.floor(Math.random() * sampleDomains.length)];
    appendLog('block', `[方式①: VPN遮断] 不正広告ドメイン「${picked}」へのDNSクエリを 0.0.0.0 で即座に遮断しました。`);
  });

  // 2. Test Notification Cancel
  btnNoticeBlock.addEventListener('click', () => {
    noticeCount++;
    noticeCountEl.textContent = noticeCount;
    const sampleNotices = [
      { text: '⚠️ ウイルスが5件検出されました！', app: 'com.speed.supercleaner' },
      { text: '🔋 バッテリーが破損しています！今すぐ冷却', app: 'com.battery.saver.booster' },
      { text: '🚨 メモリが88%圧迫されています！解放推奨', app: 'com.ram.cleaner.free' }
    ];
    const picked = sampleNotices[Math.floor(Math.random() * sampleNotices.length)];
    appendLog('notice', `[方式②: 偽通知消去] 偽警告「${picked.text}」を検知して自動消去しました（送信元: ${picked.app}）`);
  });

  // 3. Test App Scanner
  btnAppScan.addEventListener('click', () => {
    btnAppScan.disabled = true;
    btnAppScan.textContent = '🔍 診断中...';
    appendLog('safe', '[方式③: アプリ診断] 端末内のサードパーティアプリ（54件）の権限スキャンを開始...');

    setTimeout(() => {
      appCount = 2;
      appCountEl.textContent = appCount;
      btnAppScan.disabled = false;
      btnAppScan.textContent = '🔍 端末内の不審アプリを診断スキャン';
      appendLog('danger', '[方式③: 危険アプリ検出] 「超速クリーナー・節電Pro (com.ultra.cleaner.pro)」を特定！理由: 重ねて表示(SYSTEM_ALERT_WINDOW)および起動時常駐権限を悪用。アンインストールを推奨。');
      alert(
        "🛡️【CleanerShield アプリ診断完了】\n\n" +
        "危険なアドウェア/偽クリーナーを1件検出しました！\n" +
        "・対象アプリ: 超速クリーナー・節電Pro (com.ultra.cleaner.pro)\n" +
        "・検出理由: 「他のアプリの上に重ねて表示」権限を悪用し、ゲーム中やホーム画面に全画面広告を割り込ませています。\n\n" +
        "実際のAndroidアプリでは、このダイアログからワンタップでアンインストール画面を開いて削除できます。"
      );
    }, 1200);
  });
}
