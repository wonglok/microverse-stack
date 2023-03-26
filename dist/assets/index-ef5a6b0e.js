var L=Object.defineProperty;var B=(s,o,e)=>o in s?L(s,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[o]=e;var c=(s,o,e)=>(B(s,typeof o!="symbol"?o+"":o,e),e);import{Pass as R,RenderPass as I,DepthPass as A,Effect as z,Selection as j}from"./postprocessing.esm-525464b7.js";import{S as y,U as a,V as M,M as k,T as W,G as H,a as d,b as h,W as _,L as u,H as v,c as G,d as f,C as X,Q as F,e as Z,D as q,R as S,F as K,N as g,f as P,g as U,h as Y,P as $,i as J}from"./MetaApp-45d0e5ad.js";import"./index-6923d608.js";var Q=`uniform float blur;
uniform float blurSharpness;
uniform int blurKernel;

vec3 denoise(vec3 center, sampler2D tex, vec2 uv, vec2 invTexSize, float blur, float blurSharpness, int blurKernel) {
    vec3 color;
    float total;
    vec3 col;
    float weight;

    for (int x = -blurKernel; x <= blurKernel; x++) {
        for (int y = -blurKernel; y <= blurKernel; y++) {
            col = textureLod(tex, uv + vec2(x, y) * invTexSize, 0.).rgb;
            weight = 1.0 - abs(dot(col - center, vec3(0.25)));
            weight = pow(weight, blurSharpness);
            color += col * weight;
            total += weight;
        }
    }

    return color / total;
}`,ee=`#define MODE_DEFAULT             0
#define MODE_REFLECTIONS         1
#define MODE_RAW_REFLECTION      2
#define MODE_BLURRED_REFLECTIONS 3
#define MODE_INPUT               4
#define MODE_BLUR_MIX            5

#define FLOAT_EPSILON            0.00001

uniform sampler2D inputTexture;
uniform sampler2D reflectionsTexture;

uniform float samples;

#include <boxBlur>

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 reflectionsTexel = texture2D(reflectionsTexture, vUv);
    ivec2 size = textureSize(reflectionsTexture, 0);
    vec2 invTexSize = 1. / vec2(size.x, size.y);

    vec3 reflectionClr = reflectionsTexel.xyz;

    if (blur > FLOAT_EPSILON) {
        vec3 blurredReflectionsColor = denoise(reflectionsTexel.rgb, reflectionsTexture, vUv, invTexSize, blur, blurSharpness, blurKernel);

        reflectionClr = mix(reflectionClr, blurredReflectionsColor.rgb, blur);
    }

#if RENDER_MODE == MODE_DEFAULT
    outputColor = vec4(inputColor.rgb + reflectionClr, 1.0);
#endif

#if RENDER_MODE == MODE_REFLECTIONS
    outputColor = vec4(reflectionClr, 1.0);
#endif

#if RENDER_MODE == MODE_RAW_REFLECTION
    outputColor = vec4(reflectionsTexel.xyz, 1.0);
#endif

#if RENDER_MODE == MODE_BLURRED_REFLECTIONS
    outputColor = vec4(blurredReflectionsTexel.xyz, 1.0);
#endif

#if RENDER_MODE == MODE_INPUT
    outputColor = vec4(inputColor.xyz, 1.0);
#endif

#if RENDER_MODE == MODE_BLUR_MIX
    outputColor = vec4(vec3(blur), 1.0);
#endif
}`,V=`vec3 getViewPosition(const float depth) {
    float clipW = _projectionMatrix[2][3] * depth + _projectionMatrix[3][3];
    vec4 clipPosition = vec4((vec3(vUv, depth) - 0.5) * 2.0, 1.0);
    clipPosition *= clipW;
    return (_inverseProjectionMatrix * clipPosition).xyz;
}

float getViewZ(const in float depth) {
#ifdef PERSPECTIVE_CAMERA
    return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
#else
    return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
#endif
}

vec3 screenSpaceToWorldSpace(const vec2 uv, const float depth) {
    vec4 ndc = vec4(
        (uv.x - 0.5) * 2.0,
        (uv.y - 0.5) * 2.0,
        (depth - 0.5) * 2.0,
        1.0);

    vec4 clip = _inverseProjectionMatrix * ndc;
    vec4 view = cameraMatrixWorld * (clip / clip.w);

    return view.xyz;
}

#define Scale (vec3(0.8, 0.8, 0.8))
#define K     (19.19)

vec3 hash(vec3 a) {
    a = fract(a * Scale);
    a += dot(a, a.yxz + K);
    return fract((a.xxy + a.yxx) * a.zyx);
}

float fresnel_dielectric_cos(float cosi, float eta) {
    
    float c = abs(cosi);
    float g = eta * eta - 1.0 + c * c;
    float result;

    if (g > 0.0) {
        g = sqrt(g);
        float A = (g - c) / (g + c);
        float B = (c * (g + c) - 1.0) / (c * (g - c) + 1.0);
        result = 0.5 * A * A * (1.0 + B * B);
    } else {
        result = 1.0; /* TIR (no refracted component) */
    }

    return result;
}

float fresnel_dielectric(vec3 Incoming, vec3 Normal, float eta) {
    /* compute fresnel reflectance without explicitly computing
     * the refracted direction */

    float cosine = dot(Incoming, Normal);
    return min(1.0, 5.0 * fresnel_dielectric_cos(cosine, eta));
}`,te=`#define INV_EULER 0.36787944117144233

alpha = velocityDisocclusion < FLOAT_EPSILON ? (alpha + 0.0075) : 0.0;
alpha = clamp(alpha, 0.0, 1.0);

bool needsBlur = !didReproject || velocityDisocclusion > 0.5;

#ifdef boxBlur
if (needsBlur) inputColor = boxBlurredColor;
#endif

if (alpha == 1.0) {
    outputColor = accumulatedColor;
} else {
    float m = mix(alpha, 1.0, blend);

    
    if (needsBlur) m = 0.0;

    outputColor = accumulatedColor * m + inputColor * (1.0 - m);
}`;class ne extends y{constructor(){super({type:"MRTMaterial",defines:{USE_UV:"",TEMPORAL_RESOLVE:""},uniforms:{opacity:new a(1),normalMap:new a(null),normalScale:new a(new M(1,1)),uvTransform:new a(new k),roughness:new a(1),roughnessMap:new a(null)},vertexShader:`
                #ifdef USE_MRT
                 varying vec2 vHighPrecisionZW;
                #endif
                #define NORMAL
                #if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
                    varying vec3 vViewPosition;
                #endif
                #include <common>
                #include <uv_pars_vertex>
                #include <displacementmap_pars_vertex>
                #include <normal_pars_vertex>
                #include <morphtarget_pars_vertex>
                #include <skinning_pars_vertex>
                #include <logdepthbuf_pars_vertex>
                #include <clipping_planes_pars_vertex>
                void main() {
                    #include <uv_vertex>
                    #include <beginnormal_vertex>
                    #include <morphnormal_vertex>
                    #include <skinbase_vertex>
                    #include <skinnormal_vertex>
                    #include <defaultnormal_vertex>
                    #include <normal_vertex>
                    #include <begin_vertex>
                    #include <morphtarget_vertex>
                    #include <skinning_vertex>
                    #include <displacementmap_vertex>
                    #include <project_vertex>
                    #include <logdepthbuf_vertex>
                    #include <clipping_planes_vertex>
                    #if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
                        vViewPosition = - mvPosition.xyz;
                    #endif
                    #ifdef USE_MRT
                        vHighPrecisionZW = gl_Position.zw;
                    #endif 
                    #ifdef USE_UV
                        vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
                    #endif
                }
            `,fragmentShader:`
                 #define NORMAL
                #if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( TANGENTSPACE_NORMALMAP )
                    varying vec3 vViewPosition;
                #endif
                #include <packing>
                #include <uv_pars_fragment>
                #include <normal_pars_fragment>
                #include <bumpmap_pars_fragment>
                #include <normalmap_pars_fragment>
                #include <logdepthbuf_pars_fragment>
                #include <clipping_planes_pars_fragment>
                #include <roughnessmap_pars_fragment>
                
                #ifdef USE_MRT
                layout(location = 0) out vec4 gNormal;
                layout(location = 1) out vec4 gDepth;
                
                varying vec2 vHighPrecisionZW;
                #endif
                uniform float roughness;
                void main() {
                    #include <clipping_planes_fragment>
                    #include <logdepthbuf_fragment>
                    #include <normal_fragment_begin>
                    #include <normal_fragment_maps>

                    float roughnessFactor = roughness;
                    
                    if(roughness > 10.0e9){
                        roughnessFactor = 1.;
                    }else{
                        #ifdef useRoughnessMap
                            vec4 texelRoughness = texture2D( roughnessMap, vUv );
                            // reads channel G, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
                            roughnessFactor *= texelRoughness.g;
                        #endif
                    }

                    vec3 normalColor = packNormalToRGB( normal );
                    #ifdef USE_MRT
                        float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
                        vec4 depthColor = packDepthToRGBA( fragCoordZ );
                        gNormal = vec4( normalColor, roughnessFactor );
                        gDepth = depthColor;
                    #else
                        gl_FragColor = vec4(normalColor, roughnessFactor);
                    #endif
                }
            `,toneMapped:!1}),this.normalMapType=W,this.normalScale=new M(1,1),Object.defineProperty(this,"glslVersion",{get(){return"USE_MRT"in this.defines?H:null},set(o){}})}}var re=`varying vec2 vUv;

void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 1.0, 1.0);
}`,ie=`varying vec2 vUv;

uniform sampler2D inputTexture;
uniform sampler2D accumulatedTexture;
uniform sampler2D normalTexture;
uniform sampler2D depthTexture;
uniform sampler2D envMap;

uniform mat4 _projectionMatrix;
uniform mat4 _inverseProjectionMatrix;
uniform mat4 cameraMatrixWorld;
uniform float cameraNear;
uniform float cameraFar;

uniform float rayDistance;
uniform float intensity;
uniform float maxDepthDifference;
uniform float roughnessFade;
uniform float maxRoughness;
uniform float fade;
uniform float thickness;
uniform float ior;

uniform float samples;

uniform float jitter;
uniform float jitterRoughness;

#define INVALID_RAY_COORDS vec2(-1.0);
#define EARLY_OUT_COLOR    vec4(0.0, 0.0, 0.0, 1.0)
#define FLOAT_EPSILON      0.00001

float nearMinusFar;
float nearMulFar;
float farMinusNear;

#include <packing>

#include <helperFunctions>

vec2 RayMarch(vec3 dir, inout vec3 hitPos, inout float rayHitDepthDifference);
vec2 BinarySearch(in vec3 dir, inout vec3 hitPos, inout float rayHitDepthDifference);
float fastGetViewZ(const in float depth);
vec3 getIBLRadiance(const in vec3 viewDir, const in vec3 normal, const in float roughness);

void main() {
    vec4 depthTexel = textureLod(depthTexture, vUv, 0.0);

    
    if (dot(depthTexel.rgb, depthTexel.rgb) < FLOAT_EPSILON) {
        gl_FragColor = EARLY_OUT_COLOR;
        return;
    }

    float unpackedDepth = unpackRGBAToDepth(depthTexel);

    vec4 normalTexel = textureLod(normalTexture, vUv, 0.0);
    float roughness = normalTexel.a;

    float specular = 1.0 - roughness;

    
    nearMinusFar = cameraNear - cameraFar;
    nearMulFar = cameraNear * cameraFar;
    farMinusNear = cameraFar - cameraNear;

    normalTexel.rgb = unpackRGBToNormal(normalTexel.rgb);

    
    float depth = fastGetViewZ(unpackedDepth);

    
    vec3 viewPos = getViewPosition(depth);
    vec3 viewDir = normalize(viewPos);
    vec3 viewNormal = normalTexel.xyz;

    
    vec3 worldPos = screenSpaceToWorldSpace(vUv, unpackedDepth);

    
    vec3 jitt = vec3(0.0);

    if (jitterRoughness != 0.0 || jitter != 0.0) {
        vec3 randomJitter = hash(50.0 * samples * worldPos) - 0.5;
        float spread = ((2.0 - specular) + roughness * jitterRoughness);
        float jitterMix = jitter * 0.25 + jitterRoughness * roughness;
        if (jitterMix > 1.0) jitterMix = 1.0;
        jitt = mix(vec3(0.0), randomJitter * spread, jitterMix);
    }

    viewNormal += jitt;

    float fresnelFactor = fresnel_dielectric(viewDir, viewNormal, ior);

    vec3 iblRadiance = getIBLRadiance(-viewDir, viewNormal, 0.) * fresnelFactor;

    float lastFrameAlpha = textureLod(accumulatedTexture, vUv, 0.0).a;

    if (roughness > maxRoughness || (roughness > 1.0 - FLOAT_EPSILON && roughnessFade > 1.0 - FLOAT_EPSILON)) {
        gl_FragColor = vec4(iblRadiance, lastFrameAlpha);
        return;
    }

    
    vec3 reflected = reflect(viewDir, viewNormal);

    vec3 rayDir = reflected * -viewPos.z;

    vec3 hitPos = viewPos;
    float rayHitDepthDifference;

    vec2 coords = RayMarch(rayDir, hitPos, rayHitDepthDifference);

    if (coords.x == -1.0) {
        gl_FragColor = vec4(iblRadiance, lastFrameAlpha);
        return;
    }

    vec4 SSRTexel = textureLod(inputTexture, coords.xy, 0.0);
    vec4 SSRTexelReflected = textureLod(accumulatedTexture, coords.xy, 0.0);

    vec3 SSR = SSRTexel.rgb + SSRTexelReflected.rgb;

    float roughnessFactor = mix(specular, 1.0, max(0.0, 1.0 - roughnessFade));

    vec2 coordsNDC = (coords.xy * 2.0 - 1.0);
    float screenFade = 0.1;
    float maxDimension = min(1.0, max(abs(coordsNDC.x), abs(coordsNDC.y)));
    float reflectionIntensity = 1.0 - (max(0.0, maxDimension - screenFade) / (1.0 - screenFade));
    reflectionIntensity = max(0., reflectionIntensity);

    vec3 finalSSR = mix(iblRadiance, SSR, reflectionIntensity) * roughnessFactor;

    
    
    

    if (fade != 0.0) {
        vec3 hitWorldPos = screenSpaceToWorldSpace(coords, rayHitDepthDifference);

        
        float reflectionDistance = distance(hitWorldPos, worldPos) + 1.0;

        float opacity = 1.0 / (reflectionDistance * fade * 0.1);
        if (opacity > 1.0) opacity = 1.0;
        finalSSR *= opacity;
    }

    finalSSR *= fresnelFactor * intensity;
    finalSSR = min(vec3(1.0), finalSSR);

    float alpha = hitPos.z == 1.0 ? 1.0 : SSRTexelReflected.a;
    alpha = min(lastFrameAlpha, alpha);

    gl_FragColor = vec4(finalSSR, alpha);
}

vec2 RayMarch(vec3 dir, inout vec3 hitPos, inout float rayHitDepthDifference) {
    dir = normalize(dir);
    dir *= rayDistance / float(steps);

    float depth;
    vec4 projectedCoord;
    vec4 lastProjectedCoord;
    float unpackedDepth;
    vec4 depthTexel;

    for (int i = 0; i < steps; i++) {
        hitPos += dir;

        projectedCoord = _projectionMatrix * vec4(hitPos, 1.0);
        projectedCoord.xy /= projectedCoord.w;
        
        projectedCoord.xy = projectedCoord.xy * 0.5 + 0.5;

#ifndef missedRays
        if (projectedCoord.x < 0.0 || projectedCoord.x > 1.0 || projectedCoord.y < 0.0 || projectedCoord.y > 1.0) {
            return INVALID_RAY_COORDS;
        }
#endif

        depthTexel = textureLod(depthTexture, projectedCoord.xy, 0.0);

        unpackedDepth = unpackRGBAToDepth(depthTexel);

        depth = fastGetViewZ(unpackedDepth);

        rayHitDepthDifference = depth - hitPos.z;

        if (rayHitDepthDifference >= 0.0 && rayHitDepthDifference < thickness) {
#if refineSteps == 0
            
            if (dot(depthTexel.rgb, depthTexel.rgb) < FLOAT_EPSILON) return INVALID_RAY_COORDS;
#else
            return BinarySearch(dir, hitPos, rayHitDepthDifference);
#endif
        }

#ifndef missedRays
        
        if (hitPos.z > 0.0) {
            return INVALID_RAY_COORDS;
        }
#endif

        lastProjectedCoord = projectedCoord;
    }

    
    hitPos.z = 1.0;

#ifndef missedRays
    return INVALID_RAY_COORDS;
#endif

    rayHitDepthDifference = unpackedDepth;

    return projectedCoord.xy;
}

vec2 BinarySearch(in vec3 dir, inout vec3 hitPos, inout float rayHitDepthDifference) {
    float depth;
    vec4 projectedCoord;
    vec2 lastMinProjectedCoordXY;
    float unpackedDepth;
    vec4 depthTexel;

    for (int i = 0; i < refineSteps; i++) {
        projectedCoord = _projectionMatrix * vec4(hitPos, 1.0);
        projectedCoord.xy /= projectedCoord.w;
        projectedCoord.xy = projectedCoord.xy * 0.5 + 0.5;

        depthTexel = textureLod(depthTexture, projectedCoord.xy, 0.0);

        unpackedDepth = unpackRGBAToDepth(depthTexel);
        depth = fastGetViewZ(unpackedDepth);

        rayHitDepthDifference = depth - hitPos.z;

        dir *= 0.5;

        if (rayHitDepthDifference > 0.0) {
            hitPos -= dir;
        } else {
            hitPos += dir;
        }
    }

    
    if (dot(depthTexel.rgb, depthTexel.rgb) < FLOAT_EPSILON) return INVALID_RAY_COORDS;

    if (abs(rayHitDepthDifference) > maxDepthDifference) return INVALID_RAY_COORDS;

    projectedCoord = _projectionMatrix * vec4(hitPos, 1.0);
    projectedCoord.xy /= projectedCoord.w;
    projectedCoord.xy = projectedCoord.xy * 0.5 + 0.5;

    rayHitDepthDifference = unpackedDepth;

    return projectedCoord.xy;
}

float fastGetViewZ(const in float depth) {
#ifdef PERSPECTIVE_CAMERA
    return nearMulFar / (farMinusNear * depth - cameraFar);
#else
    return depth * nearMinusFar - cameraNear;
#endif
}

#include <common>
#include <cube_uv_reflection_fragment>

vec3 getIBLRadiance(const in vec3 viewDir, const in vec3 normal, const in float roughness) {
#if defined(ENVMAP_TYPE_CUBE_UV)
    vec3 reflectVec = reflect(-viewDir, normal);

    
    reflectVec = normalize(mix(reflectVec, normal, roughness * roughness));
    reflectVec = inverseTransformDirection(reflectVec, viewMatrix);

    vec4 envMapColor = textureCubeUV(envMap, reflectVec, roughness);
    return envMapColor.rgb * intensity;
#else
    return vec3(0.0);
#endif
}`;class ae extends y{constructor(){super({type:"ReflectionsMaterial",uniforms:{inputTexture:new a(null),accumulatedTexture:new a(null),normalTexture:new a(null),depthTexture:new a(null),_projectionMatrix:new a(new d),_inverseProjectionMatrix:new a(new d),cameraMatrixWorld:new a(new d),cameraNear:new a(0),cameraFar:new a(0),rayDistance:new a(0),intensity:new a(0),roughnessFade:new a(0),fade:new a(0),thickness:new a(0),ior:new a(0),maxDepthDifference:new a(0),jitter:new a(0),jitterRoughness:new a(0),maxRoughness:new a(0),samples:new a(0),envMap:new a(null),envMapPosition:new a(new h),envMapSize:new a(new h),viewMatrix:new a(new d)},defines:{steps:20,refineSteps:5,CUBEUV_TEXEL_WIDTH:0,CUBEUV_TEXEL_HEIGHT:0,CUBEUV_MAX_MIP:0,vWorldPosition:"worldPos"},fragmentShader:ie.replace("#include <helperFunctions>",V),vertexShader:re,toneMapped:!1,depthWrite:!1,depthTest:!1})}}const O=s=>{const o=[s],e=[];for(;o.length!==0;){const t=o.shift();t.material&&e.push(t);for(const n of t.children)n.visible&&o.push(n)}return e},se=s=>{const o=s.envMapCubeUVHeight;if(o===null)return null;const e=Math.log2(o)-2,t=1/o;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:t,maxMip:e}},D=(s,o,e)=>{s.uniforms.envMap.value=o;const t=se({envMapCubeUVHeight:e});s.defines.ENVMAP_TYPE_CUBE_UV="",s.defines.CUBEUV_TEXEL_WIDTH=t.texelWidth,s.defines.CUBEUV_TEXEL_HEIGHT=t.texelHeight,s.defines.CUBEUV_MAX_MIP=t.maxMip+".0",s.needsUpdate=!0},oe=()=>{try{const s=document.createElement("canvas");return!!(window.WebGL2RenderingContext&&s.getContext("webgl2"))}catch{return!1}};class le extends R{constructor(e,t={}){super("ReflectionsPass");c(this,"ssrEffect");c(this,"cachedMaterials",new WeakMap);c(this,"USE_MRT",!1);c(this,"webgl1DepthPass",null);c(this,"visibleMeshes",[]);this.ssrEffect=e,this._scene=e._scene,this._camera=e._camera,this.fullscreenMaterial=new ae,e._camera.isPerspectiveCamera&&(this.fullscreenMaterial.defines.PERSPECTIVE_CAMERA="");const n=t.width||typeof window<"u"?window.innerWidth:2e3,r=t.height||typeof window<"u"?window.innerHeight:1e3;this.renderTarget=new _(n,r,{minFilter:u,magFilter:u,type:v,depthBuffer:!1}),this.renderPass=new I(this._scene,this._camera),this.USE_MRT=oe(),this.USE_MRT?(this.gBuffersRenderTarget=new G(n,r,2,{minFilter:u,magFilter:u}),this.normalTexture=this.gBuffersRenderTarget.texture[0],this.depthTexture=this.gBuffersRenderTarget.texture[1]):(this.webgl1DepthPass=new A(this._scene,this._camera),this.webgl1DepthPass.renderTarget.minFilter=u,this.webgl1DepthPass.renderTarget.magFilter=u,this.webgl1DepthPass.renderTarget.texture.minFilter=u,this.webgl1DepthPass.renderTarget.texture.magFilter=u,this.webgl1DepthPass.setSize(typeof window<"u"?window.innerWidth:2e3,typeof window<"u"?window.innerHeight:1e3),this.gBuffersRenderTarget=new _(n,r,{minFilter:u,magFilter:u}),this.normalTexture=this.gBuffersRenderTarget.texture,this.depthTexture=this.webgl1DepthPass.texture),this.fullscreenMaterial.uniforms.normalTexture.value=this.normalTexture,this.fullscreenMaterial.uniforms.depthTexture.value=this.depthTexture,this.fullscreenMaterial.uniforms.accumulatedTexture.value=this.ssrEffect.temporalResolvePass.accumulatedTexture,this.fullscreenMaterial.uniforms.cameraMatrixWorld.value=this._camera.matrixWorld,this.fullscreenMaterial.uniforms._projectionMatrix.value=this._camera.projectionMatrix,this.fullscreenMaterial.uniforms._inverseProjectionMatrix.value=this._camera.projectionMatrixInverse}setSize(e,t){this.renderTarget.setSize(e*this.ssrEffect.resolutionScale,t*this.ssrEffect.resolutionScale),this.gBuffersRenderTarget.setSize(e*this.ssrEffect.resolutionScale,t*this.ssrEffect.resolutionScale),this.fullscreenMaterial.uniforms.accumulatedTexture.value=this.ssrEffect.temporalResolvePass.accumulatedTexture,this.fullscreenMaterial.needsUpdate=!0}dispose(){this.renderTarget.dispose(),this.gBuffersRenderTarget.dispose(),this.renderPass.dispose(),this.USE_MRT||this.webgl1DepthPass.dispose(),this.fullscreenMaterial.dispose(),this.normalTexture=null,this.depthTexture=null,this.velocityTexture=null}keepMaterialMapUpdated(e,t,n,r){this.ssrEffect[r]?t[n]!==e[n]&&(e[n]=t[n],e.uniforms[n].value=t[n],t[n]?e.defines[r]="":delete e.defines[r],e.needsUpdate=!0):e[n]!==void 0&&(e[n]=void 0,e.uniforms[n].value=void 0,delete e.defines[r],e.needsUpdate=!0)}setMRTMaterialInScene(){this.visibleMeshes=O(this._scene);for(const e of this.visibleMeshes)if(e.material){const t=e.material;let[n,r]=this.cachedMaterials.get(e)||[];if(t!==n){r&&r.dispose(),r=new ne,this.USE_MRT&&(r.defines.USE_MRT=""),r.normalScale=t.normalScale,r.uniforms.normalScale.value=t.normalScale;const l=t.map||t.normalMap||t.roughnessMap||t.metalnessMap;l&&(r.uniforms.uvTransform.value=l.matrix),this.cachedMaterials.set(e,[t,r])}this.keepMaterialMapUpdated(r,t,"normalMap","useNormalMap"),this.keepMaterialMapUpdated(r,t,"roughnessMap","useRoughnessMap"),r.uniforms.roughness.value=this.ssrEffect.selection.size===0||this.ssrEffect.selection.has(e)?t.roughness||0:1e11,e.material=r}}unsetMRTMaterialInScene(){var e;for(const t of this.visibleMeshes)if(((e=t.material)==null?void 0:e.type)==="MRTMaterial"){t.visible=!0;const[n]=this.cachedMaterials.get(t);t.material=n}}render(e,t){this.setMRTMaterialInScene(),e.setRenderTarget(this.gBuffersRenderTarget),this.renderPass.render(e,this.gBuffersRenderTarget),this.unsetMRTMaterialInScene(),this.USE_MRT||this.webgl1DepthPass.renderPass.render(e,this.webgl1DepthPass.renderTarget),this.fullscreenMaterial.uniforms.inputTexture.value=t.texture,this.fullscreenMaterial.uniforms.samples.value=this.ssrEffect.temporalResolvePass.samples,this.fullscreenMaterial.uniforms.cameraNear.value=this._camera.near,this.fullscreenMaterial.uniforms.cameraFar.value=this._camera.far,this.fullscreenMaterial.uniforms.viewMatrix.value.copy(this._camera.matrixWorldInverse),e.setRenderTarget(this.renderTarget),e.render(this.scene,this.camera)}}const w={intensity:1,exponent:1,distance:10,fade:0,roughnessFade:1,thickness:10,ior:1.45,maxRoughness:1,maxDepthDifference:10,blend:.9,correction:1,correctionRadius:1,blur:.5,blurKernel:1,blurSharpness:10,jitter:0,jitterRoughness:0,steps:20,refineSteps:5,missedRays:!0,useNormalMap:!0,useRoughnessMap:!0,resolutionScale:1,velocityResolutionScale:1};var ce=`varying vec2 vUv;

void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 1.0, 1.0);
}`,ue=`uniform sampler2D inputTexture;
uniform sampler2D accumulatedTexture;
uniform sampler2D velocityTexture;
uniform sampler2D lastVelocityTexture;

uniform float blend;
uniform float correction;
uniform float exponent;
uniform float samples;
uniform vec2 invTexSize;

uniform mat4 curInverseProjectionMatrix;
uniform mat4 curCameraMatrixWorld;
uniform mat4 prevInverseProjectionMatrix;
uniform mat4 prevCameraMatrixWorld;

varying vec2 vUv;

#define MAX_NEIGHBOR_DEPTH_DIFFERENCE 0.001
#define FLOAT_EPSILON                 0.00001
#define FLOAT_ONE_MINUS_EPSILON       0.99999

vec3 transformexponent;
vec3 undoColorTransformExponent;

vec3 transformColor(vec3 color) {
    if (exponent == 1.0) return color;

    return pow(abs(color), transformexponent);
}

vec3 undoColorTransform(vec3 color) {
    if (exponent == 1.0) return color;

    return max(pow(abs(color), undoColorTransformExponent), vec3(0.0));
}

void main() {
    if (exponent != 1.0) {
        transformexponent = vec3(1.0 / exponent);
        undoColorTransformExponent = vec3(exponent);
    }

    vec4 inputTexel = textureLod(inputTexture, vUv, 0.0);
    vec4 accumulatedTexel;

    vec3 inputColor = transformColor(inputTexel.rgb);
    vec3 accumulatedColor;

    float alpha = inputTexel.a;

    

    float velocityDisocclusion;
    bool didReproject = false;

#ifdef boxBlur
    vec3 boxBlurredColor = inputTexel.rgb;
#endif

    vec4 velocity = textureLod(velocityTexture, vUv, 0.0);
    bool isMoving = alpha < 1.0 || dot(velocity.xy, velocity.xy) > 0.0;

    if (isMoving) {
        vec3 minNeighborColor = inputColor;
        vec3 maxNeighborColor = inputColor;

        vec3 col;
        vec2 neighborUv;

        vec2 reprojectedUv = vUv - velocity.xy;
        vec4 lastVelocity = textureLod(lastVelocityTexture, reprojectedUv, 0.0);

        float depth = velocity.b;
        float closestDepth = depth;
        float lastClosestDepth = lastVelocity.b;
        float neighborDepth;
        float lastNeighborDepth;

        for (int x = -correctionRadius; x <= correctionRadius; x++) {
            for (int y = -correctionRadius; y <= correctionRadius; y++) {
                if (x != 0 || y != 0) {
                    neighborUv = vUv + vec2(x, y) * invTexSize;
                    vec4 neigborVelocity = textureLod(velocityTexture, neighborUv, 0.0);
                    neighborDepth = neigborVelocity.b;

                    col = textureLod(inputTexture, neighborUv, 0.0).xyz;

                    int absX = abs(x);
                    int absY = abs(y);

#ifdef dilation
                    if (absX == 1 && absY == 1) {
                        if (neighborDepth > closestDepth) {
                            velocity = neigborVelocity;
                            closestDepth = neighborDepth;
                        }

                        vec4 lastNeighborVelocity = textureLod(velocityTexture, vUv + vec2(x, y) * invTexSize, 0.0);
                        lastNeighborDepth = lastNeighborVelocity.b;

                        if (neighborDepth > closestDepth) {
                            lastVelocity = lastNeighborVelocity;
                            lastClosestDepth = lastNeighborDepth;
                        }
                    }
#endif

                    
                    if (abs(depth - neighborDepth) < MAX_NEIGHBOR_DEPTH_DIFFERENCE) {
#ifdef boxBlur
                        if (absX <= 2 && absY <= 2) boxBlurredColor += col;
#endif

                        col = transformColor(col);

                        minNeighborColor = min(col, minNeighborColor);
                        maxNeighborColor = max(col, maxNeighborColor);
                    }
                }
            }
        }

        
        float velocityLength = length(lastVelocity.xy - velocity.xy);

        
        velocityDisocclusion = (velocityLength - 0.000005) * 10.0;
        velocityDisocclusion *= velocityDisocclusion;

        reprojectedUv = vUv - velocity.xy;

        

#ifdef boxBlur
        
        float pxRadius = correctionRadius > 5 ? 121.0 : pow(float(correctionRadius * 2 + 1), 2.0);
        boxBlurredColor /= pxRadius;
        boxBlurredColor = transformColor(boxBlurredColor);
#endif

        
        if (reprojectedUv.x >= 0.0 && reprojectedUv.x <= 1.0 && reprojectedUv.y >= 0.0 && reprojectedUv.y <= 1.0) {
            accumulatedTexel = textureLod(accumulatedTexture, reprojectedUv, 0.0);
            accumulatedColor = transformColor(accumulatedTexel.rgb);

            vec3 clampedColor = clamp(accumulatedColor, minNeighborColor, maxNeighborColor);

            accumulatedColor = mix(accumulatedColor, clampedColor, correction);

            didReproject = true;
        } else {
            
#ifdef boxBlur
            accumulatedColor = boxBlurredColor;
#else
            accumulatedColor = inputColor;
#endif
        }

        
        if (velocity.r > FLOAT_ONE_MINUS_EPSILON && velocity.g > FLOAT_ONE_MINUS_EPSILON) {
            alpha = 0.0;
            velocityDisocclusion = 1.0;
        }
    } else {
        
        accumulatedColor = transformColor(textureLod(accumulatedTexture, vUv, 0.0).rgb);
    }

    

    vec3 outputColor = inputColor;

    
#include <custom_compose_shader>

    gl_FragColor = vec4(undoColorTransform(outputColor), alpha);
}`;class fe extends y{constructor(o){const e=ue.replace("#include <custom_compose_shader>",o);super({type:"TemporalResolveMaterial",uniforms:{inputTexture:new a(null),accumulatedTexture:new a(null),velocityTexture:new a(null),lastVelocityTexture:new a(null),samples:new a(1),blend:new a(.5),correction:new a(1),exponent:new a(1),invTexSize:new a(new M)},defines:{correctionRadius:1},vertexShader:ce,fragmentShader:e})}}const de=`
		#ifdef USE_SKINNING
		#ifdef BONE_TEXTURE
			uniform sampler2D prevBoneTexture;
			mat4 getPrevBoneMatrix( const in float i ) {
				float j = i * 4.0;
				float x = mod( j, float( boneTextureSize ) );
				float y = floor( j / float( boneTextureSize ) );
				float dx = 1.0 / float( boneTextureSize );
				float dy = 1.0 / float( boneTextureSize );
				y = dy * ( y + 0.5 );
				vec4 v1 = texture2D( prevBoneTexture, vec2( dx * ( x + 0.5 ), y ) );
				vec4 v2 = texture2D( prevBoneTexture, vec2( dx * ( x + 1.5 ), y ) );
				vec4 v3 = texture2D( prevBoneTexture, vec2( dx * ( x + 2.5 ), y ) );
				vec4 v4 = texture2D( prevBoneTexture, vec2( dx * ( x + 3.5 ), y ) );
				mat4 bone = mat4( v1, v2, v3, v4 );
				return bone;
			}
		#else
			uniform mat4 prevBoneMatrices[ MAX_BONES ];
			mat4 getPrevBoneMatrix( const in float i ) {
				mat4 bone = prevBoneMatrices[ int(i) ];
				return bone;
			}
		#endif
		#endif
`,he=`
		vec3 transformed;

		// Get the normal
		${f.skinbase_vertex}
		${f.beginnormal_vertex}
		${f.skinnormal_vertex}
		${f.defaultnormal_vertex}

		// Get the current vertex position
		transformed = vec3( position );
		${f.skinning_vertex}
		newPosition = velocityMatrix * vec4( transformed, 1.0 );

		// Get the previous vertex position
		transformed = vec3( position );
		${f.skinbase_vertex.replace(/mat4 /g,"").replace(/getBoneMatrix/g,"getPrevBoneMatrix")}
		${f.skinning_vertex.replace(/vec4 /g,"")}
		prevPosition = prevVelocityMatrix * vec4( transformed, 1.0 );

		gl_Position = newPosition;
`;class pe extends y{constructor(){super({uniforms:{prevVelocityMatrix:{value:new d},velocityMatrix:{value:new d},prevBoneTexture:{value:null},interpolateGeometry:{value:0},intensity:{value:1},boneTexture:{value:null},alphaTest:{value:0},map:{value:null},alphaMap:{value:null},opacity:{value:1}},vertexShader:`
                    #define MAX_BONES 1024
                    
                    ${f.skinning_pars_vertex}
                    ${de}
        
                    uniform mat4 velocityMatrix;
                    uniform mat4 prevVelocityMatrix;
                    uniform float interpolateGeometry;
                    varying vec4 prevPosition;
                    varying vec4 newPosition;
					varying vec2 vHighPrecisionZW;
        
                    void main() {
        
                        ${he}

						vHighPrecisionZW = gl_Position.zw;
        
                    }`,fragmentShader:`
                    uniform float intensity;
                    varying vec4 prevPosition;
                    varying vec4 newPosition;
					varying vec2 vHighPrecisionZW;
        
                    void main() {
						#ifdef FULL_MOVEMENT
						gl_FragColor = vec4( 1., 1., 1. - gl_FragCoord.z, 0. );
						return;
						#endif

                        vec2 pos0 = (prevPosition.xy / prevPosition.w) * 0.5 + 0.5;
                        vec2 pos1 = (newPosition.xy / newPosition.w) * 0.5 + 0.5;
        
                        vec2 vel = pos1 - pos0;

						float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
                        
                        gl_FragColor = vec4( vel, 1. - fragCoordZ, 0. );
        
                    }`}),this.isVelocityMaterial=!0}}const ve=new X(0),me=["visible","wireframe","side"];class xe extends R{constructor(e,t){super("VelocityPass");c(this,"cachedMaterials",new WeakMap);c(this,"lastCameraTransform",{position:new h,quaternion:new F});c(this,"visibleMeshes",[]);c(this,"renderedMeshesThisFrame",0);c(this,"renderedMeshesLastFrame",0);this._scene=e,this._camera=t,this.renderTarget=new _((window==null?void 0:window.innerWidth)||1e3,(window==null?void 0:window.innerHeight)||1e3,{type:v})}setVelocityMaterialInScene(){var e,t;this.renderedMeshesThisFrame=0,this.visibleMeshes=O(this._scene);for(const n of this.visibleMeshes){const r=n.material;let[l,i]=this.cachedMaterials.get(n)||[];if(r!==l&&(i=new pe,i.lastMatrixWorld=new d,n.material=i,(e=n.skeleton)!=null&&e.boneTexture&&this.saveBoneTexture(n),this.cachedMaterials.set(n,[r,i])),i.uniforms.velocityMatrix.value.multiplyMatrices(this._camera.projectionMatrix,n.modelViewMatrix),n.userData.needsUpdatedReflections||r.map instanceof Z?("FULL_MOVEMENT"in i.defines||(i.needsUpdate=!0),i.defines.FULL_MOVEMENT=""):"FULL_MOVEMENT"in i.defines&&(delete i.defines.FULL_MOVEMENT,i.needsUpdate=!0),n.visible=this.cameraMovedThisFrame||!n.matrixWorld.equals(i.lastMatrixWorld)||n.skeleton||"FULL_MOVEMENT"in i.defines,n.material=i,!!n.visible){this.renderedMeshesThisFrame++;for(const m of me)i[m]=r[m];(t=n.skeleton)!=null&&t.boneTexture&&(i.defines.USE_SKINNING="",i.defines.BONE_TEXTURE="",i.uniforms.boneTexture.value=n.skeleton.boneTexture)}}}saveBoneTexture(e){let t=e.material.uniforms.prevBoneTexture.value;if(t&&t.image.width===e.skeleton.boneTexture.width)t=e.material.uniforms.prevBoneTexture.value,t.image.data.set(e.skeleton.boneTexture.image.data);else{t==null||t.dispose();const n=e.skeleton.boneTexture.image.data.slice(),r=e.skeleton.boneTexture.image.width;t=new q(n,r,r,S,K),e.material.uniforms.prevBoneTexture.value=t,t.needsUpdate=!0}}unsetVelocityMaterialInScene(){var e;for(const t of this.visibleMeshes)t.material.isVelocityMaterial&&(t.visible=!0,t.material.lastMatrixWorld.copy(t.matrixWorld),t.material.uniforms.prevVelocityMatrix.value.multiplyMatrices(this._camera.projectionMatrix,t.modelViewMatrix),(e=t.skeleton)!=null&&e.boneTexture&&this.saveBoneTexture(t),t.material=this.cachedMaterials.get(t)[0])}setSize(e,t){this.renderTarget.setSize(e,t)}renderVelocity(e){if(e.setRenderTarget(this.renderTarget),this.renderedMeshesThisFrame>0){const{background:t}=this._scene;this._scene.background=ve,e.render(this._scene,this._camera),this._scene.background=t}else e.clearColor()}checkCameraMoved(){const e=this.lastCameraTransform.position.distanceToSquared(this._camera.position),t=8*(1-this.lastCameraTransform.quaternion.dot(this._camera.quaternion));return e>1e-6||t>1e-6?(this.lastCameraTransform.position.copy(this._camera.position),this.lastCameraTransform.quaternion.copy(this._camera.quaternion),!0):!1}render(e){this.cameraMovedThisFrame=this.checkCameraMoved(),this.setVelocityMaterialInScene(),(this.renderedMeshesThisFrame>0||this.renderedMeshesLastFrame>0)&&this.renderVelocity(e),this.unsetVelocityMaterialInScene(),this.renderedMeshesLastFrame=this.renderedMeshesThisFrame}}const E=new M;class ge extends R{constructor(e,t,n,r={}){super("TemporalResolvePass");c(this,"velocityPass",null);c(this,"velocityResolutionScale",1);c(this,"samples",1);c(this,"lastCameraTransform",{position:new h,quaternion:new F});this._scene=e,this._camera=t,this.renderTarget=new _(1,1,{minFilter:u,magFilter:u,type:v,depthBuffer:!1}),this.velocityPass=new xe(e,t),this.fullscreenMaterial=new fe(n),this.fullscreenMaterial.defines.correctionRadius=r.correctionRadius||1,r.dilation&&(this.fullscreenMaterial.defines.dilation=""),r.boxBlur&&(this.fullscreenMaterial.defines.boxBlur=""),this.setupFramebuffers(1,1),this.checkCanUseSharedVelocityTexture()}dispose(){this._scene.userData.velocityTexture===this.velocityPass.renderTarget.texture&&(delete this._scene.userData.velocityTexture,delete this._scene.userData.lastVelocityTexture),this.renderTarget.dispose(),this.accumulatedTexture.dispose(),this.fullscreenMaterial.dispose(),this.velocityPass.dispose()}setSize(e,t){this.renderTarget.setSize(e,t),this.velocityPass.setSize(e*this.velocityResolutionScale,t*this.velocityResolutionScale),this.velocityPass.renderTarget.texture.minFilter=this.velocityResolutionScale===1?g:u,this.velocityPass.renderTarget.texture.magFilter=this.velocityResolutionScale===1?g:u,this.velocityPass.renderTarget.texture.needsUpdate=!0,this.fullscreenMaterial.uniforms.invTexSize.value.set(1/e,1/t),this.setupFramebuffers(e,t)}setupFramebuffers(e,t){this.accumulatedTexture&&this.accumulatedTexture.dispose(),this.lastVelocityTexture&&this.lastVelocityTexture.dispose(),this.accumulatedTexture=new P(e,t,S),this.accumulatedTexture.minFilter=u,this.accumulatedTexture.magFilter=u,this.accumulatedTexture.type=v,this.lastVelocityTexture=new P(e*this.velocityResolutionScale,t*this.velocityResolutionScale,S),this.lastVelocityTexture.minFilter=this.velocityResolutionScale===1?g:u,this.lastVelocityTexture.magFilter=this.velocityResolutionScale===1?g:u,this.lastVelocityTexture.type=v,this.fullscreenMaterial.uniforms.accumulatedTexture.value=this.accumulatedTexture,this.fullscreenMaterial.uniforms.lastVelocityTexture.value=this.lastVelocityTexture,this.fullscreenMaterial.needsUpdate=!0}checkCanUseSharedVelocityTexture(){return this._scene.userData.velocityTexture&&this.velocityPass.renderTarget.texture!==this._scene.userData.velocityTexture?this.velocityPass.renderTarget.texture===this.fullscreenMaterial.uniforms.velocityTexture.value&&(this.fullscreenMaterial.uniforms.lastVelocityTexture.value=this._scene.userData.lastVelocityTexture,this.fullscreenMaterial.uniforms.velocityTexture.value=this._scene.userData.velocityTexture,this.fullscreenMaterial.needsUpdate=!0):this.velocityPass.renderTarget.texture!==this.fullscreenMaterial.uniforms.velocityTexture.value&&(this.fullscreenMaterial.uniforms.velocityTexture.value=this.velocityPass.renderTarget.texture,this.fullscreenMaterial.uniforms.lastVelocityTexture.value=this.lastVelocityTexture,this.fullscreenMaterial.needsUpdate=!0,this._scene.userData.velocityTexture||(this._scene.userData.velocityTexture=this.velocityPass.renderTarget.texture,this._scene.userData.lastVelocityTexture=this.lastVelocityTexture)),this.velocityPass.renderTarget.texture!==this.fullscreenMaterial.uniforms.velocityTexture.value}checkNeedsResample(){const e=this.lastCameraTransform.position.distanceToSquared(this._camera.position),t=8*(1-this.lastCameraTransform.quaternion.dot(this._camera.quaternion));(e>1e-6||t>1e-6)&&(this.samples=1,this.lastCameraTransform.position.copy(this._camera.position),this.lastCameraTransform.quaternion.copy(this._camera.quaternion))}render(e){this.samples++,this.checkNeedsResample(),this.fullscreenMaterial.uniforms.samples.value=this.samples,e.setRenderTarget(this.renderTarget),e.render(this.scene,this.camera),e.copyFramebufferToTexture(E,this.accumulatedTexture),e.setRenderTarget(this.velocityPass.renderTarget),e.copyFramebufferToTexture(E,this.lastVelocityTexture)}}const C=function(o,e){let t=1,n=0;for(;o>0;)t/=e,n+=t*(o%e),o=~~(o/e);return n},Te=s=>{const o=[];let e=1;const t=e+s;for(;e<t;e++)o.push([C(e,2)-.5,C(e,3)-.5]);return o};function N(s){return s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}const Me=`
#if defined( USE_ENVMAP ) || defined(  ) || defined ( USE_SHADOWMAP )
    vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );

    #ifdef BOX_PROJECTED_ENV_MAP
        vWorldPosition = worldPosition.xyz;
    #endif
#endif
`,_e=`
#ifdef BOX_PROJECTED_ENV_MAP
    uniform vec3 envMapSize;
    uniform vec3 envMapPosition;
    varying vec3 vWorldPosition;

    vec3 parallaxCorrectNormal( vec3 v, vec3 cubeSize, vec3 cubePos ) {
        vec3 nDir = normalize( v );

        vec3 rbmax = ( .5 * cubeSize + cubePos - vWorldPosition ) / nDir;
        vec3 rbmin = ( -.5 * cubeSize + cubePos - vWorldPosition ) / nDir;

        vec3 rbminmax;

        rbminmax.x = ( nDir.x > 0. ) ? rbmax.x : rbmin.x;
        rbminmax.y = ( nDir.y > 0. ) ? rbmax.y : rbmin.y;
        rbminmax.z = ( nDir.z > 0. ) ? rbmax.z : rbmin.z;

        float correction = min( min( rbminmax.x, rbminmax.y ), rbminmax.z );
        vec3 boxIntersection = vWorldPosition + nDir * correction;

        return boxIntersection - cubePos;
    }
#endif
`,ye=`
#ifdef BOX_PROJECTED_ENV_MAP
    worldNormal = parallaxCorrectNormal( worldNormal, envMapSize, envMapPosition );
#endif
`,be=`
#ifdef BOX_PROJECTED_ENV_MAP
    reflectVec = parallaxCorrectNormal( reflectVec, envMapSize, envMapPosition );
#endif
`;function Se(s,o,e){s.defines.BOX_PROJECTED_ENV_MAP="",s.uniforms.envMapPosition={value:o},s.uniforms.envMapSize={value:e};const t=new RegExp(N("vec3 worldNormal = inverseTransformDirection ( normal , viewMatrix ) ;").replaceAll(" ","\\s*"),"g"),n=new RegExp(N("reflectVec = inverseTransformDirection ( reflectVec , viewMatrix ) ;").replaceAll(" ","\\s*"),"g");s.vertexShader=`varying vec3 vWorldPosition;
`+s.vertexShader.replace("#include <worldpos_vertex>",Me),s.fragmentShader=_e+`
`+s.fragmentShader.replace("#include <envmap_physical_pars_fragment>",f.envmap_physical_pars_fragment).replace(t,`vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
                ${ye}`).replace(n,`reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
                ${be}`)}const Re=ee.replace("#include <helperFunctions>",V).replace("#include <boxBlur>",Q),Pe=["blur","blurSharpness","blurKernel"],De=new U(1);let T;class Fe extends z{constructor(e,t,n=w){super("SSREffect",Re,{type:"FinalSSRMaterial",uniforms:new Map([["reflectionsTexture",new a(null)],["blur",new a(0)],["blurSharpness",new a(0)],["blurKernel",new a(0)]]),defines:new Map([["RENDER_MODE","0"]])});c(this,"haltonSequence",Te(1024));c(this,"haltonIndex",0);c(this,"selection",new j);c(this,"lastSize");c(this,"cubeCamera",new Y(.001,1e3,De));c(this,"usingBoxProjectedEnvMap",!1);this._scene=e,this._camera=t,n={...w,...n,...{boxBlur:!0,dilation:!0}},this.temporalResolvePass=new ge(e,t,te,n),this.uniforms.get("reflectionsTexture").value=this.temporalResolvePass.renderTarget.texture,this.reflectionsPass=new le(this,n),this.temporalResolvePass.fullscreenMaterial.uniforms.inputTexture.value=this.reflectionsPass.renderTarget.texture,this.lastSize={width:n.width,height:n.height,resolutionScale:n.resolutionScale,velocityResolutionScale:n.velocityResolutionScale},this.setSize(n.width,n.height),this.makeOptionsReactive(n)}makeOptionsReactive(e){let t=!1;const n=this.reflectionsPass.fullscreenMaterial.uniforms,r=Object.keys(n);for(const l of Object.keys(e))Object.defineProperty(this,l,{get(){return e[l]},set(i){if(!(e[l]===i&&t))switch(e[l]=i,Pe.includes(l)||this.setSize(this.lastSize.width,this.lastSize.height,!0),l){case"resolutionScale":this.setSize(this.lastSize.width,this.lastSize.height);break;case"velocityResolutionScale":this.temporalResolvePass.velocityResolutionScale=i,this.setSize(this.lastSize.width,this.lastSize.height,!0);break;case"blur":this.uniforms.get("blur").value=i;break;case"blurSharpness":this.uniforms.get("blurSharpness").value=i;break;case"blurKernel":this.uniforms.get("blurKernel").value=i;break;case"steps":this.reflectionsPass.fullscreenMaterial.defines.steps=parseInt(i),this.reflectionsPass.fullscreenMaterial.needsUpdate=t;break;case"refineSteps":this.reflectionsPass.fullscreenMaterial.defines.refineSteps=parseInt(i),this.reflectionsPass.fullscreenMaterial.needsUpdate=t;break;case"missedRays":i?this.reflectionsPass.fullscreenMaterial.defines.missedRays="":delete this.reflectionsPass.fullscreenMaterial.defines.missedRays,this.reflectionsPass.fullscreenMaterial.needsUpdate=t;break;case"correctionRadius":this.temporalResolvePass.fullscreenMaterial.defines.correctionRadius=Math.round(i),this.temporalResolvePass.fullscreenMaterial.needsUpdate=t;break;case"blend":this.temporalResolvePass.fullscreenMaterial.uniforms.blend.value=i;break;case"correction":this.temporalResolvePass.fullscreenMaterial.uniforms.correction.value=i;break;case"exponent":this.temporalResolvePass.fullscreenMaterial.uniforms.exponent.value=i;break;case"distance":n.rayDistance.value=i;default:r.includes(l)&&(n[l].value=i)}}}),this[l]=e[l];t=!0}setSize(e,t,n=!1){!n&&e===this.lastSize.width&&t===this.lastSize.height&&this.resolutionScale===this.lastSize.resolutionScale&&this.velocityResolutionScale===this.lastSize.velocityResolutionScale||(this.temporalResolvePass.setSize(e,t),this.reflectionsPass.setSize(e,t),this.lastSize={width:e,height:t,resolutionScale:this.resolutionScale,velocityResolutionScale:this.velocityResolutionScale})}generateBoxProjectedEnvMapFallback(e,t=new h,n=new h,r=512){this.cubeCamera.renderTarget.dispose(),this.cubeCamera.renderTarget=new U(r),this.cubeCamera.position.copy(t),this.cubeCamera.updateMatrixWorld(),this.cubeCamera.update(e,this._scene),T||(T=new $(e),T.compileCubemapShader());const l=T.fromCubemap(this.cubeCamera.renderTarget.texture).texture;l.minFilter=u,l.magFilter=u;const i=this.reflectionsPass.fullscreenMaterial;return Se(i,t,n),i.fragmentShader=i.fragmentShader.replace("vec3 worldPos","worldPos").replace("varying vec3 vWorldPosition;","vec3 worldPos;"),i.uniforms.envMapPosition.value.copy(t),i.uniforms.envMapSize.value.copy(n),D(i,l,r),this.usingBoxProjectedEnvMap=!0,l}setIBLRadiance(e,t){this._scene.traverse(n=>{var r;if(n.material){const l=(r=t.properties.get(n.material))==null?void 0:r.uniforms;l&&"disableIBLRadiance"in l&&(l.disableIBLRadiance.value=e)}})}deleteBoxProjectedEnvMapFallback(){const e=this.reflectionsPass.fullscreenMaterial;e.uniforms.envMap.value=null,e.fragmentShader=e.fragmentShader.replace("worldPos = ","vec3 worldPos = "),delete e.defines.BOX_PROJECTED_ENV_MAP,e.needsUpdate=!0,this.usingBoxProjectedEnvMap=!1}dispose(){super.dispose(),this.reflectionsPass.dispose(),this.temporalResolvePass.dispose()}update(e,t){if(!this.usingBoxProjectedEnvMap&&this._scene.environment){const m=this.reflectionsPass.fullscreenMaterial;let x=null;if(this._scene.traverse(p=>{if(!x&&p.material&&!p.material.envMap){const b=e.properties.get(p.material);"envMap"in b&&b.envMap instanceof J&&(x=b.envMap)}}),x){const p=this._scene.environment.image.height;D(m,x,p)}}this.haltonIndex=(this.haltonIndex+1)%this.haltonSequence.length;let[n,r]=this.haltonSequence[this.haltonIndex];n*=.1,r*=.1;const{width:l,height:i}=this.lastSize;this.temporalResolvePass.velocityPass.render(e),this._camera.setViewOffset&&this._camera.setViewOffset(l,i,n,r,l,i),this.reflectionsPass.render(e,t),this.temporalResolvePass.render(e),this._camera.clearViewOffset()}static patchDirectEnvIntensity(e=0){e===0?f.envmap_physical_pars_fragment=f.envmap_physical_pars_fragment.replace("vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {","vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) { return vec3(0.0);"):f.envmap_physical_pars_fragment=f.envmap_physical_pars_fragment.replace("vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );","vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness ) * "+e.toFixed(5)+";")}}export{Fe as SSREffect,w as defaultSSROptions};
