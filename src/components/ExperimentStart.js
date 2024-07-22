const ExperimentStart = ({ onClickNext }) => {
    function handleOnClick() {
        console.log(`click from ExperimentStart`);
        onClickNext();
    }
    return (
        <div>
            <h1>ExperimentStart</h1>
            <button onClick={handleOnClick}>Next</button>
        </div>
    );
}
export default ExperimentStart;