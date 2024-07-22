import { useState, useEffect, useRef, useCallback } from 'react';
import { useApplicationContext } from '../contexts/ApplicationContext';
import { DrawingUtils, PoseLandmarker, GestureRecognizer
} from '@mediapipe/tasks-vision';


const GestureIndicator = ({gestResults}) => {
    const [gestures, setGestures] = useState({ Left: '?', Right: '?' });

    useEffect(() => {
        setGestures({ Left: '?', Right: '?' });  // Reset
        // Update
        for (const i in gestResults.handednesses) {
            const handness = gestResults.handednesses[i][0].categoryName;
            const gesture  = gestResults.gestures[i][0].categoryName;
            setGestures(prev => ({
                ...prev,
                [handness]: gesture
            }));
        }
    }, [gestResults]);

    return (
        <div>
            <h3>{`Left: ${gestures.Left} -- Right: ${gestures.Right}`}</h3>
        </div>
    );
}


const TaskTester = () => {
    // Access context of initialized MediaPipe task runners
    const { 
        poseLandmarker, 
        gestureRecognizer, 
        isTasksVisionReady,
        videoStream,
        //audioStream
    } = useApplicationContext();

    // Hooks for video, canvas and results
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [isCanvasReady, setIsCanvasReady] = useState(false);
    // if needed audioRef

    const setVideoRef = useCallback((node) => {
        videoRef.current = node;
        setIsVideoReady(!!node);
    }, []);

    const setCanvasRef = useCallback((node) => {
        canvasRef.current = node;
        setIsCanvasReady(!!node);
    }, []);

    const [results, setResults] = useState({
        poseResults: [],
        gestResults: [],
    });

    // Update: video stream -> video source
    useEffect(() => {
        if (videoStream && isVideoReady) {
            videoRef.current.srcObject = videoStream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play();
            }
        }
    }, [videoStream, isVideoReady]);

    // Init: starts data collecting loop
    useEffect(() => {
        if (!isTasksVisionReady || !isVideoReady) {
            return;
        }
        const video = videoRef.current;
        async function collectLandmarks() {
            if (video.readyState < 2) {
                return;
            }
            // Collecting results from landmarkers
            const poseOutput = await poseLandmarker.detectForVideo(
                video, performance.now()
            );
            const gestOutput = await gestureRecognizer.recognizeForVideo(
                video, performance.now()
            );
            // Store the updated results to this component
            setResults({
                poseResults: poseOutput.landmarks || [],
                gestResults: gestOutput || [],
            });
            window.requestAnimationFrame(collectLandmarks);
        };
        video.onloadeddata = collectLandmarks;
    // eslint-disable-next-line
    }, [isTasksVisionReady, isVideoReady]);

    // Draw landmarks on canvas
    function drawLandmarks(video, canvas, results) {
        const canvasCtx = canvas.getContext('2d');
        const drawingUtils = new DrawingUtils(canvasCtx);
        
        // Setup canvas dimensions and flip horizontally
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvasCtx.translate(canvas.width, 0);
        canvasCtx.scale(-1, 1);
        canvasCtx.save();

        // Clear canvas and draw video image on it
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Parameters for drawing landmarks
        const hand_links = GestureRecognizer.HAND_CONNECTIONS;
        const pose_links = PoseLandmarker.POSE_CONNECTIONS;
        const hand_style = { color: '#0000FF', lineWidth: 1, radius: 3 };
        const pose_style = { color: '#FF0000', lineWidth: 1, radius: 3 };
        const link_style = { color: '#FFFFFF', lineWidth: 2 }

        for (const landmarks of results.poseResults) {
            drawingUtils.drawConnectors(landmarks, pose_links, link_style);
            drawingUtils.drawLandmarks(landmarks, pose_style);
        }

        const handLandmarks = results?.gestResults?.landmarks ?? [];
        for (const landmarks of handLandmarks) {
            drawingUtils.drawConnectors(landmarks, hand_links, link_style);
            drawingUtils.drawLandmarks(landmarks, hand_style);
        }
        canvasCtx.restore();
    };

    // Update: draw landmarks on canvas and display hand gesture type
    useEffect(() => {
        if (isVideoReady && isCanvasReady) {
            drawLandmarks(videoRef.current, canvasRef.current, results);
        }
    }, [isVideoReady, isCanvasReady, results]);
    
    // Return this component
    if (!isTasksVisionReady) {
        return <div><h1>Preparing MediaPipe task runners...</h1></div>;
    }
    return (
        <div>
            <h1>MediaPipe Task Tester</h1>
            <video 
                ref={setVideoRef} 
                id='webcam' 
                style={{ display: 'none' }} 
                playsInline>
            </video>
            <canvas ref={setCanvasRef} id='output_canvas'></canvas>
            <GestureIndicator gestResults={results.gestResults} />
            <button onClick={() => { console.log('click save.'); }}>Save</button>
        </div>
    );
};
export default TaskTester;