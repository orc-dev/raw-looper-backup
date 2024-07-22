- init
    - `npx create-react-app .`
    - copy `.env` and `src` to new project
    - `npm install @mediapipe/tasks-vision`
    - `npm install --save-dev @babel/plugin-proposal-private-property-in-object`

- Version 0.2 video_storer
    - remove handlandmarker
    - use gestureRecognizer for both hand landmark detection and 
      hand gesture recognition

- Version 0.3 raw_looper
    - design the state machine for the app

    index.js
    App.js
    MetadataManager.js
    ExperimentStart.js   -- Record video: DA_CTRL_intro, DA_CTRP_c0
    Intro.js
    --------
    ReadConjecuture.js
    DirectedAction.js
    ActionPrediction.js
    SelfExplanation.js
    CtrlDescription.js
    InitialAnswer.js
    Proof.js
    FinalAnswer.js
    --------
    ExperimentFinish.js

