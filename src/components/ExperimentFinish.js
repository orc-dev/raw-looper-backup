const ExperimentFinish = ({ onClickNext, currStep }) => {
    console.log(`Congratulation! Experiment finishes at ${ new Date().toUTCString()}, step: ${currStep}`);
    return (
        <div>
            <h1>ExperimentFinish</h1>
        </div>
    );
}
export default ExperimentFinish;