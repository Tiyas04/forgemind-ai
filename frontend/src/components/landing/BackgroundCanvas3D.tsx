"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

interface Props {
  className?: string;
  nodeCount?: number;
  particleCount?: number;
  density?: number;
  maxDistance?: number;
}

interface NodeData {
  id: number;
  basePos: THREE.Vector3;
  currPos: THREE.Vector3;
  type: "core" | "hub" | "medium" | "small" | "warning" | "critical";
  clusterId: number;
  baseScale: number;
  phase: number;
  color: THREE.Color;
  connections: number[];
  pulseIntensity: number;
}

interface EdgeData {
  from: number;
  to: number;
  length: number;
}

interface SignalPacket {
  path: number[];
  pathStep: number;
  progress: number;
  speed: number;
  color: THREE.Color;
  size: number;
}

interface WaveHop {
  nodeId: number;
  remainingHops: number;
  delayFrames: number;
}

export default function BackgroundCanvas3D({
  className = "",
  nodeCount,
  particleCount,
  density,
  maxDistance,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const totalNodes = nodeCount || particleCount || density || 220;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.004);

    const camera = new THREE.PerspectiveCamera(
      50,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 100);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Bloom Post-Processing (Soft, High-End Glow)
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight),
      1.8,  // Bloom Strength
      0.7,  // Radius
      0.5   // Threshold
    );
    composer.addPass(bloomPass);

    // 3. Color Temperature Tokens
    const colorCore = new THREE.Color("#00F0FF");      // Central Hero Intelligence Core
    const colorAzure = new THREE.Color("#3B82F6");     // Hub Nodes
    const colorCyan = new THREE.Color("#06B6D4");      // Medium Nodes
    const colorLightCyan = new THREE.Color("#67E8F9"); // Small Nodes
    const colorWarning = new THREE.Color("#F59E0B");   // Telemetry Warning Nodes
    const colorCritical = new THREE.Color("#EF4444");  // Critical Alert Nodes
    const colorSignal = new THREE.Color("#FFFFFF");    // Electrical Signal Stream

    // 4. Cluster Galaxy Origins (Spread wider across viewport)
    const clusterNames = [
      "HERO_AI_CORE",
      "KNOWLEDGE_BASE // 0x4F",
      "MAINTENANCE_AI // 0x7E",
      "COMPLIANCE_AUDIT // 0x9A",
      "SAFETY_CHECK // 0x1B",
      "ASSET_MAP // 0x3C",
      "INSPECTION_LOG // 0x6D",
    ];

    const clusterOrigins = [
      new THREE.Vector3(0, 12, 10),      // Hero Core (Center behind title)
      new THREE.Vector3(-66, 34, -15),   // Knowledge Cluster (Spread wider left)
      new THREE.Vector3(66, 30, -10),    // Maintenance Cluster (Spread wider right)
      new THREE.Vector3(-60, -34, 5),    // Compliance Cluster (Spread lower left)
      new THREE.Vector3(60, -30, 0),     // Safety Cluster (Spread lower right)
      new THREE.Vector3(-26, -58, -20),  // Assets Cluster (Spread lower center left)
      new THREE.Vector3(26, -54, -15),   // Inspection Cluster (Spread lower center right)
    ];

    // 5. Construct Galaxy Cluster Node Graph
    const nodes: NodeData[] = [];

    // Hero Core Node (Node 0 - Scale 3.2)
    nodes.push({
      id: 0,
      basePos: clusterOrigins[0].clone(),
      currPos: clusterOrigins[0].clone(),
      type: "core",
      clusterId: 0,
      baseScale: 3.2,
      phase: 0,
      color: colorCore,
      connections: [],
      pulseIntensity: 1.0,
    });

    // 6 Cluster Hub Nodes (Nodes 1 to 6)
    for (let c = 1; c < clusterOrigins.length; c++) {
      nodes.push({
        id: c,
        basePos: clusterOrigins[c].clone(),
        currPos: clusterOrigins[c].clone(),
        type: "hub",
        clusterId: c,
        baseScale: 1.3,
        phase: Math.random() * Math.PI * 2,
        color: colorCore,
        connections: [],
        pulseIntensity: 0,
      });
    }

    // Local Cluster Nodes (~213 nodes)
    const nodesPerCluster = Math.floor((totalNodes - 7) / 6);
    let currentId = 7;

    for (let c = 0; c < clusterOrigins.length; c++) {
      const isCoreCluster = c === 0;
      const count = isCoreCluster ? 18 : nodesPerCluster;
      const radius = isCoreCluster ? 24 : 36;

      for (let k = 0; k < count; k++) {
        const origin = clusterOrigins[c];

        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.pow(Math.random(), 0.7) * radius;

        const basePos = new THREE.Vector3(
          origin.x + r * Math.sin(phi) * Math.cos(theta),
          origin.y + r * Math.sin(phi) * Math.sin(theta),
          origin.z + r * Math.cos(phi) * 0.7
        );

        let type: "medium" | "small" | "warning" | "critical" = "small";
        let baseScale = 0.4;

        const randVal = Math.random();
        if (randVal < 0.28) {
          type = "medium";
          baseScale = 0.75;
        } else if (randVal > 0.92) {
          type = "warning";
          baseScale = 0.6;
        } else if (randVal > 0.87) {
          type = "critical";
          baseScale = 0.65;
        }

        nodes.push({
          id: currentId,
          basePos: basePos.clone(),
          currPos: basePos.clone(),
          type,
          clusterId: c,
          baseScale,
          phase: Math.random() * Math.PI * 2,
          color: colorCore,
          connections: [],
          pulseIntensity: 0,
        });

        currentId++;
      }
    }

    // 6. Establish Cluster Topology Edges & High Local Density
    const edges: EdgeData[] = [];
    const edgeLookup: Map<string, number> = new Map();

    const addEdge = (from: number, to: number) => {
      const key1 = `${from}-${to}`;
      const key2 = `${to}-${from}`;
      if (edgeLookup.has(key1) || edgeLookup.has(key2)) return;

      nodes[from].connections.push(to);
      nodes[to].connections.push(from);
      const idx = edges.length;
      edges.push({ from, to, length: nodes[from].basePos.distanceTo(nodes[to].basePos) });
      edgeLookup.set(key1, idx);
      edgeLookup.set(key2, idx);
    };

    // Hero Core to all Hubs
    for (let c = 1; c <= 6; c++) {
      addEdge(0, c);
    }

    // Hubs Ring
    for (let c = 1; c <= 6; c++) {
      const nextC = c === 6 ? 1 : c + 1;
      addEdge(c, nextC);
    }

    // Intra-cluster Dense Topology (up to 6 connections inside clusters)
    for (let i = 0; i < nodes.length; i++) {
      const maxConn = nodes[i].type === "core" ? 12 : nodes[i].type === "hub" ? 8 : nodes[i].type === "medium" ? 6 : 4;
      let connCount = nodes[i].connections.length;

      const neighbors: { idx: number; dist: number }[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const dist = nodes[i].basePos.distanceTo(nodes[j].basePos);
        if (dist < 32) {
          neighbors.push({ idx: j, dist });
        }
      }

      neighbors.sort((a, b) => a.dist - b.dist);

      for (const n of neighbors) {
        if (connCount >= maxConn) break;
        if (!nodes[i].connections.includes(n.idx)) {
          addEdge(i, n.idx);
          connCount++;
        }
      }
    }

    // 7. Hero Core Multi-Glow Shells (3 Breathing Translucent Spheres)
    const heroGlowGroup = new THREE.Group();
    heroGlowGroup.position.copy(clusterOrigins[0]);

    const shellMat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending });
    const shellMat2 = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending });
    const shellMat3 = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending });

    const shell1 = new THREE.Mesh(new THREE.SphereGeometry(6.5, 32, 32), shellMat1);
    const shell2 = new THREE.Mesh(new THREE.SphereGeometry(9.0, 32, 32), shellMat2);
    const shell3 = new THREE.Mesh(new THREE.SphereGeometry(12.5, 32, 32), shellMat3);

    heroGlowGroup.add(shell1, shell2, shell3);
    scene.add(heroGlowGroup);

    // 8. Rotating Orbital Halo Rings around Hero Core
    const haloMat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.3, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
    const haloMat2 = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.2, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });

    const haloRing1 = new THREE.Mesh(new THREE.RingGeometry(14, 14.6, 64), haloMat1);
    const haloRing2 = new THREE.Mesh(new THREE.RingGeometry(18, 18.5, 64), haloMat2);

    haloRing1.rotation.x = Math.PI / 3;
    haloRing2.rotation.y = Math.PI / 4;

    heroGlowGroup.add(haloRing1, haloRing2);

    // 9. InstancedMesh Nodes
    const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.95,
    });

    const instancedMesh = new THREE.InstancedMesh(
      sphereGeometry,
      nodeMaterial,
      nodes.length
    );

    const dummy = new THREE.Object3D();
    for (let i = 0; i < nodes.length; i++) {
      dummy.position.copy(nodes[i].currPos);
      dummy.scale.setScalar(nodes[i].baseScale);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
      instancedMesh.setColorAt(i, nodes[i].color);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
    scene.add(instancedMesh);

    // 10. Edge LineSegments Mesh (Subtle 0.06 base opacity)
    const linePositions = new Float32Array(edges.length * 6);
    const lineColors = new Float32Array(edges.length * 6);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage)
    );
    lineGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage)
    );

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });

    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // 11. Contiguous Topological Signal Path Routing
    const generatePath = (startId: number, length = 5): number[] => {
      const path = [startId];
      let curr = startId;
      for (let k = 0; k < length; k++) {
        const conns = nodes[curr].connections;
        if (conns.length === 0) break;
        const nextNode = conns[Math.floor(Math.random() * conns.length)];
        path.push(nextNode);
        curr = nextNode;
      }
      return path;
    };

    const numSignals = 28;
    const signalPackets: SignalPacket[] = [];

    for (let i = 0; i < numSignals; i++) {
      const startNode = Math.floor(Math.random() * nodes.length);
      signalPackets.push({
        path: generatePath(startNode, 4 + Math.floor(Math.random() * 3)),
        pathStep: 0,
        progress: Math.random(),
        speed: 0.012 + Math.random() * 0.008,
        color: colorSignal,
        size: 0.6 + Math.random() * 0.25,
      });
    }

    const signalGeometry = new THREE.SphereGeometry(1, 12, 12);
    const signalMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });

    const signalInstancedMesh = new THREE.InstancedMesh(
      signalGeometry,
      signalMaterial,
      numSignals
    );
    scene.add(signalInstancedMesh);

    // 12. Ambient Background Dust Cloud (800+ Particles)
    const dustCount = 850;
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 260;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 220;
      dustPositions[i * 3 + 2] = -30 - Math.random() * 100;
    }

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));

    const dustMaterial = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.95,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });

    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustParticles);

    // 13. Dynamic HUD Industrial Blueprint Texture & Cluster Labels
    const hudCanvas = document.createElement("canvas");
    hudCanvas.width = 1024;
    hudCanvas.height = 1024;
    const ctx = hudCanvas.getContext("2d");

    if (ctx) {
      ctx.clearRect(0, 0, 1024, 1024);
      ctx.strokeStyle = "rgba(6, 182, 212, 0.04)";
      ctx.lineWidth = 1;

      // Draw HUD Grid
      for (let x = 0; x < 1024; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1024);
        ctx.stroke();
      }
      for (let y = 0; y < 1024; y += 64) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }

      // Draw Cluster HUD Labels & Crosshairs
      ctx.fillStyle = "rgba(6, 182, 212, 0.06)";
      ctx.font = "14px monospace";

      for (let c = 1; c < clusterOrigins.length; c++) {
        const origin = clusterOrigins[c];
        const px = ((origin.x + 120) / 240) * 1024;
        const py = ((-origin.y + 100) / 200) * 1024;

        // Crosshair
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillText(`+ ${clusterNames[c]}`, px + 16, py + 4);
      }
    }

    const hudTexture = new THREE.CanvasTexture(hudCanvas);
    const hudMaterial = new THREE.MeshBasicMaterial({
      map: hudTexture,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    const hudPlane = new THREE.Mesh(new THREE.PlaneGeometry(260, 200), hudMaterial);
    hudPlane.position.set(0, 0, -45);
    scene.add(hudPlane);

    // 14. Mouse Attractor & Camera Orbit Control
    let mouseX = 0;
    let mouseY = 0;
    let targetCamX = 0;
    let targetCamY = 0;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 26;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 26;
    };

    const handleScroll = () => {
      scrollY = window.scrollY * 0.015;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    // 15. Multi-Hop Wave Propagation Queue
    let waveQueue: WaveHop[] = [];
    let lastWaveTime = 0;

    const triggerMultiHopWave = (startNodeId: number) => {
      waveQueue.push({ nodeId: startNodeId, remainingHops: 2, delayFrames: 0 });
    };

    // 16. Main Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Hero Core Breathing & Halo Ring Rotation
      const heroBreathe = 1 + Math.sin(elapsedTime * 1.5) * 0.08;
      shell1.scale.setScalar(heroBreathe);
      shell2.scale.setScalar(heroBreathe * 1.05);
      shell3.scale.setScalar(heroBreathe * 1.1);

      haloRing1.rotation.z = elapsedTime * 0.15;
      haloRing2.rotation.z = -elapsedTime * 0.12;

      // Trigger multi-hop wave from Hero Core or Cluster Hubs every 3.0s
      if (elapsedTime - lastWaveTime > 3.0) {
        const startNode = Math.random() < 0.6 ? 0 : Math.floor(Math.random() * 7);
        triggerMultiHopWave(startNode);
        lastWaveTime = elapsedTime;
      }

      // Process Wave Queue Hops
      const nextWaveQueue: WaveHop[] = [];
      for (const hop of waveQueue) {
        if (hop.delayFrames > 0) {
          hop.delayFrames--;
          nextWaveQueue.push(hop);
          continue;
        }

        const node = nodes[hop.nodeId];
        if (node) {
          node.pulseIntensity = 1.0;

          if (hop.remainingHops > 0) {
            node.connections.forEach((connIdx) => {
              nextWaveQueue.push({
                nodeId: connIdx,
                remainingHops: hop.remainingHops - 1,
                delayFrames: 4,
              });
            });
          }
        }
      }
      waveQueue = nextWaveQueue;

      // Update Node Positions & Slow Galaxy Cluster Rotation
      const linePosAttr = lineGeometry.attributes.position as THREE.BufferAttribute;
      const lineColAttr = lineGeometry.attributes.color as THREE.BufferAttribute;
      const linePosArr = linePosAttr.array as Float32Array;
      const lineColArr = lineColAttr.array as Float32Array;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Slow cluster orbital rotation around origin
        const clusterOrigin = clusterOrigins[node.clusterId];
        const angle = elapsedTime * 0.08 + node.phase;
        const relX = node.basePos.x - clusterOrigin.x;
        const relY = node.basePos.y - clusterOrigin.y;

        const rotX = relX * Math.cos(angle * 0.05) - relY * Math.sin(angle * 0.05);
        const rotY = relX * Math.sin(angle * 0.05) + relY * Math.cos(angle * 0.05);

        node.currPos.x = clusterOrigin.x + rotX + Math.sin(elapsedTime * 0.4 + node.phase) * 1.8;
        node.currPos.y = clusterOrigin.y + rotY + Math.cos(elapsedTime * 0.35 + node.phase) * 1.8;
        node.currPos.z = node.basePos.z + Math.sin(elapsedTime * 0.2 + node.phase) * 1.2;

        // Wave distortion mouse ripple physics
        const distToMouse = Math.hypot(node.currPos.x - mouseX, node.currPos.y - mouseY);
        if (distToMouse < 30) {
          const factor = (1 - distToMouse / 30) * 4.0;
          node.currPos.x += (mouseX - node.currPos.x) * 0.025 * factor;
          node.currPos.y += (mouseY - node.currPos.y) * 0.025 * factor;
        }

        if (node.pulseIntensity > 0) {
          node.pulseIntensity -= 0.025;
        }

        const breathe = 1 + Math.sin(elapsedTime * 1.8 + node.phase) * 0.12;
        const pulseBoost = Math.max(0, node.pulseIntensity) * 0.35;
        const finalScale = node.baseScale * (breathe + pulseBoost);

        dummy.position.copy(node.currPos);
        dummy.scale.setScalar(finalScale);
        dummy.updateMatrix();

        instancedMesh.setMatrixAt(i, dummy.matrix);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;

      // Update Edges Positions & Dynamic Pulse Color Burst
      for (let e = 0; e < edges.length; e++) {
        const edge = edges[e];
        const n1 = nodes[edge.from];
        const n2 = nodes[edge.to];

        linePosArr[e * 6] = n1.currPos.x;
        linePosArr[e * 6 + 1] = n1.currPos.y;
        linePosArr[e * 6 + 2] = n1.currPos.z;

        linePosArr[e * 6 + 3] = n2.currPos.x;
        linePosArr[e * 6 + 4] = n2.currPos.y;
        linePosArr[e * 6 + 5] = n2.currPos.z;

        const edgePulse = Math.max(n1.pulseIntensity, n2.pulseIntensity);
        const colAlpha = 0.06 + edgePulse * 0.28;

        lineColArr[e * 6] = colorCyan.r * colAlpha;
        lineColArr[e * 6 + 1] = colorCyan.g * colAlpha;
        lineColArr[e * 6 + 2] = colorCyan.b * colAlpha;

        lineColArr[e * 6 + 3] = colorCyan.r * colAlpha;
        lineColArr[e * 6 + 4] = colorCyan.g * colAlpha;
        lineColArr[e * 6 + 5] = colorCyan.b * colAlpha;
      }
      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;

      // Update Contiguous Topological Signal Stream Packets
      for (let s = 0; s < signalPackets.length; s++) {
        const sig = signalPackets[s];
        sig.progress += sig.speed;

        if (sig.progress >= 1.0) {
          sig.progress = 0;
          sig.pathStep++;

          if (sig.pathStep >= sig.path.length - 1) {
            // Pick a new contiguous path
            const startNode = Math.floor(Math.random() * nodes.length);
            sig.path = generatePath(startNode, 4 + Math.floor(Math.random() * 3));
            sig.pathStep = 0;
          }
        }

        const fromNode = nodes[sig.path[sig.pathStep]];
        const toNode = nodes[sig.path[sig.pathStep + 1]] || fromNode;

        dummy.position.lerpVectors(fromNode.currPos, toNode.currPos, sig.progress);
        dummy.scale.setScalar(sig.size);
        dummy.updateMatrix();

        signalInstancedMesh.setMatrixAt(s, dummy.matrix);
      }
      signalInstancedMesh.instanceMatrix.needsUpdate = true;

      // Camera Damped Orbital Dwell & Mouse Offset
      const orbitAngle = elapsedTime * 0.04;
      targetCamX += (mouseX * 0.35 + Math.sin(orbitAngle) * 3.5 - targetCamX) * 0.03;
      targetCamY += (mouseY * 0.35 + Math.cos(orbitAngle) * 1.8 - targetCamY) * 0.03;

      camera.position.x = targetCamX;
      camera.position.y = targetCamY - scrollY;
      camera.lookAt(0, 10 - scrollY, 0);

      // Render scene through EffectComposer with UnrealBloomPass
      composer.render();
    };

    animate();

    // 17. Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      composer.setSize(width, height);
      bloomPass.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // 18. Memory Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }

      sphereGeometry.dispose();
      nodeMaterial.dispose();
      instancedMesh.dispose();

      shellMat1.dispose();
      shellMat2.dispose();
      shellMat3.dispose();
      haloMat1.dispose();
      haloMat2.dispose();

      lineGeometry.dispose();
      lineMaterial.dispose();

      signalGeometry.dispose();
      signalMaterial.dispose();
      signalInstancedMesh.dispose();

      dustGeometry.dispose();
      dustMaterial.dispose();
      hudTexture.dispose();
      hudMaterial.dispose();

      composer.dispose();
      renderer.dispose();
    };
  }, [nodeCount, particleCount, density, maxDistance]);

  return (
    <div
      ref={mountRef}
      className={`fixed inset-0 z-0 pointer-events-none ${className}`}
    />
  );
}
