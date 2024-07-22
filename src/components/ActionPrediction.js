const ActionPrediction = ({ onClickNext, currStep }) => {
    function handleOnClick() {
        console.log(`click ActionPrediction ${currStep}`);
        onClickNext();
    }
    return (
        <div>
            <h1>ActionPrediction</h1>
            <button onClick={handleOnClick}>Next</button>
        </div>
    );
}
export default ActionPrediction;