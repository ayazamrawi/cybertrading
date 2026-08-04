import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import getStarfield from "../../Three/getStarfield";
import { getFresnelMat } from "../../Three/getFresnelMat";
import Style from './EarthScene.module.css';

export default function EarthScene() {
  const mountRef = useRef(null);
  const frameIdRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 3, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    mount.appendChild(renderer.domElement);

    // 🌍 Earth
    const earthGroup = new THREE.Group();
    earthGroup.rotation.y = -23.4 * Math.PI / 180;
    scene.add(earthGroup);

    const loader = new THREE.TextureLoader();
    const geometry = new THREE.IcosahedronGeometry(1, 12);

    const earthMat = new THREE.MeshPhongMaterial({
      map: loader.load("/Textures/00_earthmap1k.jpg"),
      bumpMap: loader.load("/Textures/01_earthbump1k.jpg"),
      bumpScale: 0.04,
      specularMap: loader.load("/Textures/02_earthspec1k.jpg"),
    });

    const earthMesh = new THREE.Mesh(geometry, earthMat);
    earthGroup.add(earthMesh);

    const lightsMat = new THREE.MeshBasicMaterial({
      map: loader.load("/Textures/new.jpg"),
      blending: THREE.AdditiveBlending,
    });

    const lightsMesh = new THREE.Mesh(geometry, lightsMat);
    earthGroup.add(lightsMesh);

    const glowMesh = new THREE.Mesh(geometry, getFresnelMat());
    glowMesh.scale.setScalar(1.045);
    earthGroup.add(glowMesh);

    const stars = getStarfield({ numStars: 2000 });
    scene.add(stars);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.update();

    const animate = () => {
      earthMesh.rotation.y += 0.002;
      lightsMesh.rotation.y += 0.002;
      glowMesh.rotation.y += 0.002;
      stars.rotation.y -= 0.0002;

      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }

      geometry.dispose();
      earthMat.dispose();
      lightsMat.dispose();
      glowMesh.material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
    className={Style.earthScene}
      ref={mountRef}
    />
  );
}
