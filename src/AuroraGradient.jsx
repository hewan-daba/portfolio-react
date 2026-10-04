import { useRef, useEffect } from "react";

const CFG = {
  r1: 10, g1: 10, b1: 10,      // #0a0a0a — your near-black background
  r2: 230, g2: 57, b2: 70,     // #E63946 — your red accent
  r3: 68, g3: 152, b3: 221,    // #4498dd — your blue (from "STORIES.")
  rotation: -50,
  proportion: 1,
  scale: 0.01,
  speed: 30,
  distortion: 0,
  swirl: 50,
  swirlIterations: 16,
  softness: 47,
  offset: -299,
  shape: 0.0,
  shapeSize: 45,
};

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform float u_time;
uniform float u_pixelRatio;
uniform vec2  u_resolution;
uniform float u_scale;
uniform float u_rotation;
uniform vec4  u_color1;
uniform vec4  u_color2;
uniform vec4  u_color3;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shape;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;

out vec4 fragColor;

#define TWO_PI 6.28318530718
#define PI     3.14159265358979323846

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

vec4 blend_colors(vec4 c1, vec4 c2, vec4 c3, float mixer,
                  float edgesWidth, float edge_blur) {
  vec3 col1 = c1.rgb * c1.a;
  vec3 col2 = c2.rgb * c2.a;
  vec3 col3 = c3.rgb * c3.a;
  float r1 = smoothstep(.0 + .35 * edgesWidth, .7 - .35 * edgesWidth + .5 * edge_blur, mixer);
  float r2 = smoothstep(.3 + .35 * edgesWidth, 1. - .35 * edgesWidth + edge_blur, mixer);
  vec3  mc  = mix(mix(col1, col2, r1), col3, r2);
  float mo  = mix(mix(c1.a, c2.a, r1), c3.a, r2);
  return vec4(mc, mo);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = .5 * u_time;

  float noise_scale = .0005 + .006 * u_scale;
  uv -= .5;
  uv *= (noise_scale * u_resolution);
  uv  = rotate(uv, u_rotation * .5 * PI);
  uv /= u_pixelRatio;
  uv += .5;

  float n1 = noise(uv * 1. + t);
  float n2 = noise(uv * 2. - t);
  float angle = n1 * TWO_PI;
  uv.x += 4. * u_distortion * n2 * cos(angle);
  uv.y += 4. * u_distortion * n2 * sin(angle);

  float iters = ceil(clamp(u_swirlIterations, 1., 30.));
  for (float i = 1.; i <= iters; i++) {
    uv.x += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1.5 * uv.y);
    uv.y += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1.  * uv.x);
  }

  float proportion = clamp(u_proportion, 0., 1.);
  float mixer = 0.;

  if (u_shape < .5) {
    vec2 cuv = uv * (.5 + 3.5 * u_shapeScale);
    float sh = .5 + .5 * sin(cuv.x) * cos(cuv.y);
    mixer = sh + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else if (u_shape < 1.5) {
    vec2 suv = uv * (.25 + 3. * u_shapeScale);
    float f = fract(suv.y);
    float sh = smoothstep(.0, .55, f) * smoothstep(1., .45, f);
    mixer = sh + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else {
    float sh = 1. - uv.y;
    sh -= .5;
    sh /= (noise_scale * u_resolution.y);
    sh += .5;
    float ss = .2 * (1. - u_shapeScale);
    sh = smoothstep(.45 - ss, .55 + ss, sh + .3 * (proportion - .5));
    mixer = sh;
  }

  float ew = 1. - clamp(u_softness, 0., 1.);
  float eb = .01 + .01 * u_scale;
  fragColor = blend_colors(u_color1, u_color2, u_color3, mixer, ew, eb);
}
`;

function AuroraGradient() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl = canvas.getContext("webgl2", {
      premultipliedAlpha: true,
      alpha: true,
      antialias: true,
    });
    if (!gl) return;

    const VS = `#version 300 es\nin vec4 a_position;\nvoid main(){gl_Position=a_position;}`;

    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, VS);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, FRAGMENT_SHADER);
    gl.compileShader(fs);

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      time: gl.getUniformLocation(prog, "u_time"),
      res: gl.getUniformLocation(prog, "u_resolution"),
      pr: gl.getUniformLocation(prog, "u_pixelRatio"),
      scale: gl.getUniformLocation(prog, "u_scale"),
      rot: gl.getUniformLocation(prog, "u_rotation"),
      c1: gl.getUniformLocation(prog, "u_color1"),
      c2: gl.getUniformLocation(prog, "u_color2"),
      c3: gl.getUniformLocation(prog, "u_color3"),
      prop: gl.getUniformLocation(prog, "u_proportion"),
      soft: gl.getUniformLocation(prog, "u_softness"),
      shape: gl.getUniformLocation(prog, "u_shape"),
      shapeSc: gl.getUniformLocation(prog, "u_shapeScale"),
      dist: gl.getUniformLocation(prog, "u_distortion"),
      swirl: gl.getUniformLocation(prog, "u_swirl"),
      swirlIter: gl.getUniformLocation(prog, "u_swirlIterations"),
    };

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      const pr = window.devicePixelRatio || 1;
      canvas.width = w * pr;
      canvas.height = h * pr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const speedFactor = (CFG.speed / 100) * 5;

    const draw = (elapsed) => {
      const pr = window.devicePixelRatio || 1;
      const t = elapsed * speedFactor + CFG.offset * 0.01;
      gl.uniform1f(u.time, t);
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.pr, pr);
      gl.uniform1f(u.scale, CFG.scale);
      gl.uniform1f(u.rot, (CFG.rotation * Math.PI) / 180);
      gl.uniform4f(u.c1, CFG.r1 / 255, CFG.g1 / 255, CFG.b1 / 255, 1);
      gl.uniform4f(u.c2, CFG.r2 / 255, CFG.g2 / 255, CFG.b2 / 255, 1);
      gl.uniform4f(u.c3, CFG.r3 / 255, CFG.g3 / 255, CFG.b3 / 255, 1);
      gl.uniform1f(u.prop, CFG.proportion / 100);
      gl.uniform1f(u.soft, CFG.softness / 100);
      gl.uniform1f(u.shape, CFG.shape);
      gl.uniform1f(u.shapeSc, CFG.shapeSize / 100);
      gl.uniform1f(u.dist, CFG.distortion / 50);
      gl.uniform1f(u.swirl, CFG.swirl / 100);
      gl.uniform1f(u.swirlIter, CFG.swirlIterations);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const cleanup = () => {
      ro.disconnect();
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };

    if (reduced) {
      draw(0);
      return cleanup;
    }

    let rafId = 0;
    const start = performance.now();
    const loop = (now) => {
      draw((now - start) / 1000);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      cleanup();
    };
  }, []);

  return (
    <div ref={containerRef} className="aurora-fill">
      <canvas ref={canvasRef} className="aurora-canvas" />
    </div>
  );
}

export default AuroraGradient;