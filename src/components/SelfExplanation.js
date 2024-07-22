const SelfExplanation = ({ onClickNext, currStep }) => {
    function handleOnClick() {
        console.log(`click: SelfExplanation ${currStep}`);
        onClickNext();
    }
    return (
        <div>
            <h1>SelfExplanation</h1>
            <button onClick={handleOnClick}>Next</button>
        </div>
    );
}
export default SelfExplanation;