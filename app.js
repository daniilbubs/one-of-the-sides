/* global SelfieSegmentation, Pose */

/*
  ONE OF THE SIDES

  This project first creates a stable camera + body segmentation prototype.
  On top of that, it draws a living monochrome digital space driven by
  both the body mask and the internal pose landmarks.

  Important idea:
  The room stays visually untouched. The real camera image stays visible
  underneath at first. The body mask defines where corruption begins, while
  pose landmarks act like a nervous system for a shallow digital volume.
*/

// -----------------------------------------------------------------------------
// EASY SETTINGS
// -----------------------------------------------------------------------------

// Set this to true to test only camera access, segmentation, and a very simple
// dark mask overlay. Set it back to false for the full artwork.
const BASIC_PROTOTYPE_ONLY = false;

// "environment" usually means the rear camera on a phone.
// Use "user" for the front camera.
const CAMERA_FACING_MODE = "environment";

// Show or hide the small status label.
const SHOW_STATUS_PANEL = true;

// Landing page controls. These affect only the pre-camera exhibition screen
// and stop running before the camera performance begins.
const LANDING_ARTIFACT_COUNT = 5;
const LANDING_INVITATION_FRAGMENT_COUNT = 5;
const LANDING_ARTIFACT_OPACITY = 0.105;
const LANDING_ARTIFACT_SPEED = 0.82;
const LANDING_POINTER_RADIUS = 172;
const LANDING_POINTER_FORCE = 520;
const LANDING_EDGE_BOUNCE = 0.58;
const LANDING_COLLISION_STRENGTH = 0.3;
const LANDING_FRAGMENT_CLICK_RADIUS = 52;
const LANDING_FRAGMENT_REAPPEAR_DELAY = 1900;
const LANDING_FRAGMENT_SHARD_LIFETIME = 1450;
const LANDING_CRACK_LIFETIME = 12000;
const LANDING_PRESSURE_LIFETIME = 1600;
const LANDING_CRACK_DEPTH = 1.0;
const LANDING_CRACK_CHIP = 1.15;
const LANDING_CRACK_BREATHING_SPEED = 0.00062;
const LANDING_MAJOR_CRACK_LIMIT = 5;
const LANDING_HOVER_CRACK_LIMIT = 3;
const LANDING_NEGATIVE_RAY_CHANCE = 0.52;
const LANDING_COLLAPSE_PULL_STRENGTH = 1.55;
const LANDING_CURSOR_DAMAGE_INTERVAL = 185;
const LANDING_BUTTON_DAMAGE_RADIUS = 240;
const LANDING_LETTER_EXPULSION_DELAY = 520;
const LANDING_LETTER_IMPACT_FORCE = 2200;
const LANDING_LETTER_BOUNCE = 0.46;
const LANDING_NEGATIVE_GLOW = 0.42;
const LANDING_TRANSITION_DURATION = 6800;
const LANDING_TRANSITION_CAMERA_DELAY = 8000;
const LANDING_TRANSITION_INTENSITY = 1.0;
const LANDING_FINAL_COLLAPSE_START = 0.64;
const LANDING_FINAL_DARKNESS_START = 0.78;
const LANDING_FINAL_DARKNESS = 0.96;
const LANDING_SURFACE_FRAGMENT_AMOUNT = 150;
const LANDING_SINGULARITY_START = 0.82;
const LANDING_SINGULARITY_HOLD_START = 0.94;
const LANDING_CAMERA_REVEAL_DURATION = 3400;
const LANDING_BLACK_SHELL_CELL_SIZE = 74;
const LANDING_BLACK_SHELL_OVERLAP = 10;
const LANDING_BLACK_SHELL_RESISTANCE = 0.42;
const LANDING_BLACK_SHELL_GRAVITY = 320;
const LANDING_BLACK_SHELL_EDGE_STRESS = 0.025;

// Timing values are in milliseconds. 1000 = 1 second.
const START_TRANSFORMATION_TIME = 3000;
const PIXEL_APPEAR_TIME = 5500;
const FINAL_TRANSFORMATION_TIME = 90000;

// Visual controls. Higher values make the digital matter darker, denser,
// larger, or more unstable. Keep all tones grayscale.
const PIXEL_SIZE = 2;
const PIXEL_DENSITY = 0.34;
const FRAGMENT_DENSITY = 0.92;
const NOISE_INTENSITY = 0.52;
const PARTICLE_AMOUNT = 920;
const EDGE_DISTORTION = 34;
const CHAOS_INTENSITY = 1.04;
const MISSING_DATA_DENSITY = 0.52;
const GLITCH_STRIP_DENSITY = 0.5;
const WHITE_SPECK_AMOUNT = 0.025;

// Living digital-space behavior. These controls shape the shallow 3D volume,
// the entropy/order cycle, and the unfinished reconstruction attempts.
const DEPTH_LAYER_STRENGTH = 1.35;
const DEPTH_PARALLAX = 18;
const NEAR_LAYER_OPACITY = 0.48;
const BODY_LAYER_OPACITY = 0.58;
const BEHIND_LAYER_OPACITY = 0.22;
const DIGITAL_ENTROPY_DENSITY = 1.0;
const ENTROPY_REORGANIZE_SPEED = 0.00135;
const DIGITAL_GRAVITY_STRENGTH = 0.64;
const RECONSTRUCTION_CLUSTER_DENSITY = 0.92;
const ORDER_COLLAPSE_SPEED = 0.00115;
const STRUCTURE_REGION_GROWTH = 1.0;
const CORRUPTION_REGION_GROWTH = 1.0;
const MEDIUM_FRAGMENT_SCALE = 0.72;
const LARGE_POLYGON_SCALE = 0.6;
const CLUSTER_COLLAPSE_THRESHOLD = 0.68;
const DIGITAL_VOLUME_SPREAD = 78;

// Pose / skeleton controls. Pose is loaded from app.js so index.html can stay
// simple. If pose fails to load, segmentation still continues by itself.
const POSE_TRACKING_ENABLED = true;
const POSE_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js";
const POSE_FRAME_INTERVAL_MS = 95;
const LANDMARK_CONFIDENCE_THRESHOLD = 0.55;
const POSE_MIN_VISIBLE_LANDMARKS = 8;
const POSE_STALE_AFTER_MS = 1200;
const USE_POSE_TO_CONFIRM_BODY = true;
const USE_POSE_TO_FILTER_EFFECTS = true;
const POSE_BODY_CONFIRM_GRACE_MS = 2500;
const BODY_PRESENT_WITHOUT_POSE_COVERAGE = 0.08;
const POSE_EFFECT_MARGIN = 52;

// Skeleton and movement-trail controls.
const SKELETON_LINE_OPACITY = 0.5;
const SKELETON_LINE_WIDTH = 1.05;
const SKELETON_BREAK_INTENSITY = 0.88;
const JOINT_CORRUPTION_DENSITY = 0.82;
const TRAIL_LIFETIME = 1500;
const TRAIL_DENSITY = 0.74;
const OUTSIDE_BODY_SPREAD = 84;
const PARTICLE_TRAIL_AMOUNT = 320;
const FINAL_STAGE_EXPANSION = 1.62;

// Opaque body-image deformation. This redraws the performer's real camera body
// as fractured image pieces before the existing particles and entropy are drawn.
const BODY_DEFORMATION_ENABLED = true;
const BODY_FRACTURE_INTENSITY = 0.92;
const BODY_FRAGMENT_COUNT = 520;
const BODY_FRAGMENT_MIN_SIZE = 9;
const BODY_FRAGMENT_MAX_SIZE = 48;
const BODY_SLICE_DISPLACEMENT = 38;
const BODY_ROTATION_AMOUNT = 0.16;
const BODY_SCALE_DISTORTION = 0.2;
const BODY_TEMPORAL_ECHO_STRENGTH = 0.72;
const BODY_FACE_DISTORTION_INTENSITY = 1.1;
const BODY_HAND_FINGER_DISTORTION_INTENSITY = 1.25;
const BODY_JOINT_BREAK_INTENSITY = 1.0;
const BODY_STAGE_RESPONSE = 1.0;
const BODY_DEFORMATION_SMOOTHING = 0.82;
const BODY_FRAME_MEMORY_COUNT = 8;
const BODY_FRAME_MEMORY_INTERVAL_MS = 75;
const BODY_DETACHED_FRAGMENT_AMOUNT = 120;
const BODY_STRUCTURAL_INSTABILITY_ENABLED = true;
const BODY_STRUCTURAL_INSTABILITY_INTENSITY = 0.42;
const BODY_STRUCTURAL_INSTABILITY_MAX_REGIONS = 2;
const BODY_STRUCTURAL_INSTABILITY_INTERVAL_MS = 6200;
const BODY_STRUCTURAL_INSTABILITY_DURATION = 0.58;
const BODY_STRUCTURAL_INSTABILITY_RADIUS = 58;
const BODY_STRUCTURAL_INSTABILITY_STRETCH = 0.18;
const BODY_STRUCTURAL_INSTABILITY_LAG_FRAMES = 4;
const BODY_STRUCTURAL_INSTABILITY_TREMBLE = 3.8;

// Detection controls.
const BODY_PRESENT_MIN_COVERAGE = 0.012;
const BODY_MISSING_RESET_AFTER_MS = 900;
const MASK_CONFIDENCE_THRESHOLD = 0.42;
const MASK_EDGE_SOFTNESS = 1.6;

// Mobile stability controls.
const MAX_RENDER_WIDTH = 640;
const MAX_RENDER_HEIGHT = 960;
const MAX_DEVICE_PIXEL_RATIO = 1.5;
const MASK_SAMPLE_SIZE = 88;

// -----------------------------------------------------------------------------
// PAGE ELEMENTS
// -----------------------------------------------------------------------------

const video = document.getElementById("camera");
const canvas = document.getElementById("renderCanvas");
const ctx = canvas.getContext("2d", { alpha: false });

const startPanel = document.getElementById("startPanel");
const landingCanvas = document.getElementById("landingCanvas");
const landingCtx = landingCanvas ? landingCanvas.getContext("2d") : null;
const landingTitle = document.getElementById("landingTitle");
const startButton = document.getElementById("startButton");
const startMessage = document.getElementById("startMessage");
const cameraChoiceButtons = Array.from(document.querySelectorAll("[data-camera-choice]"));
const statePanel = document.getElementById("statePanel");
const stageLabel = document.getElementById("stageLabel");
const bodyLabel = document.getElementById("bodyLabel");
const switchCameraButton = document.getElementById("switchCameraButton");

// Offscreen canvases keep the body mask and digital matter separate from the room.
const maskCanvas = document.createElement("canvas");
const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });

const bodyCanvas = document.createElement("canvas");
const bodyCtx = bodyCanvas.getContext("2d");

const deformedBodyCanvas = document.createElement("canvas");
const deformedBodyCtx = deformedBodyCanvas.getContext("2d");

const frameMemoryCanvases = Array.from({ length: BODY_FRAME_MEMORY_COUNT }, () => document.createElement("canvas"));
const frameMemoryContexts = frameMemoryCanvases.map((memoryCanvas) => memoryCanvas.getContext("2d"));

const sampleCanvas = document.createElement("canvas");
sampleCanvas.width = MASK_SAMPLE_SIZE;
sampleCanvas.height = MASK_SAMPLE_SIZE;
const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });

// -----------------------------------------------------------------------------
// RUNNING STATE
// -----------------------------------------------------------------------------

let segmenter = null;
let poseDetector = null;
let poseLoadFailed = false;
let poseStartedAt = 0;
let lastPoseSentAt = 0;
let latestPoseLandmarks = null;
let latestPoseScreenLandmarks = null;
let previousPoseScreenLandmarks = null;
let latestPoseBounds = null;
let latestPoseVisibleCount = 0;
let latestPoseMotionAmount = 0;
let lastPoseSeenAt = 0;
let frameMemoryIndex = 0;
let frameMemoryFilled = 0;
let lastFrameMemoryAt = 0;
let cameraStream = null;
let cameraFacingMode = CAMERA_FACING_MODE;
let isRunning = false;
let isSegmenting = false;

let bodyIsPresent = false;
let lastBodySeenAt = 0;
let transformationStartTime = 0;
let latestMaskPixels = null;
let latestMaskCoverage = 0;
let latestProgress = 0;
let manualStage = null;

let landingAnimationId = 0;
let landingTransitionStart = 0;
let landingIsTransitioning = false;
let landingHasStartedCamera = false;
let landingPointerX = -9999;
let landingPointerY = -9999;
let landingPointerActiveUntil = 0;
let landingLastFrameAt = 0;
let landingButtonDamage = 0;
let landingLastCrackAt = 0;
let landingLettersSeeded = false;
let landingCollapseOpened = false;
let landingSurfaceCollapseSeeded = false;
let landingCameraRevealStartTime = 0;
let landingRevealCompleted = false;
let landingFractureRayTarget = 0;
let landingFractureRaysCreated = 0;

const landingArtifacts = [];
const landingCracks = [];
const landingPressures = [];
const landingNegativeRays = [];
const landingSurfacePieces = [];
const landingBlackShellPieces = [];
const landingFragmentShards = [];
const landingLetterBodies = [];
const trailFragments = [];

const MANUAL_STAGE_PROGRESS = {
  1: 0.08,
  2: 0.28,
  3: 0.52,
  4: 0.76,
  5: 0.97
};


// MediaPipe Pose landmark numbers for the main body structure.
const POSE_LANDMARKS = {
  nose: 0,
  leftEyeInner: 1,
  leftEye: 2,
  leftEyeOuter: 3,
  rightEyeInner: 4,
  rightEye: 5,
  rightEyeOuter: 6,
  leftEar: 7,
  rightEar: 8,
  mouthLeft: 9,
  mouthRight: 10,
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28
};

const SKELETON_CONNECTIONS = [
  [POSE_LANDMARKS.leftShoulder, POSE_LANDMARKS.rightShoulder],
  [POSE_LANDMARKS.leftShoulder, POSE_LANDMARKS.leftElbow],
  [POSE_LANDMARKS.leftElbow, POSE_LANDMARKS.leftWrist],
  [POSE_LANDMARKS.rightShoulder, POSE_LANDMARKS.rightElbow],
  [POSE_LANDMARKS.rightElbow, POSE_LANDMARKS.rightWrist],
  [POSE_LANDMARKS.leftShoulder, POSE_LANDMARKS.leftHip],
  [POSE_LANDMARKS.rightShoulder, POSE_LANDMARKS.rightHip],
  [POSE_LANDMARKS.leftShoulder, POSE_LANDMARKS.rightHip],
  [POSE_LANDMARKS.rightShoulder, POSE_LANDMARKS.leftHip],
  [POSE_LANDMARKS.leftHip, POSE_LANDMARKS.rightHip],
  [POSE_LANDMARKS.leftHip, POSE_LANDMARKS.leftKnee],
  [POSE_LANDMARKS.leftKnee, POSE_LANDMARKS.leftAnkle],
  [POSE_LANDMARKS.rightHip, POSE_LANDMARKS.rightKnee],
  [POSE_LANDMARKS.rightKnee, POSE_LANDMARKS.rightAnkle],
  [POSE_LANDMARKS.nose, POSE_LANDMARKS.leftShoulder],
  [POSE_LANDMARKS.nose, POSE_LANDMARKS.rightShoulder]
];

const STRUCTURE_LANDMARKS = [
  POSE_LANDMARKS.nose,
  POSE_LANDMARKS.leftEye,
  POSE_LANDMARKS.rightEye,
  POSE_LANDMARKS.leftEar,
  POSE_LANDMARKS.rightEar,
  POSE_LANDMARKS.mouthLeft,
  POSE_LANDMARKS.mouthRight,
  POSE_LANDMARKS.leftShoulder,
  POSE_LANDMARKS.rightShoulder,
  POSE_LANDMARKS.leftElbow,
  POSE_LANDMARKS.rightElbow,
  POSE_LANDMARKS.leftWrist,
  POSE_LANDMARKS.rightWrist,
  POSE_LANDMARKS.leftHip,
  POSE_LANDMARKS.rightHip,
  POSE_LANDMARKS.leftKnee,
  POSE_LANDMARKS.rightKnee,
  POSE_LANDMARKS.leftAnkle,
  POSE_LANDMARKS.rightAnkle
];

// -----------------------------------------------------------------------------
// STARTUP
// -----------------------------------------------------------------------------

statePanel.hidden = !SHOW_STATUS_PANEL;
if (bodyLabel) bodyLabel.hidden = true;
setupLandingTitle();
setupCameraChoice();
resizeRenderer();
resizeLandingCanvas();
drawEmptyScreen();
startLandingAnimation();
updateStatusText("Waiting for presence...", "");

startButton.addEventListener("click", beginLandingTransition);
startButton.addEventListener("pointerenter", handleStartButtonTouch, { passive: true });
startButton.addEventListener("pointermove", handleStartButtonTouch, { passive: true });
startButton.addEventListener("pointerdown", handleStartButtonTouch, { passive: true });
startButton.addEventListener("pointerleave", clearStartButtonTouch, { passive: true });
switchCameraButton.addEventListener("click", switchCamera);
window.addEventListener("resize", handleViewportResize);
window.addEventListener("orientationchange", () => window.setTimeout(handleViewportResize, 250));
document.addEventListener("keydown", handleKeyboard);
startPanel.addEventListener("pointermove", handleLandingPointer, { passive: true });
startPanel.addEventListener("pointerdown", handleLandingPointer, { passive: true });
startPanel.addEventListener("pointerleave", clearLandingPointer, { passive: true });
document.addEventListener("touchmove", preventPageGesture, { passive: false });
document.addEventListener("gesturestart", preventPageGesture);

function handleViewportResize() {
  resizeRenderer();
  resizeLandingCanvas();
}

function preventPageGesture(event) {
  if (!isRunning) {
    event.preventDefault();
  }
}

function setupLandingTitle() {
  if (!landingTitle) return;

  const letters = landingTitle.querySelectorAll(".title-letter");
  letters.forEach((letter) => {
    letter.style.setProperty("--fail-x", "0px");
    letter.style.setProperty("--fail-y", "0px");
    letter.style.setProperty("--fail-r", "0deg");
    letter.style.setProperty("--fail-o", "0.9");
    letter.style.setProperty("--live-x", "0px");
    letter.style.setProperty("--live-y", "0px");
    letter.style.setProperty("--live-r", "0deg");
  });
}

function setupCameraChoice() {
  if (!cameraChoiceButtons.length) return;

  cameraChoiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectCameraFacingMode(button.dataset.cameraChoice || CAMERA_FACING_MODE);
    });
  });

  selectCameraFacingMode(cameraFacingMode);
}

function selectCameraFacingMode(facingMode) {
  cameraFacingMode = facingMode === "user" ? "user" : "environment";

  cameraChoiceButtons.forEach((button) => {
    const isSelected = button.dataset.cameraChoice === cameraFacingMode;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", isSelected ? "true" : "false");
  });
}

function resizeLandingCanvas() {
  if (!landingCanvas || !landingCtx) return;

  const width = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
  const height = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  const nextWidth = Math.round(width * pixelRatio);
  const nextHeight = Math.round(height * pixelRatio);

  if (landingCanvas.width === nextWidth && landingCanvas.height === nextHeight) return;

  landingCanvas.width = nextWidth;
  landingCanvas.height = nextHeight;
  landingCtx.imageSmoothingEnabled = false;
  landingLastFrameAt = 0;
  createLandingArtifacts();
}

function createLandingArtifacts() {
  landingArtifacts.length = 0;
  landingCracks.length = 0;
  landingPressures.length = 0;
  landingNegativeRays.length = 0;
  landingSurfacePieces.length = 0;
  landingBlackShellPieces.length = 0;
  landingFragmentShards.length = 0;
  landingLetterBodies.length = 0;
  landingLettersSeeded = false;
  landingCollapseOpened = false;
  landingSurfaceCollapseSeeded = false;
  landingCameraRevealStartTime = 0;
  landingRevealCompleted = false;
  landingFractureRayTarget = 0;
  landingFractureRaysCreated = 0;

  if (!landingCanvas) return;

  const pixelRatio = landingCanvas.width / Math.max(1, window.innerWidth || 1);

  for (let i = 0; i < LANDING_ARTIFACT_COUNT; i += 1) {
    const angle = hash1(i, 914) * Math.PI * 2;
    const isInvitation = i < LANDING_INVITATION_FRAGMENT_COUNT;
    const speed = (isInvitation ? lerp(1.2, 4.8, hash1(i, 915)) : lerp(2.2, 12, hash1(i, 915))) * LANDING_ARTIFACT_SPEED * pixelRatio;
    const margin = isInvitation ? 0.18 : 0;

    landingArtifacts.push({
      x: lerp(landingCanvas.width * margin, landingCanvas.width * (1 - margin), hash1(i, 911)),
      y: lerp(landingCanvas.height * margin, landingCanvas.height * (1 - margin), hash1(i, 912)),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: (isInvitation ? lerp(6, 25, hash1(i, 913)) : lerp(1, 4.6, hash1(i, 913))) * pixelRatio,
      length: (isInvitation ? lerp(14, 76, hash1(i, 916)) : lerp(10, 54, hash1(i, 916))) * pixelRatio,
      type: hash1(i, 917),
      seed: hash1(i, 918),
      mass: isInvitation ? lerp(4.5, 8.5, hash1(i, 919)) : lerp(0.85, 5.2, hash1(i, 919)),
      rotation: hash1(i, 920) * Math.PI * 2,
      rotationVelocity: isInvitation ? lerp(-0.035, 0.035, hash1(i, 921)) : lerp(-0.16, 0.16, hash1(i, 921)),
      damage: 0,
      invitation: isInvitation,
      active: true,
      spawnedAt: performance.now(),
      reappearsAt: 0,
      reactionCooldownUntil: 0,
      impactCooldown: 0
    });
  }
}

function startLandingAnimation() {
  if (!landingCanvas || !landingCtx || landingAnimationId) return;

  const draw = (now) => {
    drawLandingFrame(now);

    if (!startPanel.classList.contains("is-hidden")) {
      landingAnimationId = window.requestAnimationFrame(draw);
    } else {
      landingAnimationId = 0;
    }
  };

  landingAnimationId = window.requestAnimationFrame(draw);
}

function stopLandingAnimation() {
  if (!landingAnimationId) return;

  window.cancelAnimationFrame(landingAnimationId);
  landingAnimationId = 0;
}

function drawLandingFrame(now) {
  if (!landingCanvas || !landingCtx) return;

  const transitionProgress = landingIsTransitioning
    ? smoothstep(0, LANDING_TRANSITION_DURATION, now - landingTransitionStart)
    : 0;
  const dt = landingLastFrameAt ? Math.min(0.05, Math.max(0.001, (now - landingLastFrameAt) / 1000)) : 1 / 60;
  const pointerActive = now < landingPointerActiveUntil;
  const pixelRatio = landingCanvas.width / Math.max(1, window.innerWidth || 1);
  const pointerX = landingPointerX * pixelRatio;
  const pointerY = landingPointerY * pixelRatio;

  landingLastFrameAt = now;
  landingButtonDamage = Math.max(0, landingButtonDamage - dt * 0.38);

  updateStartOriginHoverRays(now);
  updateLandingPressures(now);
  updateLandingNegativeRays(now, transitionProgress, pixelRatio);
  updateLandingSurfacePieces(now, transitionProgress, pixelRatio);
  updateLandingFractureGeneration(now, transitionProgress, pixelRatio);
  updateLandingArtifacts(now, dt, transitionProgress, pixelRatio, pointerActive, pointerX, pointerY);
  updateLandingFragmentShards(now, dt);
  updateLandingLetterBodies(now, dt, transitionProgress, pixelRatio);
  resolveLandingArtifactCollisions(pixelRatio);
  pruneLandingCracks(now);

  landingCtx.clearRect(0, 0, landingCanvas.width, landingCanvas.height);

  if (landingCameraRevealStartTime) {
    drawLandingCameraReveal(now, pixelRatio);
    completeLandingCameraReveal(now);
    return;
  }

  drawLandingPressures(now, pixelRatio, transitionProgress);
  drawLandingNegativeRays(now, pixelRatio, transitionProgress);
  drawLandingCracks(now, pixelRatio, transitionProgress, true);
  drawLandingCollapseDarkness(now, pixelRatio, transitionProgress);
  drawLandingSurfacePieces(now, pixelRatio, transitionProgress);
  if (transitionProgress < LANDING_SINGULARITY_START) {
    drawLandingArtifacts(now, pixelRatio, transitionProgress);
    drawLandingFragmentShards(now, pixelRatio, transitionProgress);
  }
  drawLandingCracks(now, pixelRatio, transitionProgress, false);
  drawLandingSingularity(now, pixelRatio, transitionProgress);
  drawLandingCameraReveal(now, pixelRatio);
  completeLandingCameraReveal(now);

  if (!pointerActive && !landingIsTransitioning) {
    relaxLandingTitle();
  }
}

function updateLandingArtifacts(now, dt, transitionProgress, pixelRatio, pointerActive, pointerX, pointerY) {
  const width = landingCanvas.width;
  const height = landingCanvas.height;
  const maxDistance = Math.hypot(width, height);
  const collapseSource = getElementCanvasCenter(startButton) || { x: width * 0.5, y: height * 0.56 };
  const buttonRadius = LANDING_BUTTON_DAMAGE_RADIUS * pixelRatio;

  landingArtifacts.forEach((artifact, index) => {
    if (artifact.invitation && !artifact.active) {
      if (!landingIsTransitioning && now >= artifact.reappearsAt) {
        respawnLandingFragment(artifact, now, pixelRatio, width, height);
      }
      return;
    }

    const slowWave = now * 0.00012 * LANDING_ARTIFACT_SPEED + artifact.seed * 30;
    artifact.vx += Math.cos(slowWave) * 2.1 * pixelRatio * dt / artifact.mass;
    artifact.vy += Math.sin(slowWave * 0.8 + artifact.seed * 9) * 1.8 * pixelRatio * dt / artifact.mass;

    if (pointerActive) {
      applyLandingRepulsion(artifact, pointerX, pointerY, LANDING_POINTER_RADIUS * pixelRatio, LANDING_POINTER_FORCE * pixelRatio, dt);
    }

    if (landingButtonDamage > 0.001) {
      applyLandingRepulsion(artifact, collapseSource.x, collapseSource.y, buttonRadius, LANDING_POINTER_FORCE * 0.34 * pixelRatio * landingButtonDamage, dt);
    }

    if (transitionProgress > 0) {
      const dx = artifact.x - collapseSource.x;
      const dy = artifact.y - collapseSource.y;
      const distance = Math.hypot(dx, dy);
      const travellingCollapse = smoothstep(0, 1, transitionProgress * 1.22 - distance / maxDistance * 0.64);
      const force = LANDING_POINTER_FORCE * 1.2 * pixelRatio * travellingCollapse * LANDING_TRANSITION_INTENSITY;

      if (distance > 0.001) {
        artifact.vx += (dx / distance) * force * dt / artifact.mass;
        artifact.vy += (dy / distance) * force * dt / artifact.mass;
      }

      artifact.rotationVelocity += (hash1(index, 965) - 0.5) * travellingCollapse * dt * 1.25;
      artifact.damage = Math.max(artifact.damage, travellingCollapse * 0.82);
    }

    artifact.damage = Math.max(0, artifact.damage - dt * 0.22);
    artifact.rotation += artifact.rotationVelocity * dt;
    artifact.rotationVelocity *= Math.pow(0.986, dt * 60);
    artifact.vx *= Math.pow(0.99, dt * 60);
    artifact.vy *= Math.pow(0.99, dt * 60);
    artifact.x += artifact.vx * dt;
    artifact.y += artifact.vy * dt;
    artifact.impactCooldown = Math.max(0, artifact.impactCooldown - dt);

    bounceLandingArtifactFromEdges(artifact, now, pixelRatio, width, height);
  });
}

function applyLandingRepulsion(artifact, sourceX, sourceY, radius, force, dt) {
  const dx = artifact.x - sourceX;
  const dy = artifact.y - sourceY;
  const distance = Math.hypot(dx, dy);

  if (distance <= 0.001 || distance >= radius) return;

  const pressure = Math.pow(1 - distance / radius, 2.15);
  artifact.vx += (dx / distance) * force * pressure * dt / artifact.mass;
  artifact.vy += (dy / distance) * force * pressure * dt / artifact.mass;
  artifact.rotationVelocity += (hash1(Math.round(artifact.seed * 1000), 950) - 0.5) * pressure * dt * 1.7;
  artifact.damage = Math.max(artifact.damage, pressure * 0.62);
}

function respawnLandingFragment(artifact, now, pixelRatio, width, height) {
  const margin = 0.16;
  const seed = Math.random();
  const angle = seed * Math.PI * 2;

  artifact.x = lerp(width * margin, width * (1 - margin), Math.random());
  artifact.y = lerp(height * margin, height * (1 - margin), Math.random());
  artifact.vx = Math.cos(angle) * lerp(1.2, 4.6, Math.random()) * LANDING_ARTIFACT_SPEED * pixelRatio;
  artifact.vy = Math.sin(angle) * lerp(1.2, 4.6, Math.random()) * LANDING_ARTIFACT_SPEED * pixelRatio;
  artifact.rotationVelocity = lerp(-0.035, 0.035, Math.random());
  artifact.rotation = Math.random() * Math.PI * 2;
  artifact.damage = 0;
  artifact.active = true;
  artifact.spawnedAt = now;
  artifact.reappearsAt = 0;
  artifact.reactionCooldownUntil = now + 900;
}

function deactivateLandingFragment(artifact, now, delayMultiplier = 1) {
  artifact.active = false;
  artifact.damage = 0;
  artifact.reappearsAt = now + LANDING_FRAGMENT_REAPPEAR_DELAY * lerp(0.75, 1.5, Math.random()) * delayMultiplier;
  artifact.vx = 0;
  artifact.vy = 0;
  artifact.rotationVelocity = 0;
}

function reactToLandingFragment(artifact, now, pixelRatio, reason = "click") {
  if (!artifact.invitation || !artifact.active || landingIsTransitioning || now < artifact.reactionCooldownUntil) return false;

  const roll = Math.random();
  const isLarge = artifact.size > 17 * pixelRatio || artifact.length > 48 * pixelRatio;

  if (roll < 0.38) {
    shatterLandingFragment(artifact, now, pixelRatio, reason, isLarge ? 5 : 3);
  } else if (roll < 0.7) {
    absorbLandingFragment(artifact, now, pixelRatio);
  } else {
    splitLandingFragment(artifact, now, pixelRatio, isLarge ? 3 : 2);
  }

  deactivateLandingFragment(artifact, now, reason === "edge" ? 0.85 : 1);
  return true;
}

function shatterLandingFragment(artifact, now, pixelRatio, reason, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = reason === "edge" ? lerp(24, 92, Math.random()) : lerp(10, 54, Math.random());

    landingFragmentShards.push({
      type: "shatter",
      x: artifact.x,
      y: artifact.y,
      vx: Math.cos(angle) * speed * pixelRatio,
      vy: Math.sin(angle) * speed * pixelRatio,
      size: artifact.size * lerp(0.16, 0.34, Math.random()),
      rotation: artifact.rotation + Math.random(),
      spin: lerp(-1.2, 1.2, Math.random()),
      createdAt: now,
      life: LANDING_FRAGMENT_SHARD_LIFETIME * lerp(0.52, 1.05, Math.random()),
      tone: lerp(18, 78, Math.random()),
      alpha: lerp(0.045, 0.12, Math.random())
    });
  }
}

function absorbLandingFragment(artifact, now, pixelRatio) {
  const count = 2 + Math.floor(Math.random() * 3);

  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const distance = lerp(4, 26, Math.random()) * pixelRatio;

    landingFragmentShards.push({
      type: "absorb",
      x: artifact.x + Math.cos(angle) * distance,
      y: artifact.y + Math.sin(angle) * distance,
      targetX: artifact.x + (Math.random() - 0.5) * 5 * pixelRatio,
      targetY: artifact.y + (Math.random() - 0.5) * 5 * pixelRatio,
      vx: 0,
      vy: 0,
      size: artifact.size * lerp(0.12, 0.42, Math.random()),
      rotation: artifact.rotation + Math.random(),
      spin: lerp(-0.35, 0.35, Math.random()),
      createdAt: now,
      life: LANDING_FRAGMENT_SHARD_LIFETIME * lerp(0.6, 0.95, Math.random()),
      tone: lerp(8, 58, Math.random()),
      alpha: lerp(0.04, 0.1, Math.random())
    });
  }
}

function splitLandingFragment(artifact, now, pixelRatio, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = artifact.rotation + (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
    const speed = lerp(8, 32, Math.random()) * pixelRatio;

    landingFragmentShards.push({
      type: "split",
      x: artifact.x,
      y: artifact.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: artifact.size * lerp(0.34, 0.58, Math.random()),
      rotation: artifact.rotation + Math.random() * 0.5,
      spin: lerp(-0.5, 0.5, Math.random()),
      createdAt: now,
      life: LANDING_FRAGMENT_SHARD_LIFETIME * lerp(0.78, 1.25, Math.random()),
      tone: lerp(22, 72, Math.random()),
      alpha: lerp(0.05, 0.12, Math.random())
    });
  }
}

function resolveLandingArtifactCollisions(pixelRatio) {
  const limit = Math.min(landingArtifacts.length, 56);

  for (let i = 0; i < limit; i += 1) {
    const a = landingArtifacts[i];
    if (a.invitation && !a.active) continue;

    for (let j = i + 1; j < limit; j += 1) {
      const b = landingArtifacts[j];
      if (b.invitation && !b.active) continue;
      const minDistance = (a.size + b.size) * lerp(1.4, 2.8, Math.max(a.seed, b.seed));
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.hypot(dx, dy);

      if (distance <= 0.001 || distance >= minDistance) continue;

      const push = (minDistance - distance) * LANDING_COLLISION_STRENGTH;
      const nx = dx / distance;
      const ny = dy / distance;
      const aShare = b.mass / (a.mass + b.mass);
      const bShare = a.mass / (a.mass + b.mass);

      a.x -= nx * push * aShare;
      a.y -= ny * push * aShare;
      b.x += nx * push * bShare;
      b.y += ny * push * bShare;
      a.vx -= nx * push * 3.2 * pixelRatio * aShare;
      a.vy -= ny * push * 3.2 * pixelRatio * aShare;
      b.vx += nx * push * 3.2 * pixelRatio * bShare;
      b.vy += ny * push * 3.2 * pixelRatio * bShare;
      a.damage = Math.max(a.damage, 0.06);
      b.damage = Math.max(b.damage, 0.06);
    }
  }
}

function bounceLandingArtifactFromEdges(artifact, now, pixelRatio, width, height) {
  let impactX = null;
  let impactY = null;

  if (artifact.x < 0) {
    artifact.x = 0;
    artifact.vx = Math.abs(artifact.vx) * LANDING_EDGE_BOUNCE;
    impactX = 0;
    impactY = artifact.y;
  } else if (artifact.x > width) {
    artifact.x = width;
    artifact.vx = -Math.abs(artifact.vx) * LANDING_EDGE_BOUNCE;
    impactX = width;
    impactY = artifact.y;
  }

  if (artifact.y < 0) {
    artifact.y = 0;
    artifact.vy = Math.abs(artifact.vy) * LANDING_EDGE_BOUNCE;
    impactX = artifact.x;
    impactY = 0;
  } else if (artifact.y > height) {
    artifact.y = height;
    artifact.vy = -Math.abs(artifact.vy) * LANDING_EDGE_BOUNCE;
    impactX = artifact.x;
    impactY = height;
  }

  const impact = Math.hypot(artifact.vx, artifact.vy);
  const fractureIsAllowed = landingIsTransitioning || landingButtonDamage > 0.45;

  if (impactX !== null && impact > 34 * pixelRatio && artifact.impactCooldown <= 0) {
    if (artifact.invitation && !landingIsTransitioning) {
      const behavior = Math.random();

      if (behavior < 0.34) {
        reactToLandingFragment(artifact, now, pixelRatio, "edge");
        return;
      }

      if (behavior < 0.55) {
        deactivateLandingFragment(artifact, now, 0.9);
        return;
      }
    }

    artifact.damage = Math.max(artifact.damage, 0.18);

    if (fractureIsAllowed && Math.random() < 0.16) {
      const strength = lerp(0.16, 0.42, Math.min(1, impact / (230 * pixelRatio)));
      createLandingPressure(impactX, impactY, strength, now, 180, true);
    }

    artifact.impactCooldown = 1.05;
  }
}

function drawLandingArtifacts(now, pixelRatio, transitionProgress) {
  landingArtifacts.forEach((artifact, index) => {
    if (artifact.invitation && !artifact.active) return;

    const rebuild = 0.5 + 0.5 * Math.sin(now * 0.00022 * LANDING_ARTIFACT_SPEED + artifact.seed * 70);
    const damage = Math.max(artifact.damage, transitionProgress * 0.32);
    const invitationAlpha = artifact.invitation ? 0.045 + rebuild * 0.055 : 0;
    const appear = artifact.invitation ? smoothstep(0, 1400, now - artifact.spawnedAt) : 1;
    const alpha = artifact.invitation
      ? (invitationAlpha + damage * 0.08) * appear
      : LANDING_ARTIFACT_OPACITY * lerp(0.24, 1, rebuild) + damage * 0.11;
    const tone = artifact.invitation
      ? Math.round(lerp(28, 72, artifact.seed))
      : Math.round(lerp(14, 120, artifact.seed) * lerp(1, 0.5, transitionProgress));
    const size = artifact.size * lerp(0.78, 1.55, damage);

    landingCtx.save();
    landingCtx.translate(artifact.x, artifact.y);
    landingCtx.rotate(artifact.rotation);
    landingCtx.fillStyle = grey(tone, Math.min(artifact.invitation ? 0.16 : 0.4, alpha));
    landingCtx.strokeStyle = grey(tone, Math.min(artifact.invitation ? 0.1 : 0.28, alpha * 0.72));
    landingCtx.lineWidth = Math.max(1, pixelRatio * 0.7);

    if (artifact.type < 0.48) {
      landingCtx.fillRect(-size * 0.5, -size * 0.5, size, size);
    } else if (artifact.type < 0.76) {
      landingCtx.beginPath();
      landingCtx.moveTo(-artifact.length * 0.5 * lerp(0.2, 0.82, rebuild), 0);
      landingCtx.lineTo(artifact.length * 0.5 * lerp(0.35, 1, rebuild), (artifact.seed - 0.5) * 5 * pixelRatio);
      landingCtx.stroke();
    } else {
      makeLandingPolygonPath(landingCtx, 0, 0, size * (artifact.invitation ? 0.95 : 1.3), 3 + Math.floor(artifact.seed * 3), artifact.seed + now * 0.00003);
      landingCtx.fill();
      if (artifact.invitation) landingCtx.stroke();
    }

    if (damage > 0.36) {
      const splitCount = Math.floor(1 + damage * 2.2);

      for (let split = 0; split < splitCount; split += 1) {
        const splitSeed = hash2(index, split, 971);
        const angle = splitSeed * Math.PI * 2;
        const distance = size * lerp(1.2, 3.6, damage) * lerp(0.45, 1, hash2(index, split, 972));
        const splitSize = size * lerp(0.18, 0.38, hash2(index, split, 973));

        landingCtx.save();
        landingCtx.translate(Math.cos(angle) * distance, Math.sin(angle) * distance);
        landingCtx.rotate(-artifact.rotation * 0.55 + splitSeed * Math.PI);
        landingCtx.globalAlpha = Math.min(0.42, damage);
        landingCtx.fillRect(-splitSize * 0.5, -splitSize * 0.5, splitSize, splitSize * lerp(0.35, 1.25, splitSeed));
        landingCtx.restore();
      }
    }

    landingCtx.restore();
  });
}

function updateLandingFragmentShards(now, dt) {
  for (let i = landingFragmentShards.length - 1; i >= 0; i -= 1) {
    const shard = landingFragmentShards[i];
    const age = clamp((now - shard.createdAt) / shard.life, 0, 1);

    if (shard.type === "absorb") {
      const pull = smoothstep(0, 0.9, age);
      shard.x = lerp(shard.x, shard.targetX, 0.06 + pull * 0.18);
      shard.y = lerp(shard.y, shard.targetY, 0.06 + pull * 0.18);
      shard.size *= lerp(0.992, 0.95, pull);
    } else {
      const drag = shard.type === "split" ? 0.982 : 0.965;
      shard.vx *= Math.pow(drag, dt * 60);
      shard.vy *= Math.pow(drag, dt * 60);
      shard.x += shard.vx * dt;
      shard.y += shard.vy * dt;
    }

    shard.rotation += shard.spin * dt;

    if (age >= 1) landingFragmentShards.splice(i, 1);
  }

  while (landingFragmentShards.length > 24) {
    landingFragmentShards.shift();
  }
}

function drawLandingFragmentShards(now, pixelRatio, transitionProgress) {
  if (!landingFragmentShards.length || transitionProgress > 0) return;

  landingCtx.save();
  landingFragmentShards.forEach((shard) => {
    const age = clamp((now - shard.createdAt) / shard.life, 0, 1);
    const fade = smoothstep(0, 0.18, age) * (1 - smoothstep(0.62, 1, age));
    const size = shard.size * (shard.type === "absorb" ? lerp(1, 0.08, age) : lerp(1, 0.42, smoothstep(0.5, 1, age)));

    if (fade <= 0.001 || size <= 0.2) return;

    landingCtx.save();
    landingCtx.translate(shard.x, shard.y);
    landingCtx.rotate(shard.rotation);
    landingCtx.fillStyle = grey(shard.tone, shard.alpha * fade);
    makeLandingPolygonPath(landingCtx, 0, 0, size, shard.type === "split" ? 3 : 4, shard.rotation);
    landingCtx.fill();
    landingCtx.restore();
  });
  landingCtx.restore();
}

function makeLandingPolygonPath(targetCtx, x, y, radius, sides, rotation) {
  targetCtx.beginPath();

  for (let point = 0; point < sides; point += 1) {
    const angle = rotation + (point / sides) * Math.PI * 2;
    const px = x + Math.cos(angle) * radius * lerp(0.72, 1.18, hash2(point, sides, 930));
    const py = y + Math.sin(angle) * radius * lerp(0.72, 1.18, hash2(point, sides, 931));

    if (point === 0) targetCtx.moveTo(px, py);
    else targetCtx.lineTo(px, py);
  }

  targetCtx.closePath();
}

function updateLandingFractureGeneration(now, transitionProgress, pixelRatio) {
  if (!landingIsTransitioning) return;

  const interval = lerp(980, 540, transitionProgress);

  if (now - landingLastCrackAt < interval) return;

  const openMajorCrackCount = landingCracks.filter((crack) => crack.mode === "collapse").length;
  const pendingMajorCrackCount = landingPressures.filter((pressure) => pressure.mode === "collapse" && pressure.opens && !pressure.cracked).length;
  const majorCrackCount = openMajorCrackCount + pendingMajorCrackCount;
  if (majorCrackCount >= LANDING_MAJOR_CRACK_LIMIT) return;

  const origin = getLandingCollapseOrigin();
  if (!origin) return;

  landingLastCrackAt = now;

  const delay = majorCrackCount === 0 ? 260 : 130;
  const strength = lerp(0.58, 0.98, transitionProgress);
  createLandingPressure(origin.x, origin.y, strength, now, delay, true, "collapse", majorCrackCount);
}

function getLandingCollapseOrigin() {
  const buttonCenter = getElementCanvasCenter(startButton);

  if (buttonCenter) return buttonCenter;

  return {
    x: landingCanvas.width * 0.5,
    y: landingCanvas.height * 0.58
  };
}

function getActiveStartOriginHoverRay() {
  return landingPressures.find((pressure) => (
    pressure.mode === "start-ray"
    && pressure.directionIndex === 0
    && pressure.rays
    && pressure.rays.length > 0
    && !pressure.cracked
    && !pressure.releasedAt
  ));
}

function updateStartOriginHoverRays(now) {
  const center = getElementCanvasCenter(startButton);
  const hoverIntensity = getStartOriginHoverIntensity(now, center);
  const isHoveringStart = hoverIntensity > 0.04;
  const activeRay = getActiveStartOriginHoverRay();

  if (isHoveringStart && center) {
    if (activeRay) {
      activeRay.x = center.x;
      activeRay.y = center.y;
      activeRay.strength = lerp(0.22, 0.78, hoverIntensity);
      activeRay.hoverIntensity = hoverIntensity;
      activeRay.lastHoveredAt = now;
      if (hoverIntensity > 0.68 && activeRay.rays.length < 2 && now - activeRay.createdAt > 260) {
        activeRay.rays.push(createStartOriginRay(true, activeRay.rays.length));
      }
      return;
    }

    createLandingPressure(center.x, center.y, lerp(0.22, 0.78, hoverIntensity), now, 1500, false, "start-ray", 0);
    return;
  }

  landingPressures.forEach((pressure) => {
    if (pressure.mode === "start-ray" && !pressure.releasedAt) {
      pressure.releasedAt = now;
    }
  });
}

function getStartOriginHoverIntensity(now, center) {
  if (landingIsTransitioning || !center || !landingCanvas || now > landingPointerActiveUntil) return 0;

  const rect = getElementCanvasRect(startButton);
  if (!rect) return 0;

  const pixelRatio = landingCanvas.width / Math.max(1, window.innerWidth || 1);
  const pointerX = landingPointerX * pixelRatio;
  const pointerY = landingPointerY * pixelRatio;
  const distance = Math.hypot(pointerX - center.x, pointerY - center.y);
  const directRadius = Math.max(rect.width, rect.height) * 0.68 + 10 * pixelRatio;
  const approachRadius = Math.max(rect.width, rect.height) * 2.8 + 120 * pixelRatio;
  const proximity = 1 - smoothstep(directRadius, approachRadius, distance);

  return clamp(Math.max(startPanel.classList.contains("is-button-touched") ? 1 : 0, proximity), 0, 1);
}

function createStartOriginRay(isDirect, index = 0) {
  return {
    angle: Math.random() * Math.PI * 2,
    length: lerp(isDirect ? 138 : 86, isDirect ? 390 : 275, Math.random()) * (index === 0 ? 1 : lerp(0.42, 0.72, Math.random())),
    width: lerp(isDirect ? 12 : 8, isDirect ? 32 : 24, Math.random()),
    bend: lerp(-0.12, 0.12, Math.random()),
    delay: lerp(0, 0.12, Math.random()),
    seed: Math.random()
  };
}

function createLandingPressure(x, y, strength, now = performance.now(), delay = 340, opens = true, mode = "hover", directionIndex = null) {
  if (!landingCanvas) return;

  const isStartHoverRayOrigin = mode === "start-ray" && directionIndex === 0 && !landingIsTransitioning;
  const hoverIntensity = isStartHoverRayOrigin ? clamp((strength - 0.22) / 0.56, 0, 1) : 0;
  const rayRoll = Math.random();
  const rayCount = isStartHoverRayOrigin ? (rayRoll < (hoverIntensity > 0.68 ? 0.46 : 0.82) ? 1 : 2) : 0;
  const rays = Array.from({ length: rayCount }, (_, index) => createStartOriginRay(hoverIntensity > 0.68, index));

  landingPressures.push({
    x,
    y,
    strength: clamp(strength, 0.04, 1.2),
    createdAt: now,
    crackAt: now + delay,
    life: LANDING_PRESSURE_LIFETIME * lerp(0.9, 1.7, Math.random()),
    cracked: false,
    opens,
    mode,
    directionIndex,
    angle: Math.random() * Math.PI * 2,
    releasedAt: 0,
    lastHoveredAt: now,
    hoverIntensity,
    rays
  });

  while (landingPressures.length > 22) {
    landingPressures.shift();
  }
}
function updateLandingPressures(now) {
  for (let i = landingPressures.length - 1; i >= 0; i -= 1) {
    const pressure = landingPressures[i];

    if (pressure.mode === "start-ray") {
      if (pressure.releasedAt && now - pressure.releasedAt > 1100) {
        landingPressures.splice(i, 1);
      }
      continue;
    }

    const crackLimit = pressure.mode === "hover" ? LANDING_HOVER_CRACK_LIMIT : LANDING_MAJOR_CRACK_LIMIT;
    const activeCrackCount = landingCracks.filter((crack) => crack.mode === pressure.mode).length;

    if (pressure.opens && !pressure.cracked && now >= pressure.crackAt && activeCrackCount < crackLimit) {
      pressure.cracked = true;
      createLandingCrack(pressure.x, pressure.y, pressure.strength, now, pressure.mode, pressure.directionIndex);
    }

    if (now - pressure.createdAt > pressure.life) {
      landingPressures.splice(i, 1);
    }
  }
}
function drawLandingPressures(now, pixelRatio, transitionProgress) {
  landingCtx.save();

  landingPressures.forEach((pressure) => {
    const isStartOriginHoverPressure = pressure.mode === "start-ray" && pressure.directionIndex === 0 && !pressure.cracked;

    if (!isStartOriginHoverPressure || !pressure.rays.length) return;

    const ageMs = now - pressure.createdAt;
    const releaseFade = pressure.releasedAt ? 1 - smoothstep(0, 1100, now - pressure.releasedAt) : 1;
    const hoverIntensity = clamp(pressure.hoverIntensity || 0, 0, 1);
    const fade = smoothstep(0, 850, ageMs) * releaseFade;
    const sustainedPulse = 0.78 + Math.sin(now * 0.00105 + pressure.angle) * 0.22;
    const pressureAlpha = (0.021 + pressure.strength * 0.078) * fade * sustainedPulse * lerp(0.68, 1.1, hoverIntensity);

    pressure.rays.forEach((ray) => {
      const rayBuild = smoothstep(0, 760, ageMs - ray.delay * 1000);
      const shimmer = 0.82 + Math.sin(now * 0.0012 + ray.seed * 30) * 0.18;
      const lengthPulse = 0.86 + Math.sin(now * 0.00082 + ray.seed * 50) * lerp(0.08, 0.16, hoverIntensity);
      const length = ray.length * pixelRatio * rayBuild * lengthPulse * lerp(0.78, 1.08, hoverIntensity);
      const width = ray.width * pixelRatio * lerp(0.58, 1.12, hoverIntensity) * lerp(0.55, 1, rayBuild);
      const angle = ray.angle + Math.sin(now * 0.00072 + ray.seed * 6) * ray.bend;
      const endX = pressure.x + Math.cos(angle) * length;
      const endY = pressure.y + Math.sin(angle) * length;
      const sideX = Math.cos(angle + Math.PI * 0.5);
      const sideY = Math.sin(angle + Math.PI * 0.5);
      const alpha = pressureAlpha * shimmer;
      const gradient = landingCtx.createLinearGradient(pressure.x, pressure.y, endX, endY);

      if (alpha <= 0.001 || length <= 1) return;

      gradient.addColorStop(0, grey(0, alpha * lerp(0.54, 0.82, hoverIntensity)));
      gradient.addColorStop(0.38, grey(0, alpha * lerp(0.34, 0.56, hoverIntensity)));
      gradient.addColorStop(1, grey(0, 0));
      landingCtx.fillStyle = gradient;
      landingCtx.beginPath();
      landingCtx.moveTo(pressure.x + sideX * width * 0.06, pressure.y + sideY * width * 0.06);
      landingCtx.quadraticCurveTo(
        pressure.x + Math.cos(angle + ray.bend) * length * 0.52 + sideX * width * 0.22,
        pressure.y + Math.sin(angle + ray.bend) * length * 0.52 + sideY * width * 0.22,
        endX + sideX * width,
        endY + sideY * width
      );
      landingCtx.lineTo(endX - sideX * width, endY - sideY * width);
      landingCtx.quadraticCurveTo(
        pressure.x + Math.cos(angle - ray.bend) * length * 0.48 - sideX * width * 0.18,
        pressure.y + Math.sin(angle - ray.bend) * length * 0.48 - sideY * width * 0.18,
        pressure.x - sideX * width * 0.06,
        pressure.y - sideY * width * 0.06
      );
      landingCtx.closePath();
      landingCtx.fill();
    });
  });

  landingCtx.restore();
}

function createLandingCrack(x, y, strength, now = performance.now(), mode = "hover", directionIndex = null) {
  if (!landingCanvas) return;

  const safeStrength = clamp(strength, 0.05, 1.2);
  const branchCount = 1;
  const branches = [];
  const baseAngle = getStructuralCrackAngle(x, y, mode, directionIndex);
  const pixelRatio = landingCanvas.width / Math.max(1, window.innerWidth || 1);

  for (let i = 0; i < branchCount; i += 1) {
    const branchAngle = baseAngle + (mode === "collapse" ? 0 : (Math.random() - 0.5) * 0.42);
    const edgeLength = distanceToCanvasEdge(x, y, branchAngle);
    const length = mode === "collapse"
      ? edgeLength * lerp(1.04, 1.18, Math.random())
      : lerp(80, 190, Math.random()) * lerp(0.72, 1.38, safeStrength) * pixelRatio;
    const segments = mode === "collapse" ? 10 + Math.floor(Math.random() * 5) : 5 + Math.floor(Math.random() * 3);
    const baseWidth = lerp(2.0, 12, Math.random()) * safeStrength * LANDING_CRACK_DEPTH * pixelRatio;
    const points = [];

    for (let point = 0; point <= segments; point += 1) {
      const t = point / segments;
      const taper = Math.pow(Math.sin(t * Math.PI), 0.78);
      const lump = lerp(0.34, 2.2, hash2(i, point, 934));
      const suddenNarrow = hash2(i, point, 935) < 0.3 ? 0.22 : 1;
      const sideways = (hash2(i, point, 936) - 0.5) * length * 0.09 * Math.pow(t, 0.9);
      const pressureBend = Math.sin(t * Math.PI) * (hash2(i, point, 937) - 0.5) * length * 0.08;
      const centerX = Math.cos(branchAngle) * length * t + Math.cos(branchAngle + Math.PI * 0.5) * (sideways + pressureBend);
      const centerY = Math.sin(branchAngle) * length * t + Math.sin(branchAngle + Math.PI * 0.5) * (sideways + pressureBend);

      points.push({
        x: centerX,
        y: centerY,
        width: Math.max(0.06 * pixelRatio, baseWidth * taper * lump * suddenNarrow),
        chipA: (hash2(i, point, 938) - 0.5) * baseWidth * LANDING_CRACK_CHIP,
        chipB: (hash2(i, point, 939) - 0.5) * baseWidth * LANDING_CRACK_CHIP,
        seed: hash2(i, point, 940)
      });
    }

    branches.push({
      points,
      delay: Math.random() * 0.16,
      seed: hash2(i, safeStrength, 941),
      tone: lerp(0, 24, Math.random())
    });
  }

  landingCracks.push({
    x,
    y,
    strength: safeStrength,
    createdAt: now,
    life: mode === "collapse" ? 999999 : LANDING_CRACK_LIFETIME * lerp(1.1, 1.9, Math.random()),
    mode,
    directionIndex,
    seed: Math.random(),
    branches
  });

  if (mode === "collapse") {
    landingCollapseOpened = true;
    seedLandingSurfacePieces(x, y, safeStrength, now);
  }

  while (landingCracks.length > LANDING_MAJOR_CRACK_LIMIT) {
    const removableIndex = landingCracks.findIndex((crack) => crack.mode !== "collapse");
    landingCracks.splice(removableIndex >= 0 ? removableIndex : 0, 1);
  }
}

function getStructuralCrackAngle(x, y, mode, directionIndex = 0) {
  if (mode === "collapse") {
    const directions = [
      -Math.PI * 0.82,
      -Math.PI * 0.48,
      -Math.PI * 0.08,
      Math.PI * 0.34,
      Math.PI * 0.76
    ];
    const index = Number.isFinite(directionIndex) ? directionIndex : 0;
    return directions[index % directions.length] + (hash1(index, 994) - 0.5) * 0.18;
  }

  return Math.random() * Math.PI * 2;
}

function distanceToCanvasEdge(x, y, angle) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const distances = [];

  if (Math.abs(dx) > 0.0001) {
    distances.push(((dx > 0 ? landingCanvas.width : 0) - x) / dx);
  }

  if (Math.abs(dy) > 0.0001) {
    distances.push(((dy > 0 ? landingCanvas.height : 0) - y) / dy);
  }

  return Math.max(1, Math.min(...distances.filter((distance) => distance > 0)));
}

function drawLandingCracks(now, pixelRatio, transitionProgress, shadowPass) {
  if (shadowPass) return;

  landingCtx.save();
  landingCtx.lineCap = "butt";
  landingCtx.lineJoin = "miter";

  landingCracks.forEach((crack) => {
    const ageRatio = clamp((now - crack.createdAt) / crack.life, 0, 1);
    const fade = crack.mode === "collapse" ? 1 : 1 - smoothstep(0.82, 1, ageRatio);
    const livingPulse = 0.9 + Math.sin(now * LANDING_CRACK_BREATHING_SPEED + crack.seed * Math.PI * 2) * 0.1;
    const baseAlpha = fade * livingPulse * (0.085 + crack.strength * 0.38 + transitionProgress * 0.12);

    crack.branches.forEach((branch, branchIndex) => {
      const growth = smoothstep(branch.delay, 1, ageRatio * (crack.mode === "collapse" ? 0.18 : 1.25) + transitionProgress * (crack.mode === "collapse" ? 1.14 : 0.62));
      if (growth <= 0.001) return;

      const visiblePoints = Math.max(2, Math.ceil(branch.points.length * growth));
      const points = branch.points.slice(0, visiblePoints);

      drawLandingCrackShape(crack, branch, points, now, Math.min(0.9, baseAlpha * 1.34), 1.0);
      drawLandingCrackInterior(crack, branch, points, now, baseAlpha, transitionProgress);
      drawLandingCrackFragments(crack, branch, points, branchIndex, ageRatio, baseAlpha, pixelRatio);
    });
  });

  landingCtx.restore();
}

function drawLandingCrackShape(crack, branch, points, now, alpha, widthScale) {
  if (points.length < 2) return;

  const edges = buildLandingCrackEdges(points, widthScale, now, branch.seed);
  landingCtx.beginPath();
  landingCtx.moveTo(crack.x + edges.left[0].x, crack.y + edges.left[0].y);

  for (let i = 1; i < edges.left.length; i += 1) {
    landingCtx.lineTo(crack.x + edges.left[i].x, crack.y + edges.left[i].y);
  }

  for (let i = edges.right.length - 1; i >= 0; i -= 1) {
    landingCtx.lineTo(crack.x + edges.right[i].x, crack.y + edges.right[i].y);
  }

  landingCtx.closePath();
  landingCtx.fillStyle = grey(0, alpha * 0.9);
  landingCtx.fill();
}

function drawLandingCrackInterior(crack, branch, points, now, alpha, transitionProgress) {
  // Circular pressure glows were removed so fractures keep one visual language:
  // carved openings, hard fragments, and rare black rays.
}
function buildLandingCrackEdges(points, widthScale, now, seed) {
  const left = [];
  const right = [];

  points.forEach((point, index) => {
    const previous = points[Math.max(0, index - 1)];
    const next = points[Math.min(points.length - 1, index + 1)];
    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    const length = Math.max(0.001, Math.hypot(dx, dy));
    const normalX = -dy / length;
    const normalY = dx / length;
    const breathe = 0.88 + Math.sin(now * LANDING_CRACK_BREATHING_SPEED * 1.5 + seed * 20 + index * 1.9) * 0.12;
    const halfWidth = point.width * widthScale * breathe;
    const chipA = point.chipA * widthScale * 0.4;
    const chipB = point.chipB * widthScale * 0.4;

    left.push({
      x: point.x + normalX * (halfWidth + chipA),
      y: point.y + normalY * (halfWidth + chipA)
    });
    right.push({
      x: point.x - normalX * (halfWidth + chipB),
      y: point.y - normalY * (halfWidth + chipB)
    });
  });

  return { left, right };
}

function drawLandingCrackDepth(crack, branch, points, now, alpha, transitionProgress) {
  // Depth is now implied by the fracture shape and black rays, not circular
  // radial glows.
}

function drawLandingCrackFragments(crack, branch, points, branchIndex, ageRatio, alpha, pixelRatio) {
  if (ageRatio < 0.18 || points.length < 3) return;

  const count = Math.min(3, Math.floor(points.length * 0.32));
  landingCtx.fillStyle = grey(0, alpha * 0.26);

  for (let i = 0; i < count; i += 1) {
    const seed = hash2(branchIndex, i, 981);
    if (seed > 0.22 + ageRatio * 0.18) continue;

    const point = points[1 + Math.floor(seed * (points.length - 2))];
    const drift = smoothstep(0.18, 0.78, ageRatio) * lerp(2, 10, hash2(branchIndex, i, 982)) * pixelRatio;
    const angle = hash2(branchIndex, i, 983) * Math.PI * 2;
    const size = Math.max(pixelRatio, point.width * lerp(0.08, 0.22, hash2(branchIndex, i, 984)));

    landingCtx.save();
    landingCtx.translate(crack.x + point.x + Math.cos(angle) * drift, crack.y + point.y + Math.sin(angle) * drift);
    landingCtx.rotate(angle + ageRatio * 0.5);
    landingCtx.fillRect(-size * 0.5, -size * 0.5, size, size * lerp(0.3, 1, seed));
    landingCtx.restore();
  }
}

function pruneLandingCracks(now) {
  for (let i = landingCracks.length - 1; i >= 0; i -= 1) {
    const crack = landingCracks[i];
    if (crack.mode !== "collapse" && now - crack.createdAt > crack.life) {
      landingCracks.splice(i, 1);
    }
  }
}

function updateLandingNegativeRays(now, transitionProgress, pixelRatio) {
  if (!landingCollapseOpened || transitionProgress < 0.1) return;
  if (!landingFractureRayTarget) landingFractureRayTarget = 3 + Math.floor(Math.random() * 4);

  const remainingRays = landingFractureRayTarget - landingFractureRaysCreated;
  const progressPressure = smoothstep(0.1, 0.92, transitionProgress);
  const neededPressure = remainingRays / Math.max(1, landingFractureRayTarget);
  const chance = LANDING_NEGATIVE_RAY_CHANCE * 0.018 * progressPressure * lerp(0.55, 1.65, neededPressure);

  if (remainingRays > 0 && landingNegativeRays.length < 3 && Math.random() < chance) {
    const collapseCracks = landingCracks.filter((crack) => crack.mode === "collapse");
    const crack = collapseCracks[Math.floor(Math.random() * collapseCracks.length)];
    if (crack && createLandingNegativeRayFromCrack(crack, now, pixelRatio, false, transitionProgress)) {
      landingFractureRaysCreated += 1;
    }
  }

  for (let i = landingNegativeRays.length - 1; i >= 0; i -= 1) {
    if (now - landingNegativeRays[i].createdAt > landingNegativeRays[i].life) {
      landingNegativeRays.splice(i, 1);
    }
  }
}

function getVisibleLandingCrackPoints(crack, branch, now, transitionProgress) {
  const ageRatio = clamp((now - crack.createdAt) / crack.life, 0, 1);
  const growth = smoothstep(
    branch.delay,
    1,
    ageRatio * (crack.mode === "collapse" ? 0.18 : 1.25) + transitionProgress * (crack.mode === "collapse" ? 1.14 : 0.62)
  );

  if (growth <= 0.001) return [];

  const visiblePoints = Math.max(2, Math.ceil(branch.points.length * growth));
  return branch.points.slice(0, visiblePoints);
}

function createLandingNegativeRayFromCrack(crack, now, pixelRatio, forceLong, transitionProgress) {
  if (!crack || !crack.branches.length) return false;

  const visibleBranches = crack.branches
    .map((branch) => ({ branch, points: getVisibleLandingCrackPoints(crack, branch, now, transitionProgress) }))
    .filter((entry) => entry.points.length > 2);

  if (!visibleBranches.length) return false;

  const visibleBranch = visibleBranches[Math.floor(Math.random() * visibleBranches.length)];
  const point = visibleBranch.points[Math.floor(lerp(1, visibleBranch.points.length - 1, Math.random()))];
  const startX = crack.x + point.x;
  const startY = crack.y + point.y;
  const centerX = landingCanvas.width * 0.5;
  const centerY = landingCanvas.height * 0.5;
  const outward = Math.atan2(startY - centerY, startX - centerX);
  const angle = outward + (Math.random() - 0.5) * 0.9;
  const edgeDistance = distanceToCanvasEdge(startX, startY, angle);

  landingNegativeRays.push({
    x: startX,
    y: startY,
    angle,
    length: edgeDistance * (forceLong ? lerp(0.72, 1.12, Math.random()) : lerp(0.42, 1.06, Math.random())),
    width: lerp(30, 116, Math.random()) * pixelRatio,
    bend: (Math.random() - 0.5) * 0.16,
    createdAt: now,
    life: lerp(2200, 4800, Math.random()),
    seed: Math.random()
  });

  return true;
}

function drawLandingNegativeRays(now, pixelRatio, transitionProgress) {
  if (!landingNegativeRays.length) return;

  landingCtx.save();
  landingNegativeRays.forEach((ray) => {
    const age = clamp((now - ray.createdAt) / ray.life, 0, 1);
    const fade = smoothstep(0, 0.16, age) * (1 - smoothstep(0.68, 1, age));
    const flicker = 0.76 + Math.sin(now * 0.0017 + ray.seed * 20) * 0.24;
    const length = ray.length * lerp(0.18, 1, smoothstep(0, 0.48, age));
    const angle = ray.angle + Math.sin(age * Math.PI * 2 + ray.seed) * ray.bend;
    const endX = ray.x + Math.cos(angle) * length;
    const endY = ray.y + Math.sin(angle) * length;
    const sideX = Math.cos(angle + Math.PI * 0.5);
    const sideY = Math.sin(angle + Math.PI * 0.5);
    const opening = smoothstep(0, 0.55, age);
    const startWidth = Math.max(pixelRatio * 0.45, ray.width * 0.018);
    const endWidth = ray.width * lerp(0.26, 0.82, opening);
    const gradient = landingCtx.createLinearGradient(ray.x, ray.y, endX, endY);
    const alpha = 0.2 * fade * flicker * smoothstep(0.08, 1, transitionProgress);

    gradient.addColorStop(0, grey(0, alpha));
    gradient.addColorStop(0.42, grey(0, alpha * 0.38));
    gradient.addColorStop(1, grey(0, 0));
    landingCtx.fillStyle = gradient;
    landingCtx.beginPath();
    landingCtx.moveTo(ray.x + sideX * startWidth, ray.y + sideY * startWidth);
    landingCtx.quadraticCurveTo(
      ray.x + Math.cos(angle + ray.bend) * length * 0.5 + sideX * endWidth * 0.22,
      ray.y + Math.sin(angle + ray.bend) * length * 0.5 + sideY * endWidth * 0.22,
      endX + sideX * endWidth,
      endY + sideY * endWidth
    );
    landingCtx.lineTo(endX - sideX * endWidth, endY - sideY * endWidth);
    landingCtx.quadraticCurveTo(
      ray.x + Math.cos(angle - ray.bend) * length * 0.48 - sideX * endWidth * 0.2,
      ray.y + Math.sin(angle - ray.bend) * length * 0.48 - sideY * endWidth * 0.2,
      ray.x - sideX * startWidth,
      ray.y - sideY * startWidth
    );
    landingCtx.closePath();
    landingCtx.fill();
  });
  landingCtx.restore();
}

function seedLandingSurfacePieces(x, y, strength, now) {
  if (landingSurfacePieces.length > 48) return;

  for (let i = 0; i < 5; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    landingSurfacePieces.push({
      x,
      y,
      vx: Math.cos(angle) * lerp(12, 42, Math.random()) * strength,
      vy: Math.sin(angle) * lerp(12, 42, Math.random()) * strength,
      size: lerp(12, 48, Math.random()) * strength,
      rotation: Math.random() * Math.PI * 2,
      spin: lerp(-0.6, 0.6, Math.random()),
      createdAt: now,
      life: 3200 + Math.random() * 2200,
      alpha: lerp(0.018, 0.055, Math.random()),
      tone: lerp(228, 246, Math.random()),
      final: false
    });
  }
}

function seedLandingFinalSurfaceCollapse(now) {
  const collapseCracks = landingCracks.filter((crack) => crack.mode === "collapse");
  if (!collapseCracks.length) return;

  for (let i = 0; i < LANDING_SURFACE_FRAGMENT_AMOUNT; i += 1) {
    const x = Math.random() * landingCanvas.width;
    const y = Math.random() * landingCanvas.height;
    landingSurfacePieces.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      size: lerp(10, 96, Math.random()),
      rotation: Math.random() * Math.PI * 2,
      spin: lerp(-0.32, 0.32, Math.random()),
      createdAt: now + Math.random() * 520,
      life: 3800 + Math.random() * 2800,
      alpha: lerp(0.065, 0.18, Math.random()),
      tone: lerp(220, 246, Math.random()),
      final: true
    });
  }
}

function updateLandingSurfacePieces(now, transitionProgress, pixelRatio) {
  if (landingCollapseOpened && !landingSurfaceCollapseSeeded && transitionProgress > LANDING_FINAL_COLLAPSE_START) {
    landingSurfaceCollapseSeeded = true;
    seedLandingFinalSurfaceCollapse(now);
  }

  if (!landingSurfacePieces.length) return;

  const pull = LANDING_COLLAPSE_PULL_STRENGTH * smoothstep(LANDING_FINAL_COLLAPSE_START, 1, transitionProgress);
  const singularityPull = smoothstep(LANDING_SINGULARITY_START, LANDING_SINGULARITY_HOLD_START, transitionProgress);
  const singularity = getLandingSingularityPoint(pixelRatio);

  for (let i = landingSurfacePieces.length - 1; i >= 0; i -= 1) {
    const piece = landingSurfacePieces[i];
    const age = clamp((now - piece.createdAt) / piece.life, 0, 1);
    const targetPoint = singularityPull > 0.001
      ? singularity
      : getNearestCollapseOpening(piece.x, piece.y) || landingCracks[0];

    if (targetPoint && pull > 0 && now >= piece.createdAt) {
      const dx = targetPoint.x - piece.x;
      const dy = targetPoint.y - piece.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const piecePull = pull * (piece.final ? lerp(112, 260, singularityPull) : lerp(42, 130, singularityPull));
      piece.vx += (dx / distance) * piecePull;
      piece.vy += (dy / distance) * piecePull;
    }

    if (now >= piece.createdAt) {
      if (singularityPull > 0.001) {
        const compression = lerp(0.055, 0.24, singularityPull);
        piece.vx *= lerp(0.88, 0.34, singularityPull);
        piece.vy *= lerp(0.88, 0.34, singularityPull);
        piece.x = lerp(piece.x + piece.vx * 0.012, singularity.x, compression);
        piece.y = lerp(piece.y + piece.vy * 0.012, singularity.y, compression);
        piece.size *= lerp(0.992, 0.94, singularityPull);

        if (Math.hypot(piece.x - singularity.x, piece.y - singularity.y) < 3 * pixelRatio || singularityPull > 0.985) {
          piece.x = singularity.x;
          piece.y = singularity.y;
          piece.vx = 0;
          piece.vy = 0;
          piece.spin = 0;
          piece.absorbed = true;
        }
      } else {
        piece.x += piece.vx * 0.016;
        piece.y += piece.vy * 0.016;
      }

      piece.rotation += piece.spin * 0.016 * (1 - singularityPull);
    }

    if (age >= 1 && singularityPull < 0.92) landingSurfacePieces.splice(i, 1);
  }
}

function getLandingSingularityPoint(pixelRatio) {
  return getElementCanvasCenter(startButton) || {
    x: landingCanvas.width * 0.5,
    y: landingCanvas.height * 0.58
  };
}

function getNearestCollapseOpening(x, y) {
  let nearest = null;
  let nearestDistance = Infinity;

  landingCracks.forEach((crack) => {
    if (crack.mode !== "collapse") return;

    const distance = Math.hypot(crack.x - x, crack.y - y);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = crack;
    }
  });

  return nearest;
}

function drawLandingSurfacePieces(now, pixelRatio, transitionProgress) {
  if (!landingSurfacePieces.length || transitionProgress < LANDING_FINAL_COLLAPSE_START) return;

  const singularityPull = smoothstep(LANDING_SINGULARITY_START, LANDING_SINGULARITY_HOLD_START, transitionProgress);
  landingCtx.save();
  landingSurfacePieces.forEach((piece) => {
    if (now < piece.createdAt || piece.absorbed) return;

    const age = clamp((now - piece.createdAt) / piece.life, 0, 1);
    const compressionFade = 1 - smoothstep(0.72, 1, singularityPull);
    const alpha = piece.alpha * smoothstep(LANDING_FINAL_COLLAPSE_START, 0.9, transitionProgress) * (1 - smoothstep(0.78, 1, age)) * compressionFade;
    const compressedSize = piece.size * pixelRatio * lerp(1, 0.12, singularityPull);

    if (alpha <= 0.001 || compressedSize <= 0.2) return;

    landingCtx.fillStyle = grey(piece.tone, alpha);
    landingCtx.save();
    landingCtx.translate(piece.x, piece.y);
    landingCtx.rotate(piece.rotation);
    makeLandingPolygonPath(landingCtx, 0, 0, compressedSize, 4, piece.rotation);
    landingCtx.fill();
    landingCtx.restore();
  });
  landingCtx.restore();
}
function drawLandingCollapseDarkness(now, pixelRatio, transitionProgress) {
  const collapseAmount = smoothstep(LANDING_FINAL_COLLAPSE_START, 1, transitionProgress);
  if (collapseAmount <= 0.001) return;

  landingCtx.save();

  const finalDarkness = smoothstep(LANDING_FINAL_DARKNESS_START, 1, transitionProgress) * LANDING_FINAL_DARKNESS;
  if (finalDarkness > 0.001) {
    landingCtx.fillStyle = grey(0, finalDarkness);
    landingCtx.fillRect(0, 0, landingCanvas.width, landingCanvas.height);
  }

  landingCtx.restore();
}

function drawLandingSingularity(now, pixelRatio, transitionProgress) {
  if (transitionProgress < LANDING_SINGULARITY_START) return;
  if (landingCameraRevealStartTime) return;

  const compression = smoothstep(LANDING_SINGULARITY_START, LANDING_SINGULARITY_HOLD_START, transitionProgress);

  // The last part of the collapse becomes almost still: the surface is no
  // longer falling apart. It resolves into full black without showing a
  // waiting point before the camera is ready behind the fractured shell.
  if (compression > 0.001) {
    landingCtx.save();
    landingCtx.fillStyle = grey(0, 0.985 * compression);
    landingCtx.fillRect(0, 0, landingCanvas.width, landingCanvas.height);
    landingCtx.restore();
  }
}

function seedLandingBlackShellPieces(pixelRatio) {
  landingBlackShellPieces.length = 0;

  const width = landingCanvas.width;
  const height = landingCanvas.height;
  const origin = getLandingSingularityPoint(pixelRatio);
  const maxDistance = Math.hypot(
    Math.max(origin.x, width - origin.x),
    Math.max(origin.y, height - origin.y)
  );

  const shardCount = 5 + Math.floor(Math.random() * 2);

  for (let index = 0; index < shardCount; index += 1) {
    const seed = hash1(index, 1260) + Math.random() * 0.18;
    const angle = (index / shardCount) * Math.PI * 2 + lerp(-0.42, 0.42, Math.random());
    const distance = lerp(maxDistance * 0.08, maxDistance * 0.48, Math.pow(Math.random(), 0.72));
    const x = origin.x + Math.cos(angle) * distance;
    const y = origin.y + Math.sin(angle) * distance * 0.78;
    const radial = clamp(Math.hypot(x - origin.x, y - origin.y) / Math.max(1, maxDistance), 0, 1);
    const halfWidth = lerp(width * 0.18, width * 0.42, Math.random());
    const halfHeight = lerp(height * 0.12, height * 0.34, Math.random());

    landingBlackShellPieces.push({
      x,
      y,
      rotation: lerp(-0.32, 0.32, Math.random()),
      driftX: lerp(-10, 10, Math.random()) * pixelRatio,
      driftY: lerp(-8, 12, Math.random()) * pixelRatio,
      refractX: lerp(-10, 10, Math.random()) * pixelRatio,
      refractY: lerp(-7, 7, Math.random()) * pixelRatio,
      ghostX: lerp(-4, 4, Math.random()) * pixelRatio,
      ghostY: lerp(-4, 4, Math.random()) * pixelRatio,
      fadeStart: lerp(0.26, 0.46, Math.random()) + radial * 0.34,
      fadeEnd: lerp(0.68, 0.92, Math.random()) + radial * 0.16,
      seed,
      points: createFinalBlackShardPoints(halfWidth, halfHeight, index)
    });
  }
}

function createFinalBlackShardPoints(halfWidth, halfHeight, index) {
  const sides = 4 + Math.floor(hash1(index, 1270) * 3);
  const points = [];

  for (let point = 0; point < sides; point += 1) {
    const angle = (point / sides) * Math.PI * 2 + (hash2(index, point, 1271) - 0.5) * 0.5;
    const radiusX = halfWidth * lerp(0.62, 1.22, hash2(index, point, 1272));
    const radiusY = halfHeight * lerp(0.64, 1.2, hash2(index, point, 1273));

    points.push({
      x: Math.cos(angle) * radiusX,
      y: Math.sin(angle) * radiusY
    });
  }

  return points;
}

function createLandingBlackShellPiecePoints(halfWidth, halfHeight, column, row, shape) {
  const skew = (hash2(column, row, 1234) - 0.5) * halfWidth * 0.42;
  const chip = Math.min(halfWidth, halfHeight) * 0.18;

  if (shape === "rectangle") {
    return [
      { x: -halfWidth, y: -halfHeight },
      { x: halfWidth, y: -halfHeight },
      { x: halfWidth, y: halfHeight },
      { x: -halfWidth, y: halfHeight }
    ];
  }

  if (shape === "triangle") {
    return [
      { x: -halfWidth * lerp(0.92, 1.28, hash2(column, row, 1235)), y: halfHeight },
      { x: halfWidth, y: halfHeight * lerp(0.62, 1.08, hash2(column, row, 1236)) },
      { x: lerp(-halfWidth * 0.45, halfWidth * 0.45, hash2(column, row, 1237)), y: -halfHeight * lerp(1.05, 1.55, hash2(column, row, 1238)) }
    ];
  }

  if (shape === "trapezoid") {
    const topInset = halfWidth * lerp(0.16, 0.48, hash2(column, row, 1239));
    const bottomInset = halfWidth * lerp(0.02, 0.2, hash2(column, row, 1240));

    return [
      { x: -halfWidth + topInset + skew * 0.2, y: -halfHeight },
      { x: halfWidth - topInset + skew * 0.2, y: -halfHeight },
      { x: halfWidth - bottomInset - skew * 0.18, y: halfHeight },
      { x: -halfWidth + bottomInset - skew * 0.18, y: halfHeight }
    ];
  }

  if (shape === "parallelogram") {
    return [
      { x: -halfWidth + skew, y: -halfHeight },
      { x: halfWidth + skew, y: -halfHeight },
      { x: halfWidth - skew, y: halfHeight },
      { x: -halfWidth - skew, y: halfHeight }
    ];
  }

  const points = [];
  const steps = shape === "strip" ? 1 : 3;
  for (let edge = 0; edge < 4; edge += 1) {
    for (let step = 0; step <= steps; step += 1) {
      if (edge > 0 && step === 0) continue;

      const t = step / steps;
      const edgeChip = shape === "strip" ? 0 : (hash2(column * 10 + edge, row * 10 + step, 1214) - 0.5) * chip;
      let x = 0;
      let y = 0;

      if (edge === 0) {
        x = lerp(-halfWidth, halfWidth, t);
        y = -halfHeight + edgeChip;
      } else if (edge === 1) {
        x = halfWidth + edgeChip;
        y = lerp(-halfHeight, halfHeight, t);
      } else if (edge === 2) {
        x = lerp(halfWidth, -halfWidth, t);
        y = halfHeight + edgeChip;
      } else {
        x = -halfWidth + edgeChip;
        y = lerp(halfHeight, -halfHeight, t);
      }

      points.push({ x, y });
    }
  }

  return points;
}

function drawLandingBlackShellPiece(piece, now, elapsed) {
  const progress = smoothstep(0, LANDING_CAMERA_REVEAL_DURATION, elapsed);
  const fade = 1 - smoothstep(piece.fadeStart, Math.min(1, piece.fadeEnd), progress);

  if (fade <= 0.001) return;

  const localDrift = smoothstep(piece.fadeStart, Math.min(1, piece.fadeEnd), progress);
  const shimmer = 0.92 + Math.sin(now * 0.00072 + piece.seed * 40) * 0.08;
  const x = piece.x + piece.driftX * localDrift;
  const y = piece.y + piece.driftY * localDrift;
  const rotation = piece.rotation + Math.sin(now * 0.00028 + piece.seed * 20) * 0.012;

  landingCtx.save();
  landingCtx.translate(x, y);
  landingCtx.rotate(rotation);
  landingCtx.beginPath();

  piece.points.forEach((point, index) => {
    if (index === 0) {
      landingCtx.moveTo(point.x, point.y);
    } else {
      landingCtx.lineTo(point.x, point.y);
    }
  });

  landingCtx.closePath();
  landingCtx.clip();
  landingCtx.setTransform(1, 0, 0, 1, 0, 0);

  if (canvas && canvas.width && canvas.height) {
    const refractStrength = fade * 0.32;

    landingCtx.globalAlpha = refractStrength;
    landingCtx.drawImage(canvas, piece.refractX, piece.refractY, landingCanvas.width, landingCanvas.height);
    landingCtx.globalAlpha = refractStrength * 0.28;
    landingCtx.drawImage(canvas, piece.refractX + piece.ghostX, piece.refractY + piece.ghostY, landingCanvas.width, landingCanvas.height);
  }

  landingCtx.globalAlpha = 1;
  landingCtx.fillStyle = grey(0, fade * lerp(0.78, 0.9, shimmer));
  landingCtx.fillRect(0, 0, landingCanvas.width, landingCanvas.height);
  landingCtx.restore();
}

function drawLandingDissolvingBlackSurface(progress) {
  const surfaceOpacity = 1 - smoothstep(0.04, 0.96, progress);

  if (surfaceOpacity <= 0.001) return;

  // Final transition only: after the physical collapse has already happened,
  // the remaining black barrier quietly becomes transparent over the camera.
  landingCtx.save();
  landingCtx.fillStyle = grey(0, surfaceOpacity);
  landingCtx.fillRect(0, 0, landingCanvas.width, landingCanvas.height);
  landingCtx.restore();
}

function drawLandingCameraReveal(now, pixelRatio) {
  if (!landingCameraRevealStartTime || landingRevealCompleted) return;

  const elapsed = now - landingCameraRevealStartTime;
  const revealProgress = clamp(elapsed / LANDING_CAMERA_REVEAL_DURATION, 0, 1);

  landingCtx.save();
  drawLandingDissolvingBlackSurface(revealProgress);
  landingCtx.restore();
}

function completeLandingCameraReveal(now) {
  if (!landingCameraRevealStartTime || landingRevealCompleted) return;

  if (now - landingCameraRevealStartTime < LANDING_CAMERA_REVEAL_DURATION + 180) return;

  landingRevealCompleted = true;
  startPanel.classList.add("is-hidden");
  stopLandingAnimation();
}

function seedLandingLetterBodies(now) {
  if (!landingTitle || landingLettersSeeded) return;

  landingLetterBodies.length = 0;
  const letters = Array.from(landingTitle.querySelectorAll(".title-letter"));

  letters.forEach((letter, index) => {
    const rect = letter.getBoundingClientRect();
    const seed = hash1(index, 984);

    landingLetterBodies.push({
      element: letter,
      originX: rect.left + rect.width * 0.5,
      originY: rect.top + rect.height * 0.5,
      width: rect.width,
      height: rect.height,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      angle: 0,
      angularVelocity: 0,
      mass: lerp(0.75, 3.4, seed),
      seed,
      launched: false,
      impactCooldown: 0
    });
  });

  landingLettersSeeded = true;
}

function updateLandingLetterBodies(now, dt, transitionProgress, pixelRatio) {
  if (!landingIsTransitioning || !landingLetterBodies.length) return;

  const elapsed = now - landingTransitionStart;
  const viewportWidth = Math.max(1, window.innerWidth || 1);
  const viewportHeight = Math.max(1, window.innerHeight || 1);
  const source = getElementViewportCenter(startButton) || { x: viewportWidth * 0.5, y: viewportHeight * 0.58 };
  const anticipation = 1 - smoothstep(0, LANDING_LETTER_EXPULSION_DELAY, elapsed);

  landingLetterBodies.forEach((body, index) => {
    body.impactCooldown = Math.max(0, body.impactCooldown - dt);

    if (elapsed < LANDING_LETTER_EXPULSION_DELAY) {
      const pressureWave = Math.sin(now * 0.012 + body.seed * 20) * anticipation;
      const dx = body.originX - source.x;
      const dy = body.originY - source.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const surfacePressure = smoothstep(0, LANDING_LETTER_EXPULSION_DELAY, elapsed);
      body.x = (dx / distance) * pressureWave * surfacePressure * 5;
      body.y = (dy / distance) * pressureWave * surfacePressure * 3;
      body.angle = (body.seed - 0.5) * surfacePressure * 3;
      applyLandingLetterTransform(body);
      return;
    }

    if (!body.launched) {
      const dx = body.originX - source.x;
      const dy = body.originY - source.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const angleOffset = (body.seed - 0.5) * 0.58;
      const outwardAngle = Math.atan2(dy, dx) + angleOffset;
      const force = LANDING_LETTER_IMPACT_FORCE * lerp(0.82, 1.45, hash1(index, 986)) / body.mass;
      body.vx = Math.cos(outwardAngle) * force;
      body.vy = Math.sin(outwardAngle) * force;
      body.angularVelocity = (body.seed - 0.5) * lerp(420, 920, hash1(index, 987)) / body.mass;
      body.launched = true;
    }

    const latePressure = smoothstep(0.08, 0.78, transitionProgress);
    body.vx *= Math.pow(0.992, dt * 60);
    body.vy *= Math.pow(0.992, dt * 60);
    body.vy += (body.seed - 0.5) * 20 * dt * latePressure;
    body.x += body.vx * dt;
    body.y += body.vy * dt;
    body.angle += body.angularVelocity * dt;
    body.angularVelocity *= Math.pow(0.988, dt * 60);

    bounceLandingLetterFromEdges(body, now, pixelRatio, viewportWidth, viewportHeight);
    applyLandingLetterTransform(body);
  });
}

function bounceLandingLetterFromEdges(body, now, pixelRatio, viewportWidth, viewportHeight) {
  const halfWidth = Math.max(4, body.width * 0.5);
  const halfHeight = Math.max(8, body.height * 0.5);
  let impactX = null;
  let impactY = null;
  let impactStrength = 0;
  const currentX = body.originX + body.x;
  const currentY = body.originY + body.y;

  if (currentX - halfWidth < 0) {
    body.x = halfWidth - body.originX;
    impactStrength = Math.max(impactStrength, Math.abs(body.vx));
    body.vx = Math.abs(body.vx) * LANDING_LETTER_BOUNCE;
    impactX = 0;
    impactY = currentY;
  } else if (currentX + halfWidth > viewportWidth) {
    body.x = viewportWidth - halfWidth - body.originX;
    impactStrength = Math.max(impactStrength, Math.abs(body.vx));
    body.vx = -Math.abs(body.vx) * LANDING_LETTER_BOUNCE;
    impactX = viewportWidth;
    impactY = currentY;
  }

  if (currentY - halfHeight < 0) {
    body.y = halfHeight - body.originY;
    impactStrength = Math.max(impactStrength, Math.abs(body.vy));
    body.vy = Math.abs(body.vy) * LANDING_LETTER_BOUNCE;
    impactX = currentX;
    impactY = 0;
  } else if (currentY + halfHeight > viewportHeight) {
    body.y = viewportHeight - halfHeight - body.originY;
    impactStrength = Math.max(impactStrength, Math.abs(body.vy));
    body.vy = -Math.abs(body.vy) * LANDING_LETTER_BOUNCE;
    impactX = currentX;
    impactY = viewportHeight;
  }

  if (impactX !== null && body.impactCooldown <= 0) {
    const x = clamp(impactX, 0, viewportWidth) * pixelRatio;
    const y = clamp(impactY, 0, viewportHeight) * pixelRatio;
    const strength = lerp(0.48, 1, clamp(impactStrength / 1300, 0, 1));
    createLandingPressure(x, y, strength, now, 70);
    body.impactCooldown = 0.22;
  }
}

function applyLandingLetterTransform(body) {
  body.element.style.setProperty("--live-x", body.x.toFixed(2) + "px");
  body.element.style.setProperty("--live-y", body.y.toFixed(2) + "px");
  body.element.style.setProperty("--live-r", body.angle.toFixed(2) + "deg");
  body.element.style.setProperty("--fail-o", String(Math.max(0.28, 0.92 - Math.hypot(body.x, body.y) / 1200)));
}

function handleLandingPointer(event) {
  landingPointerX = event.clientX;
  landingPointerY = event.clientY;
  landingPointerActiveUntil = performance.now() + 900;
  startPanel.classList.add("is-pointer-damaging");
  deformLandingTitleFromPointer(event.clientX, event.clientY);

  if (event.type === "pointerdown" && !landingIsTransitioning && !startButton.contains(event.target)) {
    handleLandingFragmentClick(event.clientX, event.clientY);
  }
}

function handleLandingFragmentClick(clientX, clientY) {
  if (!landingCanvas) return;

  const now = performance.now();
  const pixelRatio = landingCanvas.width / Math.max(1, window.innerWidth || 1);
  const x = clientX * pixelRatio;
  const y = clientY * pixelRatio;
  let closest = null;
  let closestDistance = Infinity;

  landingArtifacts.forEach((artifact) => {
    if (!artifact.invitation || !artifact.active || now < artifact.reactionCooldownUntil) return;

    const distance = Math.hypot(artifact.x - x, artifact.y - y);
    const radius = Math.max(LANDING_FRAGMENT_CLICK_RADIUS * pixelRatio, artifact.size * 2.2, artifact.length * 0.32);

    if (distance < radius && distance < closestDistance) {
      closest = artifact;
      closestDistance = distance;
    }
  });

  if (closest) {
    reactToLandingFragment(closest, now, pixelRatio, "click");
  }
}

function clearLandingPointer() {
  landingPointerActiveUntil = 0;
  startPanel.classList.remove("is-pointer-damaging");
  relaxLandingTitle();
}

function handleStartButtonTouch(event) {
  if (landingIsTransitioning) return;

  startPanel.classList.add("is-button-touched");
  landingButtonDamage = Math.min(1, landingButtonDamage + 0.22);
  handleLandingPointer(event);

  const now = performance.now();
  if (now - landingLastCrackAt > LANDING_CURSOR_DAMAGE_INTERVAL * 0.8) {
    const center = getElementCanvasCenter(startButton);
    if (center) createLandingPressure(center.x, center.y, 0.28, now, 620, true, "hover", 0);
    landingLastCrackAt = now;
  }
}

function clearStartButtonTouch() {
  if (!landingIsTransitioning) {
    startPanel.classList.remove("is-button-touched");
  }
}

function deformLandingTitleFromPointer(pointerX, pointerY) {
  if (!landingTitle || landingIsTransitioning) return;

  const letters = landingTitle.querySelectorAll(".title-letter");
  const radius = Math.max(180, Math.min(window.innerWidth, window.innerHeight) * 0.32);

  letters.forEach((letter, index) => {
    const rect = letter.getBoundingClientRect();
    const centerX = rect.left + rect.width * 0.5;
    const centerY = rect.top + rect.height * 0.5;
    const dx = centerX - pointerX;
    const dy = centerY - pointerY;
    const distance = Math.hypot(dx, dy);
    const pressure = Math.pow(Math.max(0, 1 - distance / radius), 1.85);
    const direction = distance > 0.001 ? Math.atan2(dy, dx) : hash1(index, 990) * Math.PI * 2;
    const weight = lerp(0.35, 1.5, hash1(index, 991));

    letter.style.setProperty("--live-x", (Math.cos(direction) * pressure * weight * 7).toFixed(2) + "px");
    letter.style.setProperty("--live-y", (Math.sin(direction) * pressure * weight * 4.5).toFixed(2) + "px");
    letter.style.setProperty("--live-r", ((hash1(index, 992) - 0.5) * pressure * 2.6).toFixed(2) + "deg");
  });
}

function relaxLandingTitle() {
  if (!landingTitle || landingIsTransitioning) return;

  landingTitle.querySelectorAll(".title-letter").forEach((letter) => {
    letter.style.setProperty("--live-x", "0px");
    letter.style.setProperty("--live-y", "0px");
    letter.style.setProperty("--live-r", "0deg");
  });
}

function getElementCanvasRect(element) {
  if (!element || !landingCanvas) return null;

  const rect = element.getBoundingClientRect();
  const pixelRatio = landingCanvas.width / Math.max(1, window.innerWidth || 1);

  return {
    x: rect.left * pixelRatio,
    y: rect.top * pixelRatio,
    width: rect.width * pixelRatio,
    height: rect.height * pixelRatio
  };
}

function getElementCanvasCenter(element) {
  const rect = getElementCanvasRect(element);

  if (!rect) return null;

  return {
    x: rect.x + rect.width * 0.5,
    y: rect.y + rect.height * 0.5
  };
}

function getElementViewportCenter(element) {
  if (!element) return null;

  const rect = element.getBoundingClientRect();

  return {
    x: rect.left + rect.width * 0.5,
    y: rect.top + rect.height * 0.5
  };
}

function seedLandingTransitionCracks(now) {
  const buttonCenter = getElementCanvasCenter(startButton);

  if (buttonCenter) {
    landingFractureRayTarget = 3 + Math.floor(Math.random() * 4);
    landingFractureRaysCreated = 0;
    landingLastCrackAt = now;
    createLandingPressure(buttonCenter.x, buttonCenter.y, 0.72, now, 180, true, "collapse", 0);
  }


}

async function beginLandingTransition() {
  if (landingHasStartedCamera) return;

  const now = performance.now();
  landingHasStartedCamera = true;
  landingIsTransitioning = true;
  landingTransitionStart = now;
  landingButtonDamage = 1;
  landingLastCrackAt = 0;
  landingBlackShellPieces.length = 0;
  landingNegativeRays.length = 0;
  landingFractureRayTarget = 0;
  landingFractureRaysCreated = 0;
  landingCameraRevealStartTime = 0;
  landingRevealCompleted = false;
  startButton.disabled = true;
  startMessage.textContent = "";
  startPanel.classList.add("is-transitioning", "is-button-touched");
  seedLandingLetterBodies(now);
  seedLandingTransitionCracks(now);

  window.setTimeout(() => {
    startInstallation();
  }, LANDING_TRANSITION_CAMERA_DELAY);
}

async function startInstallation() {
  startButton.disabled = true;
  startMessage.textContent = "Waiting for presence...";

  try {
    ensureCameraIsAvailable();
    ensureSegmentationIsAvailable();

    await openCamera(cameraFacingMode);
    await setupSegmenter();
    setupPoseTracking();

    isRunning = true;
    resetTransformation();

    switchCameraButton.hidden = true;
    updateStatusText("Waiting for presence...", "");
    runSegmentationLoop();

    if (landingIsTransitioning) {
      startPanel.classList.add("is-revealing-camera");
      landingBlackShellPieces.length = 0;
      landingCameraRevealStartTime = performance.now();
      landingRevealCompleted = false;
      startLandingAnimation();
    } else {
      startPanel.classList.add("is-hidden");
      stopLandingAnimation();
    }
  } catch (error) {
    landingHasStartedCamera = false;
    landingIsTransitioning = false;
    landingCameraRevealStartTime = 0;
    landingRevealCompleted = false;
    landingBlackShellPieces.length = 0;
    startPanel.classList.remove("is-transitioning", "is-revealing-camera");
    startButton.disabled = false;
    startMessage.textContent = friendlyError(error);
    startLandingAnimation();
    console.error(error);
  }
}

function ensureCameraIsAvailable() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("This browser does not provide camera access.");
  }

  if (!window.isSecureContext) {
    throw new Error("Camera access needs HTTPS or localhost.");
  }
}

function ensureSegmentationIsAvailable() {
  if (typeof SelfieSegmentation === "undefined") {
    throw new Error("The body segmentation library could not be loaded.");
  }
}

async function openCamera(facingMode) {
  stopCamera();

  cameraStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: { ideal: facingMode },
      width: { ideal: 1280 },
      height: { ideal: 720 }
    }
  });

  video.srcObject = cameraStream;
  await video.play();

  if (!video.videoWidth || !video.videoHeight) {
    await new Promise((resolve) => {
      video.onloadedmetadata = resolve;
    });
  }

  resizeRenderer();
}

function stopCamera() {
  if (!cameraStream) return;

  cameraStream.getTracks().forEach((track) => track.stop());
  cameraStream = null;
}

async function setupSegmenter() {
  if (segmenter) return;

  segmenter = new SelfieSegmentation({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
  });

  // The image is not mirrored. This keeps the camera image and body mask aligned.
  segmenter.setOptions({
    modelSelection: 1,
    selfieMode: false
  });

  segmenter.onResults(handleSegmentationResults);
}


async function setupPoseTracking() {
  if (!POSE_TRACKING_ENABLED || poseDetector || poseLoadFailed) return;

  try {
    if (typeof Pose === "undefined") {
      await loadExternalScript(POSE_SCRIPT_URL);
    }

    if (typeof Pose === "undefined") {
      throw new Error("The pose tracking library could not be loaded.");
    }

    poseDetector = new Pose({
      locateFile: (file) => "https://cdn.jsdelivr.net/npm/@mediapipe/pose/" + file
    });

    poseDetector.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: LANDMARK_CONFIDENCE_THRESHOLD,
      minTrackingConfidence: LANDMARK_CONFIDENCE_THRESHOLD
    });

    poseDetector.onResults(handlePoseResults);
    poseStartedAt = performance.now();
  } catch (error) {
    // Pose adds structure, but it should never break the already-working camera
    // and segmentation prototype. If it fails, the artwork continues mask-only.
    poseLoadFailed = true;
    console.warn("Pose tracking could not start. Continuing with segmentation only.", error);
  }
}

function loadExternalScript(url) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src="' + url + '"]');

    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function switchCamera() {
  if (!isRunning) return;

  cameraFacingMode = cameraFacingMode === "environment" ? "user" : "environment";
  updateStatusText("Camera", "Switching");

  try {
    await openCamera(cameraFacingMode);
    resetTransformation();
  } catch (error) {
    updateStatusText("Camera", "Error");
    console.error(error);
  }
}

// MediaPipe is called one frame at a time. This is calmer and more stable on
// mobile devices than sending many frames at once.
async function runSegmentationLoop() {
  if (!isRunning || isSegmenting) return;

  isSegmenting = true;

  while (isRunning) {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      try {
        await segmenter.send({ image: video });
        await maybeSendPoseFrame(performance.now());
      } catch (error) {
        console.error(error);
        await wait(120);
      }
    } else {
      await wait(60);
    }

    await nextAnimationFrame();
  }

  isSegmenting = false;
}


async function maybeSendPoseFrame(now) {
  if (!poseDetector || now - lastPoseSentAt < POSE_FRAME_INTERVAL_MS) return;

  lastPoseSentAt = now;

  try {
    await poseDetector.send({ image: video });
  } catch (error) {
    // A single dropped pose frame should not stop the installation.
    console.warn("Pose frame skipped.", error);
  }
}

function handleSegmentationResults(results) {
  const now = performance.now();

  resizeRenderer();
  prepareMask(results.segmentationMask);
  updateBodyPresence(now);
  renderFrame(now);
}


function handlePoseResults(results) {
  const now = performance.now();
  const landmarks = results.poseLandmarks || [];

  latestPoseLandmarks = landmarks;
  latestPoseScreenLandmarks = landmarks.map((landmark, index) => poseLandmarkToCanvasPoint(landmark, index));
  latestPoseVisibleCount = latestPoseScreenLandmarks.filter(isVisiblePosePoint).length;
  latestPoseBounds = calculatePoseBounds(latestPoseScreenLandmarks);
  latestPoseMotionAmount = calculatePoseMotionAmount(latestPoseScreenLandmarks, previousPoseScreenLandmarks);

  if (latestPoseVisibleCount >= POSE_MIN_VISIBLE_LANDMARKS) {
    lastPoseSeenAt = now;
    addPoseMotionTrails(latestPoseScreenLandmarks, now);
  }

  previousPoseScreenLandmarks = latestPoseScreenLandmarks.map((point) => ({ ...point }));
}

// -----------------------------------------------------------------------------
// MASK AND BODY PRESENCE
// -----------------------------------------------------------------------------

function prepareMask(segmentationMask) {
  maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

  drawSourceCover(maskCtx, segmentationMask, {
    filter: `blur(${MASK_EDGE_SOFTNESS}px)`
  });

  sampleCtx.clearRect(0, 0, MASK_SAMPLE_SIZE, MASK_SAMPLE_SIZE);
  sampleCtx.drawImage(maskCanvas, 0, 0, MASK_SAMPLE_SIZE, MASK_SAMPLE_SIZE);

  latestMaskPixels = sampleCtx.getImageData(0, 0, MASK_SAMPLE_SIZE, MASK_SAMPLE_SIZE);
  latestMaskCoverage = calculateMaskCoverage(latestMaskPixels);
}

function calculateMaskCoverage(maskPixels) {
  const data = maskPixels.data;
  let covered = 0;
  const total = MASK_SAMPLE_SIZE * MASK_SAMPLE_SIZE;

  for (let index = 0; index < data.length; index += 4) {
    const maskStrength = data[index] / 255;

    if (maskStrength > MASK_CONFIDENCE_THRESHOLD) {
      covered += 1;
    }
  }

  return covered / total;
}

function updateBodyPresence(now) {
  const maskDetected = latestMaskCoverage >= BODY_PRESENT_MIN_COVERAGE;
  const poseCanConfirm = USE_POSE_TO_CONFIRM_BODY
    && poseDetector
    && !poseLoadFailed
    && poseStartedAt > 0
    && now - poseStartedAt > POSE_BODY_CONFIRM_GRACE_MS;
  const poseConfirmed = hasReliablePose(now);
  const largeHumanMask = latestMaskCoverage >= BODY_PRESENT_WITHOUT_POSE_COVERAGE;
  const bodyDetected = maskDetected && (!poseCanConfirm || poseConfirmed || largeHumanMask);

  if (bodyDetected) {
    lastBodySeenAt = now;

    if (!bodyIsPresent) {
      bodyIsPresent = true;
      resetTransformation();
    }

    return;
  }

  if (bodyIsPresent && now - lastBodySeenAt > BODY_MISSING_RESET_AFTER_MS) {
    bodyIsPresent = false;
    resetTransformation();
  }
}

function resetTransformation() {
  transformationStartTime = performance.now();
  latestProgress = 0;
  manualStage = null;
  trailFragments.length = 0;
  previousPoseScreenLandmarks = null;
}

// -----------------------------------------------------------------------------
// MAIN RENDERING
// -----------------------------------------------------------------------------

function renderFrame(now) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCameraBackground();
  captureCameraMemoryFrame(now);

  if (!bodyIsPresent) {
    updateStatusText("Waiting", "No body");
    return;
  }

  latestProgress = BASIC_PROTOTYPE_ONLY
    ? 0
    : manualStage
      ? MANUAL_STAGE_PROGRESS[manualStage]
      : getTransformationProgress(now);

  if (!BASIC_PROTOTYPE_ONLY) {
    drawDigitalVolumeLayer(ctx, latestProgress, now, "behind");
    drawBodyImageDeformation(latestProgress, now);
  }

  drawBodyReplacement(latestProgress, now);
  ctx.drawImage(bodyCanvas, 0, 0);

  if (!BASIC_PROTOTYPE_ONLY) {
    drawMotionTrails(ctx, latestProgress, now);
    drawDigitalVolumeLayer(ctx, latestProgress, now, "near");
    drawSubtleOuterFragments(ctx, latestProgress, now);
  }

  updateStatusText("", "");
}

function drawCameraBackground() {
  drawSourceCover(ctx, video);
}

// -----------------------------------------------------------------------------
// BODY IMAGE DEFORMATION
// -----------------------------------------------------------------------------

function drawBodyImageDeformation(progress, now) {
  if (!BODY_DEFORMATION_ENABLED || BASIC_PROTOTYPE_ONLY || !bodyIsPresent) return;

  const stageAmount = smoothstep(0.01, 1, progress) * BODY_STAGE_RESPONSE;

  if (stageAmount <= 0.001) return;

  deformedBodyCtx.clearRect(0, 0, deformedBodyCanvas.width, deformedBodyCanvas.height);

  drawBodyMosaicDeformation(stageAmount, progress, now);
  drawAnatomicalSliceDeformation(stageAmount, progress, now);
  drawFaceDeconstruction(stageAmount, progress, now);
  drawExtremityMicroDeformation(stageAmount, progress, now);
  drawSubtleStructuralInstability(stageAmount, progress, now);

  drawDetachedBodyFragments(stageAmount, progress, now);
  ctx.drawImage(deformedBodyCanvas, 0, 0);
}

function drawBodyMosaicDeformation(stageAmount, progress, now) {
  const currentSource = getFrameMemorySource(0);
  if (!currentSource) return;

  const motionBoost = getMotionBoost();
  const tileSize = lerp(BODY_FRAGMENT_MAX_SIZE, BODY_FRAGMENT_MIN_SIZE, smoothstep(0.05, 1, progress + motionBoost * 0.18));
  const step = Math.max(5, tileSize * lerp(0.82, 0.62, progress));
  const maxFragments = Math.floor(BODY_FRAGMENT_COUNT * lerp(0.28, 1.55, stageAmount));
  let drawn = 0;

  for (let y = -tileSize; y < deformedBodyCanvas.height + tileSize && drawn < maxFragments; y += step) {
    for (let x = -tileSize; x < deformedBodyCanvas.width + tileSize && drawn < maxFragments; x += step) {
      const cx = x + tileSize * 0.5;
      const cy = y + tileSize * 0.5;

      if (sampleMask(cx, cy) < 0.14) continue;
      if (hasReliablePose(now) && !isPointNearPoseStructure(cx, cy, getBodyStructureFilterMargin(progress))) continue;

      const localStrength = getBodyDeformationStrength(cx, cy, progress, now);
      const seed = hash2(Math.floor(x / step), Math.floor(y / step), 301);
      const activation = smoothstep(seed * 0.88, seed * 0.88 + 0.34, localStrength + motionBoost * 0.2);

      if (activation <= 0.01) continue;

      const temporalDelay = Math.floor(lerp(0, BODY_FRAME_MEMORY_COUNT - 1, BODY_TEMPORAL_ECHO_STRENGTH * activation * hash2(x, y, 302)));
      const source = getFrameMemorySource(temporalDelay) || currentSource;
      const displacement = BODY_SLICE_DISPLACEMENT * activation * lerp(0.25, 1.2, seed);
      const angle = seed * Math.PI * 2 + now * 0.00022 * lerp(-1, 1, seed);
      const dx = x + Math.cos(angle) * displacement;
      const dy = y + Math.sin(angle) * displacement * lerp(0.65, 1.1, seed);
      const sourceShift = BODY_SLICE_DISPLACEMENT * activation * 0.48;
      const sx = x + (hash2(x, y, 303) - 0.5) * sourceShift;
      const sy = y + (hash2(x, y, 304) - 0.5) * sourceShift;
      const w = tileSize * lerp(0.72, 1.55, hash2(x, y, 305));
      const h = tileSize * lerp(0.55, 1.35, hash2(x, y, 306));
      const rotation = (hash2(x, y, 307) - 0.5) * BODY_ROTATION_AMOUNT * activation;
      const scale = 1 + (hash2(x, y, 308) - 0.5) * BODY_SCALE_DISTORTION * activation;
      const polygonClip = progress > 0.16 && hash2(x, y, 309) < lerp(0.2, 0.82, stageAmount);

      drawOpaqueImageFragment(deformedBodyCtx, source, sx, sy, w, h, dx, dy, w * scale, h * scale, rotation, seed, polygonClip);
      drawn += 1;
    }
  }
}

function drawAnatomicalSliceDeformation(stageAmount, progress, now) {
  if (!hasReliablePose(now)) return;

  const source = getFrameMemorySource(Math.floor(BODY_TEMPORAL_ECHO_STRENGTH * (BODY_FRAME_MEMORY_COUNT - 1))) || getFrameMemorySource(0);
  if (!source) return;

  deformedBodyCtx.save();

  SKELETON_CONNECTIONS.forEach((connection, connectionIndex) => {
    const start = getPosePoint(connection[0]);
    const end = getPosePoint(connection[1]);

    if (!start || !end) return;

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    if (length < 8) return;

    const nx = -dy / length;
    const ny = dx / length;
    const angle = Math.atan2(dy, dx);
    const connectionPriority = Math.max(getLandmarkPriority(connection[0]), getLandmarkPriority(connection[1]));
    const localAmount = stageAmount * BODY_JOINT_BREAK_INTENSITY * lerp(0.75, 1.25, connectionPriority);
    const sliceCount = Math.floor(1 + 5 * localAmount);

    for (let i = 0; i < sliceCount; i += 1) {
      const seed = hash2(connectionIndex, i, 321);
      const cycle = getOrderCollapseCycle(now, seed + connectionIndex * 0.09);
      const t = hash2(connectionIndex, i, 322);
      const cx = lerp(start.x, end.x, t);
      const cy = lerp(start.y, end.y, t);

      if (sampleMask(cx, cy) < 0.18) continue;

      const movement = getMotionBoost();
      const displacement = BODY_SLICE_DISPLACEMENT * localAmount * lerp(0.2, 1.15, seed) * (1 + movement * 0.75);
      const along = (seed - 0.5) * length * 0.12 * localAmount;
      const destX = cx + nx * displacement + Math.cos(angle) * along;
      const destY = cy + ny * displacement + Math.sin(angle) * along;
      const width = Math.min(length * lerp(0.16, 0.42, seed), BODY_FRAGMENT_MAX_SIZE * 1.8) * MEDIUM_FRAGMENT_SCALE;
      const height = lerp(9, 32, localAmount) * lerp(0.55, 1.45, seed);
      const sourceDelay = Math.floor(lerp(0, BODY_FRAME_MEMORY_COUNT - 1, BODY_TEMPORAL_ECHO_STRENGTH * localAmount * seed));
      const delayedSource = getFrameMemorySource(sourceDelay) || source;
      const rotation = angle + (seed - 0.5) * BODY_ROTATION_AMOUNT * localAmount + (cycle - 0.5) * 0.05;
      const scale = 1 + (cycle - 0.5) * BODY_SCALE_DISTORTION * localAmount;

      drawOpaqueImageFragment(
        deformedBodyCtx,
        delayedSource,
        cx - width * 0.5,
        cy - height * 0.5,
        width,
        height,
        destX - width * 0.5,
        destY - height * 0.5,
        width * scale,
        height,
        rotation,
        seed,
        progress > 0.2
      );
    }
  });

  deformedBodyCtx.restore();
}

function drawFaceDeconstruction(stageAmount, progress, now) {
  if (!hasReliablePose(now)) return;

  const intensity = stageAmount * BODY_FACE_DISTORTION_INTENSITY;
  if (intensity <= 0.01) return;

  const facePoints = [
    POSE_LANDMARKS.leftEye,
    POSE_LANDMARKS.rightEye,
    POSE_LANDMARKS.mouthLeft,
    POSE_LANDMARKS.mouthRight,
    POSE_LANDMARKS.nose,
    POSE_LANDMARKS.leftEar,
    POSE_LANDMARKS.rightEar
  ].map(getPosePoint).filter(Boolean);

  const nose = getPosePoint(POSE_LANDMARKS.nose);
  if (!nose || !facePoints.length) return;

  const shoulderA = getPosePoint(POSE_LANDMARKS.leftShoulder);
  const shoulderB = getPosePoint(POSE_LANDMARKS.rightShoulder);
  const headScale = shoulderA && shoulderB
    ? clamp(distanceBetween(shoulderA, shoulderB) * 0.22, 18, 62)
    : 34;

  facePoints.forEach((point, index) => {
    const priority = index <= 3 ? 1.18 : 0.9;
    const local = intensity * priority;
    const count = Math.floor(1 + 4 * local);

    for (let i = 0; i < count; i += 1) {
      const seed = hash2(index, i, 341);
      const cycle = getOrderCollapseCycle(now, seed + index * 0.21);
      const delay = Math.floor(lerp(0, BODY_FRAME_MEMORY_COUNT - 1, BODY_TEMPORAL_ECHO_STRENGTH * local * seed));
      const source = getFrameMemorySource(delay) || getFrameMemorySource(0);
      if (!source) continue;

      const w = headScale * lerp(0.24, 0.72, seed);
      const h = headScale * lerp(0.16, 0.48, hash2(index, i, 342));
      const shift = BODY_SLICE_DISPLACEMENT * local * lerp(0.18, 0.9, seed);
      const angle = seed * Math.PI * 2;
      const dx = point.x + Math.cos(angle) * shift + (cycle - 0.5) * headScale * 0.16;
      const dy = point.y + Math.sin(angle) * shift * 0.55;
      const sx = point.x - w * 0.5 + (hash2(index, i, 343) - 0.5) * shift;
      const sy = point.y - h * 0.5 + (hash2(index, i, 344) - 0.5) * shift * 0.55;
      const rotation = (seed - 0.5) * BODY_ROTATION_AMOUNT * local * 0.75;
      const scaleX = 1 + (hash2(index, i, 345) - 0.5) * BODY_SCALE_DISTORTION * local * 1.2;
      const scaleY = 1 + (hash2(index, i, 346) - 0.5) * BODY_SCALE_DISTORTION * local;

      drawOpaqueImageFragment(deformedBodyCtx, source, sx, sy, w, h, dx - w * 0.5, dy - h * 0.5, w * scaleX, h * scaleY, rotation, seed, true);
    }
  });
}

function drawExtremityMicroDeformation(stageAmount, progress, now) {
  if (!hasReliablePose(now)) return;

  const extremities = [
    POSE_LANDMARKS.leftWrist,
    POSE_LANDMARKS.rightWrist,
    POSE_LANDMARKS.leftAnkle,
    POSE_LANDMARKS.rightAnkle
  ];
  const source = getFrameMemorySource(0);
  if (!source) return;

  extremities.forEach((landmarkIndex, extremityIndex) => {
    const point = getPosePoint(landmarkIndex);
    if (!point) return;

    const local = stageAmount * BODY_HAND_FINGER_DISTORTION_INTENSITY * (landmarkIndex === POSE_LANDMARKS.leftWrist || landmarkIndex === POSE_LANDMARKS.rightWrist ? 1.15 : 0.9);
    const count = Math.floor(3 + 18 * local);
    const radius = lerp(10, 42, local);

    for (let i = 0; i < count; i += 1) {
      const seed = hash2(extremityIndex, i, 361);
      const angle = seed * Math.PI * 2 + now * 0.0004 * lerp(-1, 1, seed);
      const distance = radius * Math.pow(hash2(extremityIndex, i, 362), 0.62);
      const sx = point.x + Math.cos(angle) * distance * 0.45;
      const sy = point.y + Math.sin(angle) * distance * 0.45;
      const dx = point.x + Math.cos(angle) * distance + (hash2(extremityIndex, i, 363) - 0.5) * BODY_SLICE_DISPLACEMENT * local;
      const dy = point.y + Math.sin(angle) * distance + (hash2(extremityIndex, i, 364) - 0.5) * BODY_SLICE_DISPLACEMENT * local;
      const size = lerp(4, 18, local) * lerp(0.42, 1.2, seed);
      const delay = Math.floor(seed * BODY_TEMPORAL_ECHO_STRENGTH * (BODY_FRAME_MEMORY_COUNT - 1));
      const delayedSource = getFrameMemorySource(delay) || source;

      drawOpaqueImageFragment(deformedBodyCtx, delayedSource, sx - size * 0.5, sy - size * 0.5, size, size, dx - size * 0.5, dy - size * 0.5, size, size * lerp(0.5, 1.5, seed), (seed - 0.5) * BODY_ROTATION_AMOUNT * local * 1.4, seed, seed > 0.38);
    }
  });
}

function drawSubtleStructuralInstability(stageAmount, progress, now) {
  if (!BODY_STRUCTURAL_INSTABILITY_ENABLED || !hasReliablePose(now)) return;

  const source = getFrameMemorySource(0);
  if (!source) return;

  const instability = smoothstep(0.1, 1, progress) * BODY_STRUCTURAL_INSTABILITY_INTENSITY * stageAmount;
  if (instability <= 0.001) return;

  const nodes = getStructureNodes(progress, true, true).filter((node) => sampleMask(node.x, node.y) > 0.12);
  if (!nodes.length) return;

  const regionCount = Math.max(1, Math.min(BODY_STRUCTURAL_INSTABILITY_MAX_REGIONS, 2));

  deformedBodyCtx.save();

  for (let regionIndex = 0; regionIndex < regionCount; regionIndex += 1) {
    const interval = BODY_STRUCTURAL_INSTABILITY_INTERVAL_MS;
    const localTime = now + regionIndex * interval * 0.41;
    const phase = (localTime % interval) / interval;
    const epoch = Math.floor(localTime / interval);
    const envelope = smoothstep(0.08, 0.24, phase)
      * (1 - smoothstep(BODY_STRUCTURAL_INSTABILITY_DURATION, 0.96, phase))
      * instability;

    if (envelope <= 0.01) continue;

    const nodeIndex = Math.floor(hash2(epoch, regionIndex, 421) * nodes.length);
    const node = nodes[nodeIndex];
    if (!node) continue;

    const seed = hash2(epoch, regionIndex, 422);
    const radius = BODY_STRUCTURAL_INSTABILITY_RADIUS * lerp(0.72, 1.35, seed) * lerp(0.82, 1.22, node.weight || 1);
    const pullAngle = seed * Math.PI * 2 + Math.sin(now * 0.00018 + seed * 12) * 0.42;
    const pull = BODY_SLICE_DISPLACEMENT * 0.24 * envelope * lerp(0.45, 1.15, seed);
    const delay = Math.floor(lerp(1, BODY_STRUCTURAL_INSTABILITY_LAG_FRAMES, hash2(epoch, regionIndex, 423)));
    const delayedSource = getFrameMemorySource(delay) || source;
    const patchCount = 1 + Math.floor(hash2(epoch, regionIndex, 424) * 2);

    for (let patch = 0; patch < patchCount; patch += 1) {
      const patchSeed = hash2(epoch + regionIndex * 10, patch, 425);
      const offsetAngle = patchSeed * Math.PI * 2;
      const offsetDistance = radius * 0.32 * hash2(epoch, patch, 426);
      const centerX = node.x + Math.cos(offsetAngle) * offsetDistance;
      const centerY = node.y + Math.sin(offsetAngle) * offsetDistance;

      if (sampleMask(centerX, centerY) < 0.1) continue;

      const trembleX = Math.sin(now * 0.0017 + patchSeed * 20) * BODY_STRUCTURAL_INSTABILITY_TREMBLE * envelope;
      const trembleY = Math.cos(now * 0.0013 + patchSeed * 18) * BODY_STRUCTURAL_INSTABILITY_TREMBLE * envelope;
      const width = radius * lerp(0.58, 1.45, patchSeed);
      const height = radius * lerp(0.34, 0.88, hash2(epoch, patch, 427));
      const stretch = BODY_STRUCTURAL_INSTABILITY_STRETCH * envelope * lerp(0.45, 1.25, patchSeed);
      const scaleX = 1 + stretch;
      const scaleY = 1 - stretch * lerp(0.18, 0.48, hash2(epoch, patch, 428));
      const dx = centerX + Math.cos(pullAngle) * pull + trembleX;
      const dy = centerY + Math.sin(pullAngle) * pull * 0.72 + trembleY;
      const sourceLagX = Math.cos(pullAngle + Math.PI) * pull * 0.36;
      const sourceLagY = Math.sin(pullAngle + Math.PI) * pull * 0.24;
      const rotation = (patchSeed - 0.5) * BODY_ROTATION_AMOUNT * envelope * 0.9;
      const alpha = clamp(0.16 + envelope * 0.74, 0, 0.82);

      drawOpaqueImageFragment(
        deformedBodyCtx,
        delayedSource,
        centerX - width * 0.5 + sourceLagX,
        centerY - height * 0.5 + sourceLagY,
        width,
        height,
        dx - width * scaleX * 0.5,
        dy - height * scaleY * 0.5,
        width * scaleX,
        height * scaleY,
        rotation,
        patchSeed,
        patchSeed > 0.56,
        alpha
      );
    }
  }

  deformedBodyCtx.restore();
}

function drawDetachedBodyFragments(stageAmount, progress, now) {
  const expansion = smoothstep(0.5, 1, progress) * stageAmount;
  if (expansion <= 0.001) return;

  const source = getFrameMemorySource(Math.floor(BODY_FRAME_MEMORY_COUNT * 0.45)) || getFrameMemorySource(0);
  const nodes = getStructureNodes(progress, true, true);
  if (!source || !nodes.length) return;

  const count = Math.floor(BODY_DETACHED_FRAGMENT_AMOUNT * expansion);

  for (let i = 0; i < count; i += 1) {
    const node = nodes[i % nodes.length];
    const seed = hash1(i, 381);
    const cycle = getOrderCollapseCycle(now, seed + i * 0.02);
    const spread = OUTSIDE_BODY_SPREAD * FINAL_STAGE_EXPANSION * expansion * lerp(0.25, 1.1, seed);
    const angle = seed * Math.PI * 2 + now * ENTROPY_REORGANIZE_SPEED * lerp(-1.4, 1.4, seed);
    const sx = node.x + (hash1(i, 382) - 0.5) * 28;
    const sy = node.y + (hash1(i, 383) - 0.5) * 28;
    const dx = node.x + Math.cos(angle) * spread * lerp(0.35, 1.1, cycle);
    const dy = node.y + Math.sin(angle) * spread * lerp(0.35, 1.1, cycle);
    const size = lerp(8, 34, expansion) * MEDIUM_FRAGMENT_SCALE * lerp(0.5, 1.3, seed);
    const rotation = (seed - 0.5) * BODY_ROTATION_AMOUNT * expansion * 2;

    drawOpaqueImageFragment(deformedBodyCtx, source, sx - size * 0.5, sy - size * 0.5, size, size, dx - size * 0.5, dy - size * 0.5, size * lerp(0.8, 1.45, cycle), size * lerp(0.55, 1.25, seed), rotation, seed, true);
  }
}

function drawOpaqueImageFragment(targetCtx, source, sx, sy, sw, sh, dx, dy, dw, dh, rotation = 0, seed = 0, polygonClip = false, alpha = 1) {
  if (!source || !source.width || !source.height || sw <= 1 || sh <= 1 || dw <= 1 || dh <= 1) return;

  const sourceRect = clampSourceRect(source, sx, sy, sw, sh);
  if (!sourceRect) return;

  targetCtx.save();
  targetCtx.globalAlpha = clamp(alpha, 0, 1);
  targetCtx.translate(dx + dw * 0.5, dy + dh * 0.5);
  targetCtx.rotate(rotation);

  if (polygonClip) {
    makeFragmentClipPath(targetCtx, dw, dh, seed);
    targetCtx.clip();
  }

  targetCtx.drawImage(source, sourceRect.sx, sourceRect.sy, sourceRect.sw, sourceRect.sh, -dw * 0.5, -dh * 0.5, dw, dh);
  targetCtx.restore();
}

function makeFragmentClipPath(targetCtx, width, height, seed) {
  const skewA = (hash1(seed, 391) - 0.5) * 0.28;
  const skewB = (hash1(seed, 392) - 0.5) * 0.28;

  targetCtx.beginPath();
  targetCtx.moveTo(-width * 0.5, -height * (0.5 + skewA));
  targetCtx.lineTo(width * (0.5 + skewB), -height * 0.5);
  targetCtx.lineTo(width * 0.5, height * (0.5 + skewA));
  targetCtx.lineTo(-width * (0.5 + skewB), height * 0.5);
  targetCtx.closePath();
}

function clampSourceRect(source, sx, sy, sw, sh) {
  const safeSx = clamp(sx, 0, source.width - 1);
  const safeSy = clamp(sy, 0, source.height - 1);
  const safeSw = clamp(sw, 1, source.width - safeSx);
  const safeSh = clamp(sh, 1, source.height - safeSy);

  if (safeSw <= 1 || safeSh <= 1) return null;

  return { sx: safeSx, sy: safeSy, sw: safeSw, sh: safeSh };
}

function drawBodyReplacement(progress, now) {
  bodyCtx.clearRect(0, 0, bodyCanvas.width, bodyCanvas.height);

  if (BASIC_PROTOTYPE_ONLY) {
    drawBasicMaskOverlay();
    bodyCtx.save();
    bodyCtx.globalCompositeOperation = "destination-in";
    bodyCtx.drawImage(maskCanvas, 0, 0);
    bodyCtx.restore();
  } else {
    drawDarkMatterCoverage(progress, now);
    drawDigitalParticles(progress, now);
    drawGeometricFragments(progress, now);
    drawFirstPixelErrors(progress, now);
    drawMissingDataRegions(progress, now);
    drawGlitchStrips(progress, now);
    drawUnstableInnerEdges(progress, now);
  }
}

// Basic prototype layer: a transparent dark overlay that proves the body mask
// is aligned without turning the person into a pale grayscale figure.
function drawBasicMaskOverlay() {
  bodyCtx.save();
  bodyCtx.fillStyle = grey(0, 0.22);
  bodyCtx.fillRect(0, 0, bodyCanvas.width, bodyCanvas.height);
  bodyCtx.restore();
}

// Corruption spreads from joints and bones instead of uniformly covering the
// silhouette. Early stages affect only a few active regions; late stages connect
// those regions into a darker unfinished reconstruction.
function drawDarkMatterCoverage(progress, now) {
  const coverage = smoothstep(0.03, 1, progress) * CORRUPTION_REGION_GROWTH;

  if (coverage <= 0.001) return;

  const nodes = getStructureNodes(progress, true);
  if (!nodes.length) return;

  bodyCtx.save();

  nodes.forEach((node, nodeIndex) => {
    if (!node.active) return;

    const region = getCorruptionRadius(node, progress, "body");
    const count = Math.floor(2 + 18 * coverage * node.weight * DIGITAL_ENTROPY_DENSITY);
    const depth = getDepthInfo(node, "body");

    for (let i = 0; i < count; i += 1) {
      const seed = hash2(nodeIndex, i, 5);
      const cycle = getOrderCollapseCycle(now, node.seed + i * 0.17);
      const attraction = Math.pow(cycle, 1.7) * DIGITAL_GRAVITY_STRENGTH;
      const angle = seed * Math.PI * 2 + now * ENTROPY_REORGANIZE_SPEED * lerp(-1.8, 1.8, hash2(nodeIndex, i, 6));
      const entropyDistance = region * Math.pow(hash2(nodeIndex, i, 7), 0.62);
      const entropyX = node.x + Math.cos(angle) * entropyDistance;
      const entropyY = node.y + Math.sin(angle) * entropyDistance * lerp(0.72, 1.18, seed);
      const clusterOffsetX = (hash2(nodeIndex, i, 8) - 0.5) * region * 0.22;
      const clusterOffsetY = (hash2(nodeIndex, i, 9) - 0.5) * region * 0.22;
      const projected = projectDepthPoint({
        ...node,
        x: lerp(entropyX, node.x + clusterOffsetX, attraction),
        y: lerp(entropyY, node.y + clusterOffsetY, attraction)
      }, "body", seed, progress);

      if (!isEffectPointAllowed(projected.x, projected.y, 0.18, region * 0.65)) continue;

      const size = lerp(1.2, 8.5, coverage) * MEDIUM_FRAGMENT_SCALE * depth.scale * lerp(0.45, 1.4, seed);
      const tone = lerp(0, 70, hash2(nodeIndex, i, 10));
      const alpha = BODY_LAYER_OPACITY * lerp(0.08, 0.52, coverage) * depth.alpha * lerp(0.45, 1, cycle);

      bodyCtx.fillStyle = grey(tone, alpha);

      if (cycle > CLUSTER_COLLAPSE_THRESHOLD && hash2(nodeIndex, i, 11) > 0.42) {
        makeIrregularPolygonPath(bodyCtx, projected.x, projected.y, size * 1.45, 3 + Math.floor(seed * 3), angle, nodeIndex * 100 + i);
        bodyCtx.fill();
      } else {
        bodyCtx.fillRect(projected.x, projected.y, size, size * lerp(0.35, 1.25, seed));
      }
    }
  });

  bodyCtx.restore();
}

// Fragile reconstruction lines generated from real body landmarks. They are
// intentionally broken and unstable, so they do not read as a medical overlay.
function drawPoseSkeleton(targetCtx, progress, now) {
  if (!hasReliablePose(now)) return;

  const skeletonProgress = smoothstep(0.02, 1, progress);
  const breakAmount = smoothstep(0.22, 1, progress) * SKELETON_BREAK_INTENSITY;

  targetCtx.save();
  targetCtx.lineCap = "butt";
  targetCtx.lineJoin = "miter";

  SKELETON_CONNECTIONS.forEach((connection, index) => {
    const start = getPosePoint(connection[0]);
    const end = getPosePoint(connection[1]);

    if (!start || !end) return;

    drawBrokenSkeletonConnection(targetCtx, start, end, progress, now, index, breakAmount, 0);
  });

  STRUCTURE_LANDMARKS.forEach((landmarkIndex, index) => {
    const point = getPosePoint(landmarkIndex);

    if (!point) return;

    const pulse = 0.5 + 0.5 * Math.sin(now * 0.0012 + index * 1.7);
    const radius = lerp(1.2, 4.8, skeletonProgress) + pulse * 1.4;
    const tone = lerp(18, 128, hash1(index, 132));
    const alpha = SKELETON_LINE_OPACITY * lerp(0.5, 0.92, skeletonProgress) * (1 - breakAmount * 0.35);

    targetCtx.fillStyle = grey(tone, alpha);
    makeIrregularPolygonPath(targetCtx, point.x, point.y, radius, 4, now * 0.0002 + index, index + 400);
    targetCtx.fill();
  });

  targetCtx.restore();
}

function drawBrokenSkeletonConnection(targetCtx, start, end, progress, now, connectionIndex, breakAmount, detachAmount) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);

  if (length < 2) return;

  const normalX = -dy / length;
  const normalY = dx / length;
  const segments = 6 + Math.floor(progress * 12);
  const segmentGap = lerp(0.012, 0.035, progress);

  for (let segment = 0; segment < segments; segment += 1) {
    const seed = hash2(connectionIndex, segment, 141);
    const skipChance = breakAmount * lerp(0.16, 0.72, progress);

    if (!detachAmount && seed < skipChance) continue;
    if (detachAmount && seed > detachAmount * 0.74) continue;

    const t0 = segment / segments + segmentGap;
    const t1 = (segment + 1) / segments - segmentGap;

    if (t1 <= t0) continue;

    const jitter = EDGE_DISTORTION * (0.04 + progress * 0.2 + detachAmount * 0.95);
    const shift = (hash2(connectionIndex, segment, 142) - 0.5) * jitter;
    const alongShift = (hash2(connectionIndex, segment, 143) - 0.5) * jitter * 0.35;
    const wave = Math.sin(now * 0.00042 + seed * 12) * EDGE_DISTORTION * progress * 0.035;
    const detachDriftX = (hash2(connectionIndex, segment, 144) - 0.5) * OUTSIDE_BODY_SPREAD * detachAmount;
    const detachDriftY = (hash2(connectionIndex, segment, 145) - 0.5) * OUTSIDE_BODY_SPREAD * detachAmount;

    const x0 = lerp(start.x, end.x, t0) + normalX * (shift + wave) + dx / length * alongShift + detachDriftX;
    const y0 = lerp(start.y, end.y, t0) + normalY * (shift + wave) + dy / length * alongShift + detachDriftY;
    const x1 = lerp(start.x, end.x, t1) + normalX * (shift - wave) + dx / length * alongShift + detachDriftX;
    const y1 = lerp(start.y, end.y, t1) + normalY * (shift - wave) + dy / length * alongShift + detachDriftY;

    const paleChance = hash2(connectionIndex, segment, 146) < WHITE_SPECK_AMOUNT * (1 - progress * 0.4);
    const tone = paleChance ? lerp(128, 184, seed) : lerp(6, 118, seed);
    const alpha = SKELETON_LINE_OPACITY * lerp(0.26, 0.95, smoothstep(0.02, 0.45, progress)) * (1 - breakAmount * 0.45 + detachAmount * 0.15);

    targetCtx.strokeStyle = grey(tone, alpha);
    targetCtx.lineWidth = SKELETON_LINE_WIDTH * lerp(0.65, 1.8, progress) * lerp(0.65, 1.25, seed);
    targetCtx.beginPath();
    targetCtx.moveTo(x0, y0);
    targetCtx.lineTo(x1, y1);
    targetCtx.stroke();

    if (progress > 0.35 && hash2(connectionIndex, segment, 147) > 0.52) {
      const mx = (x0 + x1) * 0.5;
      const my = (y0 + y1) * 0.5;
      const radius = lerp(2, 9, progress) * lerp(0.7, 1.8, seed);

      targetCtx.fillStyle = grey(lerp(0, 74, seed), alpha * 0.7);
      makeIrregularPolygonPath(targetCtx, mx, my, radius, 3 + Math.floor(seed * 3), now * 0.00012 + seed * Math.PI, segment + connectionIndex * 100);
      targetCtx.fill();
    }
  }
}

// Dark matter is emitted from joints and along bones. This makes the corruption
// feel structurally connected to the body, not pasted onto the silhouette.
function drawPoseJointCorruption(targetCtx, progress, now) {
  if (!hasReliablePose(now)) return;

  const jointProgress = smoothstep(0.05, 1, progress) * JOINT_CORRUPTION_DENSITY;

  if (jointProgress <= 0.001) return;

  targetCtx.save();

  STRUCTURE_LANDMARKS.forEach((landmarkIndex, landmarkOrder) => {
    const point = getPosePoint(landmarkIndex);

    if (!point) return;

    const count = Math.floor(3 + 24 * jointProgress);
    const radius = lerp(5, 46, jointProgress);

    for (let i = 0; i < count; i += 1) {
      const seed = hash2(landmarkOrder, i, 151);
      const angle = seed * Math.PI * 2 + now * 0.00008 * (hash2(landmarkOrder, i, 152) - 0.5);
      const distance = radius * Math.pow(hash2(landmarkOrder, i, 153), 0.72);
      const x = point.x + Math.cos(angle) * distance + (hash2(landmarkOrder, i, 154) - 0.5) * EDGE_DISTORTION * progress * 0.32;
      const y = point.y + Math.sin(angle) * distance + (hash2(landmarkOrder, i, 155) - 0.5) * EDGE_DISTORTION * progress * 0.32;

      if (!isEffectPointAllowed(x, y, 0.18, POSE_EFFECT_MARGIN * 0.65)) continue;

      const size = lerp(1.5, 12, jointProgress) * lerp(0.5, 1.6, seed);
      const tone = lerp(0, 92, hash2(landmarkOrder, i, 156));
      const alpha = lerp(0.08, 0.52, jointProgress) * lerp(0.55, 1, seed);

      targetCtx.fillStyle = grey(tone, alpha);

      if (seed > 0.45) {
        makeIrregularPolygonPath(targetCtx, x, y, size, 3 + Math.floor(seed * 3), angle, landmarkOrder * 50 + i);
        targetCtx.fill();
      } else {
        targetCtx.fillRect(x, y, size, size * lerp(0.35, 1.2, seed));
      }
    }
  });

  SKELETON_CONNECTIONS.forEach((connection, connectionIndex) => {
    const start = getPosePoint(connection[0]);
    const end = getPosePoint(connection[1]);

    if (!start || !end) return;

    const count = Math.floor(2 + 16 * jointProgress);

    for (let i = 0; i < count; i += 1) {
      const seed = hash2(connectionIndex, i, 161);
      const t = hash2(connectionIndex, i, 162);
      const x = lerp(start.x, end.x, t) + (hash2(connectionIndex, i, 163) - 0.5) * EDGE_DISTORTION * progress;
      const y = lerp(start.y, end.y, t) + (hash2(connectionIndex, i, 164) - 0.5) * EDGE_DISTORTION * progress;

      if (!isEffectPointAllowed(x, y, 0.16, POSE_EFFECT_MARGIN * 0.5)) continue;

      const size = lerp(1, 7, progress) * lerp(0.45, 1.3, seed);
      const tone = lerp(0, 82, seed);
      const alpha = lerp(0.05, 0.38, jointProgress);

      targetCtx.fillStyle = grey(tone, alpha);
      targetCtx.fillRect(x, y, size, size);
    }
  });

  targetCtx.restore();
}

// Stage 1 and 2: black and graphite pixel dust, almost invisible at first.
function drawFirstPixelErrors(progress, now) {
  const pixelProgress = getTimedProgress(now, PIXEL_APPEAR_TIME);

  if (pixelProgress <= 0.001) return;

  const w = bodyCanvas.width;
  const h = bodyCanvas.height;
  const blockSize = Math.max(2, Math.round(lerp(PIXEL_SIZE, PIXEL_SIZE * 6.4, smoothstep(0.18, 1, progress))));
  const step = Math.max(5, blockSize);
  const density = PIXEL_DENSITY * lerp(0.18, 2.2, pixelProgress);
  const timeWave = now * 0.00028;

  bodyCtx.save();

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const cx = x + step * 0.5;
      const cy = y + step * 0.5;

      if (!isEffectPointAllowed(cx, cy)) continue;

      const cellX = Math.floor(x / step);
      const cellY = Math.floor(y / step);
      const randomValue = hash2(cellX, cellY, 8);
      const slowPulse = 0.5 + 0.5 * Math.sin(timeWave + randomValue * Math.PI * 2);
      const activation = smoothstep(randomValue, randomValue + 0.18, density + slowPulse * 0.045);

      if (activation <= 0) continue;

      const driftX = (hash2(cellX, cellY, 11) - 0.5) * EDGE_DISTORTION * progress * 0.58;
      const driftY = (hash2(cellX, cellY, 12) - 0.5) * EDGE_DISTORTION * progress * 0.58;
      const isWhiteSpeck = hash2(cellX, cellY, 13) < WHITE_SPECK_AMOUNT * pixelProgress;
      const tone = isWhiteSpeck ? lerp(145, 225, hash2(cellX, cellY, 9)) : lerp(0, 92, hash2(cellX, cellY, 9));
      const alpha = (0.055 + 0.48 * pixelProgress) * activation;
      const size = blockSize * lerp(0.45, 1.65, hash2(cellX, cellY, 10));

      bodyCtx.fillStyle = grey(tone, alpha);
      bodyCtx.fillRect(x + driftX, y + driftY, size, size);
    }
  }

  bodyCtx.restore();
}

// Stage 3 onward: dark missing-data blocks// Stage 3 onward: dark missing-data blocks that cover the person instead of
// whitening them out.
function drawMissingDataRegions(progress, now) {
  const lossProgress = smoothstep(0.28, 1, progress) * MISSING_DATA_DENSITY;

  if (lossProgress <= 0.001) return;

  const w = bodyCanvas.width;
  const h = bodyCanvas.height;
  const count = Math.floor(14 + 118 * lossProgress);
  const maxSize = Math.min(w, h) * lerp(0.026, 0.22, lossProgress);

  bodyCtx.save();

  for (let i = 0; i < count; i += 1) {
    const baseX = hash1(i, 31) * w;
    const baseY = hash1(i, 32) * h;

    if (!isEffectPointAllowed(baseX, baseY)) continue;

    const activationSeed = hash1(i, 33) * 0.92;
    const activation = smoothstep(activationSeed, activationSeed + 0.26, lossProgress);

    if (activation <= 0) continue;

    const width = maxSize * lerp(0.34, 1.8, hash1(i, 34));
    const height = maxSize * lerp(0.2, 1.35, hash1(i, 35));
    const angle = hash1(i, 36) * Math.PI;
    const driftX = Math.sin(now * 0.00013 + i) * EDGE_DISTORTION * progress * 0.55;
    const driftY = Math.cos(now * 0.00015 + i) * EDGE_DISTORTION * progress * 0.55;
    const tone = lerp(0, 34, hash1(i, 37));
    const alpha = lerp(0.22, 0.9, lossProgress) * activation;

    bodyCtx.fillStyle = grey(tone, alpha);
    drawRotatedBlock(bodyCtx, baseX + driftX, baseY + driftY, width, height, angle, hash1(i, 38));
  }

  bodyCtx.restore();
}

// Subtle glitch strips that cut through the body area as the dark matter takes
// over. They are monochrome and slow, not a colorful TV-glitch effect.
function drawGlitchStrips(progress, now) {
  const stripProgress = smoothstep(0.22, 1, progress) * GLITCH_STRIP_DENSITY;

  if (stripProgress <= 0.001) return;

  const w = bodyCanvas.width;
  const h = bodyCanvas.height;
  const count = Math.floor(8 + 96 * stripProgress);

  bodyCtx.save();

  for (let i = 0; i < count; i += 1) {
    const y = hash1(i, 101) * h;
    const x = hash1(i, 102) * w;

    if (!isEffectPointAllowed(x, y)) continue;

    const activation = smoothstep(hash1(i, 103) * 0.92, hash1(i, 103) * 0.92 + 0.3, stripProgress);
    if (activation <= 0) continue;

    const isVertical = hash1(i, 104) > 0.78;
    const length = isVertical ? lerp(18, h * 0.28, hash1(i, 105)) : lerp(24, w * 0.34, hash1(i, 105));
    const thickness = lerp(1, 9, stripProgress) * lerp(0.45, 1.35, hash1(i, 106));
    const drift = Math.sin(now * 0.00028 + i * 1.37) * EDGE_DISTORTION * progress * 0.38;
    const tone = lerp(0, 82, hash1(i, 107));
    const alpha = lerp(0.08, 0.46, stripProgress) * activation;

    bodyCtx.fillStyle = grey(tone, alpha);

    if (isVertical) {
      bodyCtx.fillRect(x + drift, y - length * 0.5, thickness, length);
    } else {
      bodyCtx.fillRect(x - length * 0.5, y + drift, length, thickness);
    }
  }

  bodyCtx.restore();
}

// Temporary reconstruction clusters. Particles gather into partial polygonal
// surfaces near bones, hold for a moment, then collapse back into entropy.
function drawGeometricFragments(progress, now) {
  const fragmentProgress = smoothstep(0.14, 1, progress) * FRAGMENT_DENSITY * RECONSTRUCTION_CLUSTER_DENSITY;

  if (fragmentProgress <= 0.001) return;

  const nodes = getStructureNodes(progress, true);
  if (nodes.length < 2) return;

  bodyCtx.save();

  SKELETON_CONNECTIONS.forEach((connection, connectionIndex) => {
    const start = getPosePoint(connection[0]);
    const end = getPosePoint(connection[1]);

    if (!start || !end) return;

    const connectionSeed = hash1(connectionIndex, 41);
    const activation = smoothstep(connectionSeed * 0.8, connectionSeed * 0.8 + 0.34, fragmentProgress);
    if (activation <= 0) return;

    const clusterCount = Math.floor(1 + 5 * activation * fragmentProgress);

    for (let cluster = 0; cluster < clusterCount; cluster += 1) {
      const seed = hash2(connectionIndex, cluster, 42);
      const cycle = getOrderCollapseCycle(now, connectionIndex * 0.3 + cluster * 0.71);
      const build = smoothstep(0.16, CLUSTER_COLLAPSE_THRESHOLD, cycle);
      const collapse = smoothstep(CLUSTER_COLLAPSE_THRESHOLD, 1, cycle);
      const t = hash2(connectionIndex, cluster, 43);
      const boneX = lerp(start.x, end.x, t);
      const boneY = lerp(start.y, end.y, t);
      const boneZ = lerp(start.z || 0, end.z || 0, t);
      const region = lerp(8, 42, fragmentProgress) * MEDIUM_FRAGMENT_SCALE;
      const center = projectDepthPoint({ x: boneX, y: boneY, z: boneZ, seed, weight: 1 }, "body", seed, progress);

      if (!isEffectPointAllowed(center.x, center.y, 0.16, region * 1.2)) continue;

      const points = [];
      const pointCount = 3 + Math.floor(seed * 3);

      for (let pointIndex = 0; pointIndex < pointCount; pointIndex += 1) {
        const pointSeed = hash2(connectionIndex + cluster, pointIndex, 44);
        const angle = pointSeed * Math.PI * 2 + now * ENTROPY_REORGANIZE_SPEED * lerp(-1, 1, pointSeed);
        const entropyRadius = region * lerp(0.55, 1.35, hash2(connectionIndex + cluster, pointIndex, 45));
        const orderedRadius = region * lerp(0.16, 0.42, hash2(connectionIndex + cluster, pointIndex, 46));
        const radius = lerp(entropyRadius, orderedRadius, build) + collapse * region * lerp(0.2, 0.9, pointSeed);
        points.push({
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius * lerp(0.72, 1.2, pointSeed)
        });
      }

      const tone = lerp(0, 94, seed);
      const alpha = lerp(0.04, 0.38, fragmentProgress) * activation * (1 - collapse * 0.56);

      bodyCtx.fillStyle = grey(tone, alpha);
      bodyCtx.strokeStyle = grey(lerp(42, 132, seed), alpha * 0.54);
      bodyCtx.lineWidth = lerp(0.45, 1.35, fragmentProgress);
      bodyCtx.beginPath();
      points.forEach((point, pointIndex) => {
        if (pointIndex === 0) bodyCtx.moveTo(point.x, point.y);
        else bodyCtx.lineTo(point.x, point.y);
      });
      bodyCtx.closePath();
      bodyCtx.fill();

      if (cycle < CLUSTER_COLLAPSE_THRESHOLD) {
        bodyCtx.stroke();
      }

      points.forEach((point, pointIndex) => {
        const speck = 1.4 + hash2(connectionIndex, pointIndex, 47) * 3.2 * MEDIUM_FRAGMENT_SCALE;
        bodyCtx.fillStyle = grey(lerp(0, 78, hash2(connectionIndex, pointIndex, 48)), alpha * 1.4);
        bodyCtx.fillRect(point.x, point.y, speck, speck);
      });
    }
  });

  bodyCtx.restore();
}

// Computational entropy. These particles constantly exchange positions around
// the skeleton, then weakly gather and collapse in an endless recalculation.
function drawDigitalParticles(progress, now) {
  drawDigitalEntropyField(bodyCtx, progress, now, "body");
}

function drawDigitalEntropyField(targetCtx, progress, now, layer) {
  const entropyProgress = smoothstep(0.08, 1, progress) * DIGITAL_ENTROPY_DENSITY;

  if (entropyProgress <= 0.001) return;

  const nodes = getStructureNodes(progress, true);
  if (!nodes.length) return;

  const layerInfo = getLayerInfo(layer, progress);
  const perNode = Math.max(3, Math.floor((PARTICLE_AMOUNT / Math.max(1, nodes.length)) * entropyProgress * layerInfo.density));

  targetCtx.save();

  nodes.forEach((node, nodeIndex) => {
    if (!node.active && layer === "body") return;

    const depth = getDepthInfo(node, layer);
    const region = getCorruptionRadius(node, progress, layer) * layerInfo.spread;

    for (let i = 0; i < perNode; i += 1) {
      const seed = hash2(nodeIndex, i, layerInfo.salt);
      const exchange = hash2(nodeIndex + Math.floor(now * ENTROPY_REORGANIZE_SPEED * 0.34), i, layerInfo.salt + 1);
      const cycle = getOrderCollapseCycle(now, node.seed + i * 0.11 + layerInfo.salt);
      const order = Math.pow(cycle, 1.65) * DIGITAL_GRAVITY_STRENGTH;
      const collapse = smoothstep(CLUSTER_COLLAPSE_THRESHOLD, 1, cycle);
      const orbit = seed * Math.PI * 2 + now * ENTROPY_REORGANIZE_SPEED * lerp(-2.2, 2.2, exchange);
      const entropyDistance = region * Math.pow(hash2(nodeIndex, i, layerInfo.salt + 2), 0.56);
      const clusterDistance = region * lerp(0.04, 0.28, hash2(nodeIndex, i, layerInfo.salt + 3));
      const entropyX = node.x + Math.cos(orbit) * entropyDistance;
      const entropyY = node.y + Math.sin(orbit) * entropyDistance * lerp(0.7, 1.18, seed);
      const clusterX = node.x + Math.cos(orbit + Math.PI) * clusterDistance;
      const clusterY = node.y + Math.sin(orbit + Math.PI) * clusterDistance;
      const projected = projectDepthPoint({
        ...node,
        x: lerp(entropyX, clusterX, order) + collapse * Math.cos(orbit * 1.7) * region * 0.34,
        y: lerp(entropyY, clusterY, order) + collapse * Math.sin(orbit * 1.7) * region * 0.34
      }, layer, seed, progress);

      if (!isLayerPointAllowed(projected.x, projected.y, layer, region)) continue;

      const flicker = 0.62 + 0.38 * Math.sin(now * 0.004 + seed * 40);
      const size = lerp(0.75, 4.8, entropyProgress) * depth.scale * layerInfo.scale * lerp(0.45, 1.55, seed);
      const tone = hash2(nodeIndex, i, layerInfo.salt + 4) < WHITE_SPECK_AMOUNT
        ? lerp(122, 178, seed)
        : lerp(0, 104, seed);
      const alpha = layerInfo.alpha * depth.alpha * lerp(0.05, 0.5, entropyProgress) * flicker * (0.72 + order * 0.28);

      targetCtx.fillStyle = grey(tone, alpha);

      if (cycle > 0.38 && cycle < CLUSTER_COLLAPSE_THRESHOLD && seed > 0.72) {
        makeIrregularPolygonPath(targetCtx, projected.x, projected.y, size * 1.7, 3 + Math.floor(seed * 2), orbit, nodeIndex * 1000 + i);
        targetCtx.fill();
      } else if (seed > 0.58) {
        targetCtx.fillRect(projected.x, projected.y, size, size * lerp(0.35, 1.4, seed));
      } else {
        targetCtx.fillRect(projected.x, projected.y, size * 0.62, size * 0.62);
      }
    }
  });

  targetCtx.restore();
}

// Edge instability inside the detected body silhouette.
function drawUnstableInnerEdges(progress, now) {
  const edgeProgress = smoothstep(0.38, 1, progress);

  if (edgeProgress <= 0.001) return;

  const w = bodyCanvas.width;
  const h = bodyCanvas.height;
  const step = Math.max(7, Math.round(12 + progress * 9));
  const amount = 0.44 * edgeProgress;

  bodyCtx.save();

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (!isEdgePoint(x, y, step)) continue;

      const cellX = Math.floor(x / step);
      const cellY = Math.floor(y / step);

      if (hash2(cellX, cellY, 71) > amount) continue;

      const jitterX = (hash2(cellX, cellY, 72) - 0.5) * EDGE_DISTORTION * edgeProgress;
      const jitterY = (hash2(cellX, cellY, 73) - 0.5) * EDGE_DISTORTION * edgeProgress;
      const width = step * lerp(0.8, 3.1, hash2(cellX, cellY, 74));
      const height = step * lerp(0.35, 1.7, hash2(cellX, cellY, 75));
      const tone = lerp(0, 92, hash2(cellX, cellY, 76));
      const alpha = lerp(0.12, 0.58, edgeProgress);
      const wave = Math.sin(now * 0.00024 + cellX * 0.7 + cellY * 0.37) * step * 0.45;

      bodyCtx.fillStyle = grey(tone, alpha);
      bodyCtx.fillRect(x + jitterX + wave, y + jitterY, width, height);
    }
  }

  bodyCtx.restore();
}

// Draw one depth layer of the shallow digital volume. The layer can sit visually
// behind, on, or slightly in front of the performer without using a 3D engine.
function drawDigitalVolumeLayer(targetCtx, progress, now, layer) {
  const layerProgress = layer === "behind"
    ? smoothstep(0.18, 1, progress)
    : smoothstep(0.3, 1, progress);

  if (layerProgress <= 0.001) return;

  drawDigitalEntropyField(targetCtx, progress, now, layer);
  drawVolumeReconstructionAttempts(targetCtx, progress, now, layer);
}

function drawVolumeReconstructionAttempts(targetCtx, progress, now, layer) {
  if (!hasReliablePose(now)) return;

  const layerInfo = getLayerInfo(layer, progress);
  const buildProgress = smoothstep(0.28, 1, progress) * RECONSTRUCTION_CLUSTER_DENSITY;

  if (buildProgress <= 0.001) return;

  targetCtx.save();
  targetCtx.lineCap = "butt";

  SKELETON_CONNECTIONS.forEach((connection, connectionIndex) => {
    const start = getPosePoint(connection[0]);
    const end = getPosePoint(connection[1]);

    if (!start || !end) return;

    const attempts = Math.floor(1 + 4 * buildProgress * layerInfo.density);

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const seed = hash2(connectionIndex, attempt, layerInfo.salt + 210);
      const cycle = getOrderCollapseCycle(now, seed + connectionIndex * 0.07);
      const order = smoothstep(0.15, CLUSTER_COLLAPSE_THRESHOLD, cycle);
      const collapse = smoothstep(CLUSTER_COLLAPSE_THRESHOLD, 1, cycle);
      const t = hash2(connectionIndex, attempt, layerInfo.salt + 211);
      const base = {
        x: lerp(start.x, end.x, t),
        y: lerp(start.y, end.y, t),
        z: lerp(start.z || 0, end.z || 0, t),
        seed,
        weight: 1
      };
      const center = projectDepthPoint(base, layer, seed, progress);
      const region = getCorruptionRadius(base, progress, layer) * 0.72;

      if (!isLayerPointAllowed(center.x, center.y, layer, region)) continue;

      const pointCount = 3 + Math.floor(seed * 3);
      const points = [];

      for (let i = 0; i < pointCount; i += 1) {
        const pointSeed = hash2(connectionIndex + attempt, i, layerInfo.salt + 212);
        const angle = pointSeed * Math.PI * 2 + now * ENTROPY_REORGANIZE_SPEED * lerp(-1.4, 1.4, pointSeed);
        const looseRadius = region * lerp(0.42, 1.05, pointSeed);
        const builtRadius = region * lerp(0.08, 0.25, pointSeed);
        const radius = lerp(looseRadius, builtRadius, order) + collapse * region * lerp(0.18, 0.7, pointSeed);
        points.push({
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius * lerp(0.7, 1.18, pointSeed)
        });
      }

      const alpha = layerInfo.alpha * lerp(0.04, 0.24, buildProgress) * (1 - collapse * 0.52);
      const tone = lerp(0, 106, seed);

      targetCtx.fillStyle = grey(tone, alpha);
      targetCtx.strokeStyle = grey(lerp(42, 128, seed), alpha * 0.62);
      targetCtx.lineWidth = lerp(0.35, 1.05, buildProgress) * layerInfo.scale;
      targetCtx.beginPath();
      points.forEach((point, pointIndex) => {
        if (pointIndex === 0) targetCtx.moveTo(point.x, point.y);
        else targetCtx.lineTo(point.x, point.y);
      });
      targetCtx.closePath();

      if (cycle < CLUSTER_COLLAPSE_THRESHOLD) {
        targetCtx.fill();
        targetCtx.stroke();
      } else {
        points.forEach((point, pointIndex) => {
          const size = lerp(0.8, 3.8, buildProgress) * MEDIUM_FRAGMENT_SCALE * layerInfo.scale;
          targetCtx.fillRect(point.x, point.y, size, size * lerp(0.45, 1.2, hash2(connectionIndex, pointIndex, layerInfo.salt + 213)));
        });
      }
    }
  });

  targetCtx.restore();
}

// Movement trails from pose landmarks. These fragments lag behind motion so the
// body seems to leave failed reconstruction data in space.
function drawMotionTrails(targetCtx, progress, now) {
  if (!trailFragments.length) return;

  const trailProgress = smoothstep(0.06, 1, progress);

  if (trailProgress <= 0.001) return;

  targetCtx.save();

  for (let i = trailFragments.length - 1; i >= 0; i -= 1) {
    const fragment = trailFragments[i];
    const age = now - fragment.createdAt;

    if (age >= fragment.life) {
      trailFragments.splice(i, 1);
      continue;
    }

    const ageRatio = age / fragment.life;
    const fade = Math.pow(1 - ageRatio, 1.45) * trailProgress;
    const reorganization = getOrderCollapseCycle(now, fragment.seed * 0.013);
    const driftX = fragment.vx * ageRatio + Math.sin(now * ENTROPY_REORGANIZE_SPEED + fragment.seed) * fragment.size * 1.8;
    const driftY = fragment.vy * ageRatio + Math.cos(now * ENTROPY_REORGANIZE_SPEED * 0.9 + fragment.seed) * fragment.size * 1.8;
    const tone = fragment.tone;
    const alpha = fragment.alpha * fade * lerp(0.65, 1, reorganization);

    targetCtx.fillStyle = grey(tone, alpha);
    targetCtx.strokeStyle = grey(tone, alpha * 0.82);

    if (fragment.type === "line") {
      const breakPoint = clamp(0.18 + reorganization * 0.72, 0.12, 0.9);
      const mx = lerp(fragment.x1, fragment.x2, breakPoint) + driftX;
      const my = lerp(fragment.y1, fragment.y2, breakPoint) + driftY;
      targetCtx.lineWidth = fragment.size * lerp(0.55, 1.35, 1 - ageRatio);
      targetCtx.beginPath();
      targetCtx.moveTo(fragment.x1 + driftX, fragment.y1 + driftY);
      targetCtx.lineTo(mx, my);
      targetCtx.stroke();

      if (reorganization > CLUSTER_COLLAPSE_THRESHOLD) {
        targetCtx.beginPath();
        targetCtx.moveTo(mx + fragment.size * 1.8, my - fragment.size);
        targetCtx.lineTo(fragment.x2 + driftX, fragment.y2 + driftY);
        targetCtx.stroke();
      }
    } else if (fragment.type === "polygon") {
      const size = fragment.size * lerp(0.55, 1.2, reorganization) * (1 - ageRatio * 0.35);
      makeIrregularPolygonPath(targetCtx, fragment.x + driftX, fragment.y + driftY, size, fragment.sides, fragment.rotation + ageRatio * 1.1, fragment.seed);
      targetCtx.fill();
    } else {
      const size = fragment.size * lerp(0.45, 1.15, reorganization);
      targetCtx.fillRect(fragment.x + driftX, fragment.y + driftY, size, size * fragment.aspect);
    }
  }

  targetCtx.restore();
}

// In late stages, parts of the reconstruction skeleton detach into the shallow
// digital volume. They remain geometric and computational, never smoky.
function drawDetachedSkeletonFragments(targetCtx, progress, now) {
  if (!hasReliablePose(now)) return;

  const detachAmount = smoothstep(0.52, 1, progress) * FINAL_STAGE_EXPANSION;

  if (detachAmount <= 0.001) return;

  targetCtx.save();
  targetCtx.lineCap = "butt";

  SKELETON_CONNECTIONS.forEach((connection, index) => {
    const start = getPosePoint(connection[0]);
    const end = getPosePoint(connection[1]);

    if (!start || !end) return;

    drawBrokenSkeletonConnection(targetCtx, start, end, progress, now, index + 200, SKELETON_BREAK_INTENSITY, detachAmount);
  });

  const nodes = getStructureNodes(progress, true, true);

  if (!nodes.length) {
    targetCtx.restore();
    return;
  }

  const count = Math.floor(120 * detachAmount * DIGITAL_ENTROPY_DENSITY);

  for (let i = 0; i < count; i += 1) {
    const node = nodes[i % nodes.length];
    if (!node) continue;

    const seed = hash1(i, 181);
    const cycle = getOrderCollapseCycle(now, seed + i * 0.03);
    const angle = seed * Math.PI * 2 + now * ENTROPY_REORGANIZE_SPEED * lerp(-1.8, 1.8, seed);
    const spread = DIGITAL_VOLUME_SPREAD * detachAmount * lerp(0.35, 1.2, hash1(i, 182));
    const cluster = DIGITAL_GRAVITY_STRENGTH * Math.pow(cycle, 1.5);
    const looseX = node.x + Math.cos(angle) * spread;
    const looseY = node.y + Math.sin(angle) * spread;
    const tightX = node.x + (hash1(i, 183) - 0.5) * spread * 0.18;
    const tightY = node.y + (hash1(i, 184) - 0.5) * spread * 0.18;
    const projected = projectDepthPoint({
      ...node,
      x: lerp(looseX, tightX, cluster),
      y: lerp(looseY, tightY, cluster)
    }, "near", seed, progress);

    const size = lerp(1.2, 8.5, detachAmount) * MEDIUM_FRAGMENT_SCALE * lerp(0.5, 1.4, seed);
    const tone = lerp(0, 94, seed);
    const alpha = NEAR_LAYER_OPACITY * lerp(0.08, 0.38, detachAmount) * lerp(0.55, 1, cycle);

    targetCtx.fillStyle = grey(tone, alpha);

    if (cycle > 0.36 && cycle < CLUSTER_COLLAPSE_THRESHOLD && seed > 0.48) {
      makeIrregularPolygonPath(targetCtx, projected.x, projected.y, size * 1.7, 3 + Math.floor(seed * 3), angle, i + 700);
      targetCtx.fill();
    } else {
      targetCtx.fillRect(projected.x, projected.y, size, size * lerp(0.35, 1.25, seed));
    }
  }

  targetCtx.restore();
}

// Stage 4 and 5: entropy and unfinished reconstruction spread outside the body
// contour. This is discrete digital information reorganizing in
// the shallow space around the performer.
function drawSubtleOuterFragments(targetCtx, progress, now) {
  const expansionProgress = smoothstep(0.48, 1, progress) * FINAL_STAGE_EXPANSION;

  if (expansionProgress <= 0.001) return;

  const nodes = getStructureNodes(progress, true, true);
  if (!nodes.length) return;

  targetCtx.save();

  const count = Math.floor(260 * expansionProgress * DIGITAL_ENTROPY_DENSITY);

  for (let i = 0; i < count; i += 1) {
    const node = nodes[i % nodes.length];
    const seed = hash1(i, 121);
    const cycle = getOrderCollapseCycle(now, seed + i * 0.021);
    const angle = seed * Math.PI * 2 + now * ENTROPY_REORGANIZE_SPEED * lerp(-1.7, 1.7, hash1(i, 122));
    const spread = OUTSIDE_BODY_SPREAD * expansionProgress * lerp(0.32, 1.18, hash1(i, 123));
    const collapse = smoothstep(CLUSTER_COLLAPSE_THRESHOLD, 1, cycle);
    const order = Math.pow(cycle, 1.5) * DIGITAL_GRAVITY_STRENGTH;
    const looseX = node.x + Math.cos(angle) * spread;
    const looseY = node.y + Math.sin(angle) * spread * lerp(0.72, 1.2, seed);
    const builtX = node.x + (hash1(i, 124) - 0.5) * spread * 0.2;
    const builtY = node.y + (hash1(i, 125) - 0.5) * spread * 0.2;
    const projected = projectDepthPoint({
      ...node,
      x: lerp(looseX, builtX, order) + collapse * Math.cos(angle * 1.7) * spread * 0.34,
      y: lerp(looseY, builtY, order) + collapse * Math.sin(angle * 1.7) * spread * 0.34
    }, seed > 0.5 ? "near" : "behind", seed, progress);

    const tone = hash1(i, 126) < WHITE_SPECK_AMOUNT ? lerp(118, 172, seed) : lerp(0, 96, seed);
    const alpha = lerp(0.035, 0.34, expansionProgress) * lerp(0.55, 1, cycle);
    const size = lerp(0.9, 6.2, expansionProgress) * MEDIUM_FRAGMENT_SCALE * lerp(0.45, 1.55, seed);

    targetCtx.fillStyle = grey(tone, alpha);

    if (cycle > 0.3 && cycle < CLUSTER_COLLAPSE_THRESHOLD && seed > 0.56) {
      makeIrregularPolygonPath(targetCtx, projected.x, projected.y, size * 1.8, 3 + Math.floor(seed * 3), angle, i + 900);
      targetCtx.fill();
    } else if (seed > 0.62) {
      targetCtx.fillRect(projected.x, projected.y, size, size * lerp(0.3, 1.2, seed));
    } else {
      targetCtx.fillRect(projected.x, projected.y, size * 0.62, size * 0.62);
    }
  }

  targetCtx.restore();
}

// -----------------------------------------------------------------------------
// KEYBOARD TESTING// -----------------------------------------------------------------------------
// KEYBOARD TESTING
// -----------------------------------------------------------------------------

function handleKeyboard(event) {
  const key = event.key.toLowerCase();

  if (key >= "1" && key <= "5") {
    manualStage = Number(key);
    latestProgress = MANUAL_STAGE_PROGRESS[manualStage];
    updateStatusText("", "");
  }

  if (key === "r") {
    resetTransformation();
    updateStatusText("Waiting for presence...", "");
  }
}

// -----------------------------------------------------------------------------
// CANVAS HELPERS
// -----------------------------------------------------------------------------

function resizeRenderer() {
  const cssWidth = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
  const cssHeight = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);

  const pixelRatio = Math.max(
    0.5,
    Math.min(
      window.devicePixelRatio || 1,
      MAX_DEVICE_PIXEL_RATIO,
      MAX_RENDER_WIDTH / cssWidth,
      MAX_RENDER_HEIGHT / cssHeight
    )
  );

  const width = Math.max(1, Math.round(cssWidth * pixelRatio));
  const height = Math.max(1, Math.round(cssHeight * pixelRatio));

  if (canvas.width === width && canvas.height === height) return;

  canvas.width = width;
  canvas.height = height;
  maskCanvas.width = width;
  maskCanvas.height = height;
  bodyCanvas.width = width;
  bodyCanvas.height = height;
  deformedBodyCanvas.width = width;
  deformedBodyCanvas.height = height;
  frameMemoryCanvases.forEach((memoryCanvas) => {
    memoryCanvas.width = width;
    memoryCanvas.height = height;
  });
  frameMemoryFilled = 0;
  frameMemoryIndex = 0;

  ctx.imageSmoothingEnabled = true;
  maskCtx.imageSmoothingEnabled = true;
  bodyCtx.imageSmoothingEnabled = true;
  deformedBodyCtx.imageSmoothingEnabled = true;
  frameMemoryContexts.forEach((memoryCtx) => {
    memoryCtx.imageSmoothingEnabled = true;
  });
}

function drawSourceCover(targetCtx, source, options = {}) {
  const sourceWidth = source.videoWidth || source.width;
  const sourceHeight = source.videoHeight || source.height;

  if (!sourceWidth || !sourceHeight || !canvas.width || !canvas.height) return;

  const rect = coverSourceRect(sourceWidth, sourceHeight, canvas.width, canvas.height);

  targetCtx.save();
  targetCtx.globalAlpha = options.alpha ?? 1;
  targetCtx.filter = options.filter || "none";
  targetCtx.drawImage(source, rect.sx, rect.sy, rect.sw, rect.sh, 0, 0, canvas.width, canvas.height);
  targetCtx.restore();
}

function coverSourceRect(sourceWidth, sourceHeight, destinationWidth, destinationHeight) {
  const sourceRatio = sourceWidth / sourceHeight;
  const destinationRatio = destinationWidth / destinationHeight;

  if (sourceRatio > destinationRatio) {
    const sw = sourceHeight * destinationRatio;
    return {
      sx: (sourceWidth - sw) * 0.5,
      sy: 0,
      sw,
      sh: sourceHeight
    };
  }

  const sh = sourceWidth / destinationRatio;
  return {
    sx: 0,
    sy: (sourceHeight - sh) * 0.5,
    sw: sourceWidth,
    sh
  };
}

function drawEmptyScreen() {
  ctx.fillStyle = grey(242, 1);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawRotatedBlock(targetCtx, x, y, width, height, angle, seed) {
  const skew = (seed - 0.5) * 0.36;

  targetCtx.save();
  targetCtx.translate(x, y);
  targetCtx.rotate(angle);
  targetCtx.beginPath();
  targetCtx.moveTo(-width * 0.5, -height * 0.5);
  targetCtx.lineTo(width * 0.5, -height * (0.5 + skew));
  targetCtx.lineTo(width * 0.5, height * 0.5);
  targetCtx.lineTo(-width * (0.5 + skew), height * 0.5);
  targetCtx.closePath();
  targetCtx.fill();
  targetCtx.restore();
}

function makeIrregularPolygonPath(targetCtx, x, y, radius, sides, rotation, seed) {
  targetCtx.beginPath();

  for (let point = 0; point < sides; point += 1) {
    const angle = rotation + (point / sides) * Math.PI * 2;
    const pointRadius = radius * lerp(0.55, 1.25, hash2(point, seed, 81));
    const px = x + Math.cos(angle) * pointRadius;
    const py = y + Math.sin(angle) * pointRadius;

    if (point === 0) {
      targetCtx.moveTo(px, py);
    } else {
      targetCtx.lineTo(px, py);
    }
  }

  targetCtx.closePath();
}

function captureCameraMemoryFrame(now) {
  if (!video.videoWidth || !video.videoHeight || !canvas.width || !canvas.height) return;
  if (frameMemoryFilled > 0 && now - lastFrameMemoryAt < BODY_FRAME_MEMORY_INTERVAL_MS) return;

  const memoryCanvas = frameMemoryCanvases[frameMemoryIndex];
  const memoryCtx = frameMemoryContexts[frameMemoryIndex];

  memoryCtx.clearRect(0, 0, memoryCanvas.width, memoryCanvas.height);
  drawSourceCover(memoryCtx, video);

  frameMemoryIndex = (frameMemoryIndex + 1) % BODY_FRAME_MEMORY_COUNT;
  frameMemoryFilled = Math.min(BODY_FRAME_MEMORY_COUNT, frameMemoryFilled + 1);
  lastFrameMemoryAt = now;
}

function getFrameMemorySource(delay = 0) {
  if (!frameMemoryFilled) return null;

  const safeDelay = clamp(Math.floor(delay), 0, frameMemoryFilled - 1);
  const index = (frameMemoryIndex - 1 - safeDelay + BODY_FRAME_MEMORY_COUNT) % BODY_FRAME_MEMORY_COUNT;
  return frameMemoryCanvases[index];
}

function getBodyDeformationStrength(x, y, progress, now) {
  const stageAmount = smoothstep(0.01, 1, progress) * BODY_FRACTURE_INTENSITY;
  const motionBoost = getMotionBoost();
  const recalculation = 0.06 + 0.08 * Math.sin(now * 0.001 + x * 0.017 + y * 0.011);

  if (!hasReliablePose(now)) {
    return clamp(stageAmount * (0.22 + recalculation + motionBoost * 0.55), 0, 1);
  }

  const nodes = getStructureNodes(progress, true, false);
  let strongest = 0;

  nodes.forEach((node) => {
    if (!node.active) return;

    const radius = getCorruptionRadius(node, progress, "body") * lerp(0.52, 1.05, node.weight || 1);
    const distance = Math.hypot(x - node.x, y - node.y);
    const contribution = smoothstep(radius, 0, distance) * (node.weight || 1);
    strongest = Math.max(strongest, contribution);
  });

  const structureDistance = distanceToPoseStructure(x, y);
  const structureSpread = lerp(18, 92, smoothstep(0.18, 1, progress) * CORRUPTION_REGION_GROWTH);
  const boneContribution = smoothstep(structureSpread, 0, structureDistance) * 0.75;
  const value = (Math.max(strongest, boneContribution) + recalculation + motionBoost * 0.58) * stageAmount;

  return clamp(value, 0, 1);
}

function getBodyStructureFilterMargin(progress) {
  return lerp(42, 138, smoothstep(0.12, 1, progress)) * (1 + getMotionBoost() * 0.35);
}

function getMotionBoost() {
  return clamp(latestPoseMotionAmount / 34, 0, 1);
}

function calculatePoseMotionAmount(currentPoints, previousPoints) {
  if (!currentPoints || !previousPoints) return latestPoseMotionAmount * BODY_DEFORMATION_SMOOTHING;

  let total = 0;
  let count = 0;

  STRUCTURE_LANDMARKS.forEach((landmarkIndex) => {
    const current = currentPoints[landmarkIndex];
    const previous = previousPoints[landmarkIndex];

    if (!isVisiblePosePoint(current) || !isVisiblePosePoint(previous)) return;

    total += Math.hypot(current.x - previous.x, current.y - previous.y);
    count += 1;
  });

  const measured = count ? total / count : 0;
  return latestPoseMotionAmount * BODY_DEFORMATION_SMOOTHING + measured * (1 - BODY_DEFORMATION_SMOOTHING);
}

// -----------------------------------------------------------------------------
// POSE HELPERS
// -----------------------------------------------------------------------------

function poseLandmarkToCanvasPoint(landmark, index) {
  const sourceWidth = video.videoWidth || canvas.width;
  const sourceHeight = video.videoHeight || canvas.height;

  if (!sourceWidth || !sourceHeight) {
    return {
      x: 0,
      y: 0,
      z: landmark.z || 0,
      visibility: landmark.visibility ?? 0,
      index
    };
  }

  const rect = coverSourceRect(sourceWidth, sourceHeight, canvas.width, canvas.height);
  const sourceX = landmark.x * sourceWidth;
  const sourceY = landmark.y * sourceHeight;

  return {
    x: ((sourceX - rect.sx) / rect.sw) * canvas.width,
    y: ((sourceY - rect.sy) / rect.sh) * canvas.height,
    z: landmark.z || 0,
    visibility: landmark.visibility ?? 1,
    index
  };
}

function isVisiblePosePoint(point) {
  if (!point) return false;

  return Number.isFinite(point.x)
    && Number.isFinite(point.y)
    && point.visibility >= LANDMARK_CONFIDENCE_THRESHOLD
    && point.x > -POSE_EFFECT_MARGIN
    && point.x < canvas.width + POSE_EFFECT_MARGIN
    && point.y > -POSE_EFFECT_MARGIN
    && point.y < canvas.height + POSE_EFFECT_MARGIN;
}

function calculatePoseBounds(points) {
  const visiblePoints = points.filter(isVisiblePosePoint);

  if (!visiblePoints.length) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  visiblePoints.forEach((point) => {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  });

  return { minX, minY, maxX, maxY };
}

function hasReliablePose(now = performance.now()) {
  return Boolean(
    latestPoseScreenLandmarks
    && latestPoseVisibleCount >= POSE_MIN_VISIBLE_LANDMARKS
    && now - lastPoseSeenAt <= POSE_STALE_AFTER_MS
  );
}

function getPosePoint(index) {
  if (!latestPoseScreenLandmarks) return null;

  const point = latestPoseScreenLandmarks[index];
  return isVisiblePosePoint(point) ? point : null;
}

function isEffectPointAllowed(x, y, threshold = MASK_CONFIDENCE_THRESHOLD, margin = POSE_EFFECT_MARGIN) {
  if (sampleMask(x, y) < threshold) return false;

  if (!USE_POSE_TO_FILTER_EFFECTS || !hasReliablePose() || !latestPoseBounds) {
    return true;
  }

  return isPointNearPoseStructure(x, y, margin)
    || isPointInsidePoseBounds(x, y, margin * 0.38);
}

function isPointInsidePoseBounds(x, y, margin = POSE_EFFECT_MARGIN) {
  if (!latestPoseBounds) return true;

  return x >= latestPoseBounds.minX - margin
    && x <= latestPoseBounds.maxX + margin
    && y >= latestPoseBounds.minY - margin
    && y <= latestPoseBounds.maxY + margin;
}

function isPointNearPoseStructure(x, y, margin = POSE_EFFECT_MARGIN) {
  if (!hasReliablePose()) return true;

  return distanceToPoseStructure(x, y) <= margin;
}

function isLayerPointAllowed(x, y, layer, region) {
  if (layer === "body") {
    return isEffectPointAllowed(x, y, 0.12, Math.max(POSE_EFFECT_MARGIN, region));
  }

  if (!hasReliablePose()) {
    return sampleMask(x, y) > 0.06;
  }

  const expansion = layer === "near" ? OUTSIDE_BODY_SPREAD : DIGITAL_VOLUME_SPREAD * 0.72;
  return isPointNearPoseStructure(x, y, Math.max(region, POSE_EFFECT_MARGIN) + expansion * smoothstep(0.45, 1, latestProgress));
}

function distanceToPoseStructure(x, y) {
  if (!latestPoseScreenLandmarks) return Infinity;

  let closest = Infinity;

  STRUCTURE_LANDMARKS.forEach((landmarkIndex) => {
    const point = getPosePoint(landmarkIndex);
    if (!point) return;
    closest = Math.min(closest, Math.hypot(x - point.x, y - point.y));
  });

  SKELETON_CONNECTIONS.forEach((connection) => {
    const start = getPosePoint(connection[0]);
    const end = getPosePoint(connection[1]);
    if (!start || !end) return;
    closest = Math.min(closest, distanceToSegment(x, y, start.x, start.y, end.x, end.y));
  });

  return closest;
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) return Math.hypot(px - ax, py - ay);

  const t = clamp(((px - ax) * dx + (py - ay) * dy) / lengthSquared, 0, 1);
  const x = ax + dx * t;
  const y = ay + dy * t;

  return Math.hypot(px - x, py - y);
}

function getStructureNodes(progress = latestProgress, includeBoneSamples = true, includeInactive = false) {
  if (!hasReliablePose()) {
    return getFallbackStructureNodes(progress);
  }

  const nodes = [];

  STRUCTURE_LANDMARKS.forEach((landmarkIndex, order) => {
    const point = getPosePoint(landmarkIndex);
    if (!point) return;

    const priority = getLandmarkPriority(landmarkIndex);
    const seed = hash1(landmarkIndex, 231);
    const spread = smoothstep(0.02, 1, progress) * STRUCTURE_REGION_GROWTH;
    const active = includeInactive || progress > 0.86 || seed < 0.08 + spread * 0.74 + priority * 0.18;

    nodes.push({
      x: point.x,
      y: point.y,
      z: point.z || 0,
      visibility: point.visibility,
      index: landmarkIndex,
      order,
      seed,
      weight: 0.78 + priority,
      active,
      type: "joint"
    });
  });

  if (includeBoneSamples) {
    SKELETON_CONNECTIONS.forEach((connection, connectionIndex) => {
      const start = getPosePoint(connection[0]);
      const end = getPosePoint(connection[1]);
      if (!start || !end) return;

      const sampleCount = progress > 0.58 ? 3 : 2;

      for (let sample = 1; sample <= sampleCount; sample += 1) {
        const t = sample / (sampleCount + 1);
        const seed = hash2(connectionIndex, sample, 232);
        const spread = smoothstep(0.18, 1, progress) * STRUCTURE_REGION_GROWTH;
        const active = includeInactive || progress > 0.72 || seed < 0.04 + spread * 0.7;

        nodes.push({
          x: lerp(start.x, end.x, t),
          y: lerp(start.y, end.y, t),
          z: lerp(start.z || 0, end.z || 0, t),
          index: 100 + connectionIndex * 10 + sample,
          order: connectionIndex,
          seed,
          weight: 0.72,
          active,
          type: "bone"
        });
      }
    });
  }

  return nodes;
}

function getFallbackStructureNodes(progress) {
  const center = getMaskCenterPoint();
  const spreadX = canvas.width * 0.08;
  const spreadY = canvas.height * 0.16;
  const fallback = [
    { x: center.x, y: center.y - spreadY, z: -0.08, index: 0, seed: 0.15, weight: 1, active: true, type: "fallback" },
    { x: center.x - spreadX, y: center.y, z: 0, index: 1, seed: 0.35, weight: 0.9, active: progress > 0.18, type: "fallback" },
    { x: center.x + spreadX, y: center.y, z: 0, index: 2, seed: 0.55, weight: 0.9, active: progress > 0.18, type: "fallback" },
    { x: center.x, y: center.y + spreadY, z: 0.08, index: 3, seed: 0.75, weight: 0.85, active: progress > 0.32, type: "fallback" }
  ];

  return fallback;
}

function getMaskCenterPoint() {
  if (!latestMaskPixels) {
    return { x: canvas.width * 0.5, y: canvas.height * 0.5 };
  }

  const data = latestMaskPixels.data;
  let total = 0;
  let sumX = 0;
  let sumY = 0;

  for (let y = 0; y < MASK_SAMPLE_SIZE; y += 1) {
    for (let x = 0; x < MASK_SAMPLE_SIZE; x += 1) {
      const index = (y * MASK_SAMPLE_SIZE + x) * 4;
      const strength = data[index] / 255;
      if (strength < MASK_CONFIDENCE_THRESHOLD) continue;
      total += strength;
      sumX += x * strength;
      sumY += y * strength;
    }
  }

  if (!total) {
    return { x: canvas.width * 0.5, y: canvas.height * 0.5 };
  }

  return {
    x: (sumX / total / MASK_SAMPLE_SIZE) * canvas.width,
    y: (sumY / total / MASK_SAMPLE_SIZE) * canvas.height
  };
}

function getLandmarkPriority(index) {
  if (index === POSE_LANDMARKS.leftEye || index === POSE_LANDMARKS.rightEye || index === POSE_LANDMARKS.mouthLeft || index === POSE_LANDMARKS.mouthRight) return 0.52;
  if (index === POSE_LANDMARKS.leftEar || index === POSE_LANDMARKS.rightEar || index === POSE_LANDMARKS.nose) return 0.44;
  if (index === POSE_LANDMARKS.leftWrist || index === POSE_LANDMARKS.rightWrist) return 0.5;
  if (index === POSE_LANDMARKS.leftElbow || index === POSE_LANDMARKS.rightElbow) return 0.36;
  if (index === POSE_LANDMARKS.leftShoulder || index === POSE_LANDMARKS.rightShoulder) return 0.42;
  if (index === POSE_LANDMARKS.leftHip || index === POSE_LANDMARKS.rightHip) return 0.34;
  if (index === POSE_LANDMARKS.leftKnee || index === POSE_LANDMARKS.rightKnee) return 0.3;
  if (index === POSE_LANDMARKS.leftAnkle || index === POSE_LANDMARKS.rightAnkle) return 0.3;
  if (index === POSE_LANDMARKS.nose) return 0.38;
  return 0.22;
}

function getPoseCenterPoint() {
  if (latestPoseBounds) {
    return {
      x: (latestPoseBounds.minX + latestPoseBounds.maxX) * 0.5,
      y: (latestPoseBounds.minY + latestPoseBounds.maxY) * 0.5
    };
  }

  return getMaskCenterPoint();
}

function getDepthInfo(point, layer = "body") {
  const depth = clamp(0.5 - (point.z || 0) * DEPTH_LAYER_STRENGTH, 0, 1);
  const layerAlpha = layer === "near" ? NEAR_LAYER_OPACITY : layer === "behind" ? BEHIND_LAYER_OPACITY : BODY_LAYER_OPACITY;
  const layerScale = layer === "near" ? 1.12 : layer === "behind" ? 0.72 : 1;

  return {
    depth,
    alpha: layerAlpha * lerp(0.72, 1.15, depth),
    scale: layerScale * lerp(0.72, 1.28, depth)
  };
}

function projectDepthPoint(point, layer, seed, progress) {
  const center = getPoseCenterPoint();
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const nx = dx / distance;
  const ny = dy / distance;
  const depth = getDepthInfo(point, layer).depth;
  const layerBias = layer === "near" ? 0.72 : layer === "behind" ? -0.62 : 0;
  const parallax = (depth - 0.5 + layerBias) * DEPTH_PARALLAX * smoothstep(0.1, 1, progress);
  const recalculation = Math.sin(performance.now() * ENTROPY_REORGANIZE_SPEED + seed * 13) * EDGE_DISTORTION * 0.018;

  return {
    x: point.x + nx * parallax + recalculation,
    y: point.y + ny * parallax + recalculation * 0.55
  };
}

function getCorruptionRadius(node, progress, layer = "body") {
  const stageGrowth = smoothstep(0.02, 1, progress) * CORRUPTION_REGION_GROWTH;
  const layerSpread = layer === "body" ? 1 : layer === "near" ? 1.38 : 1.12;
  const priority = node.weight || 1;

  return lerp(5, DIGITAL_VOLUME_SPREAD * layerSpread, stageGrowth) * lerp(0.72, 1.18, priority);
}

function getLayerInfo(layer, progress) {
  if (layer === "near") {
    return {
      alpha: NEAR_LAYER_OPACITY,
      density: lerp(0.18, 0.72, smoothstep(0.35, 1, progress)),
      spread: lerp(0.7, 1.38, smoothstep(0.35, 1, progress)),
      scale: 1.05,
      salt: 510
    };
  }

  if (layer === "behind") {
    return {
      alpha: BEHIND_LAYER_OPACITY,
      density: lerp(0.12, 0.5, smoothstep(0.22, 1, progress)),
      spread: lerp(0.9, 1.22, smoothstep(0.22, 1, progress)),
      scale: 0.78,
      salt: 610
    };
  }

  return {
    alpha: BODY_LAYER_OPACITY,
    density: 1,
    spread: 1,
    scale: 1,
    salt: 410
  };
}

function getOrderCollapseCycle(now, seed) {
  return 0.5 + 0.5 * Math.sin(now * ORDER_COLLAPSE_SPEED + seed * Math.PI * 2);
}


function addPoseMotionTrails(points, now) {
  if (!bodyIsPresent || !previousPoseScreenLandmarks || BASIC_PROTOTYPE_ONLY) return;

  const progress = manualStage ? MANUAL_STAGE_PROGRESS[manualStage] : getTransformationProgress(now);
  const trailProgress = smoothstep(0.06, 1, progress);

  if (trailProgress <= 0.001) return;

  let createdThisFrame = 0;
  const frameLimit = Math.max(4, Math.floor(PARTICLE_TRAIL_AMOUNT * TRAIL_DENSITY * 0.08));

  for (let i = 0; i < STRUCTURE_LANDMARKS.length; i += 1) {
    if (createdThisFrame >= frameLimit) break;

    const landmarkIndex = STRUCTURE_LANDMARKS[i];
    const current = points[landmarkIndex];
    const previous = previousPoseScreenLandmarks[landmarkIndex];

    if (!isVisiblePosePoint(current) || !isVisiblePosePoint(previous)) continue;

    const movement = distanceBetween(current, previous);

    if (movement < 2.4) continue;

    const count = Math.min(6, Math.ceil((movement / 16) * TRAIL_DENSITY * lerp(0.8, 2.8, trailProgress)));

    for (let fragmentIndex = 0; fragmentIndex < count && createdThisFrame < frameLimit; fragmentIndex += 1) {
      const t = Math.random();
      const x = lerp(previous.x, current.x, t);
      const y = lerp(previous.y, current.y, t);
      const lagX = (previous.x - current.x) * lerp(0.4, 1.25, Math.random());
      const lagY = (previous.y - current.y) * lerp(0.4, 1.25, Math.random());
      const outward = OUTSIDE_BODY_SPREAD * trailProgress;
      const typeRoll = Math.random();

      trailFragments.push({
        type: typeRoll > 0.52 ? "polygon" : "dust",
        x: x + (Math.random() - 0.5) * 5,
        y: y + (Math.random() - 0.5) * 5,
        vx: lagX + (Math.random() - 0.5) * outward,
        vy: lagY + (Math.random() - 0.5) * outward,
        size: lerp(1.2, 8.8, trailProgress) * MEDIUM_FRAGMENT_SCALE * lerp(0.55, 1.55, Math.random()),
        aspect: lerp(0.3, 1.35, Math.random()),
        sides: 3 + Math.floor(Math.random() * 4),
        rotation: Math.random() * Math.PI * 2,
        seed: Math.random() * 1000,
        tone: Math.random() < WHITE_SPECK_AMOUNT ? lerp(130, 190, Math.random()) : lerp(0, 86, Math.random()),
        alpha: lerp(0.08, 0.42, trailProgress),
        createdAt: now,
        life: TRAIL_LIFETIME * lerp(0.55, 1.35, Math.random())
      });

      createdThisFrame += 1;
    }
  }

  // Visible skeleton-line trails are intentionally not generated. Pose still
  // drives the particles and body deformation internally, but tracking lines
  // are hidden from the visitor.

  pruneTrailFragments();
}

function pruneTrailFragments() {
  const maxFragments = PARTICLE_TRAIL_AMOUNT * 6;

  while (trailFragments.length > maxFragments) {
    trailFragments.shift();
  }
}

function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// -----------------------------------------------------------------------------
// MASK SAMPLING HELPERS
// -----------------------------------------------------------------------------

function sampleMask(x, y) {
  if (!latestMaskPixels || !canvas.width || !canvas.height) return 0;

  const sampleX = clamp(Math.floor((x / canvas.width) * MASK_SAMPLE_SIZE), 0, MASK_SAMPLE_SIZE - 1);
  const sampleY = clamp(Math.floor((y / canvas.height) * MASK_SAMPLE_SIZE), 0, MASK_SAMPLE_SIZE - 1);
  const index = (sampleY * MASK_SAMPLE_SIZE + sampleX) * 4;

  return latestMaskPixels.data[index] / 255;
}

function isEdgePoint(x, y, distance) {
  if (!isEffectPointAllowed(x, y, MASK_CONFIDENCE_THRESHOLD, POSE_EFFECT_MARGIN + distance * 3)) return false;

  const center = sampleMask(x, y);

  if (center < MASK_CONFIDENCE_THRESHOLD) return false;

  const left = sampleMask(x - distance, y);
  const right = sampleMask(x + distance, y);
  const top = sampleMask(x, y - distance);
  const bottom = sampleMask(x, y + distance);

  return left < 0.22 || right < 0.22 || top < 0.22 || bottom < 0.22;
}

// -----------------------------------------------------------------------------
// TIME AND STAGE HELPERS
// -----------------------------------------------------------------------------

function getTransformationProgress(now) {
  if (manualStage) return MANUAL_STAGE_PROGRESS[manualStage];

  const elapsed = now - transformationStartTime;
  const duration = Math.max(1, FINAL_TRANSFORMATION_TIME - START_TRANSFORMATION_TIME);

  return clamp((elapsed - START_TRANSFORMATION_TIME) / duration, 0, 1);
}

function getTimedProgress(now, startTime) {
  if (manualStage) return latestProgress || MANUAL_STAGE_PROGRESS[manualStage];

  const elapsed = now - transformationStartTime;
  const duration = Math.max(1, FINAL_TRANSFORMATION_TIME - startTime);

  return clamp((elapsed - startTime) / duration, 0, 1);
}

function getStage(progress) {
  if (progress < 0.2) return 1;
  if (progress < 0.4) return 2;
  if (progress < 0.6) return 3;
  if (progress < 0.82) return 4;
  return 5;
}

// -----------------------------------------------------------------------------
// SMALL HELPERS
// -----------------------------------------------------------------------------

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function smoothstep(edge0, edge1, value) {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;

  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function grey(value, alpha = 1) {
  const safeValue = Math.round(clamp(value, 0, 255));
  const safeAlpha = clamp(alpha, 0, 1);
  return `rgba(${safeValue}, ${safeValue}, ${safeValue}, ${safeAlpha})`;
}

// Stable pseudo-random values. They create variation without harsh flicker.
function hash1(value, salt = 0) {
  const n = Math.sin(value * 127.1 + salt * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function hash2(x, y, salt = 0) {
  const n = Math.sin(x * 127.1 + y * 311.7 + salt * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function nextAnimationFrame() {
  return new Promise((resolve) => window.requestAnimationFrame(resolve));
}

function updateStatusText(stage, body) {
  if (!SHOW_STATUS_PANEL || !statePanel || !stageLabel) return;

  const shouldWait = isRunning && !bodyIsPresent;
  stageLabel.textContent = shouldWait ? "Waiting for presence..." : "";
  statePanel.classList.toggle("is-empty", !shouldWait);

  if (bodyLabel) {
    bodyLabel.hidden = true;
    bodyLabel.textContent = "";
  }
}

function friendlyError(error) {
  const message = String(error && error.message ? error.message : error);

  if (message.includes("Permission denied") || message.includes("NotAllowedError")) {
    return "Camera permission was not granted.";
  }

  if (message.includes("HTTPS") || message.includes("secure")) {
    return "Open this page through HTTPS or localhost.";
  }

  if (message.includes("segmentation")) {
    return "Body segmentation could not load. Check the internet connection.";
  }

  return "The camera could not be started.";
}
