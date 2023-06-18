"use client";

import { useEffect, useRef, useState } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';

let detector = null;


export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState('left_hip'); // Default to 'left_hip'
  const [rangeOfMotion, setRangeOfMotion] = useState({ x: 0, y: 0 });

  const bodyParts = ['left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow', 'left_wrist', 'right_wrist', 'left_hip', 'right_hip', 'left_knee', 'right_knee', 'left_ankle', 'right_ankle'];

  useEffect(() => {
    async function setupDetector() {
      await tf.ready();  // Wait for TensorFlow.js to be ready.
      if (!detector) {
        detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
      }
    
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: 'user',
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener('loadeddata', predict);
        }
      }
    }

    setupDetector();
  }, []);

  async function startCapturing() {
    console.log("startCapturing called");
    setIsCapturing(true);
  

    let rangeOfMotionResponse = await fetch('http://localhost:8000/rangeOfMotion');
    const rangeOfMotion = await rangeOfMotionResponse.json();

    
    setTimeout(() => {
      setIsCapturing(false)

      setRangeOfMotion({ x: rangeOfMotion.rangeOfMotion, y: rangeOfMotion.rangeOfMotion });
    }, 15000); // Stop capturing after 15 seconds
  }

  const predict = async () => {
    if (videoRef.current && detector) {
      const poses = await detector.estimatePoses(videoRef.current);
      
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        drawPose(poses, ctx);
      }
      
      requestAnimationFrame(predict);
    } 
  }

  const drawPose = (poses, ctx) => {
    for (const pose of poses) {
      const keypoints = pose.keypoints;
      const connections = [
        ['left_shoulder', 'left_elbow'],
        ['left_elbow', 'left_wrist'],
        ['right_shoulder', 'right_elbow'],
        ['right_elbow', 'right_wrist'],
        ['left_hip', 'right_hip'],
        ['left_shoulder', 'right_shoulder'],
        ['left_hip', 'left_knee'],
        ['left_knee', 'left_ankle'],
        ['right_hip', 'right_knee'],
        ['right_knee', 'right_ankle']
      ];

      for (const keypoint of keypoints) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      }

      for (const [start, end] of connections) {
        const startKeypoint = keypoints.find(kp => kp.name === start);
        const endKeypoint = keypoints.find(kp => kp.name === end);

        if (startKeypoint && endKeypoint) {
          ctx.beginPath();
          ctx.moveTo(startKeypoint.x, startKeypoint.y);
          ctx.lineTo(endKeypoint.x, endKeypoint.y);
          ctx.strokeStyle = 'blue';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Suna</h1>
      <select onChange={(event) => setSelectedBodyPart(event.target.value)} value={selectedBodyPart}>
        {bodyParts.map((bodyPart) => (
          <option key={bodyPart} value={bodyPart}>{bodyPart}</option>
        ))}
      </select>
      <button onClick={startCapturing}>{isCapturing ? '⏺ Capturing...' : 'Start Capturing'}</button>
      <div style={{ position: 'relative', width: '640px', height: '480px' }}>
        <video ref={videoRef} autoPlay playsInline muted id="video" width="640" height="480" style={{ position: 'absolute', display: 'block' }} />
        <canvas ref={canvasRef} width="640" height="480" style={{ position: 'absolute' }} />
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-bold">Range of Motion ({selectedBodyPart.replace('_', ' ')}):</h2>
        <p>X-axis: {rangeOfMotion.x}</p>
        <p>Y-axis: {rangeOfMotion.y}</p>
      </div>
    </main>
  );
}
