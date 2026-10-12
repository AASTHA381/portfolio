/* Super Aastha — a playable version of the portfolio for ?mode=mario.
   Every card reuses text that already appears on index.html. Project pipes read window.PORTFOLIO_CASES,
   the same data that powers the Product decision board. Original pixel art; no Nintendo assets. */
(function(){
  'use strict';

  var TILE = 16, ROWS = 15, VIEW_H = ROWS * TILE, GROUND = 13 * TILE, LW = 392;
  var GRAV = 1400, JUMP_V = 450, DJUMP_V = 400, RUN = 95, TURBO = 135, ACC = 900, MAXFALL = 520;
  var FLAG_X = 375, DOOR_X = 382;
  var RESUME = 'resume/Aastha-Saini-Product-Resume.pdf';
  var EMAIL = 'aastha2000s@gmail.com';
  var LINKEDIN = 'https://www.linkedin.com/in/aastha-saini03/';
  var SKY = '#5c94fc';
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var touch = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);

  // Worlds mirror the page sections (and the world numbers the Mario HUD already uses).
  var ZONES = [
    { id:'about',      world:'1-1', name:'Positioning',     x:0,   cue:null },
    { id:'ai',         world:'1-2', name:'AI judgement',    x:66,  cue:'World 1-2 · AI judgement. AI is a product choice, not the product.' },
    { id:'work',       world:'1-3', name:'Product board',   x:132, cue:null },
    { id:'experience', world:'1-4', name:'Evidence',        x:236, cue:'World 1-4 · Evidence. Each brick is a role; each enemy is a problem tackled in that role.' },
    { id:'approach',   world:'2-1', name:'Operating model', x:316, cue:'World 2-1 · Operating model. Hit every ? block to see how I work.' },
    { id:'contact',    world:'2-2', name:'Next problem',    x:358, cue:'World 2-2 · Next problem. Climb the stairs and grab the flag!' }
  ];

  // Skills section, one per coin.
  var SKILLS = ['Product strategy','PRDs','Competitor benchmarking','App audits','Roadmapping','Jira / Agile','SQL','Python','Power BI','Tableau','ETL','Wireframing','A/B & CTA testing'];

  // Facts. Wording is taken from index.html; only the short spoken "cue" lines are game copy.
  var F = {
    positioning: { id:'positioning', kind:'block', section:'about', tag:'? BLOCK · POSITIONING',
      title:'I build products that make the next decision easier.',
      body:'From an AI purchase verdict to capital planning and team matching, I turn messy choices into clear product systems. I use AI when reasoning or summarisation improves the outcome—and deterministic logic when rules are more reliable.',
      cue:'That’s me in one line.' },
    ambiguity: { id:'ambiguity', kind:'enemy', name:'AMBIGUITY', section:'about', tag:'ENEMY DEFEATED · POSITIONING',
      title:'Ambiguity',
      body:'I turn ambiguous user and operational problems into documented, testable and shipped products.',
      cue:'Ambiguity squashed. Turning it into shipped products is the job.' },
    signal: { id:'signal', kind:'brick', section:'about', tag:'BRICK · 01 / SIGNAL',
      title:'Find the real friction',
      body:'User pain, operational gap or repeated decision—not a feature looking for a problem.',
      cue:'Step 1 of how I build: find the real friction.' },
    judgement: { id:'judgement', kind:'brick', section:'about', tag:'BRICK · 02 / JUDGEMENT',
      title:'Choose the mechanism',
      body:'LLM, on-device ML or deterministic rules based on value, risk and constraints.',
      cue:'Step 2: choose the mechanism.' },
    proof: { id:'proof', kind:'brick', section:'about', tag:'BRICK · 03 / PROOF',
      title:'Ship the artifact',
      body:'A scoped MVP, live interface and PRD with the trade-offs left visible.',
      cue:'Step 3: ship the artifact.' },
    stats: { id:'stats', kind:'block', section:'about', tag:'? BLOCK · VERIFIED PORTFOLIO FACTS',
      title:'By the numbers',
      list:['136 PRDs authored at TradeIndia','3 Generative-AI products','1 On-device ML use case','9 0→1 product builds'],
      cue:'Four numbers from my portfolio.' },

    gen: { id:'gen', kind:'power', power:'gen', label:'AI', color:'#4cd2ff', section:'ai', tag:'POWER-UP · GENERATIVE AI · 3 PRODUCTS',
      title:'Reason & summarise',
      body:'SmartCart uses an LLM for a contextual Buy / Wait / Don\'t buy verdict. LinkVault uses user-selected AI providers to summarise saved resources. AskDocs grounds an LLM in the user\'s own documents to answer with cited sources.',
      chips:['SmartCart · Groq LLM','LinkVault · Groq / OpenAI / Gemini','AskDocs · RAG + Groq'],
      ability:'SUPER SIZE — you can take one extra hit.',
      cue:'Generative AI where explanation is the value. I can take an extra hit now!' },
    ml: { id:'ml', kind:'power', power:'ml', label:'ML', color:'#7fd47f', section:'ai', tag:'POWER-UP · ON-DEVICE ML · 1 USE CASE',
      title:'Verify privately',
      body:'DayFlow uses TensorFlow.js and MobileNet to verify a photo-to-dismiss alarm on device. Its sleep-planning engine remains rule-based.',
      chips:['DayFlow · TensorFlow.js'],
      ability:'DOUBLE JUMP — press jump again in mid-air.',
      cue:'On-device ML unlocked DOUBLE JUMP. Press jump again in mid-air to clear the wall.' },
    rules: { id:'rules', kind:'power', power:'rules', label:'IF', color:'#ffd23f', section:'ai', tag:'POWER-UP · DETERMINISTIC · 5 PRODUCTS',
      title:'Use rules when rules are better',
      body:'Matching scores, financial models, attendance limits, group consensus and study streaks need transparency and predictable outputs—not an LLM.',
      chips:['TeamMatch','YatraYatri','FoodMatch','ClassTrack','PM Study Planner'],
      ability:'TURBO — you run faster.',
      cue:'Rules when rules are better. TURBO: I run faster now.' },
    principle: { id:'principle', kind:'block', section:'ai', tag:'? BLOCK · PM PRINCIPLE',
      title:'PM principle',
      body:'The question is not “Can AI do this?” It is “Does AI create enough user value to justify its uncertainty, cost and failure modes?”',
      cue:'The question I ask before adding AI.' },

    tradeindia: { id:'tradeindia', kind:'brick', section:'experience', tag:'BRICK · APR 2026 — JUN 2026',
      title:'Product Intern · TradeIndia.com',
      body:'Owned the end-to-end product lifecycle across 3 product lines, from user research and ideation through launch and iteration. Managed a computer-vision pipeline for an agritech MVP (Sentinel-2, Google Earth Engine) that cut FPO onboarding verification time by 40%. Drove a 10% DAU lift and better retention through friction analysis, and surfaced 55 bugs & feature gaps through customer discovery. Authored 136 PRDs, BRDs and FSDs for features shipped to production, prioritised with RICE and MoSCoW, and ran CTA optimisation (PBR, Call Now, WhatsApp, Send Inquiry) across prod and pre-prod.',
      chips:['PRDs','RICE / MoSCoW','Computer vision','User research','Retention'],
      cue:'My product internship at TradeIndia. Three problems from it are walking this way…' },
    bugs: { id:'bugs', kind:'enemy', name:'HIDDEN BUGS', section:'experience', tag:'ENEMY DEFEATED · TRADEINDIA',
      title:'55 bugs & feature gaps',
      body:'Surfaced 55 bugs & feature gaps through customer discovery.',
      cue:'Hidden bugs: 55 surfaced.' },
    friction: { id:'friction', kind:'enemy', name:'USER FRICTION', section:'experience', tag:'ENEMY DEFEATED · TRADEINDIA',
      title:'10% DAU lift',
      body:'Drove a 10% DAU lift and better retention through friction analysis.',
      cue:'Friction analysis → 10% DAU lift.' },
    verification: { id:'verification', kind:'enemy', name:'SLOW VERIFICATION', section:'experience', tag:'ENEMY DEFEATED · TRADEINDIA',
      title:'Computer-vision pipeline',
      body:'Managed a computer-vision pipeline for an agritech MVP (Sentinel-2, Google Earth Engine) that cut FPO onboarding verification time by 40%.',
      cue:'Computer vision cut verification time by 40%.' },
    prudent: { id:'prudent', kind:'brick', section:'experience', tag:'BRICK · JAN 2026 — FEB 2026',
      title:'CSR Intern · Prudent Corporate Advisory',
      body:'Built an MIS Excel dashboard from scratch (FY 2026–27) with head-wise, payment-mode & monthly-trend views; compiled a 5-year CSR impact report; drove outreach & 9+ exhibition partnerships for Project Samarth.',
      chips:['MIS','Reporting','Stakeholders'],
      cue:'My CSR internship at Prudent Corporate Advisory.' },
    hcl: { id:'hcl', kind:'brick', section:'experience', tag:'BRICK · AUG 2022 — MAY 2025',
      title:'Analyst · HCLTech',
      body:'Automated financial reporting with Python & SQL (−60% manual cost); built Power BI & Tableau dashboards for ROI & cost KPIs (+25% response time); improved ETL efficiency by +10% and built CI/CD pipelines.',
      chips:['Python','SQL','Power BI','Tableau','ETL'],
      cue:'My analyst years at HCLTech. Three more problems ahead!' },
    manual: { id:'manual', kind:'enemy', name:'MANUAL REPORTS', section:'experience', tag:'ENEMY DEFEATED · HCLTECH',
      title:'−60% manual cost',
      body:'Automated financial reporting with Python & SQL (−60% manual cost).',
      cue:'Manual reports: automated away.' },
    response: { id:'response', kind:'enemy', name:'SLOW RESPONSE', section:'experience', tag:'ENEMY DEFEATED · HCLTECH',
      title:'+25% response time',
      body:'Built Power BI & Tableau dashboards for ROI & cost KPIs (+25% response time).',
      cue:'Dashboards → +25% response time.' },
    etl: { id:'etl', kind:'enemy', name:'ETL DRAG', section:'experience', tag:'ENEMY DEFEATED · HCLTECH',
      title:'ETL efficiency improvement at HCLTech',
      body:'Improved ETL efficiency by +10% and built CI/CD pipelines.',
      cue:'ETL efficiency up 10%.' },

    observe: { id:'observe', kind:'block', section:'approach', tag:'? BLOCK · 01 · OBSERVE', title:'Find repeated friction',
      body:'Start with a real behaviour or operational gap: purchase regret, team imbalance, unsafe capital allocation or a rule students keep calculating by hand.', cue:'01 · Observe.' },
    frame: { id:'frame', kind:'block', section:'approach', tag:'? BLOCK · 02 · FRAME', title:'Write the decision',
      body:'Define the user, problem hypothesis, intended behaviour change, success criteria and smallest useful scope before polishing an interface.', cue:'02 · Frame.' },
    choose: { id:'choose', kind:'block', section:'approach', tag:'? BLOCK · 03 · CHOOSE', title:'Select the mechanism',
      body:'Use an LLM for contextual reasoning or summarisation, on-device ML for private verification, and deterministic logic where predictability matters more.', cue:'03 · Choose.' },
    ship: { id:'ship', kind:'block', section:'approach', tag:'? BLOCK · 04 · SHIP', title:'Build the proof',
      body:'Turn the decision into a testable artifact: working flow, live deployment and full PRD. Scope around constraints instead of hiding them.', cue:'04 · Ship.' },
    learn: { id:'learn', kind:'block', section:'approach', tag:'? BLOCK · 05 · LEARN', title:'Keep unknowns visible',
      body:'Separate shipped functionality from measured impact. If adoption or outcome data is not documented yet, say so rather than manufacturing proof.', cue:'05 · Learn.' },
    output: { id:'output', kind:'block', section:'approach', tag:'? BLOCK · OUTPUT', title:'Decision quality',
      body:'The result is not “more AI.” It is a clearer user decision, a defensible trade-off and an artifact that lets the next conversation become more specific.', cue:'And the output: decision quality.' }
  };

  // Original pixel art. H hair, S skin, E eyes, R mouth, O top, W badge, B jeans, K shoes.
  var HERO_PAL = { H:'#2b1a12', S:'#f2b38a', E:'#111111', R:'#c0392b', O:'#e8702a', W:'#ffffff', B:'#2d4fa0', K:'#111111' };
  var HERO_TOP = [
    '...HHHHHH...',
    '..HHHHHHHH..',
    '.HHSSSSSSHH.',
    '.HSSESSESSH.',
    '.HSSSSSSSSH.',
    '.HHSSRRSSHH.',
    '.HH.SSSS.HH.',
    '.HOOOOOOOOH.',
    '..OOOOOOOO..',
    '.SOOOWWOOOS.',
    '.S.OOOOOO.S.',
    '...BBBBBB...'
  ];
  var HERO_LEGS = {
    stand: ['...BB..BB...','...BB..BB...','...BB..BB...','..KKK..KKK..'],
    walkA: ['..BBB..BB...','.BB.....BB..','.BB......BB.','KKK......KKK'],
    walkB: ['...BBBBBB...','....BBBB....','....BB.BB...','...KKK.KKK..'],
    jump:  ['..BB....BB..','.BB......BB.','KK........KK','............']
  };
  var BUG_PAL = { P:'#7b2fbf', D:'#3d2370', W:'#ffffff', E:'#111111', K:'#111111' };
  var BUG_TOP = ['....PPPP....','..PPPPPPPP..','.PPWWPPWWPP.','.PPWEPPEWPP.','PPPPPPPPPPPP','PPPPPPPPPPPP','.PP.PPPP.PP.','..DDDDDDDD..'];
  var BUG_A = BUG_TOP.concat(['.KK......KK.','KKK......KKK']);
  var BUG_B = BUG_TOP.concat(['..KK....KK..','..KKK..KKK..']);
  var BUG_FLAT = ['PPWEPPPPEWPP','PPPPPPPPPPPP','DDDDDDDDDDDD','KKK......KKK'];
  var CLOUD = ['......WWWW......','....WWWWWWWW....','..WWWWWWWWWWWW..','.WWWWWWWWWWWWWW.','WWWWWWWWWWWWWWWW'];
  var QMARK = ['.XXXX.','XX..XX','....XX','...XX.','..XX..','..XX..','......','..XX..'];

  /* ---------- sprites ---------- */
  function sprite(rows, pal, flip){
    var w = 0, h = rows.length, c = document.createElement('canvas'), g;
    rows.forEach(function(r){ if (r.length > w) w = r.length; });
    c.width = w; c.height = h; g = c.getContext('2d');
    rows.forEach(function(r, y){
      for (var x = 0; x < r.length; x++){
        var col = pal[r.charAt(x)];
        if (col){ g.fillStyle = col; g.fillRect(flip ? w - 1 - x : x, y, 1, 1); }
      }
    });
    return c;
  }
  function blank(w, h){ var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function brickPattern(g, grass){
    g.fillStyle = '#c84c0c'; g.fillRect(0, 0, 16, 16);
    g.fillStyle = '#000'; g.fillRect(0, 7, 16, 1); g.fillRect(0, 15, 16, 1); g.fillRect(0, 0, 1, 7); g.fillRect(8, 8, 1, 7);
    g.fillStyle = '#fc9838'; g.fillRect(1, 0, 6, 1); g.fillRect(9, 8, 6, 1); g.fillRect(1, 8, 6, 1);
    if (grass){ g.fillStyle = '#00a800'; g.fillRect(0, 0, 16, 4); g.fillStyle = '#000'; g.fillRect(0, 4, 16, 1); g.fillStyle = '#58d858'; g.fillRect(0, 0, 16, 1); }
  }
  function blockPattern(g, fill, light, dark){
    g.fillStyle = '#000'; g.fillRect(0, 0, 16, 16);
    g.fillStyle = fill; g.fillRect(1, 1, 14, 14);
    g.fillStyle = light; g.fillRect(1, 1, 14, 1); g.fillRect(1, 1, 1, 14);
    g.fillStyle = dark; g.fillRect(1, 14, 14, 1); g.fillRect(14, 1, 1, 14);
  }
  function rivets(g){ g.fillStyle = '#000'; [[3,3],[12,3],[3,12],[12,12]].forEach(function(p){ g.fillRect(p[0], p[1], 1, 1); }); }
  function hillRows(w, h, ch){
    var rows = [];
    for (var y = 0; y < h; y++){
      var row = '';
      for (var x = 0; x < w; x++){
        var nx = (x + 0.5 - w / 2) / (w / 2), ny = (y + 0.5 - h) / h;
        row += nx * nx + ny * ny <= 1 ? ch : '.';
      }
      rows.push(row);
    }
    return rows;
  }

  var SPR = null;
  function makeSprites(){
    if (SPR) return SPR;
    SPR = { hero:{}, heroL:{} };
    Object.keys(HERO_LEGS).forEach(function(k){
      var rows = HERO_TOP.concat(HERO_LEGS[k]);
      // Arms raised for the jump pose.
      if (k === 'jump'){ rows = rows.slice(); rows[6] = 'SHH.SSSS.HHS'; rows[7] = 'SHOOOOOOOOHS'; rows[8] = '..OOOOOOOO..'; rows[9] = '..OOOWWOOO..'; rows[10] = '...OOOOOO...'; }
      SPR.hero[k] = sprite(rows, HERO_PAL, false);
      SPR.heroL[k] = sprite(rows, HERO_PAL, true);
    });
    SPR.bugA = sprite(BUG_A, BUG_PAL); SPR.bugB = sprite(BUG_B, BUG_PAL); SPR.bugFlat = sprite(BUG_FLAT, BUG_PAL);
    SPR.cloud = sprite(CLOUD, { W:'#ffffff' });
    SPR.hillBig = sprite(hillRows(80, 34, 'G'), { G:'#00a800' });
    SPR.hillSmall = sprite(hillRows(48, 20, 'G'), { G:'#00a800' });
    SPR.bush = sprite(hillRows(16, 9, 'G'), { G:'#38c838' });
    var t;
    t = blank(16, 16); brickPattern(t.getContext('2d'), true); SPR.groundTop = t;
    t = blank(16, 16); brickPattern(t.getContext('2d'), false); SPR.ground = t;
    t = blank(16, 16); brickPattern(t.getContext('2d'), false); (function(g){ g.fillStyle = '#000'; g.fillRect(0, 0, 16, 1); })(t.getContext('2d')); SPR.brick = t;
    SPR.q = [0, 1].map(function(i){
      var c = blank(16, 16), g = c.getContext('2d');
      blockPattern(g, i ? '#fcbc3c' : '#f8b800', '#fce4a0', '#b87800'); rivets(g);
      g.fillStyle = '#8a2c00';
      QMARK.forEach(function(r, y){ for (var x = 0; x < r.length; x++) if (r.charAt(x) === 'X') g.fillRect(5 + x, 4 + y, 1, 1); });
      return c;
    });
    t = blank(16, 16); blockPattern(t.getContext('2d'), '#8a5a2b', '#b07a40', '#4a2e12'); rivets(t.getContext('2d')); SPR.used = t;
    t = blank(16, 16); blockPattern(t.getContext('2d'), '#c84c0c', '#fc9838', '#6b2a00'); SPR.stair = t;
    return SPR;
  }

  /* ---------- level ---------- */
  var S = null;
  function newGame(){
    S = {
      tiles:[], blocks:{}, enemies:[], coins:[], pipes:[], items:[], parts:[], floats:[], bumps:{},
      player:{ x:2 * TILE, y:GROUND - 15, w:10, h:15, vx:0, vy:0, face:1, ground:true, coyote:0, jumps:0, big:false, inv:0, walkT:0, lock:null, cut:false, hidden:false },
      abil:{ gen:false, ml:false, rules:false }, found:{}, opened:{}, visited:{}, skills:0, score:0, time:0,
      zone:-1, checkpoint:2, cam:0, cleared:false, started:false, flagY:3 * TILE + 4, flagPhase:0, flagT:0,
      pipeRef:null, pipeT:0, wallHint:false, total:0, cases:0
    };
    buildLevel(S);
  }

  function buildLevel(s){
    var t = s.tiles, x, y;
    for (y = 0; y < ROWS; y++){ var row = []; for (x = 0; x < LW; x++) row.push('.'); t.push(row); }
    for (x = 0; x < LW; x++){ t[13][x] = 'G'; t[14][x] = 'G'; }
    function pit(a, b){ for (var i = a; i <= b; i++){ t[13][i] = '.'; t[14][i] = '.'; } }
    function col(cx, h){ for (var i = 0; i < h; i++) t[12 - i][cx] = 'S'; }
    function q(cx, cy, fact){ t[cy][cx] = 'Q'; s.blocks[cx + ',' + cy] = { fact:fact }; }
    function br(cx, cy, fact){ t[cy][cx] = 'B'; if (fact) s.blocks[cx + ',' + cy] = { fact:fact }; }
    function bug(cx, fact){ s.enemies.push({ x:cx * TILE, y:GROUND - 10, w:12, h:10, vx:-22, vy:0, min:(cx - 3) * TILE, max:(cx + 4) * TILE, alive:true, dead:0, fact:fact }); }
    function coin(cx, cy){ s.coins.push({ x:cx * TILE + 4, y:cy * TILE + 2, w:8, h:12, taken:false, i:s.coins.length }); }
    function pipe(cx, h, c, i){ for (var k = 0; k < h; k++){ t[12 - k][cx] = 'P'; t[12 - k][cx + 1] = 'P'; } s.pipes.push({ x:cx, h:h, c:c, i:i }); }

    // 1-1 Positioning
    q(8, 9, F.positioning);
    bug(15, F.ambiguity);
    br(19, 9); br(20, 9, F.signal); br(21, 9); br(22, 9, F.judgement); br(23, 9); br(24, 9, F.proof); br(25, 9);
    coin(28, 10); coin(29, 10);
    pit(32, 33);
    q(40, 9, F.stats);
    col(48, 1); col(49, 2); col(50, 3); col(51, 4); col(54, 4); col(55, 3); col(56, 2); col(57, 1);
    // 1-2 AI judgement
    q(72, 9, F.gen);
    coin(78, 10);
    q(86, 9, F.ml);
    col(94, 6); col(95, 6);
    q(104, 9, F.rules);
    coin(110, 10);
    q(116, 9, F.principle);
    // 1-3 Product board: one pipe per project in the decision board
    var cases = Array.isArray(window.PORTFOLIO_CASES) ? window.PORTFOLIO_CASES : [];
    var heights = [2, 3, 4, 2, 3, 4, 2, 3, 4];
    cases.slice(0, 9).forEach(function(c, i){ pipe(138 + i * 11, heights[i], c, i); });
    coin(154, 8); coin(187, 8); coin(220, 8);
    // 1-4 Evidence
    br(241, 9); br(242, 9, F.tradeindia); br(243, 9);
    bug(249, F.bugs); bug(256, F.friction); bug(263, F.verification);
    br(270, 9); br(271, 9, F.prudent); br(272, 9);
    coin(275, 10);
    pit(278, 279);
    coin(282, 10);
    br(285, 9); br(286, 9, F.hcl); br(287, 9);
    bug(293, F.manual); bug(300, F.response); bug(307, F.etl);
    coin(313, 10);
    // 2-1 Operating model
    q(322, 9, F.observe); col(325, 1); q(328, 9, F.frame); col(331, 2); q(334, 9, F.choose); col(337, 1);
    q(340, 9, F.ship); col(343, 2); q(346, 9, F.learn); col(349, 1); q(352, 9, F.output);
    coin(325, 10); coin(337, 10); coin(349, 10);
    // 2-2 Next problem: staircase, flag, castle
    for (var k = 0; k < 8; k++) col(362 + k, k + 1);
    t[12][FLAG_X] = 'S';

    var ids = {};
    Object.keys(s.blocks).forEach(function(key){ var f = s.blocks[key].fact; if (f) ids[f.id] = 1; });
    s.enemies.forEach(function(e){ ids[e.fact.id] = 1; });
    s.cases = s.pipes.length;
    s.total = Object.keys(ids).length + s.cases;
  }

  /* ---------- physics ---------- */
  function clamp(v, a, b){ return v < a ? a : v > b ? b : v; }
  function solidAt(tx, ty){
    if (tx < 0 || tx >= LW) return true;
    if (ty < 0 || ty >= ROWS) return false;
    return S.tiles[ty][tx] !== '.';
  }
  function moveX(b, dx){
    if (!dx) return false;
    b.x += dx;
    var top = Math.floor(b.y / TILE), bot = Math.floor((b.y + b.h - 0.01) / TILE), tx, ty;
    if (dx > 0){
      tx = Math.floor((b.x + b.w - 0.01) / TILE);
      for (ty = top; ty <= bot; ty++) if (solidAt(tx, ty)){ b.x = tx * TILE - b.w; return true; }
    } else {
      tx = Math.floor(b.x / TILE);
      for (ty = top; ty <= bot; ty++) if (solidAt(tx, ty)){ b.x = (tx + 1) * TILE; return true; }
    }
    return false;
  }
  function moveY(b, dy){
    if (!dy) return null;
    b.y += dy;
    var l = Math.floor(b.x / TILE), r = Math.floor((b.x + b.w - 0.01) / TILE), tx, ty;
    if (dy > 0){
      ty = Math.floor((b.y + b.h - 0.01) / TILE);
      for (tx = l; tx <= r; tx++) if (solidAt(tx, ty)){ b.y = ty * TILE - b.h; return { hit:'floor' }; }
    } else {
      ty = Math.floor(b.y / TILE);
      var best = null, cx = b.x + b.w / 2;
      for (tx = l; tx <= r; tx++) if (solidAt(tx, ty)){ if (best === null || Math.abs((tx + 0.5) * TILE - cx) < Math.abs((best + 0.5) * TILE - cx)) best = tx; }
      if (best !== null){ b.y = (ty + 1) * TILE; return { hit:'ceil', tx:best, ty:ty }; }
    }
    return null;
  }
  function overlap(a, b, inset){
    inset = inset || 0;
    return a.x + inset < b.x + b.w && a.x + a.w - inset > b.x && a.y + inset < b.y + b.h && a.y + a.h - inset > b.y;
  }

  /* ---------- game logic ---------- */
  var K = { left:false, right:false, jump:false, down:false }, jumpBuf = 0, downEdge = false;

  function addScore(n, x, y){ S.score += n; if (x != null) S.floats.push({ x:x, y:y, text:String(n), t:0.9, color:'#ffffff' }); }
  function floatText(text, x, y, color){ S.floats.push({ x:x, y:y, text:text, t:1.4, color:color || '#ffd23f' }); }
  function burst(x, y, n, color, spread, up){
    if (reduce) return;
    for (var i = 0; i < n; i++) S.parts.push({ x:x, y:y, vx:(Math.random() - 0.5) * spread, vy:-(up || 120) * (0.5 + Math.random() * 0.6), t:0.5 + Math.random() * 0.3, color:color, size:2 + (i % 2) });
  }
  function shatter(tx, ty){
    if (reduce) return;
    [[-60, -260], [60, -260], [-50, -170], [50, -170]].forEach(function(v){ S.parts.push({ x:tx * TILE + 8, y:ty * TILE + 8, vx:v[0], vy:v[1], t:0.9, color:'#c84c0c', size:5, grav:true }); });
  }

  function reveal(f, pts, x, y){
    if (!S.found[f.id]){ S.found[f.id] = true; addScore(pts, x, y); }
    if (f.cue) cue(f.cue);
    showCard(f);
  }

  function bump(tx, ty){
    var c = S.tiles[ty][tx], key = tx + ',' + ty, blk = S.blocks[key], fact = blk && blk.fact;
    if (c === 'Q'){
      S.tiles[ty][tx] = 'U'; S.bumps[key] = 0.15;
      if (fact && fact.power){ S.items.push({ x:tx * TILE + 2, y:ty * TILE - 12, w:12, h:12, t:0, fact:fact }); addScore(200, tx * TILE + 8, ty * TILE - 6); }
      else if (fact){ if (!reduce) S.parts.push({ x:tx * TILE + 8, y:ty * TILE - 6, vx:0, vy:-240, t:0.45, color:'coin', size:6, grav:true }); reveal(fact, 200, tx * TILE + 8, ty * TILE - 10); }
    } else if (c === 'B'){
      S.tiles[ty][tx] = '.'; shatter(tx, ty);
      if (fact) reveal(fact, 200, tx * TILE + 8, ty * TILE - 6); else addScore(50, tx * TILE + 8, ty * TILE - 6);
    }
  }

  function setBig(on){
    var p = S.player;
    if (on && !p.big){ p.big = true; p.y -= 8; p.h = 23; p.w = 12; }
    else if (!on && p.big){ p.big = false; p.y += 8; p.h = 15; p.w = 10; }
  }

  function grant(power){
    S.abil[power] = true;
    if (power === 'gen') setBig(true);
  }

  function respawn(){
    var p = S.player;
    p.x = S.safeX != null ? S.safeX : S.checkpoint * TILE; p.y = GROUND - p.h; p.vx = 0; p.vy = 0; p.inv = 1.5; p.lock = null;
    cue('Oops, I fell in! Back on solid ground — try a running jump.');
  }

  function hurt(){
    var p = S.player;
    if (p.inv > 0) return;
    p.inv = 1.6;
    burst(p.x + p.w / 2, p.y + 6, 8, '#ffffff', 160);
    // Friendly failure: knock back instead of restarting, so nobody loses progress through the portfolio.
    p.vx = -p.face * 150; p.vy = -230; p.jt = 0; p.cut = true;
    if (p.big){ setBig(false); cue('Ouch! Lost my extra hit. Keep going!'); return; }
    cue('Ouch! Jump on enemies from above to defeat them.');
  }

  function stomp(e){
    var p = S.player;
    e.alive = false; e.dead = 0.6;
    p.vy = K.jump ? -380 : -260; p.jumps = 1; p.cut = false; p.jt = 0;
    burst(e.x + 6, e.y + 6, 6, '#ffffff', 140);
    reveal(e.fact, 100, e.x + 6, e.y - 10);
  }

  function onPipe(){
    var p = S.player;
    if (!p.ground) return null;
    for (var i = 0; i < S.pipes.length; i++){
      var pp = S.pipes[i], top = (13 - pp.h) * TILE, cx = p.x + p.w / 2;
      if (Math.abs(p.y + p.h - top) < 1.5 && cx >= pp.x * TILE + 2 && cx <= (pp.x + 2) * TILE - 2) return pp;
    }
    return null;
  }

  function updatePlayer(dt){
    var p = S.player;
    p.inv = Math.max(0, p.inv - dt);

    if (p.lock === 'pipe'){
      S.pipeT += dt; p.y += (p.h + 2) / 0.45 * dt;
      if (S.pipeT >= 0.45){ p.lock = 'case'; openCase(S.pipeRef); }
      return;
    }
    if (p.lock === 'case') return;
    if (p.lock === 'flag'){ updateFlag(dt); return; }

    var max = S.abil.rules ? TURBO : RUN;
    var dir = (K.right ? 1 : 0) - (K.left ? 1 : 0);
    if (dir){ p.vx += dir * ACC * dt * (p.ground ? 1 : 0.75); p.face = dir; }
    else { var f = ACC * dt * (p.ground ? 1.1 : 0.4); p.vx = Math.abs(p.vx) <= f ? 0 : p.vx - Math.sign(p.vx) * f; }
    p.vx = clamp(p.vx, -max, max);

    p.coyote = p.ground ? 0.09 : Math.max(0, p.coyote - dt);
    if (jumpBuf > 0){
      if (p.ground || p.coyote > 0){ p.vy = -JUMP_V; p.jumps = 1; p.ground = false; p.coyote = 0; jumpBuf = 0; p.cut = false; p.jt = 0; }
      else if (S.abil.ml && p.jumps < 2){ p.vy = -DJUMP_V; p.jumps = 2; jumpBuf = 0; p.cut = false; p.jt = 0; burst(p.x + p.w / 2, p.y + p.h, 6, '#ffffff', 120, 40); }
    }
    jumpBuf = Math.max(0, jumpBuf - dt);
    p.jt = (p.jt || 0) + dt;
    // Variable jump height, with a minimum hop so a quick tap still reaches ? blocks.
    if (!K.jump && p.jt > 0.12 && p.vy < -170 && !p.cut){ p.vy = -170; p.cut = true; }
    p.vy = Math.min(MAXFALL, p.vy + GRAV * dt);

    var dx = p.vx * dt, dy = p.vy * dt, n = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 6));
    p.ground = false;
    for (var i = 0; i < n; i++){
      if (moveX(p, dx / n)) p.vx = 0;
      var r = moveY(p, dy / n);
      if (r){
        dy = 0; p.vy = 0;
        if (r.hit === 'floor'){ p.ground = true; p.jumps = 0; }
        else bump(r.tx, r.ty);
      }
    }
    p.walkT += Math.abs(p.vx) * dt;

    if (p.y > VIEW_H + 32){ respawn(); return; }

    // Remember the last spot with solid ground on both sides, for pit respawns.
    if (p.ground && Math.abs(p.y + p.h - GROUND) < 0.5){
      var l = Math.floor(p.x / TILE) - 1, rr = Math.floor((p.x + p.w) / TILE) + 1, safe = true;
      for (var t2 = l; t2 <= rr; t2++) if (!solidAt(t2, 13) || solidAt(t2, 12)) safe = false;
      if (safe) S.safeX = p.x;
    }

    // Pipe entry
    var pp = onPipe();
    if (pp && downEdge){
      p.lock = 'pipe'; S.pipeRef = pp; S.pipeT = 0; p.vx = 0;
      p.x = pp.x * TILE + TILE - p.w / 2;
    }
    downEdge = false;

    // Double-jump hint at the AI wall
    if (!S.abil.ml && !S.wallHint && p.x + p.w >= 94 * TILE - 1 && p.x < 94 * TILE && p.ground){
      S.wallHint = true;
      cue('Too high! Hit the ? block behind me for the ON-DEVICE ML power-up: double jump.');
    }

    // Flag
    if (!S.cleared && p.x + p.w >= FLAG_X * TILE - 1){
      S.cleared = true; p.lock = 'flag'; S.flagPhase = 0; p.vx = 0; p.vy = 0;
      p.x = FLAG_X * TILE - p.w + 6; p.face = 1;
      var h = clamp(Math.round((GROUND - (p.y + p.h)) / TILE), 0, 9);
      addScore((h + 1) * 100, p.x, p.y - 8);
      cue('Course clear! Thanks for playing through my portfolio.');
    }
  }

  function updateFlag(dt){
    var p = S.player, bottom = 12 * TILE;
    if (S.flagPhase === 0){
      p.y = Math.min(bottom - p.h, p.y + 150 * dt);
      S.flagY = Math.min(bottom - 12, S.flagY + 150 * dt);
      if (p.y >= bottom - p.h && S.flagY >= bottom - 12){ S.flagPhase = 1; p.x = (FLAG_X + 1) * TILE; p.y = GROUND - p.h; }
    } else if (S.flagPhase === 1){
      p.x += 60 * dt; p.walkT += 60 * dt; p.vx = 60; p.ground = true;
      if (p.x >= DOOR_X * TILE){ S.flagPhase = 2; S.flagT = 0; p.hidden = true; p.vx = 0; }
    } else if (S.flagPhase === 2){
      S.flagT += dt;
      if (S.flagT > 0.5 && S.flagPhase === 2){ S.flagPhase = 3; showClear(); }
    }
  }

  function updateEnemies(dt){
    var p = S.player;
    S.enemies.forEach(function(e){
      if (!e.alive){ e.dead = Math.max(0, e.dead - dt); return; }
      e.vy = Math.min(MAXFALL, e.vy + GRAV * dt);
      if (moveX(e, e.vx * dt) || e.x < e.min || e.x + e.w > e.max){ e.vx = -e.vx; e.x = clamp(e.x, e.min, e.max - e.w); }
      var fx = Math.floor((e.vx > 0 ? e.x + e.w + 1 : e.x - 1) / TILE), fy = Math.floor((e.y + e.h + 1) / TILE);
      if (!solidAt(fx, fy)) e.vx = -e.vx;
      var r = moveY(e, e.vy * dt);
      if (r && r.hit === 'floor') e.vy = 0;
      if (p.lock || p.hidden) return;
      if (overlap(p, e, 1)){
        if (p.vy > 0 && p.y + p.h - e.y < 9) stomp(e);
        else hurt();
      }
    });
  }

  function updateItems(dt){
    var p = S.player;
    for (var i = S.items.length - 1; i >= 0; i--){
      var it = S.items[i];
      it.t = (it.t || 0) + dt;
      // Pop up out of the block, then fly to the player so a running visitor never leaves a power-up behind.
      if (it.t < 0.4) it.y -= 36 * dt;
      else if (!p.lock){
        var dx = p.x + p.w / 2 - (it.x + 6), dy = p.y + p.h / 2 - (it.y + 6), d = Math.sqrt(dx * dx + dy * dy) || 1, sp = Math.min(260, 120 + it.t * 160);
        it.x += dx / d * Math.min(d, sp * dt); it.y += dy / d * Math.min(d, sp * dt);
      }
      if (!p.lock && overlap(p, it)){
        S.items.splice(i, 1);
        grant(it.fact.power);
        burst(it.x + 6, it.y + 6, 12, it.fact.color, 220, 160);
        reveal(it.fact, 1000, it.x + 6, it.y - 10);
      }
    }
  }

  function updateCoins(){
    var p = S.player;
    S.coins.forEach(function(c){
      if (c.taken || p.lock) return;
      if (overlap(p, c)){
        c.taken = true; S.skills++; S.score += 100;
        floatText('+ ' + SKILLS[c.i % SKILLS.length], c.x + 4, c.y - 4, '#ffd23f');
      }
    });
  }

  function updateZone(){
    var p = S.player, zi = 0;
    for (var i = 0; i < ZONES.length; i++) if (p.x >= ZONES[i].x * TILE) zi = i;
    if (zi === S.zone) return;
    S.zone = zi;
    S.checkpoint = ZONES[zi].x + 2;
    if (S.visited[zi]) return;
    S.visited[zi] = true;
    var z = ZONES[zi], note = S.note ? ' ' + S.note : '';
    S.note = null;
    if (z.id === 'about') cue('Hi, I’m Aastha, a Product Manager building with AI. ' + (isTouch() ? 'Use ◀ ▶ to walk and A to jump.' : 'Use ← → to walk and ↑ or Space to jump.') + ' Hit ? blocks, break bricks and stomp problems to explore.');
    else if (z.id === 'work') cue('World 1-3 · Product board. Stand on a pipe and press ' + (isTouch() ? 'B' : '↓') + ' to open a decision file.' + note);
    else cue(z.cue + note);
  }

  function update(dt){
    S.time += dt;
    updatePlayer(dt);
    if (S.player.lock !== 'case'){ updateEnemies(dt); updateItems(dt); updateCoins(); }
    updateZone();
    Object.keys(S.bumps).forEach(function(k){ S.bumps[k] -= dt; if (S.bumps[k] <= 0) delete S.bumps[k]; });
    for (var i = S.parts.length - 1; i >= 0; i--){
      var q = S.parts[i];
      q.t -= dt; if (q.t <= 0){ S.parts.splice(i, 1); continue; }
      q.vy += (q.grav ? GRAV : 500) * dt; q.x += q.vx * dt; q.y += q.vy * dt;
    }
    for (var j = S.floats.length - 1; j >= 0; j--){ var fl = S.floats[j]; fl.t -= dt; fl.y -= 28 * dt; if (fl.t <= 0) S.floats.splice(j, 1); }
    var vw = bufW || 320;
    S.cam = clamp(S.player.x + S.player.w / 2 - vw * 0.42, 0, Math.max(0, LW * TILE - vw));
  }

  /* ---------- rendering ---------- */
  var canvas = null, ctx = null, buf = null, bctx = null, bufW = 0, scale = 1, oy = 0, animT = 0, dpr = 1;
  var BUSHES = [5, 26, 44, 61, 76, 101, 123, 145, 166, 199, 231, 252, 268, 296, 333, 356, 388];

  function sizeCanvas(){
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(1, root.clientWidth || innerWidth), h = Math.max(1, root.clientHeight || innerHeight);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    scale = Math.min(canvas.height / VIEW_H, canvas.width / (20 * TILE));
    // Extra height (tall/portrait screens) goes to the sky; keep the ground just above the touch controls.
    oy = Math.max(0, Math.round(canvas.height - VIEW_H * scale - (isTouch() ? 116 * dpr : 0)));
    bufW = Math.ceil(canvas.width / scale) + 2;
    buf.width = bufW; buf.height = VIEW_H;
  }

  function drawWorld(){
    var g = bctx, s = S, sp = SPR, cam = Math.round(s.cam), i, x, y;
    g.imageSmoothingEnabled = false;
    g.fillStyle = SKY; g.fillRect(0, 0, bufW, VIEW_H);

    for (i = 0; i < 40; i++){
      x = Math.round(i * 170 + (i * 53) % 90 - cam * 0.3);
      if (x > -40 && x < bufW) g.drawImage(sp.cloud, x, 18 + (i * 37) % 54, 32, 10);
    }
    for (i = 0; i < 30; i++){
      x = Math.round(i * 260 + (i * 71) % 120 - cam * 0.5);
      var hill = i % 2 ? sp.hillSmall : sp.hillBig;
      if (x > -hill.width && x < bufW) g.drawImage(hill, x, GROUND - hill.height);
    }
    BUSHES.forEach(function(bx){
      x = bx * TILE - cam;
      if (x > -48 && x < bufW){ g.drawImage(sp.bush, x, GROUND - 9); g.drawImage(sp.bush, x + 10, GROUND - 9); g.drawImage(sp.bush, x + 20, GROUND - 9); }
    });

    // Castle
    x = 379 * TILE - cam;
    if (x > -120 && x < bufW){
      g.fillStyle = '#c84c0c'; g.fillRect(x, GROUND - 80, 112, 80); g.fillRect(x + 32, GROUND - 120, 48, 40);
      for (i = 0; i < 7; i++) g.fillRect(x + i * 16 + 2, GROUND - 88, 10, 8);
      for (i = 0; i < 3; i++) g.fillRect(x + 34 + i * 16, GROUND - 128, 10, 8);
      g.fillStyle = '#000';
      for (y = GROUND - 120; y < GROUND; y += 8) g.fillRect(y < GROUND - 80 ? x + 32 : x, y, y < GROUND - 80 ? 48 : 112, 1);
      g.fillRect(x + 40, GROUND - 34, 32, 34); g.fillRect(x + 44, GROUND - 40, 24, 6);
      g.fillRect(x + 50, GROUND - 108, 4, 12); g.fillRect(x + 60, GROUND - 108, 4, 12);
    }

    // Tiles
    var x0 = Math.max(0, Math.floor(cam / TILE)), x1 = Math.min(LW - 1, x0 + Math.ceil(bufW / TILE) + 1);
    var qf = Math.floor(animT * 2.5) % 3 === 2 ? 1 : 0;
    for (y = 0; y < ROWS; y++){
      for (x = x0; x <= x1; x++){
        var c = s.tiles[y][x];
        if (c === '.' || c === 'P') continue;
        var px = x * TILE - cam, py = y * TILE, key = x + ',' + y;
        if (s.bumps[key] && !reduce) py -= Math.round(Math.sin((1 - s.bumps[key] / 0.15) * Math.PI) * 4);
        var img = c === 'G' ? (y === 13 ? sp.groundTop : sp.ground) : c === 'B' ? sp.brick : c === 'Q' ? sp.q[qf] : c === 'U' ? sp.used : sp.stair;
        g.drawImage(img, px, py);
        if (c === 'B' && s.blocks[key] && Math.floor(animT * 2 + x) % 2 === 0){
          g.fillStyle = '#fff'; g.fillRect(px + 11, py + 2, 1, 5); g.fillRect(px + 9, py + 4, 5, 1);
        }
      }
    }

    // Flag pole + cloth
    x = FLAG_X * TILE + 7 - cam;
    if (x > -40 && x < bufW + 20){
      g.fillStyle = '#000'; g.fillRect(x - 1, 3 * TILE - 1, 4, 9 * TILE + 1);
      g.fillStyle = '#58d858'; g.fillRect(x, 3 * TILE, 2, 9 * TILE);
      g.fillStyle = '#000'; g.fillRect(x - 3, 3 * TILE - 8, 8, 8); g.fillStyle = '#00a800'; g.fillRect(x - 2, 3 * TILE - 7, 6, 6);
      var fy = Math.round(s.flagY);
      g.fillStyle = '#000'; g.fillRect(x - 19, fy - 1, 19, 12); g.fillStyle = '#e45c10'; g.fillRect(x - 18, fy, 17, 10);
    }

    // Coins
    var spin = [8, 6, 2, 6][Math.floor(animT * 6) % 4];
    s.coins.forEach(function(cn){
      if (cn.taken) return;
      var cx = cn.x - cam + (8 - spin) / 2;
      if (cx < -10 || cx > bufW) return;
      g.fillStyle = '#000'; g.fillRect(cx, cn.y, spin, 12);
      g.fillStyle = '#f8d800'; if (spin > 2) g.fillRect(cx + 1, cn.y + 1, spin - 2, 10);
      g.fillStyle = '#fff3a0'; if (spin > 4) g.fillRect(cx + 2, cn.y + 2, 1, 8);
    });

    // Power-up items
    s.items.forEach(function(it){
      var ix = Math.round(it.x - cam), iy = Math.round(it.y);
      g.fillStyle = '#000'; g.fillRect(ix, iy, 12, 12); g.fillStyle = it.fact.color; g.fillRect(ix + 1, iy + 1, 10, 10);
      g.fillStyle = '#fff'; g.fillRect(ix + 2, iy + 2, 3, 1);
    });

    // Enemies
    s.enemies.forEach(function(e){
      var ex = Math.round(e.x - cam);
      if (ex < -20 || ex > bufW + 4) return;
      if (e.alive) g.drawImage(Math.floor(animT * 4) % 2 ? sp.bugA : sp.bugB, ex, Math.round(e.y));
      else if (e.dead > 0) g.drawImage(sp.bugFlat, ex, Math.round(e.y + e.h - 4));
    });

    // Player (before pipes so she disappears into them)
    var p = s.player;
    if (!p.hidden && !(p.inv > 0 && Math.floor(animT * 12) % 2)){
      var frame = !p.ground && p.lock !== 'pipe' ? 'jump' : Math.abs(p.vx) > 5 ? (Math.floor(p.walkT / 9) % 2 ? 'walkA' : 'walkB') : 'stand';
      if (p.lock === 'flag' && s.flagPhase === 0) frame = 'jump';
      var img2 = (p.face < 0 ? sp.heroL : sp.hero)[frame];
      var dw = p.big ? 18 : 12, dh = p.big ? 24 : 16;
      g.drawImage(img2, Math.round(p.x + p.w / 2 - dw / 2 - cam), Math.round(p.y + p.h - dh), dw, dh);
    }

    // Pipes
    s.pipes.forEach(function(pp){
      var px2 = pp.x * TILE - cam, top = (13 - pp.h) * TILE, h = pp.h * TILE;
      if (px2 < -40 || px2 > bufW) return;
      g.fillStyle = '#000'; g.fillRect(px2 + 1, top + 9, 30, h - 9); g.fillRect(px2 - 1, top, 34, 11);
      g.fillStyle = '#00a800'; g.fillRect(px2 + 2, top + 10, 28, h - 10); g.fillRect(px2, top + 1, 32, 9);
      g.fillStyle = '#80d010'; g.fillRect(px2 + 5, top + 10, 3, h - 10); g.fillRect(px2 + 3, top + 2, 3, 7);
      g.fillStyle = '#005800'; g.fillRect(px2 + 24, top + 10, 3, h - 10); g.fillRect(px2 + 26, top + 2, 3, 7);
    });

    // Particles
    s.parts.forEach(function(q){
      var qx = Math.round(q.x - cam), qy = Math.round(q.y);
      if (q.color === 'coin'){ g.fillStyle = '#000'; g.fillRect(qx - 3, qy - 6, 7, 12); g.fillStyle = '#f8d800'; g.fillRect(qx - 2, qy - 5, 5, 10); return; }
      g.fillStyle = q.color; g.fillRect(qx, qy, q.size, q.size);
    });
  }

  function label(str, x, y, size, color, bg){
    var g = ctx;
    g.font = size + 'px "Press Start 2P", monospace';
    g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    if (bg){
      var w = g.measureText(str).width, pad = size * 0.55;
      g.fillStyle = bg; g.fillRect(x - w / 2 - pad, y - size - pad * 0.7, w + pad * 2, size + pad * 1.5);
    } else { g.fillStyle = '#000'; g.fillText(str, x + size * 0.15, y + size * 0.15); }
    g.fillStyle = color; g.fillText(str, x, y);
  }

  function drawOverlay(){
    var g = ctx, s = S, cam = Math.round(s.cam), p = s.player;
    g.setTransform(scale, 0, 0, scale, -cam * scale, oy);
    var L = cam - 80, R = cam + bufW + 80;

    // Zone signposts
    ZONES.forEach(function(z){
      var x = (z.x + 1) * TILE + 8;
      if (x < L || x > R) return;
      g.fillStyle = '#5a3210'; g.fillRect(x - 2, GROUND - 34, 4, 34);
      g.font = '5px "Press Start 2P", monospace';
      var w = Math.max(g.measureText(z.name.toUpperCase()).width, 30) + 10;
      g.fillStyle = '#000'; g.fillRect(x - w / 2 - 1, GROUND - 57, w + 2, 26);
      g.fillStyle = '#8a5a2b'; g.fillRect(x - w / 2, GROUND - 56, w, 24);
      label('WORLD ' + z.world, x, GROUND - 47, 5, '#ffd23f');
      label(z.name.toUpperCase(), x, GROUND - 37, 5, '#ffffff');
    });

    // Enemy name tags
    s.enemies.forEach(function(e){
      if (!e.alive || e.x < L || e.x > R) return;
      label(e.fact.name, e.x + e.w / 2, e.y - 5, 4, '#ffffff', 'rgba(0,0,0,.6)');
    });

    // Pipe labels
    var on = onPipe();
    s.pipes.forEach(function(pp){
      var x = pp.x * TILE + TILE, top = (13 - pp.h) * TILE;
      if (x < L || x > R) return;
      var opened = s.opened[pp.c.name];
      label(pp.c.name.toUpperCase(), x, top - 16, 5, opened ? '#7fd47f' : '#ffffff', 'rgba(0,0,0,.55)');
      label(String(pp.c.mode || '').toUpperCase(), x, top - 6, 4, '#ffd23f');
      if (on === pp && !p.lock && Math.floor(animT * 3) % 2 === 0) label(isTouch() ? '▼ TAP B' : '▼ PRESS ↓', x, top - 28, 5, '#ffd23f', '#000');
    });

    // Items
    s.items.forEach(function(it){
      g.font = '5px "Press Start 2P", monospace'; g.textAlign = 'center'; g.fillStyle = '#000';
      g.fillText(it.fact.label, it.x + 6, it.y + 9);
    });

    // AI wall hint
    if (!s.abil.ml && Math.abs(p.x - 94 * TILE) < 200) label('DOUBLE JUMP NEEDED', 95 * TILE, 6 * TILE, 5, '#ffffff', 'rgba(0,0,0,.6)');

    // Flag cloth
    var fx = FLAG_X * TILE + 7;
    if (fx > L && fx < R){ g.font = '5px "Press Start 2P", monospace'; g.textAlign = 'center'; g.fillStyle = '#fff'; g.fillText('AS', fx - 10, s.flagY + 7.5); }
    label('HIRE ME', 382 * TILE + 8, GROUND - 132, 6, '#ffd23f', 'rgba(0,0,0,.55)');

    // Floating score / skill text
    s.floats.forEach(function(fl){ label(fl.text, fl.x, fl.y, 5, fl.color); });
  }

  function render(){
    if (!ctx || !S) return;
    drawWorld();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = SKY; ctx.fillRect(0, 0, canvas.width, oy + 1);
    ctx.fillStyle = '#2a1408'; ctx.fillRect(0, oy + VIEW_H * scale - 1, canvas.width, canvas.height);
    ctx.drawImage(buf, 0, 0, bufW, VIEW_H, 0, oy, bufW * scale, VIEW_H * scale);
    drawOverlay();
    paintHud();
  }

  /* ---------- DOM UI ---------- */
  var root = null, layer = null, cardEl = null, cueEl = null, hudEls = {}, mode = 'closed', raf = 0, last = 0;
  var cueTimer = 0, cardTimer = 0, prevFocus = null, inerted = [];

  function isTouch(){ return touch || (root && root.classList.contains('touch')); }
  function el(tag, cls, text){ var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function btn(text, cls, fn, aria){ var b = el('button', 'sa-btn' + (cls ? ' ' + cls : ''), text); b.type = 'button'; if (aria) b.setAttribute('aria-label', aria); b.addEventListener('click', fn); return b; }
  function link(text, href, cls, external){ var a = el('a', 'sa-btn' + (cls ? ' ' + cls : ''), text); a.href = href; if (external){ a.target = '_blank'; a.rel = 'noopener'; } return a; }
  function setT(e, v){ if (e && e._v !== v){ e._v = v; e.textContent = v; } }
  function fmtTime(t){ var m = Math.floor(t / 60), s2 = Math.floor(t % 60); return m + ':' + (s2 < 10 ? '0' : '') + s2; }

  function build(){
    if (root) return;
    makeSprites();
    root = el('div', 'sa-root');
    root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', 'Super Aastha: play the portfolio as a game');
    root.tabIndex = -1;
    if (touch) root.classList.add('touch');

    canvas = el('canvas', 'sa-canvas'); canvas.setAttribute('aria-hidden', 'true');
    ctx = canvas.getContext('2d'); buf = document.createElement('canvas'); bctx = buf.getContext('2d');
    root.appendChild(canvas);

    var hud = el('div', 'sa-hud');
    [['player', 'PLAYER', 'AASTHA', 'opt'], ['world', 'WORLD', '1-1'], ['facts', 'FACTS', '0'], ['skills', 'SKILLS', '0'], ['power', 'POWER', '—', 'opt'], ['score', 'SCORE', '000000', 'opt'], ['time', 'TIME', '0:00']].forEach(function(h){
      var sp = el('span', h[3] || ''); sp.appendChild(el('i', '', h[1])); var b = el('b', '', h[2]); b.style.fontWeight = '400'; sp.appendChild(b); hud.appendChild(sp); hudEls[h[0]] = b;
    });
    root.appendChild(hud);

    var tools = el('div', 'sa-tools');
    tools.appendChild(btn('MAP', 'ghost', function(){ showMap(); }, 'World map: fast-travel to a section'));
    tools.appendChild(btn('❚❚', 'ghost', function(){ showPause(); }, 'Pause'));
    tools.appendChild(btn('CLASSIC VIEW ✕', 'ghost', function(){ exitToClassic(currentSection()); }, 'Exit the game and read the classic page'));
    root.appendChild(tools);

    cueEl = el('div', 'sa-cue'); cueEl.setAttribute('role', 'status'); cueEl.setAttribute('aria-live', 'polite');
    root.appendChild(cueEl);
    cardEl = el('div', 'sa-card'); cardEl.setAttribute('role', 'status'); cardEl.setAttribute('aria-live', 'polite');
    root.appendChild(cardEl);

    var pad = el('div', 'sa-touch');
    var left = el('div', 'sa-pad'), right = el('div', 'sa-pad');
    [['left', '◀', left, ''], ['right', '▶', left, ''], ['down', 'B', right, 'b'], ['jump', 'A', right, 'a']].forEach(function(d){
      var b = el('button', d[3], d[1]); b.type = 'button';
      b.setAttribute('aria-label', d[0] === 'down' ? 'Enter pipe' : d[0] === 'jump' ? 'Jump' : 'Move ' + d[0]);
      function on(e){ e.preventDefault(); b.classList.add('on'); press(d[0], true); }
      function off(e){ e.preventDefault(); b.classList.remove('on'); press(d[0], false); }
      b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointercancel', off); b.addEventListener('pointerleave', off);
      b.addEventListener('contextmenu', function(e){ e.preventDefault(); });
      d[2].appendChild(b);
    });
    pad.appendChild(left); pad.appendChild(right); root.appendChild(pad);

    layer = el('div', 'sa-layer'); root.appendChild(layer);
    document.body.appendChild(root);

    root.addEventListener('touchstart', function(){ if (!root.classList.contains('touch')){ root.classList.add('touch'); sizeCanvas(); } }, { passive:true });
    addEventListener('resize', function(){ if (mode !== 'closed') sizeCanvas(); });
    addEventListener('blur', function(){ if (mode === 'play'){ releaseKeys(); showPause(); } });
    addEventListener('keydown', onKeyDown, true);
    addEventListener('keyup', onKeyUp, true);
  }

  function paintHud(){
    if (!S) return;
    var z = ZONES[Math.max(0, S.zone)];
    setT(hudEls.world, z.world);
    setT(hudEls.facts, Object.keys(S.found).length + '/' + S.total);
    setT(hudEls.skills, S.skills + '/' + S.coins.length);
    var pw = (S.abil.gen ? 'AI ' : '') + (S.abil.ml ? 'ML ' : '') + (S.abil.rules ? 'IF' : '');
    setT(hudEls.power, pw.trim() || '—');
    setT(hudEls.score, ('000000' + S.score).slice(-6));
    setT(hudEls.time, fmtTime(S.time));
  }

  function cue(text){
    if (!cueEl) return;
    cueEl.innerHTML = ''; cueEl.appendChild(el('b', '', 'AS')); cueEl.appendChild(el('span', '', text));
    cueEl.classList.add('show');
    clearTimeout(cueTimer); cueTimer = setTimeout(function(){ cueEl.classList.remove('show'); }, 5200);
  }

  function hideCard(){ clearTimeout(cardTimer); if (cardEl) cardEl.classList.remove('show'); }
  function showCard(f){
    cardEl.innerHTML = '';
    cardEl.appendChild(el('div', 'sa-tag', f.tag));
    cardEl.appendChild(el('h3', 'sa-title', f.title));
    if (f.list){ var ul = el('ul', ''), wrap = el('div', 'sa-body'); f.list.forEach(function(li){ ul.appendChild(el('li', '', li)); }); wrap.appendChild(ul); cardEl.appendChild(wrap); }
    if (f.body) cardEl.appendChild(el('p', 'sa-body', f.body));
    if (f.chips){ var ch = el('div', 'sa-chips'); f.chips.forEach(function(c){ ch.appendChild(el('span', '', c)); }); cardEl.appendChild(ch); }
    if (f.ability) cardEl.appendChild(el('div', 'sa-ability', 'NEW ABILITY: ' + f.ability));
    if (f.section){
      var more = el('button', 'sa-more', 'Read this section on the page →'); more.type = 'button';
      more.addEventListener('click', function(){ exitToClassic(f.section); });
      cardEl.appendChild(more);
    }
    var x = el('button', 'sa-x', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Close card'); x.addEventListener('click', hideCard);
    cardEl.appendChild(x);
    cardEl.classList.add('show');
    var words = ((f.body || '') + (f.list || []).join(' ')).split(/\s+/).length;
    clearTimeout(cardTimer); cardTimer = setTimeout(hideCard, clamp(6000 + words * 250, 7000, 20000));
  }

  /* ---------- layers ---------- */
  function setLayer(name, node, transparent){
    mode = name;
    root.classList.toggle('mode-title', name === 'title');
    layer.innerHTML = '';
    layer.classList.toggle('clear-bg', !!transparent);
    if (!node){ layer.classList.remove('show'); root.focus({ preventScroll:true }); return; }
    layer.appendChild(node);
    layer.classList.add('show');
    var first = node.querySelector('button, a');
    if (first) first.focus({ preventScroll:true });
  }
  function keysHint(){
    var k = el('div', 'sa-keys');
    var hint = isTouch()
      ? '◀ ▶ MOVE &nbsp; A JUMP &nbsp; B ENTER PIPE'
      : '<kbd>←</kbd><kbd>→</kbd> MOVE &nbsp; <kbd>↑</kbd>/<kbd>SPACE</kbd> JUMP &nbsp; <kbd>↓</kbd> PIPE &nbsp; <kbd>P</kbd> PAUSE &nbsp; <kbd>ESC</kbd> CLASSIC VIEW';
    k.innerHTML = hint.split(' &nbsp; ').map(function(s){ return '<span class="sa-key-item">' + s + '</span>'; }).join(' ');
    return k;
  }

  function showTitle(){
    var wrap = el('div', 'sa-titlecard');
    var logo = el('div', 'sa-logo'); logo.appendChild(el('b', '', 'SUPER AASTHA')); logo.appendChild(el('small', '', 'A PRODUCT MANAGER’S QUEST'));
    wrap.appendChild(logo);
    wrap.appendChild(el('div', 'sa-sub', 'Play through my portfolio: ? blocks, bricks, enemies and pipes each reveal a piece of it.'));
    var menu = el('div', 'sa-menu');
    var inProgress = S && S.started && !S.cleared;
    if (inProgress) menu.appendChild(btn('▶ CONTINUE', 'pri', play));
    menu.appendChild(btn(inProgress ? '↻ RESTART' : '▶ PLAY THE PORTFOLIO (~2 MIN)', inProgress ? '' : 'pri', function(){ if (inProgress || (S && S.cleared)) newGame(); play(); }));
    menu.appendChild(btn('⌖ FAST-TRAVEL (WORLD MAP)', '', showMap));
    menu.appendChild(btn('☰ CLASSIC VIEW', '', function(){ exitToClassic(); }));
    wrap.appendChild(menu);
    wrap.appendChild(keysHint());
    setLayer('title', wrap, true);
  }

  function showMap(){
    if (mode === 'play') releaseKeys();
    var back = S && S.started && !S.cleared ? 'play' : 'title';
    var panel = el('div', 'sa-panel');
    panel.appendChild(el('h2', '', 'WORLD MAP'));
    panel.appendChild(el('p', '', 'Each world is one section of my portfolio. Pick one to fast-travel there. Fast-travelling past World 1-2 unlocks double jump and turbo.'));
    var grid = el('div', 'sa-map');
    ZONES.forEach(function(z, i){
      var b = el('button', 'sa-node' + (S && S.visited[i] ? ' done' : '') + (S && S.started && S.zone === i ? ' here' : '')); b.type = 'button';
      b.appendChild(el('span', 'n', i === ZONES.length - 1 ? '★' : String(i + 1)));
      b.appendChild(el('span', '', z.world + ' · ' + z.name.toUpperCase()));
      b.appendChild(el('small', '', i === ZONES.length - 1 ? 'Flag + contact' : (S && S.visited[i] ? 'Visited' : 'Not visited')));
      b.addEventListener('click', function(){ travel(i); });
      grid.appendChild(b);
    });
    panel.appendChild(grid);
    var row = el('div', 'sa-row');
    row.appendChild(btn('◀ BACK', '', function(){ if (back === 'play') play(); else showTitle(); }));
    row.appendChild(btn('☰ CLASSIC VIEW', '', function(){ exitToClassic(); }));
    panel.appendChild(row);
    setLayer('map', panel);
  }

  function showPause(){
    if (mode !== 'play') return;
    releaseKeys();
    var panel = el('div', 'sa-panel'); panel.style.textAlign = 'center'; panel.style.maxWidth = '420px';
    panel.appendChild(el('h2', '', 'PAUSED'));
    var menu = el('div', 'sa-menu'); menu.style.marginTop = '14px';
    menu.appendChild(btn('▶ RESUME', 'pri', play));
    menu.appendChild(btn('⌖ WORLD MAP', '', showMap));
    menu.appendChild(btn('↻ RESTART', '', function(){ newGame(); play(); }));
    menu.appendChild(btn('☰ CLASSIC VIEW', '', function(){ exitToClassic(currentSection()); }));
    panel.appendChild(menu);
    setLayer('pause', panel);
  }

  function openCase(pp){
    var c = pp.c;
    if (!S.opened[c.name]){ S.opened[c.name] = true; S.found['case-' + pp.i] = true; addScore(500, pp.x * TILE + TILE, (13 - pp.h) * TILE - 10); }
    hideCard();
    var panel = el('div', 'sa-panel');
    panel.appendChild(el('div', 'sa-tag', 'PIPE ' + (pp.i + 1) + ' / ' + S.cases + ' · DECISION FILE'));
    panel.appendChild(el('h2', '', c.name));
    panel.appendChild(el('div', 'sa-kicker', c.kicker || ''));
    if (c.state) panel.appendChild(el('span', 'sa-state', c.state));
    var grid = el('div', 'sa-case');
    if (c.image){ var img = el('img'); img.src = c.image; img.alt = c.name + ' product interface'; img.loading = 'lazy'; grid.appendChild(img); }
    var dl = el('dl');
    [['PROBLEM', c.problem], ['USER', c.user], ['KEY DECISION', c.decision], ['AI ROLE', c.ai], ['TRADE-OFF', c.tradeoff], ['PROOF', c.proof]].forEach(function(r){
      if (!r[1]) return; var d = el('div'); d.appendChild(el('dt', '', r[0])); d.appendChild(el('dd', '', r[1])); dl.appendChild(d);
    });
    grid.appendChild(dl); panel.appendChild(grid);
    var row = el('div', 'sa-row');
    row.appendChild(btn('◀ BACK TO GAME', 'pri', closeCase));
    (c.links || []).forEach(function(l){ row.appendChild(link(l[0] + ' ↗', l[1], '', true)); });
    panel.appendChild(row);
    setLayer('case', panel);
    cue('Here’s the decision file for ' + c.name + '.');
  }
  function closeCase(){
    var p = S.player, pp = S.pipeRef;
    if (pp){ p.y = (13 - pp.h) * TILE - p.h; p.vy = 0; p.ground = true; }
    p.lock = null; S.pipeRef = null;
    play();
  }

  function showClear(){
    releaseKeys(); hideCard();
    var found = Object.keys(S.found).length;
    var panel = el('div', 'sa-panel');
    panel.appendChild(el('span', 'sa-big', 'COURSE CLEAR!'));
    panel.appendChild(el('h2', '', 'Thank you for playing! — Aastha'));
    panel.appendChild(el('p', '', 'Looking for product roles where I can own the decision 0→1. Especially problems involving AI-assisted decisions, B2B workflows, analytics or an operational process that deserves a better product.'));
    var st = el('div', 'sa-stats');
    [['FACTS FOUND', found + ' / ' + S.total], ['DECISION FILES', Object.keys(S.opened).length + ' / ' + S.cases], ['SKILLS', S.skills + ' / ' + S.coins.length], ['TIME', fmtTime(S.time)], ['SCORE', ('000000' + S.score).slice(-6)]].forEach(function(r){
      var d = el('div', '', r[0]); d.insertBefore(el('b', '', r[1]), d.firstChild); st.appendChild(d);
    });
    panel.appendChild(st);
    var row = el('div', 'sa-row');
    row.appendChild(link('★ EMAIL ME', 'mailto:' + EMAIL, 'pri'));
    var copy = btn('COPY EMAIL', '', function(){
      if (navigator.clipboard) navigator.clipboard.writeText(EMAIL).then(function(){ copy.textContent = 'COPIED!'; }, function(){ copy.textContent = EMAIL; });
      else copy.textContent = EMAIL;
    });
    row.appendChild(copy);
    row.appendChild(link('RÉSUMÉ ↗', RESUME, '', true));
    row.appendChild(link('LINKEDIN ↗', LINKEDIN, '', true));
    panel.appendChild(row);
    var row2 = el('div', 'sa-row');
    row2.appendChild(btn('↻ PLAY AGAIN', '', function(){ newGame(); play(); }));
    if (found < S.total) row2.appendChild(btn('⌖ FIND THE REST (MAP)', '', function(){ S.cleared = false; S.player.hidden = false; S.player.lock = null; S.flagY = 3 * TILE + 4; showMap(); }));
    row2.appendChild(btn('☰ CLASSIC VIEW', '', function(){ exitToClassic('contact'); }));
    panel.appendChild(row2);
    setLayer('clear', panel);
    if (!reduce) for (var i = 0; i < 40; i++) S.parts.push({ x:S.cam + Math.random() * bufW, y:-10 - Math.random() * 60, vx:(Math.random() - 0.5) * 40, vy:40 + Math.random() * 60, t:3, color:['#ffd23f', '#fff', '#4cd2ff', '#e45c10'][i % 4], size:3 });
  }

  /* ---------- flow ---------- */
  function play(){
    if (!S) newGame();
    S.started = true;
    setLayer('play', null);
  }
  function travel(i){
    if (!S || S.cleared) newGame();
    var p = S.player, z = ZONES[i];
    setBig(S.abil.gen);
    p.x = (z.x + 2) * TILE; p.y = GROUND - p.h; p.vx = p.vy = 0; p.lock = null; p.hidden = false; p.inv = 0.8;
    S.checkpoint = z.x + 2; S.cam = clamp(p.x - bufW * 0.42, 0, LW * TILE - bufW);
    S.started = true;
    var granted = false;
    if (i >= 2){ if (!S.abil.ml || !S.abil.rules) granted = true; S.abil.ml = true; S.abil.rules = true; }
    S.zone = -1;
    if (granted){ S.note = 'Fast-travel unlocked double jump and turbo so you can roam freely.'; S.visited[i] = false; }
    play();
  }
  function currentSection(){ return S && S.zone >= 0 ? ZONES[S.zone].id : null; }

  function exitToClassic(section){
    try { sessionStorage.setItem('sa-skip', '1'); } catch(e){}
    close();
    if (section){ var t = document.getElementById(section); if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block:'start' }); }
  }

  function loop(ts){
    if (mode === 'closed'){ raf = 0; return; }
    var dt = last ? Math.min(1 / 30, (ts - last) / 1000) : 0;
    last = ts; animT += dt;
    var d = Math.min(window.devicePixelRatio || 1, 2);
    if (Math.round(root.clientWidth * d) !== canvas.width || Math.round(root.clientHeight * d) !== canvas.height) sizeCanvas();
    if (mode === 'play') update(dt);
    else if (mode === 'clear' || mode === 'title'){
      for (var i = S.parts.length - 1; i >= 0; i--){ var q = S.parts[i]; q.t -= dt; if (q.t <= 0){ S.parts.splice(i, 1); continue; } q.x += q.vx * dt; q.y += q.vy * dt; }
    }
    render();
    raf = requestAnimationFrame(loop);
  }

  /* ---------- input ---------- */
  function keyName(e){
    switch (e.code){
      case 'ArrowLeft': case 'KeyA': return 'left';
      case 'ArrowRight': case 'KeyD': return 'right';
      case 'ArrowUp': case 'KeyW': case 'Space': case 'KeyZ': return 'jump';
      case 'ArrowDown': case 'KeyS': return 'down';
    }
    return null;
  }
  function press(k, down){
    if (down && !K[k]){ if (k === 'jump') jumpBuf = 0.12; if (k === 'down') downEdge = true; }
    K[k] = down;
  }
  function releaseKeys(){ K.left = K.right = K.jump = K.down = false; jumpBuf = 0; downEdge = false; }
  function menuFocus(dir){
    var items = Array.prototype.slice.call(layer.querySelectorAll('button, a'));
    if (!items.length) return;
    var i = items.indexOf(document.activeElement);
    items[(i + dir + items.length) % items.length].focus();
  }
  function onKeyDown(e){
    if (mode === 'closed') return;
    e.stopPropagation();
    if (e.key === 'Escape'){
      e.preventDefault();
      if (mode === 'play' || mode === 'title') exitToClassic(mode === 'play' ? currentSection() : null);
      else if (mode === 'pause') play();
      else if (mode === 'map'){ if (S && S.started && !S.cleared) play(); else showTitle(); }
      else if (mode === 'case') closeCase();
      else if (mode === 'clear') exitToClassic('contact');
      return;
    }
    if (mode === 'play'){
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.code === 'KeyP'){ e.preventDefault(); showPause(); return; }
      if (e.code === 'KeyM'){ e.preventDefault(); showMap(); return; }
      var k = keyName(e);
      if (k){ e.preventDefault(); if (e.repeat) K[k] = true; else press(k, true); }
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight'){ e.preventDefault(); menuFocus(1); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft'){ e.preventDefault(); menuFocus(-1); }
  }
  function onKeyUp(e){
    if (mode === 'closed') return;
    e.stopPropagation();
    var k = keyName(e);
    if (k) K[k] = false;
  }

  /* ---------- public API ---------- */
  function open(){
    build();
    if (!S) newGame();
    if (mode !== 'closed') return;
    prevFocus = document.activeElement;
    root.classList.add('open');
    document.documentElement.classList.add('sa-lock');
    inerted = [];
    Array.prototype.forEach.call(document.body.children, function(c){ if (c !== root && !c.inert){ c.inert = true; inerted.push(c); } });
    sizeCanvas();
    if (document.fonts && document.fonts.load) document.fonts.load('10px "Press Start 2P"').catch(function(){});
    mode = 'title';
    showTitle();
    last = 0;
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function close(){
    if (!root || mode === 'closed') return;
    mode = 'closed';
    releaseKeys(); hideCard();
    root.classList.remove('open');
    document.documentElement.classList.remove('sa-lock');
    inerted.forEach(function(c){ c.inert = false; }); inerted = [];
    if (raf){ cancelAnimationFrame(raf); raf = 0; }
    if (prevFocus && prevFocus.focus) try { prevFocus.focus({ preventScroll:true }); } catch(e){}
  }
  function autoOpen(){
    var skip = false;
    try { skip = sessionStorage.getItem('sa-skip') === '1'; } catch(e){}
    if (!skip) open();
  }

  window.SuperAastha = { open:open, close:close, autoOpen:autoOpen, isOpen:function(){ return mode !== 'closed'; } };
})();
