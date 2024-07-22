import { useState, useRef } from 'react';
import MAIN_FSM from './appStateMachine.js';
import { useApplicationContext } from './contexts/ApplicationContext.js';
import TaskTester from './components/TaskTester.js';
import { GROUP_TYPE } from './constants/experimentMeta.js';
import './App.css';


const App = () => {
    const { experimentId } = useApplicationContext();
    //console.log(`Shuffled sequence: ${shuffled_seq}`);

    const currStageKey = useRef('_INIT_');
    const [CurrStage, setCurrStage] = useState(MAIN_FSM._INIT_.self);
    const [step, setStep] = useState(0);

    
    const handleClickNext = () => {
        const args = {
            groupType: GROUP_TYPE[experimentId.current.groupTypeKey],
            nextStep: step + 1,
        };
        const nextStageKey = MAIN_FSM[currStageKey.current].next(args);
        if (nextStageKey === null) {
            console.log(`Experiment terminates.`);
            return;
        }
        setCurrStage(MAIN_FSM[nextStageKey].self);
        if (currStageKey.current === 'FinalAnswer') {
            setStep(i => i + 1);
        }
        currStageKey.current = nextStageKey;
    }

    return (
        <div>
            <CurrStage onClickNext={handleClickNext} currStep={step} />
            {/* <TaskTester /> */}
        </div>
    );
};
export default App;