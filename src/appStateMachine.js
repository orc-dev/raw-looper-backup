import { GROUP_TYPE, CONJECTURE_LIST } from './constants/experimentMeta.js';
import MetadataManager from './components/MetadataManager.js';
import ExperimentStart from './components/ExperimentStart.js';
import Intro from './components/Intro.js';
import ReadConjecture from './components/ReadConjecuture.js';
import DirectedAction from './components/DirectedAction.js';
import ActionPrediction from './components/ActionPrediction.js';
import CtrlDescription from './components/CtrlDescription.js';
import SelfExplanation from './components/SelfExplanation.js';
import InitialAnswer from './components/InitialAnswer.js';
import Proof from './components/Proof.js';
import FinalAnswer from './components/FinalAnswer.js';
import ExperimentFinish from './components/ExperimentFinish.js';

/**
 * This two-layer fronzen object defines the main FSM of this application, 
 * shown as the following state diagram:
 * 
 *                 MetadataManager (App starts)
 *                        |
 *                 ExperimentStart
 *                        |
 *                      Intro
 *                        |
 *                 ReadConjecuture <───────────+
 *                /               \              \
 *         DirectedAction   ActionPrediction      \
 *              |         ╳         |              \
 *        CtrlDescription   SelfExplanation         |
 *                \               /                 | (loop)
 *                  InitialAnswer                   |
 *                        |                        /
 *                      Proof                     /
 *                        |                      /
 *                   FinalAnswer >─────────────+
 *                        |
 *                 ExperimentFinish (App exits)
 * 
 * Note:
 *   - The keys of first layer are the names of the component. The only 
 *     exception is `_INIT_`, a reserved key for accessing the entry 
 *     component of the app.
 *   - The value is an inner object with two keys: `self` and `next`.
 *   - `self` corresponds with a callback returning the current component.
 *   - `next` corresponds with a callback that returns the name of the 
 *     next component.
 */
const MAIN_FSM = Object.freeze({
    _INIT_: Object.freeze({
        self: () => MetadataManager,
        next: () => 'ExperimentStart',
    }),

    ExperimentStart: Object.freeze({
        self: () => ExperimentStart,
        next: () => 'Intro',
    }),

    Intro: Object.freeze({
        self: () => Intro,
        next: () => 'ReadConjecture',
    }),

    ReadConjecture: Object.freeze({
        self: () => ReadConjecture,
        next: (args) => {
            switch(args?.groupType) {
                case GROUP_TYPE.DA_CTRL:
                case GROUP_TYPE.DA_SE:
                    return 'DirectedAction';

                case GROUP_TYPE.AP_CTRL:
                case GROUP_TYPE.AP_SE:
                    return 'ActionPrediction';

                default:
                    throw new Error(`Invalid groupType: ${args?.groupType}`);
            };
        },
    }),

    DirectedAction: Object.freeze({
        self: () => DirectedAction,
        next: (args) => {
            switch(args?.groupType) {
                case GROUP_TYPE.DA_CTRL:
                case GROUP_TYPE.AP_CTRL:
                    return 'CtrlDescription';

                case GROUP_TYPE.DA_SE:
                case GROUP_TYPE.AP_SE:
                    return 'SelfExplanation';

                default:
                    throw new Error(`Invalid groupType: ${args?.groupType}`);
            };
        },
    }),

    ActionPrediction: Object.freeze({
        self: () => ActionPrediction,
        next: (args) => {
            switch(args?.groupType) {
                case GROUP_TYPE.DA_CTRL:
                case GROUP_TYPE.AP_CTRL:
                    return 'CtrlDescription';

                case GROUP_TYPE.DA_SE:
                case GROUP_TYPE.AP_SE:
                    return 'SelfExplanation';

                default:
                    throw new Error(`Invalid groupType: ${args?.groupType}`);
            };
        },
    }),

    CtrlDescription: Object.freeze({
        self: () => CtrlDescription,
        next: () => 'InitialAnswer',
    }),

    SelfExplanation: Object.freeze({
        self: () => SelfExplanation,
        next: () => 'InitialAnswer',
    }),

    InitialAnswer: Object.freeze({
        self: () => InitialAnswer,
        next: () => 'Proof',
    }),

    Proof: Object.freeze({
        self: () => Proof,
        next: () => 'FinalAnswer',
    }),

    FinalAnswer: Object.freeze({
        self: () => FinalAnswer,
        next: (args) => {
            const totalConjectures = Object.keys(CONJECTURE_LIST).length;
            const hasNextConjecture = args?.nextStep < totalConjectures;
            return hasNextConjecture ? 'ReadConjecture' : 'ExperimentFinish';
        },
    }),

    ExperimentFinish: Object.freeze({
        self: () => ExperimentFinish,
        next: () => null,
    }),
});

export default MAIN_FSM;
