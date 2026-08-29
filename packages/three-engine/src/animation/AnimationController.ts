import * as THREE from "three";
import { AnimationProps } from "../schemas/scene.schema";

export class AnimationController {
  public static applyFrame(
    object: THREE.Object3D,
    animation: AnimationProps,
    elapsedTime: number,
    delta: number,
    basePosition: [number, number, number],
    baseScale: [number, number, number]
  ): void {
    const {
      type = "rotate",
      rotateSpeed = [0.1, 0.2, 0],
      floatAmplitude = 0,
      floatSpeed = 1,
      pulseSpeed = 0,
      pulseRange = [0.9, 1.1],
      speed = 0.5,
    } = animation;

    // 1. Rotation
    if (type === "rotate" || rotateSpeed[0] !== 0 || rotateSpeed[1] !== 0 || rotateSpeed[2] !== 0) {
      object.rotation.x += rotateSpeed[0] * delta;
      object.rotation.y += rotateSpeed[1] * delta;
      object.rotation.z += rotateSpeed[2] * delta;
    }

    // 2. Float (Sine oscillation on Y-axis)
    if (floatAmplitude > 0 || type === "float") {
      const amp = floatAmplitude || 0.2;
      object.position.y = basePosition[1] + Math.sin(elapsedTime * floatSpeed) * amp;
    }

    // 3. Pulse (Periodic scale expansion & contraction)
    if (pulseSpeed > 0 || type === "pulse") {
      const pSpeed = pulseSpeed || 1;
      const [minS, maxS] = pulseRange;
      const factor = minS + (Math.sin(elapsedTime * pSpeed) + 1) * 0.5 * (maxS - minS);
      object.scale.set(baseScale[0] * factor, baseScale[1] * factor, baseScale[2] * factor);
    }

    // 4. Orbit (Circular path around origin)
    if (type === "orbit") {
      const radius = Math.sqrt(basePosition[0] ** 2 + basePosition[2] ** 2) || 3;
      const angle = elapsedTime * speed;
      object.position.x = Math.cos(angle) * radius;
      object.position.z = Math.sin(angle) * radius;
    }

    // 5. Sway (Pendulum tilting on Z-axis)
    if (type === "sway") {
      object.rotation.z = Math.sin(elapsedTime * speed) * 0.15;
    }
  }
}
