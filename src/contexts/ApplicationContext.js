/**
 * @file ApplicationContext.js
 * @brief Initializes and provides MediaPipe task runners for hand, pose, and 
 *        gesture recognition.
 * @created Jul.08 2024
 * @Update
 *      07/10/2024: 
 *          - use GestureRecognizer for handlandmark detection.
 *          - removed handlandmarker.
 *          - provide both video and audio streams. 
 *      07/13/2024:
 *          - change the file name to AllicationContext.js
 *          - add `groupTyp` and `groupId`
 */
import { createContext, useState, useEffect, useContext, useRef } from 'react';
import { FilesetResolver, PoseLandmarker, GestureRecognizer } from '@mediapipe/tasks-vision';
import { CONJECTURE_LIST } from '../constants/experimentMeta';
import { createAndShuffleArray } from '../utils/simpleTools';

// URLs for MediaPipe's related packages and models
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';
const MODELS_URL = 'https://storage.googleapis.com/mediapipe-models';
const TASK_KEY = {
    POSE: 'pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task',
    GESTURE: 'gesture_recognizer/gesture_recognizer/float16/latest/gesture_recognizer.task',
};

// Generate shuffled sequence
const TOTAL_CONJECTURES = Object.keys(CONJECTURE_LIST).length;
const shuffled_seq = createAndShuffleArray(TOTAL_CONJECTURES);
console.log(`Shuffled sequence: ${shuffled_seq}, from ApplicationContext.js`);

// Create an context for storing application-wide variables
const ApplicationContext = createContext();

export const ApplicationContextProvider = ({ children }) => {
    //console.log(`from: ApplicationContextProvider`);

    // Task runners, ready flag
    const [poseLandmarker, setPoseLandmarker] = useState(null);
    const [gestureRecognizer, setGestureRecognizer] = useState(null);
    const [isTasksVisionReady, setIsTasksVisionReady] = useState(false);
    // Video and audio stream
    const [videoStream, setVideoStream] = useState(null);
    const [audioStream, setAudioStream] = useState(null);
    // Experiment identifier
    const experimentId = useRef({
        groupTypeKey: undefined,
        groupId: undefined,
        value: undefined,
    });
    
    async function createTaskRunners() {
        console.log(`from createTaskRunners`);
        try {
            // Access the vision WASM files
            const vision = await FilesetResolver.forVisionTasks(WASM_URL);
            
            // Create Pose Landmarker
            const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `${MODELS_URL}/${TASK_KEY.POSE}`,
                    delegate: 'GPU'
                },
                runningMode: 'VIDEO',
            });
            setPoseLandmarker(poseLandmarker);

            // Create Gesture Recognizer
            const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `${MODELS_URL}/${TASK_KEY.GESTURE}`,
                    delegate: 'GPU'
                },
                runningMode: 'VIDEO',
                numHands: 2,
            });
            setGestureRecognizer(gestureRecognizer);

            // Set flag Ready
            setIsTasksVisionReady(true);
        } 
        catch (error) {
            console.error("Error creating MediaPipe task runners: ", error);
        }
    }
    useEffect(() => { 
        createTaskRunners();
    }, []);


    async function accessMediaStream() {
        console.log(`from accessMediaStream`);
        try {
            const stream = await navigator.mediaDevices.getUserMedia(
                { video: true, audio: true }
            );
            // Extract video and audio tracks
            const videoTrack = stream.getVideoTracks()[0];
            const audioTrack = stream.getAudioTracks()[0];

            // Create new media streams for video and audio
            const videoStream = new MediaStream([videoTrack]);
            const audioStream = new MediaStream([audioTrack]);

            setVideoStream(videoStream);
            setAudioStream(audioStream);
        } 
        catch (err) {
            console.error('Error accessing mediastream.', err);
        }
    }
    useEffect(() => {
        accessMediaStream();
    }, []);

    return (
        <ApplicationContext.Provider 
            value={{ 
                poseLandmarker, 
                gestureRecognizer, 
                isTasksVisionReady,
                videoStream,
                audioStream,
                experimentId,
                shuffled_seq,
            }}>
                {children}
        </ApplicationContext.Provider>
    );
};

/** Custom hook for accessing ApplicationContext */
export const useApplicationContext = () => {
    return useContext(ApplicationContext);
};