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
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-b from-blue-100 to-blue-200">
      <h1 className="text-6xl font-bold mb-8">Start Stretching!</h1>
      <select
        className="mb-4"
        onChange={(event) => setSelectedBodyPart(event.target.value)}
        value={selectedBodyPart}
      >
        {bodyParts.map((bodyPart) => (
          <option key={bodyPart} value={bodyPart}>{bodyPart}</option>
        ))}
      </select>
      <button
        className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${isCapturing ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={startCapturing}
        disabled={isCapturing}
      >
        {isCapturing ? '⏺ Capturing...' : 'Start Capturing'}
      </button>
      <div style={{ position: 'relative', width: '640px', height: '480px' }} className="mt-8">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          id="video"
          width="640"
          height="480"
          style={{
            position: 'absolute',
            display: 'block',
            borderRadius: '16px', // Rounded corners
            border: '4px solid #000000', // Border color and width
          }}
        />
        <canvas ref={canvasRef} width="640" height="480" style={{ position: 'absolute' }} />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Range of Motion ({selectedBodyPart.replace('_', ' ')}):</h2>
        <div className="flex flex-col items-center">
          <p className="text-lg">
            <span className="font-semibold">X-axis:</span> {rangeOfMotion.x}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Y-axis:</span> {rangeOfMotion.y}
          </p>
        </div>
      </div>
      <footer className="py-8 text-center text-gray-500 text-sm">
        &copy; 2023 Suna. All rights reserved.
      </footer>
    </main>
  );
}