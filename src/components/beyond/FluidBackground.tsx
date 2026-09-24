/*
 * WebGL Fluid Simulation
 * Adapted from Pavel Dobryakov (https://github.com/PavelDoGreat/WebGL-Fluid-Simulation)
 *
 * MIT License
 * Copyright (c) 2017 Pavel Dobryakov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { useEffect, useRef } from "react";

interface FluidBackgroundProps {
  className?: string;
}

export function FluidBackground({ className }: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check WebGL availability
    const params = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };

    let gl: WebGLRenderingContext | WebGL2RenderingContext | null =
      canvas.getContext("webgl2", params) as WebGL2RenderingContext | null;
    const isWebGL2 = Boolean(gl);
    if (!gl) {
      gl = (canvas.getContext("webgl", params) ||
        canvas.getContext("experimental-webgl", params)) as WebGLRenderingContext | null;
    }
    if (!gl) return;

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    // Extensions & capabilities
    let halfFloatExt: any;
    let supportLinearFiltering: any;
    let halfFloatTexType: number;

    if (isWebGL2) {
      const gl2 = gl as WebGL2RenderingContext;
      gl2.getExtension("EXT_color_buffer_float");
      supportLinearFiltering = gl2.getExtension("OES_texture_float_linear");
      halfFloatTexType = gl2.HALF_FLOAT;
    } else {
      halfFloatExt = gl.getExtension("OES_texture_half_float");
      supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
      halfFloatTexType = halfFloatExt ? halfFloatExt.HALF_FLOAT_OES : gl.UNSIGNED_BYTE;
    }

    function supportRenderTextureFormat(
      glCtx: WebGLRenderingContext | WebGL2RenderingContext,
      internalFormat: number,
      format: number,
      type: number
    ) {
      const texture = glCtx.createTexture();
      glCtx.bindTexture(glCtx.TEXTURE_2D, texture);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MIN_FILTER, glCtx.NEAREST);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MAG_FILTER, glCtx.NEAREST);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_S, glCtx.CLAMP_TO_EDGE);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_T, glCtx.CLAMP_TO_EDGE);
      glCtx.texImage2D(glCtx.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

      const fbo = glCtx.createFramebuffer();
      glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, fbo);
      glCtx.framebufferTexture2D(
        glCtx.FRAMEBUFFER,
        glCtx.COLOR_ATTACHMENT0,
        glCtx.TEXTURE_2D,
        texture,
        0
      );
      const status = glCtx.checkFramebufferStatus(glCtx.FRAMEBUFFER);
      glCtx.deleteFramebuffer(fbo);
      glCtx.deleteTexture(texture);
      return status === glCtx.FRAMEBUFFER_COMPLETE;
    }

    function getSupportedFormat(
      glCtx: WebGLRenderingContext | WebGL2RenderingContext,
      internalFormat: number,
      format: number,
      type: number
    ): { internalFormat: number; format: number } | null {
      if (!supportRenderTextureFormat(glCtx, internalFormat, format, type)) {
        if (isWebGL2) {
          const gl2 = glCtx as WebGL2RenderingContext;
          if (internalFormat === gl2.R16F) {
            return getSupportedFormat(glCtx, gl2.RG16F, gl2.RG, type);
          }
          if (internalFormat === gl2.RG16F) {
            return getSupportedFormat(glCtx, gl2.RGBA16F, gl2.RGBA, type);
          }
        }
        return null;
      }
      return { internalFormat, format };
    }

    let formatRGBA: { internalFormat: number; format: number } | null;
    let formatRG: { internalFormat: number; format: number } | null;
    let formatR: { internalFormat: number; format: number } | null;

    if (isWebGL2) {
      const gl2 = gl as WebGL2RenderingContext;
      formatRGBA = getSupportedFormat(gl, gl2.RGBA16F, gl2.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl, gl2.RG16F, gl2.RG, halfFloatTexType);
      formatR = getSupportedFormat(gl, gl2.R16F, gl2.RED, halfFloatTexType);
    } else {
      formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    }

    if (!formatRGBA || !formatRG || !formatR) {
      // Fallback to standard 8-bit unsigned byte textures if half-float FBOs unsupported
      halfFloatTexType = gl.UNSIGNED_BYTE;
      formatRGBA = { internalFormat: gl.RGBA, format: gl.RGBA };
      formatRG = { internalFormat: gl.RGBA, format: gl.RGBA };
      formatR = { internalFormat: gl.RGBA, format: gl.RGBA };
    }

    // High-end cinematic config tuned for glowing molten orange on near black
    // High-end cinematic config tuned for a natural, subtle, elegant fluid look
    const config = {
      SIM_RESOLUTION: isMobile ? 80 : 128,
      DYE_RESOLUTION: isMobile ? 384 : 640,
      DENSITY_DISSIPATION: 1.85, // Balanced organic fade: visible trails without heavy cloudiness
      VELOCITY_DISSIPATION: 0.5, // Gentle organic inertia
      PRESSURE: 0.8,
      PRESSURE_ITERATIONS: 20,
      CURL: 22, // Natural, organic swirls
      SPLAT_RADIUS: 0.14, // Refined, expressive fluid plumes
      SPLAT_FORCE: 1000, // Smooth, responsive mouse reaction
      SHADING: true,
      BACK_COLOR: { r: 0.0, g: 0.0, b: 0.0 }, // Pure deep obsidian black background
      BLOOM: true,
      BLOOM_ITERATIONS: isMobile ? 4 : 5,
      BLOOM_RESOLUTION: isMobile ? 128 : 256,
      BLOOM_INTENSITY: 0.35, // Balanced, luminous amber glow (clearly visible yet premium)
      BLOOM_THRESHOLD: 0.65, // Core glows smoothly while keeping negative space deep and clean
      BLOOM_SOFT_KNEE: 0.65,
    };

    // Refined, luxury amber & gold-orange palette (not blinding yellow)
    const ORANGE_COLORS = [
      { r: 0.95, g: 0.38, b: 0.04 }, // Rich amber orange
      { r: 0.90, g: 0.46, b: 0.06 }, // Warm molten gold-orange
      { r: 0.92, g: 0.30, b: 0.02 }, // Deep fiery copper
      { r: 0.84, g: 0.42, b: 0.08 }, // Refined bronze-gold
      { r: 0.94, g: 0.34, b: 0.03 }, // Incandescent ember
    ];
    let colorIndex = 0;
    function getNextOrangeColor() {
      const c = ORANGE_COLORS[colorIndex % ORANGE_COLORS.length];
      colorIndex++;
      return { ...c };
    }

    // Pointer prototype
    interface Pointer {
      id: number;
      texcoordX: number;
      texcoordY: number;
      prevTexcoordX: number;
      prevTexcoordY: number;
      deltaX: number;
      deltaY: number;
      down: boolean;
      moved: boolean;
      color: { r: number; g: number; b: number };
    }

    const pointers: Pointer[] = [
      {
        id: -1,
        texcoordX: 0.5,
        texcoordY: 0.5,
        prevTexcoordX: 0.5,
        prevTexcoordY: 0.5,
        deltaX: 0,
        deltaY: 0,
        down: false,
        moved: false,
        color: getNextOrangeColor(),
      },
    ];

    // Helper functions for shaders & programs
    function compileShader(type: number, source: string, keywords?: string[] | null) {
      if (keywords) {
        let kw = "";
        keywords.forEach((k) => (kw += `#define ${k}\n`));
        source = kw + source;
      }
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.warn(gl!.getShaderInfoLog(shader));
      }
      return shader;
    }

    function createProgram(vShader: WebGLShader, fShader: WebGLShader) {
      const program = gl!.createProgram()!;
      gl!.attachShader(program, vShader);
      gl!.attachShader(program, fShader);
      gl!.linkProgram(program);
      if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) {
        console.warn(gl!.getProgramInfoLog(program));
      }
      return program;
    }

    function getUniforms(program: WebGLProgram) {
      const uniforms: Record<string, WebGLUniformLocation> = {};
      const count = gl!.getProgramParameter(program, gl!.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const info = gl!.getActiveUniform(program, i);
        if (info) {
          uniforms[info.name] = gl!.getUniformLocation(program, info.name)!;
        }
      }
      return uniforms;
    }

    class Program {
      program: WebGLProgram;
      uniforms: Record<string, WebGLUniformLocation>;
      constructor(vShader: WebGLShader, fShader: WebGLShader) {
        this.program = createProgram(vShader, fShader);
        this.uniforms = getUniforms(this.program);
      }
      bind() {
        gl!.useProgram(this.program);
      }
    }

    class Material {
      vertexShader: WebGLShader;
      fragmentShaderSource: string;
      programs: Record<number, WebGLProgram> = {};
      activeProgram: WebGLProgram | null = null;
      uniforms: Record<string, WebGLUniformLocation> = {};

      constructor(vShader: WebGLShader, fSource: string) {
        this.vertexShader = vShader;
        this.fragmentShaderSource = fSource;
      }

      setKeywords(keywords: string[]) {
        let hash = 0;
        for (let i = 0; i < keywords.length; i++) {
          const str = keywords[i];
          for (let j = 0; j < str.length; j++) {
            hash = (hash << 5) - hash + str.charCodeAt(j);
            hash |= 0;
          }
        }
        let program = this.programs[hash];
        if (!program) {
          const fShader = compileShader(gl!.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
          program = createProgram(this.vertexShader, fShader);
          this.programs[hash] = program;
        }
        if (program !== this.activeProgram) {
          this.uniforms = getUniforms(program);
          this.activeProgram = program;
        }
      }

      bind() {
        if (this.activeProgram) {
          gl!.useProgram(this.activeProgram);
        }
      }
    }

    // Shaders
    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
      `
    );

    const blurShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      uniform sampler2D uTexture;

      void main () {
        vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
        sum += texture2D(uTexture, vL) * 0.35294117;
        sum += texture2D(uTexture, vR) * 0.35294117;
        gl_FragColor = sum;
      }
      `
    );

    const copyShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;

      void main () {
        gl_FragColor = texture2D(uTexture, vUv);
      }
      `
    );

    const clearShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;

      void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
      }
      `
    );

    const colorShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      uniform vec4 color;

      void main () {
        gl_FragColor = color;
      }
      `
    );

    const splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;

      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
      `
    );

    const advectionShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;

      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }

      void main () {
      #ifdef MANUAL_FILTERING
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        vec4 result = bilerp(uSource, coord, dyeTexelSize);
      #else
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
      #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }
      `,
      supportLinearFiltering ? null : ["MANUAL_FILTERING"]
    );

    const divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;

        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }

        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
      `
    );

    const curlShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
      `
    );

    const vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;

      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;

        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;

        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity += force * dt;
        velocity = min(max(velocity, -1000.0), 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
      `
    );

    const pressureShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
      `
    );

    const gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
      `
    );

    // Bloom shaders
    const bloomPrefilterShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform vec3 curve;
      uniform float threshold;

      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float br = max(c.r, max(c.g, c.b));
        float rq = clamp(br - curve.x, 0.0, curve.y);
        rq = curve.z * rq * rq;
        c *= max(rq, br - threshold) / max(br, 0.0001);
        gl_FragColor = vec4(c, 0.0);
      }
      `
    );

    const bloomBlurShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;

      void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL);
        sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT);
        sum += texture2D(uTexture, vB);
        sum *= 0.25;
        gl_FragColor = sum;
      }
      `
    );

    const bloomFinalShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform float intensity;

      void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL);
        sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT);
        sum += texture2D(uTexture, vB);
        sum *= 0.25;
        gl_FragColor = sum * intensity;
      }
      `
    );

    // Display shader with shading, procedural dithering noise, and bloom composition
    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uBloom;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
        color = max(color, vec3(0.0));
        return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0.0));
      }

      // High-precision procedural dither to eliminate banding on deep blacks
      float proceduralDither (vec2 uv) {
        return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;

      #ifdef SHADING
        vec3 lc = texture2D(uTexture, vL).rgb;
        vec3 rc = texture2D(uTexture, vR).rgb;
        vec3 tc = texture2D(uTexture, vT).rgb;
        vec3 bc = texture2D(uTexture, vB).rgb;

        float dx = length(rc) - length(lc);
        float dy = length(tc) - length(bc);

        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
        vec3 l = vec3(0.0, 0.0, 1.0);

        float diffuse = clamp(dot(n, l) + 0.65, 0.65, 1.0);
        c *= diffuse;
      #endif

      #ifdef BLOOM
        vec3 bloom = texture2D(uBloom, vUv).rgb;
        float noise = proceduralDither(vUv * 400.0) * 2.0 - 1.0;
        bloom += noise / 255.0;
        bloom = linearToGamma(bloom);
        c += bloom;
      #endif

        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, clamp(a, 0.0, 1.0));
      }
    `;

    // Blit helper with quad buffers
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );

    const quadIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadIndexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW
    );

    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    function blit(target: any, clear = false) {
      if (!target) {
        gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight);
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      } else {
        gl!.viewport(0, 0, target.width, target.height);
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo);
      }
      if (clear) {
        gl!.clearColor(0.0, 0.0, 0.0, 1.0);
        gl!.clear(gl!.COLOR_BUFFER_BIT);
      }
      gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0);
    }

    // FBO Creation & Ping-Pong structures
    function createFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ) {
      gl!.activeTexture(gl!.TEXTURE0);
      const texture = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(
        gl!.FRAMEBUFFER,
        gl!.COLOR_ATTACHMENT0,
        gl!.TEXTURE_2D,
        texture,
        0
      );
      gl!.viewport(0, 0, w, h);
      gl!.clear(gl!.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1.0 / w,
        texelSizeY: 1.0 / h,
        attach(id: number) {
          gl!.activeTexture(gl!.TEXTURE0 + id);
          gl!.bindTexture(gl!.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ) {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);

      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1;
        },
        set read(val) {
          fbo1 = val;
        },
        get write() {
          return fbo2;
        },
        set write(val) {
          fbo2 = val;
        },
        swap() {
          const temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    function resizeFBO(
      target: any,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ) {
      const newFBO = createFBO(w, h, internalFormat, format, type, param);
      copyProgram.bind();
      gl!.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
      blit(newFBO);
      gl!.deleteTexture(target.texture);
      gl!.deleteFramebuffer(target.fbo);
      return newFBO;
    }

    function resizeDoubleFBO(
      target: any,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ) {
      if (target.width === w && target.height === h) return target;
      target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
      gl!.deleteTexture(target.write.texture);
      gl!.deleteFramebuffer(target.write.fbo);
      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1.0 / w;
      target.texelSizeY = 1.0 / h;
      return target;
    }

    // Instantiating programs
    const copyProgram = new Program(baseVertexShader, copyShader);
    const clearProgram = new Program(baseVertexShader, clearShader);
    const colorProgram = new Program(baseVertexShader, colorShader);
    const splatProgram = new Program(baseVertexShader, splatShader);
    const advectionProgram = new Program(baseVertexShader, advectionShader);
    const divergenceProgram = new Program(baseVertexShader, divergenceShader);
    const curlProgram = new Program(baseVertexShader, curlShader);
    const vorticityProgram = new Program(baseVertexShader, vorticityShader);
    const pressureProgram = new Program(baseVertexShader, pressureShader);
    const gradientSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
    const bloomPrefilterProgram = new Program(baseVertexShader, bloomPrefilterShader);
    const bloomBlurProgram = new Program(baseVertexShader, bloomBlurShader);
    const bloomFinalProgram = new Program(baseVertexShader, bloomFinalShader);
    const displayMaterial = new Material(baseVertexShader, displayShaderSource);

    // Resolution calculation
    function getResolution(resolution: number) {
      let aspectRatio = gl!.drawingBufferWidth / gl!.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspectRatio);
      if (gl!.drawingBufferWidth > gl!.drawingBufferHeight) {
        return { width: max, height: min };
      } else {
        return { width: min, height: max };
      }
    }

    let dye: any;
    let velocity: any;
    let divergence: any;
    let curl: any;
    let pressure: any;
    let bloom: any;
    const bloomFramebuffers: any[] = [];

    function initBloomFramebuffers() {
      const res = getResolution(config.BLOOM_RESOLUTION);
      const texType = halfFloatTexType;
      const rgba = formatRGBA!;
      const filtering = supportLinearFiltering ? gl!.LINEAR : gl!.NEAREST;

      if (bloom) {
        gl!.deleteTexture(bloom.texture);
        gl!.deleteFramebuffer(bloom.fbo);
      }
      bloom = createFBO(res.width, res.height, rgba.internalFormat, rgba.format, texType, filtering);

      for (let i = 0; i < bloomFramebuffers.length; i++) {
        gl!.deleteTexture(bloomFramebuffers[i].texture);
        gl!.deleteFramebuffer(bloomFramebuffers[i].fbo);
      }
      bloomFramebuffers.length = 0;

      for (let i = 0; i < config.BLOOM_ITERATIONS; i++) {
        const width = res.width >> (i + 1);
        const height = res.height >> (i + 1);
        if (width < 2 || height < 2) break;
        const fbo = createFBO(width, height, rgba.internalFormat, rgba.format, texType, filtering);
        bloomFramebuffers.push(fbo);
      }
    }

    function initFramebuffers() {
      const simRes = getResolution(config.SIM_RESOLUTION);
      const dyeRes = getResolution(config.DYE_RESOLUTION);
      const texType = halfFloatTexType;
      const rgba = formatRGBA!;
      const rg = formatRG!;
      const r = formatR!;
      const filtering = supportLinearFiltering ? gl!.LINEAR : gl!.NEAREST;

      gl!.disable(gl!.BLEND);

      if (!dye) {
        dye = createDoubleFBO(
          dyeRes.width,
          dyeRes.height,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        );
      } else {
        dye = resizeDoubleFBO(
          dye,
          dyeRes.width,
          dyeRes.height,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        );
      }

      if (!velocity) {
        velocity = createDoubleFBO(
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        );
      } else {
        velocity = resizeDoubleFBO(
          velocity,
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        );
      }

      if (divergence) {
        gl!.deleteTexture(divergence.texture);
        gl!.deleteFramebuffer(divergence.fbo);
      }
      divergence = createFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl!.NEAREST
      );

      if (curl) {
        gl!.deleteTexture(curl.texture);
        gl!.deleteFramebuffer(curl.fbo);
      }
      curl = createFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl!.NEAREST
      );

      if (pressure) {
        gl!.deleteTexture(pressure.read.texture);
        gl!.deleteFramebuffer(pressure.read.fbo);
        gl!.deleteTexture(pressure.write.texture);
        gl!.deleteFramebuffer(pressure.write.fbo);
      }
      pressure = createDoubleFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl!.NEAREST
      );

      initBloomFramebuffers();
    }

    function updateKeywords() {
      const displayKeywords: string[] = [];
      if (config.SHADING) displayKeywords.push("SHADING");
      if (config.BLOOM) displayKeywords.push("BLOOM");
      displayMaterial.setKeywords(displayKeywords);
    }

    function correctRadius(radius: number) {
      const aspectRatio = canvas!.width / canvas!.height;
      if (aspectRatio > 1) radius *= aspectRatio;
      return radius;
    }

    function splat(
      x: number,
      y: number,
      dx: number,
      dy: number,
      color: { r: number; g: number; b: number }
    ) {
      splatProgram.bind();
      gl!.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl!.uniform1f(splatProgram.uniforms.aspectRatio, canvas!.width / canvas!.height);
      gl!.uniform2f(splatProgram.uniforms.point, x, y);
      gl!.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
      gl!.uniform1f(
        splatProgram.uniforms.radius,
        correctRadius(config.SPLAT_RADIUS / 100.0)
      );
      blit(velocity.write);
      velocity.swap();

      gl!.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      gl!.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    }

    function multipleSplats(amount: number) {
      for (let i = 0; i < amount; i++) {
        const c = getNextOrangeColor();
        // Balanced initial intensity to maintain deep dark background
        c.r *= 0.24;
        c.g *= 0.24;
        c.b *= 0.24;
        const x = 0.25 + Math.random() * 0.5;
        const y = 0.25 + Math.random() * 0.5;
        const dx = 260 * (Math.random() - 0.5);
        const dy = 260 * (Math.random() - 0.5);
        splat(x, y, dx, dy, c);
      }
    }

    function step(dt: number) {
      gl!.disable(gl!.BLEND);

      curlProgram.bind();
      gl!.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      vorticityProgram.bind();
      gl!.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl!.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      gl!.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl!.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceProgram.bind();
      gl!.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearProgram.bind();
      gl!.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      gl!.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      pressureProgram.bind();
      gl!.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl!.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gradientSubtractProgram.bind();
      gl!.uniform2f(
        gradientSubtractProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      gl!.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      gl!.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      advectionProgram.bind();
      gl!.uniform2f(
        advectionProgram.uniforms.texelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
      if (!supportLinearFiltering) {
        gl!.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      const velocityId = velocity.read.attach(0);
      gl!.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
      gl!.uniform1i(advectionProgram.uniforms.uSource, velocityId);
      gl!.uniform1f(advectionProgram.uniforms.dt, dt);
      gl!.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      if (!supportLinearFiltering) {
        gl!.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          dye.texelSizeX,
          dye.texelSizeY
        );
      }
      gl!.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl!.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      gl!.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    function applyBloom(source: any, destination: any) {
      if (bloomFramebuffers.length < 2) return;

      let last = destination;
      gl!.disable(gl!.BLEND);
      bloomPrefilterProgram.bind();
      const knee = config.BLOOM_THRESHOLD * config.BLOOM_SOFT_KNEE + 0.0001;
      const curve0 = config.BLOOM_THRESHOLD - knee;
      const curve1 = knee * 2;
      const curve2 = 0.25 / knee;
      gl!.uniform3f(bloomPrefilterProgram.uniforms.curve, curve0, curve1, curve2);
      gl!.uniform1f(bloomPrefilterProgram.uniforms.threshold, config.BLOOM_THRESHOLD);
      gl!.uniform1i(bloomPrefilterProgram.uniforms.uTexture, source.attach(0));
      blit(last);

      bloomBlurProgram.bind();
      for (let i = 0; i < bloomFramebuffers.length; i++) {
        const dest = bloomFramebuffers[i];
        gl!.uniform2f(bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
        gl!.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0));
        blit(dest);
        last = dest;
      }

      gl!.blendFunc(gl!.ONE, gl!.ONE);
      gl!.enable(gl!.BLEND);

      for (let i = bloomFramebuffers.length - 2; i >= 0; i--) {
        const baseTex = bloomFramebuffers[i];
        gl!.uniform2f(bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
        gl!.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0));
        gl!.viewport(0, 0, baseTex.width, baseTex.height);
        blit(baseTex);
        last = baseTex;
      }

      gl!.disable(gl!.BLEND);
      bloomFinalProgram.bind();
      gl!.uniform2f(bloomFinalProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
      gl!.uniform1i(bloomFinalProgram.uniforms.uTexture, last.attach(0));
      gl!.uniform1f(bloomFinalProgram.uniforms.intensity, config.BLOOM_INTENSITY);
      blit(destination);
    }

    function drawColor(target: any, color: { r: number; g: number; b: number }) {
      colorProgram.bind();
      gl!.uniform4f(colorProgram.uniforms.color, color.r, color.g, color.b, 1.0);
      blit(target);
    }

    function drawDisplay(target: any) {
      const width = target == null ? gl!.drawingBufferWidth : target.width;
      const height = target == null ? gl!.drawingBufferHeight : target.height;

      displayMaterial.bind();
      if (config.SHADING) {
        gl!.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
      }
      gl!.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
      if (config.BLOOM) {
        gl!.uniform1i(displayMaterial.uniforms.uBloom, bloom.attach(1));
      }
      blit(target);
    }

    function render(target: any) {
      if (config.BLOOM) {
        applyBloom(dye.read, bloom);
      }
      gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
      gl!.enable(gl!.BLEND);
      drawColor(target, config.BACK_COLOR);
      drawDisplay(target);
    }

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.floor(canvas!.clientWidth * dpr);
      const height = Math.floor(canvas!.clientHeight * dpr);
      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width;
        canvas!.height = height;
        return true;
      }
      return false;
    }

    // Initialize simulation
    updateKeywords();
    resizeCanvas();
    initFramebuffers();

    // Initial cinematic burst — subtle, elegant presence
    multipleSplats(isMobile ? 1 : 2);

    // Autonomous slow ambient drift (soft, spaced out, delicate)
    let ambientTimer = 0;
    let autonomousStep = 0;

    function applyAutonomousDrift(dt: number) {
      ambientTimer += dt;
      if (ambientTimer > 5.0) {
        ambientTimer = 0;
        autonomousStep++;
        const t = autonomousStep * 0.35;
        // Lissajous curve for natural, gentle drifting wisps
        const x = 0.5 + Math.sin(t * 0.9) * 0.26;
        const y = 0.5 + Math.cos(t * 0.7) * 0.22;
        const dx = Math.sin(t * 1.2) * 110;
        const dy = Math.cos(t * 0.9) * 100;
        const c = getNextOrangeColor();
        c.r *= 0.18;
        c.g *= 0.18;
        c.b *= 0.18;
        splat(x, y, dx, dy, c);
      }
    }

    function splatPointer(pointer: Pointer) {
      const dx = pointer.deltaX * config.SPLAT_FORCE;
      const dy = pointer.deltaY * config.SPLAT_FORCE;
      const c = { ...pointer.color };
      c.r *= 0.25;
      c.g *= 0.25;
      c.b *= 0.25;
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, c);
    }

    // Check if pointer is hovering over buttons, links, icons or interactive UI elements
    function isInteractiveElement(target: EventTarget | null): boolean {
      if (!target || !(target instanceof Element)) return false;
      return Boolean(
        target.closest(
          "button, a, input, select, textarea, label, [role='button'], [role='tab'], svg, .lucide, i"
        )
      );
    }

    // Pointer events (passive listeners on window)
    function updatePointerMove(x: number, y: number) {
      const pointer = pointers[0];
      const rect = canvas!.getBoundingClientRect();
      const clientX = x - rect.left;
      const clientY = y - rect.top;

      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = clientX / rect.width;
      pointer.texcoordY = 1.0 - clientY / rect.height;

      let deltaX = pointer.texcoordX - pointer.prevTexcoordX;
      let deltaY = pointer.texcoordY - pointer.prevTexcoordY;
      const aspect = canvas!.width / canvas!.height;
      if (aspect < 1) deltaX *= aspect;
      if (aspect > 1) deltaY /= aspect;

      // Soft clamp to keep interaction subtle, natural, and never jarring
      deltaX = Math.max(-0.035, Math.min(0.035, deltaX));
      deltaY = Math.max(-0.035, Math.min(0.035, deltaY));

      pointer.deltaX = deltaX;
      pointer.deltaY = deltaY;
      pointer.moved = Math.abs(deltaX) > 0.0001 || Math.abs(deltaY) > 0.0001;
      if (pointer.moved) {
        pointer.color = getNextOrangeColor();
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      // Suppress fluid emissions when mouse is over buttons, links or icons
      if (isInteractiveElement(e.target)) {
        const pointer = pointers[0];
        const rect = canvas!.getBoundingClientRect();
        pointer.prevTexcoordX = (e.clientX - rect.left) / rect.width;
        pointer.prevTexcoordY = 1.0 - (e.clientY - rect.top) / rect.height;
        pointer.texcoordX = pointer.prevTexcoordX;
        pointer.texcoordY = pointer.prevTexcoordY;
        pointer.deltaX = 0;
        pointer.deltaY = 0;
        pointer.moved = false;
        return;
      }
      updatePointerMove(e.clientX, e.clientY);
    };

    const onPointerDown = (e: PointerEvent) => {
      // Suppress fluid clicks when clicking buttons, links or icons
      if (isInteractiveElement(e.target)) return;

      updatePointerMove(e.clientX, e.clientY);
      const pointer = pointers[0];
      const c = getNextOrangeColor();
      c.r *= 0.22;
      c.g *= 0.22;
      c.b *= 0.22;
      splat(
        pointer.texcoordX,
        pointer.texcoordY,
        120 * (Math.random() - 0.5),
        120 * (Math.random() - 0.5),
        c
      );
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let isPaused = false;

    const onVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused) {
        lastTime = performance.now();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    function loop(currentTime: number) {
      if (!isPaused) {
        let dt = (currentTime - lastTime) / 1000;
        dt = Math.min(dt, 0.033);
        lastTime = currentTime;

        if (resizeCanvas()) {
          initFramebuffers();
        }

        // Apply mouse movement
        const pointer = pointers[0];
        if (pointer.moved) {
          pointer.moved = false;
          splatPointer(pointer);
        }

        // Ambient autonomous flow
        applyAutonomousDrift(dt);

        step(dt);
        render(null);
      }

      animationFrameId = requestAnimationFrame(loop);
    }

    animationFrameId = requestAnimationFrame(loop);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);

      if (quadBuffer) gl!.deleteBuffer(quadBuffer);
      if (quadIndexBuffer) gl!.deleteBuffer(quadIndexBuffer);

      if (dye) {
        gl!.deleteTexture(dye.read.texture);
        gl!.deleteFramebuffer(dye.read.fbo);
        gl!.deleteTexture(dye.write.texture);
        gl!.deleteFramebuffer(dye.write.fbo);
      }
      if (velocity) {
        gl!.deleteTexture(velocity.read.texture);
        gl!.deleteFramebuffer(velocity.read.fbo);
        gl!.deleteTexture(velocity.write.texture);
        gl!.deleteFramebuffer(velocity.write.fbo);
      }
      if (divergence) {
        gl!.deleteTexture(divergence.texture);
        gl!.deleteFramebuffer(divergence.fbo);
      }
      if (curl) {
        gl!.deleteTexture(curl.texture);
        gl!.deleteFramebuffer(curl.fbo);
      }
      if (pressure) {
        gl!.deleteTexture(pressure.read.texture);
        gl!.deleteFramebuffer(pressure.read.fbo);
        gl!.deleteTexture(pressure.write.texture);
        gl!.deleteFramebuffer(pressure.write.fbo);
      }
      if (bloom) {
        gl!.deleteTexture(bloom.texture);
        gl!.deleteFramebuffer(bloom.fbo);
      }
      for (let i = 0; i < bloomFramebuffers.length; i++) {
        gl!.deleteTexture(bloomFramebuffers[i].texture);
        gl!.deleteFramebuffer(bloomFramebuffers[i].fbo);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none -z-10 ${className || ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
