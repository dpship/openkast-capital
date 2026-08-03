import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * ParticleField — the scroll-aware "O" particle ring behind the home page.
 *
 * Rendering (Three.js r180):
 *   Pass 1 — feedback/trail buffer: ping-pong render targets. Each frame the
 *            previous frame fades + drifts and a splat is stamped along the
 *            cursor segment (prev → current lerped). The mouse never moves
 *            particles directly; it writes a uniform — the trail lingers.
 *   Pass 2 — ~24k points arranged as a ring. The vertex shader samples the
 *            trail texture in screen space: displacement + glow follows the
 *            cursor with memory. Procedural grain in the fragment shader.
 *
 * Scroll choreography (GSAP ScrollTrigger, scrubbed for buttery transitions):
 *   - #page-bg background-color tweens per-section [data-bg] — continuous
 *     color morph instead of hard swaps.
 *   - [data-particles="off"] fades + disperses the ring away mid-page.
 *   - [data-particles="dark"] brings it back in the final section, re-colored
 *     dark-on-cream.
 */

export const PAGE_INK = "#20222a";
export const PAGE_PAPER = "#f0eee5";

const TRAIL_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D tPrev;
  uniform vec2 uMouse;
  uniform vec2 uPrevMouse;
  uniform float uStrength;
  uniform float uRadius;
  uniform float uFade;
  uniform float uTime;
  uniform float uAspect;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float sdSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
    return length(pa - ba * h);
  }
  void main() {
    vec2 uv = vUv;
    float n = vnoise(uv * 5.0 + uTime * 0.35);
    vec2 drift = vec2((n - 0.5) * 0.006, 0.0016);
    float prev = texture2D(tPrev, uv + drift).r * uFade;
    vec2 asp = vec2(uAspect, 1.0);
    float d = sdSegment(uv * asp, uPrevMouse * asp, uMouse * asp);
    float splat = smoothstep(uRadius, 0.0, d) * uStrength;
    gl_FragColor = vec4(clamp(prev + splat, 0.0, 1.0), 0.0, 0.0, 1.0);
  }
`;

const QUAD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const POINTS_VERT = /* glsl */ `
  uniform float uTime;
  uniform sampler2D tTrail;
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform float uPixelRatio;
  uniform float uDisperse;
  attribute float aScale;
  attribute vec3 aRand;
  varying float vTrail;
  varying float vGrain;

  void main() {
    vec3 pos = position;

    // idle breathing
    float t = uTime * 0.35;
    pos.x += 0.10 * sin(t + aRand.x * 6.2831 + position.y * 1.7);
    pos.y += 0.10 * cos(t * 0.9 + aRand.y * 6.2831 + position.x * 1.7);
    pos.z += 0.18 * sin(t * 0.7 + aRand.z * 6.2831);

    // scroll-driven dispersion
    pos *= 1.0 + uDisperse * (0.35 + aRand.y * 0.5);

    // screen-space uv for the trail sample
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 suv = clip.xy / clip.w * 0.5 + 0.5;
    float trail = texture2D(tTrail, suv).r;
    vTrail = trail;

    // direct cursor displacement field (repulsion)
    vec2 asp = vec2(uAspect, 1.0);
    vec2 d = (suv - uMouse) * asp;
    float md = max(length(d), 1e-4);
    float rep = smoothstep(0.26, 0.0, md);
    pos.xy += (d / md) / asp * rep * 0.20;
    pos.z += trail * 0.6 + rep * 0.35;

    mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * uPixelRatio * (16.0 / -mv.z) * (1.0 + trail * 1.1);
    vGrain = aRand.z;
  }
`;

const POINTS_FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vTrail;
  varying float vGrain;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.16, d);
    vec3 col = mix(uColorA, uColorB, clamp(vTrail * 1.6, 0.0, 1.0));
    // procedural grain
    float g = fract(sin(dot(gl_FragCoord.xy + vGrain * 91.0, vec2(12.9898, 78.233))) * 43758.5453);
    col += (g - 0.5) * 0.08;
    gl_FragColor = vec4(col, alpha * uOpacity);
  }
`;

const RING_COUNT = 22000;
const DUST_COUNT = 1500;
const TRAIL_RES = 256;
const LERP = 0.08;

// particle palettes: [base, hot] × [on ink, on paper]
const LIGHT_A = new THREE.Color(0.82, 0.86, 0.94);
const LIGHT_B = new THREE.Color(0.584, 0.965, 0.318); // brand lime
const DARK_A = new THREE.Color(0.13, 0.14, 0.18);
const DARK_B = new THREE.Color(0.35, 0.62, 0.18); // deep moss

export function ParticleField() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    wrap.appendChild(renderer.domElement);

    /* ------------------------------ particles ------------------------------ */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 20);
    camera.position.z = 4.6;

    const count = RING_COUNT + DUST_COUNT;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const rands = new Float32Array(count * 3);
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 0.66;

    for (let i = 0; i < count; i++) {
      const isDust = i >= RING_COUNT;
      const angle = Math.random() * Math.PI * 2;
      const r = isDust
        ? Math.random() * 0.78 // sparse inner dust
        : 1.12 + gauss() * 0.4; // the ring — sized to read as an "O"
      positions[i * 3 + 0] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.sin(angle) * r * (isDust ? 0.9 : 1);
      positions[i * 3 + 2] = gauss() * (isDust ? 0.45 : 0.36);
      scales[i] = isDust ? 0.5 + Math.random() * 0.9 : 0.7 + Math.random() * 1.7;
      rands[i * 3 + 0] = Math.random();
      rands[i * 3 + 1] = Math.random();
      rands[i * 3 + 2] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rands, 3));

    const pointsUniforms = {
      uTime: { value: 0 },
      tTrail: { value: null as THREE.Texture | null },
      uMouse: { value: new THREE.Vector2(0.5, 0.55) },
      uAspect: { value: 1 },
      uPixelRatio: { value: dpr },
      uDisperse: { value: 0 },
      uColorA: { value: LIGHT_A.clone() },
      uColorB: { value: LIGHT_B.clone() },
      uOpacity: { value: 1 },
    };
    const pointsMat = new THREE.ShaderMaterial({
      vertexShader: POINTS_VERT,
      fragmentShader: POINTS_FRAG,
      uniforms: pointsUniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending,
    });
    const points = new THREE.Points(geo, pointsMat);
    points.frustumCulled = false;
    const group = new THREE.Group();
    group.add(points);
    group.rotation.x = -0.12;
    scene.add(group);

    /* ---------------------------- trail ping-pong --------------------------- */
    const rtOpts: THREE.RenderTargetOptions = { depthBuffer: false, stencilBuffer: false };
    let read = new THREE.WebGLRenderTarget(TRAIL_RES, TRAIL_RES, rtOpts);
    let write = new THREE.WebGLRenderTarget(TRAIL_RES, TRAIL_RES, rtOpts);
    const trailScene = new THREE.Scene();
    const trailCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const trailUniforms = {
      tPrev: { value: read.texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.55) },
      uPrevMouse: { value: new THREE.Vector2(0.5, 0.55) },
      uStrength: { value: 0 },
      uRadius: { value: 0.2 },
      uFade: { value: 0.962 },
      uTime: { value: 0 },
      uAspect: { value: 1 },
    };
    trailScene.add(
      new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
          vertexShader: QUAD_VERT,
          fragmentShader: TRAIL_FRAG,
          uniforms: trailUniforms,
          depthWrite: false,
          depthTest: false,
        }),
      ),
    );

    /* ------------------------------- pointer ------------------------------- */
    const target = { x: 0.5, y: 0.55 };
    const lerped = { x: 0.5, y: 0.55 };
    const prevLerped = { x: 0.5, y: 0.55 };
    let prevTarget = { x: 0.5, y: 0.55 };
    let hasPointer = false;

    const onPointerMove = (e: PointerEvent) => {
      target.x = e.clientX / Math.max(window.innerWidth, 1);
      target.y = 1 - e.clientY / Math.max(window.innerHeight, 1);
      hasPointer = true;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    /* ---------------------------- scroll state ----------------------------- */
    // One deterministic scroll driver: section [data-bg] / [data-particles]
    // stops are measured in px, scroll position is mapped to a bg color and a
    // particle state, and the raf loop eases current → target every frame.
    // No competing tweens — transitions stay butter smooth in both directions.
    const bgEl = document.getElementById("page-bg");
    const bgTarget = new THREE.Color(PAGE_INK);
    const bgCurrent = new THREE.Color(PAGE_INK);
    const fxTarget = { opacity: 1, mix: 0, disperse: 0 };
    const fx = { opacity: 1, mix: 0, disperse: 0 };

    type BgStop = { y0: number; y1: number; from: string; to: string };
    type FxStop = { y0: number; y1: number; mode: string };
    let bgStops: BgStop[] = [];
    let fxStops: FxStop[] = [];

    const docTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

    const measure = () => {
      const vh = window.innerHeight;
      bgStops = [];
      fxStops = [];
      let prevColor = PAGE_INK;
      document.querySelectorAll<HTMLElement>("[data-bg]").forEach((sec) => {
        const top = docTop(sec);
        // morph in the padding gap between sections: while the boundary
        // travels 90% → 50% of the viewport, before incoming content arrives
        bgStops.push({ y0: top - vh * 0.9, y1: top - vh * 0.5, from: prevColor, to: sec.dataset.bg! });
        prevColor = sec.dataset.bg!;
      });
      document.querySelectorAll<HTMLElement>("[data-particles]").forEach((sec) => {
        const mode = sec.dataset.particles!;
        const top = docTop(sec);
        fxStops.push(
          mode === "off"
            ? { y0: top - vh * 0.95, y1: top - vh * 0.5, mode }
            : { y0: top - vh * 1.1, y1: top - vh * 0.55, mode },
        );
      });
    };

    const lerpNum = (a: number, b: number, t: number) => a + (b - a) * t;

    const applyScroll = () => {
      const y = window.scrollY;

      // background color: walk stops in order
      let color = bgStops[0]?.from ?? PAGE_INK;
      for (const s of bgStops) {
        if (y <= s.y0) break;
        if (y >= s.y1) {
          color = s.to;
          continue;
        }
        color = gsap.utils.interpolate(s.from, s.to)((y - s.y0) / (s.y1 - s.y0)) as string;
        break;
      }
      bgTarget.set(color);

      // particle state: base → off → dark finale
      fxTarget.opacity = 1;
      fxTarget.mix = 0;
      fxTarget.disperse = 0;
      for (const s of fxStops) {
        if (y <= s.y0) break;
        const t = Math.min(1, (y - s.y0) / Math.max(s.y1 - s.y0, 1));
        if (s.mode === "off") {
          fxTarget.opacity = lerpNum(1, 0, t);
          fxTarget.disperse = lerpNum(0, 0.7, t);
          fxTarget.mix = 0;
        } else {
          fxTarget.opacity = lerpNum(0, 1, t);
          fxTarget.mix = lerpNum(0, 1, t);
          fxTarget.disperse = lerpNum(0.7, 0, t);
        }
      }
    };

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      measure();
      applyScroll();
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: applyScroll });
      ScrollTrigger.addEventListener("refresh", () => {
        measure();
        applyScroll();
      });

      // gentle hero parallax on the content itself
      const heroContent = document.querySelector("[data-hero-content]");
      const heroSec = document.querySelector("[data-hero]");
      if (heroContent && heroSec) {
        gsap.to(heroContent, {
          yPercent: -14,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: heroSec, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      }

      // content reveals — sections fade/rise in only after the background
      // beneath them has morphed to their own color
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 70 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 94%", end: "top 55%", scrub: 0.5 },
          },
        );
      });
    });

    /* -------------------------------- resize -------------------------------- */
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / Math.max(h, 1);
      // keep the ring comfortably framed on narrow screens
      camera.position.z = camera.aspect < 1 ? 4.6 / Math.max(camera.aspect, 0.42) : 4.6;
      camera.updateProjectionMatrix();
      pointsUniforms.uAspect.value = w / Math.max(h, 1);
      trailUniforms.uAspect.value = w / Math.max(h, 1);
    };
    resize();
    window.addEventListener("resize", resize);

    let running = true;
    const onVisibility = () => {
      running = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    /* --------------------------------- loop --------------------------------- */
    const colA = new THREE.Color();
    const colB = new THREE.Color();
    const start = performance.now();
    let raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!running) return;

      const t = (performance.now() - start) / 1000;

      // ease current → target so every transition is silky
      const ease = 0.11;
      fx.opacity += (fxTarget.opacity - fx.opacity) * ease;
      fx.mix += (fxTarget.mix - fx.mix) * ease;
      fx.disperse += (fxTarget.disperse - fx.disperse) * ease;
      bgCurrent.lerp(bgTarget, 0.09);
      if (bgEl) bgEl.style.backgroundColor = `#${bgCurrent.getHexString()}`;

      // autonomous attractor until the first real pointer event
      if (!hasPointer) {
        target.x = 0.5 + 0.3 * Math.sin(t * 0.42);
        target.y = 0.52 + 0.2 * Math.sin(t * 0.83 + 1.4);
      }
      prevLerped.x = lerped.x;
      prevLerped.y = lerped.y;
      lerped.x += (target.x - lerped.x) * LERP;
      lerped.y += (target.y - lerped.y) * LERP;

      const vx = target.x - prevTarget.x;
      const vy = target.y - prevTarget.y;
      prevTarget = { x: target.x, y: target.y };
      const speed = Math.sqrt(vx * vx + vy * vy);
      const strength = hasPointer ? Math.min(1, speed * 34) * 0.85 : 0.35;

      // palette from scroll mix
      colA.copy(LIGHT_A).lerp(DARK_A, fx.mix);
      colB.copy(LIGHT_B).lerp(DARK_B, fx.mix);
      pointsUniforms.uColorA.value.copy(colA);
      pointsUniforms.uColorB.value.copy(colB);
      pointsUniforms.uOpacity.value = fx.opacity;
      pointsUniforms.uDisperse.value = fx.disperse;
      pointsUniforms.uTime.value = t;
      (pointsUniforms.uMouse.value as THREE.Vector2).set(lerped.x, lerped.y);

      // scroll parallax — the ring drifts slower than the page
      const sy = window.scrollY || 0;
      group.rotation.z = sy * 0.00042 + t * 0.02;
      group.position.y = sy * 0.0009;
      group.rotation.x = -0.12 + sy * 0.00005;

      // skip GL work entirely while the field is faded out mid-page
      if (fx.opacity > 0.005) {
        // pass 1: evolve trail
        trailUniforms.tPrev.value = read.texture;
        (trailUniforms.uMouse.value as THREE.Vector2).set(lerped.x, lerped.y);
        (trailUniforms.uPrevMouse.value as THREE.Vector2).set(prevLerped.x, prevLerped.y);
        trailUniforms.uStrength.value = strength;
        trailUniforms.uTime.value = t;
        renderer.setRenderTarget(write);
        renderer.render(trailScene, trailCam);
        renderer.setRenderTarget(null);
        const swap = read;
        read = write;
        write = swap;

        // pass 2: points
        pointsUniforms.tTrail.value = read.texture;
        renderer.render(scene, camera);
      }
    };
    raf = requestAnimationFrame(frame);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("load", onLoad);
      document.removeEventListener("visibilitychange", onVisibility);
      geo.dispose();
      pointsMat.dispose();
      read.dispose();
      write.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1]"
    />
  );
}
