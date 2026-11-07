#!/usr/bin/env python3
"""Assemble the single-file game (index.html + RestrictedAccess.html) from src/."""
import os, re
D = os.path.dirname(os.path.abspath(__file__))
R = lambda f: open(os.path.join(D, f), encoding='utf-8').read()

head = R('00_head.html')
head = re.sub(r'<title>.*?</title>', '<title>Restricted Access · Maple Hollow</title>', head, count=1)
# HUD: drop the old reporter meter, new location default
head = re.sub(r'\s*<div id="hb" hidden>.*?</div></div></div>', '</div>', head, count=1, flags=re.S)
head = head.replace('<div id="loc">Ký túc xá</div>', '<div id="loc">Main St</div>').replace('Ngày 1 · 07:00', 'Thứ Sáu · 09:00')
head = re.sub(r'<div id="keys" class="hud">.*?</div>', '<div id="keys" class="hud">WASD đi (Shift chạy) · kéo chuột/Q,R xoay · lăn chuột zoom · E nói chuyện/tương tác · C cúi · I túi · M bản đồ · J nhiệm vụ · L nhân vật · P ảnh · T chờ · F5/F9 lưu/tải</div>', head, count=1, flags=re.S)
head = re.sub(r'<div id="pad">.*?</div>', '<div id="joy"><div id="knob"></div></div><div id="acts"><button id="aC" title="Cúi">C</button><button id="aE" title="Tương tác">E</button></div>', head, count=1, flags=re.S)
css = """
#joy{position:fixed;left:18px;bottom:calc(112px + env(safe-area-inset-bottom,0px));width:124px;height:124px;border-radius:50%;background:rgba(255,246,228,.35);border:3px solid var(--ink);z-index:3;display:none;touch-action:none}
#knob{position:absolute;left:37px;top:37px;width:44px;height:44px;border-radius:50%;background:var(--sun);border:3px solid var(--ink);box-shadow:0 3px 0 var(--ink);pointer-events:none}
#acts{position:fixed;right:18px;bottom:calc(114px + env(safe-area-inset-bottom,0px));z-index:3;display:none;gap:10px;align-items:end}
#acts button{width:62px;height:62px;border-radius:50%;justify-content:center;font:800 22px var(--disp);background:var(--cream);touch-action:none}
#acts #aE{width:78px;height:78px;font-size:26px}#acts #aE.ready{background:var(--sun);animation:bob 1.2s ease-in-out infinite}
#acts button.on{background:var(--accent);color:#fff}
@media (pointer:coarse){#joy{display:block}#acts{display:flex}#prompt::before{content:'E'}}
@media (max-width:720px){#tl{width:min(300px,calc(100vw - 180px))}#quest{padding:8px 10px}#quest b{font-size:13px}#quest p{font-size:11px;margin:2px 0 4px}#quest p+p{display:none}#btns button small{white-space:nowrap;font-size:10px}#btns button{min-width:48px;padding:3px 4px}#btns button svg.i{font-size:24px}.card{padding:8px 10px}#pav{width:40px;height:40px}#clock{font-size:16px}}
.item .ico{font-size:34px}
"""
head = head.replace('</style>', css + '</style>', 1)
assert '<script src="vendor/three.r128.min.js"></script>' in head

core = R('20_core.js').replace('/*__TX__*/', R('_tx.js')).replace('/*__FURN__*/', R('_furn.js'))
order = [core, R('30_world.js'), R('10_phototex.js'), R('40_people.js'), R('50_game.js'), R('55_dialog.js'), R('60_ui.js'), R('80_avatars.js'), R('70_start.js'), R('90_gltf.js'), R('91_models.js')]
html = head + '\n<script>\n' + '\n'.join(order) + '\n</script>\n<script src="pwa.js"></script>\n</body></html>\n'
out = os.path.join(D, '..')
for name in ('index.html', 'RestrictedAccess.html'):
    open(os.path.join(out, name), 'w', encoding='utf-8').write(html)
print('built', len(html), 'bytes')
