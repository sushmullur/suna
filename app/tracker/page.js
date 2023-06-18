"use client";

import { useEffect, useRef, useState } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';

let detector = null;

export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [angles, setAngles] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState('left_hip'); // Default to 'left_hip'
  const [rangeOfMotion, setRangeOfMotion] = useState(0);

  const bodyParts = ['left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow', 'left_wrist', 'right_wrist', 'left_hip', 'right_hip', 'left_knee', 'right_knee', 'left_ankle', 'right_ankle'];

  useEffect(() => {
    async function setupDetector() {
      await tf.ready(); // Wait for TensorFlow.js to be ready.

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

  // This function calculates the angle between three points
  const calculateAngle = (a, b, c) => {
    const ba = tf.sub(tf.tensor1d(a), tf.tensor1d(b));
    const bc = tf.sub(tf.tensor1d(c), tf.tensor1d(b));

    const cosineAngle = tf.div(
      tf.sum(tf.mul(ba, bc)),
      tf.mul(tf.norm(ba), tf.norm(bc))
    );
    return tf.acos(cosineAngle).mul(180 / Math.PI).dataSync()[0];
  };

  const startCapturing = () => {
    console.log('startCapturing called');
    setIsCapturing(true);
    setAngles([]);
    setTimeout(() => {
      console.log('isCapturing set to false');
      setIsCapturing(false);
    }, 15000); // Stop capturing after 15 seconds
  };

  useEffect(() => {
    console.log('isCapturing changed', isCapturing);
    if (!isCapturing && angles.length > 0) {
      const rangeOfMotion = Math.max(...angles) - Math.min(...angles);
      setRangeOfMotion(rangeOfMotion);
    }
  }, [isCapturing]);

  const predict = async () => {
    if (videoRef.current && detector) {
      const poses = await detector.estimatePoses(videoRef.current);

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        drawPose(poses, ctx);
      }

      if (isCapturing) {
        console.log('is Capturing ');
        // Get the keypoints for the selected joint and its neighbors
        const keypoints = poses[0]?.keypoints;
        const jointIndex = bodyParts.indexOf(selectedBodyPart);

        console.log('Hello?');
        if (jointIndex > 0 && jointIndex < bodyParts.length - 1) {
          const a = keypoints.find((kp) => kp.name === bodyParts[jointIndex - 1]);
          const b = keypoints.find((kp) => kp.name === bodyParts[jointIndex]);
          const c = keypoints.find((kp) => kp.name === bodyParts[jointIndex + 1]);

          if (a && b && c) {
            const angle = calculateAngle([a.x, a.y], [b.x, b.y], [c.x, c.y]);
            setAngles((prev) => [...prev, angle]);
          }
        }
      }

      requestAnimationFrame(predict);
    }
  };

  // The remaining code is kept as is...
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
        ['right_knee', 'right_ankle'],
      ];

      for (const keypoint of keypoints) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      }

      for (const [start, end] of connections) {
        const startKeypoint = keypoints.find((kp) => kp.name === start);
        const endKeypoint = keypoints.find((kp) => kp.name === end);

        if (startKeypoint && endKeypoint) {
          ctx.beginPath();
          ctx.moveTo(startKeypoint.x, startKeypoint.y);
          ctx.lineTo(endKeypoint.x, endKeypoint.y);
          ctx.strokeStyle = 'blue';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw the name of the connection being captured
          if (start === 'left_hip' && isCapturing) {
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText('Capturing: Left Hip', startKeypoint.x, startKeypoint.y - 20);
          }
        }
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-b from-blue-100 to-blue-200">
      <h1 className="text-4xl font-bold mb-8">Suna</h1>
      <div className="flex flex-col items-center space-y-4">
        <select
          className="px-4 py-2 border border-gray-300 rounded-md"
          onChange={(event) => setSelectedBodyPart(event.target.value)}
          value={selectedBodyPart}
        >
          {bodyParts.map((bodyPart) => (
            <option key={bodyPart} value={bodyPart}>
              {bodyPart}
            </option>
          ))}
        </select>
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          onClick={startCapturing}
        >
          {isCapturing ? '⏺ Capturing...' : 'Start Capturing'}
        </button>
      </div>
      <div style={{ position: 'relative', width: '640px', height: '480px' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          id="video"
          width="640"
          height="480"
          style={{ position: 'absolute', display: 'block' }}
        />
        <canvas ref={canvasRef} width="640" height="480" style={{ position: 'absolute' }} />
      </div>
      {/* <div className="mt-4">
        <h2 className="text-2xl font-bold">Range of Motion ({selectedBodyPart.replace('_', ' ')}):</h2>
        <p className="mb-2">X-axis: {rangeOfMotion.x}</p>
        <p className="mb-2">Y-axis: {rangeOfMotion.y}</p>
      </div> */}
    </main>
  );
}
