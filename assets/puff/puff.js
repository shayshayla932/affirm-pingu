/*!
 * 棉棉 Puff · 角色组件 v0.3
 * 不依赖任何框架。浏览器里用 <script src="puff.js"> 后得到 window.Puff；
 * Node / 打包工具里用 require('./puff.js') 或 import Puff from './puff.js'。
 * 样式在 puff.css，必须一起引入。
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Puff = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- 颜色 ---------- */
  var IND = { acc: '#7B80F0', accD: '#5C61D6', accS: '#E3E4FD', accSD: '#C5C8F7' };
  var APR = { acc: '#FF8F63', accD: '#EA7145', accS: '#FFE4D8', accSD: '#FFC9B3' };
  var GLD = { acc: '#FFC94D', accD: '#E3A92B', accS: '#FFF0C4', accSD: '#F5D688' };
  function mix(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }

  var THEMES = {
    pink:   mix({ name: '粉色', g1: '#FFF1F6', g2: '#FFC6DA', g3: '#E7A2D2', eye: '#3B2533', hiO: 1, stage: '#FFEFF5', glow: 'rgba(255, 198, 218, 0.55)' }, IND),
    white:  mix({ name: '白色', g1: '#FFFFFF', g2: '#F7F4EF', g3: '#D9D8EA', eye: '#2F2B35', hiO: 1, stage: '#EEEBE6', glow: 'rgba(217, 216, 234, 0.6)' }, IND),
    black:  mix({ name: '黑色', g1: '#6E6879', g2: '#3E3946', g3: '#24202B', eye: '#F7EDD2', hiO: 0.35, stage: '#E9E7F0', glow: 'rgba(140, 130, 170, 0.35)' }, GLD),
    blue:   mix({ name: '浅蓝', g1: '#F0FAFF', g2: '#C4E6F8', g3: '#A4C1F0', eye: '#22334B', hiO: 1, stage: '#EAF5FC', glow: 'rgba(164, 193, 240, 0.5)' }, APR),
    green:  mix({ name: '草绿', g1: '#EEFAE2', g2: '#B5E08F', g3: '#86C8A0', eye: '#22331D', hiO: 1, stage: '#EDF7E6', glow: 'rgba(181, 224, 143, 0.5)' }, APR),
    orange: mix({ name: '橙色', g1: '#FFF0DC', g2: '#FFBA78', g3: '#FF9480', eye: '#3A2416', hiO: 1, stage: '#FFF1E4', glow: 'rgba(255, 186, 120, 0.5)' }, IND),
    rose:   mix({ name: '玫红', g1: '#FFB3CF', g2: '#F45C93', g3: '#D3479F', eye: '#3A0F22', hiO: 0.85, stage: '#FFEEF4', glow: 'rgba(244, 92, 147, 0.35)' }, GLD)
  };
  var COLORS = ['pink', 'white', 'black', 'blue', 'green', 'orange', 'rose'];

  /* ---------- 时长与概率 ---------- */
  var DURATIONS = { hop: 920, float: 3650, press: 2650, fog: 5250, tapSquish: 300, squeeze: 300, particle: 2200, comboWindow: 1000, comboReset: 2300 };
  var TAP_WEIGHTS = { hop: 0.4, float: 0.25, press: 0.2, fog: 0.15 };
  var IDLE_WEIGHTS = { hop: 0.55, float: 0.25, press: 0.12, fog: 0.08 };
  var IDLE_INTERVAL = [3000, 7000];
  var MAX_PARTICLES = 40;
  var MAX_PER_TAP = 9;

  var uid = 0;
  function show(b) { return b ? 'inline' : 'none'; }
  function pick(weights) {
    var r = Math.random(), acc = 0, k, last;
    for (k in weights) { acc += weights[k]; last = k; if (r < acc) return k; }
    return last;
  }

  function normalize(o) {
    o = o || {};
    var hold = o.hold === 'laptop' || o.hold === 'pillow' ? o.hold : 'none';
    return {
      color: THEMES[o.color] ? o.color : 'pink',
      hat: !!o.hat, glasses: !!o.glasses, headphones: !!o.headphones, blanket: !!o.blanket,
      hold: hold
    };
  }

  function visibility(o) {
    var asleep = o.hold === 'pillow';
    return {
      hat: show(o.hat), glasses: show(o.glasses), headphones: show(o.headphones),
      laptop: show(o.hold === 'laptop'), pillow: show(asleep), blanket: show(o.blanket),
      hands: show(o.hold !== 'none'),
      awake: show(!asleep), sleep: show(asleep), squeeze: 'none'
    };
  }

  function svgBody(c, gid, v) {
    return `
<defs>
<linearGradient id="${gid}b" gradientUnits="userSpaceOnUse" x1="50" y1="40" x2="190" y2="225"><stop offset="0" style="stop-color: ${c.g1}"></stop><stop offset="0.55" style="stop-color: ${c.g2}"></stop><stop offset="1" style="stop-color: ${c.g3}"></stop></linearGradient>
<linearGradient id="${gid}a" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" style="stop-color: ${c.acc}"></stop><stop offset="1" style="stop-color: ${c.accD}"></stop></linearGradient>
<linearGradient id="pfHi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="s-w5"></stop><stop offset="0.7" class="s-w0"></stop></linearGradient>
<radialGradient id="pfBall" cx="0.35" cy="0.3" r="0.7"><stop offset="0" class="s-w7"></stop><stop offset="1" class="s-w0"></stop></radialGradient>
<filter id="pfS1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"></feGaussianBlur></filter>
<filter id="pfS4" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4"></feGaussianBlur></filter>
<filter id="pfS9" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9"></feGaussianBlur></filter>
</defs>
<g filter="url(#pfS9)" opacity="0.35">
<ellipse cx="120" cy="150" rx="88" ry="66" fill="${c.g2}"></ellipse>
<circle cx="120" cy="84" r="38" fill="${c.g2}"></circle>
</g>
<ellipse cx="120" cy="152" rx="80" ry="60" fill="url(#${gid}b)"></ellipse>
<circle class="pf-bump pf-d3" cx="120" cy="84" r="36" fill="url(#${gid}b)"></circle>
<circle class="pf-bump pf-d2" cx="80" cy="104" r="32" fill="url(#${gid}b)"></circle>
<circle class="pf-bump pf-d4" cx="160" cy="100" r="33" fill="url(#${gid}b)"></circle>
<circle class="pf-bump pf-d1" cx="54" cy="142" r="28" fill="url(#${gid}b)"></circle>
<circle class="pf-bump pf-d5" cx="186" cy="140" r="28" fill="url(#${gid}b)"></circle>
<circle class="pf-bump pf-d7" cx="66" cy="186" r="26" fill="url(#${gid}b)"></circle>
<circle class="pf-bump pf-d6" cx="174" cy="186" r="26" fill="url(#${gid}b)"></circle>
<mask id="${gid}m" maskUnits="userSpaceOnUse" x="0" y="0" width="240" height="240">
<ellipse cx="120" cy="152" rx="80" ry="60" fill="#FFFFFF"></ellipse>
<circle class="pf-bump pf-d3" cx="120" cy="84" r="36" fill="#FFFFFF"></circle>
<circle class="pf-bump pf-d2" cx="80" cy="104" r="32" fill="#FFFFFF"></circle>
<circle class="pf-bump pf-d4" cx="160" cy="100" r="33" fill="#FFFFFF"></circle>
<circle class="pf-bump pf-d1" cx="54" cy="142" r="28" fill="#FFFFFF"></circle>
<circle class="pf-bump pf-d5" cx="186" cy="140" r="28" fill="#FFFFFF"></circle>
<circle class="pf-bump pf-d7" cx="66" cy="186" r="26" fill="#FFFFFF"></circle>
<circle class="pf-bump pf-d6" cx="174" cy="186" r="26" fill="#FFFFFF"></circle>
</mask>
<g mask="url(#${gid}m)">
<ellipse cx="150" cy="262" rx="140" ry="84" fill="${c.g3}" opacity="0.45"></ellipse>
<g opacity="${c.hiO}"><ellipse cx="96" cy="64" rx="70" ry="44" fill="#FFFFFF" opacity="0.32"></ellipse></g>
</g>
<g opacity="${c.hiO}">
<path class="pf-spec" stroke="#FFFFFF" opacity="0.85" d="M86,72 Q97,58 114,54"></path>
<circle cx="125" cy="53.5" r="2.4" fill="#FFFFFF" opacity="0.85"></circle>
</g>
<ellipse class="pf-patch" cx="120" cy="152" rx="62" ry="42" fill="#FFFFFF"></ellipse>
<g class="pf-g-awake" display="${v.awake}">
<g class="pf-eyes">
<g transform="translate(102 146)"><g class="pf-eye"><ellipse cx="0" cy="0" rx="6.5" ry="8.5" fill="${c.eye}"></ellipse></g></g>
<g transform="translate(138 146)"><g class="pf-eye"><ellipse cx="0" cy="0" rx="6.5" ry="8.5" fill="${c.eye}"></ellipse></g></g>
</g>
</g>
<g class="pf-g-squeeze" display="${v.squeeze}">
<path class="pf-ln" stroke="${c.eye}" d="M95,140 L107,146 L95,152"></path>
<path class="pf-ln" stroke="${c.eye}" d="M145,140 L133,146 L145,152"></path>
</g>
<g class="pf-g-sleep" display="${v.sleep}">
<path class="pf-ln" stroke="${c.eye}" d="M95,147 Q102,152.5 109,147"></path>
<path class="pf-ln" stroke="${c.eye}" d="M131,147 Q138,152.5 145,147"></path>
<text x="178" y="80" class="pf-z" fill="#9A93A6">z</text>
<text x="196" y="60" class="pf-z pf-z2" fill="#9A93A6">z</text>
</g>
<g class="pf-g-glasses" display="${v.glasses}">
<g transform="translate(100 146) scale(1.28)">
<path d="M-12,8 A6,6 0 0 1 -14,-1 A7,7 0 0 1 -6,-11 A8,8 0 0 1 6,-11 A7,7 0 0 1 14,-1 A6,6 0 0 1 12,8 Q0,13 -12,8 Z" fill="#FFFFFF" opacity="0.28"></path>
<path class="pf-ln" stroke="${c.eye}" d="M-12,8 A6,6 0 0 1 -14,-1 A7,7 0 0 1 -6,-11 A8,8 0 0 1 6,-11 A7,7 0 0 1 14,-1 A6,6 0 0 1 12,8 Q0,13 -12,8 Z"></path>
<path class="pf-ln" stroke="#FFFFFF" opacity="0.8" d="M-9,-3 Q-8,-7 -4,-8"></path>
</g>
<g transform="translate(140 146) scale(1.28)">
<path d="M-12,8 A6,6 0 0 1 -14,-1 A7,7 0 0 1 -6,-11 A8,8 0 0 1 6,-11 A7,7 0 0 1 14,-1 A6,6 0 0 1 12,8 Q0,13 -12,8 Z" fill="#FFFFFF" opacity="0.28"></path>
<path class="pf-ln" stroke="${c.eye}" d="M-12,8 A6,6 0 0 1 -14,-1 A7,7 0 0 1 -6,-11 A8,8 0 0 1 6,-11 A7,7 0 0 1 14,-1 A6,6 0 0 1 12,8 Q0,13 -12,8 Z"></path>
<path class="pf-ln" stroke="#FFFFFF" opacity="0.8" d="M-9,-3 Q-8,-7 -4,-8"></path>
</g>
<path class="pf-ln" stroke="${c.eye}" d="M117.5,142 Q120,139.5 122.5,142"></path>
<path class="pf-ln" stroke="${c.eye}" d="M82.5,142 L66,136"></path>
<path class="pf-ln" stroke="${c.eye}" d="M157.5,142 L174,136"></path>
</g>
<g class="pf-g-blanket" display="${v.blanket}">
<ellipse cx="70" cy="170" rx="10" ry="34" fill="#1A1020" opacity="0.1" filter="url(#pfS4)"></ellipse>
<ellipse cx="170" cy="170" rx="10" ry="34" fill="#1A1020" opacity="0.1" filter="url(#pfS4)"></ellipse>
<path d="M50,120 Q38,124 30,150 Q22,190 30,226 Q78,236 124,228 Q110,204 92,190 Q66,170 50,120 Z" fill="${c.accS}"></path>
<path d="M50,120 Q38,124 30,150 Q22,190 30,226 Q78,236 124,228 Q110,204 92,190 Q66,170 50,120 Z" fill="url(#pfHi)"></path>
<path class="pf-fold" stroke="${c.accSD}" d="M44,140 Q40,180 52,222"></path>
<path class="pf-fold" stroke="${c.accSD}" d="M62,160 Q64,196 84,226"></path>
<path d="M190,120 Q202,124 210,150 Q218,190 210,226 Q162,236 116,228 Q130,204 148,190 Q174,170 190,120 Z" fill="${c.accS}"></path>
<path d="M190,120 Q202,124 210,150 Q218,190 210,226 Q162,236 116,228 Q130,204 148,190 Q174,170 190,120 Z" fill="url(#pfHi)"></path>
<path class="pf-fold" stroke="${c.accSD}" d="M196,140 Q200,180 188,222"></path>
<path class="pf-fold" stroke="${c.accSD}" d="M178,160 Q176,196 156,226"></path>
<path class="pf-fold" stroke="#FFFFFF" opacity="0.7" d="M148,191 Q174,170 189,123"></path>
<path transform="translate(186 196) scale(1.3)" d="M0,-3.5 Q0.6,-0.6 3.5,0 Q0.6,0.6 0,3.5 Q-0.6,0.6 -3.5,0 Q-0.6,-0.6 0,-3.5 Z" fill="${c.acc}"></path>
<path transform="translate(164 214)" d="M0,-3.5 Q0.6,-0.6 3.5,0 Q0.6,0.6 0,3.5 Q-0.6,0.6 -3.5,0 Q-0.6,-0.6 0,-3.5 Z" fill="${c.acc}"></path>
</g>
<g class="pf-g-laptop" display="${v.laptop}">
<defs><radialGradient id="pfAlu" cx="0.3" cy="0.25" r="0.95"><stop offset="0" class="s-a1"></stop><stop offset="0.55" class="s-a2"></stop><stop offset="1" class="s-a3"></stop></radialGradient><linearGradient id="pfDeck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="s-d1"></stop><stop offset="1" class="s-d2"></stop></linearGradient></defs>
<ellipse cx="124" cy="174" rx="50" ry="7" fill="#1A1020" opacity="0.18" filter="url(#pfS4)"></ellipse>
<ellipse cx="120" cy="229" rx="72" ry="4" fill="#1A1020" opacity="0.16" filter="url(#pfS4)"></ellipse>
<path d="M64,211 L176,211 L187,220 L53,220 Z" fill="url(#pfDeck)"></path>
<path d="M53,220 L187,220 L187,223.5 Q187,226 184.5,226 L55.5,226 Q53,226 53,223.5 Z" fill="#A4A7B6"></path>
<path class="pf-band2" stroke="#FFFFFF" opacity="0.8" d="M66,212 L174,212"></path>
<rect x="78" y="208" width="84" height="5" rx="2" fill="#8E91A2"></rect>
<rect x="76" y="166" width="88" height="46" rx="9" fill="#9EA1B1"></rect>
<rect x="76" y="164" width="86" height="46" rx="9" fill="url(#pfAlu)"></rect>
<path class="pf-band2" stroke="#FFFFFF" opacity="0.9" d="M84,165.5 L150,165.5"></path>
<path class="pf-band2" stroke="#FFFFFF" opacity="0.7" d="M77.5,172 L77.5,196"></path>
<ellipse cx="96" cy="176" rx="14" ry="5" transform="rotate(-18 96 176)" fill="#FFFFFF" opacity="0.55" filter="url(#pfS1)"></ellipse>
<path transform="translate(119 187) scale(2.4)" d="M0,-3.5 Q0.6,-0.6 3.5,0 Q0.6,0.6 0,3.5 Q-0.6,0.6 -3.5,0 Q-0.6,-0.6 0,-3.5 Z" fill="${c.acc}"></path>
<path transform="translate(118.5 186.3) scale(1.2)" d="M0,-3.5 Q0.6,-0.6 3.5,0 Q0.6,0.6 0,3.5 Q-0.6,0.6 -3.5,0 Q-0.6,-0.6 0,-3.5 Z" fill="#FFFFFF" opacity="0.45"></path>
</g>
<g class="pf-g-pillow" display="${v.pillow}">
<g transform="rotate(-7 120 196)">
<ellipse cx="120" cy="170" rx="52" ry="5" fill="#1A1020" opacity="0.12" filter="url(#pfS4)"></ellipse>
<rect x="66" y="168" width="108" height="58" rx="26" fill="#FFF7EA"></rect>
<rect x="66" y="168" width="108" height="58" rx="26" fill="url(#pfHi)"></rect>
<path d="M126,186 A12,12 0 1 0 132,206 A10,10 0 1 1 126,186 Z" fill="${c.acc}"></path>
<path transform="translate(148 184) scale(1.4)" d="M0,-3.5 Q0.6,-0.6 3.5,0 Q0.6,0.6 0,3.5 Q-0.6,0.6 -3.5,0 Q-0.6,-0.6 0,-3.5 Z" fill="${c.acc}"></path>
<path transform="translate(94 210)" d="M0,-3.5 Q0.6,-0.6 3.5,0 Q0.6,0.6 0,3.5 Q-0.6,0.6 -3.5,0 Q-0.6,-0.6 0,-3.5 Z" fill="${c.acc}"></path>
</g>
</g>
<g class="pf-g-hands" display="${v.hands}">
<mask id="${gid}h" maskUnits="userSpaceOnUse" x="0" y="0" width="240" height="240">
<path d="M48,176 C50,196 62,206 78,205 C88,204 92,196 88,190 C84,184 74,186 66,180 C60,176 56,170 52,168 Z" fill="#FFFFFF"></path>
<path d="M192,176 C190,196 178,206 162,205 C152,204 148,196 152,190 C156,184 166,186 174,180 C180,176 184,170 188,168 Z" fill="#FFFFFF"></path>
</mask>
<path d="M48,176 C50,196 62,206 78,205 C88,204 92,196 88,190 C84,184 74,186 66,180 C60,176 56,170 52,168 Z" fill="url(#${gid}b)"></path>
<path d="M192,176 C190,196 178,206 162,205 C152,204 148,196 152,190 C156,184 166,186 174,180 C180,176 184,170 188,168 Z" fill="url(#${gid}b)"></path>
<g mask="url(#${gid}h)">
<ellipse cx="150" cy="262" rx="140" ry="84" fill="${c.g3}" opacity="0.45"></ellipse>
</g>
</g>
<g class="pf-g-hat" display="${v.hat}">
<ellipse cx="120" cy="115" rx="54" ry="7" fill="#1A1020" opacity="0.14" filter="url(#pfS4)"></ellipse>
<g transform="rotate(-6 120 90)">
<circle cx="131" cy="36" r="12" fill="#FFF8EC"></circle>
<circle cx="131" cy="36" r="12" fill="url(#pfBall)"></circle>
<path d="M70,108 C66,58 92,42 120,42 C148,42 174,58 170,106 Z" fill="url(#${gid}a)"></path>
<ellipse cx="102" cy="62" rx="16" ry="8" transform="rotate(-20 102 62)" fill="#FFFFFF" opacity="0.45" filter="url(#pfS4)"></ellipse>
<path class="pf-rib" stroke="#FFFFFF" d="M98,48 Q92,76 94,102"></path>
<path class="pf-rib" stroke="#FFFFFF" d="M120,43 L120,100"></path>
<path class="pf-rib" stroke="#FFFFFF" d="M142,48 Q148,76 146,102"></path>
<path d="M64,101 Q120,86 176,99 Q179,108 176,117 Q120,104 64,121 Q61,111 64,101 Z" fill="${c.accD}"></path>
<path d="M64,101 Q120,86 176,99 Q179,108 176,117 Q120,104 64,121 Q61,111 64,101 Z" fill="url(#pfHi)"></path>
</g>
</g>
<g class="pf-g-headphones" display="${v.headphones}">
<defs><radialGradient id="${gid}Pearl" cx="0.35" cy="0.3" r="0.85"><stop offset="0" class="s-p1"></stop><stop offset="0.55" class="s-p3"></stop><stop offset="1" class="s-p2"></stop></radialGradient><linearGradient id="${gid}Shell" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="s-p3"></stop><stop offset="1" class="s-p4"></stop></linearGradient></defs>
<path class="pf-tube" stroke="#1A1020" opacity="0.12" filter="url(#pfS1)" d="M46,126 C40,86 72,50 120,48 C168,50 200,86 194,126"></path>
<path class="pf-tube" stroke="#B9BAC8" d="M44,120 C38,80 70,44 120,42 C170,44 202,80 196,120"></path>
<path class="pf-tube2" stroke="#ECECF2" d="M44,119 C38,79 70,43 120,41 C170,43 202,79 196,119"></path>
<path class="pf-band2" stroke="#FFFFFF" d="M52,92 C62,64 86,47 120,43"></path>
<rect x="39" y="110" width="7" height="14" rx="3.5" fill="url(#${gid}Shell)"></rect>
<rect x="194" y="110" width="7" height="14" rx="3.5" fill="url(#${gid}Shell)"></rect>
<ellipse cx="50" cy="146" rx="14" ry="20" fill="#1A1020" opacity="0.2" filter="url(#pfS4)"></ellipse>
<ellipse cx="190" cy="146" rx="14" ry="20" fill="#1A1020" opacity="0.2" filter="url(#pfS4)"></ellipse>
<ellipse cx="52" cy="140" rx="6.5" ry="18" fill="${c.accSD}"></ellipse>
<ellipse cx="54" cy="139" rx="4.5" ry="15.5" fill="${c.accS}"></ellipse>
<ellipse cx="37" cy="141" rx="14" ry="21" fill="url(#${gid}Shell)"></ellipse>
<ellipse cx="42" cy="140" rx="14" ry="20.5" fill="url(#${gid}Pearl)"></ellipse>
<path class="pf-band2" stroke="#FFFFFF" opacity="0.95" d="M31,128 Q34,121 40,120"></path>
<ellipse class="pf-ring" cx="42" cy="140" rx="9.5" ry="15" stroke="${c.acc}" opacity="0.5"></ellipse>
<ellipse cx="37" cy="131" rx="3.4" ry="5" transform="rotate(-15 37 131)" fill="#FFFFFF" opacity="0.95"></ellipse>
<circle cx="40" cy="154" r="1.8" fill="${c.accD}"></circle>
<ellipse cx="188" cy="140" rx="6.5" ry="18" fill="${c.accSD}"></ellipse>
<ellipse cx="186" cy="139" rx="4.5" ry="15.5" fill="${c.accS}"></ellipse>
<ellipse cx="203" cy="141" rx="14" ry="21" fill="url(#${gid}Shell)"></ellipse>
<ellipse cx="198" cy="140" rx="14" ry="20.5" fill="url(#${gid}Pearl)"></ellipse>
<path class="pf-band2" stroke="#FFFFFF" opacity="0.95" d="M187,128 Q190,121 196,120"></path>
<ellipse class="pf-ring" cx="198" cy="140" rx="9.5" ry="15" stroke="${c.acc}" opacity="0.5"></ellipse>
<ellipse cx="193" cy="131" rx="3.4" ry="5" transform="rotate(-15 193 131)" fill="#FFFFFF" opacity="0.95"></ellipse>
</g>
`;
  }
  function particleSVG(c, gid) {
    return `<svg viewBox="0 0 44 36" aria-hidden="true"><defs><linearGradient id="${gid}c" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" style="stop-color: ${c.g1}"></stop><stop offset="1" style="stop-color: ${c.g2}"></stop></linearGradient></defs><path class="pf-wisp" stroke="${c.g2}" opacity="0.7" d="M8,17 Q3,13 5,8"></path><path class="pf-wisp" stroke="${c.g2}" opacity="0.7" d="M35,12 Q39,8 38,4"></path><path class="pf-wisp" stroke="${c.g2}" opacity="0.6" d="M39,26 Q43,27 43,23"></path><path class="pf-wisp" stroke="${c.g2}" opacity="0.5" d="M16,32 Q14,36 10,35"></path><circle cx="12" cy="22" r="8" fill="url(#${gid}c)"></circle><circle cx="20" cy="15" r="10" fill="url(#${gid}c)"></circle><circle cx="30" cy="17" r="8.5" fill="url(#${gid}c)"></circle><circle cx="34" cy="24" r="6.5" fill="url(#${gid}c)"></circle><circle cx="22" cy="25" r="9" fill="url(#${gid}c)"></circle><ellipse cx="23" cy="29" rx="10" ry="3.5" fill="${c.g3}" opacity="0.3"></ellipse><ellipse cx="17" cy="10.5" rx="4.5" ry="2.4" transform="rotate(-20 17 10.5)" fill="#FFFFFF" opacity="0.65"></ellipse></svg>`;
  }
  var FOG_SVG = `<svg viewBox="0 0 792 752" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<radialGradient id="fogG" cx="0.5" cy="0.5" r="0.65"><stop offset="0" class="s-f8"></stop><stop offset="1" class="s-f5"></stop></radialGradient>
<mask id="fogM" maskUnits="userSpaceOnUse" x="0" y="0" width="792" height="752">
<rect x="0" y="0" width="792" height="752" fill="#FFFFFF"></rect>
<path class="pf-wp pf-wp1" pathLength="1" stroke="#000000" d="M328,286 L328,334"></path>
<path class="pf-wp pf-wp2" pathLength="1" stroke="#000000" d="M464,286 L464,334"></path>
<path class="pf-wp pf-wp3" pathLength="1" stroke="#000000" d="M282,406 Q396,512 510,406"></path>
</mask>
</defs>
<rect x="0" y="0" width="792" height="752" fill="url(#fogG)" mask="url(#fogM)"></rect>
</svg>`;

  function star(left, top, size, opacity, color, fromRight, fromBottom) {
    var pos = (fromRight ? 'right:' : 'left:') + left + '%;' + (fromBottom ? 'bottom:' : 'top:') + top + '%;';
    return '<svg class="pf-deco" aria-hidden="true" viewBox="-4 -4 8 8" style="' + pos + 'width:' + size + 'px;height:' + size + 'px;opacity:' + opacity + '"><path d="M0,-3.5 Q0.6,-0.6 3.5,0 Q0.6,0.6 0,3.5 Q-0.6,0.6 -3.5,0 Q-0.6,-0.6 0,-3.5 Z" fill="' + color + '"></path></svg>';
  }
  function decorHTML(c) {
    return '<div class="pf-glow"></div>' +
      star(12, 18, 22, 0.4, c.acc) +
      star(15, 28, 14, 0.4, c.acc, true) +
      '<svg class="pf-deco" aria-hidden="true" viewBox="0 0 40 40" style="right:12%;top:13%;width:40px;height:40px;opacity:.32"><path d="M26,6 A14,14 0 1 0 34,28 A12,12 0 1 1 26,6 Z" fill="' + c.acc + '"></path></svg>' +
      star(19, 23, 12, 0.35, c.acc, false, true);
  }

  var STATIC_STYLE = '<style>' +
    '.pf-ln{fill:none;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round}' +
    '.pf-spec{fill:none;stroke-width:4.5;stroke-linecap:round}' +
    '.pf-band2{fill:none;stroke-width:2.2;stroke-linecap:round}' +
    '.pf-tube{fill:none;stroke-width:7.5;stroke-linecap:round}.pf-tube2{fill:none;stroke-width:4.5;stroke-linecap:round}' +
    '.pf-ring{fill:none;stroke-width:1.6}.pf-fold{fill:none;stroke-width:2.4;stroke-linecap:round}' +
    '.pf-rib{fill:none;stroke-width:2.2;stroke-linecap:round;opacity:.3}' +
    '.pf-patch{opacity:0}.pf-z{font-family:sans-serif;font-weight:900;font-size:20px;opacity:.8}.pf-z2{font-size:14px}' +
    '.s-w7{stop-color:#FFFFFF;stop-opacity:.8}.s-w5{stop-color:#FFFFFF;stop-opacity:.5}.s-w0{stop-color:#FFFFFF;stop-opacity:0}' +
    '.s-p1{stop-color:#FFFFFF}.s-p2{stop-color:#C4C5D2}.s-p3{stop-color:#E8E8EF}.s-p4{stop-color:#A9AABA}' +
    '.s-a1{stop-color:#F7F8FB}.s-a2{stop-color:#DCDEE6}.s-a3{stop-color:#B3B6C5}.s-d1{stop-color:#E4E6EC}.s-d2{stop-color:#C0C3CF}' +
    '</style>';

  /**
   * 生成一张角色 SVG 字符串（不带动画）。
   * opts: { color, hat, glasses, headphones, blanket, hold: 'none'|'laptop'|'pillow', eyes: 'auto'|'squeeze', standalone: bool }
   * standalone=true 时自带样式，可以直接存成 .svg 文件或当 <img> 用。
   */
  function renderSVG(opts) {
    var o = normalize(opts);
    var c = THEMES[o.color];
    var gid = 'pf' + (++uid);
    var v = visibility(o);
    if (opts && opts.eyes === 'squeeze') { v.awake = 'none'; v.sleep = 'none'; v.squeeze = 'inline'; }
    var standalone = !!(opts && opts.standalone);
    return '<svg xmlns="http://www.w3.org/2000/svg" class="pf-svg" viewBox="0 0 240 240" ' +
      (standalone ? 'width="240" height="240" role="img" aria-label="棉棉"' : 'aria-hidden="true"') + '>' +
      (standalone ? STATIC_STYLE : '') + svgBody(c, gid, v) + '</svg>';
  }

  /** 单个掉落棉花团的 SVG 字符串。 */
  function renderCottonSVG(color, standalone) {
    var c = THEMES[color] || THEMES.pink;
    var s = particleSVG(c, 'pfc' + (++uid));
    if (standalone) s = s.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="44" height="36" ').replace('<defs>', '<style>.pf-wisp{fill:none;stroke-width:1.4;stroke-linecap:round}</style><defs>');
    return s;
  }

  /**
   * 把棉棉挂到一个容器里。
   * options:
   *   color, hat, glasses, headphones, blanket, hold   外观
   *   mode: 'normal' | 'count'                          点击模式
   *   size: 420                                          角色尺寸（px）
   *   autoPlay: true                                     发呆时自动随机做动作
   *   background: true                                   是否画舞台背景（关掉则透明）
   *   onTap(info)        每次点击：{ mode, action } 或 { mode, count, combo, dropped }
   *   onAction(name)     每次开始播放动作
   *   onCount(count, combo)  计数模式下计数变化
   */
  function create(container, options) {
    if (!container) throw new Error('Puff.create: 需要一个容器元素');
    options = options || {};
    var look = normalize(options);
    var mode = options.mode === 'count' ? 'count' : 'normal';
    var size = options.size || 420;
    var autoPlay = options.autoPlay !== false;
    var gid = 'pfi' + (++uid);

    var rootEl = document.createElement('div');
    rootEl.className = 'pf-root' + (options.background === false ? ' pf-no-bg' : '');
    rootEl.style.setProperty('--pf-size', size + 'px');
    rootEl.style.setProperty('--pf-k', String(size / 420));
    rootEl.innerHTML =
      '<div class="pf-bg"></div>' +
      '<button type="button" class="pf-tap"><div class="pf-stage"><div class="pf-shadow"></div><div class="pf-hop"><div class="pf-breathe"></div></div></div></button>' +
      '<div class="pf-particles"></div>' +
      '<div class="pf-glass"></div>' +
      '<div class="pf-fogl" aria-hidden="true">' + FOG_SVG + '</div>';
    container.appendChild(rootEl);

    var el = {
      bg: rootEl.querySelector('.pf-bg'),
      tap: rootEl.querySelector('.pf-tap'),
      shadow: rootEl.querySelector('.pf-shadow'),
      hop: rootEl.querySelector('.pf-hop'),
      breathe: rootEl.querySelector('.pf-breathe'),
      particles: rootEl.querySelector('.pf-particles'),
      glass: rootEl.querySelector('.pf-glass'),
      fog: rootEl.querySelector('.pf-fogl')
    };

    var pool = [];
    for (var i = 0; i < MAX_PARTICLES; i++) {
      var d = document.createElement('div');
      d.className = 'pf-cot off';
      el.particles.appendChild(d);
      pool.push({ el: d, gen: 0 });
    }
    var poolIdx = 0;

    var count = 0, taps = [], tapFlip = false;
    var action = '', tActEnd = 0, tIdle = 0, tSqueeze = 0, tCombo = 0, tSquish = 0, destroyed = false;

    function paint() {
      var c = THEMES[look.color];
      rootEl.style.setProperty('--pf-stage-bg', c.stage);
      rootEl.style.setProperty('--pf-glow', c.glow);
      el.bg.innerHTML = decorHTML(c);
      el.breathe.innerHTML = renderSVG(look);
      el.breathe.className = 'pf-breathe' + (look.hold === 'pillow' ? ' slow' : '');
      var p = particleSVG(c, gid + 'c');
      pool.forEach(function (s) { s.el.innerHTML = p; });
      el.tap.setAttribute('aria-label', mode === 'count' ? '点一下，计数加一并掉出棉花' : '点一下，棉棉随机做一个动作');
    }

    function setActClass(name) {
      [el.hop, el.shadow, el.glass, el.fog, el.bg].forEach(function (n) {
        var base = n === el.hop ? 'pf-hop' : n === el.shadow ? 'pf-shadow' : n === el.glass ? 'pf-glass' : n === el.fog ? 'pf-fogl' : 'pf-bg';
        n.className = base + (name ? ' ' + name : '');
      });
    }

    function play(name) {
      if (destroyed || !DURATIONS[name] || ['hop', 'float', 'press', 'fog'].indexOf(name) < 0) return;
      clearTimeout(tActEnd);
      setActClass('');
      void el.hop.offsetWidth; // 强制重排，让同一个动作可以连续重播
      action = name;
      setActClass(name);
      if (options.onAction) options.onAction(name);
      tActEnd = setTimeout(function () { action = ''; setActClass(''); }, DURATIONS[name]);
    }

    function scheduleIdle() {
      clearTimeout(tIdle);
      var wait = IDLE_INTERVAL[0] + Math.random() * (IDLE_INTERVAL[1] - IDLE_INTERVAL[0]);
      tIdle = setTimeout(function () {
        if (autoPlay && mode === 'normal' && look.hold !== 'pillow' && !action) play(pick(IDLE_WEIGHTS));
        scheduleIdle();
      }, wait);
    }

    function tapCount() {
      var now = Date.now();
      taps = taps.filter(function (t) { return now - t < DURATIONS.comboWindow; });
      taps.push(now);
      var combo = taps.length;
      var n = Math.min(MAX_PER_TAP, 1 + Math.floor(combo * 0.9));
      for (var k = 0; k < n; k++) {
        var slot = pool[poolIdx];
        poolIdx = (poolIdx + 1) % MAX_PARTICLES;
        slot.gen += 1;
        var dir = 1 + Math.floor(Math.random() * 4);
        var x = dir <= 2 ? 110 + Math.random() * 46 : 266 + Math.random() * 46;
        var y = 154 + Math.random() * 120;
        var s = 22 + Math.random() * 16;
        slot.el.style.left = Math.round(x) + 'px';
        slot.el.style.top = Math.round(y) + 'px';
        slot.el.style.width = Math.round(s) + 'px';
        slot.el.style.height = Math.round(s) + 'px';
        slot.el.className = 'pf-cot pf-d' + dir + (slot.gen % 2 ? 'a' : 'b');
      }
      count += 1;
      // 按一下被压扁
      tapFlip = !tapFlip;
      el.hop.className = 'pf-hop ' + (tapFlip ? 'tapa' : 'tapb');
      clearTimeout(tSquish);
      tSquish = setTimeout(function () { el.hop.className = 'pf-hop'; }, DURATIONS.tapSquish);
      // 挤眼
      rootEl.classList.add('is-squeeze');
      clearTimeout(tSqueeze);
      tSqueeze = setTimeout(function () { rootEl.classList.remove('is-squeeze'); }, DURATIONS.squeeze);
      // 连击结束
      clearTimeout(tCombo);
      tCombo = setTimeout(function () {
        pool.forEach(function (sl) { sl.el.className = 'pf-cot off'; });
        taps = [];
        if (options.onCount) options.onCount(count, 0);
      }, DURATIONS.comboReset);
      if (options.onCount) options.onCount(count, combo);
      return { mode: 'count', count: count, combo: combo, dropped: n };
    }

    function onTap() {
      var info;
      if (mode === 'count') info = tapCount();
      else { var a = pick(TAP_WEIGHTS); play(a); info = { mode: 'normal', action: a }; }
      if (options.onTap) options.onTap(info);
    }
    el.tap.addEventListener('click', onTap);

    paint();
    scheduleIdle();

    return {
      el: rootEl,
      /** 播放一个动作：'hop' | 'float' | 'press' | 'fog' */
      play: play,
      /** 模拟一次点击（等同用户点角色） */
      tap: onTap,
      /** 改外观，传哪些改哪些：{ color, hat, glasses, headphones, blanket, hold } */
      set: function (patch) {
        var next = {}, k;
        for (k in look) next[k] = look[k];
        for (k in patch) next[k] = patch[k];
        look = normalize(next);
        paint();
      },
      /** 'normal' 点击随机动作；'count' 点击计数掉棉花 */
      setMode: function (m) {
        mode = m === 'count' ? 'count' : 'normal';
        clearTimeout(tActEnd); action = ''; setActClass('');
        paint();
      },
      setAutoPlay: function (b) { autoPlay = !!b; },
      getState: function () {
        var o = {}, k; for (k in look) o[k] = look[k];
        o.mode = mode; o.count = count; o.asleep = look.hold === 'pillow'; o.action = action;
        return o;
      },
      getCount: function () { return count; },
      resetCount: function () { count = 0; taps = []; if (options.onCount) options.onCount(0, 0); },
      destroy: function () {
        destroyed = true;
        [tActEnd, tIdle, tSqueeze, tCombo, tSquish].forEach(clearTimeout);
        el.tap.removeEventListener('click', onTap);
        if (rootEl.parentNode) rootEl.parentNode.removeChild(rootEl);
      }
    };
  }

  return {
    version: '0.3.0',
    create: create,
    renderSVG: renderSVG,
    renderCottonSVG: renderCottonSVG,
    THEMES: THEMES,
    COLORS: COLORS,
    DURATIONS: DURATIONS,
    TAP_WEIGHTS: TAP_WEIGHTS,
    IDLE_WEIGHTS: IDLE_WEIGHTS
  };
});
