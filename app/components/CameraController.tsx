"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "framer-motion";
import { useRef } from "react";
import * as THREE from "three";

export default function CameraController() {
  const { camera } = useThree();
  const { scrollYProgress } = useScroll();

  const target = useRef(new THREE.Vector3());

  useFrame(() => {
    const scroll = scrollYProgress.get();

    // scroll-based camera depth
    const z = 6 + scroll * 4;

    target.current.set(0, 0, z);

    camera.position.lerp(target.current, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}