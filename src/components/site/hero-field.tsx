import { useEffect, useRef } from "react";
import { Mesh, Program, RenderTarget, Renderer, Triangle } from "ogl";

/**
 * HeroField — cursor-reactive "digital fog" WebGL layer for the hero.
 *
 * Pipeline (two passes, exactly the classic agency setup):
 *   Pass 1 — trail:  ping-pong framebuffer. Each frame the previous frame
 *                    fades, drifts, and a splat is stamped along the mouse
 *                    segment (prev → current). Low resolution = free blur.
 *   Pass 2 — display: FBM fog warped by the trail field, brand-lime glow at
 *                    the trail core, vignette, film grain.
 *
 * The mouse never moves pixels directly — it writes a uniform; the shader
 * builds a smooth influence field and evolves it in the FBO, which is what
 * produces smoke/ink instead of a circle.
 */

const VERT = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

/* -------- pass 1: persistent trail (ping-pong) -------- */
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

    // diffuse + slowly rise: sample the previous frame slightly warped
    float n = vnoise(uv * 5.0 + uTime * 0.35);
    vec2 drift = vec2((n - 0.5) * 0.006, 0.0016);
    float prev = texture2D(tPrev, uv + drift).r * uFade;

    // stamp a soft segment between last and current lerped mouse
    vec2 asp = vec2(uAspect, 1.0);
    float d = sdSegment(uv * asp, uPrevMouse * asp, uMouse * asp);
    float splat = smoothstep(uRadius, 0.0, d) * uStrength;

    gl_FragColor = vec4(clamp(prev + splat, 0.0, 1.0), 0.0, 0.0, 1.0);
  }
`;

/* -------- pass 2: fog, glow, vignette, grain -------- */
const DISPLAY_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D tTrail;
  uniform float uTime;
  uniform vec2 uRes;
  uniform float uAspect;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * snoise(p);
      p = p * 2.03 + vec2(11.7, 9.2);
      a *= 0.5;
    }
    return v * 0.5 + 0.5;
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    vec2 asp = vec2(uAspect, 1.0);

    // subtle chromatic spread on the trail read
    vec2 ca = (uv - 0.5) * 0.006;
    float trail  = texture2D(tTrail, uv).r;
    float trailR = texture2D(tTrail, uv + ca).r;
    float trailB = texture2D(tTrail, uv - ca).r;

    vec2 p = uv * asp;

    // ambient fog, always alive
    float fog = fbm(p * 1.7 + vec2(uTime * 0.035, -uTime * 0.022));
    // dense fog, warped upward by the trail field
    float warp = fbm(p * 3.1 + vec2(0.0, uTime * 0.06) + trail * 0.55);

    vec3 base = vec3(0.078, 0.082, 0.090);   // matches --background
    vec3 sage = vec3(0.263, 0.420, 0.227);   // deep moss
    vec3 lime = vec3(0.584, 0.965, 0.318);   // brand #95F651

    vec3 col = base;
    col += sage * smoothstep(0.42, 0.95, fog) * 0.10;              // ambient haze
    float smoke = smoothstep(0.06, 0.85, trail) * (0.30 + 0.55 * warp);
    col += mix(sage, lime, clamp(warp * 0.9, 0.0, 1.0)) * smoke * 0.30;
    col += lime * smoothstep(0.55, 1.0, trailR) * 0.10;            // hot core
    col += sage * trailB * 0.05;

    // vignette
    float vig = smoothstep(1.3, 0.3, length(uv - 0.5) * 1.7);
    col *= mix(0.72, 1.0, vig);

    // film grain
    float g = hash(uv * uRes + vec2(fract(uTime * 13.7) * 91.0));
    col += (g - 0.5) * 0.032;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const TRAIL_RES = 256; // low-res trail buffer doubles as the blur pass
const LERP = 0.08; // heavy, fluid cursor

export function HeroField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: Renderer | null = null;
    let raf = 0;
    let running = true;
    let inView = true;

    try {
      renderer = new Renderer({
        canvas,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      });
    } catch {
      return; // no WebGL — hero keeps its static grid backdrop
    }

    const gl = renderer.gl;
    const geometry = new Triangle(gl);
    const aspect = () => gl.canvas.width / Math.max(gl.canvas.height, 1);

    const targetOpts = {
      width: TRAIL_RES,
      height: TRAIL_RES,
      depth: false,
    };
    let read: RenderTarget = new RenderTarget(gl, { ...targetOpts });
    let write: RenderTarget = new RenderTarget(gl, { ...targetOpts });

    const trailProgram = new Program(gl, {
      vertex: VERT,
      fragment: TRAIL_FRAG,
      uniforms: {
        tPrev: { value: read.texture },
        uMouse: { value: [0.5, 0.5] },
        uPrevMouse: { value: [0.5, 0.5] },
        uStrength: { value: 0 },
        uRadius: { value: 0.16 },
        uFade: { value: 0.955 },
        uTime: { value: 0 },
        uAspect: { value: 1 },
      },
    });
    const trailMesh = new Mesh(gl, { geometry, program: trailProgram });

    const displayProgram = new Program(gl, {
      vertex: VERT,
      fragment: DISPLAY_FRAG,
      uniforms: {
        tTrail: { value: read.texture },
        uTime: { value: 0 },
        uRes: { value: [1, 1] },
        uAspect: { value: 1 },
      },
    });
    const displayMesh = new Mesh(gl, { geometry, program: displayProgram });

    // --- pointer state ------------------------------------------------------
    // Until the first real pointer event, an autonomous attractor keeps the
    // field alive (slow lissajous), so the hero is never static.
    const target = { x: 0.5, y: 0.55 };
    const lerped = { x: 0.5, y: 0.55 };
    const prevLerped = { x: 0.5, y: 0.55 };
    let prevTarget = { x: 0.5, y: 0.55 };
    let hasPointer = false;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      target.x = (e.clientX - rect.left) / Math.max(rect.width, 1);
      target.y = 1 - (e.clientY - rect.top) / Math.max(rect.height, 1);
      hasPointer = true;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Measure the host (the hero section), not the canvas: OGL's constructor
    // writes inline 300x150 styles that would poison a canvas self-measure.
    const host = canvas.parentElement ?? canvas;
    const resize = () => {
      const rect = host.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer!.setSize(w, h);
      (displayProgram.uniforms.uRes.value as number[])[0] = gl.canvas.width;
      (displayProgram.uniforms.uRes.value as number[])[1] = gl.canvas.height;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      running = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    const start = performance.now();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!running || !inView || !renderer) return;

      const t = (performance.now() - start) / 1000;

      // autonomous attractor before first interaction
      if (!hasPointer) {
        target.x = 0.5 + 0.30 * Math.sin(t * 0.42);
        target.y = 0.52 + 0.20 * Math.sin(t * 0.83 + 1.4);
      }

      prevLerped.x = lerped.x;
      prevLerped.y = lerped.y;
      lerped.x += (target.x - lerped.x) * LERP;
      lerped.y += (target.y - lerped.y) * LERP;

      // velocity drives splat strength — idle cursor fades out, moving cursor inks
      const vx = target.x - prevTarget.x;
      const vy = target.y - prevTarget.y;
      prevTarget = { x: target.x, y: target.y };
      const speed = Math.sqrt(vx * vx + vy * vy);
      const strength = hasPointer
        ? Math.min(1, speed * 34) * 0.6
        : 0.35; // attractor mode: steady gentle trail

      // pass 1: evolve trail into the ping-pong buffer
      trailProgram.uniforms.tPrev.value = read.texture;
      (trailProgram.uniforms.uMouse.value as number[])[0] = lerped.x;
      (trailProgram.uniforms.uMouse.value as number[])[1] = lerped.y;
      (trailProgram.uniforms.uPrevMouse.value as number[])[0] = prevLerped.x;
      (trailProgram.uniforms.uPrevMouse.value as number[])[1] = prevLerped.y;
      trailProgram.uniforms.uStrength.value = strength;
      trailProgram.uniforms.uTime.value = t;
      trailProgram.uniforms.uAspect.value = aspect();
      renderer.render({ scene: trailMesh, target: write });
      const swap = read;
      read = write;
      write = swap;

      // pass 2: fog + glow + grain to screen
      displayProgram.uniforms.tTrail.value = read.texture;
      displayProgram.uniforms.uTime.value = t;
      displayProgram.uniforms.uAspect.value = aspect();
      renderer.render({ scene: displayMesh });
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
